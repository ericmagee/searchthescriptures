// W1 grade of pkgPLT: for each of my 52 stored wrong-block items (w1_plants/scan_wrongblock_out.txt) and 20 no-block items, replay the node on live s116 and on the candidate and read which block each shows.
const fs=require('fs');process.chdir(__dirname+'/../..');const {rebuild}=require(process.cwd()+'/pkgLIB/unpack.cjs');const H=require(process.cwd()+'/pkgEAD/harness_clone.cjs');const S=JSON.stringify;
const W='/mnt/project-files/wall2024/';const wf=f=>{let d=JSON.parse(fs.readFileSync(f,'utf8'));d=d.data||d;return d.workflow||d;};
const A=wf(W+'fetchback_live_s116.json'),B=wf(W+'parent_s116_PLT.json');const ld=d=>{const by={};d.nodes.forEach(n=>by[n.name]=n);return n=>rebuild(by[n].parameters.jsCode,by['Shared Library'].parameters.jsCode);};const LA=ld(A),LB=ld(B);
const preds=n=>{const p=[];for(const [k,v] of Object.entries(A.connections))for(const outs of (v.main||[]))for(const c of (outs||[]))if(c.node===n)p.push(k);return p;};
const U=s=>S(s).replace(/\\\\n/g,'\n').replace(/\\n/g,'\n').replace(/\\"/g,'"');
const P=t=>{const o={};for(const m of t.matchAll(/ITEM (P\d+) \(E-PREM[^\n]*?number (\d+)\):\nTHE LIST ENTRY: ([^\n]{0,80})[\s\S]*?THE ANSWERING SIDE'S LINK-ROUND BLOCK FOR IT[^:]*: ([^\n]{0,60})/g))o[m[1]]={n:+m[2],e:m[3],b:m[4]};return o;};
const rows=fs.readFileSync('w1_plants/scan_wrongblock_out.txt','utf8').split('\n').filter(l=>l.startsWith('{')).map(JSON.parse).filter(r=>r.tag!==r.n);
const nb=fs.readFileSync('w1_plants/scan_noblock_out.txt','utf8');
(async()=>{const runs=[...new Set(rows.map(r=>r.key.split(' ')[0]))];const cache={};
 for(const rk of runs){const alt=/_Alt$/.test(rk);const run=rk.replace('_Alt','');const n=(alt?'Alt ':'')+'Judge Enforcer Build';const ip=preds(n).find(p=>H.out(run,p));
  try{cache[rk]={st:P(U(await H.run(rk.startsWith('x')?null:null||LA(n),run,ip,{}))),live:null};cache[rk].live=cache[rk].st;cache[rk].cand=P(U(await H.run(LB(n),run,ip,{})));}catch(e){cache[rk]={err:String(e.message).slice(0,100)};}}
 let ok=0,bad=0,miss=0;for(const r of rows){const [rk,p]=r.key.split(' ');const c=cache[rk];if(c.err){console.log(r.key,'ERROR',c.err);miss++;continue;}const lv=c.live[p],cd=c.cand[p];
  if(!lv||!cd){console.log(r.key,'item not in replay | stored entry:',r.entry.slice(0,40));miss++;continue;}
  const want='LINK '+r.tag;const good=new RegExp('^\\W*LINK '+r.tag+'\\b').test(cd.b);good?ok++:bad++;console.log(r.key,'n',r.n,'tag',r.tag,'| replay entry same',lv.e.slice(0,30)===r.entry.slice(0,30),'| live:',lv.b.slice(0,22),'| cand:',cd.b.slice(0,22),good?'OK':'WRONG');}
 console.log('WRONG-BLOCK items',rows.length,'| candidate shows tagged block',ok,'| wrong',bad,'| not reproduced',miss);})();
