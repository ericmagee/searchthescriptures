// W1 grade runner for pkgQRD (labels labels_QRD_w1.md). Offline. Same node runner shape as W2's test (RM.gate on the node's named inputs).
const fs=require('fs');const RM=require('../../pkgLIB/runner_model.cjs');
const Ld=f=>{let d=JSON.parse(fs.readFileSync(f,'utf8'));d=Array.isArray(d)?d[0]:d;d=d.data||d;return d.workflow||d;};
const L=Ld('/mnt/project-files/wall2024/fetchback_live_s110.json'),N=Ld('pkgQRD/parent_s110_QRD.json');const code=(w,n)=>w.nodes.find(x=>x.name===n).parameters.jsCode;
const out=[];const T=(c,m)=>{const s=(c?'OK   ':'FAIL ')+m;out.push(s);console.log(s);};
const X=JSON.parse(fs.readFileSync('/mnt/project-files/wall2024/ex34299_full.json','utf8')).data.resultData.runData;const st=n=>X[n]?X[n][0].data.main[0]:null;
const cl=x=>JSON.parse(JSON.stringify(x));const AF=Object.getPrototypeOf(async function(){}).constructor;
async function go(w,name,over,input){const c=code(w,name);const s=n=>over&&over[n]!==undefined?over[n]:st(n);const inp=input||[];
 const mk=n=>{const it=s(n);if(!it){const no=()=>{throw new Error('unexecuted '+n);};return {isExecuted:false,first:no,last:no,all:no,params:{}};}return {isExecuted:true,first:()=>cl(it[0]),last:()=>cl(it[it.length-1]),all:()=>cl(it),params:{}};};
 const $input={first:()=>cl(inp[0]),last:()=>cl(inp[inp.length-1]),all:()=>cl(inp),get item(){return cl(inp[0]);}};
 return (await new AF('$','$input','$json','$execution',c)(RM.gate(RM.needs(c),mk),$input,inp[0]&&inp[0].json,{id:'34299'})).map(x=>x.json);}
