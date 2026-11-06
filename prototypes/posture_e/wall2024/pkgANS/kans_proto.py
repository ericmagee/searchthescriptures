import json,re,sys
R=json.load(open('pkgANS/fixture_judgments_3runs.json'))
for r in R:
    t=r['verdict_raw']
    try: t=json.loads(t).get('reasoning',t)
    except Exception: pass
    r['t2']=t.replace('\\n','\n').replace('\\"','"')
Q=r'"((?:[^"\\]|\\.)*)"|“([^”]*)”'
STOP=set('the a an and or of to in on at by for with from that this these those is are was were be been it its his her their he she they them which who whom what as not no so but if then than there here into upon unto shall will would can could may might must do does did have has had i my me we our you your thee thou thy one any all each such only also very own same other same yet still even said says say verse word words text meaning means mean pressed press answer reads read own'.split())
def norm(s): return re.sub(r'\s+',' ',re.sub(r'[^a-z0-9: ]',' ',s.lower().replace("'s",''))).strip()
def stem(w): 
    for suf in ('ings','ing','edly','ed','es','s'):
        if len(w)>4 and w.endswith(suf): return w[:-len(suf)]
    return w
def keys(s): return {stem(w) for w in norm(s).split() if w not in STOP and len(w)>2 and not re.match(r'^[lgh]?\d+(:\d+)?$',w)}
def parse(l):
    m=re.match(r'^\W*ANSWER CHECK\s*:\s*(.+?)\s+--\s*\[\s*([CD]R\d)\s*\]\s*--\s*MEANS\s*:\s*(.*)$',l)
    if not m: return None
    ref,rnd,rest=m.groups()
    a=rest.find('-- ANSWER:'); 
    if a<0: return {'ref':ref,'rnd':rnd,'bad':'no ANSWER slot','l':l}
    means=rest[:a]; tail=rest[a+10:]
    v=re.search(r'\s--\s*(MEETS|MISSES|FAILS)\b',tail)
    if not v: return {'ref':ref,'rnd':rnd,'bad':'no verdict','l':l}
    ans=tail[:v.start()]; after=tail[v.end():]
    qa=lambda s:' '.join(x[0] or x[1] for x in re.findall(Q,s))
    return {'ref':ref,'rnd':rnd,'means':qa(means) or means,'ans':qa(ans) or ans,'verdict':v.group(1),'q':qa(after),'after':after.strip(),'l':l}
out=[]
for r in R:
    t=r['t2'];seat=r['run_token'][5:10]+' '+r['judge_seat']
    for l in t.split('\n'):
        p=parse(l.strip())
        if not p or p.get('bad') or p['verdict']!='MEETS': continue
        km=keys(p['means']); ka=keys(p['ans']); kq=keys(p['q'])
        q_in_a = bool(p['q']) and norm(p['q']) in norm(p['ans'])
        ov=km & ka
        p.update(seat=seat,q_in_a=q_in_a,ov=sorted(ov),km=sorted(km))
        out.append(p)
json.dump(out,open('pkgANS/meets_out.json','w'))
import collections
c=collections.defaultdict(lambda:[0,0,0,0])
for p in out:
    x=c[p['seat']];x[0]+=1;x[1]+=p['q_in_a'];x[2]+=(not p['ov']);x[3]+=(not p['ov'] and not p['q_in_a'])
for k,v in c.items(): print(k,'MEETS',v[0],'quote-in-answer',v[1],'no-key-overlap',v[2],'both-fail',v[3])
