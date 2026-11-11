// W2 grade of pkgRVF: (A) Format Markdown live s132 vs RVF on every stored export; (B) plants on 35067's judgments.
const fs=require('fs');const W='/mnt/project-files/wall2024/';
const L=f=>{let d=JSON.parse(fs.readFileSync(W+f,'utf8'));d=d.data||d;d=d.workflow||d;return d;};
const A=L('fetchback_live_s132.json'),B=L('parent_s132_RVF.json');
const FM0=A.nodes.find(n=>n.name==='Format Markdown').parameters.jsCode,FM1=B.nodes.find(n=>n.name==='Format Markdown').parameters.jsCode;
let pred=null;for(const [s,o] of Object.entries(A.connections))for(const br of o.main||[])for(const t of br||[])if(t.node==='Format Markdown')pred=s;
const runSrc=(src,$,inp)=>{const $input={first:()=>inp[0],all:()=>inp,item:inp[0]};return new Function('$','$input','return (async()=>{\n'+src+'\n})();')($,$input);};
const mk=(rd,over)=>{const lo=n=>{if(over&&n in over)return over[n];const r=rd[n];return r?(r[r.length-1].data.main[0]||[]):null;};return [n=>{const o=lo(n)||[];return {isExecuted:!!(rd[n]||(over&&n in over)),first:()=>o[0],all:()=>o,last:()=>o[o.length-1],item:o[0]};},lo];};
const md=async(src,rd,over)=>{const [$,lo]=mk(rd,over);const out=(await runSrc(src,$,lo(pred)||[]))[0].json;return String(out.md||'');};
const rowsOf=m=>m.split('\n').filter(l=>/^\| (Review|Cured) flag/.test(l));
(async()=>{
console.log('== (A) replay, live s132 vs pkgRVF');
let T={rc:0,other:0};
for(const e of fs.readdirSync(W).filter(f=>/^ex\d+_full\.json$/.test(f)).map(f=>f.match(/\d+/)[0]).sort()){
 const X=JSON.parse(fs.readFileSync(W+'ex'+e+'_full.json','utf8'));const rd=(X.data||X).resultData.runData;
 if(!rd['Format Markdown']){console.log(e,'no Format Markdown run');continue;}
 let a,b;try{a=await md(FM0,rd);b=await md(FM1,rd);}catch(x){console.log(e,'replay error:',x.message);continue;}
 const la=a.split('\n'),lb=b.split('\n');let rc=0,oth=0,byk={};
 if(la.length!==lb.length){console.log(e,'LINE COUNT DIFFERS',la.length,lb.length);}
 for(let i=0;i<Math.max(la.length,lb.length);i++)if(la[i]!==lb[i]){if(/^\| Review flag/.test(la[i])&&/^\| Cured flag/.test(lb[i]||'')&&la[i].replace(/^\| Review flag/,'').split(' | ')[0]===lb[i].replace(/^\| Cured flag/,'').split(' | ')[0]){rc++;const k=(la[i].match(/\((K-W|S3);/)||[,'other'])[1];byk[k]=(byk[k]||0)+1;}else{oth++;if(oth<3)console.log('   OTHER CHANGE',e,i,'\n    live:',String(la[i]).slice(0,160),'\n    rvf :',String(lb[i]).slice(0,160));}}
 const sm=String(rd['Format Markdown'].slice(-1)[0].data.main[0][0].json.md);const stored=sm===a;if(!stored){const ls=sm.split('\n');let n=0,f=-1;for(let i=0;i<Math.max(ls.length,la.length);i++)if(ls[i]!==la[i]){n++;if(f<0)f=i;}console.log('   stored vs live replay: lines differing',n,'first',f,JSON.stringify(String(ls[f]).slice(0,120)),'|',JSON.stringify(String(la[f]).slice(0,120)));}
 console.log(e,'| flag rows',rowsOf(a).length,'| Review->Cured',rc,JSON.stringify(byk),'| other changed lines',oth,'| lines',la.length,lb.length,'| live replay equals stored md',stored);T.rc+=rc;T.other+=oth;}
console.log('TOTAL Review->Cured',T.rc,'other',T.other);
// (B) plants on 35067
console.log('== (B) plants on 35067 (pkgRVF Format Markdown)');
const X=JSON.parse(fs.readFileSync(W+'ex35067_full.json','utf8'));const rd=(X.data||X).resultData.runData;
const GJ=rd['Get Judgments'].slice(-1)[0].data.main[0];
const plant=async(name,edit,probe,expect)=>{const J=JSON.parse(JSON.stringify(GJ));const ok0=edit(J);const m=await md(FM1,rd,{'Get Judgments':J});const r=rowsOf(m).filter(probe);
 const got=r.map(l=>l.startsWith('| Cured')?'Cured':'Review');const pass=ok0!==false&&r.length>0&&got.every(g=>g===expect);console.log((pass?'OK  ':'FAIL')+' '+name+' | rows '+r.length+' '+got.join(',')+' | expected '+expect);return pass;};
const lunaE=(J,f)=>{const j=J.find(x=>x.json.judge_seat==='luna').json;const v0=j.verdict_raw;j.verdict_raw=f(v0);return j.verdict_raw!==v0;};
const rep=(a,b)=>v=>{if(!v.includes(a))return v+'__MISSING__';return v.split(a).join(b);};
const res=[];
res.push(await plant('P0 control: luna K-W #1 as stored',J=>true,l=>l.includes('(panel judge luna)')&&l.includes('DEFENDER CR2 no link heading #1:'),'Cured'));
res.push(await plant('P1 luna K-W #1 report UNCURED',J=>lunaE(J,rep('ITEM: DEFENDER CR2 no link heading #1; RULE: K-W; RESULT: CURED','ITEM: DEFENDER CR2 no link heading #1; RULE: K-W; RESULT: UNCURED')),l=>l.includes('(panel judge luna)')&&l.includes('DEFENDER CR2 no link heading #1:'),'Review'));
res.push(await plant('P2 luna S3 #1 report UNCURED',J=>lunaE(J,rep('ITEM: S3 DEFENDER CR4: #1; RULE: K-S3; RESULT: CURED','ITEM: S3 DEFENDER CR4: #1; RULE: K-S3; RESULT: UNCURED')),l=>l.includes('(panel judge luna)')&&l.includes('I grant the taking is the step'),'Review'));
res.push(await plant('P3 S3 flag in curly quotes, report straight',J=>lunaE(J,rep('CR4: "I grant the taking is the step that follows the angel\'s word."; a close-round','CR4: “I grant the taking is the step that follows the angel’s word.”; a close-round')),l=>l.includes('(panel judge luna)')&&l.includes('I grant the taking is the step'),'Cured'));
res.push(await plant('P4 K-W item with a colon (flag and report)',J=>lunaE(J,v=>rep('DEFENDER CR2 no link heading #1: "','DEFENDER CR2: LINK 2 #1: "')(rep('ITEM: DEFENDER CR2 no link heading #1;','ITEM: DEFENDER CR2: LINK 2 #1;')(v))),l=>l.includes('(panel judge luna)')&&l.includes('DEFENDER CR2: LINK 2 #1:'),'Cured'));
res.push(await plant('P5 K-W flag with no #N',J=>lunaE(J,rep('DEFENDER CR2 no link heading #1: "','DEFENDER CR2 no link heading: "')),l=>l.includes('(panel judge luna)')&&l.includes('DEFENDER CR2 no link heading: "'),'Review'));
res.push(await plant('P6 challenger DR4 S3 (flag and report)',J=>lunaE(J,v=>rep('-- DEFENDER CR4: "I grant the taking is the step','-- CHALLENGER DR4: "I grant the taking is the step')(rep('LINE: DEFENDER CR4: "I grant the taking is the step','LINE: CHALLENGER DR4: "I grant the taking is the step')(v))),l=>l.includes('(panel judge luna)')&&l.includes('CHALLENGER DR4: "I grant the taking'),'Cured'));
res.push(await plant('P7 S3 flag side differs from report (flag CHALLENGER DR4, report DEFENDER CR4)',J=>lunaE(J,rep('-- DEFENDER CR4: "I grant the taking is the step','-- CHALLENGER DR4: "I grant the taking is the step')),l=>l.includes('(panel judge luna)')&&l.includes('CHALLENGER DR4: "I grant the taking'),'Review'));
res.push(await plant('P8 S3 flag round differs (flag CR3, report CR4)',J=>lunaE(J,rep('-- DEFENDER CR4: "I grant the taking is the step','-- DEFENDER CR3: "I grant the taking is the step')),l=>l.includes('(panel judge luna)')&&l.includes('CR3: "I grant the taking'),'Review'));
res.push(await plant('P9 other seat: chatgpt report UNCURED leaves luna Cured',J=>{const j=J.find(x=>x.json.judge_seat==='chatgpt').json;const v0=j.verdict_raw;j.verdict_raw=v0.replace(/RULE: K-W; RESULT: CURED/g,'RULE: K-W; RESULT: UNCURED');return j.verdict_raw!==v0;},l=>l.includes('(panel judge luna)')&&/\(K-W;/.test(l),'Cured'));
res.push(await plant('P9b same plant: chatgpt K-W rows Review',J=>{const j=J.find(x=>x.json.judge_seat==='chatgpt').json;const v0=j.verdict_raw;j.verdict_raw=v0.replace(/RULE: K-W; RESULT: CURED/g,'RULE: K-W; RESULT: UNCURED');return j.verdict_raw!==v0;},l=>!l.includes('(panel judge luna)')&&!l.includes('(panel judge sol)')&&/\(K-W;/.test(l),'Review'));
res.push(await plant('P10 S3 flag sentence changed after 40 letters (key still equal; stays Cured)',J=>lunaE(J,rep('CR4: "I grant the taking is the step that follows the angel\'s word."; a close-round','CR4: "I grant the taking is the step that follows the angel\'s DIFFERENT TAIL."; a close-round')),l=>l.includes('(panel judge luna)')&&l.includes('DIFFERENT TAIL'),'Cured'));
res.push(await plant('P11 LIMIT (W1): two S3 flags share the first 40 letters, second report UNCURED (correct: Review)',J=>lunaE(J,v=>rep('ITEM: S3 DEFENDER CR4: #2; RULE: K-S3; RESULT: CURED','ITEM: S3 DEFENDER CR4: #2; RULE: K-S3; RESULT: UNCURED')(rep('"I agree the taking is the act that stood."','"I grant the taking is the step that follows the angel\'s command, not the act."')(v))),l=>l.includes('(panel judge luna)')&&l.includes('command, not the act'),'Review'));
res.push(await plant('P12 LIMIT: S3 report UNCURED and the flag is word for word another CURED one (correct: Review)',J=>lunaE(J,v=>rep('ITEM: S3 DEFENDER CR4: #2; RULE: K-S3; RESULT: CURED','ITEM: S3 DEFENDER CR4: #2; RULE: K-S3; RESULT: UNCURED')(rep('"I agree the taking is the act that stood."','"I grant the taking is the step that follows the angel\'s word."')(v))),l=>l.includes('(panel judge luna)')&&l.includes('follows the angel'),'Review'));
res.push(await plant('P13 K-W flag lower-case item, report upper-case',J=>lunaE(J,rep('-- DEFENDER CR2 no link heading #1: "','-- defender cr2 no link heading #1: "')),l=>l.includes('(panel judge luna)')&&l.includes('defender cr2 no link heading #1'),'Cured'));
console.log('plants OK',res.filter(Boolean).length,'of',res.length);
})();
