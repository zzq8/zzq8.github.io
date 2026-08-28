import sublime_plugin
import re


class EscapeString(sublime_plugin.TextCommand):
    """转义字符串中的特殊字符，合并为单行并添加双引号"""

    ESCAPE_MAP = {
        '\\': '\\\\',
        '"': '\\"',
        '\t': '\\t',
        '\n': '\\n',
    }

    def run(self, edit):
        for region in self.view.sel():
            if not region.empty():
                text = self.view.substr(region)
                escaped = self._escape_and_quote(text)
                self.view.replace(edit, region, escaped)

    def _escape_and_quote(self, text):
        """转义特殊字符并用双引号包裹"""
        # 统一换行符
        text = text.replace('\r\n', '\n').replace('\r', '\n')

        # 转义特殊字符
        escaped = re.sub(
            r'[\\"\t\n]',
            lambda m: self.ESCAPE_MAP[m.group()],
            text
        )

        # return f'"{escaped}"'
        return escaped