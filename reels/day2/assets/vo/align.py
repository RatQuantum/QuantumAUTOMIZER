"""Recognise each voice line (as a sanity check) and force-align it to its script for word timings."""
import sys, json, subprocess, re
from pocketsphinx import Decoder, Config
def pcm(path):
    return subprocess.run(["ffmpeg","-loglevel","error","-i",path,"-ac","1","-ar","16000","-f","s16le","-"],capture_output=True,check=True).stdout
# Pronunciations (CMU phones) for names missing from the English dictionary
EXTRA={"kurukshetra":"K UH R UH K SH EY T R AH","krishna":"K R IH SH N AH","bhagavad":"B AH G AH V AH D",
       "gita":"G IY T AA","mantra":"M AA N T R AH","arjun":"AA R JH UH N","overthinking":"OW V ER TH IH NG K IH NG","pdf":"P IY D IY EH F"}
out={}
for line in open(sys.argv[1]):
    name,text=line.rstrip("\n").split("|",1)
    data=pcm(f"{name}.wav")
    d=Decoder(); d.start_utt(); d.process_raw(data,full_utt=True); d.end_utt()
    heard=d.hyp().hypstr if d.hyp() else ""
    words=re.findall(r"[a-z']+", text.lower())
    words=[w for w in words]
    a=Decoder()
    for w in words:
        if a.lookup_word(w) is None:
            a.add_word(w, EXTRA[w], True)
    a.set_align_text(" ".join(words)); a.start_utt(); a.process_raw(data,full_utt=True); a.end_utt()
    segs=[(s.word,s.start_frame/100,(s.end_frame+1)/100) for s in a.seg() if s.word not in("<s>","</s>","<sil>","(NULL)")]
    out[name]=segs
    print(f"{name}\n  heard: {heard}\n  words: {[(w,round(s,2)) for w,s,e in segs]}")
json.dump(out,open("alignment.json","w"),indent=1)
