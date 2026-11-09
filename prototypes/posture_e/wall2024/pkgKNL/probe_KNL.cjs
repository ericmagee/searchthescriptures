// pkgKNL probe: kfLines (K-F) and kcmtLines2024 (K-CMT) on FORCED lines, base library vs pkgKNL. Run from wall2024/: node pkgKNL/probe_KNL.cjs [base strip] [new strip]
const fs=require('fs');const rd=f=>fs.readFileSync(f,'utf8');
const mk=p=>{const S=rd(p+'/patched/Alternate_Merge_Seat.js');return new Function('$','$input',S.slice(0,S.indexOf("let PP=$('Panel Cure Check')"))+'\nreturn {kfLines,kcmtLines2024};')(()=>{throw 0},null);};
const O=mk(process.argv[2]||'pkgLIB/strip_WLG'),N=mk(process.argv[3]||'pkgLIB/strip_KNL');
const R={DR1:'he took unto him his wife',CR1:'x',DR2:'x',CR2:'x',DR3:'x',CR3:'x',DR4:'x',CR4:'x'};
const T=[ // [line, expected K-F count after, expected K-CMT after]
 ['FORCED: none graded.',0,0],['FORCED: none.',0,0],['FORCED: none',0,0],['**FORCED:** none graded.',0,0],['- FORCED: none graded',0,0],['FORCED (Commitment 6): none',0,0],
 ['FORCED: no link is graded forced.',0,0],['FORCED: nothing forced.',0,0],['FORCED: N/A',0,0],['FORCED: 0',0,0],
 ['FORCED: none -- but D2 vs C3 is forced',1,1],['FORCED: none; "a quote" FORCED',1,1],
 ['FORCED: D2 vs C3 -- MEANS [DR1]: "took unto him" -- ANSWER [CR1]: "nothing here" -- FAILS: "nope"',1,1],
 ['FORCED: D2 vs C3 is forced because the reading cannot fit',1,1],['FORCED: the D1 link',1,1],
 // rev 2 (W1 3561): a none line that names a link or round, quotes, or says except/but is checked as before
 ['FORCED: none, except LINK 3, which the challenger forced',1,1],['FORCED: none except D3 (the challenger forced it at [CR2])',1,1],['FORCED: no; the D2 link is forced by [CR3] ‘took unto him’',1,1],
 ['FORCED: none of D1, D2 is forced',1,1],['FORCED: no forced link; D4 is CHALLENGER LINK BROKEN',1,1],['FORCED: none, but the challenger forced one link',1,1],
 ['FORCED: none graded; Joseph’s link is answered',0,0],["FORCED: none graded; Joseph's link is answered",0,0]];
let ok=0,bad=0;
for(const [l,ef,ec] of T){const a=O.kfLines(l,R).items.length,b=N.kfLines(l,R).items.length,c0=O.kcmtLines2024(l).items.filter(x=>x.rule==='K-CMT').length,c1=N.kcmtLines2024(l).items.filter(x=>x.rule==='K-CMT').length;
 const pass=b===ef&&c1===ec;pass?ok++:bad++;console.log((pass?'OK  ':'FAIL')+' K-F '+a+'->'+b+' K-CMT '+c0+'->'+c1+'  '+l);}
// Haiku 34016 reply lines (enforcer log row 27957), FORCED line in its context
const H=['KEYSTONE: D6 -- STANDS -- D6 is not graded BROKEN at any collision and is not withdrawn.','D1: STANDS -- GROUND: the knowing-within-espousal inference is answered in CR4.','FORCED: none graded.','REFERENCE: none required.','CONTRADICTIONS: NONE FOUND.'].join('\n');
const hf=[O.kfLines(H,R).items.length,N.kfLines(H,R).items.length],hc=[O.kcmtLines2024(H).items.length,N.kcmtLines2024(H).items.length];
const hp=hf[1]===0&&hc[1]===0;hp?ok++:bad++;console.log((hp?'OK  ':'FAIL')+' Haiku 34016 block: K-F '+hf.join('->')+', K-CMT/K-CMTL '+hc.join('->'));
console.log('TOTAL '+ok+' OK, '+bad+' FAIL');
