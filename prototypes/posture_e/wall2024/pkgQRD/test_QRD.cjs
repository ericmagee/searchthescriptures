// pkgQRD test (labels pkgQRD/labels_QRD.md): live s109 QR Check / QR Final vs pkgQRD on the stored 34108 dry regrade (execution 34299), and plants.
const fs=require('fs');const RM=require('../pkgLIB/runner_model.cjs');
const Ld=f=>{let d=JSON.parse(fs.readFileSync(f,'utf8'));d=Array.isArray(d)?d[0]:d;d=d.data||d;return d.workflow||d;};
const L=Ld('/mnt/project-files/wall2024/fetchback_live_s110.json'),N=Ld('pkgQRD/parent_s110_QRD.json');const code=(w,n)=>w.nodes.find(x=>x.name===n).parameters.jsCode;
let bad=0;const T=(c,m)=>{console.log((c?'OK   ':'FAIL ')+m);if(!c)bad++;};
const dn=N.nodes.filter(n=>JSON.stringify(n)!==JSON.stringify(L.nodes.find(x=>x.name===n.name))).map(n=>n.name).sort();
T(JSON.stringify(dn)===JSON.stringify(['QR Check','QR Final'])&&JSON.stringify(N.connections)===JSON.stringify(L.connections),'Q1 only '+dn.join(', ')+' change; QR Check '+code(L,'QR Check').length+' -> '+code(N,'QR Check').length+', QR Final '+code(L,'QR Final').length+' -> '+code(N,'QR Final').length);
const X=JSON.parse(fs.readFileSync('/mnt/project-files/wall2024/ex34299_full.json','utf8')).data.resultData.runData;const out=n=>X[n]?X[n][0].data.main[0]:null;
const cl=x=>JSON.parse(JSON.stringify(x));const AF=Object.getPrototypeOf(async function(){}).constructor;
async function go(w,name,over,input){const c=code(w,name);const s=n=>over&&over[n]!==undefined?over[n]:out(n);const inp=input||[];
 const mk=n=>{const it=s(n);if(!it){const no=()=>{throw new Error('unexecuted '+n);};return {isExecuted:false,first:no,last:no,all:no,params:{}};}return {isExecuted:true,first:()=>cl(it[0]),last:()=>cl(it[it.length-1]),all:()=>cl(it),params:{}};};
 const $input={first:()=>cl(inp[0]),last:()=>cl(inp[inp.length-1]),all:()=>cl(inp),get item(){return cl(inp[0]);}};
 return (await new AF('$','$input','$json','$execution',c)(RM.gate(RM.needs(c),mk),$input,inp[0]&&inp[0].json,{id:'34299'})).map(x=>x.json);}
