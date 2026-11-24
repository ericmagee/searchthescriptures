# ASK 582: move write history out of the engine manual body (v240) into the log row of v241.
# Rules R1..R6 are mechanical; every removed span is copied verbatim into the log text.
import re,json,hashlib,sys
c=open(sys.argv[1],encoding='utf-8').read()
assert hashlib.md5(c.encode()).hexdigest()=='8534e5745c15afcf72d8277103aefd08' and len(c)==743498
edits=[] # (start,end,repl,rule)
lines=[]; pos=0
for l in c.split('\n'):
    lines.append((pos,l)); pos+=len(l)+1
def indent(l): return len(l)-len(l.lstrip(' '))
KEEP26=' No grant to anon, authenticated or PUBLIC.'
for i,(p,l) in enumerate(lines):
    b=l.lstrip(' ')
    # R1 Live: lines, R2 Revert: lines, R3 Not in this entry / After the N writes
    if re.match(r'- (Live|Revert|Not in this entry):',b) or re.match(r'- After the (two|six) writes the live engine is',b):
        rule='R1' if b.startswith('- Live') else 'R2' if b.startswith('- Revert') else 'R3'
        edits.append((p-1,p+len(l),'',rule)); continue
    # R7 the write-register line in section 18; R8 the read-back and sizes-as-graded item of the 573/575/576 group
    if b.startswith('- Live flow: s244 (n8n version 8bd15b50'):
        edits.append((p-1,p+len(l),'','R7')); continue
    m=re.search(r' Written (by W\d )?on the card',l) or re.match(r'^\s+4\. All three: read back W1 MATCH Wall 11156\.',l)
    if m:
        if re.match(r'^\s+\d+\. (Written on the card|All three: read back W1 MATCH Wall 11156\.)',l):
            # R5 whole numbered item removed; renumber later siblings
            edits.append((p-1,p+len(l),'','R5'))
            ind=indent(l); k=int(re.match(r'^\s+(\d+)\.',l).group(1)); j=i+1
            while j<len(lines) and (indent(lines[j][1])>ind or (indent(lines[j][1])==ind and re.match(r'^\s+\d+\. ',lines[j][1]))):
                pj,lj=lines[j]
                mm=re.match(r'^(\s+)(\d+)\. ',lj)
                if mm and indent(lj)==ind:
                    assert int(mm.group(2))==k+1,(lj[:40],k); 
                    edits.append((pj+len(mm.group(1)),pj+len(mm.group(1))+len(mm.group(2)),str(k),'R5n')); k+=1
                j+=1
        else:
            # R4 tail cut
            repl=KEEP26 if 'ASK 554 and ASK 555, TWO AUDIT VIEWS' in l else ''
            edits.append((p+m.start(),p+len(l),repl,'R4'))
        continue
    # R6 batch headers
    if indent(l)==2 and '(one batch entry;' in l:
        m=re.search(r', WRITTEN 20\d\d| \(one batch entry;',l)
        edits.append((p+m.start(),p+len(l),':','R6'))
edits.sort()
for a,b in zip(edits,edits[1:]): assert a[1]<=b[0],(a,b)
# build result
out=[];last=0
for s,e,r,_ in edits: out.append(c[last:s]); out.append(r); last=e
out.append(c[last:]); new=''.join(out)
# pairs with minimal unique context, simulated exactly like engine_manual_apply
cur=c; rows=[]; shift=0
for idx,(s,e,r,rule) in enumerate(edits):
    lo=edits[idx-1][1] if idx else 0; hi=edits[idx+1][0] if idx+1<len(edits) else len(c)
    s0,e0=s,e
    if s0==e0: raise SystemExit('empty')
    while True:
        old=c[s0:e0]
        if cur.count(old)==1: break
        if s0>lo: s0=max(lo,s0-20)
        elif e0<hi: e0=min(hi,e0+20)
        else: raise SystemExit(('no unique',idx,c[s:e][:80]))
    newt=c[s0:s]+r+c[e:e0]
    assert old!='' 
    cur=cur.replace(old,newt)
    # label: start of own line (R4,R6,R5n) or parent line (whole-line deletions)
    ls=c.rfind('\n',0,s if rule in('R4','R6','R5n') else s)+1
    if rule in('R1','R2','R3','R5','R7'):
        # s is the newline before the line; find parent with smaller indent
        li=[k for k,(p,l) in enumerate(lines) if p==s+1][0]; ind=indent(lines[li][1]); k=li-1
        while k>0 and (indent(lines[k][1])>=ind or not lines[k][1].strip()): k-=1
        ls=lines[k][0]
    rows.append((s0,e0,s-s0,e0-e,r,ls,s,e,rule))
assert cur==new
md5=hashlib.md5(new.encode()).hexdigest()
from collections import Counter
print('edits',len(edits),Counter(x[3] for x in edits)); print('new md5',md5,'len',len(new),'removed',len(c)-len(new))
json.dump({'base_version':240,'base_md5':'8534e5745c15afcf72d8277103aefd08','new_md5':md5,'new_len':len(new),
  'rows':[dict(zip(['s0','e0','pre','post','lit','lab','s','e','rule'],r)) for r in rows],
  'pairs':[{'old':c[r[0]:r[1]],'new':c[r[0]:r[0]+r[2]]+r[4]+c[r[7]:r[1]]} for r in rows]},open('em_pairs_v241_draft.json','w'),ensure_ascii=False)
open('v241_preview.txt','w',encoding='utf-8').write(new)
# removed text, as the log will carry it
rem=[]
for r in rows:
    if r[8]=='R5n': continue
    rem.append('['+c[r[5]:r[5]+90].strip()+'] '+c[r[6]:r[7]].strip())
open('removed_v241.txt','w',encoding='utf-8').write('\n'.join(rem))
print('removed text chars',sum(len(x) for x in rem),'items',len(rem))
# SQL VALUES (1-based)
vals=','.join("(%d,%d,%d,%d,%d,%s,%d,'%s')"%(r[0]+1,r[1]-r[0],r[2],r[3],r[7]+1,"'"+r[4].replace("'","''")+"'",r[5]+1,r[8]) for r in rows)
open('values.sql','w').write(vals); print('values chars',len(vals))
