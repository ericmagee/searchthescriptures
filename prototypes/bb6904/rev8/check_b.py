# Independent check of rule (b) on every DEFENDER LINK BROKEN line of the five debates (stored text only).
# Round names as the flow uses them: CR1/CR2/CR3 = defender rounds (claude_r1, claude_r2, engine_r3);
# DR1/DR2/DR3 = challenger rounds (engine_r1, engine_r2, challenger_r3). In five.json: dr1=claude_r1, dr2=claude_r2,
# dlink=engine_r3, cr1=engine_r1, cr2=engine_r2, clink=challenger_r3 (my key names are the reverse of the flow's).
# Rule (b): a pressed witness counts only if the judge quotes the sentence of the EARLIER round that pressed it
# (the challenger's DR1 or DR2) and names that round.
import json,re,sys
d=json.load(open(sys.argv[1]))
PT=re.compile(r'\bDR[12]\b')
QT=re.compile(r'"([^"]{15,})"|“([^”]{15,})”')
norm=lambda s:re.sub(r'\s+',' ',s or '').lower()
def text_of(raw):
    raw=raw or ''; head=raw.split('\n\n[AUDIT')[0]
    try: return json.loads(head).get('reasoning','')
    except Exception: return head
tot=0;rows=[]
for r in d:
    press=norm(r['cr1'])+' || '+norm(r['cr2'])
    for seat,raw in [('single',r['single'])]+[(j['seat'],j['raw']) for j in (r['judges'] or [])]:
        lines=text_of(raw).split('\n')
        for i,l in enumerate(lines):
            if 'DEFENDER LINK BROKEN' in l and re.match(r'\W*D\d+\s+vs',l):
                blk=l
                for m in lines[i+1:i+4]:
                    if re.match(r'\W*D\d+(\s+vs|:)',m) or re.match(r'[A-Z][A-Z -]{6,}:?(\s|$)',m.strip()) or not m.strip(): break
                    blk+='\n'+m
                tags=sorted(set(PT.findall(blk)))
                hits=[q for a,b in QT.findall(blk) for q in [a or b] if norm(q) in press]
                tot+=1; rows.append((r['tok'][5:10],seat,re.match(r'\W*(D\d+\s+vs\s+C\d+)',l).group(1),tags,len(hits),[h[:60] for h in hits]))
for x in rows: print(x)
print('BROKEN lines',tot,'| naming DR1/DR2',sum(1 for x in rows if x[3]),'| quoting text found in DR1/DR2',sum(1 for x in rows if x[4]),'| both',sum(1 for x in rows if x[3] and x[4]))
