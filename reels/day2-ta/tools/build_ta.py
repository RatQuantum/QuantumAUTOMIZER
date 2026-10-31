"""Tamil version of the Day 2 reel: reuses tools/build_composition.py and swaps in the Tamil voice,
subtitles, hook title and CTA. Run from reels/day2-ta:  python3 tools/build_ta.py

The voice is one ElevenLabs take (eleven_v4, voice "Ramaa - Expert Tamil Book Narrator") cut into its seven
lines at the pauses; scene timings follow the line lengths, and the subtitles use the ElevenLabs Scribe word
timings in assets/vo/words.json.
"""
import json
import sys

sys.path.insert(0, "tools")
import build_composition as bc  # noqa: E402

bc.SCENES = [
    ("hook", "01-gita.png", 0.0, 5.04, (0, 0, 1.0), (-81, -200, 1.15)),
    ("frozen", "02-arjuna-frozen.png", 5.04, 11.76, (-270, -60, 1.25), (-250, -260, 1.34)),  # starts right of a small background figure
    ("krishna", "03-krishna-teaching.png", 16.8, 7.97, (-108, -60, 1.2), (0, 0, 1.0)),
    ("verse", "01-gita.png", 24.77, 7.63, (-162, -500, 1.3), (-210, -560, 1.35)),
    ("rises", "04-arjuna-rises.png", 32.4, 6.26, (-54, -192, 1.1), (-108, -60, 1.2)),
    ("lotus", "05-lotus.png", 38.66, 7.34, (0, 0, 1.0), (-108, -288, 1.2)),
    ("cta", "06-mala.png", 46.0, 9.08, (0, 0, 1.0), (-81, -144, 1.15)),
]
bc.VO = [("l1-hook", 0.7), ("l2-battlefield", 5.34), ("l3-krishna", 17.1), ("l5-meaning", 25.77), ("l6-peace", 32.7), ("l7-surrender", 38.86), ("l8-cta", 46.5)]
bc.SFX = [("page-open", "page-turn.mp3", 0.1, 2.0, 0.45, 7), ("bell-krishna", "temple-bell.mp3", 16.7, 2.0, 0.5, 8),
          ("page-verse", "page-turn.mp3", 24.57, 2.0, 0.4, 7), ("sparkle-verse", "sparkle.mp3", 25.17, 1.4, 0.25, 9),
          ("whoosh-rise", "whoosh-short.mp3", 32.15, 0.55, 0.3, 8), ("sparkle-lotus", "sparkle.mp3", 38.36, 1.4, 0.25, 9),
          ("bell-cta", "temple-bell.mp3", 45.9, 2.0, 0.5, 8), ("chime-mantra", "chime.mp3", 46.6, 2.1, 0.35, 7)]
bc.LEAKS = [("leak1", 4.44), ("leak2", 16.2), ("leak3", 31.8), ("leak4", 38.06), ("leak5", 45.4)]
bc.FLASH = ("flash1", 24.47)
bc.TOTAL = 55.08


TAMIL_FONTS = '''    @font-face {
      font-family: "Noto Sans Tamil";
      src: url("assets/fonts/NotoSansTamil.ttf");
    }
    @font-face {
      font-family: "Noto Serif Tamil";
      src: url("assets/fonts/NotoSerifTamil.ttf");
    }
'''
bc.HOOK_CSS = TAMIL_FONTS + bc.HOOK_CSS.replace('font-family: "Playfair Display", serif;\n      font-weight: 700;\n      font-size: 104px;',
                                                'font-family: "Noto Serif Tamil", serif;\n      font-weight: 700;\n      font-size: 70px;').replace("line-height: 1.06;", "line-height: 1.3;", 1)
bc.HOOK_HTML = (bc.HOOK_HTML.replace('data-duration="4.0"', 'data-duration="5.04"')
                .replace("Krishna's answer to overthinking", "அதிகம் யோசிப்பவர்களுக்கு ஸ்ரீ கிருஷ்ணரின் பதில்"))
bc.HOOK_JS = bc.HOOK_JS.replace("duration: 4, ease", "duration: 5.04, ease")
bc.VERSE_HTML = (bc.VERSE_HTML.replace('data-duration="6.9"', 'data-duration="7.63"')
                 .replace("Bhagavad Gita 2.47", "பகவத் கீதை 2.47"))
bc.VERSE_CSS = TAMIL_FONTS + bc.VERSE_CSS.replace('#verse-ref {\n      font-family: "Montserrat", sans-serif;',
                                                  '#verse-ref {\n      font-family: "Noto Sans Tamil", sans-serif;')
bc.CTA_CSS = TAMIL_FONTS + (bc.CTA_CSS
                            .replace('#cta-head {\n      font-family: "Playfair Display", serif;\n      font-weight: 700;\n      font-size: 92px;',
                                     '#cta-head {\n      font-family: "Noto Serif Tamil", serif;\n      font-weight: 700;\n      font-size: 76px;')
                            .replace('#cta-sub {\n      margin-top: 30px;\n      font-family: "Montserrat", sans-serif;',
                                     '#cta-sub {\n      margin-top: 30px;\n      font-family: "Noto Sans Tamil", sans-serif;'))
bc.CTA_HTML = (bc.CTA_HTML.replace('data-duration="6.6"', 'data-duration="9.08"').replace('data-duration="6.4"', 'data-duration="8.88"')
               .replace('<div id="cta-head">Comment</div>', '<div id="cta-head">கமெண்ட் செய்யுங்கள்</div>')
               .replace("Free Krishna mantra PDF in your DMs", "இலவச கிருஷ்ண மந்திரப் புத்தகம் உங்கள் DM-க்கு"))
bc.EXTRAS = {"hook": (bc.HOOK_CSS, bc.HOOK_HTML, bc.HOOK_JS), "verse": (bc.VERSE_CSS, bc.VERSE_HTML, bc.VERSE_JS),
             "cta": (bc.CTA_CSS, bc.CTA_HTML, bc.CTA_JS)}


def tamil_groups():
    """Subtitle groups from the ElevenLabs Scribe word timings (assets/vo/words.json, per line):
    one group per sentence, … or comma phrase, at most 5 words."""
    words = json.load(open("assets/vo/words.json", encoding="utf-8"))
    groups = []
    for name, off in bc.VO:
        cur = []
        for text, s0, e0 in words[name]:
            cur.append((text, off + s0, off + e0))
            if text.rstrip('"”').endswith((".", "?", "…", ",")) or len(cur) == 5:
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
_index = bc.index_html
bc.index_html = lambda: _index().replace(
    "Voiceover: Kokoro-82M (Apache-2.0), voice af_heart",
    "Voiceover: ElevenLabs eleven_v4, Tamil voice \"Ramaa - Expert Tamil Book Narrator\", one take cut at its pauses").replace(
    'Day 2 · Gita 2.47 · "Krishna\'s answer to overthinking"', "Day 2 (Tamil) · Gita 2.47")

if __name__ == "__main__":
    for sid, img, _, dur, a, b in bc.SCENES:
        open(f"compositions/{sid}.html", "w", encoding="utf-8").write(bc.scene(sid, img, dur, a, b, *bc.EXTRAS.get(sid, ("", "", ""))))
    fx = bc.fx_html()
    open("compositions/fx.html", "w", encoding="utf-8").write(fx)
    open("compositions/subs.html", "w", encoding="utf-8").write(bc.subs_html())
    open("index.html", "w", encoding="utf-8").write(bc.index_html())
    for g in tamil_groups():
        print(f"{g[0][1]:5.2f}s  " + " ".join(w for w, _, _ in g))
