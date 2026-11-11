// W1 grade of pkgRTE rev 1 (W3) with W1's own plants (w1_plants/plants_DS1_F1_F2_w1.json, F1 R1-R10, F2 B1-B10), on stored 34780 (and 34726 controls).
const fs=require('fs');process.chdir(__dirname+'/../..');const {rebuild}=require(process.cwd()+'/pkgLIB/unpack.cjs');const H=require(process.cwd()+'/pkgEAD/harness_clone.cjs');const S=JSON.stringify;
const W='/mnt/project-files/wall2024/';const wf=f=>{let d=JSON.parse(fs.readFileSync(f,'utf8'));d=d.data||d;return d.workflow||d;};
const A=wf(W+'fetchback_live_s116.json'),B=wf(W+'parent_s116_RTE.json');
const load=d=>{const by={};d.nodes.forEach(n=>by[n.name]=n);const c={};return n=>c[n]||(c[n]=rebuild(by[n].parameters.jsCode,by['Shared Library'].parameters.jsCode));};const LIVE=load(A),CAND=load(B);
const crypto=require('crypto');console.log('cand sha',crypto.createHash('sha256').update(fs.readFileSync(W+'parent_s116_RTE.json')).digest('hex').slice(0,16));
const dn=B.nodes.filter(n=>S(n)!==S(A.nodes.find(x=>x.name===n.name))).map(n=>n.name+' '+(n.parameters.jsCode.length-A.nodes.find(x=>x.name===n.name).parameters.jsCode.length));const {nodes:_1,...ra}=A,{nodes:_2,...rb}=B;
console.log('SIZE changed nodes:',dn.join('; '),'| node count',A.nodes.length,B.nodes.length,'| connections and rest equal',S(ra)===S(rb));
const mkbase=f=>{const ex=JSON.parse(fs.readFileSync(W+f,'utf8'));const r=(ex.data||ex).resultData.runData;const base={};for(const [n,runs] of Object.entries(r)){const last=runs[runs.length-1];base[n]=(last&&last.data&&last.data.main)||null;}return base;};
const J=o=>JSON.parse(S(o));const mk=o=>new Proxy(o,{has:()=>true,get:(t,k)=>k in t?t[k]:null});
const run=async(src,node,inp,st)=>(await H.run(src(node),'x',inp,mk(st))).map(x=>x.json);
const ms=a=>a.map(x=>S(x)).sort();const diffMS=(a,b)=>{const A=ms(a),B=ms(b);const gone=A.filter(x=>{const i=B.indexOf(x);if(i<0)return true;B.splice(i,1);return false;});return {gone,added:B};};
(async()=>{
 const base=mkbase('ex34780_full.json');const store=edit=>{const o=Object.assign({},base);for(const [n,f] of Object.entries(edit||{})){o[n]=J(base[n]);f(o[n]);}return o;};
 // F1: plants on sol S4 CHANGE TO
 const F1=[['R1','RETRACTED: D1 vs C3 -- the meaning-based ruling is withdrawn (Commitments 3 and 13).','APPLIED'],['R2','RETRACTED: D1 vs C3','APPLIED'],['R3','RETRACTED: D1 vs. C3 -- [CR3] "I grant it bounds the abstinence"','APPLIED'],['R4','RETRACTED: D1 vs C3 — withdrawn','APPLIED|RECORD'],['R5','RETRACTED: D1 vs C3; reason: withdrawn','NOT APPLIED'],['R6','RETRACTED: D2 vs C3 -- withdrawn','NOT APPLIED'],['R7','RETRACTED: -- withdrawn','NOT APPLIED'],['R8','RETRACTED: D1 vs C3 -- withdrawn\nD1 vs C3: STANDS','NOT APPLIED'],['R9','RETRACTED: K-G4 D1 vs C3 -- withdrawn','NOT APPLIED'],['R10','RETRACTED: D1 vs C3 -- withdrawn, the link is not forced','APPLIED']];
 const plant=to=>({'Send Back Record':o=>{const x=o[0][0].json.sb_items.find(z=>z.seat==='sol'&&z.sid==='S4');x.ans='CHANGE';x.to=to;const y=o[0][0].json.sb_items.find(z=>z.seat==='sol'&&z.sid==='S5');y.ans='KEEP';y.to='';}});
 const g=arr=>{const s=arr.find(z=>z.seat==='sol');const it=(s.items||[]).find(i=>/S4/.test(i.src||''));return it?'NOT APPLIED':'APPLIED';};
 const others=arr=>arr.map(s=>({seat:s.seat,items:(s.items||[]).filter(i=>!/S4/.test(i.src||'')).map(i=>({k:i.kind,s:i.src,w:i.why}))}));
 let f1pass=0;for(const [id,to,exp] of F1){const st=store(plant(to));const a=await run(LIVE,'Gate Build','Reread Record',st),b=await run(CAND,'Gate Build','Reread Record',st);const bare=await run(CAND,'Gate Build','Reread Record',store(plant('RETRACTED: D1 vs C3')));
  const gb=g(b),ok=exp.split('|').includes(gb);if(ok)f1pass++;const sameAsBare=gb==='APPLIED'?S(others(b))===S(others(bare)):'-';
  console.log('F1',id,'| live',g(a),'| cand',gb,'| expected',exp,ok?'PASS':'FAIL','| applied result equals bare form',sameAsBare,'| other seats equal live',S(others(a).filter(s=>s.seat!=='sol'))===S(others(b).filter(s=>s.seat!=='sol')));}
 console.log('F1 total',f1pass,'/',F1.length);
 // F2: plants on sol's own BROKEN E-COL row (row 0)
 const F2=[['B1',null,'HELD'],['B2','D1 vs C3: DEFENDER LINK BROKEN','HELD'],['B3','**D1 vs C3 (Matthew 1:18): DEFENDER LINK BROKEN** -- reason','HELD'],['B4','D1 vs C3: STANDS -- reason','SENT'],['B5','D1 vs C3: UNDERDETERMINED -- reason','SENT'],['B6','D2 vs C3: DEFENDER LINK BROKEN -- reason','SENT'],['B7','D1 vs C3: CHALLENGER LINK BROKEN -- reason','SENT'],['B10','D1 vs C4 (Matthew 1:18): DEFENDER LINK BROKEN -- reason','HELD']];
 const solRow=(o)=>o[0][0].json.enf428_rows.filter(z=>z.seat==='sol'&&z.rule==='E-COL')[0];
 const ns=x=>(x.find(z=>z.sb_not_sent)||{}).sb_not_sent||[];const items=(x,seat)=>((x.find(z=>z.seat===seat)||{}).items||[]);
 let f2pass=0;for(const [id,line,exp] of F2){const st=store({'Judge Enforcer Record':o=>{if(line)solRow(o).flagged_line=line;}});const a=await run(LIVE,'Send Back Build','Judge Enforcer Record',st),b=await run(CAND,'Send Back Build','Judge Enforcer Record',st);
  const fl=line||solRow(base['Judge Enforcer Record']).flagged_line;const sent=items(b,'sol').some(i=>(i.line||i.flagged_line)===fl);const liveSent=items(a,'sol').some(i=>(i.line||i.flagged_line)===fl);const got=sent?'SENT':'HELD';const ok=got===exp;if(ok)f2pass++;
  const d=diffMS(ns(a),ns(b));const oth=['luna','chatgpt'].every(s=>S(items(a,s))===S(items(b,s)));
  console.log('F2',id,'| live',liveSent?'SENT':'HELD','| cand',got,'| expected',exp,ok?'PASS':'FAIL','| not_sent added',d.added.length,'gone',d.gone.length,'| luna+chatgpt items equal',oth);
  if(id==='B1')d.added.forEach(x=>{const z=JSON.parse(x);console.log('   added:',z.seat,z.rule,z.item,'|',String(z.line||z.flagged_line||'').slice(0,60),'|',String(z.reason||'').slice(0,90));});}
 // B8: other rules on sol untouched; B9: no confirmed list
 {const a=await run(LIVE,'Send Back Build','Judge Enforcer Record',store()),b=await run(CAND,'Send Back Build','Judge Enforcer Record',store());const nonCol=x=>items(x,'sol').filter(i=>i.rule!=='E-COL');const ok=S(nonCol(a))===S(nonCol(b));if(ok)f2pass++;console.log('F2 B8 sol non-E-COL items equal live',ok,nonCol(a).length,nonCol(b).length);}
 console.log('F2 total',f2pass,'/',F2.length+1);
 // B9 + controls on stored 34726
 {const b0=mkbase('ex34726_full.json');const a=await run(LIVE,'Send Back Build','Judge Enforcer Record',b0),b=await run(CAND,'Send Back Build','Judge Enforcer Record',b0);const d=diffMS(ns(a),ns(b));
  console.log('34726 not_sent added',d.added.map(x=>{const z=JSON.parse(x);return z.seat+' '+z.item+' | '+String(z.line||z.flagged_line||'').slice(0,90);}).join(' ;; '),'gone',d.gone.length);
  for(const s of ['luna','sol','chatgpt'])console.log('34726',s,'items live',items(a,s).length,'cand',items(b,s).length);}
})();
// B9: no confirmed list (both confirm records absent): candidate equals live
(async()=>{const fs=require('fs');const base=mkbase('ex34780_full.json');const st=Object.assign({},base);st['Close Enforcer Record']=null;st['Judge Contradiction Record']=null;
 const a=await run(LIVE,'Send Back Build','Judge Enforcer Record',st),b=await run(CAND,'Send Back Build','Judge Enforcer Record',st);console.log('F2 B9 no confirmed list: candidate equals live',S(a)===S(b));})();
