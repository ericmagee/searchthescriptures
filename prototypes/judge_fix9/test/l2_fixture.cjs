// judge_fix9 S4 fixture: every [L2] tag of stored runs (default 32302 and 32306) matched against original_words and lexicon_words as read on
// 2026-11-03 (data/ow_l2.json: every original_words row of the 134 verses the [L2] blocks of runs 32284-32306 cite; data/lex_l2.json: the
// lexicon rows of their Strong's numbers; data/counts_l2.json: verse and token counts of the numbers claimed). Reports counted, not in the
// cited verse, ignored (a tag naming no Hebrew or Greek word: no [L2] claim), no verse cited, Apocrypha, not read, and counts that differ. Nothing goes NOT COUNTED live until this is read.
const fs=require('fs');const {loadLib,run,rounds,roundsArr,D}=require('./lib9.cjs');
const {L2C}=loadLib(['l2.js'],['L2C']);
const OW=JSON.parse(fs.readFileSync(D+'data/ow_l2.json'));const LEX=JSON.parse(fs.readFileSync(D+'data/lex_l2.json'));const CNT=JSON.parse(fs.readFileSync(D+'data/counts_l2.json'));
const runs=process.argv.slice(2).length?process.argv.slice(2):['32302','32306'];const verbose=process.env.V==='1';
const tot={};for(const n of runs){const RA=roundsArr(rounds(run(n)));const R=L2C.check(L2C.tags(RA),OW,LEX);const c={};
 for(const t of R){const k=t.status==='COUNTED'?'counted':t.status==='UNVERIFIABLE'?(/Apocrypha/.test(t.why)?'Apocrypha':'not read'):t.status==='IGNORED'?'ignored (names no word)':/cites no verse/.test(t.why)?'no verse cited':'not in the cited verse';c[k]=(c[k]||0)+1;tot[k]=(tot[k]||0)+1;
  if(verbose||k!=='counted')console.log(n,t.round,t.side.slice(0,4),'|',t.status,'|',t.why,'|',t.seg.slice(0,170));}
 const CL=L2C.countClaims(RA);const CC=L2C.countCheck(CL,CNT,false,R);
 console.log('RUN',n,'tags',R.length,JSON.stringify(c),'| count claims',CC.length,CC.map(x=>x.round+' '+x.said+' ('+(x.num||'?')+'): '+x.status).join('; ')||'none');}
console.log('TOTAL',JSON.stringify(tot));
