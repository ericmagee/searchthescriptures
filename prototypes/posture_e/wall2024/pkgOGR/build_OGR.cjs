// pkgOGR (Eric 16:22 CST 2026-11-06; W3 spec): the Oracle's close round opens with the defender's grants. Oracle seat only (C nodes).
// Base: live ff8967bb. None of these nine nodes is touched by pkgKGW/pkgUNL/pkgABW/pkgKWC; Panel Build and BIV are pkgUND/patched (= live),
// the other seven are read from the saved workflow prewrite_kgw_7796fc67.json (pkgOGR/base). Run from wall2024/: node pkgOGR/build_OGR.cjs
//  (1) C4 Build: OGR (src_OGR.js) harvests the defender's grant sentences from [CR1]-[CR4] (D1-D4 Extract) and the [DR4] request carries the
//      list with the instruction to open with an OPPONENT'S GRANTS section.
//  (2) C4 Extract: OGR.check reads the section back: every harvested grant has its G<n> line, its quotation stands word for word in the round
//      it names and is the listed grant; G+ lines (other defender sentences) are checked against their round. Recorded on the item
//      (grants, grants_check). RECORD ONLY in this package: no re-call exists for a debater round (a send-back needs new call nodes; see PLAN.md).
//  (3) The close-round new-verse check (C4P.of in 8 nodes, C4P.fresh in C4 Extract) does not read the quotations inside the OPPONENT'S GRANTS
//      section: they are the defender's own words, and a verse inside them is not a new press by the challenger.
const fs=require('fs');const crypto=require('crypto');const sha=s=>crypto.createHash('sha256').update(s).digest('hex').slice(0,16);
const OGRSRC=fs.readFileSync('pkgOGR/src_OGR.js','utf8')+'\n';const OUT='pkgOGR/patched';fs.mkdirSync(OUT,{recursive:true});const plan={base:'live ff8967bb',nodes:[]};
const SRC={Panel_Build:'pkgUND/patched',Build_Independent_Verdict:'pkgUND/patched'};
const rep=(s,a,b,f)=>{const n=s.split(a).length-1;if(n!==1)throw new Error(f+': anchor found '+n+' times: '+a.slice(0,80));return s.replace(a,()=>b);};
const STRIP="const __ogrS=t=>{const T=String(t||'');const i=T.search(/OPPONENT['\\u2019]?S GRANTS\\s*:/i);if(i<0)return T;const L=T.slice(i).split('\\n');const G=/^\\s*[-*]?\\s*\\**\\s*G(?:\\d+|\\+)/;let n=1;while(n<L.length&&(G.test(L[n])||(!L[n].trim()&&n+1<L.length&&G.test(L[n+1]))))n++;const sec=L.slice(0,n).join('\\n');return T.slice(0,i)+sec.replace(/[\"\\u201c][^\"\\u201d\\n]*[\"\\u201d]/g,'\"\"')+T.slice(i+sec.length);}; /* pkgOGR (3): the quotations of the OPPONENT'S GRANTS section are the defender's words */";
const OF0="const of=F=>F&&F.dr4?fresh([F.gr1,F.gr2,F.dr3],F.dr4):[];",OF1=STRIP+"const of=F=>F&&F.dr4?fresh([F.gr1,F.gr2,F.dr3],__ogrS(F.dr4)):[];";
for(const n of ['Build_Synthesis','Build_Independent_Verdict','Build_Save_Body','Panel_Build','Format_Markdown','D4_Build','D4_Extract','C4_Build','C4_Extract']){const f=n+'.js';
 const s0=fs.readFileSync((SRC[n]||'pkgOGR/base')+'/'+f,'utf8');let s=rep(s0,OF0,OF1,f),e=1;
 if(n==='C4_Build'){s=OGRSRC+s;e++;
  s=rep(s,"const sys=I.csys;const msgs=","/* pkgOGR (1) */const __OGRG=(()=>{try{return OGR.harvest({CR1:$('D1 Extract').first().json.raw,CR2:$('D2 Extract').first().json.raw,CR3:$('D3 Extract').first().json.raw,CR4:$('D4 Extract').first().json.raw});}catch(e){return [];}})();const __OGRB=(()=>{try{return OGR.block(__OGRG);}catch(e){return '';}})();\nconst sys=I.csys;const msgs=",f);
  s=rep(s,"(G1DECL?'\\n\\n'+G1DECL:'')+'\\n\\nCLOSE ROUND -- your final words.","(G1DECL?'\\n\\n'+G1DECL:'')+(__OGRB?'\\n\\n'+__OGRB:'')+'\\n\\nCLOSE ROUND -- your final words.",f);e+=2;
  s=rep(s,"return [{json:{run_token:TOK,round:'C4',call:","return [{json:{run_token:TOK,round:'C4',grants:__OGRG,call:",f);e++;}
 if(n==='C4_Extract'){s=OGRSRC+s;e++;
  s=rep(s,"let new_press=[];try{new_press=C4P.fresh([$('C1 Extract').first().json.raw,$('C2 Extract').first().json.raw,$('C3 Extract').first().json.raw],raw);}catch(x){new_press=[];}",
   STRIP.replace('const __ogrS=','const __ogrS2=')+"\nlet new_press=[];try{new_press=C4P.fresh([$('C1 Extract').first().json.raw,$('C2 Extract').first().json.raw,$('C3 Extract').first().json.raw],__ogrS2(raw));}catch(x){new_press=[];}\n"
   +"/* pkgOGR (2): the OPPONENT'S GRANTS section read back against the harvested list (record only) */let grants=[],grants_check=null;try{const __R={CR1:$('D1 Extract').first().json.raw,CR2:$('D2 Extract').first().json.raw,CR3:$('D3 Extract').first().json.raw,CR4:$('D4 Extract').first().json.raw};grants=OGR.harvest(__R);grants_check=OGR.check(raw,grants,__R);}catch(x){grants_check={error:String(x&&x.message||x).slice(0,200)};}",f);e++;
  s=rep(s,"msg_id:e.id,new_press,renumbered}}];","msg_id:e.id,new_press,renumbered,grants,grants_check}}];",f);e++;}
 new Function('$','$input','$json',s);fs.writeFileSync(OUT+'/'+f,s);plan.nodes.push({file:f,base:(SRC[n]||'prewrite_kgw_7796fc67.json'),base_sha:sha(s0),final_sha:sha(s),edits:e});console.log(f.padEnd(32),sha(s0),'->',sha(s),e+' edits');}
fs.writeFileSync('pkgOGR/plan_OGR.json',JSON.stringify(plan,null,1));
