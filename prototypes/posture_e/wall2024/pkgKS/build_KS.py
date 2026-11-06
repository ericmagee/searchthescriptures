# pkgKS (W3, after Wall 2334): a FORCED line exempts or cures a link-scoped item only for the side it breaks, read from its MEANS round:
# MEANS [CRn] breaks the challenger's link, MEANS [DRn] breaks the defender's link. Before, every FORCED reader matched the link id only, so
# grok's FORCED D1 vs C2 (MEANS [CR3], a break of the challenger) kept K-G4 from being raised on its DEFENDER LINK BROKEN grade of D1 vs C2
# (run 33020 grok G2). Sites: __kfHas and its drvCheck call (K-G1/K-G4 NOT RAISED), the K-G4 cure's FORCED line in the reply, kfLines'
# "no FORCED line" test (K-F), and gateForced2024 (pkgGF). Base: pkgFC/patched (24 nodes). Run from wall2024/.
import os,json,hashlib
sha=lambda s:hashlib.sha256(s.encode()).hexdigest()[:16]
SD="(/^CR/i.test(m[2])?'CHALLENGER':'DEFENDER')"
E=[
 ("function __kfHas(text,id){","function __kfHas(text,id,side){"),
 ("return !!m&&m[1].replace(/\\s+vs\\.?\\s+/i,' vs ').toUpperCase()===String(id).toUpperCase();});}catch(e){return false;}}",
  "return !!m&&m[1].replace(/\\s+vs\\.?\\s+/i,' vs ').toUpperCase()===String(id).toUpperCase()&&(!side||"+SD+"===String(side).toUpperCase());});}catch(e){return false;}} /* pkgKS: the side the FORCED line breaks, read from its MEANS round */"),
 ("else if(__kfHas(text,id)){","else if(__kfHas(text,id,side)){"),
 ("return !!m&&U(m[1].replace(/\\s+vs\\.?\\s+/i,' vs '))===U(x.link);});if(fz.length)",
  "return !!m&&U(m[1].replace(/\\s+vs\\.?\\s+/i,' vs '))===U(x.link)&&(!x.side||"+SD+"===U(x.side));});if(fz.length)"),
 ("forced.add(id);","forced.add(id+'|'+"+SD+");"),
 ("if(forced.has(id)||items.some(x=>x.link===id))continue;",
  "{const sd=(l.match(/\\b(DEFENDER|CHALLENGER)\\s+LINK\\s+BROKEN/i)||[])[1];if(sd?forced.has(id+'|'+sd.toUpperCase()):[...forced].some(z=>z.startsWith(id+'|')))continue;} /* pkgKS */if(items.some(x=>x.link===id))continue;"),
 (" const mine=[...new Set(segs.filter(s=>id(s)===lk.toUpperCase()))];if(!mine.length)return null;const R=(ctx&&ctx.R)||{};",
  " const sideOf=s=>{const m=s.match(/MEANS\\s*\\[{0,2}\\s*((?:CR|DR)[1-4])/i);return m?(/^CR/i.test(m[1])?'CHALLENGER':'DEFENDER'):null;};const sd=String(String(x.key||'').split('|')[2]||'').toUpperCase(); /* pkgKS */\n const all=[...new Set(segs.filter(s=>id(s)===lk.toUpperCase()))];const mine=all.filter(s=>!sd||sideOf(s)===sd);if(!mine.length){if(all.length)return {cured:false,why:'the FORCED line for '+lk+' breaks the '+String(sideOf(all[0])||'other').toLowerCase()+' link (read from its MEANS round), not the '+sd.toLowerCase()+' link this item grades (pkgKS)',line:all[0]};return null;}const R=(ctx&&ctx.R)||{};"),
]
plan={'base':'pkgFC/patched (6bffc3f)','nodes':[]}
for f in sorted(os.listdir('pkgFC/patched')):
    o=open('pkgFC/patched/'+f).read();s=o;used=[]
    for i,(a,b) in enumerate(E):
        n=s.count(a);assert n<=1,(f,i,n)
        if n:s=s.replace(a,b);used.append(i)
    if not used:continue
    open('pkgKS/patched/'+f,'w').write(s);plan['nodes'].append({'file':f,'name':f[:-3].replace('_',' '),'base_sha':sha(o),'final_sha':sha(s),'edits':used})
json.dump(plan,open('pkgKS/plan_KS.json','w'),indent=1);print(len(plan['nodes']),'nodes');[print(' ',x['file'],x['edits']) for x in plan['nodes']]
