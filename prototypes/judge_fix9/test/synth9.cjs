// judge_fix9 S5 fixture: the stored syntheses of runs 32302 and 32306 (debate_results.synthesis, read 2026-11-03 into
// data/synthesis_32302_32306.json) through Citation Scan, Quote Compare (live code) and Quote Report (new), with the KJV rows of every verse
// the syntheses cite (data/kjv_synth.json): the quotations that do not match, and the verdict scan.
const fs=require('fs');const RN=require('./runner.cjs');const R9=require('./replay9.cjs');const D=__dirname+'/../';
const SY=JSON.parse(fs.readFileSync(D+'data/synthesis_32302_32306.json'));const KJV=JSON.parse(fs.readFileSync(D+'data/kjv_synth.json')).concat(JSON.parse(fs.readFileSync(D+'data/kjv_32302.json')),JSON.parse(fs.readFileSync(D+'data/kjv_32293.json')));
for(const [n,tok] of [['32302','ODV1-32302-t4gyo690'],['32306','ODV1-32306-ccyhzcuy']]){const r=R9.run(n);const F=R9.F_(r);
 const CS=RN.runNode('new','Citation Scan',{'Final Output':{topic:'T',synthesis:SY[tok],...F},'Init Seats':{run_token:'T'}})[0].json;
 const QC=RN.runNode('data/live_code','Quote Compare',{'Citation Scan':CS,'Cited Verses':KJV})[0].json;
 const QR=RN.runNode('new','Quote Report',{'Quote Compare':QC,'Find Words':[],'Citation Scan':CS})[0].json;const Y=QR.synthesis;
 console.log(`RUN ${n}: synthesis quotations checked ${Y.checked}, match ${Y.matches}, not checked ${Y.not_checked}, do not match ${Y.bad.length}; verdict phrases ${Y.verdict_phrases.length}`);
 for(const b of Y.bad)console.log('   '+b.ref+': "'+b.quote.slice(0,120)+'" -- '+b.status);
 for(const v of Y.verdict_phrases)console.log('   verdict phrase: '+v);}
