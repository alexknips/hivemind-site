#!/usr/bin/env python3
"""Turn a `tmux capture-pane -e -p` capture into an HTML page that looks like the terminal.

Usage: ansi2html.py <capture.ansi> <out.html> [--cols 64]

Trims only chrome, never the conversation: the Claude Code footer (mode and effort hints),
everything below the turn's "done" line (the input box), trailing blank lines and runs of
more than one blank line. Text and colours are left as captured.
"""
import html
import re
import sys

COLS = 64
DEFAULT_FG = "#d7d7db"
DEFAULT_BG = "#17181c"
BASIC = [
    "#000000", "#cd3131", "#0dbc79", "#e5e510", "#2472c8", "#bc3fbc", "#11a8cd", "#e5e5e5",
    "#666666", "#f14c4c", "#23d18b", "#f5f543", "#3b8eea", "#d670d6", "#29b8db", "#ffffff",
]


def xterm256(n):
    if n < 16:
        return BASIC[n]
    if n < 232:
        n -= 16
        steps = [0, 95, 135, 175, 215, 255]
        return "#%02x%02x%02x" % (steps[n // 36], steps[(n // 6) % 6], steps[n % 6])
    v = 8 + (n - 232) * 10
    return "#%02x%02x%02x" % (v, v, v)


class State:
    def __init__(self):
        self.reset()

    def reset(self):
        self.fg = None
        self.bg = None
        self.bold = self.dim = self.italic = self.underline = self.inverse = False

    def apply(self, params):
        p = [int(x) if x else 0 for x in params.split(";")] if params else [0]
        i = 0
        while i < len(p):
            c = p[i]
            if c == 0:
                self.reset()
            elif c == 1:
                self.bold = True
            elif c == 2:
                self.dim = True
            elif c == 3:
                self.italic = True
            elif c == 4:
                self.underline = True
            elif c == 7:
                self.inverse = True
            elif c == 22:
                self.bold = self.dim = False
            elif c == 23:
                self.italic = False
            elif c == 24:
                self.underline = False
            elif c == 27:
                self.inverse = False
            elif 30 <= c <= 37:
                self.fg = BASIC[c - 30]
            elif 90 <= c <= 97:
                self.fg = BASIC[c - 90 + 8]
            elif 40 <= c <= 47:
                self.bg = BASIC[c - 40]
            elif 100 <= c <= 107:
                self.bg = BASIC[c - 100 + 8]
            elif c == 39:
                self.fg = None
            elif c == 49:
                self.bg = None
            elif c in (38, 48) and i + 1 < len(p):
                if p[i + 1] == 2 and i + 4 < len(p):
                    col = "#%02x%02x%02x" % (p[i + 2], p[i + 3], p[i + 4])
                    i += 4
                elif p[i + 1] == 5 and i + 2 < len(p):
                    col = xterm256(p[i + 2])
                    i += 2
                else:
                    col = None
                if c == 38:
                    self.fg = col
                else:
                    self.bg = col
            i += 1

    def style(self):
        fg, bg = self.fg, self.bg
        if self.inverse:
            fg, bg = (bg or DEFAULT_BG), (fg or DEFAULT_FG)
        s = []
        if fg:
            s.append("color:" + fg)
        if bg:
            # inline-block at full line height, so stacked rows of background join up like cells
            s.append("background:" + bg + ";display:inline-block;height:1.38em;vertical-align:top")
        if self.bold:
            s.append("font-weight:700")
        if self.dim:
            s.append("opacity:.6")
        if self.italic:
            s.append("font-style:italic")
        if self.underline:
            s.append("text-decoration:underline")
        return ";".join(s)


SGR = re.compile(r"\x1b\[([0-9;]*)m")
DONE = re.compile(r"for \d+(m \d+)?s · done")
FOOTER = re.compile(r"(auto mode on|shift\+tab to cycle|/effort|esc to interrupt)")


def convert(text, cols):
    lines = text.split("\n")
    # drop the footer
    plain = [SGR.sub("", l) for l in lines]
    keep = [i for i, l in enumerate(plain) if not FOOTER.search(l)]
    lines = [lines[i] for i in keep]
    plain = [plain[i] for i in keep]
    # end the frame at the turn's "done" line: below it is only the input box, which may hold
    # a greyed-out suggestion that would read as typed text
    done = [i for i, l in enumerate(plain) if DONE.search(l)]
    if done:
        lines, plain = lines[: done[-1] + 1], plain[: done[-1] + 1]
    while plain and not plain[-1].strip():
        lines.pop()
        plain.pop()
    st = State()
    out = []
    prev_blank = False
    for raw, pl in zip(lines, plain):
        blank = not pl.strip()
        if blank and prev_blank:
            # still apply its SGR changes, but do not emit a second blank line
            for m in SGR.finditer(raw):
                st.apply(m.group(1))
            continue
        prev_blank = blank
        parts = []
        width = 0
        pos = 0
        for m in SGR.finditer(raw):
            seg = raw[pos:m.start()]
            if seg:
                parts.append((st.style(), seg))
                width += len(seg)
            st.apply(m.group(1))
            pos = m.end()
        seg = raw[pos:]
        if seg:
            parts.append((st.style(), seg))
            width += len(seg)
        if st.bg and width < cols:
            # the terminal fills the rest of the row with the active background
            parts.append((st.style(), " " * (cols - width)))
        row = "".join(
            '<span style="%s">%s</span>' % (s, html.escape(t)) if s else html.escape(t)
            for s, t in parts
        )
        out.append(row)
    return "\n".join(out)


def main():
    src, dst = sys.argv[1], sys.argv[2]
    cols = int(sys.argv[sys.argv.index("--cols") + 1]) if "--cols" in sys.argv else COLS
    body = convert(open(src, encoding="utf-8").read(), cols)
    page = f"""<!doctype html><html><head><meta charset="utf-8"><style>
html,body{{margin:0;background:{DEFAULT_BG}}}
#term{{display:inline-block;background:{DEFAULT_BG};color:{DEFAULT_FG};padding:18px 20px 20px;
  font:14px/1.38 "DejaVu Sans Mono",monospace;white-space:pre;font-variant-ligatures:none}}
</style></head><body><div id="term">{body}</div></body></html>"""
    open(dst, "w", encoding="utf-8").write(page)


if __name__ == "__main__":
    main()
