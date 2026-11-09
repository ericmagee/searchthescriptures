// pkgRPN replay: for every saved run in inputs/, run each changed node's old source (live s78 / strip_FUM) and new source (pkgRPN) on the same saved inputs;
// outputs must be byte-equal (the change only drops names of nodes that never ran). Where the node's own saved output exists, the new output is also compared to it.
// Run from wall2024/: node pkgRPN/test_RPN.cjs
const fs=require('fs');const {harness,live,feeder,D}=require('../pkgGSL/harness.cjs');
const FB='/mnt/project-files/wall2024/fetchback_live_s78.json';const W=JSON.parse(fs.readFileSync(FB,'utf8'));
const st=x=>JSON.stringify(x,(k,v)=>k==='at'?undefined:v);
const NODES=[['Panel Payloads','L'],['Alternate Payloads','L'],['R2 Alternate Payloads','L'],['Panel Check','N'],['Panel Tokens','N'],['Build Save Body','N']];
const src=(n,k,neu)=>k==='L'?fs.readFileSync('pkgLIB/'+(neu?'strip_RPN':'strip_FUM')+'/patched/'+n.replace(/ /g,'_')+'.js','utf8'):(neu?fs.readFileSync('pkgRPN/nonlib/'+n.replace(/ /g,'_')+'.js','utf8'):W.nodes.find(z=>z.name===n).parameters.jsCode);
const runs=[...new Set(fs.readdirSync(D).map(f=>f.split('_')[0]).filter(r=>/^\d+$/.test(r)))].sort();
let ok=0,bad=0,skip=0,eqSaved=0,neSaved=0;const out=[];
const run1=async(code,R,inp)=>{try{return {v:await harness(R)('return (async()=>{\n'+code+'\n})();',inp)};}catch(e){return {e:String(e&&e.message||e).slice(0,200)};}};
(async()=>{for(const R of runs)for(const [n,k] of NODES){
 const feeders=W.connections?Object.entries(W.connections).filter(([a,v])=>JSON.stringify(v).includes('"node":"'+n+'"')).map(([a])=>a):[];
 const inp=feeders.find(f=>fs.existsSync(D+R+'_'+f.replace(/ /g,'_')+'.json'));
 if(!inp||!fs.existsSync(D+R+'_'+n.replace(/ /g,'_')+'.json')){skip++;continue;}
 const a=await run1(src(n,k,false),R,inp),b=await run1(src(n,k,true),R,inp);
 if(st(a)===st(b)){ok++;}else{bad++;out.push('DIFF '+R+' '+n+' old='+st(a).slice(0,200)+' new='+st(b).slice(0,200));}
 const sv=JSON.parse(fs.readFileSync(D+R+'_'+n.replace(/ /g,'_')+'.json','utf8'));const svm=(Array.isArray(sv)?sv[0]:sv)||{};const m=((svm.data&&svm.data.main)||svm.main||[])[0];
 if(b.v&&m){if(st(b.v.map(x=>x.json))===st(m.map(x=>x.json)))eqSaved++;else neSaved++;}
 out.push(R+' '+n+' '+(st(a)===st(b)?'SAME':'DIFF')+(a.e?' (both threw: '+a.e+')':''));}
 out.forEach(l=>console.log(l));console.log('TOTAL same',ok,'diff',bad,'skipped (no saved input)',skip,'| new output equal to the saved live output',eqSaved,'not equal',neSaved);
 fs.writeFileSync('pkgRPN/test_RPN.txt',out.join('\n')+'\nTOTAL same '+ok+' diff '+bad+' skipped '+skip+' savedEq '+eqSaved+' savedNe '+neSaved+'\n');})();
