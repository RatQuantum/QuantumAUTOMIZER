"""Tamil Day 3 reel: reuses tools/build_composition.py with one continuous Tamil narration, Tamil
subtitles, hook title and CTA. Run from reels/day3-ta:  python3 tools/build_ta.py

The voice is one ElevenLabs take (eleven_v4, voice "Aarumugam"), assets/vo/ta-full.wav. Its word timings
come from ElevenLabs Scribe (assets/vo/words.json); every scene cut sits in the pause between two lines.
"""
import json
import sys

sys.path.insert(0, "tools")
import build_composition as bc  # noqa: E402

VO_START = 0.4  # the narration starts 0.4s in
bc.SCENES = [
    ("hook", "05-alankaram.png", 0.0, 3.65, (-435, 0, 1.75), (-490, -88, 1.85)),  # close on Kanha's face, below the title
    ("town", "01-night-temple.png", 3.65, 3.55, (-54, 0, 1.1), (-81, -288, 1.15)),  # tilts down from the moon to the lit door
    ("bell", "02-bell.png", 7.2, 2.8, (-108, -150, 1.2), (-54, -96, 1.1)),
    ("suprabhatam", "03-suprabhatam.png", 10.0, 3.1, (-27, -48, 1.05), (-260, -260, 1.25)),  # pushes in on the priest
    ("abhishekam", "04-abhishekam.png", 13.1, 3.0, (-300, -330, 1.3), (-160, -160, 1.15)),
    ("alankaram", "05-alankaram.png", 16.1, 3.15, (-108, -150, 1.12), (-36, -48, 1.04)),
    ("aarti", "06-aarti.png", 19.25, 2.55, (-54, -96, 1.1), (-120, -180, 1.18)),
    ("doors", "07-doors-open.png", 21.8, 5.9, (-36, -48, 1.04), (-216, -330, 1.3)),
    ("cta", "08-dawn.png", 27.7, 6.8, (0, 0, 1.0), (-54, -96, 1.08)),
]
bc.VO = [("ta-full", VO_START)]
bc.SFX = [("bell-open", "temple-bell.mp3", 0.0, 2.0, 0.3, 7), ("bell-once", "temple-bell.mp3", 7.2, 2.0, 0.55, 8),
          ("sparkle-alankaram", "sparkle.mp3", 15.9, 1.4, 0.22, 9), ("whoosh-doors", "whoosh-short.mp3", 21.55, 0.55, 0.28, 8),
          ("chime-doors", "chime.mp3", 21.75, 2.1, 0.3, 7), ("bell-cta", "temple-bell.mp3", 27.6, 2.0, 0.4, 8)]
bc.LEAKS = [("leak1", 3.05), ("leak2", 12.5), ("leak3", 15.5), ("leak4", 21.2), ("leak5", 27.1)]  # peak = start + 0.6 = the cut
bc.FLASH = ("flash1", 18.95)  # peak = start + 0.3 = the first deeparadhanai
bc.TOTAL = 34.5

TAMIL_FONTS = '''    @font-face {
      font-family: "Noto Sans Tamil";
      src: url("assets/fonts/NotoSansTamil.ttf");
    }
    @font-face {
      font-family: "Noto Serif Tamil";
      src: url("assets/fonts/NotoSerifTamil.ttf");
    }
'''
bc.HOOK_CSS = TAMIL_FONTS + bc.HOOK_CSS.replace('font-family: "Playfair Display", serif;\n      font-weight: 700;\n      font-size: 96px;',
                                                'font-family: "Noto Serif Tamil", serif;\n      font-weight: 700;\n      font-size: 74px;').replace("line-height: 1.06;", "line-height: 1.3;", 1)
