// pkgL1Q test. Run from wall2024/: node pkgL1Q/test_L1Q.cjs
// 1. Unit: the new PAIR on chatgpt's 33371 lines (single quotes pair), apostrophe-only lines (no pair), double-quote lines (same pair as before).
// 2. Unit: __l1qSq on the 14362 RESPONSE body (stands in [CR4]) and on a single-quoted string that stands in no round.
// 3. Replay: every saved run x 23 nodes, base s44 code vs patched code on the same saved input; every changed output listed.
const fs=require('fs');const {harness,feeder}=require('../pkgGSL/harness.cjs');
const BASE='/mnt/project-files/wall2024/fetchback_live_s44.json';const W=JSON.parse(fs.readFileSync(BASE,'utf8'));const P=__dirname+'/patched/';
const plan=JSON.parse(fs.readFileSync(__dirname+'/patched.plan.json','utf8'));
let ok=0,bad=0;const T=(c,m)=>{if(c){ok++;}else{bad++;console.log('FAIL',m);}};const out=[];const log=s=>{out.push(s);console.log(s);};
// ---- 1. PAIR
const pick=(src,a,b)=>{const i=src.indexOf(a);return src.slice(i,src.indexOf(b,i)+b.length);};
const sbr=fs.readFileSync(P+'Send_Back_Record.js','utf8'),sb0=W.nodes.find(n=>n.name==='Send Back Record').parameters.jsCode;
const mk=src=>{src=src.slice(src.indexOf('const ECL=(()=>{'));return new Function(pick(src,'const REF=/','\n')+'\n'+pick(src,'const PAIR=new RegExp','\n')+'\nreturn PAIR;')();};
const P1=mk(sbr),P0=mk(sb0);const q=(R,s)=>[...s.matchAll(R)].map(p=>p[5]||p[6]);
const L=[
 ["14699 [L1] single","GROUND: [L1] Matthew 1:25 'And knew her not till she had brought forth her firstborn son: and he called his name JESUS.'; the record leaves","And knew her not till she had brought forth her firstborn son: and he called his name JESUS."],
 ["14700 [L1] single","GROUND: [L1] Luke 1:36 'And, behold, thy cousin Elisabeth, she hath also conceived a son in her old age'; the record","And, behold, thy cousin Elisabeth, she hath also conceived a son in her old age"],
 ["14701 [L1] single","GROUND: [L1] Luke 2:48 'behold, thy father and I have sought thee sorrowing.'; the record","behold, thy father and I have sought thee sorrowing."],
 ["14702 [L1] single","GROUND: [L1] Romans 1:3 'Concerning his Son Jesus Christ our Lord, which was made of the seed of David according to the flesh;'; the record","Concerning his Son Jesus Christ our Lord, which was made of the seed of David according to the flesh;"],
 ["14695 [L1] single","GROUND: [L1] John 3:6 'That which is born of the flesh is flesh; and that which is born of the Spirit is spirit.'; the record","That which is born of the flesh is flesh; and that which is born of the Spirit is spirit."],
 ["curly single","[L1] Luke 2:48 ‘thy father and I have sought thee sorrowing’ |","thy father and I have sought thee sorrowing"],
 ["in-word apostrophe inside quote","[L1] Luke 2:49 'wist ye not that I must be about my Father's business?' |","wist ye not that I must be about my Father's business?"],
];
for(const [nm,s,want] of L){const g=q(P1,s);T(g.length===1&&g[0]===want,'PAIR '+nm+' got '+JSON.stringify(g));T(q(P0,s).length===0,'base PAIR already paired '+nm);}
const NEG=[["apostrophe only","[L1] Luke 2:48 shows Mary's words and Joseph's place in the house of David's line"],["possessive after ref","[L1] Matthew 1:20 the angel's word to Joseph's dream, the Lord's own"]];
for(const [nm,s] of NEG)T(q(P1,s).length===0,'NEG '+nm+' got '+JSON.stringify(q(P1,s)));
const DQ=["[L1] Matthew 1:20 \"that which is conceived in her is of the Holy Ghost\" and","[L1] Luke 3:23 “being (as was supposed) the son of Joseph” |","GROUND: Matthew 1:19 (Joseph's act) \"not willing to make her a publick example\" [L1]"];
for(const s of DQ)T(JSON.stringify(q(P1,s))===JSON.stringify(q(P0,s))&&q(P0,s).length===1,'DQ parity '+s.slice(0,40));
// ---- 2. __l1qSq
const pcc=fs.readFileSync(P+'Panel_Cure_Check.js','utf8');
const cf=(()=>{const t=pcc.slice(pcc.lastIndexOf('function cureFound('));return t.slice(0,t.indexOf('\nfunction ')).replace(/\n\/\/[^\n]*$/,'');})();
const cq=pick(pcc,'const cureQ=s=>',';').length>20?pcc.slice(pcc.indexOf('const cureQ=s=>'),pcc.indexOf('\n',pcc.indexOf('const cureQ=s=>'))):'';
const sqf=new Function(cq+'\n'+cf+'\n'+pick(pcc,'function __l1qSq','}\n')+'\nreturn __l1qSq;')();
const R={CR4:"I accept the timing. The timing in 8:4 resembles 7:16, but the mother, the name and the stated means differ. So the sign stands.",CR3:"x"};
const fold=s=>s.replace(/[“”]/g,'"').replace(/[‘’]/g,"'");
T(sqf(fold("K-G4 D5 vs C4 | I accept the correction: [CR4] says, 'The timing in 8:4 resembles 7:16, but the mother, the name and the stated means differ.'"),R)===true,'14362 body reasoned');
T(sqf("I accept the correction: [CR4] says, 'the mother was a virgin and nothing else matters here.'",R)===false,'NEG single-quoted string in no round');
T(sqf("I accept the correction: the timing 'The timing in 8:4 resembles 7:16, but the mother' differs",R)===false,'NEG no round named');
T(sqf("[CR4] Mary's and Joseph's words and the Lord's name stand",R)===false,'NEG apostrophe-only body');
T(sqf("[CR4] says 'timing differs' and more",R)===false,'NEG span under 3 words');
T(sqf("[CR4] says 'The timing in 8:4 resembles 7:16'",null)===false,'no rounds -> false');
console.log('units: '+ok+' OK, '+bad+' FAIL');
// ---- 3. replay
const runs=fs.readdirSync('/mnt/project-files/wall2024/inputs/').filter(f=>/_index\.json$/.test(f)).map(f=>f.split('_')[0]).filter(r=>+r>=33218).sort();
const stable=x=>JSON.stringify(x,(k,v)=>k==='at'||k==='created_at'?undefined:v);
const flips=[];
for(const RUN of runs){const H=harness(RUN);
 for(const n of plan.nodes){const inp=feeder(BASE,n.name);const fin=[...inp.filter(f=>/Call/.test(f)),...inp.filter(f=>!/Call/.test(f))].find(f=>fs.existsSync('/mnt/project-files/wall2024/inputs/'+RUN+'_'+f.replace(/ /g,'_')+'.json'));
  if(!fin)continue;if(!fs.existsSync('/mnt/project-files/wall2024/inputs/'+RUN+'_'+n.name.replace(/ /g,'_')+'.json'))continue; /* node did not run */
  const c0=W.nodes.find(z=>z.name===n.name).parameters.jsCode,c1=fs.readFileSync(P+n.file,'utf8');let a,b,e0=null,e1=null;
  try{a=H(c0,fin);}catch(e){e0=String(e.message).slice(0,120);}try{b=H(c1,fin);}catch(e){e1=String(e.message).slice(0,120);}
  if(e0||e1){if(e0!==e1){bad++;log('ERR '+RUN+' '+n.name+' base='+e0+' patched='+e1);}else log('both-error '+RUN+' '+n.name+': '+e0);continue;}
  const A=Array.isArray(a)?a:[a],B=Array.isArray(b)?b:[b];ok++;
  if(stable(A)===stable(B))continue;
  // row-level diff where items carry rows
  const rowsOf=X=>X.flatMap(i=>{const j=i&&i.json||{};const arrs=Object.values(j).filter(v=>Array.isArray(v)&&v.some(r=>r&&typeof r==='object'&&('cure_status' in r||'status' in r)));return arrs.length?arrs.flat():(j.rule||j.cure_status?[j]:[]);});
  const ra=rowsOf(A),rb=rowsOf(B);let any=false;
  for(let k=0;k<Math.max(ra.length,rb.length);k++){const x=ra[k]||{},y=rb[k]||{};if(stable(x)!==stable(y)){any=true;
   flips.push({RUN,node:n.name,seat:y.seat||x.seat,rule:y.rule||x.rule,item:y.item||x.item,from:x.cure_status||x.status,to:y.cure_status||y.status,link:y.link||x.link,why:String(y.cure_reason||y.why||'').split('| CURE').pop().slice(0,200)});}}
  if(!any){const sa=stable(A),sb=stable(B);let i=0;while(i<sa.length&&sa[i]===sb[i])i++;flips.push({RUN,node:n.name,diff_at:i,base:sa.slice(Math.max(0,i-150),i+150),patched:sb.slice(Math.max(0,i-150),i+250)});}}}
log('replay node runs compared: '+ok);log('changed outputs: '+flips.length);for(const f of flips)log(JSON.stringify(f));
log('TOTAL '+ok+' OK, '+bad+' FAIL');fs.writeFileSync(__dirname+'/test_L1Q.txt',out.join('\n')+'\n');
