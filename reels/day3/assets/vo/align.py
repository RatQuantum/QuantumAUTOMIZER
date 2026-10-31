"""Recognise each voice line (as a sanity check) and force-align it to its script for word timings."""
import sys, json, subprocess, re
from pocketsphinx import Decoder, Config
def pcm(path):
    return subprocess.run(["ffmpeg","-loglevel","error","-i",path,"-ac","1","-ar","16000","-f","s16le","-"],capture_output=True,check=True).stdout
# Pronunciations (CMU phones) for names missing from the English dictionary
EXTRA={"kanha":"K AA N HH AA","suprabhatam":"S UW P R AH B AA T AH M","abhishekam":"AH B IY SH EY K AH M",
       "alankaram":"AH L AH NG K AA R AH M","aarti":"AA R T IY","darshan":"D AA R SH AH N","ayem":"EY EH M"}  # "AM" is said as the letters
out={}
for line in open(sys.argv[1]):
    name,text=line.rstrip("\n").split("|",1)
    data=pcm(f"{name}.wav")
    d=Decoder(); d.start_utt(); d.process_raw(data,full_utt=True); d.end_utt()
    heard=d.hyp().hypstr if d.hyp() else ""
    words=re.findall(r"[a-z']+", text.lower())
    words=[{"am": "ayem"}.get(w, w) for w in words]
    a=Decoder()
    for w in words:
        if a.lookup_word(w) is None:
            a.add_word(w, EXTRA[w], True)
    a.set_align_text(" ".join(words)); a.start_utt(); a.process_raw(data,full_utt=True); a.end_utt()
    segs=[(s.word,s.start_frame/100,(s.end_frame+1)/100) for s in a.seg() if s.word not in("<s>","</s>","<sil>","(NULL)")]
    out[name]=segs
    print(f"{name}\n  heard: {heard}\n  words: {[(w,round(s,2)) for w,s,e in segs]}")
json.dump(out,open("alignment.json","w"),indent=1)
