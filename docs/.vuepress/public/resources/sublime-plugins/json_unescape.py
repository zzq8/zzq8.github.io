# 文件路径：
#   Packages/User/json_unescape.py

import sublime
import sublime_plugin
import codecs
import json
import re


class JsonUnescapeCommand(sublime_plugin.TextCommand):
    """
    将所选文本从 \\uXXXX 反转义，并尝试：
    1) 修复 latin-1/utf-8 编码错位
    2) 把合法 JSON pretty-print
    如果没有选区，则默认作用于整个文件。
    """
    def run(self, edit):
        view = self.view
        sels = view.sel()

        # 如果没有任何选区，就把全文作为目标
        if all(r.empty() for r in sels):
            sels = [sublime.Region(0, view.size())]

        # 反向遍历，避免替换导致后续 Region 位移
        for region in reversed(sels):
            raw = view.substr(region)

            # 去掉首尾引号（如果整段都被同一种引号包裹）
            if (raw.startswith('"') and raw.endswith('"')) or \
               (raw.startswith("'") and raw.endswith("'")):
                raw_inner = raw[1:-1]
            else:
                raw_inner = raw

            # 1) unicode_escape 解码
            try:
                text = codecs.decode(raw_inner, 'unicode_escape')
            except Exception:
                text = raw_inner

            # 2) 修复“乱码”（latin1→utf8 的常见错位）
            try:
                text = text.encode('latin1').decode('utf-8')
            except Exception:
                pass

            # 3) 若是 JSON，再格式化
            try:
                obj = json.loads(text)
                text = json.dumps(obj, ensure_ascii=False, indent=4)
            except Exception:
                pass

            # 写回
            view.replace(edit, region, text)