// ASK 399 item 4b (W1 8491): stored judgments with a retracted link whose collision line col still reads LINK BROKEN; and whether leaving it out of brk would change the standing (by the stand rule at 1345 to 1346 and 1488) or the rd386 word.
const J=require('../a384/judgments_all.json');const D=require('./dbcols.json');const E=require('./ert_eval.cjs')(__dirname+'/t386.json');
const K=x=>String(x||'').toUpperCase().replace(/\s+VS\.?\s+/,' VS ').trim();let withRet=0;const hit=[];
for(const j of J){const c=D.find(x=>x[0]===j.id);const F={v:c[1],dst:c[2],cst:c[3],cd:c[4],cc:c[5]};const ret=E.ret386?null:null;
 const R=[];for(const m of String(j.v).matchAll(/\[AUDIT v21: CORRECTED RESULT -- SEAT: ([^;\]]*); ORIGINAL: \w+; COUNTED: \w+ \([A-Z]+-\d\)(?:; RETRACTED: ([^\]]*))?\]/g)){if(m[1]!==j.seat||!m[2])continue;for(const x of m[2].split(/\s*,\s*/))if(/^D\d+\s+vs\.?\s+C\d+$/i.test(x.trim()))R.push(K(x));}
 if(!R.length)continue;withRet++;const col=E.rcLines(E.cureJText(j.v,true)).col;const still=col.filter(z=>R.includes(K(z.link))&&/LINK BROKEN$/.test(String(z.grade||'')));if(!still.length)continue;
 const unk=col.filter(z=>!z.grade).length;const brk=s=>col.filter(z=>z.grade===s+' LINK BROKEN').length,brkX=s=>col.filter(z=>z.grade===s+' LINK BROKEN'&&!R.includes(K(z.link))).length;
 const stand=(n,b,orig)=>{if(typeof n!=='number')return orig;if(n>=1||b>0)return (orig==='COLLAPSED'||orig==='PROP-DEPENDENT')?orig:'PROP-DEPENDENT';return unk?orig:'SELF-SUPPORTED';};
 const d0=stand(F.cd,brk('DEFENDER'),F.dst),c0=stand(F.cc,brk('CHALLENGER'),F.cst),d1=stand(F.cd,brkX('DEFENDER'),F.dst),c1=stand(F.cc,brkX('CHALLENGER'),F.cst);
 const w0=E.rd386({verdict:F.v,dst:d0,cst:c0,cd:F.cd,cc:F.cc,col,retracted:R}).word,w1=E.rd386({verdict:F.v,dst:d1,cst:c1,cd:F.cd,cc:F.cc,col,retracted:R}).word;
 hit.push({id:j.id,seat:j.seat,verdict:F.v,stored:[F.dst,F.cst,F.cd,F.cc],still:still.map(z=>z.link+' '+z.grade),stand_today:[d0,c0],stand_399:[d1,c1],word_today:w0,word_399:w1});}
console.log('judgments with a retract list naming a pair',withRet,'| with a retracted link col still reads LINK BROKEN',hit.length,'| standing changes',hit.filter(h=>h.stand_today.join()!==h.stand_399.join()).length,'| word changes',hit.filter(h=>h.word_today!==h.word_399).length);
for(const h of hit)console.log(' ',JSON.stringify(h));require('fs').writeFileSync(__dirname+'/count399_out.json',JSON.stringify(hit,null,1));
