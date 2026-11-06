# pkgGKW (W3 2299): in E-GATE, KEEP cures a CONTRADICTION item whose source is E-APPLY (a contradiction raised by the judge's own refused
# send-back change). The KEEP withdraws that change: its send-back answer is dropped before the gate re-applies, so it can never be applied
# later by another gate change, and the item is no longer raised (recorded "KEEP: change withdrawn"). A CONTRADICTION from E-GATE B (both lines in
# the judge text) still needs a CHANGE (2243). The judge prompt says so. Base: pkgG4W/patched (live be10d6ae). Run from wall2024/.
import os,json,hashlib
sha=lambda s:hashlib.sha256(s.encode()).hexdigest()[:16]
E_ALL=[("const its2=(its||[]).concat(add);",
 "const wd2299=new Set(G.filter(x=>x.kind==='CONTRADICTION'&&/^E-APPLY\\b/.test(String(x.src||''))&&A[x.gid]&&A[x.gid].ans==='KEEP').map(x=>x.sid)); /* pkgGKW (W3 2299): KEEP withdraws the refused change */\n const its2=(its||[]).filter(z=>!(z&&wd2299.has(z.sid))).concat(add);"),
 ("else if(a.ans==='KEEP'){const gch",
  "else if(a.ans==='KEEP'&&wd2299.has(x.sid)){cured=!now.has(x.key);why=cured?'KEEP: change withdrawn (the refused send-back change '+x.sid+' is dropped, and its contradiction is not in the judge text; W3 2299)':'KEEP: change withdrawn, but the item is still raised';}\n  else if(a.ans==='KEEP'){const gch")]
E_PROMPT=[("A KEEP answers only a NOT APPLIED item: that change then stays unapplied. Every other item",
 "A KEEP answers a NOT APPLIED item: that change then stays unapplied. A KEEP also answers a CONTRADICTION item whose source is E-APPLY (a contradiction your own refused send-back change would make): that change is then withdrawn and your line stays as it was. Every other item")]
NODES=['Gate_Build','Alt_Gate_Build','Gate_Record','Alt_Gate_Record','Alternate_Merge','Alternate_Merge_Seat']
plan={'base':'pkgG4W/patched','nodes':[]}
for n in NODES:
    f=n+'.js';o=open('pkgG4W/patched/'+f).read();s=o
    for a,b in E_ALL+(E_PROMPT if n.endswith('Gate_Build') else []):
        assert s.count(a)==1,(f,a);s=s.replace(a,b)
    open('pkgGKW/patched/'+f,'w').write(s);plan['nodes'].append({'file':f,'name':n.replace('_',' '),'base_sha':sha(o),'final_sha':sha(s)})
json.dump(plan,open('pkgGKW/plan_GKW.json','w'),indent=1);print(len(plan['nodes']),'nodes')
