// ASK 516b replay (W4): C1 byte equality of every sent body against the live-516 body, through the actual Build, Batch, Retry, Resend
// and Reread code and the literal sender expressions; known-bad fill cases; C2/C3 sizes. Inputs: 41117 Judge Enforcer Build inputs (in_d41117.json).
const fs=require('fs');const D=__dirname;
const RD=JSON.parse(fs.readFileSync(D+'/in_d41117.json','utf8')).data.resultData.runData;
const W516=JSON.parse(fs.readFileSync(D+'/../target_engine_516.json','utf8')),W516b=JSON.parse(fs.readFileSync(D+'/target_engine_516b.json','utf8'));
const C516=JSON.parse(fs.readFileSync(D+'/../target_child_516.json','utf8')),C516b=JSON.parse(fs.readFileSync(D+'/target_child_516b.json','utf8'));
const node=(W,n)=>{const x=W.nodes.find(y=>y.name===n);if(!x)throw new Error('no node '+n);return x;};
const rdItems=n=>{const r=RD[n];if(!r)return null;return ((r[r.length-1].data||{}).main||[[]])[0]||[];};
const mk$=(W,over)=>n=>{if(n==='Shared Library')return {params:{jsCode:node(W,'Shared Library').parameters.jsCode}};const it=(over&&n in over)?over[n]:rdItems(n);return {isExecuted:!!it,all:()=>it||[],first:()=>{if(!it||!it.length)throw new Error('node '+n+' not executed');return it[0];},get item(){return (it||[])[0];},last:()=>(it||[]).slice(-1)[0],params:{}};};
const run=async(W,n,over,input)=>{const $=mk$(W,over);const $input={all:()=>input||[],first:()=>(input||[])[0],get item(){return (input||[])[0];}};return await new Function('$','$input','return (async()=>{\n'+node(W,n).parameters.jsCode+'\n})();')($,$input);};
const expr=(W,n,over,json)=>{const e=node(W,n).parameters.jsonBody;if(!e.startsWith('={{')||!e.endsWith('}}'))throw new Error('expr form '+n);const $=mk$(W,over);return new Function('$json','$','return ('+e.slice(3,-2)+');')(json,$);};
const S=x=>JSON.stringify(x);const res=[];const ok=(name,c,info)=>{res.push({name,ok:!!c,info:info||''});};
(async()=>{
 // reference (live 516) and 516b Judge Enforcer Build on 41117 inputs
 const jeIn=rdItems('Panel Payloads')||[];
 const B6=await run(W516,'Judge Enforcer Build',{},jeIn),Bb=await run(W516b,'Judge Enforcer Build',{},jeIn);
 ok('JEB call count equal',B6.length===Bb.length,B6.length+' vs '+Bb.length);
 const r0=Bb[0].json.rounds516;ok('rounds516 on item 0 only',typeof r0==='string'&&Bb.slice(1).every(x=>!('rounds516' in x.json)),'len '+(r0||'').length);
 const PHRX=/\[THE ROUNDS IN FULL: (\d+) characters, md5 ([0-9a-f]{8}); the same in every call of this run\]\n\n/;
 eval(fs.readFileSync(D+'/md5.js','utf8')+';globalThis.M5=M5;');const cr=require('crypto');
 const md=cr.createHash('md5').update(r0,'utf8').digest('hex');ok('placeholder in every body, n and md5 right',Bb.every(x=>{const m=String(x.json.body.messages[1].content).match(PHRX);return m&&+m[1]===r0.length&&m[2]===md.slice(0,8);}),'md5 '+md.slice(0,8));
 ok('rounds text = the 516 body text between RULES and POINTS/ITEMS',B6.every(x=>String(x.json.body.messages[1].content).includes(r0)));
 {const dif=[];B6.forEach((x,i)=>{const a=Object.assign({},x.json),b=Object.assign({},Bb[i].json);delete a.body;delete b.body;delete b.rounds516;const noAt=v=>JSON.parse(S(v===undefined?null:v),(k,x)=>k==='at'?'(time)':x);a.code_rows=noAt(a.code_rows);b.code_rows=noAt(b.code_rows);for(const k of new Set([...Object.keys(a),...Object.keys(b)]))if(S(a[k])!==S(b[k]))dif.push(i+':'+k+' '+S(a[k]).slice(0,200)+' ||| '+S(b[k]).slice(0,200));});if(dif.length)console.log('DIFF',dif.slice(0,4).join('\n'));ok('JEB fields other than body/rounds516 equal (row times set aside)',!dif.length,dif.length+' field differences');}
 // every sender expression on the JEB bodies (engine and child names)
 const ENG={'Enforcer Group Batch Call openrouter':'Judge Enforcer Build','Alt Judge Enforcer Call openrouter':'Alt Judge Enforcer Build','Judge Enforcer Retry Call openrouter':'Judge Enforcer Build','Alt Judge Enforcer Retry Call openrouter':'Alt Judge Enforcer Build','Judge Enforcer Resend Call openrouter':'Judge Enforcer Build','Alt Judge Enforcer Resend Call openrouter':'Alt Judge Enforcer Build','Reread Call openrouter':'Judge Enforcer Build','Alt Reread Call openrouter':'Alt Judge Enforcer Build'};
 const CHI={'R2 Alt Judge Enforcer Call openrouter':'R2 Alt Judge Enforcer Build','R2 Alt Judge Enforcer Retry Call openrouter':'R2 Alt Judge Enforcer Build','R2 Alt Judge Enforcer Resend Call openrouter':'R2 Alt Judge Enforcer Build','R2 Alt Reread Call openrouter':'R2 Alt Judge Enforcer Build'};
 const sizes={};
 for(const [W,map] of [[W516b,ENG],[C516b,CHI]])for(const [sn,bn] of Object.entries(map)){let eq=0;for(let i=0;i<Bb.length;i++){const out=expr(W,sn,{[bn]:Bb},Bb[i].json);if(S(out)===S(B6[i].json.body))eq++;}ok('C1 direct '+sn,eq===Bb.length,eq+'/'+Bb.length);}
 // known-bad: rounds missing, wrong length; no placeholder passes through unchanged
 {let t1=false,t2=false;try{expr(W516b,'Alt Judge Enforcer Call openrouter',{'Alt Judge Enforcer Build':[{json:{}}]},Bb[0].json);}catch(e){t1=/could not be put/.test(e.message);}
  try{expr(W516b,'Alt Judge Enforcer Call openrouter',{'Alt Judge Enforcer Build':[{json:{rounds516:r0+'x'}}]},Bb[0].json);}catch(e){t2=/could not be put/.test(e.message);}
  let t3=false;try{expr(W516b,'Judge Enforcer Retry Call openrouter',{},Bb[0].json);}catch(e){t3=/could not be put/.test(e.message);}
  const plain={model:'m',messages:[{role:'system',content:'s'},{role:'user',content:'no placeholder here'}]};const o4=expr(W516b,'Enforcer Group Batch Call openrouter',{},{body:plain});const t4=S(o4)===S(plain);if(!t4)console.log('T4',S(o4));
  ok('known-bad: rounds missing -> error',t1);ok('known-bad: wrong length -> error',t2);ok('known-bad: Build not executed -> error',t3);ok('no placeholder -> body unchanged (E path)',t4);}
 // Batch Build (actual code) then Batch Call expression; Enforcer Build from 41117
 {const b6=await run(W516,'Enforcer Group Batch Build',{'Judge Enforcer Build':B6},[]),bb=await run(W516b,'Enforcer Group Batch Build',{'Judge Enforcer Build':Bb},[]);let eq=0;for(let i=0;i<bb.length;i++){if(S(expr(W516b,'Enforcer Group Batch Call openrouter',{'Judge Enforcer Build':Bb},bb[i].json))===S(b6[i].json.body))eq++;}
  ok('C1 Batch (actual Batch Build, E+J items)',eq===bb.length&&bb.length===b6.length,eq+'/'+bb.length+' (J '+bb.filter(x=>x.json.bt==='J').length+')');sizes.batch516=S(b6).length;sizes.batch516b=S(bb).length;}
 // Resume (actual code)
 {const r=await run(W516b,'Judge Enforcer Resume',{'Judge Enforcer Build':Bb},[]);ok('Resume strips rounds516, rest equal',r.every(x=>!('rounds516' in x.json))&&r.length===Bb.length&&r.every((x,i)=>{const b=Object.assign({},Bb[i].json);delete b.rounds516;return S(x.json)===S(b);}));sizes.resume516b=S(r).length;sizes.resume516=S(B6).length;}
 // Retry / Resend / Reread, actual code, for each Build (engine Judge, engine Alt, child R2 Alt), with the Build items placed under that Build's name
 const PATHS=[[W516,W516b,'Judge Enforcer Build','Judge Enforcer Retry Build','Judge Enforcer Retry Call openrouter','Judge Enforcer Resend Build','Judge Enforcer Resend Call openrouter','Reread Build','Reread Call openrouter','Send Back Record'],
  [W516,W516b,'Alt Judge Enforcer Build','Alt Judge Enforcer Retry Build','Alt Judge Enforcer Retry Call openrouter','Alt Judge Enforcer Resend Build','Alt Judge Enforcer Resend Call openrouter','Alt Reread Build','Alt Reread Call openrouter','Alt Send Back Record'],
  [C516,C516b,'R2 Alt Judge Enforcer Build','R2 Alt Judge Enforcer Retry Build','R2 Alt Judge Enforcer Retry Call openrouter','R2 Alt Judge Enforcer Resend Build','R2 Alt Judge Enforcer Resend Call openrouter','R2 Alt Reread Build','R2 Alt Reread Call openrouter','R2 Alt Send Back Record']];
 for(const [Wa,Wb,bn,rtb,rtc,rsb,rsc,rrb,rrc,sbr] of PATHS){
  const fail=Bb.map(()=>({json:{error:{message:'replay: forced retry'}}}));
  const t6=await run(Wa,rtb,{[bn]:B6},fail),tb=await run(Wb,rtb,{[bn]:Bb},fail);let eq=0;for(let i=0;i<tb.length;i++)if(S(expr(Wb,rtc,{[bn]:Bb},tb[i].json))===S(t6[i].json.body))eq++;
  ok('C1 Retry '+rtc,tb.length===t6.length&&tb[0].json.esr_retry===true&&eq===tb.length,eq+'/'+tb.length);sizes['retry:'+bn]=[S(t6).length,S(tb).length];
  const empty=tb.map(()=>({json:{}}));const s6=await run(Wa,rsb,{[rtb]:t6},empty),sb=await run(Wb,rsb,{[rtb]:tb},empty);eq=0;for(let i=0;i<sb.length;i++)if(S(expr(Wb,rsc,{[bn]:Bb},sb[i].json))===S(s6[i].json.body))eq++;
  ok('C1 Resend '+rsc,sb.length===s6.length&&sb[0].json.ers_resend===true&&eq===sb.length,eq+'/'+sb.length);sizes['resend:'+bn]=[S(s6).length,S(sb).length];
  const ids=[];for(const b of B6)for(const x of (b.json.ids||[]))if(ids.length<6&&!ids.some(y=>y.seat===x.seat&&y.rule===x.rule&&y.item===x.item))ids.push(x);
  const sb_items=ids.map((x,k)=>({seat:x.seat,sid:'S'+(k+1),rule:x.rule,item:x.item,line:x.flagged_line,ans:'CHANGE',to:'replay replaced line '+(k+1),reason:'(right: replay)'}));const SBR=[{json:{sb_items,run_token:'replay'}}];
  const q6=await run(Wa,rrb,{[bn]:B6,[sbr]:SBR},[]),qb=await run(Wb,rrb,{[bn]:Bb,[sbr]:SBR},[]);eq=0;for(let i=0;i<qb.length;i++)if(!qb[i].json.rr_skip&&S(expr(Wb,rrc,{[bn]:Bb},qb[i].json))===S(q6[i].json.body))eq++;
  ok('C1 Reread '+rrc,qb.length===q6.length&&!qb[0].json.rr_skip&&eq===qb.length,eq+'/'+qb.length+' ('+(qb[0].json.rr_why||'')+')');sizes['reread:'+bn]=[S(q6).length,S(qb).length];}
 // rounds text: any "\n\nITEM X1 (" inside it would change the Retry/Reread split
 fs.writeFileSync(D+'/replay_r0.json',JSON.stringify(r0));
 ok('rounds hold no ITEM split mark',!/\n\nITEM [A-Z]+\d+ \(/.test(r0));

 // C2 / WRONG-IF on the 41117 shape: the same inputs through 515 rev 7 (live), 516 and 516b; two calls retried, one half resent, one reread call.
 {const W515=JSON.parse(fs.readFileSync(D+'/live_moMxiV4Irg1uRBZN.json','utf8')),C515=JSON.parse(fs.readFileSync(D+'/live_MqQHRl7mQQ0z8QdT.json','utf8'));
  const B5=await run(W515,'Judge Enforcer Build',{},jeIn);
  const V={'515r7':[W515,C515,B5],'516':[W516,C516,B6],'516b':[W516b,C516b,Bb]};const M={};
  const len=x=>S(x).length;const userLen=items=>items.reduce((a,x)=>a+((x.json&&x.json.body&&x.json.body.messages)?String(x.json.body.messages[1].content).length:0),0);
  for(const [v,[We,Wc,BB]] of Object.entries(V)){
   const fail=BB.map((x,i)=>i<2?{json:{error:{message:'replay: forced retry'}}}:{json:{choices:[{message:{content:'x'},finish_reason:'stop'}]}});
   const ids=[];for(const b of B6)for(const x of (b.json.ids||[]))if(ids.length<6&&!ids.some(y=>y.seat===x.seat&&y.rule===x.rule&&y.item===x.item))ids.push(x);
   const SB=k=>[{json:{sb_items:ids.map((x,j)=>({seat:x.seat,sid:'S'+(j+1),rule:x.rule,item:x.item,line:x.flagged_line,ans:'CHANGE',to:'replay replaced line '+(j+1),reason:'(right: replay)'})),run_token:'replay'}}];
   // judge path (engine): Build, Batch, Resume, IF after Resume, Retry, IF, Resend, IF, Reread, IF
   const bt=await run(We,'Enforcer Group Batch Build',{'Judge Enforcer Build':BB},[]);const rs=await run(We,'Judge Enforcer Resume',{'Judge Enforcer Build':BB},[]);
   const rt=await run(We,'Judge Enforcer Retry Build',{'Judge Enforcer Build':BB},fail);const rsd=await run(We,'Judge Enforcer Resend Build',{'Judge Enforcer Retry Build':rt},rt.map((x,i)=>i===0?{json:{}}:{json:{choices:[{message:{content:'x'}}]}}));
   const rr=await run(We,'Reread Build',{'Judge Enforcer Build':BB,'Send Back Record':SB()},[]);
   const J={build:len(BB),batch:len(bt),resume:len(rs),if_resume:len(rs),retry:len(rt),if_retry:len(rt),resend:len(rsd),if_resend:len(rsd),reread:len(rr),if_reread:len(rr)};J.total=Object.values(J).reduce((a,b)=>a+b,0);J.log=userLen(BB)+userLen(rr);
   // alternate path (engine Alt names; the same Build items stand in for an alternate's): Build, IF, Retry, IF, Resend, IF, Reread, IF
   const art=await run(We,'Alt Judge Enforcer Retry Build',{'Alt Judge Enforcer Build':BB},fail);const ars=await run(We,'Alt Judge Enforcer Resend Build',{'Alt Judge Enforcer Retry Build':art},art.map((x,i)=>i===0?{json:{}}:{json:{choices:[{message:{content:'x'}}]}}));
   const arr=await run(We,'Alt Reread Build',{'Alt Judge Enforcer Build':BB,'Alt Send Back Record':SB()},[]);
   const A={build:len(BB),if_build:len(BB),retry:len(art),if_retry:len(art),resend:len(ars),if_resend:len(ars),reread:len(arr),if_reread:len(arr)};A.total=Object.values(A).reduce((a,b)=>a+b,0);A.log=userLen(BB)+userLen(arr);
   M[v]={judge:J,alt:A};}
  const R=r0.length;const out={rounds:R,shape:'41117 Judge Enforcer Build inputs; 2 of 10 calls retried (4 halves), 1 half resent, 1 reread call; the alternate path uses the same Build items',M};
  // WRONG-IF: 516b held (Build..IF incl.) + log <= 515r7 held + log + one rounds copy per Build node run
  for(const p of ['judge','alt']){const b=M['516b'][p],a=M['515r7'][p],x=M['516'][p];out[p+'_bound']={'515r7':a.total+a.log,'516':x.total+x.log,'516b':b.total+b.log,bound:a.total+a.log+R,pass:b.total+b.log<=a.total+a.log+R};}
  out.panel_plus_3_alternates={'515r7':out.judge_bound['515r7']+3*out.alt_bound['515r7'],'516':out.judge_bound['516']+3*out.alt_bound['516'],'516b':out.judge_bound['516b']+3*out.alt_bound['516b'],bound:out.judge_bound.bound+3*out.alt_bound.bound};
  ok('WRONG-IF judge path (41117 shape)',out.judge_bound.pass,S(out.judge_bound));ok('WRONG-IF alternate path (41117 shape)',out.alt_bound.pass,S(out.alt_bound));
  ok('WRONG-IF known-bad: 516 fails the bound',!(out.judge_bound['516']<=out.judge_bound.bound)&&!(out.alt_bound['516']<=out.alt_bound.bound));
  fs.writeFileSync(D+'/measure516b_41117.json',JSON.stringify(out,null,1));}
 sizes.jeb516=S(B6).length;sizes.jeb516b=S(Bb).length;sizes.rounds=r0.length;
 fs.writeFileSync(D+'/replay516b_41117.json',JSON.stringify({res,sizes},null,1));
 for(const r of res)console.log(r.ok?'PASS':'FAIL',r.name,r.info);console.log(JSON.stringify(sizes));
})().catch(e=>{console.log('ERR',e.stack);process.exit(1);});
