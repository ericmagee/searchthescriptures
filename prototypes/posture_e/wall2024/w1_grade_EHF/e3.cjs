const fs=require('fs');const run=require('../pkgKSR/run_node.cjs');const L=require('/mnt/project-files/w4/kwn/lib.cjs');const P='/mnt/project-files/wall2024/';
const S=L(P+'fetchback_live_s120.json'),E=L(P+'parent_s120_EHF.json'),J=L(P+'joint_s120_VP1B_KWN_G4Mr2_EHF.json');
const RD=JSON.parse(fs.readFileSync(P+'ex34852_full.json','utf8')).data.resultData.runData;const IN=RD['Send Back Build']?null:null;
const txt=o=>Array.isArray(o)?o.map(i=>JSON.stringify(i.json||i)):[];
(async()=>{const a=txt(await run(S.code('Send Back Build'),'Send Back Build',RD)),b=txt(await run(E.code('Send Back Build'),'Send Back Build',RD)),c=txt(await run(J.code('Send Back Build'),'Send Back Build',RD));
const OLD=', on a witness the side answered, with the FORCED line for the pair given only when the gate asks for it (K-G4),';const NEW=' (on a witness the side answered: FORCED: <Dn vs Cm> -- MEANS [<round>]: \\\\\\"...\\\\\\" -- ANSWER [<round>]: \\\\\\"...\\\\\\" -- FAILS: \\\\\\"...\\\\\\"),';
const st=RD['Send Back Build'][0].data.main[0].map(i=>JSON.stringify(i.json));
for(let i=0;i<a.length;i++){const s=JSON.parse(a[i]).seat;const nOld=a[i].split('gate asks for it').length-1,nNew=b[i].split('gate asks for it').length-1,nForm=b[i].split('FORCED: <Dn vs Cm>').length-1,nForm0=a[i].split('FORCED: <Dn vs Cm>').length-1;
 const back=b[i].split(NEW).join(OLD);console.log(s,'| live==stored',a[i]===st[i],'| old phrase live',nOld,'EHF',nNew,'| FORCED form live',nForm0,'EHF',nForm,'| EHF mapped back == live',back===a[i],'| joint==EHF',c[i]===b[i]);}
const k=b[1].indexOf('ITEM S7');console.log('chatgpt S7 in EHF:',b[1].slice(k,k+1500).replace(/\\\\n/g,' ').match(/CHANGE TO the BROKEN line[^]{0,260}/)[0]);})();
(async()=>{await new Promise(r=>setTimeout(r,50));const b=txt(await run(E.code('Send Back Build'),'Send Back Build',RD)),a=txt(await run(S.code('Send Back Build'),'Send Back Build',RD));
let i=-1;while((i=b[1].indexOf('gate asks for it',i+1))>=0)console.log('REMAIN:',b[1].slice(i-260,i+40).replace(/\\\\n/g,' '));
for(const s of [1,2]){const OLD=', on a witness the side answered, with the FORCED line for the pair given only when the gate asks for it (K-G4),';const NEW=' (on a witness the side answered: FORCED: <Dn vs Cm> -- MEANS [<round>]: \\\\\\"...\\\\\\" -- ANSWER [<round>]: \\\\\\"...\\\\\\" -- FAILS: \\\\\\"...\\\\\\"),';const back=b[s].split(NEW).join(OLD);let k=0;while(back[k]===a[s][k])k++;console.log('first diff seat',s,'at',k,'| live:',a[s].slice(k-80,k+80).replace(/\\\\n/g,' '),'\n | EHF back:',back.slice(k-80,k+80).replace(/\\\\n/g,' '));}})();
