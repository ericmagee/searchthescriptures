# ASK 583 prototype: cut the engine manual text into ordered parts; the parts joined with '' must equal the source.
# Rule: one part per "## " section (the text before "## 0." is part 00). A section over CAP characters is cut
# again before top-level bullets ("\n- "); a top-level bullet over CAP is cut again before its second-level
# bullets ("\n  - "). Consecutive pieces are packed into parts of at most CAP characters. No character is changed.
import re,sys,hashlib,json
CAP=40000
def pack(pieces):
    out=[];cur=''
    for p in pieces:
        if cur and len(cur)+len(p)>CAP: out.append(cur);cur=''
        cur+=p
    if cur: out.append(cur)
    return out
def cut(s,pat):
    idx=[m.start() for m in re.finditer(pat,s)]
    if not idx: return [s]
    b=[0]+idx+[len(s)]; return [s[b[i]:b[i+1]] for i in range(len(b)-1) if b[i]<b[i+1]]
def split(c):
    parts=[]
    for sec in cut(c,r'\n(?=## )'):
        if len(sec)<=CAP: parts.append(sec); continue
        pieces=[]
        for b in cut(sec,r'\n(?=- )'):
            pieces += [b] if len(b)<=CAP else cut(b,r'\n(?=  - )')
        parts += pack(pieces)
    return parts
if __name__=='__main__':
    c=open(sys.argv[1],encoding='utf-8').read(); parts=split(c)
    assert ''.join(parts)==c
    print('source',hashlib.md5(c.encode()).hexdigest(),len(c),'parts',len(parts),'max',max(map(len,parts)))
    sec='00'; k=0
    for p in parts:
        m=re.match(r'\n?## (\d+)\. ([^\n]*)',p)
        if m: sec='%02d'%int(m.group(1)); k=0; title=m.group(2)
        else: k+=1
        first=[l for l in p.split('\n') if l.strip()][0].strip()[:60]
        print('%s.%d %6d %s'%(sec,k,len(p),first))
    bad=c[:300000]+c[300001:]  # known-bad: one character lost
    print('known-bad join equals source:', ''.join(split(bad))==c)
