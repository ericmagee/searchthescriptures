// pkgEGA (W1, 11-08): DeepSeek K-W/K-S3 Enforcer Record reads an answer id written with its item label, "ENFORCER: G2/A2.1 -- AGREE -- ...".
// 33506: DeepSeek wrote "G<k>/A<k>.<n>" on most lines; the Record's id pattern starts at A<k>.<n>, so those lines matched neither the A-id nor the
// G<k> pattern and 35 of 36 answers stayed ENFORCER NO VERDICT. The label is read only when its k equals the answer's item number; otherwise the
// line is ignored (NO VERDICT, as today). Base: live s54 Enforcer Record. Run from wall2024/: node pkgEGA/build_EGA.cjs
const fs=require('fs');const crypto=require('crypto');const h=s=>crypto.createHash('sha256').update(s).digest('hex').slice(0,12);
const W=JSON.parse(fs.readFileSync('/mnt/project-files/wall2024/fetchback_live_s54.json','utf8'));const s0=W.nodes.find(z=>z.name==='Enforcer Record').parameters.jsCode;
const A="const m=l.replace(/[*_`]+/g,'').trim().match(/^ENFORCER\\s*:\\s*(?:(?:ITEM|ANSWER|ID)\\s+)?(A\\d+\\.\\d+)\\s*(?:--|—|–|-)\\s*(AGREE|DISAGREE|NO ANSWER)\\s*(?:--|—|–|-)?\\s*(.*)$/i);if(m)V[m[1].toUpperCase()]={v:m[2].toUpperCase(),why:m[3].trim()};";
const B="const m=l.replace(/[*_`]+/g,'').trim().match(/^ENFORCER\\s*:\\s*(?:(?:ITEM|ANSWER|ID)\\s+)?(?:(?:G|ITEM\\s*)?(\\d+)\\s*[\\/:,]\\s*)?(A(\\d+)\\.\\d+)\\s*(?:--|—|–|-)\\s*(AGREE|DISAGREE|NO ANSWER)\\s*(?:--|—|–|-)?\\s*(.*)$/i);if(m&&(!m[1]||m[1]===m[3]))V[m[2].toUpperCase()]={v:m[4].toUpperCase(),why:m[5].trim()}; /* pkgEGA: \"G<k>/A<k>.<n>\" (also \"ITEM k/\", \"k/\") reads as A<k>.<n> when the k agree (33506) */";
if(s0.split(A).length!==2)throw new Error('anchor '+(s0.split(A).length-1));const s=s0.replace(A,()=>B);
if(!/else\{const g=/.test(s.slice(s.indexOf('pkgEGA'))))throw new Error('else branch moved');new Function('$','$input',s);
fs.writeFileSync('pkgEGA/patched/Enforcer_Record.js',s);fs.writeFileSync('pkgEGA/plan_EGA.json',JSON.stringify({base:'live s54',nodes:{'Enforcer Record':{base:h(s0),patched:h(s)}}},null,1));console.log(h(s0),'->',h(s));
