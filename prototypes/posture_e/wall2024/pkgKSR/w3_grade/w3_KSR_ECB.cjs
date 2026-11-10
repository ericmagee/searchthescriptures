// W3 grade of pkgKSR and pkgECB: whole chain on execution 34626 (labels labels_KSR_ECB_w3.md). Run from anywhere.
const chain=require('./chain.cjs');const nt=chain.nt,rd=chain.rd;const fs=require('fs');
const F={LIVE:'/mnt/project-files/wall2024/fetchback_live_s110.json',KSR:'pkgKSR/parent_s110_KSR.json',ECB:'pkgKSR/parent_s110_ECB.json',ALL:'pkgKSR/parent_s110_ALL.json'};
const cl=x=>JSON.parse(JSON.stringify(x));
// remap stored send-back replies to the candidate's item numbers, by item identity (rule, item, line); answers to items no longer sent are dropped
const remap=(node,build)=>async(over,out)=>{const st=rd[build][0].data.main[0],nw=out(build)[0];const calls=cl(rd[node][0].data.main[0]);const res=[];let info=[];
 for(const it of nw){const j=it.json;const si=st.findIndex(s=>s.json.seat===j.seat);if(si<0){info.push(j.seat+': no stored reply');continue;}
  const key=i=>JSON.stringify([i.rule,i.item,i.line]);const m={};(st[si].json.items||[]).forEach(o=>{const n=(j.items||[]).find(x=>key(x)===key(o));m[o.sid]=n?n.sid:null;});
  const c=calls[si];if(Object.entries(m).every(([a,b])=>a===b)){res.push(c);info.push(j.seat+': same');continue;}let txt=c.json.choices[0].message.content;const fix=t=>{const parts=t.split(/(?=SENDBACK: S\d+ \|\|)/);return parts.map(p=>{const mm=/^SENDBACK: (S\d+) \|\|/.exec(p);if(!mm)return p;const to=m[mm[1]];if(to===undefined)return p;if(to===null)return '';return 'SENDBACK: '+to+p.slice(mm[0].length-3);}).join('');};
  let done=false;try{const o=JSON.parse(txt);if(o&&typeof o.reasoning==='string'){o.reasoning=fix(o.reasoning);txt=JSON.stringify(o);done=true;}}catch(e){}if(!done)txt=fix(txt);
  c.json.choices[0].message.content=txt;res.push(c);info.push(j.seat+': '+Object.entries(m).filter(([a,b])=>a!==b).map(([a,b])=>a+'>'+(b||'dropped')).join(' ')||'same');}
 if(nw.length&&nw.every(x=>x.json.sb_skip)){return;}over[node]=[res];remap.info=info;};
const gremap=async(over,out)=>{const st=rd['Gate Build'][0].data.main[0],nw=out('Gate Build')[0];const calls=cl(rd['Gate Call openrouter'][0].data.main[0]);const res=[];const info=[];
 for(const it of nw){const j=it.json;if(j.gate_skip)continue;const si=st.findIndex(s=>s.json.seat===j.seat);if(si<0){info.push(j.seat+': no stored gate reply');continue;}
  const key=i=>i.kind+'|'+i.why;const m={};(st[si].json.items||[]).forEach((o,oi)=>{const ni=(j.items||[]).findIndex(x=>key(x)===key(o));m['G'+(oi+1)]=ni<0?null:'G'+(ni+1);});
  const c=calls[si];let txt=c.json.choices[0].message.content;txt=txt.split(/(?=GATE: G\d+ \|\|)/).map(p=>{const mm=/^GATE: (G\d+) \|\|/.exec(p);if(!mm)return p;const to=m[mm[1]];if(to===undefined)return p;if(to===null)return '';return 'GATE: '+to+p.slice(mm[0].length-3);}).join('');
  c.json.choices[0].message.content=txt;res.push(c);info.push(j.seat+' gate: '+(j.items||[]).length+' items now, stored '+(st[si].json.items||[]).length+'; '+Object.entries(m).filter(([a,b])=>a!==b).map(([a,b])=>a+'>'+(b||'dropped')).join(' ')+'; new items with no stored answer: '+(j.items||[]).map((x,i)=>'G'+(i+1)).filter(g=>!Object.values(m).includes(g)).join(' '));}
 if(res.length)over['Gate Call openrouter']=[res];gremap.info=info;};
