# pkgQ: K-W CONCEDED anchored to the form word (W3 ruling, WALL-2024 reply 2224). Base: merged_PW (= live 68fe69cd + pkgP + pkgW). Offline only.
import glob,os,json,hashlib
OUT='patched'; os.makedirs(OUT,exist_ok=True)
OLD="const kwCo=t=>/\\bCONCEDED\\b/i.test(String(t).replace(/\\b(?:NOT|NEVER|NO\\s+LONGER)\\s+(?:(?:BEEN|BE)\\s+)?CONCEDED\\b/gi,' ').replace(/\\bCONCEDED\\s+LINKS?\\b/gi,' '));"
NEW="const kwCo=t=>/(?:^|[.;!?]\\s+|:\\s+)\\**CONCEDED\\**(?!\\s+LINKS?\\b)\\s*(?::|;|\\.|--|\\u2014|$)/.test(String(t)); /* pkgQ (WALL-2024 2224, 2226): CONCEDED is the uppercase form word at a sentence start (start of text, or after . ; ! ? :), then : ; . -- or the end; never conceded in prose, never CONCEDED LINKS */"
sha=lambda s:hashlib.sha256(s.encode()).hexdigest()[:16]
plan={'base':'merged_PW','nodes':[]}
for f in sorted(glob.glob('../merged_PW/*.js')):
    n=os.path.basename(f); s=open(f).read(); o=s; k=s.count(OLD)
    if not k: continue
    assert k==1,n; s=s.replace(OLD,NEW); open(OUT+'/'+n,'w').write(s)
    plan['nodes'].append({'file':n,'name':n[:-3].replace('_',' '),'base_sha':sha(o),'final_sha':sha(s),'edits':['K-W CONCEDED anchored']})
json.dump(plan,open('plan_Q.json','w'),indent=1); print(len(plan['nodes']))
