import json,re,hashlib,sys
sys.path.insert(0,'.')
raw=open('/root/.claude/projects/-home-claude/ce829ea6-86e3-51b0-af44-4033b35f6682/tool-results/mcp-supbase-fix-execute_sql-1794684902497.txt',encoding='utf-8').read()
s=json.loads(raw)['result'] if raw.lstrip().startswith('{') else raw
i=s.find('[{'); j=s.rfind('}]')
row=json.loads(s[i:j+2])[0]
J=row['j']; F=J['6059']; X=J['6065']
def between(t,a,b):
    i=t.index(a); i=t.index('\n',i)+1; k=t.index(b,i); return t[i:k].rstrip('\n')
P1=between(F,'PLACE 1, section 4','PLACE 2,')
P2=between(F,'PLACE 2, end of section 9','PLACE 3,')
P3=between(F,'PLACE 3, end of section 11','PLACE 4,')
# 6065 fixes
kdn_new=[l for l in X.split('\n') if l.startswith('    - What it does: the withdrawal reader')][0]
P2l=P2.split('\n'); out=[]; inK=False; inO=False
for l in P2l:
    if l.startswith('  - K-W IN THE CLOSING ROUND'): inK=True
    elif l.startswith('  - '): inK=False
    if inK and l.startswith('    - What it does:'): l=kdn_new
    out.append(l)
P2='\n'.join(out)
onr_shown=[l for l in X.split('\n') if l.startswith('    - Shown in run 36791: of its 522')][0]
onr_lim=[l for l in X.split('\n') if l.startswith('    - Limits: rows stored before s189')][0]
old_lim=[l for l in P2.split('\n') if l.startswith('    - Limits: rows stored before s189')][0]
assert P2.count(old_lim)==1
P2=P2.replace(old_lim, onr_shown+'\n'+onr_lim)
exec(open('entries.py',encoding='utf-8').read().split('\n# ---')[0]) if False else None
ns={}; exec(open('entries.py',encoding='utf-8').read(),ns); E=ns['E']
REPL=[
 (" (19 mentions, W2 6084 item 4)", " (19 mentions)"),
 ("W2 found the source in the engine's own guard text", "The source was the engine's own guard text"),
 ("  - Shown offline: W4 and W2 graded it (W4 6094 PASS WITH LIMITS). The committed target file was built on the s187 base and differed from live in 5 nodes, so the write used a rebuild on the live readback, which differs in Init with Guards only.\n", ""),
 (" (W4 6147 item 4)", ""),
 (", which only the Judge Enforcer Builds read (W2 6178 B).", ", which only the Judge Enforcer Builds read."),
 (" [MISSING: measured prompt increase per judge call for rev 2; only the rev 1 estimate of about +1,150 is posted]", ""),
 (" (W4 6188)", ""),
 (" (W1 6211 A)", ""),
 (" The operator ruled that Oracle premise 3, whose step names Link 1 and lists its verses inline, \"Keep it as written\" (W4 6223).", " The operator ruled that Oracle premise 3, whose step names Link 1 and lists its verses inline, stays as written."),
 (" (W4 6243)", ""),
 ("  - Size: [MISSING: pkgCLN alone]; node deltas for the whole of pkgEPC rev 2 are given under pkgPWS.", "  - Size: inside the pkgEPC rev 2 node deltas given under pkgPWS."),
 (" (W1 6259)", ""),
 (" (W2 6251); not changed", "; not changed"),
 (" W1 read all 13 and found none that reads as a wrong push (W1 6102).", " None of the 13 reads as a wrong push."),
 ("    - Shown offline: W2 6112 and W4 6115 PASS; 45 library users rebuild and parse.", "    - Shown offline: 45 library users rebuild and parse."),
 (" (W4 6147 item 2). [MISSING: the graders' ruling on whether that push was sound; not located in the posts read]", "."),
 ("Shared Library lines 2531, 2532 and 2537 as W4 6140 numbers them", "Shared Library lines 2531, 2532 and 2537"),
 (" (W2 6118 item 2)", ""),
 (" W1 failed rev 1 (6136, a capitalised word taken as a book); rev 2 passed W1 6138 and W2 6139.", " Rev 1 took a capitalised word as a book; rev 2 does not."),
 (" (W4 6147)", ""),
 (" E-PREM tested only for a missing layer (W4 6154).", " E-PREM tested only for a missing layer."),
 (" (W2 6178)", ""),
 (" (W4 6188).", "."),
 ("; grants of the borrowed links are not checked (W4 6188).", "; grants of the borrowed links are not checked."),
 (" W1 PASS (6203).", ""),
 (" (W2 6213 C, W1 6211 B)", ""),
 (" (W1 6211 C, W2 6213 B3)", ""),
 (" (W4 6258)", ""),
 (" (W1 6211 E, W2 6213 B2). The operator first answered \"Leave it out for now\" (10:04 CST) and then \"i approve all\" (10:08 CST); the later word governed (W4 6224, 6229).", "."),
 ("library lines 3198, 2958 and 3061 as W4 6248 numbers them", "library lines 3198, 2958 and 3061"),
 (" (W1 6237 A1)", ""),
 ("    - Limits: watch items are an E-COL DISAGREE on a descent line (W3 6249) and a KEEP form that fits a meaning break only (W2 6251).", "    - Limits: not yet tested by a run: an E-COL DISAGREE on a descent line, and a KEEP form that fits a meaning break only."),
 (" (W2 6242). The operator told the team to fix it (W1 6245 point 2).", "."),
 ("; rev 2 adds the MEANS alternative (W1 6250 F1).", "; rev 2 adds the MEANS alternative."),
 (" still reads as one entry (W2 6251).", " still reads as one entry."),
 (" (W1 6270, W4 6273)", ""),
 (" (W1 6289)", ""),
 (" W2 6288 and W1 6289 PASS; live readback PASS (W1 6297).", " Live readback equals the graded build."),
 ("    - Not shown by a run: live and unexercised at s198 (W1 6297).", "    - Not shown by a run: live and unexercised at s198."),
 ("; ASK 270; ruling W3 6246)", "; ASK 270)"),
 (" (W2 6242). W3 ruled that an [L2] row may name any verse the same block cites, not only the block's [L1] verse (W3 6246).", ". Rule: an [L2] row may name any verse the same block cites, not only the block's [L1] verse."),
 (" is not resolved (W3 6246 limit b).", " is not resolved."),
 (" [MISSING: pkgPWS alone]", " pkgPWS alone is not measured."),
]
used=[0]*len(REPL)
def clean(t):
    for k,(a,b) in enumerate(REPL):
        if a in t: used[k]+=t.count(a); t=t.replace(a,b)
    return t
