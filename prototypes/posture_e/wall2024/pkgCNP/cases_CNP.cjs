// W1's cases.json (A1-A7 expect a pair, N1-N7 expect none) and plants P1-P6, replayed on Close Enforcer Build of parent_s151_CNP.
const fs=require('fs');const R=require('./rounds.cjs')(process.argv[2]);const C=JSON.parse(fs.readFileSync('/mnt/project-files/w1/cfp_cases/cases.json','utf8'));
const code=f=>JSON.parse(fs.readFileSync('/mnt/project-files/wall2024/'+f,'utf8')).nodes.find(n=>n.name==='Close Enforcer Build').parameters.jsCode;
const LIVE=code('fetchback_live_s151.json'),PAR=code((process.env.PKG||'parent_s151_CNP.json'));
const run=(js,F)=>{const $=n=>({'Init Seats':{isExecuted:true,first:()=>({json:{run_token:'T'}})},'Resolve Seats':{isExecuted:true,first:()=>({json:{deepseek:{api_model:'deepseek-flash',max_tokens:16000}}})},'Final Output':{isExecuted:true,first:()=>({json:F})},'Regrade Load':{isExecuted:false,first:()=>{throw new Error('no')}}})[n]||{isExecuted:false,first:()=>{throw new Error('no node '+n)},all:()=>[]};
 return new Function('$',js)($).flatMap(x=>x.json.cands||[]);};
