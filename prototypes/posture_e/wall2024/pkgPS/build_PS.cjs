// pkgPS (W3 Wall 2446, E-PREM ruling 2): the premise scope check. Run from wall2024/: node pkgPS/build_PS.cjs
// Base: pkgPAY/patched (stack ... pkgKV, pkgKCMT, pkgPAY). Edits sbApply2024 in the 6 nodes that carry it (Gate Build, Gate Record,
// Alt Gate Build, Alt Gate Record, Alternate Merge, Alternate Merge Seat).
// A send-back CHANGE TO for an E-PREM item ("premise listed against the <side> N") that changes the grade of a premise the item does not name
// is NOT APPLIED and keeps its original line, as pkgCP does for collisions. The named premises are those of every E-PREM item the seat was sent
// on the same flagged line (gemini 33040 S5 and S6 name premises 2 and 3 of one line, and both answers write both). A change is also refused
// when it moves the line's count by more than the number of named premises, or moves the line to the other side.
// psGrades reads a CONCEDED LINKS line into premise grades (COUNTED, VOID, SPARED); each clause takes its first grade word.
// Test case (W3): grok 33040 S18 moved the defender count from 0 to 5 for an item naming premise 2.
// (b) Line-exact apply (found by this test, a live defect): build() replaced each changed line as a SUBSTRING of the whole text, so a change to
//     "CONCEDED LINKS: 0" also rewrote the inside of "CHALLENGER CONCEDED LINKS: 0" (gemini 33040: the challenger line became "CHALLENGER " plus
//     the defender's new line, and the challenger's own changes S5 and S6 then found no line). build() now replaces whole lines only.
const fs=require('fs');const crypto=require('crypto');const sha=s=>crypto.createHash('sha256').update(s).digest('hex').slice(0,16);
const BASE=process.env.BASE||'pkgPAY/patched';const OUT=process.env.OUT||'pkgPS';
const PSG=fs.readFileSync(__dirname+'/psGrades.js','utf8').trim();
const A="  {const CM=/^\\s*(?:[-\\u2022]|\\d+[.)])?\\s*(DEFENDER|CHALLENGER)\\s+CHAIN MARK\\s*:/i;";
const B="  if(x.rule==='E-PREM'){const cu=map.has(o)?map.get(o).to:o;const P=psGrades(to),Q=psGrades(cu); /* pkgPS (W3 2446 E-PREM 2): a premise change stays inside the premises its items name */\n"
 +"   if(P&&Q){const iq=s=>{const m=String(s||'').match(/against the (defender|challenger)\\s+(\\d+)/i);return m?{side:m[1].toUpperCase(),n:+m[2]}:null;};const nl=nrm(x.line);\n"
 +"    const named=new Set(ch.filter(y=>y.rule==='E-PREM'&&nrm(y.line)===nl).map(y=>iq(y.item)).filter(Boolean).map(y=>y.n));const known=k=>(k in Q.g)?Q.g[k]:(!Object.keys(Q.g).length&&Q.n===0?'SPARED':null);\n"
 +"    const moved=Object.keys(P.g).map(Number).filter(k=>known(k)!=null&&known(k)!==P.g[k]);const out=moved.filter(k=>!named.has(k));const jump=P.n!=null&&Q.n!=null&&Math.abs(P.n-Q.n)>named.size;\n"
 +"    if(P.side!==Q.side||out.length||jump){items.push({sid:x.sid,kind:'NOT APPLIED',why:P.side!==Q.side?'the change moves the '+Q.side+' CONCEDED LINKS line to the '+P.side+' side (pkgPS, W3 2446)':'the change regrades '+(out.length?'premise'+(out.length>1?'s ':' ')+out.join(', '):'the count from '+Q.n+' to '+P.n)+', which '+(out.length>1?'its items do':'its item does')+' not name (named: '+([...named].join(', ')||'none')+'; pkgPS, W3 2446: a premise change stays inside the premises its items name)',to,lines:[o]});continue;}}}\n"+A;
const C="const build=M=>{let t=text;for(const [o,c] of M)t=t.split(o).join(c.to);return t;};";
const D="const build=M=>text.split('\\n').map(l=>M.has(l)?M.get(l).to:l).join('\\n'); /* pkgPS (b): whole lines only; a substring replace rewrote CHALLENGER CONCEDED LINKS: 0 along with CONCEDED LINKS: 0 (gemini 33040) */";
const plan={base:BASE,nodes:[]};fs.mkdirSync(OUT+'/patched',{recursive:true});
for(const f of fs.readdirSync(BASE).sort()){const b=fs.readFileSync(BASE+'/'+f,'utf8');let t=b;const ed=[];
 if(t.includes('function sbApply2024')){if(t.split(A).length-1!==1)throw new Error(f+' A');t=t.replace(A,()=>B);const k='function sbApply2024(';t=t.replace(k,()=>'// pkgPS: premise grades of a CONCEDED LINKS line\n'+PSG+'\n'+k);ed.push('sbApply2024: premise scope check');if(t.split(C).length-1!==1)throw new Error(f+' C');t=t.replace(C,()=>D);ed.push('sbApply2024: line-exact apply');}
 new Function('$','$input','$json',t);fs.writeFileSync(OUT+'/patched/'+f,t);plan.nodes.push({file:f,name:f.replace(/\.js$/,'').replace(/_/g,' '),base_sha:sha(b),final_sha:sha(t),edits:ed});}
fs.writeFileSync(OUT+'/plan_PS.json',JSON.stringify(plan,null,1));console.log(plan.nodes.length+' nodes; edited '+plan.nodes.filter(n=>n.edits.length).map(n=>n.file).join(', '));
