// W2 R1b grade step 3: replay the 45 newly packed nodes on stored inputs. Live: the live s119 jsCode run directly. R1b: the R1b STUB text itself run with $('Shared Library') giving the R1b library (so the stub path, its if(false) list, JSON parse, length check and Function wrapper all run). Outputs compared as JSON; an error counts as output (message compared).
const fs=require('fs'),path=require('path');const H=require('../../pkgEAD/harness_clone.cjs');
const g=f=>{let d=JSON.parse(fs.readFileSync(f,'utf8'));d=d.data||d;return d.workflow||d;};
const A=g('/mnt/project-files/wall2024/fetchback_live_s119.json'),B=g('/mnt/project-files/wall2024/parent_s119_R1b.json');
const lb=B.nodes.find(n=>n.name==='Shared Library').parameters.jsCode;const changed=JSON.parse(fs.readFileSync(__dirname+'/changed.json'));
const pred={};for(const [src,c] of Object.entries(A.connections))for(const arr of (c.main||[]))for(const t of (arr||[]))(pred[t.node]=pred[t.node]||[]).push(src);
const RUNS=process.argv[2]?process.argv[2].split(','):null;const runs=RUNS||[...new Set(fs.readdirSync(H.IN).map(f=>f.split('_')[0]))].sort();
const strip=v=>JSON.stringify(v,(k,x)=>typeof x==='function'?'[fn]':x).replace(/\*\*Run time:\*\* \d+ min \d+ s \(started [^)]*\)/g,'**Run time:** <clock>');
const RUN=(src,run_,inputName)=>{const $0=H.mk$(run_,{});const $=n=>n==='Shared Library'?{params:{jsCode:lb},isExecuted:true}:$0(n);const inp=$0(inputName);const $input={first:()=>inp.first(),all:()=>inp.all(),item:inp.item};return new Function('$','$input','return (async()=>{\n'+src+'\n})();')($,$input);};
(async()=>{let tot=0,same=0,diff=[],none=[];
for(const name of changed){const sa=A.nodes.find(n=>n.name===name).parameters.jsCode,sb=B.nodes.find(n=>n.name===name).parameters.jsCode;
 const ps=(pred[name]||[]);let k=0;
 for(const r of runs){const inp=ps.find(p=>H.out(r,p));if(!inp)continue;
  const go=async(src,over)=>{try{const v=await RUN(src,r,inp);return strip(v);}catch(e){return 'ERR '+String(e&&e.message).slice(0,200);}};
  const oa=await go(sa,{}),ob=await go(sb,{'Shared Library':[[{json:{}}]]});
  // H.mk$ gives params:{}; patch: run R1b stub with a $ wrapper
  k++;tot++;fs.appendFileSync(__dirname+'/replay_log.txt',name+' '+r+' '+(oa===ob?'EQ':'DIFF')+' '+oa.length+'\n');if(oa!==ob){const oa2=await go(sa,{});let i=0;while(oa[i]===ob[i])i++;let j=0;while(oa[j]===oa2[j]&&j<oa.length)j++;process.stderr.write(['DETAIL',name,r,'first difference at',i,'| live run twice equal:',oa===oa2,'(differ at '+j+')','| live:',JSON.stringify(oa.slice(i-80,i+80)),'| r1b:',JSON.stringify(ob.slice(i-80,i+80))].join(' ')+'\n');}
  if(oa===ob)same++;else diff.push(name+' '+r+' | live '+oa.slice(0,120)+' | r1b '+ob.slice(0,120));}
 if(!k)none.push(name+' (preds '+ps.join(',')+')');console.log(name,'runs',k);}
console.log('replays',tot,'equal',same,'differ',diff.length);diff.slice(0,20).forEach(x=>console.log(' DIFF',x));console.log('no stored input:',JSON.stringify(none));})();