const rep=(o)=>({choices:[{message:{content:JSON.stringify(o)}}]});
(async()=>{
 const ask=out('QR Ask');
 const a=await go(L,'QR Check',{},ask),b=await go(N,'QR Check',{},ask);
 const strip=x=>x.map(j=>({...j,redirect:undefined,body:undefined,retry:undefined}));
 const ret=b.map(j=>j.seat+':'+(j.retry?Object.keys(j.redirect).join('+')||'fault':'-')).join(', ');console.log('     pkgQRD returns: '+ret);
 const last=b.map(j=>j.retry?j.body.messages[j.body.messages.length-1].content:'').filter(Boolean);last.forEach(t=>console.log('     return text: '+t.replace(/\n/g,' / ')));
 T(JSON.stringify(strip(a))===JSON.stringify(strip(b))&&a.every(j=>!j.retry)&&ret==='luna:-, chatgpt:defender, sol:defender'&&last.every(t=>t.includes('between CR3 and CR4')),'Q2 34299: luna stands; chatgpt and sol returned on the defender side only, naming CR3 and CR4; checks and faults unchanged; live returns none');
 // Q4 QR Final plants: chatgpt (index 1) second reply
 const C=b;const qs1=C[1].qs;const F=out('Regrade Load')[0].json.f;
 const diff={round:'CR4',quote:"Genesis 4:1 is the ordinary means, and it cannot supply the sequence",earlier_round:'CR3',earlier_quote:'the ordinary means',question:'How do these two passages agree?'};
 // find a real closing sentence for plant (a): take a CR4 sentence and a CR3 phrase that exist
 const s4=String(F.cr4).split(/(?<=[.!?])\s+/).find(x=>x.length>40&&x.length<160&&!/["“”]/.test(x)),s3=String(F.cr3).split(/(?<=[.!?])\s+/).find(x=>x.length>40&&x.length<160&&!/["“”]/.test(x));
 const qa={...qs1,defender:{round:'CR4',quote:s4,earlier_round:'CR3',earlier_quote:s3,question:'How do these two passages agree?'}};
 const finalRun=async(w,checkOut,second)=>{const R=checkOut.map((j,i)=>i===1?rep(second):({choices:[{message:{content:'OK'}}]}));return go(w,'QR Final',{'QR Check':checkOut.map(j=>({json:j}))},R.map(r=>({json:r})));};
 const recOf=(items,seat,side)=>items[0].record.find(r=>r.judge===seat&&r.side===side);
 let f=await finalRun(N,b,qa);let rd=recOf(f,'chatgpt','defender'),rc=recOf(f,'chatgpt','challenger');
 T(rd.status==='PASSED ON RETURN'&&rd.quote===s4&&rd.redirect&&rc.status==='PASSED'&&rc.question===qs1.challenger.question,'Q4a different contradiction that passes: used ('+rd.status+'); challenger keeps first ('+rc.status+')');
 const qb={...qs1,defender:{...qa.defender,quote:'words that are not in the closing round at all'}};
 f=await finalRun(N,b,qb);rd=recOf(f,'chatgpt','defender');rc=recOf(f,'chatgpt','challenger');
 T(rd.status==='PASSED'&&rd.quote===qs1.defender.quote&&rd.redirect_note==='redirect reply failed, first kept'&&rc.question===qs1.challenger.question,'Q4b failing second reply: first kept ('+rd.status+', '+rd.redirect_note+')');
 f=await finalRun(N,b,qs1);rd=recOf(f,'chatgpt','defender');
 T(rd.status==='PASSED ON RETURN'&&rd.quote===qs1.defender.quote,'Q4c same question again: used ('+rd.status+')');
 // live QR Final on live QR Check output unchanged vs pkgQRD QR Final on live-shaped input (no redirect): equal
 const R0=out('QR Retry Ask');const fl=await go(L,'QR Final',{},R0),fn=await go(N,'QR Final',{},R0);
 const sr=x=>JSON.stringify(x.map(j=>({...j,record:j.record&&j.record.map(r=>({...r,redirect:undefined}))})));
 T(sr(fl)===sr(fn),'Q3 QR Final on the stored 34299 input: same items and record as live (only the new null redirect field)');
 // Q5: chatgpt challenger faulted (quote not found) + defender repeat
 const ask5=cl(ask);const o5=JSON.parse(ask5[1].json.choices[0].message.content.slice(ask5[1].json.choices[0].message.content.indexOf('{'),ask5[1].json.choices[0].message.content.lastIndexOf('}')+1));o5.challenger.quote='a quotation that does not stand anywhere';ask5[1].json.choices[0].message.content=JSON.stringify(o5);
 const b5=await go(N,'QR Check',{},ask5);const t5=b5[1].body.messages[b5[1].body.messages.length-1].content;
 T(b5[1].retry&&b5[1].why.length===1&&/challenger:/.test(b5[1].why[0])&&b5[1].redirect.defender&&t5.includes('Faults:')&&t5.includes('Another judge already asks the defender'),'Q5 fault on challenger and repeat on defender: one return carries both');
 const f5=await finalRun(N,b5,o5);const r5=recOf(f5,'chatgpt','challenger');T(r5.status==='DROPPED','Q5 faulted side follows today\'s rule: second still fails, DROPPED');
 // Q6: same rounds, no shared quote -> not a repeat; non-contradiction questions never returned
 const ask6=cl(ask);const o6=JSON.parse(ask6[2].json.choices[0].message.content.slice(ask6[2].json.choices[0].message.content.indexOf('{'),ask6[2].json.choices[0].message.content.lastIndexOf('}')+1));o6.defender={...o6.defender,quote:s4,earlier_quote:s3};ask6[2].json.choices[0].message.content=JSON.stringify(o6);
 const b6=await go(N,'QR Check',{},ask6);T(!b6[2].retry&&b6[1].redirect.defender,'Q6 sol with the same rounds but other quotes: not returned (chatgpt still is)');
 const ask7=cl(ask);for(const k of [0,1,2]){const t=ask7[k].json.choices[0].message.content;const o=JSON.parse(t.slice(t.indexOf('{'),t.lastIndexOf('}')+1));o.challenger=JSON.parse(JSON.stringify(JSON.parse(ask[0].json.choices[0].message.content.slice(ask[0].json.choices[0].message.content.indexOf('{'),ask[0].json.choices[0].message.content.lastIndexOf('}')+1)).challenger));ask7[k].json.choices[0].message.content=JSON.stringify(o);}
 const b7=await go(N,'QR Check',{},ask7);T(b7.every(j=>!j.redirect.challenger),'Q6 three identical non-contradiction challenger questions: none returned for repeating');
 console.log(bad?bad+' FAIL':'ALL OK');})().catch(e=>{console.log('ERROR '+e.stack);process.exit(1);});
