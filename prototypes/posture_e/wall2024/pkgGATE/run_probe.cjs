const fs=require('fs');const mk=require('./probe_gate.cjs');
const sbr=fs.readFileSync('pkgSBP/patched/Send_Back_Record.js','utf8');
function sbItems(rows){const by={};rows.forEach(r=>(by[r.run_token+'|'+r.seat]=by[r.run_token+'|'+r.seat]||[]).push(r));const out=[];
 for(const [k,rs] of Object.entries(by)){const seat=rs[0].seat;const reply=(rs.find(r=>r.full_reply)||{}).full_reply||'';const items=rs.map((r,i)=>({sid:((r.response_line||'').match(/SENDBACK\s*:?\s*(?:ITEM\s*)?#?\s*(S\s*\d+)/i)||[])[1]?.replace(/\s+/g,'')||('S'+(i+1)),rule:r.rule,item:r.item,line:r.flagged_line,reason:''}));
  const B=[{json:{seat,run_token:rs[0].run_token,api_model:'m',msg:'p',items}}];const R=[{json:{choices:[{message:{content:reply}}]}}];
  const $=n=>({'Judge Enforcer Record':{first:()=>({json:{}})},'Send Back Build':{all:()=>B}})[n];
  out.push(...new Function('$','$input',sbr)($,{all:()=>R})[0].json.sb_items.map(x=>({...x,run:rs[0].run_token.split('-')[1]})));}
 return out;}
const runs=[];
{const rows=JSON.parse(fs.readFileSync('pkgAPPLY/fixture_sendback_32949_32973.json','utf8'));const SB=sbItems(rows);const bodies=JSON.parse(fs.readFileSync('pkgAPPLY/fixture_bodies.json','utf8'));runs.push({SB,bodies,PB:null});}
{const rows=JSON.parse(fs.readFileSync('pkgSBP/fixture_sendback_32980.json','utf8'));const SB=sbItems(rows);const bodies=JSON.parse(fs.readFileSync('pkgSBP/fixture_bodies_32980.json','utf8')).map(b=>({...b,run:'32980'}));const PB=JSON.parse(fs.readFileSync('pkgR2/fixture_32980_panelbuild_item0.json','utf8'));runs.push({SB,bodies,PB});}
module.exports={runs,mk};
if(require.main===module){for(const r of runs){const M=mk(r.PB);for(const b of r.bodies){const its=r.SB.filter(x=>x.seat===b.seat&&x.run===b.run);
 const j=r.PB&&r.PB.judges.find(q=>q.seat===b.seat);const PT=j?M.gatePromptText2024(j.body):'';const ctx={R:PT?M.ciRounds(PT):null,DL:PT?M.drvLinks(PT):[],ask:PT.includes('CITATION CHECK')};
 const G=M.gateItems2024(b.seat,b.verdict_raw,b.fields,its,ctx);
 console.log(b.run+' '+b.seat+': sb '+its.length+', applied '+(G.R1?G.R1.applied.join(','):'-')+', verdict '+b.fields.verdict_tag+' -> '+(G.R1?G.R1.fields.verdict_tag:'-')+'; rounds '+(ctx.R?Object.keys(ctx.R).join(','):'none')+(G.newk_error?'; NEWK ERROR '+G.newk_error:''));
 for(const x of G.items)console.log('   '+x.gid+' '+x.kind+' ['+x.src+(x.live?'':', record-only')+']: '+x.why.slice(0,300));}}}
