"""Write an episode's index.html: python3 make_index.py <reel dir> "<TITLE line 1>|<line 2>" "#n" "<CTA word>" "<emoji>" "<one-line description>" """
import sys, re
reel, title, num, cta, emo, desc = sys.argv[1:7]
data = open(f"{reel}/assets/data.js").read()
D = re.search(r"DURATION = ([\d.]+)", data).group(1); VD = re.search(r"VOICE_DUR = ([\d.]+)", data).group(1)
t1, t2 = title.split("|")
tpl = open("reels/day20-en/index.html").read()
tpl = re.sub(r'data-duration="[\d.]+"', f'data-duration="{D}"', tpl)
tpl = re.sub(r'(id="vo"[^>]*data-duration=")[\d.]+', lambda m: m.group(1) + VD, tpl)
tpl = re.sub(r'(id="series"[^>]*data-duration=")[\d.]+', lambda m: m.group(1) + "5", tpl)
tpl = re.sub(r'<div id="title" class="ov">.*?</div>', f'<div id="title" class="ov">{t1}<br>{t2}</div>', tpl)
tpl = re.sub(r'WHY WE DO WHAT WE DO · #\d+', f'WHY WE DO WHAT WE DO · {num}', tpl)
tpl = re.sub(r'Comment<br>“[^”]*” [^<]*</div>', f'Comment<br>“{cta}” {emo}</div>', tpl)
tpl = re.sub(r'/\* Day 20 \(English\) · [^*]*\*/', f'/* {desc} */', tpl)
tpl = tpl.replace("left: 60px;\n        width: 560px;", "left: 60px;\n        width: 900px;")
open(f"{reel}/index.html", "w").write(tpl); print("index", reel, D)
