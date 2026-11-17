// ASK 378 (operator 16:18 CST 11-17; W1 plan rev 1 7911 and rev 2, W2 7914, 7918): the transcript header states which judges were counted and why, an empty seat
// and the alternates tried, a recomputed verdict, and the outcome rule. Format Markdown only. Base: live s258.
const fs=require('fs');const w=JSON.parse(fs.readFileSync(process.argv[2]));if(w.versionId!=='da90bc97-6b13-454e-bdd3-1b98300ac557')throw new Error('base moved '+w.versionId);
const n=w.nodes.find(x=>x.name==='Format Markdown');let c=n.parameters.jsCode;
const cut=(a,b)=>{const i=c.indexOf(a);if(i<0||c.indexOf(a,i+1)>=0)throw new Error('anchor '+a.slice(0,50));const j=c.indexOf(b,i);if(j<0)throw new Error('end '+b.slice(0,50));return [i,j+b.length];};
let [i,j]=cut("{const pv=r.panel_verdict,oc=r.outcome,sp=r.panel_split?","t += '**Outcome:** ' + (oc || 'not recorded') + (why ? '. ' + why : '') + '\\n\\n';}");
c=c.slice(0,i)+fs.readFileSync(__dirname+'/hdr_outcome.js','utf8').trim()+c.slice(j);
[i,j]=cut("SEATS.forEach(e => { if (e.removed) {","t += '- Panel result: **' + (r.panel_verdict || '?') + '**' + (r.panel_split ? ' (' + r.panel_split + ')' : '') + VSIDE + '\\n';");
c=c.slice(0,i)+fs.readFileSync(__dirname+'/hdr_judges.js','utf8').trim()+c.slice(j);
const O="const DRV_EFFECT = 'A panel judge with any violation not cured is not counted in the panel result; if fewer than two panel judges are counted, the result is ungraded and goes to review.';";
if(c.split(O).length!==2)throw new Error('DRV_EFFECT');c=c.replace(O,()=>"const DRV_EFFECT = 'A panel judge with any violation not cured is not counted in the panel result; if fewer than two panel judges are counted, the result is ungraded and goes to review. A TRIAL or RECORD-ONLY row is recorded and answered; it removes no judge.'; /* ASK 378 */");
if(/\b(chatgpt|sol62|haiku|ernie|terra)\b/i.test(fs.readFileSync(__dirname+'/hdr_outcome.js','utf8')+fs.readFileSync(__dirname+'/hdr_judges.js','utf8')))throw new Error('seat name in new code');
n.parameters.jsCode=c;fs.writeFileSync(process.argv[3],JSON.stringify(w));console.log('ok',c.length);
