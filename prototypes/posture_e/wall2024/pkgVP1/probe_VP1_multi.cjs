// pkgVP1 probe 3 (W3): several ANSWER OPEN items on one judge (run 34016, luna: 11 items). One change may answer every item of a link.
const H=require('./harness.cjs');const fs=require('fs'),path=require('path');const W=path.resolve(__dirname,'..');const RUN='34016';
const src=f=>fs.readFileSync(W+'/'+(process.argv[2]||'pkgLIB/strip_VP1_s84')+'/patched/'+f,'utf8');let ok=0,bad=0;const T=(c,m)=>{console.log((c?'OK   ':'FAIL ')+m);c?ok++:bad++;};
(async()=>{
 await H.run(src('Gate_Record.js'),RUN,'Send Back Record',{},ev=>{const g=n=>ev(n);const PASS=H.out(RUN,'Send Back Record')[0][0].json;const PB=H.out(RUN,'Panel Build')[0][0].json;
  const seat='luna';const p=JSON.parse((PASS.bodies).find(b=>JSON.parse(b).payload.judge_seat===seat)).payload;const its=PASS.sb_items.filter(x=>x.seat===seat);const j=PB.judges.find(q=>q.seat===seat);const PT=g('gatePromptText2024')(j.body);
  const ctx={R:g('ciRounds')(PT),DL:g('drvLinks')(PT),ask:PT.includes('CITATION CHECK')};const F={verdict_tag:p.verdict_tag,defense_standing:p.defense_standing,conceded_links:p.conceded_links,challenge_standing:p.challenge_standing,challenger_conceded_links:p.challenger_conceded_links};
  const G=g('gateItems2024')(seat,p.verdict_raw,F,its,ctx);const M=G.items.filter(x=>x.src==='E-GATE M');
  console.log('     items: '+G.items.map(x=>x.gid+' '+x.src+' '+x.key).join(' ; '));
  T(M.length===11&&G.items.length===11,'1a run 34016, luna: 11 ANSWER OPEN items (10 answer checks graded MISSES, every collision UNDERDETERMINED), no other gate item');
  const cure=reply=>g('gateCure2024')(seat,p.verdict_raw,F,its,G.items,reply,ctx);
  const st=C=>C.res.map((r,i)=>G.items[i].gid+(r.cured?' CURED':' UNCURED')).join(', ');
  let C=cure('');T(C.res.every(r=>!r.cured),'1b silence on all: all UNCURED');
  const x=M.find(z=>/NUMBERS 1:18/.test(z.key));const ac=x.lines[0];const col=x.lines.find(l=>/^D6 vs C1/.test(l));
  if(process.env.SHOW){console.log(ac);console.log(col);return [];}
  const q=(re,s)=>{const m=s.match(re);return m?m[1]:null;};const means=q(/MEANS: ["“]([^"”]+)["”]/,ac),ans=q(/ANSWER: ["“]([^"”]+)["”]/,ac);
  const brk=col.replace(/UNDERDETERMINED -- /,'DEFENDER LINK BROKEN (Commitment 3) -- the answer to Numbers 1:18 misses the meaning pressed; ');
  const FO='FORCED: D6 vs C1 -- MEANS [DR2]: "'+means+'" -- ANSWER [CR3]: "'+ans+'" -- FAILS: "'+ans+'"';
  if(process.env.DBG){console.log(ac);console.log(FO);console.log(JSON.stringify(g('kfLines')(FO,ctx.R).items.map(z=>[z.rule,String(z.why).slice(0,400)])));for(const z of M){console.log(z.gid,z.lines[0].slice(0,600));}return [];}
  C=cure('GATE: '+x.gid+' || CHANGE TO: '+brk+' || '+FO);console.log('     2 one change (D6 vs C1 to DEFENDER LINK BROKEN, true FORCED line) under '+x.gid+': '+st(C));
  console.log('     why '+x.gid+': '+String(C.res[G.items.indexOf(x)].why).slice(0,300));
  const d6=M.filter(z=>/\|D6$/.test(z.key)),c1=M.filter(z=>/\|C1$/.test(z.key)),rest=M.filter(z=>!/\|(D6|C1)$/.test(z.key));
  const cu=z=>C.res[G.items.indexOf(z)].cured;
  T(cu(x)&&C.add.some(z=>z.forced_add),'2a the answered item is CURED and its FORCED line is added');
  T(d6.every(cu),'2b every other ANSWER OPEN item of LINK 6 ('+d6.filter(z=>z!==x).map(z=>z.gid).join(', ')+') is CURED without a gate line of its own: '+String(C.res[G.items.indexOf(d6.find(z=>z!==x))].why).slice(0,160));
  T(c1.every(cu),'2c the challenger premise 1 item ('+c1.map(z=>z.gid).join(', ')+'), whose only collision line is no longer UNDERDETERMINED, is CURED the same way');
  T(rest.length>0&&rest.every(z=>!cu(z)),'2d the items of other links ('+rest.map(z=>z.gid).join(', ')+') stay UNCURED by silence');
  T(C.uncured===rest.length,'2e counted: '+C.uncured+' (the '+rest.length+' unanswered items of other links)');
  C=cure('GATE: '+x.gid+' || CHANGE TO: '+brk+' || "the answer misses"');T(d6.every(z=>!cu(z)),'3a the same change with no FORCED line: nothing of LINK 6 is CURED ('+st(C)+')');
  C=cure('GATE: '+x.gid+' || KEEP || "I keep it"');T(M.every(z=>!cu(z)),'3b KEEP on one item cures no silent item');
  const y=M.find(z=>z!==x&&/\|D6$/.test(z.key));C=cure('GATE: '+x.gid+' || CHANGE TO: '+ac.replace(/-- MISSES -- [\s\S]*$/,'-- MEETS -- “'+ans+'”')+' || "'+ans+'"');
  T(cu(x)&&!cu(y),'3c one answer check changed back to MEETS cures that item only; the other LINK 6 items stay UNCURED ('+st(C)+')');
  return [];});
 console.log('\nprobe_VP1_multi: '+ok+' OK, '+bad+' FAIL');})();
