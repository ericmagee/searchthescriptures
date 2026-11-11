const fs=require('fs');const W='/mnt/project-files/wall2024/';
const lib=wf=>wf.nodes.find(n=>n.name==='Shared Library').parameters.jsCode;
const par=JSON.parse(fs.readFileSync(W+'parent_s140_UOW2.json','utf8'));const ex35173=JSON.parse(fs.readFileSync(W+'ex35173_full.json','utf8'));
const getOPEN=s=>{const L=JSON.parse(s.slice(s.indexOf('['),s.lastIndexOf(']')+1).length?'[]':'[]');return null;};
// the library is an array-of-strings source joined; evaluate the OPEN line by finding it in the joined runtime text
function OPENof(js){let t=js;try{const arr=eval(js.slice(js.indexOf('['),js.indexOf('].join')+1));if(Array.isArray(arr))t=arr.join('\n');}catch(e){}
 const m=t.match(/const OPEN=(\/.*?\/i);/);return eval(m[1].replace(/\\\\/g,"\\"));}
const O=OPENof(lib(ex35173.workflowData)), N=OPENof(lib(par));
console.log('live:',O.source.slice(0,60));console.log('cand:',N.source.slice(0,60));
const plants=[['P1','leaves the Davidic-line question open',1],['P1','leave **the matter** open',1],['P1','leaves [D4] open',1],['P1','leaves it open whether',1],
['P2','leaves Joseph’s house and goes up to the open court',0],['P2','leaves him and the door was open',0]];
for(const [p,t,e] of plants){const a=O.test(t),b=N.test(t);console.log(p,(b==!!e)?'AS EXPECTED':'NOT AS EXPECTED',JSON.stringify(t),'live',a,'cand',b);}
// stored scan
const files=fs.readdirSync(W).filter(f=>/^ex\d+_full\.json$/.test(f));const seen=new Set();let tot=0,lp=0,cp=0,pf=[],fp=[];
for(const f of files){const s=fs.readFileSync(W+f,'utf8');const re=/D\d+ vs C\d+[^\n"\\]{0,40}?UNDERDETERMINED[^\n"]{0,1500}/g;let m;
 // unescape json string content roughly
 const u=s.replace(/\\\\n/g,'\n').replace(/\\n/g,'\n').replace(/\\u2019/g,'’').replace(/\\"/g,'"');
 while((m=re.exec(u))){const L=m[0].split(/\n/)[0];if(seen.has(L))continue;seen.add(L);tot++;const a=O.test(L),b=N.test(L);if(a)lp++;if(b)cp++;if(a&&!b)pf.push([f,L]);if(!a&&b)fp.push([f,L]);}}
console.log('P3 files',files.length,'distinct lines',tot,'live pass',lp,'cand pass',cp,'PASS->FAIL',pf.length,'FAIL->PASS',fp.length);
for(const [f,L] of fp)console.log(' F->P',f,L.slice(0,400));
for(const [f,L] of pf)console.log(' P->F',f,L.slice(0,400));
for (const [p,t,e] of [['P5','leaves the matter -- for now -- open',1],['P5','leaves (as was supposed) open',0],['P5','leaves the so-called question open',1],['P5','leaves Joseph’s house — open',0],['P5','leaves the record silent and open',1]]){const b=N.test(t);console.log(p,(b==!!e)?'AS EXPECTED':'NOT AS EXPECTED',JSON.stringify(t),'live',O.test(t),'cand',b);}