const ask=st('QR Ask');const F=st('Regrade Load')[0].json.f;
const obj=(A,k)=>{const t=A[k].json.choices[0].message.content;return JSON.parse(t.slice(t.indexOf('{'),t.lastIndexOf('}')+1));};
const setObj=(A,k,o)=>{A[k].json.choices[0].message.content=JSON.stringify(o);};
const plant=f=>{const A=cl(ask);const os=[0,1,2].map(k=>obj(A,k));f(os);os.forEach((o,k)=>setObj(A,k,o));return A;};
const ret=b=>b.map(j=>j.seat+':'+(j.retry?(Object.keys(j.redirect||{}).join('+')||'fault'):'-')).join(', ');
const lastMsg=j=>j.retry?j.body.messages[j.body.messages.length-1].content:'';
const sentences=t=>String(t||'').split(/(?<=[.!?])\s+/).filter(x=>x.length>40&&x.length<170&&!/["“”]/.test(x));
const rep=o=>({choices:[{message:{content:typeof o==='string'?o:JSON.stringify(o)}}]});
const finalRun=async(w,checkOut,idx,second)=>{const R=checkOut.map((j,i)=>i===idx?(second&&second.__err?{error:{message:'timeout'}}:rep(second)):rep('OK'));return go(w,'QR Final',{'QR Check':checkOut.map(j=>({json:j}))},R.map(r=>({json:r})));};
const recOf=(items,seat,side)=>items[0].record.find(r=>r.judge===seat&&r.side===side);
(async()=>{
 // D1
 const dn=N.nodes.filter(n=>JSON.stringify(n)!==JSON.stringify(L.nodes.find(x=>x.name===n.name))).map(n=>n.name).sort();
 T(JSON.stringify(dn)==='["QR Check","QR Final"]'&&JSON.stringify(N.connections)===JSON.stringify(L.connections),'D1 only '+dn.join(', ')+'; QR Check '+code(L,'QR Check').length+' -> '+code(N,'QR Check').length+', QR Final '+code(L,'QR Final').length+' -> '+code(N,'QR Final').length);
 // D2
 const a0=await go(L,'QR Check',{},ask),b0=await go(N,'QR Check',{},ask);const strip=x=>JSON.stringify(x.map(j=>({...j,redirect:undefined,body:undefined,retry:undefined})));
 T(ret(b0)==='luna:-, chatgpt:defender, sol:defender'&&ret(a0)==='luna:-, chatgpt:-, sol:-'&&strip(a0)===strip(b0),'D2 34299: '+ret(b0)+' (live '+ret(a0)+'); other fields equal');
 const o0=[0,1,2].map(k=>obj(ask,k));console.log('   stored defender questions: '+o0.map(o=>o.defender&&(o.defender.earlier_round+'/'+o.defender.round+' "'+String(o.defender.quote).slice(0,40)+'"')).join(' | '));
 const D=o0[0].defender;const s4=sentences(F.cr4),s3=sentences(F.cr3);
 // D3a containment
 {const A=plant(os=>{os[1].defender={...D,quote:D.quote.split(' ').slice(0,Math.max(4,Math.floor(D.quote.split(' ').length/2))).join(' ')};os[2].defender={...os[2].defender,quote:s4[0],earlier_quote:s3[0]};});const b=await go(N,'QR Check',{},A);
  T(/chatgpt:defender/.test(ret(b))&&/sol:(-|fault)/.test(ret(b)),'D3a shorter closing quote inside luna\'s: chatgpt returned; sol (other quotes) not: '+ret(b));}
 {const A=plant(os=>{os[1].defender={...D,earlier_quote:D.earlier_quote.split(' ').slice(0,Math.max(3,Math.floor(D.earlier_quote.split(' ').length/2))).join(' ')};os[2].defender={...os[2].defender,quote:s4[0],earlier_quote:s3[0]};});const b=await go(N,'QR Check',{},A);
  T(/chatgpt:defender/.test(ret(b)),'D3a shorter earlier quote inside luna\'s: chatgpt returned: '+ret(b));}
 // D3b
 {const A=plant(os=>{os[1].defender={...D,quote:s4[1],earlier_quote:s3[1]};os[2].defender={...D,quote:s4[2],earlier_quote:s3[2]};});const b=await go(N,'QR Check',{},A);T(!b[1].redirect.defender&&!b[2].redirect.defender,'D3b same rounds, other quotes: no redirect: '+ret(b));}
 // D3c
 {const A=plant(os=>{os[1].defender={...D,earlier_round:'CR2'};os[2].defender={...os[2].defender,quote:s4[0],earlier_quote:s3[0]};});const b=await go(N,'QR Check',{},A);T(!(b[1].redirect||{}).defender,'D3c same quotes, earlier round CR2: no redirect (fault only: '+(b[1].why||[]).join('; ').slice(0,90)+')');}
 // D3e fault + repeat on the same side
 {const A=plant(os=>{os[1].defender={...D,question:''};});const b=await go(N,'QR Check',{},A);const t=lastMsg(b[1]);const n=(t.match(/Another judge already asks/g)||[]).length;
  console.log('   D3e chatgpt defender repeat with empty question: '+ret(b)+'; why '+JSON.stringify(b[1].why||[]).slice(0,120)+'; sentence count '+n);T(b[1].retry&&n<=1,'D3e fault and repeat on one side: one return, the sentence at most once');}
 // D3f challenger repeat
 {const d3=sentences(F.dr3),d4=sentences(F.dr4);const C={round:'DR4',quote:d4[0],earlier_round:'DR3',earlier_quote:d3[0],question:'How do these two statements agree?'};
  const A=plant(os=>{os.forEach(o=>{o.challenger={...C};});});const b=await go(N,'QR Check',{},A);
  T(/chatgpt:[a-z+]*challenger/.test(ret(b))&&/sol:[a-z+]*challenger/.test(ret(b))&&lastMsg(b[1]).includes('asks the challenger about the contradiction between DR3 and DR4'),'D3f challenger repeat: '+ret(b)+'; sentence names the challenger');}
 // D3g punctuation
 {const A=plant(os=>{os[1].defender={...D,quote:D.quote.replace(/[.!?]$/,'')+(/[.!?]$/.test(D.quote)?'':'.')};os[2].defender={...os[2].defender,quote:s4[0],earlier_quote:s3[0]};});const b=await go(N,'QR Check',{},A);console.log('   D3g end period differs: '+ret(b)+' (recorded)');}
 // D4, D5, D6 on QR Final with chatgpt (index 1) redirected
 const q1=obj(ask,1);
 for(const [lab,second] of [['no defender question',{challenger:q1.challenger}],['empty reply',''],['failed call',{__err:1}],['not JSON','I keep my question.']]){let f;try{f=await finalRun(N,b0,1,second);}catch(e){T(false,'D4 '+lab+': throws '+e.message);continue;}const r=recOf(f,'chatgpt','defender');
  T(r&&r.status!=='DROPPED'&&r.quote===q1.defender.quote,'D4 '+lab+': defender '+(r&&r.status)+(r&&r.redirect_note?' ('+r.redirect_note+')':'')+', first kept');}
 {const other={...q1,challenger:{...q1.challenger,question:'A different question on the challenger side?'}};const f=await finalRun(N,b0,1,other);const r=recOf(f,'chatgpt','challenger');T(r&&r.question===q1.challenger.question,'D6 challenger not returned keeps its first question: '+(r&&r.status));}
 // D7 fault-only return: live and candidate QR Final equal (redirect field aside)
 {const A=plant(os=>{os[1].defender={...os[1].defender,quote:s4[3]||s4[1],earlier_quote:s3[3]||s3[1]};os[2].defender={...os[2].defender,quote:s4[4]||s4[2],earlier_quote:s3[4]||s3[2]};os[1].challenger={...os[1].challenger,quote:'a quotation that does not stand anywhere'};});
  const bl=await go(L,'QR Check',{},A),bn=await go(N,'QR Check',{},A);const sec=obj(A,1);const fl=await finalRun(L,bl,1,sec),fn=await finalRun(N,bn,1,sec);
  const sr=x=>JSON.stringify(x.map(j=>({...j,record:j.record&&j.record.map(r=>({...r,redirect:undefined,redirect_note:undefined}))})));T(ret(bn)===ret(bl)&&sr(fl)===sr(fn),'D7 fault-only return ('+ret(bn)+'): QR Final equal to live');}

 // D8 / D9 faulted asker (rev 2)
 const BAD='a quotation that does not stand anywhere';
 const fin=async(w,co,sec)=>{const R=co.map((j,i)=>{const x=sec[i];return x===undefined?rep('OK'):(x&&x.__err?{error:{message:'timeout'}}:rep(x));});return go(w,'QR Final',{'QR Check':co.map(j=>({json:j}))},R.map(r=>({json:r})));};
 const inPair=r=>r&&r.status!=='DROPPED'&&r.round==='CR4'&&r.earlier_round==='CR3'&&(D.quote.includes(r.quote)||r.quote.includes(D.quote));
 const pairCount=f=>['luna','chatgpt','sol'].filter(s=>inPair(recOf(f,s,'defender'))).length;
 const P={a:os=>{os[0].challenger={...os[0].challenger,quote:BAD};},b:os=>{os[0].defender={...os[0].defender,question:''};},
  c:os=>{os[0].challenger={...os[0].challenger,quote:BAD};os[1].challenger={...os[1].challenger,quote:BAD};},
  d:os=>{os.forEach(o=>{o.challenger={...o.challenger,quote:BAD};});},e:os=>{}};
 const want={a:'luna:fault, chatgpt:-, sol:defender',b:'luna:fault, chatgpt:-, sol:defender',c:'luna:fault, chatgpt:fault, sol:-',d:'luna:fault, chatgpt:fault, sol:fault',e:'luna:-, chatgpt:defender, sol:defender'};
 for(const k of 'abcde'){const A=plant(os=>{os[1].defender={...D};os[2].defender={...D};P[k](os);});const b=await go(N,'QR Check',{},A),l=await go(L,'QR Check',{},A);
  T(ret(b)===want[k],'D8'+k+': '+ret(b)+' (live '+ret(l)+')');
  if(k==='a'||k==='c'){const o=[0,1,2].map(i=>obj(A,i));const so=obj(ask,0);
   const lunaSec={failed:{__err:1},notjson:'I keep my question.',changed:{challenger:so.challenger,defender:{...D,quote:s4[1],earlier_quote:s3[1],question:'How do these agree?'}}};
   for(const [lab,ls] of Object.entries(lunaSec)){
    const mk=co=>co.map((j,i)=>!j.retry?undefined:(i===0?ls:{challenger:obj(ask,i).challenger,defender:{...D,quote:s4[2],earlier_quote:s3[2],question:'How do these agree?'}}));
    const fl=await fin(L,l,mk(l)),fn=await fin(N,b,mk(b));const cl_=pairCount(fl),cn=pairCount(fn);
    T(!(cl_>=1&&cn===0),'D9 D8'+k+' luna second reply '+lab+': judges still asking the defender about CR3/CR4: live '+cl_+', candidate '+cn);}}}

 // D11 chain (W3 R12 shape)
 {const ss=String(F.cr4).split(/(?<=[.!?])\s+/);let i=ss.findIndex((x,j)=>x.length>25&&ss[j+1]&&ss[j+1].length>25&&!/["“”\[]/.test(x+ss[j+1]));const A_=ss[i],B_=ss[i+1];
  const A=plant(os=>{os[0].defender={...D,quote:A_};os[1].defender={...D,quote:A_+' '+B_};os[2].defender={...D,quote:B_};});
  const b=await go(N,'QR Check',{},A),l=await go(L,'QR Check',{},A);console.log('   D11 QR Check: '+ret(b)+' (live '+ret(l)+'); faults '+JSON.stringify(b.map(j=>j.why||[])).slice(0,120));
  const mk=co=>co.map((j,i)=>!j.retry?undefined:{challenger:obj(ask,i).challenger,defender:{...D,quote:s4[2],earlier_quote:s3[2],question:'How do these agree?'}});
  const fl=await fin(L,l,mk(l)),fn=await fin(N,b,mk(b));const asksB=f=>['luna','chatgpt','sol'].filter(s=>{const r=recOf(f,s,'defender');return r&&r.status!=='DROPPED'&&String(r.quote).includes(B_);}).length;
  T(!(asksB(fl)>=1&&asksB(fn)===0),'D11 chain: judges still asking about passage B: live '+asksB(fl)+', candidate '+asksB(fn));}
 console.log(out.filter(x=>x.startsWith('OK')).length+' OK, '+out.filter(x=>x.startsWith('FAIL')).length+' FAIL');})().catch(e=>{console.log('ERROR '+e.stack);});
