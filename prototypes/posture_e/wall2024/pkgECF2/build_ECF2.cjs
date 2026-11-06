// pkgECF2 (W3 Wall 2540, ruling (a) sharpened): on pkgECF/patched (graded PASS 4b5c4d5). Only the E-COL cure in Send Back Record and Alt changes.
// A KEEP, or a CHANGE TO that still grades the pair BROKEN or FORCED, cures only when its sentence (or line) quotes BOTH sides of the claimed conflict:
//  (1) 6 or more words in a row of the answering side's own words: a run in its rounds that is not inside a quoted row (the FAILS words may be these);
//  (2) 6 or more words in a row of a quoted row (a verse as either side quotes it, inside quotation marks in any round), not the same run as (1).
// A LINK BROKEN line that rests on an unanswered press (it says so: unanswered / not answered / no answer) also cures by quoting 6 or more words
// in a row of the pressing side's round (ruling 392). Everything else in pkgECF is unchanged. Run from wall2024/: node pkgECF2/build_ECF2.cjs
const fs=require('fs');const crypto=require('crypto');const sha=s=>crypto.createHash('sha256').update(s).digest('hex').slice(0,16);
const OUT='pkgECF2',BASE='pkgECF/patched';
const A0=" if(it.rule==='E-COL'){",A1=" return res(false,'not an E-ANS, E-PREM or E-COL item');}";
const NEW=String.raw` if(it.rule==='E-COL'){const L=String(it.line||'').replace(/\\+"/g,'"');const pm=(L.match(/\b(D\d+)\s*vs\.?\s*(C\d+)\b/i)||String(it.item||'').match(/\b(D\d+)\s*vs\.?\s*(C\d+)\b/i));
  const am=L.match(/ANSWER\s*\[\s*(?:([CD])R|(Defender|Challenger))/i);const fs=am?(am[1]?am[1].toUpperCase():(/^d/i.test(am[2])?'C':'D')):/CHALLENGER LINK BROKEN/.test(L)?'D':/DEFENDER LINK BROKEN/.test(L)?'C':null; /* pkgECF: the answering side; its rounds are CR (defender) or DR (challenger) */
  if(!fs)return res(false,'the line names no answering side');const FORC=/^\s*FORCED\b/i.test(L);const ps=fs==='C'?'D':'C';
  /* pkgECF2 (W3 2540): a round split into its own words and its quoted rows (text inside quotation marks) */
  const QR=/"[^"\n]{8,}?"|“[^”\n]{8,}?”/g;const own=k=>String(R&&R[k]||'').replace(/[*_\x60]+/g,'').replace(QR,' | ');const rows=k=>(String(R&&R[k]||'').replace(/[*_\x60]+/g,'').match(QR)||[]).join(' | ');
  const hasIn=(txt,q)=>(' '+N(txt)+' ').includes(' '+q+' ');const run6=(s,txts,not)=>{const w=N(s).split(' ').filter(Boolean);for(let i=0;i+6<=w.length;i++){const r=w.slice(i,i+6).join(' ');if(not&&(' '+not+' ').includes(' '+r+' '))continue;if(txts.some(t=>hasIn(t,r)))return r;}return null;};
  const KS=Object.keys(R||{}).filter(k=>side(k));const ANSF=KS.filter(k=>side(k)===fs).map(k=>String(R[k]||'')),ROWS=KS.map(rows),PRS=KS.filter(k=>side(k)===ps).map(k=>String(R[k]||''));
  const ROWN=' '+ROWS.map(N).join(' | ')+' ';const ownRun=(t)=>{const w=N(t).split(' ').filter(Boolean);for(let i=0;i+6<=w.length;i++){const r=w.slice(i,i+6).join(' ');if(ROWN.includes(' '+r+' '))continue;if(ANSF.some(x=>hasIn(x,r)))return r;}return null;}; /* the answer's own words: a run in its rounds that is not inside a quoted row (the FAILS words may carry a quoted phrase) */
  const both=s=>{const t=String(s||'').replace(/\\+"/g,'"');const a1=ownRun(t);if(!a1)return {ok:false,why:'quotes no 6 words in a row of the answering side\'s own words'};const v=run6(t,ROWS,a1);if(!v)return {ok:false,why:'quotes the answering side ("'+a1+'") but no 6 words in a row of the quoted verse it cannot agree with'};return {ok:true,why:'quotes the answer ("'+a1+'") and the verse ("'+v+'")'};};
  const press=s=>{if(FORC||!/\b(?:unanswered|not answered|no answer|left (?:it )?unanswered|never answered)\b/i.test(String(s||'')+' '+L))return null;const r=run6(s,PRS,null);return r?'quotes the unanswered pressing sentence ("'+r+'"), ruling 392':null;};
  if(a.ans==='CHANGE'){const to=String(a.to||'');const pr=pm?new RegExp('\\b'+pm[1]+'\\s*vs\\.?\\s*'+pm[2]+'\\b','i'):null;
   if(!/\b(?:BROKEN|FORCED)\b/.test(to)&&(!pr||pr.test(to)||/^\s*RETRACTED\b/i.test(to)))return res(true,'CHANGE TO a line that does not grade the pair BROKEN or FORCED');
   const s=to+' '+(a.why||'');const p=press(s);if(p)return res(true,'CHANGE TO keeps the break and '+p);const b2=both(s);return res(b2.ok,'CHANGE TO keeps the break and '+b2.why);}
  const p=press(a.why);if(p)return res(true,'KEEP that '+p);const b2=both(a.why);return res(b2.ok,'KEEP that '+b2.why);}
` ;
fs.mkdirSync(OUT+'/patched',{recursive:true});const plan={base:BASE,nodes:[]};
for(const f of ['Send_Back_Record.js','Alt_Send_Back_Record.js']){const s0=fs.readFileSync(BASE+'/'+f,'utf8');const i=s0.indexOf(A0),j=s0.indexOf(A1);if(i<0||j<0||s0.indexOf(A0,i+1)>=0)throw new Error(f+': anchors');
 const s=s0.slice(0,i)+NEW+s0.slice(j);new Function('$','$input','$json',s);fs.writeFileSync(OUT+'/patched/'+f,s);plan.nodes.push({file:f,base_sha:sha(s0),final_sha:sha(s)});console.log(f.padEnd(28),sha(s0),'->',sha(s));}
const SBA="To keep the line, KEEP it with a sentence that quotes at least 6 words in a row of the answering side\\'s round that the meaning cannot agree with (or, for a line resting on an unanswered press, the pressing sentence with its round, ruling 392).";
const SBB="To keep the line, KEEP it with a sentence that quotes both sides of the conflict: at least 6 words in a row of the answering side\\'s own words (its FAILS words may be these), and at least 6 words in a row of the verse those words cannot agree with, as a round quotes it (pkgECF2, W3 2540). For a line resting on an unanswered press, say it was left unanswered and quote the pressing sentence, at least 6 words in a row (ruling 392).";
for(const f of ['Send_Back_Build.js','Alt_Send_Back_Build.js']){const s0=fs.readFileSync(BASE+'/'+f,'utf8');if(s0.split(SBA).length!==2)throw new Error(f+': SB anchor');const s=s0.replace(SBA,()=>SBB);new Function('$','$input','$json',s);fs.writeFileSync(OUT+'/patched/'+f,s);plan.nodes.push({file:f,base_sha:sha(s0),final_sha:sha(s)});console.log(f.padEnd(28),sha(s0),'->',sha(s));}
fs.writeFileSync(OUT+'/plan_ECF2.json',JSON.stringify(plan,null,1));