const tok=r=>Object.keys(R).find(k=>k.includes('-'+r+'-'));const st=x=>String(x).replace(/[*_]+/g,'').trim();
const noOracle=F=>({...F,dr4:String(F.dr4).replace(/OPPONENT['’]S CONTRADICTIONS/i,'OPPONENT-CONTRADICTIONS-REMOVED')});
let pass=0,fail=0;const ok=(id,b,msg)=>{console.log((b?'PASS ':'FAIL ')+id+'  '+msg);b?pass++:fail++;};
const lk=c=>String(c.link).match(/^\d+$/)?+c.link:null;
for(const c of C.expect_pair){const F=R[tok(c.run)];const ear=st(c.earlier).replace(/^\(.*\)$/,'');
 for(const [tag,G] of [['with Oracle',F],['Oracle removed',noOracle(F)]]){const cs=run(PAR,G);
  const hit=cs.filter(x=>x.side===c.side&&st(x.closing_q).includes(st(c.closing))&&(lk(c)==null||x.n===lk(c)||x.n==='?')&&(!ear||st(ear).includes(st(x.earlier_q).slice(0,40))||st(x.earlier_q).includes(st(ear).slice(0,40))||x.n===lk(c)));
  ok(c.id+' ('+tag+')',hit.length>0,hit.map(x=>x.id+' by '+x.by.replace(/ \(.*/,'')+' LINK '+x.n+' E['+x.earlier_round+'] '+st(x.earlier_q).slice(0,50)).join(' ; ')||'none');}}
for(const c of C.expect_no_pair){const F=R[tok(c.run)];const a=run(LIVE,F).map(x=>x.id),cs=run(PAR,F).filter(x=>!a.includes(x.id)||x.by.includes('pkgCNP'));
 const hit=cs.filter(x=>x.by.includes('pkgCNP')&&x.side===c.side&&(st(c.closing).includes(st(x.closing_q))||st(x.closing_q).includes(st(c.closing).slice(0,40))));ok(c.id,hit.length===0,hit.length?hit.map(x=>x.id+' '+x.closing_q).join(' ; '):'no pkgCNP pair on this sentence');}
// plants on 35379 with every keep-all and denial close sentence removed first, so each plant is tested alone
const base=R[tok(35379)];const strip=s=>s.replace('I narrow nothing and concede nothing.','').replace('I keep D1 to D6 as numbered.','');
const clean={...base,cr4:strip(base.cr4)};const cnp=F=>run(PAR,F).filter(x=>x.by.includes('pkgCNP'));
ok('P0 clean base (both closes removed)',cnp(clean).length===0,cnp(clean).map(x=>x.closing_q).join(' ; ')||'no pkgCNP pair');
const add=(F,s)=>({...F,cr4:F.cr4+'\n\n'+s});
for(const [id,s] of [['P1 negated','I do not say that nothing is conceded.'],['P2 question','Is nothing narrowed?'],['P3 conditional','If nothing were conceded, D2 would stand.']]){const h=cnp(add(clean,s));ok(id+': '+s,h.length===0,h.map(x=>x.id+' LINK '+x.n).join(' ; ')||'no pair');}
const P4=['I concede nothing.','Nothing has been narrowed.','I withdraw nothing.','No link is narrowed.','All six links stand as first stated.','I keep every link whole.'];
for(const s of P4){const h=cnp(add(clean,s));ok('P4 '+s,h.some(x=>x.n===5),h.map(x=>'LINK '+x.n).join(', ')||'none');}
// P5: same sentences on a side with no earlier narrowing: remove the defender's LINK 5 label and the free withdrawals/drops in CR2-CR3
const bare={...clean,cr2:clean.cr2.replace(/I withdraw Galatians 4:4 as an exclusion witness\./,'Galatians 4:4 stays.'),cr3:clean.cr3.replace(/LINK 5: NARROWED TO:/,'LINK 5:').replace(/I drop any rest on[^.]*\./,'')};
ok('P5 base has no earlier narrowing',cnp(add(bare,'I concede nothing.')).length===0,'');
for(const s of P4){const h=cnp(add(bare,s));ok('P5 '+s,h.length===0,h.map(x=>x.id+' LINK '+x.n+' E '+x.earlier_q.slice(0,40)).join(' ; ')||'no pair');}
for(const s of ['**I concede nothing.**','“I narrow nothing and concede nothing.”','**“Nothing has been narrowed.”**']){const h=cnp(add(clean,s));ok('P6 '+s,h.some(x=>x.n===5)===!/[“"]/.test(s),h.map(x=>'LINK '+x.n).join(', ')||'none (quoted)');}
// W3 Wall 5179 F1 (false pair) and the wording limits named by W3 (5179) and W1 (5181a)
for(const s of ['I keep D1 to D4 as numbered.','I keep D1 to D4 and D6 as numbered; D5 stands as narrowed.','Apart from LINK 5, I keep D1 to D6 as numbered.','I keep D1 to D6 as numbered, D5 as narrowed.','Except for D5, nothing is conceded.']){const h=cnp(add(clean,s)).filter(x=>x.n===5);ok('F1 '+s,h.length===0,h.map(x=>x.id+' LINK '+x.n).join(' ; ')||'no LINK 5 pair');}
for(const s of ['My chain stands entire.','Every link stands as I first gave it.','Not one link has been narrowed.','None of my links is narrowed or withdrawn.','D1 through D6 remain exactly as stated.','No concession has been made.','Nothing I said has been withdrawn.','My chain stands unchanged.','D1 to D6 stand as first stated.','I keep every link as I declared it.']){const h=cnp(add(clean,s));ok('W '+s,h.some(x=>x.n===5),h.map(x=>'LINK '+x.n).join(', ')||'none');const h2=cnp(add(bare,s));ok('W/bare '+s,h2.length===0,h2.map(x=>'LINK '+x.n).join(', ')||'no pair');}
for(const s of ['Save D5, every link stands as I first gave it.','D5 aside, my chain stands unchanged.','I keep D1 to D6 as numbered, D5 in its narrowed form.','I keep D1 to D6 as numbered, as narrowed above.','I keep D1 to D6 as amended.','My chain stands unchanged except as restated in CR3.']){const h=cnp(add(clean,s)).filter(x=>x.n===5);ok('F2 '+s,h.length===0,h.map(x=>x.id+' LINK '+x.n).join(' ; ')||'no LINK 5 pair');}
for(const s of ['D5 aside, my chain stands unchanged.','Save D5, every link stands as I first gave it.','I keep D1 to D4 and D6 as numbered; D5 stands as narrowed.']){const h=cnp(add(clean,s));ok('F3 no pair at all (W1 Wall: the LINK ? withdrawal too) '+s,h.length===0,h.map(x=>x.id+' LINK '+x.n).join(' ; ')||'no pair');}
{const h=cnp(add(clean,'I keep D5 to D6 as numbered.'));ok('F2c range D5 to D6 still pairs LINK 5',h.some(x=>x.n===5),h.map(x=>'LINK '+x.n).join(', ')||'none');}
{const h=cnp(add(clean,'I concede nothing on D5.'));ok('F2d a denial naming D5 alone still pairs LINK 5 (rule 1 is for keep-alls)',h.some(x=>x.n===5),h.map(x=>'LINK '+x.n).join(', ')||'none');}
{const h=cnp(add(clean,'I keep D1 to D6 as numbered.'));ok('R full range keeps the LINK ? withdrawal pair',h.some(x=>x.n==='?')&&h.some(x=>x.n===5),h.map(x=>'LINK '+x.n).join(', '));}
console.log('\n'+pass+' pass, '+fail+' fail');
