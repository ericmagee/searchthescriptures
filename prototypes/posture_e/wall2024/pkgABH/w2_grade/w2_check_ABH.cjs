// W2 checks for pkgABH: (1) downstream early nodes unchanged since s79; (2) every node that read Get Early Alternate / early_all at s79 still does at s97 (other heads lost at s80?);
// (3) extra plants on the 34299 inputs: HTTP error item, matching hash with empty choices, matching row plus an extra unrelated row.
const fs=require('fs');const W='/mnt/project-files/wall2024/';const load=f=>{let d=JSON.parse(fs.readFileSync(f,'utf8'));d=d.data||d;return d.workflow||d;};
const S79=load(W+'prewrite_s80_XK.json'),S97=load(W+'fetchback_live_s97.json'),PK=load(__dirname+'/../parent_s97_ABH.json');
let ok=0,bad=0;const chk=(c,m)=>{if(c){ok++;console.log('OK   '+m);}else{bad++;console.log('FAIL '+m);}};
const by=d=>{const o={};d.nodes.forEach(n=>o[n.name]=n);return o;};const A=by(S79),B=by(S97);
for(const n of ['Get Early Alternate','Early Reply?','Early Alternate Reply','Alternate Needed?','Alternate Calls?'])chk(A[n]&&B[n]&&JSON.stringify(A[n].parameters)===JSON.stringify(B[n].parameters),n+': parameters equal s79 and s97');
const refs=(d,re)=>d.nodes.filter(n=>re.test(JSON.stringify(n.parameters))).map(n=>n.name).sort();
for(const re of [/Get Early Alternate/,/early_all/,/__early_reply/,/__e4h/]){const a=refs(S79,re),b=refs(PK,re);const lost=a.filter(x=>!b.includes(x));chk(lost.length===0,'nodes naming '+re+' at s79 still name it with ABH'+(lost.length?' LOST: '+lost.join(', '):' ('+a.length+')'));}
// INFO: "Early Alternate Reply" also stood at s79 in the xAI reasoning carry-over name list inside 10 HTTP call nodes (Cure Call, Panel Cure Call 1-3, FUM Call ...). At s80 (XK rev 2) those nodes became Execute Workflow calls
// to a sub-workflow by design, so the list left the parent with them; that is not the pkgE4 head and is outside pkgABH.
{const a=refs(S79,/Early Alternate/),b=refs(PK,/Early Alternate/);console.log('INFO nodes naming "Early Alternate": s79 '+a.length+', ABH '+b.length+'; the 10 gone became sub-workflow calls at s80 (XK rev 2): '+a.filter(x=>!b.includes(x)).join(', '));}
// plants: reuse W4's harness shape
const x=JSON.parse(fs.readFileSync(W+'ex34299_full.json','utf8'));const rd=x.data.resultData.runData;
const mk=(wf,over)=>{const P={};wf.nodes.forEach(n=>P[n.name]=n.parameters);const items=nm=>{if(over&&nm in over)return over[nm];const r=rd[nm];if(!r)return null;const o=r[r.length-1].data&&r[r.length-1].data.main;return (o&&o[0])||[];};
 const $=nm=>{const it=items(nm);return {params:P[nm],first:()=>{if(!it||!it.length)throw new Error('no items '+nm);return it[0];},last:()=>it[it.length-1],all:()=>it||[],get item(){return it&&it[0];},isExecuted:!!it};};
 return {$,$input:{all:()=>items('Get Early Alternate'),first:()=>items('Get Early Alternate')[0],get item(){return items('Get Early Alternate')[0];}}};};
const run=async(wf,over)=>{const {$,$input}=mk(wf,over);const code=wf.nodes.find(n=>n.name==='Alternate Build').parameters.jsCode;try{return {r:await new Function('$','$input','$execution','return (async()=>{\n'+code+'\n})();')($,$input,{id:'34299',customData:{set(){},get(){}}})};}catch(e){return {e:String(e.message)};}};
const code=PK.nodes.find(n=>n.name==='Alternate Build').parameters.jsCode;const hl=code.split('\n').find(l=>l.startsWith('const __e4h='));const H=new Function(hl.replace('const __e4h=','return '))();
(async()=>{const base=await run(PK);const today=JSON.stringify(base.r);const C=base.r.filter(i=>i.json.alt&&!i.json.alt.skip&&i.json.alt.body);chk(C.length===1,'one alternate call in 34299 ('+C.length+')');
 const good={json:{seat_for:C[0].json.alt.removed_seat,payload_sha:H(JSON.stringify(C[0].json.alt.body)),error:null,reply:{choices:[{message:{content:'PLANT'}}]}}};
 let r=await run(PK,{'Get Early Alternate':[{json:{error:{message:'503 Service Unavailable'}}}]});chk(!r.e&&JSON.stringify(r.r)===today,'HTTP error item (continueRegularOutput): output equals today\'s');
 r=await run(PK,{'Get Early Alternate':[{json:{}}]});chk(!r.e&&JSON.stringify(r.r)===today,'alwaysOutputData empty item: output equals today\'s');
 r=await run(PK,{'Get Early Alternate':[{json:{...good.json,reply:{choices:[]}}}]});chk(!r.e&&JSON.stringify(r.r)===today,'matching hash, empty choices: output equals today\'s');
 r=await run(PK,{'Get Early Alternate':[{json:{...good.json,error:'timeout'}}]});chk(!r.e&&JSON.stringify(r.r)===today,'matching hash with error set: output equals today\'s');
 r=await run(PK,{'Get Early Alternate':[{json:{seat_for:'chatgpt',payload_sha:'0',reply:{choices:[{}]}}},good]});chk(!r.e&&r.r.filter(i=>i.json.early_all&&i.json.__early_reply&&i.json.__early_reply.choices[0].message.content==='PLANT').length===1,'matching row plus an unrelated row: the call carries the matching early reply');
 r=await run(PK,{'Get Early Alternate':[good]});const other=r.r.filter(i=>!(i.json.alt&&!i.json.alt.skip&&i.json.alt.body));chk(JSON.stringify(other)===JSON.stringify(base.r.filter(i=>!(i.json.alt&&!i.json.alt.skip&&i.json.alt.body))),'items that are not alternate calls are unchanged when early replies are used');
 console.log(ok+' OK, '+bad+' FAIL');process.exit(bad?1:0);})();