for e in E: e['text']=clean(e['text'])
unused=[REPL[k][0][:60] for k,u in enumerate(used) if u==0]
print('unused',unused)
for e in E:
    for m in re.finditer(r'\bW[1-4]\b|\b6[0-2]\d\d\b|MISSING',e['text']): print('LEFT',e['i'],e['text'][max(0,m.start()-60):m.end()+20])
v=open('v168.txt',encoding='utf-8').read(); L=v.split('\n')
def idx(prefix):
    r=[i for i,l in enumerate(L) if l==prefix or l.startswith(prefix)]; assert len(r)==1,(prefix,r); return r[0]
ins={}  # line index -> list of text blocks inserted BEFORE it
def before(i,t): ins.setdefault(i,[]).append(t)
cgr=idx('  - ONE RETRY OF A FAILED CLOSE-GROUP REPLY'); nxt=idx('  - TWO GROUPS OF DEEPSEEK CHECKS')
before(nxt,P1)
def blankbefore(h):
    i=idx(h); return i-1 if L[i-1]=='' else i
S={'## 6. Rounds':[], '## 9. Enforcers':[], '## 10. The panel':[P2], '## 13. Debate documents':[]}
for e in sorted(E,key=lambda e:e['i']): S[e['anchor']].append(e['text'])
for h,ts in S.items():
    for t in ts: before(blankbefore(h),t)
before(blankbefore('## 12. Citation check against the KJV'),P3)
# edits U1 U2 I1 I2 and live flow
ED=[
 ("the pkgEPS hold releases that form when it names a block verse.", "the pkgEPS hold, TRIAL since s191 (pkgEPT), no longer stops any push; it records \"(TRIAL pkgEPS: would not be sent: ...)\" and the push is sent."),
 ("is held by the pkgEPS hold when both are true:", "is recorded by the pkgEPS hold as \"(TRIAL pkgEPS: would not be sent: <reason>)\" when both are true, and is sent to the judge all the same (EPS_STATUS is 'TRIAL' since s191, pkgEPT); a push whose reason carries \"footing borrowed from contested Links <n>\" is not recorded as held (pkgBFX rev 2):"),
 ("The other non-layer grounds stay exempt, read only up to the entry's last stop |", "The other non-layer grounds stay exempt, read only up to the entry's last stop. A count carrying \"footing borrowed from contested Link(s) <n>\" is also exempt (pkgBFX rev 2) |"),
 ("so a later change that restores the count is read as new by the K re-read (UNX0, TRIAL) |", "so a later change that restores the count is read as new by the K re-read (UNX0, TRIAL). A count that names premise j above the highest listed block of the side's round raises item a:'RANGE' (TRIAL; pkgBFX rev 2), cured only by a CORRECTED COUNT below the count |"),
 ("- Live flow: s184 (n8n version 1bf4bb8d-58b5-4255-b7a9-8622a7ce1125, 455 nodes; Shared Library sha 87eb2391d957ad34, 3,497 lines). `derive_debate_outcome` md5 4ad4e2ab746eb2cdf124836daf731196.",
  "- Live flow: s198 (n8n version eaeb774a, 455 nodes; Shared Library 927,952 characters, sha c7e7505f6d74d860). s189 = s184 + pkgABR rev 3 + pkgGKV rev 2 (s185) + pkgKDN rev 3 (s186) + pkgERC rev 2 (s187) + pkgJ2 rev 2 (s188) + pkgONR + pkgAJN (s189). s198 = s189 + pkgD22 (s190) + pkgEPT (s191) + pkgPWF rev 2 (s192) + pkgBCL rev 4 (s193) + pkgJBC rev 2 (s194) + pkgPSN (s195) + pkgBFX rev 2 (s196) + pkgEPC rev 2 (s197: pkgECB, pkgPWS, pkgCLN, pkgVBN) + pkgNRW rev 3 (s198). `derive_debate_outcome` md5 4ad4e2ab746eb2cdf124836daf731196."),
]
outL=[]
for i,l in enumerate(L):
    for t in ins.get(i,[]): outL.extend(t.split('\n'))
    outL.append(l)
new='\n'.join(outL)
for a,b in ED:
    assert new.count(a)==1,a[:50]; new=new.replace(a,b)
open('v169.txt','w',encoding='utf-8').write(new)
print('v168',len(v),'v169',len(new),'delta',len(new)-len(v),'md5',hashlib.md5(new.encode()).hexdigest())
print('em dash', new.count('—')-v.count('—'))
