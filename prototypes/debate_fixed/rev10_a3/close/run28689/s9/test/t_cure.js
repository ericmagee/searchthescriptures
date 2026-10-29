const fs=require('fs');const src=fs.readFileSync(process.argv[2],'utf8');const cut=src.indexOf("\nconst PP=$('Panel Payloads')");
const lib=src.slice(0,cut);const api=new Function(lib+';return {drvCheck,cureAsk,cureVerdicts,cureCorrected,cureLines};')();
const it={rule:'K-S',side:null,link:'D6',line:'D6: STANDS -- the conclusion\'s own conception verses were not met by any quotation that names a human begetter.'};
const it2={rule:'K-S',side:null,link:'D4 vs C2',line:'D4 vs C2 (Matthew 1:16): UNDERDETERMINED -- no [L1]/[L2] states that Joseph begat Jesus there.'};
const ask=api.cureAsk([it,it2],{DEFENDER:[],CHALLENGER:[]});console.log('ASK has K-S rule:',/K-S \(a link marked STANDS/.test(ask),'| lists D6:',/K-S D6: D6: STANDS/.test(ask),'| has 1a words:',ask.includes('for either side.'));
const T=(name,reply)=>{const v=api.cureVerdicts([it,it2],{ok:true,text:reply},{DEFENDER:[],CHALLENGER:[]},{});const cc=api.cureCorrected({ok:true,text:reply},v);console.log(name.padEnd(28),v.map(x=>x.link+'='+x.status+'('+x.why+')').join(' ; '),'| corrected:',cc?cc.tag:'none');};
T('answering round named','RESTATED: D6: STANDS -- answered in [CR3] LINK 6 with Matthew 1:20.\nRESTATED: D4 vs C2 (Matthew 1:16): UNDERDETERMINED -- answered in [CR2] from the genealogy pattern.');
T('regraded BROKEN + result','RESTATED: D6 vs C2: DEFENDER LINK BROKEN -- x\nRESTATED: D6: DEFENDER LINK BROKEN -- Hebrews 7:14 left unanswered.\nRESTATED: D4 vs C2 (Matthew 1:16): CHALLENGER LINK BROKEN -- y\nCORRECTED RESULT: BROKEN-1');
T('regraded BROKEN, no result','RESTATED: D6: DEFENDER LINK BROKEN -- Hebrews 7:14 left unanswered.\nRESTATED: D4 vs C2: UNDERDETERMINED -- [DR2] answered.');
T('no round, stating kept','RESTATED: D6: STANDS -- no verse states a begetter.\nRESTATED: D4 vs C2: UNDERDETERMINED -- no row states it.');
T('no reply lines','prose only');
// K-B regression: a RESTATED with D<n> vs C<m> still read as before
const kb={rule:'K-B',side:'DEFENDER',link:'D6 vs C2',line:'D6 vs C2 (Romans 1:3): DEFENDER LINK BROKEN -- x'};
const v=api.cureVerdicts([kb],{ok:true,text:'RESTATED: D6 vs C2 (Romans 1:3): DEFENDER LINK BROKEN -- [L1] Romans 1:3 "made of the seed of David" and [L3] Hebrews 7:14 named.'},{DEFENDER:['D6 vs C2'],CHALLENGER:[]},{});console.log('K-B regression'.padEnd(28),v.map(x=>x.status+'('+x.why+')').join());
