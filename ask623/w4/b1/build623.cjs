// ASK 623 build (W4): Gemini 4 Neon and Gemini 4 Hydrogen as debaters and judges. Engine only (the child names neither seat).
// Base: live engine 94b682a0 (base_moMxiV4Irg1uRBZN.json, fetched 15:43 CST 11-24). Nodes: Init Seats, Resolve Seats, Build Synthesis, Build Independent Verdict, Build Diagnostic Prompt.
const fs=require('fs');const crypto=require('crypto');const md5=s=>crypto.createHash('md5').update(s).digest('hex');
const E=JSON.parse(fs.readFileSync(__dirname+'/base_moMxiV4Irg1uRBZN.json','utf8'));
if(E.versionId!=='94b682a0-5ebb-4c8b-9a9d-880080048847')throw new Error('base is not 94b682a0');
const once=(s,a,b,what)=>{const k=s.split(a).length-1;if(k!==1)throw new Error(what+': anchor occurs '+k+' times');return s.replace(a,()=>b);};
const node=n=>E.nodes.find(x=>x.name===n);const out=[];
// Init Seats: debater list, family table, JFAM.
{const n=node('Init Seats');let c=n.parameters.jsCode;const c0=c;
 c=once(c,"deepseek:{fam:'deepseek',mc:'deepseek_debate'}};","deepseek:{fam:'deepseek',mc:'deepseek_debate'},hydrogen:{fam:'openrouter',mc:'hydrogen'},neon:{fam:'openrouter',mc:'neon'}}; /* ASK 623: Gemini 4 Hydrogen and Gemini 4 Neon debate; the key equals the seat name, so FAM_PANEL and the DB lookups find the debater */",'Init ENG');
 c=once(c,"hydrogen:'google',argon:'google'","hydrogen:'google',neon:'google'/* ASK 623 */,argon:'google'",'Init FAM_PANEL');
 c=once(c,"hydrogen:'openrouter',","hydrogen:'openrouter',neon:'openrouter'/* ASK 623 */,",'Init JFAM');
 n.parameters.jsCode=c;out.push(['Init Seats',md5(c0),md5(c)]);}
for(const nm of ['Resolve Seats','Build Synthesis','Build Independent Verdict','Build Diagnostic Prompt']){const n=node(nm);let c=n.parameters.jsCode;const c0=c;
 c=once(c,"hydrogen:'openrouter',","hydrogen:'openrouter',neon:'openrouter'/* ASK 623 */,",nm+' JFAM');n.parameters.jsCode=c;out.push([nm,md5(c0),md5(c)]);}
fs.writeFileSync(__dirname+'/target_engine_623.json',JSON.stringify(E));
out.forEach(x=>console.log(x.join(' | ')));console.log('target md5',md5(fs.readFileSync(__dirname+'/target_engine_623.json','utf8')));
