// ASK 379: the engine side of a scratch loop, rebuilt offline from the child executions it called: the target's own Second Alternate?, Pass Accumulate and Alternate Merge,
// with each child's Alternate Pass Out as the call's result. Checks every child's input decision against the offline decision, and measures what the engine keeps per pass.
const fs=require('fs');const [TGT,EX,...CH]=process.argv.slice(2);const T=JSON.parse(fs.readFileSync(TGT));const code=n=>T.nodes.find(x=>x.name===n).parameters.jsCode;
const RD=JSON.parse(fs.readFileSync(EX)).data.resultData.runData;const stored=nm=>{const r=RD[nm];return r?[(r[r.length-1].data.main[0]||[])]:null;};
const RUNS={};const runsOf=nm=>RUNS[nm]||stored(nm);
const $=nm=>{const R=runsOf(nm);if(!R||!R.length)return {isExecuted:false,first:()=>{throw new Error('not run '+nm)},all:()=>{throw new Error('not run '+nm)},params:{}};const last=R[R.length-1];return {isExecuted:true,params:{},first:()=>last[0],all:(b,r)=>r==null?last:R[r]};};
const run=(n,input)=>{const out=new Function('$','$input','$execution','require',code(n))($,{all:()=>input,first:()=>input[0]},{id:'x',customData:{set(){},get(){}}},require);(RUNS[n]=RUNS[n]||[]).push(out);return out;};
const mb=x=>+(JSON.stringify(x).length/1e6).toFixed(2);const js=JSON.stringify;let input=stored('Alternate Merge 1')[0];let per=[];
for(let p=0;;p++){const sa=run('Second Alternate?',input);const d=sa[0].json.a2r;if(!d.run){console.log('decision',p+2,'run false:',d.why);break;}
 const C=JSON.parse(fs.readFileSync(CH[p])).data.resultData.runData;const cin=C['Alternate Pass In'][0].data.main[0][0].json.pass;const {__a379,...saNo}=sa[0].json;
 console.log('pass',p+2,'child input sa equals the engine decision item:',js(cin.sa)===js(saNo),'| a2r',js(d).slice(0,120),'| parent_exec',cin.parent_exec);
 const out=C['Alternate Pass Out'][0].data.main[0];const acc=run('Pass Accumulate',out.map(i=>({json:i.json})));
 per.push({pass:p+2,SA:mb(sa[0].json),SAN:mb(sa[0].json),Call:mb(out[0].json),Acc:mb(acc[0].json)});input=acc;}
const am=run('Alternate Merge',[]);console.log('Alternate Merge MB',mb(am[0].json));per.forEach(x=>console.log(' engine keeps for pass',x.pass,':',x,'total',(x.SA+x.SAN+x.Call+x.Acc).toFixed(1),'MB'));
const t=am[0].json.alternates_tried.map(x=>x.removed_seat+'>'+x.alternate+':'+x.why.slice(0,40));console.log(' tried',t);
