"""Day 4 Tamil reel, "why did Kanha steal butter": reuses tools/build_composition.py with one continuous
Tamil narration, Tamil subtitles, hook title and CTA. Run from reels/day4-ta:  python3 tools/build_ta.py

The voice is one ElevenLabs take (eleven_v4, voice "Aarumugam", +3 dB), assets/vo/ta-full.wav. Its word
timings come from ElevenLabs Scribe (assets/vo/words.json); every scene cut sits in the pause between two lines.
"""
import json
import sys

sys.path.insert(0, "tools")
import build_composition as bc  # noqa: E402

VO_START = 0.4  # the narration starts 0.4s in
bc.SCENES = [
    ("hook", "01-yashoda-pot.png", 0.0, 5.05, (0, 0, 1.0), (-81, -144, 1.15)),
    ("uri", "02-uri.png", 5.05, 6.63, (-54, -400, 1.25), (-108, -96, 1.1)),  # tilts up to the hanging pot
    ("monkeys", "03-monkeys.png", 11.68, 5.32, (-108, -192, 1.2), (-27, -48, 1.05)),
    ("question", "04-kanha-butter.png", 17.0, 3.1, (-270, -480, 1.5), (-324, -560, 1.6)),  # close on his face
    ("churn", "05-churning.png", 20.1, 3.0, (-54, -96, 1.1), (-162, -288, 1.3)),
    ("heart", "06-offering.png", 23.1, 5.35, (-108, -192, 1.2), (-27, -48, 1.05)),
    ("cta", "07-cta-churn.png", 28.45, 7.85, (0, 0, 1.0), (-54, -96, 1.1)),  # the pot sits below the end card
]
bc.VO = [("ta-full", VO_START)]
bc.SFX = [("whoosh-open", "whoosh-short.mp3", 0.05, 0.55, 0.25, 8), ("sparkle-uri", "sparkle.mp3", 10.4, 1.4, 0.12, 9),
          ("whoosh-question", "whoosh-short.mp3", 16.75, 0.55, 0.22, 8), ("chime-heart", "chime.mp3", 23.0, 2.1, 0.22, 7),
          ("bell-cta", "temple-bell.mp3", 28.35, 2.0, 0.35, 8)]
bc.LEAKS = [("leak1", 4.45), ("leak2", 11.08), ("leak3", 19.5), ("leak4", 22.5), ("leak5", 27.85)]  # peak = start + 0.6 = the cut
bc.FLASH = ("flash1", 16.7)  # peak = start + 0.3 = the question
bc.TOTAL = 36.3

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
                                                'font-family: "Noto Serif Tamil", serif;\n      font-weight: 700;\n      font-size: 80px;').replace("line-height: 1.06;", "line-height: 1.3;", 1)
bc.HOOK_HTML = (bc.HOOK_HTML.replace("Nobody tells you Kanha wakes before you", "கண்ணன் ஏன் வெண்ணெய் திருடினான்?")
                .replace('data-duration="3.6" data-track-index="2"', 'data-duration="5.05" data-track-index="2"')
                .replace('data-duration="3.6" data-track-index="3"', 'data-duration="5.05" data-track-index="3"'))
bc.HOOK_JS = bc.HOOK_JS.replace("duration: 3.6, ease", "duration: 5.05, ease")
bc.CTA_CSS = TAMIL_FONTS + (bc.CTA_CSS
                            .replace('#cta-head {\n      font-family: "Playfair Display", serif;\n      font-weight: 700;\n      font-size: 92px;',
                                     '#cta-head {\n      font-family: "Noto Serif Tamil", serif;\n      font-weight: 700;\n      font-size: 80px;')
                            .replace('#cta-sub {\n      margin-top: 30px;\n      font-family: "Montserrat", sans-serif;',
                                     '#cta-sub {\n      margin-top: 30px;\n      font-family: "Noto Sans Tamil", sans-serif;'))
bc.CTA_HTML = (bc.CTA_HTML.replace('data-duration="5.6"', 'data-duration="7.85"').replace('data-duration="5.4"', 'data-duration="7.65"')
               .replace('<div id="cta-head">Daily darshan</div>', '<div id="cta-head">தினமும் கண்ணன் கதைகள்</div>')
               .replace("Wake up with Kanha every morning", "இன்று உங்கள் அன்பை அவனுக்குக் கொடுங்கள்"))
bc.EXTRAS = {"hook": (bc.HOOK_CSS, bc.HOOK_HTML, bc.HOOK_JS), "cta": (bc.CTA_CSS, bc.CTA_HTML, bc.CTA_JS)}


def tamil_groups():
    """Subtitle groups from the Scribe word timings: one group per sentence, comma or … phrase, at most 5 words."""
    words = [w for w in json.load(open("assets/vo/words.json", encoding="utf-8"))["words"]
             if w["type"] == "word" and not w["text"].startswith(("[", "softly]"))]
    groups, cur = [], []
    for w in words:
        cur.append((w["text"], VO_START + w["start"], VO_START + w["end"]))
        if w["text"].endswith((".", "…", ",", "?")) or len(cur) == 5:
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
                                   "on the cuts at 5.05, 11.68, 20.1, 23.1 and 28.45s; the flash opens the question at 17.0s")
_index = bc.index_html
bc.index_html = lambda: _index().replace(
    "Voiceover: Kokoro-82M (Apache-2.0), voice af_heart",
    "Voiceover: ElevenLabs eleven_v4, Tamil voice \"Aarumugam\", one continuous take").replace(
    'Day 3 · Kanha\'s morning · "Nobody tells you Kanha wakes before you"', "Day 4 (Tamil) · why Kanha stole butter").replace(
    "temple bell made with ElevenLabs (from Day 2); the rest", "temple bell made with ElevenLabs (Day 2); the rest")

if __name__ == "__main__":
    for sid, img, _, dur, a, b in bc.SCENES:
        open(f"compositions/{sid}.html", "w", encoding="utf-8").write(bc.scene(sid, img, dur, a, b, *bc.EXTRAS.get(sid, ("", "", ""))))
    fx = bc.fx_html()  # reads the existing fx.html styles, so build it before opening the file
    open("compositions/fx.html", "w", encoding="utf-8").write(fx)
    open("compositions/subs.html", "w", encoding="utf-8").write(bc.subs_html())
    open("index.html", "w", encoding="utf-8").write(bc.index_html())
    for g in tamil_groups():
        print(f"{g[0][1]:5.2f}s  " + " ".join(w for w, _, _ in g))
