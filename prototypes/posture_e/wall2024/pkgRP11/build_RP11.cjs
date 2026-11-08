// pkgRP11 (reader phase 2, item 11 ANSWER CHECK, W4): in the three Judge Enforcer Build nodes, the ANSWER CHECK form reads ask the shared
// reader (__RL, embedded by pkgRP10) first (the form only; prose reads stay): acRound (whose answer: the round letter), acUnp (UNPROVEN press), __acG (the grade word) and the
// side/verse filter of the UNEXHIBITED-premise check. A line the reader does not read as ANSWER CHECK (refused, RESTATED, or another form) keeps
// the old read. eaxHold (Judge Enforcer Record x3) is NOT swapped: it reads the engine-built item key "ANSWER CHECK <verse> [CRn]", not a judge
// line; the reader reads no form there (probe in test_RP11). Run from wall2024/: node pkgRP11/build_RP11.cjs <fetchback or composed target>
const fs=require('fs'),cr=require('crypto');const sha=s=>cr.createHash('sha256').update(String(s)).digest('hex').slice(0,12);
const F=process.argv[2]||'/mnt/project-files/wall2024/fetchback_live_s65.json';const W=JSON.parse(fs.readFileSync(F,'utf8'));
const node=n=>W.nodes.find(z=>z.name===n).parameters.jsCode;
const H="/* pkgRP11 (reader item 11): the ANSWER CHECK line as the shared reader reads it, or null (refused, RESTATED, another form): the old read decides on null */\n"
 +"const __ri11=l=>{try{const r=__RL.readLine(String(l==null?'':l));return r&&r.form==='ANSWER CHECK'&&r.f&&!r.f.restated&&r.f.grade&&Array.isArray(r.f.rounds)?r:null;}catch(e){return null;}};\n";
const REPL=[
 [String.raw`const acRound=a=>{`, H+String.raw`const acRound=a=>{const r=__ri11(a);if(r&&r.f.rounds.length)return r.f.rounds[0][0]==='C'?'C':'D';return acRound0(a);}; /* pkgRP11 */
const acRound0=a=>{`],
 [String.raw`const acUnp=a=>`, String.raw`const acUnp=a=>{const r=__ri11(a);if(r)return r.f.grade==='UNPROVEN'||r.f.means===''||(!!r.f.meansBare&&/^NONE\b/.test(String(r.f.means||'')))||/\bUNPROVEN\b/.test(String(a));return acUnp0(a);}; /* pkgRP11: the form (grade word, empty or NONE MEANS) from the reader; an UNPROVEN in the prose still counts, as before */
const acUnp0=a=>`],
 [String.raw`{const __acG=a=>{const m=String(a).match(AC);`, String.raw`{const __acG=a=>{const r=__ri11(a);if(r)return /^(MEETS|MISSES|FAILS)$/.test(r.f.grade)?r.f.grade:null;return __acG0(a);}; /* pkgRP11 */
 const __acG0=a=>{const m=String(a).match(AC);`],
 [String.raw`const m=a.match(/^ANSWER CHECK:\s*(.+?)\s*--\s*\[\s*([CD])R/);return m&&m[2]===rl&&refsOf(m[1]).has(r);`,
  String.raw`const __r=__ri11(a);const m=__r?(__r.f.rounds.length?[a,__r.f.verse,__r.f.rounds[0][0]]:null):a.match(/^ANSWER CHECK:\s*(.+?)\s*--\s*\[\s*([CD])R/); /* pkgRP11 */return m&&m[2]===rl&&refsOf(m[1]).has(r);`]];
const plan={base:F,base_versionId:W.versionId,nodes:{}};fs.mkdirSync('pkgRP11/patched',{recursive:true});
for(const n of ['Judge Enforcer Build','Alt Judge Enforcer Build','R2 Alt Judge Enforcer Build']){let c=node(n);const b=sha(c);
 if(!c.includes('const __RL='))throw new Error(n+': no embedded reader (pkgRP10 must be live first)');
 for(const [a,z] of REPL){const k=c.split(a).length-1;if(k!==1)throw new Error(n+': anchor x'+k+': '+a.slice(0,60));c=c.replace(a,()=>z);}
 const AF=Object.getPrototypeOf(async function(){}).constructor;new AF(c);
 fs.writeFileSync('pkgRP11/patched/'+n.replace(/ /g,'_')+'.js',c);plan.nodes[n]={base:b,patched:sha(c)};}
fs.writeFileSync('pkgRP11/plan_RP11.json',JSON.stringify(plan,null,1)+'\n');console.log(JSON.stringify(plan,null,1));
