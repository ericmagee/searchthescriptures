// ASK 531 criterion 3 (W4): synthetic answers to Terra's (seat chatgpt) E-ASSUME item S11 on 41418 read as under 524 (W1's fixed reply).
// The line is appended to the recorded send-back reply; nothing else changes. No model call. Usage: node synth531.js <target.json> <run dir>
const fs=require('fs');const [,,TGT,P]=process.argv;const Q='/mnt/project-files/ask523/w4/41418';
const RD0={};for(const f of [Q+'/part_rr1.json',Q+'/part_gr1.json',P+'/part_sb.json',P+'/part_er.json',P+'/part_misc.json',P+'/part_panel.json',P+'/part_ac.json']){const J=JSON.parse(fs.readFileSync(f,'utf8'));Object.assign(RD0,(J.data&&J.data.resultData||J).runData);}
const W=JSON.parse(fs.readFileSync(TGT,'utf8'));const node=n=>W.nodes.find(y=>y.name===n);
const REPLY=['ASSUME-CHECK: DEFENDER PREMISE 5 -- FACT 1 "the flesh runs from David to the child through Joseph" -- STATED -- John 6:42 "the son of Joseph, whose father and mother we know" -- read with Romans 1:3.',
'ASSUME-CHECK: DEFENDER PREMISE 2 -- FACT 1 "Mary\'s question concerned the throne" -- STATED -- Luke 1:34 "Mary was of the house of David by her own line" -- invented words.',
'ASSUME-CHECK: CHALLENGER PREMISE 91 -- FACT 1 "Mary is of David\'s line" -- NOT STATED -- no quoted verse gives it.'].join('\n');
const CASES=[
 ['A CHANGE counts premise 91','CHANGE TO: CHALLENGER CONCEDED LINKS: 1 -- Premise 91: UNEXHIBITED, no quoted row gives Mary in David\'s line. Premises 1-6 are spared.','CURED'],
 ['B CHANGE counts premise 3 rewritten with the same fact','CHANGE TO: CHALLENGER CONCEDED LINKS: 1 -- Premise 3: UNEXHIBITED. STEP: the seed reaches the child through the woman -- ASSUMES: Mary is in David\'s line. Premises 1, 2, 4, 5 and 6 are spared.','CURED'],
 ['C CHANGE counts both 91 and premise 3 (same fact)','CHANGE TO: CHALLENGER CONCEDED LINKS: 2 -- Premise 3: UNEXHIBITED. ASSUMES: Mary is in David\'s line. Premise 91: UNEXHIBITED. Premises 1, 2, 4, 5 and 6 are spared.','UNCURED'],
 ['D CHANGE counts 91 and also regrades premise 2','CHANGE TO: CHALLENGER CONCEDED LINKS: 2 -- Premise 91: UNEXHIBITED. Premise 2: UNEXHIBITED. Premises 1, 3, 4, 5 and 6 are spared.','UNCURED'],
 ['E KEEP quoting 4+ verse words found in the challenger\'s quoted verses','KEEP','CURED','The challenger quotes "And Jacob begat Joseph the husband of Mary" and that reaches David\'s line.'],
 ['F KEEP quoting no verse words','KEEP','UNCURED','The record does not need the fact.']];
const noT=v=>JSON.parse(JSON.stringify(v),(k,x)=>(k==='at'||k==='ts'||k==='created_at')?'(time)':x);
async function run(c){const RD=JSON.parse(JSON.stringify(RD0));RD['Assume Check Call openrouter'][0].data.main[0]=[{json:{choices:[{message:{content:REPLY}}]}}];
 const sc=RD['Send Back Call openrouter'][0].data.main[0];const j=sc.findIndex(x=>/terra/.test(x.json.model||''));let t=sc[j].json.choices[0].message.content;
 const line='SENDBACK: S11 || '+c[1]+' || '+(c[3]||'Mary is not named in any quoted row of David\'s house.');const esc=line.replace(/\\/g,'\\\\').replace(/"/g,'\\"');const k=t.lastIndexOf('"');t=t.slice(0,k)+'\\n'+esc+t.slice(k);sc[j].json.choices[0].message.content=t;
 const rec=n=>{const r=RD[n];if(!r)return null;return ((r[r.length-1].data||{}).main||[[]])[0]||[];};const out={};
 for(const NODE of ['Assume Check Build','Assume Check Record','Send Back Build','Send Back Record','Gate Build']){const r=RD[NODE];
  const $=n=>{if(n==='Shared Library')return {params:{jsCode:node('Shared Library').parameters.jsCode}};const it=rec(n);return {isExecuted:!!it,all:()=>it||[],first:()=>{if(!it||!it.length)throw new Error('node '+n+' not executed');return it[0];},params:{}};};
  const src=r[r.length-1].source;const inp=src&&src[0]?rec(src[0].previousNode,src[0].previousNodeRun):[];const $input={all:()=>inp||[],first:()=>(inp||[])[0]};
  let res;try{res=await new Function('$','$input','return (async()=>{\n'+node(NODE).parameters.jsCode+'\n})();')($,$input);}catch(e){res=[{json:{__error:String(e.stack||e.message).slice(0,500)}}];}
  out[NODE]=noT(res);r[r.length-1].data={main:[res.map(x=>({json:x.json}))]};}
 const sr=out['Send Back Record'][0].json;const row=(sr.sb_rows||[]).find(x=>x.seat==='chatgpt'&&x.rule==='E-ASSUME');
 const body=(sr.bodies||[]).map(s=>JSON.parse(s).payload).find(p=>p.judge_seat==='chatgpt');
 const gb=out['Gate Build'];const gi=[];for(const g of gb){for(const x of ((g.json||{}).items||[]))if(g.json.seat==='chatgpt'&&/S11\b/.test(String(x.src||'')+' '+String(x.key||'')))gi.push(x.kind+' '+x.src+': '+String(x.why||'').slice(0,160));if(g.json.__error)gi.push('ERROR '+g.json.__error);}
 const rep=(gb[0]&&gb[0].json&&gb[0].json.gate_report)||null;
 const got=row?row.cure_status:'NO ROW';console.log((got===c[2]?'PASS ':'FAIL ')+c[0]+' | expected '+c[2]+' | row '+got+' | '+(row?String(row.cure_reason).split(' | ').filter(s=>/pkgACX|ASSUMPTION/.test(s)).join(' | ').slice(0,300):'')+' | acx_counted '+JSON.stringify(sr.sendback.acx_counted)+' | chatgpt drv '+(body?body.drv_uncured:'?')+' | gate: '+(gi.join(' ; ')||'no gate item on S11'));}
(async()=>{for(const c of CASES)await run(c);})();
