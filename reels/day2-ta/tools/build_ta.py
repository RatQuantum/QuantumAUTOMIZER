"""Tamil version of the Day 2 reel: reuses tools/build_composition.py and swaps in the Tamil voice,
subtitles, hook title and CTA. Run from reels/day2-ta:  python3 tools/build_ta.py

Tamil has no word aligner here, so each spoken sentence is timed from the pauses in its voice file
and the words inside it are spread by their length.
"""
import re
import subprocess
import sys

sys.path.insert(0, "tools")
import build_composition as bc  # noqa: E402

bc.SCENES = [
    ("hook", "01-gita.png", 0.0, 5.2, (0, 0, 1.0), (-81, -200, 1.15)),
    ("frozen", "02-arjuna-frozen.png", 5.2, 13.6, (0, 0, 1.0), (-130, -200, 1.24)),
    ("krishna", "03-krishna-teaching.png", 18.8, 8.2, (-108, -60, 1.2), (0, 0, 1.0)),
    ("verse", "01-gita.png", 27.0, 8.0, (-162, -500, 1.3), (-210, -560, 1.35)),
    ("rises", "04-arjuna-rises.png", 35.0, 5.2, (-54, -192, 1.1), (-108, -60, 1.2)),
    ("lotus", "05-lotus.png", 40.2, 7.1, (0, 0, 1.0), (-108, -288, 1.2)),
    ("cta", "06-mala.png", 47.3, 10.2, (0, 0, 1.0), (-81, -144, 1.15)),
]
bc.VO = [("l1-hook", 0.7), ("l2-battlefield", 5.5), ("l3-krishna", 19.1), ("l5-meaning", 28.0),
         ("l6-peace", 35.3), ("l7-surrender", 40.4), ("l8-cta", 47.8)]
bc.SFX = [("page-open", "page-turn.mp3", 0.1, 2.0, 0.45, 7), ("bell-krishna", "temple-bell.mp3", 18.7, 2.0, 0.5, 8),
          ("page-verse", "page-turn.mp3", 26.8, 2.0, 0.4, 7), ("sparkle-verse", "sparkle.mp3", 27.4, 1.4, 0.25, 9),
          ("whoosh-rise", "whoosh-short.mp3", 34.75, 0.55, 0.3, 8), ("sparkle-lotus", "sparkle.mp3", 39.9, 1.4, 0.25, 9),
          ("bell-cta", "temple-bell.mp3", 47.2, 2.0, 0.5, 8), ("chime-mantra", "chime.mp3", 47.9, 2.1, 0.35, 7)]
bc.LEAKS = [("leak1", 4.6), ("leak2", 18.2), ("leak3", 34.4), ("leak4", 39.6), ("leak5", 46.7)]
bc.FLASH = ("flash1", 26.7)
bc.TOTAL = 57.5

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
bc.HOOK_HTML = (bc.HOOK_HTML.replace('data-duration="4.0"', 'data-duration="5.2"')
                .replace("Krishna's answer to overthinking", "அதிகம் யோசிப்பவர்களுக்கு ஸ்ரீ கிருஷ்ணரின் பதில்"))
bc.HOOK_JS = bc.HOOK_JS.replace("duration: 4, ease", "duration: 5.2, ease")
bc.VERSE_HTML = (bc.VERSE_HTML.replace('data-duration="6.9"', 'data-duration="8.0"')
                 .replace("Bhagavad Gita 2.47", "பகவத் கீதை 2.47"))
bc.VERSE_CSS = TAMIL_FONTS + bc.VERSE_CSS.replace('#verse-ref {\n      font-family: "Montserrat", sans-serif;',
                                                  '#verse-ref {\n      font-family: "Noto Sans Tamil", sans-serif;')
bc.CTA_CSS = TAMIL_FONTS + (bc.CTA_CSS
                            .replace('#cta-head {\n      font-family: "Playfair Display", serif;\n      font-weight: 700;\n      font-size: 92px;',
                                     '#cta-head {\n      font-family: "Noto Serif Tamil", serif;\n      font-weight: 700;\n      font-size: 76px;')
                            .replace('#cta-sub {\n      margin-top: 30px;\n      font-family: "Montserrat", sans-serif;',
                                     '#cta-sub {\n      margin-top: 30px;\n      font-family: "Noto Sans Tamil", sans-serif;'))
bc.CTA_HTML = (bc.CTA_HTML.replace('data-duration="6.6"', 'data-duration="10.2"').replace('data-duration="6.4"', 'data-duration="10.0"')
               .replace('<div id="cta-head">Comment</div>', '<div id="cta-head">கமெண்ட் செய்யுங்கள்</div>')
               .replace("Free Krishna mantra PDF in your DMs", "இலவச கிருஷ்ண மந்திரப் புத்தகம் உங்கள் DM-க்கு"))
bc.EXTRAS = {"hook": (bc.HOOK_CSS, bc.HOOK_HTML, bc.HOOK_JS), "verse": (bc.VERSE_CSS, bc.VERSE_HTML, bc.VERSE_JS),
             "cta": (bc.CTA_CSS, bc.CTA_HTML, bc.CTA_JS)}


def pauses(path, min_gap=0.22):
    """Midpoints of the silent gaps inside a voice file."""
    err = subprocess.run(["ffmpeg", "-hide_banner", "-i", path, "-af", f"silencedetect=n=-38dB:d={min_gap}", "-f", "null", "-"],
                         capture_output=True, text=True).stderr
    starts = [float(x) for x in re.findall(r"silence_start: ([\d.]+)", err)]
    ends = [float(x) for x in re.findall(r"silence_end: ([\d.]+)", err)]
    return [(s + e) / 2 for s, e in zip(starts, ends)]


def tamil_groups():
    script = {l.split("|")[0]: l.split("|")[1].strip() for l in open("assets/vo/script-ta.txt", encoding="utf-8") if "|" in l}
    groups = []
    for name, off in bc.VO:
        path = f"assets/vo/{name}.wav"
        total = bc.duration(path)
        # phrases end at . ? , or … ; the voice pauses at most of them
        phrases = [p.strip() for p in re.findall(r"[^.?,…]+[.?,…]+[\"”]?|[^.?,…]+$", script[name].replace("...", "…")) if p.strip()]
        gaps = pauses(path)
        weights = [len(re.sub(r"[ா-்ௗ\s\"“”]", "", p)) for p in phrases]  # letters, not vowel signs
        # match each phrase boundary to the nearest pause; fall back to length-proportional timing
        bounds, acc = [0.0], 0
        for w in weights[:-1]:
            acc += w
            guess = total * acc / sum(weights)
            near = min(gaps, key=lambda g: abs(g - guess)) if gaps else guess
            bounds.append(near if abs(near - guess) < 1.2 and near > bounds[-1] else guess)
        bounds.append(total)
        # merge short phrases into one subtitle group of at most ~5 words
        cur = []
        for (a, b), p in zip(zip(bounds, bounds[1:]), phrases):
            words = p.split()
            lens = [max(1, len(re.sub(r"[ா-்ௗ\"“”.,?…]", "", w))) for w in words]
            t, span = a, (b - a) * 0.92
            for w, n in zip(words, lens):
                cur.append((w, off + t, off + t + span * n / sum(lens)))
                t += span * n / sum(lens)
            if len(cur) >= 4 or p is phrases[-1]:
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
    "Voiceover: AI4Bharat Indic Parler-TTS (Apache-2.0), deep male Tamil voice").replace(
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
