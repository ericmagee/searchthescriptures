process.chdir(__dirname+'/../..');const fs=require('fs');const IN='/mnt/project-files/wall2024/inputs/';
const g=f=>{let d=JSON.parse(fs.readFileSync(f,'utf8'));d=d.data||d;return d.workflow||d;};
const LIVE=g('/mnt/project-files/wall2024/fetchback_live_s106.json'),CAND=g('pkgRAC/parent_s106_RAC.json');
const code=(W,n)=>W.nodes.find(z=>z.name===n).parameters.jsCode;const J=x=>({json:x});const cl=x=>JSON.parse(JSON.stringify(x));
const cache={};const saved=(run,n)=>{const k=run+'|'+n;if(k in cache)return cache[k];const f=IN+run+'_'+n.replace(/ /g,'_')+'.json';if(!fs.existsSync(f))return cache[k]=null;const d=JSON.parse(fs.readFileSync(f,'utf8'));const r=Array.isArray(d)?d[d.length-1]:d;const m=(r&&r.data&&r.data.main)||(r&&r.main);return cache[k]=(m&&m[0])||[];};
// run one node's code on a stored debate; over = node name -> items (or null for "not executed"); W gives params.jsCode of any node
const run=(W,RUN,node,over,inputNode)=>{const get=n=>over&&n in over?over[n]:saved(RUN,n);
 const mk=n=>{const it=get(n);const params={get jsCode(){return code(W,n);}};if(it===null){const no=()=>{throw new Error('Referenced node is unexecuted: '+n);};return {isExecuted:false,first:no,last:no,all:no,params};}
  return {isExecuted:true,first:()=>cl(it[0]),last:()=>cl(it[it.length-1]),all:()=>cl(it),params};};
 const inp=(inputNode&&get(inputNode))||[];const $input={first:()=>cl(inp[0]),last:()=>cl(inp[inp.length-1]),all:()=>cl(inp)};
 const RD=Date,FIX=new RD('2026-11-07T03:10:18.511Z').getTime();class FD extends RD{constructor(...a){a.length?super(...a):super(FIX);}static now(){return FIX;}}global.Date=FD;
 try{return new Function('$','$input','$json','$execution','$workflow',(/await/.test(code(W,node))?"return (async()=>{\n"+code(W,node)+"\n})();":code(W,node)))(mk,$input,inp[0]&&inp[0].json,{id:RUN,customData:{set:()=>{},get:()=>undefined}},{id:'w'});}finally{global.Date=RD;}};
