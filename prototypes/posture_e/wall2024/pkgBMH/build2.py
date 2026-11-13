# pkgBMH rev 2: barred-move harvest. A: "no verse (that|which) states". B narrowed: "Against C<n>/D<n>" headings open a block
# in which only the "no verse/row ... states" form is harvested; such a block ends at the next answer line. GIVE: "I rest on no".
import json,hashlib
src='/mnt/project-files/wall2024/fetchback_live_s179.json'
d=json.load(open(src)); w=d.get('data',d)
E=[(r"\bno\s+(?:verse|row|text|word|witness)s?\s+(?:states?", r"\bno\s+(?:verse|row|text|word|witness)s?\s+(?:(?:that|which)\s+)?(?:states?"),
   (r"rest\s+nothing)", r"rest\s+(?:nothing|on\s+no))"),
   ("const ANS=/", r"const AG=/\bagainst\s+[CD]\d/i;const ANS=/"),
   ("if(end){cur.e=a;", "if(end||cur.ag&&ANS.test(l)){cur.e=a;"),
   ("&&ANS.test(l))cur={s:a,md:lv,head:l.trim().slice(0,80)};", "&&(ANS.test(l)||AG.test(l)))cur={s:a,md:lv,head:l.trim().slice(0,80),ag:!ANS.test(l)};"),
   ("if(!m||GIVE.test(unq(s)))continue;", r"if(!m||GIVE.test(unq(s))||BL.some(b=>b.ag&&pos>=b.s&&pos<b.e)&&!/^no\s/i.test(m[0]))continue;")]
names=[f"{p}B {k}" for p in ['C1','C2','C3','C4','D2','D3','D4'] for k in ['Build','Extract']]
tot=0;done=[]
for n in w['nodes']:
    if n['name'] in names:
        s=n['parameters']['jsCode'];t=s
        for o,x in E:
            assert t.count(o)==1,(n['name'],o); t=t.replace(o,x)
        n['parameters']['jsCode']=t; tot+=len(t)-len(s); done.append(n['name']); print(n['name'],len(t)-len(s))
assert len(done)==14
print('total',tot)
out='/mnt/project-files/wall2024/parent_s179_BMH2.json'
b=json.dumps(d,ensure_ascii=False).encode()
open(out,'wb').write(b); print('sha',hashlib.sha256(b).hexdigest()[:16])
