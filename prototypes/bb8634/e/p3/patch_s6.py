# BB-8634 S6 (8665 T3 for the debaters; 8668/8669 code): the judges see, computed by code, how many served labels each side cited and which cited labels were not served.
import sys
HELP=("// BB-8634 S6 (8668, 8669): served labels a side cites and labels it cites unserved, counted by code from its raw rounds. Forms: S-N, Sight N, Sights N (first number only); #N, Conclusion N.\n"
"const SLX=(rounds)=>{const t=rounds.map(x=>String(x||'')).join('\\n');const c=new Set();for(const m of t.matchAll(/(?:\\bS-|\\bSights?\\s+)(\\d+)(?!\\d)/g))c.add('S-'+m[1]);for(const m of t.matchAll(/(?:#|\\bConclusion\\s+#?)(\\d+)(?!\\d)/g))c.add('#'+m[1]);return c;};\n"
"const SLC=(served,named,rounds)=>{const L=Array.isArray(served)?served:[];const c=SLX(rounds);const ok=new Set([...L,...(Array.isArray(named)?named:[])]);const hit=L.filter(l=>c.has(l));const un=[...c].filter(x=>!ok.has(x));return hit.length+' of '+L.length+(hit.length?' ('+hit.join(', ')+')':'')+'; unserved labels cited: '+(un.length?un.join(', '):'none');};\n")
A="name it in your justification as a citation error.'"
def patch(path,ig,r):
    s=open(path).read()
    if s.count(A)!=1: sys.exit('STOP anchor '+path)
    line=A+"+' SERVED LABELS CITED -- computed by the system from the rounds, not by a model: DEFENDER '+SLC("+ig+".d_served,"+ig+".d_named,["+r+".cr1,"+r+".cr2,"+r+".cr3])+'. CHALLENGER '+SLC("+ig+".c_served,"+ig+".c_named,["+r+".gr1,"+r+".gr2,"+r+".dr3])+'.'"
    s=HELP+s.replace(A,line); open(path,'w').write(s)
patch('p3/new/Panel_Build.js','IG','F')
patch('p3/new/Build_Independent_Verdict.js',"$('Init with Guards').first().json",'d')
print('ok')
