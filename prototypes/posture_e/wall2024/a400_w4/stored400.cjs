// ASK 400 stored effect on the 624 stored judgments: live ASK 386 (rdf/fetchback_w386.json) against t400, row by row.
// Fields: v61 WORD, TIE, BROKEN LINES, the short-form note, and rcLines break counts (brk) and unread counts as v25 and v37 read them.
const J=require('../a384/judgments_all.json');const D=require('../a386/dbcols.json');
const E0=require('./ev.cjs')(__dirname+'/../rdf/fetchback_w386.json'),E1=require('./ev.cjs')(__dirname+'/t400.json');
const byId=new Map(D.map(x=>[x[0],{verdict_tag:x[1],defense_standing:x[2],challenge_standing:x[3],conceded_links:x[4],challenger_conceded_links:x[5]}]));
const last=t=>String(t).split('\n').pop();const W=t=>(last(t).match(/WORD: ([A-Z ]+|none);/)||[])[1];const TIE=t=>/TIE yes/.test(last(t));
const BL=t=>(last(t).match(/BROKEN LINES ([^;]*?)(?:, LINK STATE|, TIE|; END)/)||[])[1];const NOTE=t=>/LINK STATE LINES NOT READ \(short form\)/.test(last(t));
const cnt=(E,v,withLs)=>{const r=E.rcLines(E.cureJText(v,true));const c=withLs?r.col.concat(r.ls||[]):r.col;
 return {brkD:c.filter(z=>z.grade==='DEFENDER LINK BROKEN').length,brkC:c.filter(z=>z.grade==='CHALLENGER LINK BROKEN').length,unread:c.filter(z=>!z.grade).length,ls:(r.ls||[]).length,grade_first:r.col.filter(z=>/^D\d+:\s*(DEFENDER LINK BROKEN|CHALLENGER LINK BROKEN|UNDERDETERMINED|STANDS)\s+VS/i.test(String(z.raw||'').replace(/^[\s*\-•>#]+/,'').replace(/[*_]+/g,''))).length};};
const rows=[];const S={judgments:J.length,word:0,tie:0,broken:0,note:0,brk:0,unread:0,errors:0};
for(const j of J){const F=byId.get(j.id)||{};let a,b,ca,cb;
 try{a=E0.ert386(j.v||'',j.seat,F);b=E1.ert386(j.v||'',j.seat,F);ca=cnt(E0,j.v||'',false);cb=cnt(E1,j.v||'',true);}catch(e){S.errors++;rows.push({id:j.id,error:String(e)});continue;}
 const d={id:j.id,seat:j.seat,verdict:F.verdict_tag};let ch=false;
 if(W(a)!==W(b)){d.word=[W(a),W(b)];S.word++;ch=true;}
 if(TIE(a)!==TIE(b)){d.tie=[TIE(a),TIE(b)];S.tie++;ch=true;}
 if(BL(a)!==BL(b)){d.broken=[BL(a),BL(b)];S.broken++;ch=true;}
 if(NOTE(a)!==NOTE(b)){d.note=[NOTE(a),NOTE(b)];S.note++;ch=true;}
 if(ca.brkD!==cb.brkD||ca.brkC!==cb.brkC){d.brk=[ca.brkD+'/'+ca.brkC,cb.brkD+'/'+cb.brkC];S.brk++;ch=true;}
 if(ca.unread!==cb.unread){d.unread=[ca.unread,cb.unread];S.unread++;ch=true;}
 if(cb.grade_first)d.grade_first=cb.grade_first;
 if(ch||cb.grade_first)rows.push(d);}
S.grade_first_rows=rows.filter(r=>r.grade_first).length;
S.note_rows_live=J.filter(j=>{try{return NOTE(E0.ert386(j.v||'',j.seat,byId.get(j.id)||{}))}catch(e){return false}}).length;
S.note_rows_400=J.filter(j=>{try{return NOTE(E1.ert386(j.v||'',j.seat,byId.get(j.id)||{}))}catch(e){return false}}).length;
console.log(JSON.stringify(S));for(const r of rows)console.log(JSON.stringify(r));
require('fs').writeFileSync(__dirname+'/stored400_out.json',JSON.stringify({summary:S,rows},null,1));