bc.HOOK_HTML = bc.HOOK_HTML.replace("Nobody tells you Kanha wakes before you", "உங்களுக்கு முன்பே கண்ணன் எழுந்துவிடுகிறார்")
bc.CTA_CSS = TAMIL_FONTS + (bc.CTA_CSS
                            .replace('#cta-head {\n      font-family: "Playfair Display", serif;\n      font-weight: 700;\n      font-size: 92px;',
                                     '#cta-head {\n      font-family: "Noto Serif Tamil", serif;\n      font-weight: 700;\n      font-size: 80px;')
                            .replace('#cta-sub {\n      margin-top: 30px;\n      font-family: "Montserrat", sans-serif;',
                                     '#cta-sub {\n      margin-top: 30px;\n      font-family: "Noto Sans Tamil", sans-serif;'))
bc.CTA_HTML = (bc.CTA_HTML.replace('data-duration="5.6"', 'data-duration="6.8"').replace('data-duration="5.4"', 'data-duration="6.6"')
               .replace('<div id="cta-head">Daily darshan</div>', '<div id="cta-head">தினசரி தரிசனம்</div>')
               .replace("Wake up with Kanha every morning", "தினமும் காலையில் கண்ணனுடன் விழித்தெழுங்கள்"))
bc.EXTRAS = {"hook": (bc.HOOK_CSS, bc.HOOK_HTML, bc.HOOK_JS), "cta": (bc.CTA_CSS, bc.CTA_HTML, bc.CTA_JS)}


def tamil_groups():
    """Subtitle groups from the Scribe word timings: one group per sentence or … phrase, at most 5 words.
    The first line is skipped because the hook title already shows it."""
    words = [w for w in json.load(open("assets/vo/words.json", encoding="utf-8"))["words"] if w["type"] == "word"]
    groups, cur, line = [], [], 0
    for w in words:
        if w["text"].startswith("["):
            if w["text"] == "[pause]":
                line += 1
            continue
        if line == 0:
            continue
        cur.append((w["text"], VO_START + w["start"], VO_START + w["end"]))
        if w["text"].endswith((".", "…", ",")) or len(cur) == 5:
            groups.append(cur)
            cur = []
    if cur:
        groups.append(cur)
    return groups


bc.subtitle_groups = tamil_groups
_subs = bc.subs_html
bc.subs_html = lambda: _subs().replace("  <style>\n", "  <style>\n" + TAMIL_FONTS, 1).replace(
    'font-family: "Montserrat", sans-serif;\n      font-weight: 700;\n      font-size: 60px;\n      line-height: 1.2;',
    'font-family: "Noto Sans Tamil", sans-serif;\n      font-weight: 700;\n      font-size: 54px;\n      line-height: 1.35;')
_fx = bc.fx_html
bc.fx_html = lambda: _fx().replace("on the cuts at 3.6, 12.0, 14.8, 20.0 and 24.4s; the flash lights the first aarti at 17.8s",
                                   "on the cuts at 3.65, 13.1, 16.1, 21.8 and 27.7s; the flash lights the first deeparadhanai at 19.25s")
_index = bc.index_html
bc.index_html = lambda: _index().replace(
    "Voiceover: Kokoro-82M (Apache-2.0), voice af_heart",
    "Voiceover: ElevenLabs eleven_v4, Tamil voice \"Aarumugam\", one continuous take").replace(
    'Day 3 · Kanha\'s morning · "Nobody tells you Kanha wakes before you"', "Day 3 (Tamil) · Kanha's 4 AM morning")

if __name__ == "__main__":
    for sid, img, _, dur, a, b in bc.SCENES:
        open(f"compositions/{sid}.html", "w", encoding="utf-8").write(bc.scene(sid, img, dur, a, b, *bc.EXTRAS.get(sid, ("", "", ""))))
    fx = bc.fx_html()  # reads the existing fx.html styles, so build it before opening the file
    open("compositions/fx.html", "w", encoding="utf-8").write(fx)
    open("compositions/subs.html", "w", encoding="utf-8").write(bc.subs_html())
    open("index.html", "w", encoding="utf-8").write(bc.index_html())
    for g in tamil_groups():
        print(f"{g[0][1]:5.2f}s  " + " ".join(w for w, _, _ in g))
