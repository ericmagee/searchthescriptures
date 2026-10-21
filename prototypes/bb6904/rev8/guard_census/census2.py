# A3 census v2 (BB-7212 item 2): stored judgments since 30bd621c (13 Oct 01:27Z) that grade a link UNEXHIBITED or WITHDRAWN under the guard.
# A sentence counts when it names the guard (guard-inadmissible / who-belongs) and WITHDRAWN or UNEXHIBITED, with no negation
# ("not triggered", "does not", "not a who-belongs", "neither", "no who-belongs", "not withdrawn"). Keystone: the KEYSTONE line, or a sentence
# that says the keystone or the conclusion link is withdrawn under the guard.
import json,re,collections
rows=json.load(open('rows.json'))
def txt(x):
    h=(x or '').split('\n\n[AUDIT')[0]
    try: return json.loads(h).get('reasoning') or h
    except Exception: return h
G=re.compile(r'guard[- ]inadmissible|who[- ]belongs',re.I);GR=re.compile(r'withdrawn|unexhibited',re.I)
NEG=re.compile(r'not triggered|does not|did not|not a who-belongs|neither|no who-belongs|not withdrawn|is not|not issue|not trigger|nor ',re.I)
deb=collections.OrderedDict()
for r in rows:
    sents=[s for l in txt(r['x']).split('\n') for s in re.split(r'(?<=[.;])\s+',l)]
    g=[s for s in sents if G.search(s) and GR.search(s) and not NEG.search(s)]
    ks=[s for s in g if re.search(r'keystone|conclusion|KEYSTONE',s,re.I)]
    res=next((l for l in txt(r['x']).split('\n') if re.match(r'^\W*RESULT\s*:',l)),'')
    deb.setdefault(r['tok'][5:10],dict(at=r['at'][:16],dc=r['dc'],outcome=r['outcome'],topic=r['topic'],j=[]))['j'].append(dict(seat=r['seat'],graded=len(g)>0,keystone=len(ks)>0,res=re.sub(r'^\W*RESULT\s*:\s*','',res)[:16],ex=(ks or g or [''])[0][:220]))
out=[];tot=collections.Counter()
for k,d in deb.items():
    G_=[j['seat'] for j in d['j'] if j['graded']];K=[j['seat'] for j in d['j'] if j['keystone']]
    if not G_:continue
    topic='other sheep (John 10:16)' if 'other sheep' in d['topic'] else d['topic']
    out.append(dict(tok=k,at=d['at'],dc=d['dc'],outcome=d['outcome'],topic=topic,graded=G_,keystone=K,judges=d['j']))
    tot[(topic,d['dc'],str(d['outcome']),bool(K))]+=1
json.dump(out,open('census2.json','w'),indent=1)
for o in out:print(f"{o['tok']} {o['at']} [{o['dc']}] {o['outcome']} | {o['topic'][:40]} | graded under guard: {', '.join(o['graded'])} | keystone turned: {', '.join(o['keystone']) or '-'}")
print();[print(k,n) for k,n in sorted(tot.items(),key=str)]
