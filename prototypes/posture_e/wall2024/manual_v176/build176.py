import hashlib,re
src=open('v175.txt',encoding='utf-8').read()
assert hashlib.md5(src.encode()).hexdigest()=='2e322fd3fdfc85f7e1d043fe27206438'
dr=open('entries176_draft.md',encoding='utf-8').read()
def entry(hdr):
    i=dr.index('\n## '+hdr); j=dr.index('\n## ',i+5)
    body=dr[i:j].split('\n',2)[2]
    return '\n'.join(l for l in body.split('\n') if l.strip())+'\n'
def quoted(label):
    # text between first pair of " after label line, for block A-C replacement lines
    i=dr.index(label); a=dr.index('\n"',i)+2; b=dr.index('"\n',a); return dr[a:b]
E={k:entry(k) for k in ['317 and 318','319 ','320 ','321 ','322 ','323 ','324 ']}
W={'319 ':'s213 (ASK 319; n8n version dfcce94c)','320 ':'s214 (ASK 320; n8n version ca933142)','321 ':'s215 (ASK 321; n8n version a3b24ed9)','322 ':'s216 (ASK 322; n8n version 2667bdb4)','323 ':'s217 (ASK 323 parts 1 and 2 together; n8n version fcab1ec1)','324 ':'s218 (ASK 324; n8n version ffc2f775)'}
for k,v in W.items(): E[k]=E[k]+'  - WRITTEN AS '+v+'.\n'
lines=src.split('\n')
def ind(l): return len(l)-len(l.lstrip(' '))
def after_entry(prefix):
    idx=[k for k,l in enumerate(lines) if l.lstrip().startswith(prefix)]
    assert len(idx)==1,(prefix,idx); k=idx[0]; d=ind(lines[k]); m=k+1
    while m<len(lines) and lines[m].strip() and ind(lines[m])>d: m+=1
    return k,m,d
def shift(txt,d): return ''.join(' '*d+l+'\n' for l in txt.rstrip('\n').split('\n'))
ins=[]
k,m,d=after_entry('- AN E-ANS CURE MUST QUOTE A COUNTED [L1] THAT THE ANSWER ITSELF NAMES OR QUOTES (pkgPWF rev 2'); ins.append((m,shift(E['319 '],d)))
k,m,d=after_entry('- ASSUMPTION CHARGE CHECK (pkgVP4, E-ASSUME'); ins.append((m,shift(E['320 '],d)))
k,m,d=after_entry('- THE CLOSE-CONTRADICTION ENFORCER IS GIVEN EACH SIDE\'S OWN EARLIER NARROWINGS (pkgNRC'); ins.append((m,shift(E['321 '],d)))
k,m,d=after_entry('- A K-UNX-A ITEM IS NOT RAISED ON A COUNT WHOSE ASSUMES CLAUSE NAMES A FACT BOTH READERS FOUND NOT STATED (pkgBKC'); ins.append((m,shift(E['323 '],d)))
k,m,d=after_entry('- [L2] TAG CHECK, VERSE SCOPE (pkgL2S rev 2'); ins.append((m,shift(E['324 '],d)))
s6=[k for k,l in enumerate(lines) if l=='## 6. Rounds']; assert len(s6)==1
m=s6[0]-1; assert lines[m]=='' ; ins.append((m,E['317 and 318']+E['322 ']))
for m,t in sorted(ins,key=lambda x:-x[0]):
    lines[m:m]=t.rstrip('\n').split('\n')
c='\n'.join(lines)
def rep(old,new):
    global c; assert c.count(old)==1,old[:80]; c=c.replace(old,new)
# A
l61=[l for l in c.split('\n') if l.startswith('- NO REASONING FIELD:')]; assert len(l61)==1
rep(l61[0],quoted('A. Section 4'))
# B
bl=[l for l in c.split('\n') if l.startswith("    - REASONING EFFORT LOW: the request finisher adds `reasoning: {effort: 'low'}` to a body whose model is exactly `google/gemini-4-hydrogen` and that")]; assert len(bl)==1
wl=[l for l in c.split('\n') if l.startswith('    - Why effort low:')]; assert len(wl)==1
rep(bl[0]+'\n'+wl[0],quoted('B. Section 10'))
# C
cl=[l for l in c.split('\n') if l.startswith("    - REASONING EFFORT LOW: the request finisher adds `reasoning: {effort: 'low'}` to a body whose model is exactly `google/gemini-4-hydrogen` or `meta/muse-spark-1.3`")]; assert len(cl)==1
rep(cl[0],quoted('C. Section 10'))
il=[l for l in c.split('\n') if l.startswith("    - Init Seats: ORDER0 is chatgpt, sol, luna, hydrogen, gemini")]; assert len(il)==1
i=dr.index('And after the Init Seats line'); a=dr.index('\n"',i)+2; b=dr.index('"\n',a); spark=dr[a:b]
rep(il[0],il[0]+'\n'+spark)
# D
rep('(ember, gemini and spark as alternates, reasoning effort low)','(ember, gemini and spark as alternates)')
rep("Each model's fitness rests on one full-body check call at effort low.","Each model's fitness rests on one full-body check call at effort low; none has been checked at the default, which is how every model now runs.")
rep('(hydrogen as second alternate, reasoning effort low)','(hydrogen as second alternate)')
rep("The model's fitness rests on one full-body check call at effort low.","The model's fitness rests on one full-body check call at effort low; at the default it has not returned a complete verdict on a full judge body (§10, ALTERNATE HYDROGEN).")
# E
rep('- Live flow: s209 (n8n version f97bdbb6, 455 nodes; Shared Library 946,100 characters, sha f3adbaa1f7064da7).','- Live flow: s218 (n8n version ffc2f775, 455 nodes; Shared Library 947,963 characters, sha 2bff75837e74ad16).')
rep('s209 = s208 + pkgBKC (ASK 313, one write).','s209 = s208 + pkgBKC (ASK 313, one write). s210 = s209 + spark in Init Seats ENG (one node). s211 = s210 - the hydrogen and spark effort-low statement (15 nodes). s212 = s211 + pkgRDF (every remaining reasoning statement removed: gemini-3.8-flash low, MiMo medium, xiaomi reasoning off; 15 nodes). s213 = s212 + pkgPWF (b) only (ASK 319). s214 = s213 + pkgEAG (ASK 320). s215 = s214 + pkgNRH (ASK 321). s216 = s215 + the [L2] FIDELITY line (ASK 322). s217 = s216 + the K-UNX gate fix and pkgGCA (ASK 323). s218 = s217 + pkgGLB (ASK 324).')
open('engine_manual_v176_draft.txt','w',encoding='utf-8').write(c)
print(len(src),len(c),hashlib.md5(c.encode()).hexdigest())
for w in ['effort low','reasoning effort','WRITTEN AS','[AT BUILD','CHECK BEFORE']:
    print(w,c.count(w))
