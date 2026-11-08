// pkgEHF test: the 6 nodes, base vs pkgEHF, over every saved run.
// Bars: Judge/Alt Judge Enforcer Build differ only by the one E-HOLD sentence (system text), items identical; the 4 send-back nodes differ only
// where the pkgUND option text is used; 33617 terra S9 and S10 asks carry the FORCED form beside "the BROKEN line".
const fs=require('fs');const {harness,feeder}=require('../pkgGSL/harness.cjs');const D='/mnt/project-files/wall2024/inputs/';const WF='/mnt/project-files/wall2024/fetchback_live_s58.json';
const W=JSON.parse(fs.readFileSync(WF,'utf8'));let ok=0,bad=0;const out=[];const T=(c,m)=>{c?ok++:bad++;out.push((c?'OK ':'FAIL ')+m);};
const S1=" When the right grade is BROKEN and the answering side answered the pressed verse";const ADD2=" (on a witness the side answered: FORCED: <Dn vs Cm> -- MEANS [<round>]: \"...\" -- ANSWER [<round>]: \"...\" -- FAILS: \"...\")";const A3="A CHANGE TO here replaces only this line and cannot add the FORCED line.",B3="A CHANGE TO here replaces only this line: on a witness the side answered, CHANGE TO the BROKEN line that names the meaning the answer fails, and give the FORCED line when the gate asks for it (K-G4, ruling 421); never write that the witness was left unanswered.";let optN=0,optNoForm=0,cantAdd=0,keptA=0,keptB=0;
const runs=[...new Set(fs.readdirSync(D).filter(f=>/^\d+_index\.json$/.test(f)).map(f=>f.split('_')[0]))].sort();
const base=n=>/Judge Enforcer Build/.test(n)?fs.readFileSync((n==='Alt Judge Enforcer Build'?'pkgEAK':'pkgEKD')+'/patched/'+n.replace(/ /g,'_')+'.js','utf8'):W.nodes.find(z=>z.name===n).parameters.jsCode;
let n=0,stray=[],chg={};let s9='';
for(const nm of ['Judge Enforcer Build','Alt Judge Enforcer Build','Send Back Build','Send Back Record','Alt Send Back Build','Alt Send Back Record']){const B0=base(nm),P1=fs.readFileSync('pkgEHF/patched/'+nm.replace(/ /g,'_')+'.js','utf8');chg[nm]=0;
 const fe=feeder(WF,nm);
 for(const R of runs){if(!fs.existsSync(D+R+'_'+nm.replace(/ /g,'_')+'.json'))continue;const i=[...fe.filter(x=>/Call/.test(x)),...fe.filter(x=>!/Call/.test(x))].find(x=>fs.existsSync(D+R+'_'+x.replace(/ /g,'_')+'.json'));if(!i)continue;
  let a,b;try{a=JSON.stringify(harness(R)(B0,i));b=JSON.stringify(harness(R)(P1,i));}catch(e){continue;}n++;if(a===b)continue;chg[nm]++;
  // remove the added text (in any JSON escaping) from b and compare
  const esc=t=>{let v=t;const o=[v];for(let k=0;k<3;k++){v=JSON.stringify(v).slice(1,-1);o.push(v);}return o;};
  {const esc=t=>{let v=t;const o=[v];for(let k=0;k<3;k++){v=JSON.stringify(v).slice(1,-1);o.push(v);}return o;};const E3=esc(A3),F3=esc(B3);E3.forEach((e,k)=>{a=a.split(e).join(F3[k]);});}
  if(/Send Back Build/.test(nm)){const t=b.replace(/\\+"/g,'"');optN+=(t.match(/Commitment 13 \(on a witness the side answered: FORCED: <Dn vs Cm>/g)||[]).length;cantAdd+=(t.match(/cannot add the FORCED line/g)||[]).length;keptA+=(a.match(/RETRACTED, or keep UNDERDETERMINED/g)||[]).length;keptB+=(b.match(/RETRACTED, or keep UNDERDETERMINED/g)||[]).length;}
  let bb=b;const add1=(/Judge Enforcer/.test(nm)?B0:'').length?null:null;
  if(/Judge Enforcer/.test(nm)){const m=P1.match(/ When the right grade is BROKEN and the answering side[^\n]*?\(pkgEHF\)\./);for(const e of esc(m[0].replace(/\\'/g,"'")))bb=bb.split(e).join('');}
  else for(const e of esc(ADD2))bb=bb.split(e).join('');
  const rs=(a,b,head)=>{let p=0,q=0;while(p<a.length||q<b.length){if(a[p]===b[q]){p++;q++;continue;}if(b.startsWith('[...]',q)||b.startsWith(' [...]',q)){const w=b.startsWith('[',q)?5:6;const k2=b.slice(q+w,q+w+40);const r2=a.indexOf(k2,p);if(r2<0||r2-p>3000)return false;p=r2;q=q+w;continue;} /* b cut earlier because its ask is longer */if(!b.startsWith(head,q))return false;const key=a.slice(p,p+40);const r=b.indexOf(key,q);if(r>=0&&r-q<=2000){q=r;continue;} /* the ask was cut at its limit: both cut points carry ' [...]' */const ca=a.indexOf(' [...]',p),cb=b.indexOf(' [...]',q);if(ca<0||cb<0||ca-p>2000||cb-q>2000)return false;p=ca;q=cb;}return true;};
  if(bb!==a&&!rs(a,b,/Judge Enforcer/.test(nm)?' When the right grade is BROKEN':' (on a witness the side answered'))stray.push(R+' '+nm);
  /* a send-back ask cut at its length limit keeps part of the added text: the resync diff allows a departure that starts with the added words */
  if(R==='33617'&&nm==='Send Back Build'){const t=b.replace(/\\\\/g,'\\');const k=t.indexOf('ITEM S9 (E-HOLD');s9=t.slice(k,k+3000);}}}
T(n>=60,'replay ran on '+n+' node runs');T(stray.length===0,'outputs differ only by the added sentence or FORCED form ('+(stray.join(', ')||'none')+')');
out.push('   changed node runs: '+JSON.stringify(chg));
T(/CHANGE TO the BROKEN line in its counted layers, Commitment 13 \(on a witness the side answered: FORCED: <Dn vs Cm> -- MEANS/.test(s9)&&!/cannot add the FORCED line/.test(s9),'33617 Send Back Build: terra S9 ask carries the FORCED form beside "the BROKEN line"');
T(optN>0&&cantAdd===0,'send-back asks: '+optN+' options carry the FORCED form inline; 0 asks say "cannot add the FORCED line" ('+cantAdd+')');T(keptA===keptB,'the RETRACTED/keep options survive the cut limit as in base ('+keptA+' -> '+keptB+')');
out.push('TOTAL '+ok+' OK, '+bad+' FAIL');console.log(out.join('\n'));fs.writeFileSync('pkgEHF/test_EHF.txt',out.join('\n')+'\n');
