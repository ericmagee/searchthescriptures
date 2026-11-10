// Runs W1's labeled VP3-listing cases (cases.cjs) through the whole Send Back Record node of a base and one or more candidates.
//   node pkgVPD/w1_testset/run_cases.cjs <base workflow json> <candidate json> [...]
// Listed = vp3_trial.would_remove.chatgpt holds the S1 item (Luke 1:34 [CR3]). cure_status must not change.
process.chdir(__dirname+'/../..');const fs=require('fs');const H=require('../../pkgVP3/harness.cjs');const C=require('./cases.cjs');const RUN='34108';
const g=f=>{let d=JSON.parse(fs.readFileSync(f,'utf8'));d=d.data||d;return d.workflow||d;};const code=W=>W.nodes.find(n=>n.name==='Send Back Record').parameters.jsCode;
const J=o=>JSON.parse(JSON.stringify(o));const NORM=['Panel Cure Normalize 1','Panel Cure Normalize 2','Panel Cure Normalize 3'];const R0=H.out(RUN,NORM[0]).flat()[0].json.cure.rounds;
const VERSE=/Luke 1:34(?![0-9])|How shall this be|know not a man|her question/i;const LH=/^\s*(?:#+\s*)?(?:\*\*)?\s*LINK\s+\d+\b/i;
function rounds(c){const R=J(R0);let L=R.CR3.split('\n');const s=L.findIndex(l=>/^\*\*LINK 4:/.test(l));let e=s+1;while(e<L.length&&!LH.test(L[e]))e++;
 for(let k=s;k<e;k++)L[k]=L[k].replace(/Luke 1:34(?![0-9])/g,'the verse').replace(/How shall this be/gi,'the how').replace(/know not a man/gi,'the state').replace(/her question/gi,'the press');
 let blk=L.slice(s,e);
 if(c.link4==='short-in-CR3'||c.link4==='short-in-CR4')blk=['**LINK 4: SUPPORTED.** As above.',''];
 if(c.link4==='long-plain')blk=['**LINK 4: SUPPORTED.** The angel spoke to a woman espoused and not yet taken home, and the account names the Holy Ghost as the means of the conception in plain words.',''];
 if(!c.link4)blk=['**LINK 4: SUPPORTED.** As above.',''];
 L.splice(s,e-s,...(c.link4==='short-in-CR4'?[]:blk));
 const a=L.findIndex(l=>/^- Luke 1:34, "How shall this be/.test(l));const ans=L[a].replace(/: I grant[\s\S]*$/,': '+require('./cases.cjs').GRANT+' '+c.defer);
 L=L.filter((l,k)=>k===a||!VERSE.test(l));L[L.findIndex(l=>/^- Luke 1:34, "How shall this be/.test(l))]=ans;R.CR3=L.join('\n');
 for(const k of ['CR1','CR2','CR4'])R[k]=R[k].split('\n').filter(l=>!VERSE.test(l)).join('\n');
 if(c.link4==='short-in-CR4')R.CR4=R.CR4+'\n\n'+blk.join('\n');
 for(const k in (c.add||{}))R[k]=R[k]+'\n'+c.add[k];return R;}
function over(R){const o={};for(const n of NORM){const v=J(H.out(RUN,n));v.flat()[0].json.cure.rounds=R;o[n]=v;}
 const Cc=J(H.out(RUN,'Send Back Call openrouter'));const B=H.out(RUN,'Send Back Build').flat();const i=B.findIndex(b=>b.json.seat==='chatgpt');const m=Cc.flat()[i].json.choices[0].message;const j=JSON.parse(m.content);
 j.reasoning=j.reasoning.split('\n').map(l=>l.startsWith('SENDBACK: S1 ||')?'SENDBACK: S1 || KEEP || The answer meets the press.':l).join('\n');m.content=JSON.stringify(j,null,2);o['Send Back Call openrouter']=Cc;return o;}
(async()=>{const W=process.argv.slice(2).map(f=>({f,c:code(g(f))}));const tot=W.map(()=>({m:0,miss:[]}));const rows=[];
 for(const c of C){const R=rounds(c);const o=over(R);const res=[];let cs=null;
  for(let w=0;w<W.length;w++){const out=await H.run(W[w].c,RUN,'Send Back Call openrouter',o);const v=out[0].json.sendback.vp3_trial||{would_remove:{}};const listed=!!((v.would_remove||{}).chatgpt||[]).find(x=>/^S1 /.test(x));
   const r=out[0].json.sb_rows.find(x=>x.seat==='chatgpt'&&/Luke 1:34 \[CR3\]/.test(x.item||''));if(w===0)cs=r&&r.cure_status;else if(r&&r.cure_status!==cs)res.push('CURE_STATUS CHANGED');
   const got=listed?'LISTED':'NOT';if(got===c.want)tot[w].m++;else tot[w].miss.push(c.id);res.push((got===c.want?'ok   ':'MISS ')+got.padEnd(6));if(w===W.length-1&&r){rows.push(r);if(process.env.WHY){const s=String(r.cure_reason);const q=s.indexOf('TRIAL pkgVP3');res.push(s.slice(q,q+260));}}}
  console.log(res.join(' | ')+' | want '+c.want.padEnd(6)+' '+c.id+' '+c.kind+': '+c.note);}
 W.forEach((w,i)=>console.log(w.f+': '+tot[i].m+' of '+C.length+' as labeled; misses: '+(tot[i].miss.join(', ')||'none')));fs.writeFileSync(__dirname+'/rows.json',JSON.stringify(rows.slice(0,2)));})().catch(e=>{console.error(e);process.exit(2);});
