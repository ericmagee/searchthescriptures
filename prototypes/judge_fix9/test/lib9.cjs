// judge_fix9 test library: loads lib/*.js with REFP (taken from the live Panel Build), the stored rows, and node runners (from judge_fix8 runner.cjs).
const fs=require('fs');const D=__dirname+'/../';
const src=(v,node)=>fs.readFileSync(D+v+'/'+node+'.js','utf8');
const REFP_END='\n return {parse,keys,book,BK,BOOKS};})();';
function refpSrc(){const s=src('base','Panel Build');const i=s.indexOf('const REFP=(()=>');const j=s.indexOf(REFP_END,i);return s.slice(i,j+REFP_END.length);}
// a lib file evaluated with REFP (and optional extra source), returning the names asked
function loadLib(files,names,extra){const code=refpSrc()+'\n'+(extra||'')+'\n'+files.map(f=>fs.readFileSync(D+'lib/'+f,'utf8')).join('\n')+'\n;return {'+names.map(n=>n+':typeof '+n+'!=="undefined"?'+n+':null').join(',')+'};';
 return new Function(code)();}
const run=n=>JSON.parse(fs.readFileSync(D+'data/run'+n+'.json','utf8'));
const rounds=r=>Object.assign({CR1:r.claude_r1,DR1:r.engine_r1,CR2:r.claude_r2,DR2:r.engine_r2,CR3:r.engine_r3,DR3:r.challenger_r3},r.defender_r4?{CR4:r.defender_r4}:{},r.challenger_r4?{DR4:r.challenger_r4}:{});
const roundsArr=R=>['CR1','DR1','CR2','DR2','CR3','DR3','CR4','DR4'].filter(k=>R[k]).map(k=>[k[0]==='C'?'DEFENDER':'CHALLENGER',k,R[k]]);
function stub(map){return name=>{if(!(name in map))return {isExecuted:false,first:()=>{throw new Error('node not stubbed: '+name);},all:()=>{throw new Error('node not stubbed: '+name);}};
 const v=map[name];const items=Array.isArray(v)?v.map(j=>({json:j})):[{json:v}];return {isExecuted:true,first:()=>items[0],all:()=>items,item:items[0]};};}
function runNode(v,node,map,input){const s=src(v,node);const ex={id:'test',customData:{set:()=>{}}};
 const inp={first:()=>({json:input||{}}),all:()=>[{json:input||{}}]};return new Function('$','$input','$execution',s)(stub(map),inp,ex);}
let fails=0,passes=0;const T=(name,ok,detail)=>{if(ok)passes++;else fails++;console.log((ok?'ok   ':'BAD  ')+name+(detail!=null?' :: '+(typeof detail==='string'?detail:JSON.stringify(detail)):''));};
const done=()=>{console.log('\n'+passes+' passed, '+fails+' bad');process.exitCode=fails?1:0;};
module.exports={D,src,loadLib,run,rounds,roundsArr,runNode,stub,T,done,refpSrc,REFP_END};
