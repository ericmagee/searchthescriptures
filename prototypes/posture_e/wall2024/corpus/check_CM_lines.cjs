// W2 independent check of pkgCM (b) on the older runs: W1's regression kept the stored send-back lines; here each stored line that the
// base Judge Enforcer Build writes is replaced by the line pkgCM's build writes for the same item, and the gate (sbApply, gate items, gate
// cures) is run with pkgCM on both. Run from wall2024/: node corpus/check_CM_lines.cjs
const fs=require('fs');const rd=f=>fs.readFileSync(f,'utf8');const {load}=require('./replay_node.cjs');
const mkS=N=>name=>{if(name==='Resolve Seats'){const j={deepseek:{api_model:'x',max_tokens:16000}};return {isExecuted:true,first:()=>({json:j}),all:()=>[{json:j}]};}const r=N.nodes[name];if(!r)return {isExecuted:false,first:()=>{throw new Error('no '+name)},all:()=>[]};const it=r[r.length-1]||[];return {isExecuted:true,first:()=>({json:it[0]}),last:()=>({json:it[it.length-1]}),all:()=>it.map(j=>({json:j}))};};
const jeb=(f,N)=>{const o=new Function('$','$input','$json',rd(f))(mkS(N),{first:()=>({json:{}}),all:()=>[]},{});const L=[];for(const x of o){const j=x.json;for(const r of (j.code_rows||[]))L.push(r);for(const r of (j.ids||[]))L.push(r);}return L;};
const mk=p=>{const AM=rd(p+'/Alternate_Merge.js');return new Function('$','$input',AM.slice(0,AM.indexOf("const AM=$('Alternate Merge Seat')"))+'\nreturn {gateItems2024,gateCure2024,ciRounds,gatePromptText2024,drvLinks,sbApply2024};')(()=>{throw 0},null);};
const L=mk('pkgCM/patched');
const gate=(X,seat)=>{const b=X.bodies.find(b=>b.seat===seat);const its=X.sb_items.filter(x=>x.seat===seat&&x.rule!=='E-GATE');if(!b||!its.length)return null;const PT=L.gatePromptText2024(X.PB.judges.find(q=>q.seat===seat).body);const ctx={R:L.ciRounds(PT),DL:L.drvLinks(PT),ask:PT.includes('CITATION CHECK')};
 const A=L.sbApply2024(seat,b.verdict_raw,b.fields,its,ctx.R);const R=L.gateItems2024(seat,b.verdict_raw,b.fields,its,ctx);const rep=(X.gate_replies||{})[seat];const c=rep&&R.items.length?L.gateCure2024(seat,b.verdict_raw,b.fields,its,R.items,rep,ctx):{res:[],uncured:0};
 return {applied:[...(A.applied||[])].sort().join(','),notap:(A.items||[]).map(z=>z.sid+':'+z.kind).sort().join(','),G:R.items.map(g=>g.gid+':'+g.kind+':'+g.src).join(','),cur:c.res.map(r=>r&&r.cured?'C':'U').join(''),n:c.uncured};};
let tot=0,swapped=0,diff=0;
for(const run of ['32998','33014','33020','33021','33025','33040']){const X=JSON.parse(rd('corpus/fix_'+run+'.json'));const N=load(run);const a=jeb('pkgCM/base/Judge_Enforcer_Build.js',N),b=jeb('pkgCM/patched/Judge_Enforcer_Build.js',N);
 const m=new Map();a.forEach((x,i)=>{if(b[i]&&x.seat===b[i].seat&&x.rule===b[i].rule&&x.flagged_line!==b[i].flagged_line)m.set(x.seat+'|'+x.flagged_line,b[i].flagged_line);});
 const Y=JSON.parse(JSON.stringify(X));let s=0;for(const it of Y.sb_items){const k=it.seat+'|'+it.line;if(m.has(k)){it.line=m.get(k);s++;}}tot+=X.sb_items.length;swapped+=s;
 for(const seat of [...new Set(X.sb_items.map(x=>x.seat))]){const g0=gate(X,seat),g1=gate(Y,seat);const same=JSON.stringify(g0)===JSON.stringify(g1);if(!same)diff++;
  console.log(run+' '+seat+': '+(same?'same':'DIFFERS')+(same?'':'\n   stored lines: '+JSON.stringify(g0)+'\n   pkgCM lines:  '+JSON.stringify(g1)));}
 console.log(run+': send-back lines replaced by the pkgCM line: '+s+' of '+X.sb_items.length);}
console.log('total replaced '+swapped+' of '+tot+'; seats whose gate result differs: '+diff);
