// Portion F falsifier (2): Panel Cure Check's code, run as written (new Function over the file), on five bodies plus one through the
// cure path; then three mutants, one per site, each of which must change at least one case. Usage: node fivebody.cjs [code file]
const fs=require('fs');const code=fs.readFileSync(process.argv[2]||__dirname+'/Panel_Cure_Check.js','utf8');
const B=d=>JSON.stringify({payload:{drv_uncured:d,verdict_raw:'x'}});
const run=(src,bodies,summary,qa)=>{const nodes={'Panel Payloads':{json:{bodies,summary}},'Init Seats':{json:qa?{qualify_alternate:qa}:{}}};
 const $=n=>({first:()=>nodes[n],all:()=>[nodes[n]],get isExecuted(){return !!nodes[n];}});
 return new Function('$',src)($)[0].json.alt_needed;};
const z=(n)=>Array.from({length:n},()=>({seat:'s',drv:[]}));
const item={rule:'K-B',side:'DEFENDER',link:'D1 vs C1',kinds:[],line:'D1 vs C1: DEFENDER LINK BROKEN -- x'};
const cases=[
 ['one above 0',[B(2),B(0),B(0)],z(3),null,true],
 ['all 0',[B(0),B(0),B(0)],z(3),null,false],
 ['malformed only',['not json',B(0),B(0)],z(3),null,false],
 ['malformed plus one above 0',['not json',B(1),B(0)],z(3),null,true],
 ['qualify set',[B(0),B(0),B(0)],z(3),'minimax/minimax-m3',true],
 ['through the cure path (one item, no cure reply)',[B(0),B(0),B(0)],[{seat:'s',drv:[item]},{seat:'s',drv:[]},{seat:'s',drv:[]}],null,true]];
const grade=src=>cases.map(([n,b,s,q,want])=>{let got;try{got=run(src,b,s,q);}catch(e){got='THREW '+e.message;}return [n,got,want,got===want];});
let bad=0;for(const [n,got,want,ok] of grade(code)){if(!ok)bad++;console.log((ok?'OK  ':'FAIL')+' '+n+': '+got+' (want '+want+')');}
const site='const alt_needed=bodies.some(b=>{try{return (JSON.parse(b).payload.drv_uncured||0)>0;}catch(e){return false;}})||!!altS.qualify_alternate;';
if(code.split(site).length!==2){console.log('FAIL anchor not found exactly once');process.exit(1);}
const mut=[['alt_needed fixed true','const alt_needed=true;'],['alt_needed fixed false','const alt_needed=false;'],
 ['malformed counted as above 0',site.replace('catch(e){return false;}','catch(e){return true;}')]];
for(const [n,rep] of mut){const k=grade(code.replace(site,rep)).filter(r=>!r[3]).length;console.log((k?'KILLED ':'SURVIVED ')+n+' ('+k+' case(s) changed)');if(!k)bad++;}
console.log(bad?'FAILURES '+bad:'ALL PASS: 6 cases, 3 mutants killed');process.exit(bad?1:0);
