// Run 33020 grok S11 (W2): why E-APPLY could not find the flagged FORCED line. Run from wall2024/: node pkgGD/probe_33020/probe_s11.cjs
const fs=require('fs');const rd=f=>fs.readFileSync(f,'utf8');const FX=JSON.parse(rd('pkgGD/probe_33020/fixture_33020.json'));
const AM=rd('pkgGDUP/patched/Alternate_Merge.js');const M=new Function('$','$input',AM.slice(0,AM.indexOf("const AM=$('Alternate Merge Seat')"))+'\nreturn {sbApply2024,cureJText,gateItems2024,gateCure2024,ciRounds,gatePromptText2024,drvLinks};')(()=>{throw new Error('offline');},null);
for(const seat of ['grok','chatgpt']){const b=FX.bodies.find(x=>x.seat===seat);const T=M.cureJText(b.verdict_raw,true);
 const x=FX.sb_items.find(z=>z.seat===seat&&z.sid===(seat==='grok'?'S11':'S14'));
 const L=T.split('\n').filter(l=>/FORCED/.test(l)&&/D1 vs C2/i.test(l));console.log('== '+seat+' '+x.sid+': judge-text lines with FORCED and D1 vs C2: '+L.length);L.forEach(l=>console.log('   TEXT: '+l));console.log('   FLAG: '+x.line);
 const one=s=>String(s).replace(/\\+/g,'').replace(/[*_`]+/g,'').replace(/\s+/g,' ').trim();
 if(L[0]){const a=one(L[0]),c=one(x.line);let i=0;while(i<a.length&&a[i]===c[i])i++;console.log('   first difference at char '+i+': text "'+a.slice(i-20,i+40)+'" | flag "'+c.slice(i-20,i+40)+'"');}}
// every E-COL send-back line of 33020: which seat's judge text holds it?
console.log('\n== E-COL send-back items of 33020: which seat\'s judge text holds the flagged line');
const one=s=>String(s).replace(/\\+/g,'').replace(/[*_`]+/g,'').replace(/\s+/g,' ').trim();
const TX=Object.fromEntries(FX.bodies.map(b=>[b.seat,M.cureJText(b.verdict_raw,true).split('\n').map(one)]));
for(const x of FX.sb_items.filter(z=>z.rule==='E-COL')){const n=one(x.line);const has=Object.keys(TX).filter(s=>TX[s].includes(n));console.log('   '+x.seat+' '+x.sid+' '+x.item+': held by '+(has.join(', ')||'no seat'));}
// the cause: Judge Enforcer Build groups E-COL lines across judges by the first 160 normalized characters (const CG ... key=N(l).slice(0,160))
{const n=s=>String(s).replace(/\s+/g,' ').trim();const a=TX.chatgpt.find(l=>/^FORCED: D1 vs C2/.test(l)),b=TX.grok.find(l=>/^FORCED: D1 vs C2/.test(l));
 let i=0;while(i<a.length&&a[i]===b[i])i++;console.log('\n== chatgpt and grok FORCED D1 vs C2: identical for the first '+i+' characters (the E-COL group key is 160), lengths '+a.length+' and '+b.length);}
