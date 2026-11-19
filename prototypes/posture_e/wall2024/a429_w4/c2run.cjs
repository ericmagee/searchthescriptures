// ASK 429 C2: run the OLD (base) and the BUILT (target) builder nodes on one stored n8n execution's data, and compare.
// Usage: node a429/c2run.cjs EXEC.json BASE_WF.json TARGET_WF.json node1,node2,...
// $('X') is answered from the execution's runData (last run of X); $input is the builder's own stored input; Shared Library params come
// from the workflow file under test. Checks: (1) old output == stored output (the runner is faithful); (2) new output == old output after
// the labels are put back: every difference is a "Judge k"/"a judge" label standing where the old text had a seat id, or the dropped
// " (seat)" of the Reread line; (3) no seat id stands in a label form in the new request text.
const fs=require('fs');
const [EX,BW,TW,NL]=process.argv.slice(2);
const ex=JSON.parse(fs.readFileSync(EX));const rd=ex.data.resultData.runData;
const wf=f=>{const w=JSON.parse(fs.readFileSync(f));return w.data&&w.data.nodes?w.data:w;};
const B=wf(BW),T=wf(TW);
const outOf=(n,ri)=>{const r=rd[n];if(!r||!r.length)return null;const run=r[ri==null?r.length-1:ri];return ((run.data||{}).main||[[]])[0]||[];};
// Stored runs predate ASK 426: their Resolve Seats item has no enforcer. Both sides get the live enforcer seat; the BUILT side also gets
// jlabel, made by the built Resolve Seats' own expression (taken from the target file, not retyped).
const JLX=(()=>{const c=(process.env.JLX_FROM?wf(process.env.JLX_FROM):T).nodes.find(n=>n.name==='Resolve Seats').parameters.jsCode;const m=c.match(/jlabel:(Object\.fromEntries\(\(judges\|\|\[\]\)[^\n]*?\.filter\(x=>x\[0\]\))/);if(!m)throw new Error('jlabel expression not found in target Resolve Seats');return new Function('judges','return '+m[1]+');');})();
const ENF={seat:'luna',api_model:'openai/gpt-6-luna',max_tokens:64000};
const OVR=new Map();
const mk=(w)=>{const P=Object.fromEntries(w.nodes.map(n=>[n.name,n.parameters||{}]));const built=(w===T);
 return n=>{let it=(OVR.get(w)||{})[n]||outOf(n);if(n==='Resolve Seats'&&it)it=it.map(x=>({...x,json:{...x.json,enforcer:x.json.enforcer||ENF,...(built?{jlabel:JLX(x.json.judges)}:{})}}));const ex2=!!it;const items=(it||[]).map(x=>({json:x.json,pairedItem:x.pairedItem}));
  return {isExecuted:ex2,params:P[n],all:()=>{if(!ex2)throw new Error('node '+n+' not executed');return items;},first:()=>{if(!ex2)throw new Error('node '+n+' not executed');return items[0];},last:()=>items[items.length-1],item:items[0]};};};
const inputOf=n=>{const r=rd[n][0];const s=(r.source||[])[0];if(!s)return [];const o=outOf(s.previousNode,s.previousNodeRun);return (o||[]).map(x=>({json:x.json}));};
const runNode=async(w,name)=>{const code=w.nodes.find(n=>n.name===name).parameters.jsCode;const $=mk(w);const items=inputOf(name);
 const $input={all:()=>items,first:()=>items[0],item:items[0]};const $execution={id:'replay',customData:{set(){},get(){return null;}}};
 const f=new Function('$','$input','$execution','$json','$items','$now','return (async()=>{\n'+code+'\n})();');
 return await f($,$input,$execution,items[0]&&items[0].json,()=>items,new Date());};
const SEATS=['chatgpt','terra','sol62','sol','luna','gemini','grok','claude','haiku','sonnet','opus','glm','glm_legal','qwen','qwen4max','ember','spark','hydrogen','argon','hy4','hy4_flash','ernie','mimo','deepseek'];
const LBL=new RegExp("(\\(|, |line of )("+SEATS.join('|')+")(\\)|:|,)",'g');
const texts=o=>(o||[]).map(x=>{const b=(x.json||{}).body;return b&&b.messages?b.messages.map(m=>m.content).join('\n<<MSG>>\n'):null;});
const PAIRS={};(async()=>{for(const name of NL.split(',')){
 if(!rd[name]){console.log(name,'| NOT RUN in this execution');continue;}
 const stored=(outOf(name)||[]).map(x=>({json:x.json}));let old,neu;
 try{old=await runNode(B,name);}catch(e){console.log(name,'| OLD ERROR',e.message.slice(0,200));continue;}
 try{neu=await runNode(T,name);}catch(e){console.log(name,'| NEW ERROR',e.message.slice(0,200));continue;}

 OVR.set(B,{...(OVR.get(B)||{}),[name]:old.map(x=>({json:x.json}))});OVR.set(T,{...(OVR.get(T)||{}),[name]:neu.map(x=>({json:x.json}))});
 {const sa=old.map(x=>{const j={...x.json};delete j.body;return j;}),sb=neu.map(x=>{const j={...x.json};delete j.body;return j;});const tz=x=>JSON.stringify(x).replace(/"at":"[0-9T:.\-Z]+"/g,'"at":"T"');const A=tz(sa),Bz=tz(sb);if(A!==Bz){let k=0;while(k<A.length&&A[k]===Bz[k])k++;console.log('   NONBODY DIFF at',k,'OLD',A.slice(Math.max(0,k-150),k+60),'NEW',Bz.slice(Math.max(0,k-150),k+60));}}
 const msgs=o=>JSON.stringify(o.map(x=>{const j=x.json||{};return j.body&&j.body.messages?j.body.messages:{skip:j.je_skip||j.enf_skip||j.cec_skip||j.rr_skip||null,why:j.why||j.rr_why||null};}));const faithful=msgs(old)===msgs(stored);
 const to=texts(old),tn=texts(neu);let changed=0,bad=[],leaks=0,labels=0;
 // non-body fields must be equal
 const strip=o=>JSON.stringify(o.map(x=>{const j={...x.json};delete j.body;return j;})).replace(/"at":"[0-9T:.\-Z]+"/g,'"at":"T"');const restEq=strip(old)===strip(neu);
 for(let i=0;i<Math.max(to.length,tn.length);i++){const a=to[i],b=tn[i];if(a===b)continue;if(a==null||b==null){bad.push(i+': body missing');continue;}changed++;
  const lm=[...b.matchAll(LBL)];leaks+=lm.length;labels+=(b.match(/\((?:Judge \d|a judge|single judge)|, (?:Judge \d|a judge)\)|line of (?:Judge \d|a judge)/g)||[]).length;
  // put old seats back: replace each label occurrence in b by the seat at the same place in a, by walking the diff token-wise
  {const sa=[...a.matchAll(new RegExp("(?:\\(|, |line of )("+SEATS.join('|')+"|single judge)(?:\\)|:|,)",'g'))].map(m=>m[1]);const sb=[...b.matchAll(/(?:\(|, |line of )(Judge \d+|a judge|single judge)(?:\)|:|,)/g)].map(m=>m[1]);if(sa.length===sb.length){const per={};sa.forEach((x,q)=>{PAIRS[x+' -> '+sb[q]]=(PAIRS[x+' -> '+sb[q]]||0)+1;(per[sb[q]]=per[sb[q]]||new Set()).add(x);});for(const [l,st] of Object.entries(per))if(st.size>1&&l!=='a judge'){const key='SHARED IN ONE PROMPT '+name+': '+l+' = '+[...st].join('+');PAIRS[key]=(PAIRS[key]||0)+1;}}else PAIRS['UNALIGNED '+name]=(PAIRS['UNALIGNED '+name]||0)+1;}
  const ta=a.split(/(\s+)/),tb=b.split(/(\s+)/);
  const norm=s=>s.replace(/\((?:Judge \d+|a judge)\)/g,'(L)').replace(/\((?:Judge \d+|a judge)\):/g,'(L):').replace(/^(?:Judge|judge)$/,'');
  const A2=a.replace(new RegExp("(\\(|, |line of )("+SEATS.join('|')+"|single judge)(\\)|:|,)",'g'),'$1L$3').replace(/ \((?:L)\), written after the send-back/g,', written after the send-back');
  const B2=b.replace(/(\(|, |line of )(Judge \d+|a judge|single judge)(\)|:|,)/g,'$1L$3');
  if(A2!==B2){let k=0;while(k<A2.length&&A2[k]===B2[k])k++;bad.push(i+': other change at '+k+': OLD '+JSON.stringify(A2.slice(Math.max(0,k-80),k+80))+' NEW '+JSON.stringify(B2.slice(Math.max(0,k-80),k+80)));}}
 console.log(name,'| items',old.length,'| old==stored',faithful,'| non-body fields equal',restEq,'| bodies changed',changed,'| labels written',labels,'| seat ids in label form (new)',leaks,'| other changes',bad.length);
 bad.slice(0,3).forEach(x=>console.log('   ',x.slice(0,400)));}
console.log('SEAT -> LABEL',JSON.stringify(PAIRS));})();