const runs=fs.readdirSync(IN).filter(f=>f.endsWith('_Final_Output.json')).map(f=>f.split('_')[0]).sort();
const getF=r=>{const it=saved(r,'Final Output');return it&&it[it.length-1]&&it[it.length-1].json;};
const BO=(r,F,extra)=>({'Final Output':[J(F)],'Resolve Seats':[J({deepseek:{api_model:'deepseek-flash'}})],'Init Seats':[J({run_token:r})],'Regrade Load':null,...extra});
const mrg=a=>{const j=a.map(x=>x.json);return j[0].cec_skip?{cec_skip:true}:{cec_skip:false,items:j,cands:j.flatMap(b=>b.cands||[]),not_sent:j[0].not_sent||[],links:j[0].links};};
const rep=t=>t==null?J({error:{message:'timeout'}}):J({choices:[{message:{role:'assistant',content:t},finish_reason:'stop'}]});
const rec=(r,F,B,t)=>{const its=B.items.map((b,k)=>k===0?{...b,not_sent:B.not_sent}:b);const reps=its.map(b=>rep((String(t).split('\n').filter(l=>new RegExp('-- '+b.side+' --','i').test(l)).join('\n'))||'CLOSE-CONTRADICTION: NONE'));return run(CAND,r,'Close Enforcer Record',{'Final Output':[J(F)],'Regrade Load':null,'Close Enforcer Build':its.map(J),'Close Enforcer Call deepseek':reps},'Close Enforcer Call deepseek')[0].json;};
const line=(c,link,ans,id)=>'CLOSE-CONTRADICTION: '+(id||c.id)+' -- '+c.side+' -- LINK '+link+' -- '+ans+' -- EARLIER ['+c.earlier_round+'] "'+c.earlier_q+'" -- CLOSING ['+c.closing_round+'] "'+c.closing_q+'" -- planted.';
const txt=o=>JSON.stringify(o);const cnt=(s,re)=>(s.match(re)||[]).length;
const N=s=>String(s||'').toLowerCase().replace(/[^a-z0-9]+/g,' ').trim();
const build=(r,extra)=>{const F=getF(r);return {F,B:mrg(run(CAND,r,'Close Enforcer Build',BO(r,F,extra)))};};
const pb=async(r,B,F,R)=>txt(await run(CAND,r,'Panel Build',{'Anticheat Record':saved(r,'Anticheat Record'),'Close Enforcer Build':B.items.map(J),'Close Enforcer Record':[J(R)]}));
// a pair is visible when its closing quotation (first 8 words) appears in the judges' prompt text
const segs=s=>{const o=[];for(const re of [/ANTI-CHEAT CHECK --/g,/CONFIRMED CLOSING CONTRADICTIONS --/g]){let m;while(m=re.exec(s)){const e=s.indexOf('\\n\\n[',m.index+20);o.push(s.slice(m.index,e<0?m.index+4000:e));}}return o.join(' || ');};
const vis=(s,c)=>N(segs(s).replace(/\\n/g,' ')).includes(N(c.closing_q).split(' ').slice(0,8).join(' '));
const out=[];const T=(c,m)=>{out.push((c?'OK   ':'FAIL ')+m);console.log((c?'OK   ':'FAIL ')+m);};
(async()=>{
 // G1, G2, G5 on 33222 (challenger pair)
 {const r='33222';const {F,B}=build(r);const c=B.cands.find(x=>/^A/.test(x.id));const lk=(B.links[c.side]||[])[0];console.log('G1 pair '+c.id+' '+c.side+' links '+JSON.stringify(B.links[c.side]));
  let R=rec(r,F,B,line(c,lk,'CONFIRMED'));let s=await pb(r,B,F,R);
  T(R.cec.confirmed.some(x=>x.id===c.id&&x.side==='CHALLENGER')&&cnt(s,/ANTI-CHEAT CHECK --/g)===0&&/CONFIRMED CLOSING CONTRADICTIONS --/.test(s),'G1 challenger A pair confirmed: link broken '+JSON.stringify(R.cec.confirmed.map(x=>x.id+' '+x.side+' '+x.link))+'; anti-cheat blocks '+cnt(s,/ANTI-CHEAT CHECK --/g)+'; confirmed block '+/CONFIRMED CLOSING CONTRADICTIONS --/.test(s));
  R=rec(r,F,B,line(c,lk,'CONFIRMED','NEW'));s=await pb(r,B,F,R);
  T(R.cec.confirmed.length===1&&R.cec.no_answer.includes(c.id)&&cnt(s,/ANTI-CHEAT CHECK --/g)>=1&&!/The closing enforcer examined/.test(s),'G2 confirmed by NEW only: break '+JSON.stringify(R.cec.confirmed.map(x=>x.id))+', no_answer '+JSON.stringify(R.cec.no_answer)+', A block kept '+cnt(s,/ANTI-CHEAT CHECK --/g));
  R=rec(r,F,B,line(c,lk,'CONFIRMED',c.id.toLowerCase()));T(R.cec.confirmed.some(x=>x.id===c.id),'G5 lower-case id read: '+JSON.stringify(R.cec.confirmed.map(x=>x.id)));}
 // G3, G4, G6 on 33846 (six defender pairs)
 {const r='33846';const {F,B}=build(r);const A=B.cands.filter(x=>/^A/.test(x.id));const L=B.links.DEFENDER;console.log('33846 pairs '+A.map(x=>x.id).join(',')+' links '+JSON.stringify(L));
  let R=rec(r,F,B,line(A[0],L[0],'CONFIRMED')+'\n'+line(A[3],L[0],'CONFIRMED'));let s=await pb(r,B,F,R);
  console.log('   G3 rows: '+R.cec.rows.map(x=>x.id+' '+x.status+(x.note?' ('+x.note+')':'')).join('; '));
  T(vis(s,A[0])&&vis(s,A[3]),'G3 two A pairs (A13, A57: different quotations; A13 and A19 carry the same two sentences) confirmed on one link: pair 1 visible '+vis(s,A[0])+', pair 2 visible '+vis(s,A[3])+'; breaks '+R.cec.confirmed.length);
  R=rec(r,F,B,line(A[2],L[0],'CONFIRMED','NEW')+'\n'+line(A[4],L[0],'CONFIRMED'));s=await pb(r,B,F,R);
  console.log('   G4 rows: '+R.cec.rows.map(x=>x.id+' '+x.status+(x.note?' ('+x.note+')':'')).join('; '));
  T(vis(s,A[4]),'G4 NEW confirmed first on the link, then an A pair on the same link: A pair (A73) visible '+vis(s,A[4]));
  R=rec(r,F,B,line(A[4],L[0],'NOT A CONTRADICTION')+'\n'+line(A[5],L[1]||L[0],'CONFIRMED'));s=await pb(r,B,F,R);
  T(cnt(s,/The closing enforcer examined this pair and did not confirm a contradiction\. The close sentence is not footing for any link/g)>=1&&R.cec.confirmed.some(x=>x.id===A[5].id),'G6 one not a contradiction, one confirmed: examined endings '+cnt(s,/The closing enforcer examined this pair/g)+', confirmed '+JSON.stringify(R.cec.confirmed.map(x=>x.id)));}
 // G7 empty earlier quotation
 {const r='33222';const AR=cl(saved(r,'Anticheat Record'));const row=AR[0].json.acx.reversed.C[0];row.earlier_q='';const {B}=build(r,{'Anticheat Record':AR});
  T(B.not_sent.some(x=>/^A\d+ CHALLENGER/.test(x)),'G7 empty earlier quotation listed: '+JSON.stringify(B.not_sent));}

 // G8 Panel Build stripped of every comment (R2 tool): same candidates on every stored debate
 {const {strip}=require('../../pkgLIB/strip.cjs');const W2=JSON.parse(JSON.stringify(CAND));const pbn=W2.nodes.find(z=>z.name==='Panel Build');pbn.parameters.jsCode=strip(pbn.parameters.jsCode);
  let n=0,same=0,diff=[];for(const r of runs){const F=getF(r);if(!F)continue;let a,b;try{a=mrg(run(CAND,r,'Close Enforcer Build',BO(r,F)));b=mrg(run(W2,r,'Close Enforcer Build',BO(r,F)));}catch(e){continue;}if(a.cec_skip)continue;n++;
   const k=x=>JSON.stringify([x.cands,x.not_sent]);if(k(a)===k(b))same++;else diff.push(r);}
  const nR=runs.reduce((t,r)=>{const F=getF(r);if(!F)return t;try{const x=mrg(run(W2,r,'Close Enforcer Build',BO(r,F)));return t+(x.cands||[]).filter(c=>/^R/.test(c.id)).length;}catch(e){return t;}},0);
  T(!diff.length&&nR>=2,'G8 Panel Build with every comment stripped: '+same+' of '+n+' debates give the same candidates and not-sent list; R pairs found '+nR+(diff.length?'; differ '+diff.join(','):''));}
 // G9 Anticheat Build on rounds that are not strings
 {const r='33222';const F={...getF(r),cr4:{x:1},dr4:[1,2]};let out,err=null;try{out=run(CAND,r,'Anticheat Build',BO(r,F));}catch(e){err=e.message;}
  const j=out&&out.map(x=>x.json);T(!err&&j&&j.length===1&&j[0].acx_skip===true&&String(j[0].why||'').length>0,'G9 Anticheat Build on odd rounds: '+(err?'THROWS '+err:JSON.stringify(j&&j.map(x=>({skip:x.acx_skip,why:String(x.why||'').slice(0,80)})))));
  let out2,err2=null;try{out2=run(CAND,r,'Anticheat Record',{...BO(r,F),'Anticheat Build':out,'Debate Start':[J({})]},'Anticheat Build');}catch(e){err2=e.message;}T(!err2&&out2&&out2.length===1,'G9b Anticheat Record after it: '+(err2?'THROWS '+err2:JSON.stringify(out2[0].json).slice(0,160)));}

 // G9c a real throw inside each anti-cheat node (Init Seats not executed): wrapped, one skip item with the reason
 {const r='33222';const F=getF(r);let o1,e1=null,o2,e2=null;try{o1=run(CAND,r,'Anticheat Build',{...BO(r,F),'Init Seats':null});}catch(e){e1=e.message;}
  T(!e1&&o1&&o1.length===1&&o1[0].json.acx_skip===true,'G9c Anticheat Build with Init Seats unexecuted: '+(e1?'THROWS '+e1:JSON.stringify(o1.map(x=>({skip:x.json.acx_skip,why:String(x.json.why||'').slice(0,90)})))));
  try{o2=run(CAND,r,'Anticheat Record',{...BO(r,F),'Anticheat Build':null,'Debate Start':null},'Anticheat Build');}catch(e){e2=e.message;}
  T(!e2&&o2&&o2.length===1,'G9d Anticheat Record with Anticheat Build unexecuted: '+(e2?'THROWS '+e2:JSON.stringify(o2[0].json).slice(0,200)));}
 // G10 neutral reasons
 {let bad=[],n=0;for(const r of runs){const F=getF(r);if(!F)continue;let b;try{b=mrg(run(CAND,r,'Close Enforcer Build',BO(r,F)));}catch(e){continue;}if(b.cec_skip)continue;for(const c of b.cands.filter(c=>/^[AR]/.test(c.id))){n++;if(/revers|asserts more/i.test(c.why||''))bad.push(r+' '+c.id+': '+c.why);}}
  T(!bad.length,'G10 '+n+' code-found candidates; reasons naming a conclusion: '+(bad.join(' | ')||'none'));}
 console.log(out.filter(x=>x.startsWith('OK')).length+' OK, '+out.filter(x=>x.startsWith('FAIL')).length+' FAIL');
})().catch(e=>console.log('ERROR '+e.stack));
