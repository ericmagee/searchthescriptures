// F10c harness (Worker_E): the shared library's cureSet, cureSetApply and cureCountHeld on 27795's single judge item statuses (report lines 108-112).
const fs=require('fs');const dir=process.argv[2];const s0=fs.readFileSync(dir+'/Cure_Check.js','utf8').split('\n');const e=s0.findIndex(l=>l.startsWith('function cureProse'));
const L=new Function(s0.slice(0,e+2).join('\n')+'\nreturn {cureSet,cureSetApply,cureCountHeld:typeof cureCountHeld==="function"?cureCountHeld:null};')();
const V=(d4)=>[{rule:'K-G4',side:'DEFENDER',link:'D3 vs C3',status:'CURED'},{rule:'K-G1',side:'DEFENDER',link:'D4 vs C3',status:d4},{rule:'K-G4',side:'DEFENDER',link:'D6 vs C3',status:'CURED'},{rule:'K-G7',side:'DEFENDER',link:'D3 vs C3',status:'CURED'},{rule:'K-G7',side:'DEFENDER',link:'D6 vs C3',status:'CURED'}];
const cases=[['F10c.1 stored (K-G1 UNCURED), COUNT 2',V('UNCURED'),'CORRECTED COUNT: DEFENDER 2\nCORRECTED STANDING: DEFENDER PROP-DEPENDENT'],
 ['F10c.2 no CORRECTED COUNT line',V('UNCURED'),'RETRACTED: D4 vs C3'],
 ['F10c.3 every count item CURED',V('CURED'),'CORRECTED COUNT: DEFENDER 2\nCORRECTED STANDING: DEFENDER PROP-DEPENDENT']];
for(const [n,v,t] of cases){const rep={ok:true,text:t};const p={defense_standing:'PROP-DEPENDENT',conceded_links:0,challenge_standing:'SELF-SUPPORTED',challenger_conceded_links:0};
 const cs=L.cureSet(rep,v);const al=cs?L.cureSetApply(p,cs,null):[];const ch=L.cureCountHeld?L.cureCountHeld(rep,v,cs,null):[];
 console.log(n,'| conceded_links',p.conceded_links,'| applied',al.length,'| held:',ch.join(' ')||'none','| brackets inside:',ch.some(x=>/\[.*\[|\].*\]/.test(x.slice(1,-1))));}
