const fs=require('fs');const [,,EX,PATCH]=process.argv;
let src=fs.readFileSync(__dirname+'/src/Gate_Record.js','utf8').split('\n').slice(0,1399).join('\n');
if(PATCH){const a=fs.readFileSync(__dirname+'/anchor.txt','utf8'),ins=fs.readFileSync(__dirname+'/oad_fix.txt','utf8');const f=src.indexOf('function sbApply2024');const k=src.indexOf(a,f);if(k<0||k>src.indexOf('\nfunction ',f+10))throw 'anchor';src=src.slice(0,k)+ins+src.slice(k);}
const M=new Function('$input','$',src+'\nreturn {sbApply2024,gateNewK2024,cureJText,psGrades};')({all:()=>[]},()=>({first:()=>({json:{}}),all:()=>[]}));
const j=JSON.parse(fs.readFileSync(EX));const G=j.data.resultData.runData['Gate Record'][0].data.main[0][0].json;
let raw=null,p=null;for(const s of G.bodies){const b=JSON.parse(s);if(b.payload&&/luna/.test(JSON.stringify(b).slice(0,3000))){}}
const B=G.bodies.map(s=>JSON.parse(s));const lb=B.find(b=>JSON.stringify(b).includes('gpt-6-luna'));p=lb.payload;raw=p.verdict_raw;
const its=G.sb_items.filter(x=>x.seat==='luna');
const Fd={verdict_tag:p.verdict_tag,defense_standing:p.defense_standing,conceded_links:p.conceded_links,challenge_standing:p.challenge_standing,challenger_conceded_links:p.challenger_conceded_links};
console.log('fields',JSON.stringify(Fd));
const R=M.sbApply2024('luna',raw,Fd,its,null);
console.log('items',JSON.stringify((R.items||[]).map(x=>[x.sid,x.kind,String(x.why).slice(0,60)])));
console.log('rp',JSON.stringify((R.rp||[]).map(x=>x.sid||x)).slice(0,300));
const T0=M.cureJText(raw,true);const T1=R.text;
const oo=t=>t.split('\n').filter(l=>/OUT-OF-ROUND|^\s*(?:[-•]\s*)?DEFENDER \| \[CR|CONCEDED LINKS/i.test(l)).map(l=>l.slice(0,170));
console.log('--- OOR/count lines after apply:\n'+oo(T1).join('\n'));
console.log('fields after',JSON.stringify(R.fields));
try{const K=M.gateNewK2024(T0,T1,Fd,R.fields,{R:null,DL:[]});console.log('newK a',JSON.stringify(K.a||[]).slice(0,600),'\nnewK b',JSON.stringify(K.b||[]).slice(0,600));}catch(e){console.log('gateNewK err',e.message);}
