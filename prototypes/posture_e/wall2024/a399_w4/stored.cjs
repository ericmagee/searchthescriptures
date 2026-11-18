// ASK 399 stored check (8543 DoD b): every stored judgment, live 360d569d against t399. Standing by the stand rule (1345-1346, 1488) on brk from col+ls with and without ap399; words by each version's own rd386 and ret386; v61 tag WORD by each version's ert386.
const J=require('../a384/judgments_all.json');const D=require('../a386/dbcols.json');
const E0=require('./ev.cjs')(__dirname+'/../rdf/fetchback_w394s11.json'),E1=require('./ev.cjs')(__dirname+'/t399.json');
const W=t=>(String(t).split('\n').pop().match(/WORD: ([A-Z ]+|none);/)||[])[1];
const out=[];let n=0,tagDiff=[];
for(const j of J){const c=D.find(x=>x[0]===j.id);if(!c)continue;n++;const F={v:c[1],dst:c[2],cst:c[3],cd:c[4],cc:c[5]};
 const P=E0.rcLines(E0.cureJText(j.v,true));const cl=P.col.concat(P.ls||[]);
 const R0=E0.ret386(j.v,j.seat),R1=E1.ret386(j.v,j.seat);const c1=E1.ap399(cl,R1);
 const unk=cl.filter(z=>!z.grade).length,unk1=c1.filter(z=>!z.grade).length;
 const stand=(n,b,orig,u)=>{if(typeof n!=='number')return orig;if(n>=1||b>0)return (orig==='COLLAPSED'||orig==='PROP-DEPENDENT')?orig:'PROP-DEPENDENT';return u?orig:'SELF-SUPPORTED';};
 const b=(L,s)=>L.filter(z=>z.grade===s+' LINK BROKEN').length;
 const d0=stand(F.cd,b(cl,'DEFENDER'),F.dst,unk),k0=stand(F.cc,b(cl,'CHALLENGER'),F.cst,unk),d1=stand(F.cd,b(c1,'DEFENDER'),F.dst,unk1),k1=stand(F.cc,b(c1,'CHALLENGER'),F.cst,unk1);
 const w0=E0.rd386({verdict:F.v,dst:d0,cst:k0,cd:F.cd,cc:F.cc,col:cl,retracted:R0}).word,w1=E1.rd386({verdict:F.v,dst:d1,cst:k1,cd:F.cd,cc:F.cc,col:cl,retracted:R1}).word;
 // the same stored standings, words only (what ert386 does)
 const ws0=E0.rd386({verdict:F.v,dst:F.dst,cst:F.cst,cd:F.cd,cc:F.cc,col:cl,retracted:R0}).word,ws1=E1.rd386({verdict:F.v,dst:F.dst,cst:F.cst,cd:F.cd,cc:F.cc,col:cl,retracted:R1}).word;
 const Fo={verdict_tag:F.v,defense_standing:F.dst,challenge_standing:F.cst,conceded_links:F.cd,challenger_conceded_links:F.cc};let t0,t1;try{t0=E0.ert386(j.v,j.seat,Fo);t1=E1.ert386(j.v,j.seat,Fo);}catch(e){t0=t1='ERR '+e.message;}
 if(t0!==t1)tagDiff.push({id:j.id,seat:j.seat,w0:W(t0),w1:W(t1)});
 if(d0!==d1||k0!==k1||w0!==w1||ws0!==ws1)out.push({id:j.id,seat:j.seat,v:F.v,defense:d0===d1?d0:d0+' > '+d1,challenge:k0===k1?k0:k0+' > '+k1,word:w0===w1?w0:w0+' > '+w1,word_on_stored_standings:ws0===ws1?ws0:ws0+' > '+ws1});}
console.log('judgments',n,'| changes',out.length,'| standing changes',out.filter(o=>/>/.test(o.defense+o.challenge)).length,'| word changes',out.filter(o=>/>/.test(o.word)).length,'| word changes on stored standings',out.filter(o=>/>/.test(o.word_on_stored_standings)).length,'| v61 tag text changes',tagDiff.length);
for(const o of out)console.log(JSON.stringify(o));for(const t of tagDiff)console.log('TAG',JSON.stringify(t));
require('fs').writeFileSync(__dirname+'/stored_out.json',JSON.stringify({out,tagDiff},null,1));
