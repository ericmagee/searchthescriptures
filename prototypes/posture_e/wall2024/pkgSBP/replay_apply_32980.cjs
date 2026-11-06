// E-APPLY replay on 32980 with the fixed send-back reader (W3 2245 request). Run from pkgSBP.
const fs=require('fs');const pat=fs.readFileSync('../merged_PWQA/Alternate_Merge.js','utf8');const lib=pat.slice(0,pat.indexOf("const PP=$('Panel Cure Check')"));
const M=new Function('$','$input',lib+'\nreturn {sbApply2024,cureRewrite,cureJText,rcLines};')(()=>{throw new Error('offline');},null);
const code=fs.readFileSync('patched/Send_Back_Record.js','utf8');const rows=JSON.parse(fs.readFileSync('fixture_sendback_32980.json','utf8'));
const by={};rows.forEach(r=>(by[r.seat]=by[r.seat]||[]).push(r));const seats=Object.entries(by).map(([seat,rs])=>({seat,reply:(rs.find(r=>r.full_reply)||{}).full_reply||'',items:rs.map((r,k)=>({sid:((r.response_line||'').match(/SENDBACK\s*:?\s*(?:ITEM\s*)?(S\d+)/i)||[])[1]||('S'+(k+1)),rule:r.rule,item:r.item,line:r.flagged_line,reason:''}))}));
const B=seats.map(s=>({json:{seat:s.seat,run_token:'t',api_model:'m',msg:'p',items:s.items}}));const R=seats.map(s=>({json:{choices:[{message:{content:s.reply}}]}}));
const $=n=>({'Judge Enforcer Record':{first:()=>({json:{}})},'Send Back Build':{all:()=>B}})[n];const SB=new Function('$','$input',code)($,{all:()=>R})[0].json.sb_items;
const bodies=JSON.parse(fs.readFileSync('fixture_bodies_32980.json','utf8'));
for(const b of bodies){const its=SB.filter(x=>x.seat===b.seat);const Rr=M.sbApply2024(b.seat,b.verdict_raw,b.fields,its);
 console.log(b.seat+': send-back CHANGE '+its.filter(x=>x.ans==='CHANGE').length+', KEEP '+its.filter(x=>x.ans==='KEEP').length+', NO ANSWER '+its.filter(x=>x.ans==='NO ANSWER').length+'; applied '+(Rr?Rr.applied.join(','):'none')+'; verdict '+b.fields.verdict_tag+' -> '+(Rr?Rr.fields.verdict_tag+' ('+Rr.tag+')':'unchanged')+'; RESULT '+(Rr?Rr.result0+' -> '+Rr.result:'-')+'; counts D '+b.fields.conceded_links+'->'+(Rr?Rr.fields.conceded_links:'-')+' C '+b.fields.challenger_conceded_links+'->'+(Rr?Rr.fields.challenger_conceded_links:'-'));
 if(Rr){Rr.items.forEach(z=>console.log('   ITEM '+z.sid+' '+z.kind+': '+z.why+' | '+String(z.to).slice(0,150)));if(/audit/.test('audit'))console.log('   '+Rr.audit.split('\n')[0].slice(0,400));}}
