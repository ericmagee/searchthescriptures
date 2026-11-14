// ASK 290 replay: cureRounds (LIB 855-858) old vs new on a 37113 body with the COUNT LIST NOTE after [DR1], then the E-SYN giveUp (LIB 3155-3156) for Y1.
const fs=require('fs');const lib=f=>{const W=JSON.parse(fs.readFileSync(f,'utf8'));const T=W.nodes.find(n=>n.name==='Shared Library').parameters.jsCode;return JSON.parse(T.slice(T.indexOf('\n/*LIB*/')+8,T.lastIndexOf('\n/*MAP*/')));};
const L0=lib(__dirname+'/../w287/fresh_s205.json'),L1=lib(process.argv[2]||__dirname+'/target.json');
const {r}=JSON.parse(fs.readFileSync(__dirname+'/../a287/runs.json','utf8'))['ODV1-37113-vaaf3hwh'];
const RD={CR1:r.claude_r1,DR1:r.engine_r1,CR2:r.claude_r2,DR2:r.engine_r2,CR3:r.engine_r3,DR3:r.challenger_r3,CR4:r.defender_r4,DR4:r.challenger_r4};
const NOTE='[COUNT LIST NOTE -- computed by the system, not by a model (pkgCLN, ASK 269): the UNSUPPORTED-L4 PREMISES list in [DR1] (numbered 1 to 7) is not the count list. L, c, every count of CONCEDED or UNEXHIBITED premises and every "Premise <p>" read only the list that closes [DR2] (numbered 1 to 6).]';
const order=['CR1','DR1','CR2','DR2','CR3','DR3','CR4','DR4'];const body={messages:[{role:'user',content:order.map(k=>'=== ['+k+'] ===\n'+RD[k]+(k==='DR1'?'\n\n'+NOTE:'')).join('\n')+'\n\nCOUNTING RULE x'}]};
const CLAIM='The challenger’s close collected grants and restated its chain; its last position in the format gives the defender no subsequent round.';
for(const [nm,L] of [['live s205',L0],['ASK 290',L1]]){const R=new Function('body',L.slice(855,859).join('\n')+'\nreturn out;}\nreturn cureRounds(body);')(body);
 const g=new Function('R','claim',L[2976]+'\n'+L[3154]+'\n'+L[3155]+'\n'+L[3156]+'\nreturn giveUp(SIDEW.C,claim,"C");')(R,CLAIM);
 console.log('==',nm,'| DR1 holds note:',R.DR1.includes('COUNT LIST NOTE'),'| DR1 equals stored round:',R.DR1.trim()===String(RD.DR1).trim(),'| CR2 equal:',R.CR2.trim()===String(RD.CR2).trim());
 console.log('   Y1 give-ground list holds note:',g.includes('COUNT LIST NOTE'),'| lines:',g.split('\n').length);console.log('   '+g.split('\n').map(x=>x.slice(0,110)).join('\n   '));}
