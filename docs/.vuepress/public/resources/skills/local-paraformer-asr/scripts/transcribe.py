#!/usr/bin/env python3
"""Transcribe local audio with a Paraformer ONNX model and timestamped chunks."""

import argparse
from pathlib import Path
import shutil
import subprocess
import tempfile

import sherpa_onnx
import soundfile as sf


def parse_args():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("audio", type=Path, help="Input audio file")
    parser.add_argument("output", type=Path, help="Output UTF-8 text file")
    parser.add_argument("--model-dir", type=Path, required=True, help="Paraformer ONNX model directory")
    parser.add_argument("--chunk-seconds", type=int, default=60, help="Chunk duration for long audio")
    return parser.parse_args()


def timestamp(seconds: int) -> str:
    return f"{seconds // 60:02d}:{seconds % 60:02d}"


def main():
    args = parse_args()
    model = args.model_dir / "model.int8.onnx"
    tokens = args.model_dir / "tokens.txt"
    if not args.audio.is_file():
        raise SystemExit(f"Audio file not found: {args.audio}")
    if not model.is_file() or not tokens.is_file():
        raise SystemExit(f"Invalid Paraformer model directory: {args.model_dir}")
    if args.chunk_seconds <= 0:
        raise SystemExit("--chunk-seconds must be positive")
    if not shutil.which("ffmpeg"):
        raise SystemExit("ffmpeg is required but was not found on PATH")

    with tempfile.TemporaryDirectory(prefix="paraformer-asr-") as temp_dir:
        wav = Path(temp_dir) / "audio.wav"
        subprocess.run(
            ["ffmpeg", "-nostdin", "-y", "-i", str(args.audio), "-ac", "1", "-ar", "16000", str(wav)],
            check=True,
            stdout=subprocess.DEVNULL,
            stderr=subprocess.PIPE,
            text=True,
        )
        samples, sample_rate = sf.read(wav, dtype="float32", always_2d=True)

    samples = samples.mean(axis=1)
    recognizer = sherpa_onnx.OfflineRecognizer.from_paraformer(
        paraformer=str(model),
        tokens=str(tokens),
        num_threads=4,
        sample_rate=sample_rate,
        feature_dim=80,
    )
    chunk_size = args.chunk_seconds * sample_rate
    lines = []
    for start in range(0, len(samples), chunk_size):
        stream = recognizer.create_stream()
        stream.accept_waveform(sample_rate, samples[start : start + chunk_size])
        recognizer.decode_stream(stream)
        text = stream.result.text.strip()
        if text:
            lines.append(f"[{timestamp(start // sample_rate)}] {text}")

    args.output.parent.mkdir(parents=True, exist_ok=True)
    args.output.write_text("\n".join(lines) + ("\n" if lines else ""), encoding="utf-8")
    print(f"Wrote {len(lines)} timestamped chunks to {args.output}")


if __name__ == "__main__":
    main()
