// ASK 378 rev 3.3 (W1 8035, 8040, 8041; W2 8038; W3 8036, 8043, 8046; W4 8045, 8048): Format Markdown only, presentation. Base: live s261.
const fs=require('fs');const w=JSON.parse(fs.readFileSync(process.argv[2]));if(w.versionId!=='57faac9f-da2a-469d-be22-ebfcd8416348')throw new Error('base moved '+w.versionId);
const n=w.nodes.find(x=>x.name==='Format Markdown');let c=n.parameters.jsCode;const N0=c.length;
const once=(a)=>{const i=c.indexOf(a);if(i<0||c.indexOf(a,i+1)>=0)throw new Error('anchor '+a.slice(0,60));return i;};
const cut=(a,b)=>{const i=once(a);const j=c.indexOf(b,i);if(j<0)throw new Error('end '+b.slice(0,60));return [i,j+b.length];};
let [i,j]=cut("const SEATS = (() => { const DR = Array.isArray(r.drv_removed)","J.forEach(q => { if (!used.has(q)) { n++; used.add(q); out.push({ j: q, n, tag: '' }); } }); return out; })();");
c=c.slice(0,i)+fs.readFileSync(__dirname+'/seats.js','utf8').trim()+c.slice(j);
[i,j]=cut("/* ASK 378: a judge is counted when it is not truncated","{const gl=g4Line(r.panel_substitution,nm);if(gl)t += '- ' + gl + '\\n';}");
c=c.slice(0,i)+fs.readFileSync(__dirname+'/judges.js','utf8').trim()+c.slice(j);
const S0="A CHANGE is recorded here; the counts and result above are not recomputed from it.";once(S0);
c=c.replace(S0,()=>"A CHANGE is applied to the judge\\'s own lines, and the engine derives the verdict, standings, counts and RESULT again from the changed lines (E-APPLY, Wall 2236 and 2237); each judge\\'s line in the header lists the change it made.");
if(/\b(chatgpt|sol62|haiku|ernie|terra|sonnet|gemini|spark)\b/i.test(fs.readFileSync(__dirname+'/seats.js','utf8')+fs.readFileSync(__dirname+'/judges.js','utf8')))throw new Error('seat name in new code');
n.parameters.jsCode=c;fs.writeFileSync(process.argv[3],JSON.stringify(w));console.log('ok',N0,'->',c.length);