// with pkgKSR the KEYSTONE line the enforcer reads is the engine's BROKEN line; the stored replies Z2.1 and Z3.1 (DISAGREE, RIGHT: BROKEN, on a STANDS line) are set to AGREE (assumption, stated in the grade)
const jeflip=async(over)=>{const calls=cl(rd['Judge Enforcer Call deepseek'][0].data.main[0]);calls.forEach(c=>{c.json.choices[0].message.content=String(c.json.choices[0].message.content).replace(/ENFORCER: (Z[23]\.1) -- DISAGREE -- RIGHT: BROKEN/g,'ENFORCER: $1 -- AGREE -- RIGHT: BROKEN');});over['Judge Enforcer Call deepseek']=[calls];};
const U=s=>String(s).replace(/\\\\n/g,'\n').replace(/\\n/g,'\n');
const keyLines=o=>[...U(JSON.stringify(o)).matchAll(/(?:^|\n|")\s*(KEYSTONE: D\d+ -- [^\n"\\]{0,110})/g)].map(m=>m[1]);
const run=async(tag,opt)=>{opt=opt||{};const after={'Send Back Call openrouter':remap('Send Back Call openrouter','Send Back Build'),'Gate Call openrouter':gremap};if(opt.flip)after['Judge Enforcer Call deepseek']=jeflip;const r=await chain(F[tag]||tag,Object.assign({after},opt));return r;};
const diffNodes=r=>Object.keys(r.over).filter(n=>nt(r.over[n])!==nt(r.stored(n).map(o=>(o||[]).map(x=>({json:x.json})))));
const rowSum=rows=>rows.map(w=>{const k=(U(w.verdict_raw).match(/(?:^|\n)\s*KEYSTONE:[^\n]{0,120}/g)||[]).map(s=>s.trim());return w.judge_seat+' | tag '+w.verdict_tag+' | drv_uncured '+w.drv_uncured+' | result '+String(w.result_line).slice(0,60)+'\n      '+k.join('\n      ');}).join('\n   ');
module.exports={gremap,run,diffNodes,rowSum,keyLines,remap,F,chain,rd,nt,U,cl};
if(require.main===module)(async()=>{
 for(const [tag,flip] of [['LIVE',0],['KSR',0],['KSR',1],['ECB',0],['ALL',0],['ALL',1]]){const r=await run(tag,{flip});const d=diffNodes(r);console.log('\n=== '+tag+(flip?' (stored enforcer replies on the two KEYSTONE lines set to AGREE)':'')+' === nodes differing from the stored run: '+(d.length?d.join(', '):'none'));
  const pc=r.over['Panel Cure Check'][0][0].json;console.log(' Panel Cure Check bodies KEYSTONE: '+keyLines(pc.bodies).map(k=>k.slice(0,60)).join(' || '));
  const sb=r.over['Send Back Build'][0];console.log(' Send Back Build: '+sb.map(x=>x.json.seat+' '+(x.json.items||[]).length+' items, not_sent '+((x.json.sb_not_sent||[]).length)).join('; '));
  console.log(' remap: '+(remap.info||[]).join(' | '));console.log(' '+(gremap.info||[]).join(' | '));const g=r.over['Gate Record']?r.over['Gate Record'][0][0].json.gate:null;if(g)console.log(' Gate Record seats: '+JSON.stringify(g.seats));const kb=n=>keyLines((r.over[n]||r.stored(n))[0][0].json.bodies).filter(k=>!/STATEMENT:/.test(k)).map(k=>k.slice(0,60)).join(' || ');for(const n of ['Send Back Record','Gate Record','Alternate Merge Seat'])console.log(' '+n+' bodies KEYSTONE: '+kb(n));
  const sr=r.over['Send Back Record'][0][0].json;console.log(' Send Back Record keys: '+Object.keys(sr).join(','));
  console.log(' FINAL ROWS:\n   '+rowSum(r.rows));
  }
})().catch(e=>console.log('ERROR '+e.stack));
