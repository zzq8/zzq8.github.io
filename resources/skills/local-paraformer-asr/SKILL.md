---
name: local-paraformer-asr
description: "Transcribe local audio with an installed Paraformer ONNX model, producing timestamped text and, for interview recordings, a Q&A Markdown summary. Use for local m4a, mp3, wav, or aac recordings that must not be uploaded."
---

# Local Paraformer ASR

Use this skill to transcribe a user-provided local audio file with a locally available Paraformer ONNX model. Keep the audio and output local unless the user explicitly asks otherwise.

## Before transcribing

- Obtain filesystem permission for an audio file outside the workspace.
- Locate the model before installing or downloading anything. On this Mac, Input0 stores models under
  `~/Library/Application Support/com.input0.app/models/`; common choices are `paraformer-zh` and
  `paraformer-trilingual`. A valid model directory contains `model.int8.onnx` and `tokens.txt`.
- Prefer `paraformer-zh` for Mandarin-only audio; use the trilingual model when Cantonese or English is expected.
- Check for `ffmpeg` and a Python environment that has `sherpa-onnx` and `soundfile`. If absent, explain that only
  the local Python dependency needs installing; do not download a new model unless the user asks.

## Run

Use [scripts/transcribe.py](scripts/transcribe.py). It converts the input to temporary mono 16 kHz WAV, processes
long audio in 60-second chunks, and writes one timestamped paragraph per chunk.

```bash
python scripts/transcribe.py \
  "/absolute/path/recording.m4a" \
  "/absolute/path/output.txt" \
  --model-dir "$HOME/Library/Application Support/com.input0.app/models/paraformer-zh"
```

For a missing runtime, create an isolated workspace virtual environment and install `sherpa-onnx` and `soundfile`.
Do not modify the system Python. For example:

```bash
python3 -m venv work/asr-venv
work/asr-venv/bin/pip install sherpa-onnx soundfile
work/asr-venv/bin/python /path/to/transcribe.py INPUT OUTPUT --model-dir MODEL_DIR
```

## Interview-recording deliverables

When the source is an interview or the user asks for an interview summary, produce **two files** by default:

1. A timestamped raw-ASR `.txt` file.
2. A `-面试问答总结.md` file that contains a YAML code block. Each item uses `q` for a recognizable interviewer question
   and `a` for the candidate's answer summary.

Derive the second file only from the transcript. Preserve uncertainty when ASR is unclear, omit non-substantive greetings
and closing arrangements, and add a short ASR-quality note if technical terms or any substantial segment are unreliable.
Do not invent questions, facts, speaker labels, or missing answers. For non-interview recordings, create only the transcript
unless the user explicitly asks for another derived artifact.

## Deliverable and checks

- Save the user-facing transcript in the requested output location. For projectless tasks, place it under `outputs/`.
- Verify the output is non-empty and inspect its beginning and end before reporting completion.
- For interview recordings, verify that both files exist, inspect the beginning and end of the transcript, and link both files.
- State that the transcript is raw ASR; do not claim punctuation, speaker labels, or technical terms are fully accurate.
