// pkgUOW replay: old vs new OPEN over stored send-back rows whose CHANGE TO is UNDERDETERMINED. usage: node replay.cjs <rows json> <live json>
const fs=require('fs');
const w=JSON.parse(fs.readFileSync(process.argv[3]));const s=w.nodes.find(n=>n.name==='Shared Library').parameters.jsCode;
const LIB=JSON.parse(s.slice(s.indexOf('\n/*LIB*/')+8,s.lastIndexOf('\n/*MAP*/')));
const oldLine=LIB[1896];
const ANCH='|both\\s+readings|';
const ADD='|both\\s+readings|both\\s+(?:(?!--)[^\\s.;:,!?()—–]+\\s+){1,6}and\\s+(?:(?!--)[^\\s.;:,!?()—–]+\\s+){0,6}(?:readings?|senses?|meanings?|uses?)\\b|(?:two|rival|competing)\\s+(?:(?!--)[^\\s.;:,!?()—–]+\\s+){0,2}(?:readings|senses|meanings)|';
if(oldLine.split(ANCH).length!==2)throw 'anchor';
const newLine=oldLine.replace(ANCH,ADD);
const mk=l=>eval(l.trim().replace(/^const OPEN=/,'(').replace(/;$/,')'));
const O=mk(oldLine),N=mk(newLine);
const rows=JSON.parse(fs.readFileSync(process.argv[2]||'all.json'));
let flips=[],tot=0,oldOk=0,newOk=0,lost=0;
for(const r of rows){const p=String(r.rl||'').split('||').map(x=>x.trim());const ci=p.findIndex(x=>/^CHANGE TO:/.test(x));if(ci<0)continue;
 const L=p[ci].replace(/^CHANGE TO:\s*/,'').replace(/\\+"/g,'"'),W=p.slice(ci+1).join(' || ').replace(/\\+"/g,'"');
 if(!/UNDERDETERMINED/.test(L))continue;tot++;
 const o=O.test(L)||O.test(W),n=N.test(L)||N.test(W);oldOk+=o;newOk+=n;if(o&&!n)lost++;
 if(!o&&n)flips.push({id:r.id,run:r.run,seat:r.seat,rule:r.rule,st:r.st,L:L.slice(0,420),W:W.slice(0,200),ct:r.ct.slice(-200)});}
console.log(JSON.stringify({tot,oldOk,newOk,lost,flips:flips.length,lineOld:oldLine.length,lineNew:newLine.length,delta:newLine.length-oldLine.length}));
fs.writeFileSync('replay_flips.json',JSON.stringify(flips,null,1));
