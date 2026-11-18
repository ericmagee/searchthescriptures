// ASK 389 rev 3 (W3 8103/8116/8120; grades W2 8110, W1 8117): Format Markdown only, presentation only.
// 1. superApply places LABEL: LINE tags by a key taken from the ORIGINAL; 2. unplaced tags are printed at the end of the seat's text;
// 3. a NEW ITEM row answered at the late gate prints as a Cured flag only when the seat carries the matching E-GATE LATE tag with "CURED: the gate change was applied".
const fs=require('fs'),acorn=require('../tools/node_modules/acorn');const [IN,OUT]=process.argv.slice(2);const d=JSON.parse(fs.readFileSync(IN));
if(d.versionId!=='90451490-638d-41d1-abcd-899d9d6648b9')throw new Error('base is not s262: '+d.versionId);
const N=d.nodes.find(n=>n.name==='Format Markdown');let s=N.parameters.jsCode;
const rep=(a,b)=>{if(s.split(a).length!==2)throw new Error('anchor count != 1: '+a.slice(0,60));s=s.replace(a,()=>b);};
const OLD_SA=s.slice(s.indexOf('const superApply = '),s.indexOf('const panelText = '));
if(!OLD_SA.startsWith('const superApply = ')||OLD_SA.length!==615)throw new Error('superApply anchor '+OLD_SA.length);
const NEW_SA=fs.readFileSync(__dirname+'/superApply389.js','utf8').trim()+'\n';
rep(OLD_SA,NEW_SA);
rep("const k = flagKey(x); const cured = k && cs.has(k); t += '| ' + (cured ? 'Cured flag' : 'Review flag') + ' (panel judge ' + nm(j.judge_seat) + ') | ' + (cured ? x.slice(1, -1).replace(/REVIEW THIS ROW\\.?/, 'CURED by the seat\\'s cure reply; recorded, not for review.') : x.slice(1, -1))",
    "const k = flagKey(x); const late = !(k && cs.has(k)) && lateCured(x, j.verdict_raw); const cured = (k && cs.has(k)) || late; t += '| ' + (cured ? 'Cured flag' : 'Review flag') + ' (panel judge ' + nm(j.judge_seat) + ') | ' + (cured ? x.slice(1, -1).replace(/REVIEW THIS ROW\\.?/, late ? 'CURED at the late gate (pkgLGS); recorded, not for review.' : 'CURED by the seat\\'s cure reply; recorded, not for review.') : x.slice(1, -1))");
rep("J.forEach(j => { const cs = curedSet(j.verdict_raw);",fs.readFileSync(__dirname+'/lateCured389.js','utf8').trim()+'\nJ.forEach(j => { const cs = curedSet(j.verdict_raw);');
acorn.parse(s,{ecmaVersion:'latest',allowReturnOutsideFunction:true,allowAwaitOutsideFunction:true});
N.parameters.jsCode=s;fs.writeFileSync(OUT,JSON.stringify(d));console.log('Format Markdown',OLD_SA.length,'->',NEW_SA.length,'superApply chars; node',s.length);
