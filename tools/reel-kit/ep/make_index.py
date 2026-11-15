"""Write an episode's index.html: python3 make_index.py <reel dir> "<TITLE line 1>|<line 2>" "#n" "<CTA word>" "<emoji>" "<one-line description>" """
import sys, re
reel, title, num, cta, emo, desc = sys.argv[1:7]
pin = sys.argv[7] if len(sys.argv) > 7 else None
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
if pin:
    css = """      #prog { position: absolute; top: 56px; left: 190px; width: 700px; display: flex; gap: 14px; }
      #prog .seg { flex: 1; text-align: center; font-family: "Nunito", sans-serif; font-weight: 900; font-size: 26px; letter-spacing: 3px; color: #ffffff; -webkit-text-stroke: 5px #16121c; paint-order: stroke fill; }
      #prog .bar { height: 10px; margin-top: 6px; border-radius: 6px; background: rgba(255, 255, 255, 0.28); overflow: hidden; }
      #prog .bar i { display: block; height: 100%; width: 0%; background: #ffd23a; border-radius: 6px; }
      #pin { position: absolute; top: 1560px; left: 140px; width: 800px; padding: 18px 10px; border-radius: 40px; background: rgba(22, 18, 28, 0.78); border: 4px solid #ffd23a; text-align: center; font-family: "Nunito", sans-serif; font-weight: 900; font-size: 40px; color: #ffffff; }
      #pin b { color: #ffd23a; }
"""
    tpl = tpl.replace("    </style>", css + "    </style>", 1)
    html = '        <div id="prog">' + "".join(f'<div class="seg">{n}<div class="bar"><i></i></div></div>' for n in ("STORY", "WHY", "TODAY")) + '</div>\n        <div id="pin" style="opacity: 0">' + pin + '</div>\n'
    tpl = tpl.replace('        <div id="cta"', html + '        <div id="cta"', 1)
open(f"{reel}/index.html", "w").write(tpl); print("index", reel, D)
