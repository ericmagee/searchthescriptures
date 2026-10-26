# Rev 9 library patch (Worker_E, BB-7397 DoD 19 and DoD 24 (1)): the same three replacements in each of the 14 library copies; each must hit once.
import sys,glob,hashlib
R=[
("// before each naming to 1,200 after, kept inside the LINK block that holds the naming (7194 defect 1: a whole block let an unrelated sentence cure).\nfunction cureNamed(line,LR){",
 "// before each naming to 1,200 after, kept inside the LINK block that holds the naming (7194 defect 1: a whole block let an unrelated sentence cure).\n// BB-7397 rev 9 DoD 19: w widens each window by w characters on each side, inside the LINK block; left and right hold the two margins alone,\n// so a quotation found in the widened text and in neither margin alone overlaps the window. w 0 is the window as before.\nfunction cureNamed(line,LR,w){w=w>0?w:0;"),
("const win=(pos)=>{let a=0,b=LR.length;for(const x of heads){if(x<=pos)a=x;else{b=x;break;}}return LR.slice(Math.max(a,pos-300),Math.min(b,pos+1200));};\n const by={};for(const r of cureRefs(LR))if(want.has(r.key))(by[r.key]=by[r.key]||[]).push(win(r.pos));\n return Object.keys(by).map(k=>({ref:k,blocks:by[k]}));}",
 "const span=(pos)=>{let a=0,b=LR.length;for(const x of heads){if(x<=pos)a=x;else{b=x;break;}}const lo=Math.max(a,pos-300),hi=Math.min(b,pos+1200);return {t:LR.slice(Math.max(a,lo-w),Math.min(b,hi+w)),l:LR.slice(Math.max(a,lo-w),lo),r:LR.slice(hi,Math.min(b,hi+w))};};\n const by={};for(const r of cureRefs(LR))if(want.has(r.key))(by[r.key]=by[r.key]||[]).push(span(r.pos));\n return Object.keys(by).map(k=>({ref:k,blocks:by[k].map(x=>x.t),left:by[k].map(x=>x.l),right:by[k].map(x=>x.r)}));}"),
("const shortOk=pr=>{const nm=namedIn(pr);return !nm.length||o.short.some(s=>U(s.link)===U(x.link)&&nm.some(z=>z.k===s.round&&ownQ(s.q,z.k)&&z.n.some(n=>n.blocks.some(b=>cureFound(s.q,b)))))||stmtQ(stmtOf(x)).some(q=>nm.some(z=>ownQ(q,z.k)&&z.n.some(n=>n.blocks.some(b=>cureFound(q,b)))));};",
 "// BB-7397 rev 9 DoD 19: a quotation counts when it overlaps a window: found in the window widened by twice its length and 40 characters,\n  // and in neither margin alone (a second occurrence inside a margin makes the test refuse, never accept).\n  const inWin=(q,z)=>cureNamed(x.line,R[z.k],2*String(q).length+40).some(n=>n.blocks.some((b,i)=>cureFound(q,b)&&!cureFound(q,n.left[i])&&!cureFound(q,n.right[i])));\n  const shortOk=pr=>{const nm=namedIn(pr);return !nm.length||o.short.some(s=>U(s.link)===U(x.link)&&nm.some(z=>z.k===s.round&&ownQ(s.q,z.k)&&inWin(s.q,z)))||stmtQ(stmtOf(x)).some(q=>nm.some(z=>ownQ(q,z.k)&&inWin(q,z)));};"),
("function cureReport(seat,v){",
 "// BB-7397 rev 9 DoD 24: STATEMENT and JUDGE STATEMENT above 600 characters are cut at the last space at or before 597, with \"...\".\nfunction cureCut(s){s=String(s);if(s.length<=600)return s;const k=s.lastIndexOf(' ',597);return s.slice(0,k>0?k:597).replace(/\\s+$/,'')+'...';}\nfunction cureReport(seat,v){"),
("+(x.statement?'; STATEMENT: '+cureSafe(x.statement.slice(0,600)):'')+'; JUDGE STATEMENT: '+(x.judge_statement?cureSafe(String(x.judge_statement).slice(0,600)):'none written')+']');}",
 "+(x.statement?'; STATEMENT: '+cureSafe(cureCut(x.statement)):'')+'; JUDGE STATEMENT: '+(x.judge_statement?cureSafe(cureCut(x.judge_statement)):'none written')+']');}"),
]
fs=sorted(f for f in glob.glob('new13/*.js') if 'function cureNamed' in open(f).read())
assert len(fs)==14,len(fs)
for f in fs:
  s=open(f).read()
  for a,b in R:
    assert s.count(a)==1,(f,a[:60],s.count(a)); s=s.replace(a,b)
  open(f,'w').write(s)
i=lambda s:(s.find('function drvExhibits'),s.find('\n',s.find('function cureProse')))
print(set(hashlib.md5((lambda s:s[i(s)[0]:i(s)[1]])(open(f).read()).encode()).hexdigest() for f in fs))
