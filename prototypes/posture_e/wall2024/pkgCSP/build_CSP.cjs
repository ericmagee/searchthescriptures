// pkgCSP (B8; hermes 1 #1, hermes 2 #7, hermes 3 #7; W3 feedback rulings item 8): the stored concession count split.
// conceded_links / challenger_conceded_links store ONE number that adds the side's own grants (CONCEDED, WITHDRAWN) to the premises the judge
// found not exhibited (UNEXHIBITED). Read alone, the number says "the Oracle concedes" when it most often conceded nothing (33218: chatgpt 2 and
// gemini 1, every one UNEXHIBITED). This package adds a conceded_split object to every stored judgment and to the single-judge row:
//   {reader:'pkgCLR', defender:{stored, stated, granted, unexhibited, unnamed, granted_items, unexhibited_items}, challenger:{...}}
// read from the final verdict text by W1's shared count-line reader (pkgCLR/clr.cjs, embedded in its own scope so a later pkgCLR copy in the
// same node cannot collide). Record only: no count, grade, outcome or seat changes.
// Both save functions (record_debate_judgment, record_debate_row) take only keys that are real columns, so the key is dropped harmlessly until
// the column exists. The column is a DDL step for Eric's approval (WIRING.md).
// Alternate Merge: every final judgment body gets payload.conceded_split before Write Judgment 1-3 reads it.
// Build Save Body: saveBody gets conceded_split from the single judge's independent_verdict_raw.
// Base: live s12 (d5375c6e). The anchors also hold on pkgSGA2 (Alternate Merge) and pkgPMR (Build Save Body) outputs; build_CSP checks that.
// Run from wall2024/: node pkgCSP/build_CSP.cjs
const fs=require('fs');const crypto=require('crypto');const sha=s=>crypto.createHash('sha256').update(s).digest('hex').slice(0,16);
const LIVE=JSON.parse(fs.readFileSync('/mnt/project-files/wall2024/fetchback_live_s12.json','utf8'));
const CLRSRC=fs.readFileSync('pkgCLR/clr.cjs','utf8').replace(/\nif\(typeof module!=='undefined'\)module\.exports=CLR;\s*$/,'\n');
if(/module\.exports/.test(CLRSRC))throw new Error('clr.cjs export line not stripped');
const LIB="/* pkgCSP (B8): the stored count split. CLR is W1's count-line reader (pkgCLR/clr.cjs), here in its own scope. */\n"
 +"const __CSP=(()=>{\n"+CLRSRC
 +"const nm=x=>(x.ref==='PREMISE'?'premise ':x.ref==='LINK'?'link ':x.ref)+x.num;\n"
 +"const one=(t,side,stored)=>{const st=(typeof stored==='number'&&isFinite(stored))?stored:null;const r=CLR.read(t,side);if(!r)return {stored:st,stated:null,granted:0,unexhibited:0,unnamed:null,granted_items:[],unexhibited_items:[]};\n"
 +" const g=r.counted.filter(x=>x.tag==='CONCEDED'||x.tag==='WITHDRAWN'),u=r.counted.filter(x=>x.tag==='UNEXHIBITED');\n"
 +" return {stored:st,stated:r.count,granted:g.length,unexhibited:u.length,unnamed:r.count==null?null:Math.max(0,r.count-g.length-u.length),granted_items:g.map(nm),unexhibited_items:u.map(nm)};};\n"
 +"return (t,dc,cc)=>{try{return {reader:'pkgCLR',defender:one(String(t==null?'':t),'DEFENDER',dc),challenger:one(String(t==null?'':t),'CHALLENGER',cc)};}catch(e){return {reader:'pkgCLR',error:String(e&&e.message||e).slice(0,200)};}};})();\n";
// Both nodes are wrapped whole: the node's own code runs unchanged inside an arrow function (every return path, including Alternate Merge's
// early returns when no alternate is seated), and the split is added to what it returns.
const WRAP=(s0,post)=>LIB+"const __CSPOUT=(()=>{\n"+s0+"\n})();\n"+post+"\nreturn __CSPOUT; /* pkgCSP (B8) */\n";
const POST={'Alternate Merge':"if(Array.isArray(__CSPOUT))for(const it of __CSPOUT){const j=it&&it.json;if(!j||!Array.isArray(j.bodies))continue;it.json={...j,bodies:j.bodies.map(x=>{try{const s=typeof x==='string';const o=s?JSON.parse(x):JSON.parse(JSON.stringify(x));if(!o||!o.payload)return x;o.payload.conceded_split=__CSP(o.payload.verdict_raw,o.payload.conceded_links,o.payload.challenger_conceded_links);return s?JSON.stringify(o):o;}catch(e){return x;}})};}",
 'Build Save Body':"if(Array.isArray(__CSPOUT))for(const it of __CSPOUT){const j=it&&it.json;if(!j||!j.saveBody||typeof j.saveBody!=='object')continue;it.json={...j,saveBody:{conceded_split:__CSP(j.independent_verdict_raw,j.conceded_links,j.challenger_conceded_links),...j.saveBody}};}"};
const E={'Alternate Merge':1,'Build Save Body':1};
function patch(n,s0){const s=WRAP(s0,POST[n]);new Function('$','$input','$json','$execution','$workflow',s);return {s,done:['wrap']};}
const plan={source:'B8 (W3 feedback rulings item 8)',live:LIVE.versionId,nodes:[],also_on:[]};
for(const d of ['base','patched'])fs.mkdirSync('pkgCSP/'+d,{recursive:true});
for(const n of Object.keys(E)){const f=n.replace(/ /g,'_')+'.js';const s0=LIVE.nodes.find(z=>z.name===n).parameters.jsCode;const {s,done}=patch(n,s0);
 fs.writeFileSync('pkgCSP/base/'+f,s0);fs.writeFileSync('pkgCSP/patched/'+f,s);plan.nodes.push({name:n,file:f,base_sha:sha(s0),final_sha:sha(s),edits:done});console.log(n.padEnd(16),sha(s0),'->',sha(s),done.join(','));}
// the same edits on the outputs of the packages graded ahead of this one
for(const [n,f] of [['Alternate Merge','pkgSGA2/patched/Alternate_Merge.js'],['Build Save Body','pkgPMR/patched/Build_Save_Body.js']]){const s0=fs.readFileSync(f,'utf8');const {s}=patch(n,s0);
 const o='pkgCSP/patched/on_'+f.split('/')[0]+'_'+n.replace(/ /g,'_')+'.js';fs.writeFileSync(o,s);plan.also_on.push({name:n,on:f,base_sha:sha(s0),final_sha:sha(s)});console.log(('on '+f.split('/')[0]).padEnd(16),n,sha(s0),'->',sha(s));}
fs.writeFileSync('pkgCSP/plan_CSP.json',JSON.stringify(plan,null,1));
