// ASK 531 (W4): replay child 41440 R2 Alt Send Back Build on its stored inputs. Modes: live (fidelity vs stored), target as stored, target with crit2 acx injected.
const fs=require('fs');const P='/mnt/project-files/ask531/w4/41440/';const RD0={};
for(const f of fs.readdirSync(P)){const J=JSON.parse(fs.readFileSync(P+f,'utf8'));Object.assign(RD0,J.data.resultData.runData);}
const C=JSON.parse(fs.readFileSync('crit2_41418.json','utf8'));const acr=C.target['Assume Check Record'];const ACX=(acr[0].json||acr[0]).acx;
const noT=v=>JSON.parse(JSON.stringify(v),(k,x)=>(k==='at'||k==='ts'||k==='created_at')?'(time)':x);
async function run(wf,inject){const W=JSON.parse(fs.readFileSync(wf,'utf8'));const node=n=>W.nodes.find(y=>y.name===n);const RD=JSON.parse(JSON.stringify(RD0));
 if(process.env.NOENF){const s=RD["R2 Alt Seated"];s[s.length-1].data.main[0][0].json.enf421_rows=[];s[s.length-1].data.main[0][0].json.enf428_rows=[];const e=RD["R2 Alt Judge Enforcer Record"];for(const x of e[e.length-1].data.main[0])x.json.enf428_rows=[];}
 if(inject){const a=RD['Assume Check Record'];const it=a[a.length-1].data.main[0][0];it.json={...it.json,acx:ACX};}
 const rec=n=>{const r=RD[n];if(!r)return null;return ((r[r.length-1].data||{}).main||[[]])[0]||[];};
 const $=n=>{if(n==='Shared Library')return {params:{jsCode:node('Shared Library').parameters.jsCode}};const it=rec(n);return {isExecuted:!!it,all:()=>it||[],first:()=>{if(!it||!it.length)throw new Error('node '+n+' not executed');return it[0];},params:{}};};
 const r=RD['R2 Alt Send Back Build'];const src=r[r.length-1].source;const inp=rec(src[0].previousNode);const $input={all:()=>inp||[],first:()=>(inp||[])[0]};
 return noT(await new Function('$','$input','return (async()=>{\n'+node('R2 Alt Send Back Build').parameters.jsCode+'\n})();')($,$input));}
(async()=>{const stored=noT(((RD0['R2 Alt Send Back Build'].slice(-1)[0].data.main[0])).map(x=>({json:x.json})));
 const ac=RD0['Assume Check Record'];console.log('child Assume Check Record stored: executed',!!ac,'acx keys',ac?Object.keys((ac.slice(-1)[0].data.main[0][0].json.acx)||{}):null,'m524',ac?(ac.slice(-1)[0].data.main[0][0].json.acx||{}).m524:null);
 const live=await run('/mnt/project-files/ask523/w4/write/fetchback_child_523.json',false);console.log('LIVE vs stored equal:',JSON.stringify(live.map(x=>({json:x.json})))===JSON.stringify(stored));
 const t0=await run("target_child_531.json",false);const S=v=>JSON.stringify(v,(k,x)=>x&&typeof x==="object"&&!Array.isArray(x)?Object.keys(x).sort().reduce((o,kk)=>(o[kk]=x[kk],o),{}):x);console.log("TARGET (no marker) vs stored: byte-equal",JSON.stringify(t0.map(x=>({json:x.json})))===JSON.stringify(stored),"equal with keys sorted",S(t0.map(x=>({json:x.json})))===S(stored));
 const t1=await run('target_child_531.json',true);for(const x of t1){const j=x.json;const a=(j.items||[]).filter(i=>i.rule==='E-ASSUME');console.log('TARGET+acx seat',j.seat,'items',(j.items||[]).length,'(stored',stored.find(s=>s.json.seat===j.seat).json.items.length+')','E-ASSUME',JSON.stringify(a.map(i=>({sid:i.sid,item:i.item,acx:i.acx}))));
  const k=(j.msg||'').indexOf('E-ASSUME');console.log(k>=0?j.msg.slice(k-60,k+700):'no E-ASSUME text in msg');}
})();
// diff helper (mode DIFF=1)
if(process.env.DIFF)(async()=>{const stored=noT(((RD0['R2 Alt Send Back Build'].slice(-1)[0].data.main[0])).map(x=>({json:x.json})));const t0=await run('target_child_531.json',false);
 const walk=(a,b,p)=>{if(JSON.stringify(a)===JSON.stringify(b))return;if(a&&b&&typeof a==='object'&&typeof b==='object'){for(const k of new Set([...Object.keys(a),...Object.keys(b)]))walk(a[k],b[k],p+'.'+k);return;}console.log('DIFF',p,'stored=',String(JSON.stringify(a)).slice(0,150),'target=',String(JSON.stringify(b)).slice(0,150));};
 walk(stored,t0.map(x=>({json:x.json})),'');})();
