// pkgEGP test: Enforcer Record, pkgEGA base (live s54 + EGA) vs pkgEGP, over every saved run with an Enforcer Call; every changed row listed.
// Bars: only 33497 changes; its 36 NO VERDICT answers each take the verdict DeepSeek wrote on the line in that answer's place; no verdicted row changes;
// count mismatch and a line quoting another answer stay NO VERDICT (units); a same-form item keeps the pkgEGL whole-item rule.
const fs=require('fs');const {harness}=require('../pkgGSL/harness.cjs');const D='/mnt/project-files/wall2024/inputs/';
const B0=fs.readFileSync('pkgEGA/patched/Enforcer_Record.js','utf8'),P1=fs.readFileSync('pkgEGP/patched/Enforcer_Record.js','utf8');
let ok=0,bad=0;const out=[];const T=(c,m)=>{c?ok++:bad++;out.push((c?'OK ':'FAIL ')+m);};
const vd=r=>(String(r.cure_reason||'').match(/^ENFORCER (AGREE|DISAGREE|NO ANSWER|NO VERDICT)/)||[])[1];
const runs=fs.readdirSync(D).filter(f=>/^\d+_Enforcer_Call_deepseek\.json$/.test(f)).map(f=>f.split('_')[0]).sort();let n=0,lost=0,other=0;
for(const R of runs){let a,b;try{a=harness(R)(B0,'Enforcer Call deepseek');b=harness(R)(P1,'Enforcer Call deepseek');}catch(e){out.push('   '+R+' skipped: '+e.message.slice(0,80));continue;}n++;
 const ra=a[0].json.enf421_rows||[],rb=b[0].json.enf421_rows||[];let ch=0;const t=x=>JSON.stringify(x[0].json.enf421&&x[0].json.enf421.tally);
 ra.forEach((x,i)=>{const va=vd(x),vb=vd(rb[i]);if(va===vb)return;ch++;if(va!=='NO VERDICT')lost++;});if(ch&&R!=='33497')other++;
 out.push('   '+R+': '+t(a)+(ch?' -> '+t(b)+' ('+ch+' rows changed)':' unchanged'));}
T(n>=10,'replay ran on '+n+' runs');T(lost===0,'no row that had a verdict changes ('+lost+')');T(other===0,'no run other than 33497 changes ('+other+')');
{const a=harness('33497')(B0,'Enforcer Call deepseek'),b=harness('33497')(P1,'Enforcer Call deepseek');const ra=a[0].json.enf421_rows,rb=b[0].json.enf421_rows;
 const ids=JSON.parse(fs.readFileSync(D+'33497_Enforcer_Build.json','utf8'))[0].data.main[0][0].json.ids;const rep=String(ra[0].full_reply);
 const GL={};rep.split('\n').forEach(l=>{const g=l.replace(/[*_`]+/g,'').trim().match(/^ENFORCER\s*:\s*G(\d+)\s*--\s*(AGREE|DISAGREE|NO ANSWER)/i);if(g)(GL[g[1]]=GL[g[1]]||[]).push(g[2].toUpperCase());});
 let fixed=0,match=0;ra.forEach((x,i)=>{if(vd(x)!=='NO VERDICT')return;fixed++;const id=ids[i].id,k=id.match(/^A(\d+)\.(\d+)$/);if(GL[k[1]]&&GL[k[1]][+k[2]-1]===vd(rb[i]))match++;});
 const nv=r=>r.filter(x=>vd(x)==='NO VERDICT').length;
 T(fixed===36&&match===36&&nv(rb)===0,'33497: NO VERDICT '+nv(ra)+' -> '+nv(rb)+'; each of '+fixed+' answers carries the verdict of the G line in its place ('+match+'/'+fixed+')');
 const ws=ra.filter((x,i)=>vd(x)!=='NO VERDICT');T(ws.every(x=>rb[ra.indexOf(x)].cure_reason===x.cure_reason),'33497: the 16 same-form (pkgEGL) answers keep their text');}
// units: run the V-building block on a fake reply
const mk=(rep,ids)=>{const H={'Panel Cure Check':{json:{}},'Enforcer Build':{json:{enf_skip:false,ids,run_token:'t',model:'m'}},'Enforcer Call deepseek':{json:{choices:[{message:{content:rep}}]}}};
 const $=n=>({first:()=>H[n]||{json:{}},all:()=>[H[n]||{json:{}}],isExecuted:true});const $input={first:()=>({json:{}}),all:()=>[{json:{}}]};
 try{return new Function('$','$input',P1)($,$input);}catch(e){return 'ERR '+e.message;}};
const ids=[{id:'A1.1',response_line:'STANDS WITHOUT IT because the fact is carried by [L1] Matthew 1:20 here',rule:'K-W'},{id:'A1.2',response_line:'NOT HELD: [CR2] grants the betrothed woman is the wife in law',rule:'K-W'}];
const rows=o=>(Array.isArray(o)?o[0].json.enf421_rows:[]).map(vd);
T(JSON.stringify(rows(mk('ENFORCER: G1 -- DISAGREE -- a\nENFORCER: G1 -- AGREE -- b',ids)))==='["DISAGREE","AGREE"]','unit: two G1 lines, two answers of differing form: read in order');
T(JSON.stringify(rows(mk('ENFORCER: G1 -- DISAGREE -- a',ids)))==='["NO VERDICT","NO VERDICT"]','unit: one G1 line, two differing answers: NO VERDICT (as before)');
T(JSON.stringify(rows(mk('ENFORCER: G1 -- DISAGREE -- a\nENFORCER: G1 -- AGREE -- b\nENFORCER: G1 -- AGREE -- c',ids)))==='["NO VERDICT","NO VERDICT"]','unit: three G1 lines, two answers: NO VERDICT');
T(JSON.stringify(rows(mk('ENFORCER: G1 -- NO ANSWER -- "NOT HELD: [CR2] grants the betrothed woman is the wife in law" x\nENFORCER: G1 -- AGREE -- b',ids)))==='["NO VERDICT","NO VERDICT"]','unit: line 1 quotes answer 2 and not its own: NO VERDICT');
T(JSON.stringify(rows(mk('ENFORCER: A1.1 -- AGREE -- a\nENFORCER: G1 -- DISAGREE -- b\nENFORCER: G1 -- DISAGREE -- c',ids)))==='["AGREE","NO VERDICT"]','unit: an answer with its own A-id line blocks the G lines (pkgEGL rule kept)');
out.push('TOTAL '+ok+' OK, '+bad+' FAIL');console.log(out.join('\n'));fs.writeFileSync('pkgEGP/test_EGP.txt',out.join('\n')+'\n');
