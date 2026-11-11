// replay live effective source vs trimmed source on every stored run that holds the node's input. Output: replay_out.txt
const fs=require('fs');const H=require('/home/claude/searchthescriptures/prototypes/posture_e/wall2024/pkgEAD/harness_clone.cjs');
let A=JSON.parse(fs.readFileSync('/mnt/project-files/wall2024/fetchback_live_s119.json','utf8'));A=A.data||A;A=A.workflow||A;
const lib=A.nodes.find(n=>n.name==='Shared Library').parameters.jsCode;const meta=require('./eff119.meta.json');const rep=require('./trim119.report.json');
const pred={};for(const [src,c] of Object.entries(A.connections))for(const arr of (c.main||[]))for(const t of (arr||[]))(pred[t.node]=pred[t.node]||[]).push(src);
const runs=[...new Set(fs.readdirSync(H.IN).map(f=>f.split('_')[0]))].sort();
const strip=v=>JSON.stringify(v,(k,x)=>typeof x==='function'?'[fn]':x).replace(/\*\*Run time:\*\* \d+ min \d+ s \(started [^)]*\)/g,'<clock>').replace(/20\d\d-\d\d-\d\dT\d\d:\d\d:\d\d(\.\d+)?Z/g,'<ts>');
const RUN=(src,r,inp)=>{const $0=H.mk$(r,{});const $=n=>n==='Shared Library'?{params:{jsCode:lib},isExecuted:true}:$0(n);const i=$0(inp);const $input={first:()=>i.first(),all:()=>i.all(),item:i.item};const $execution={id:String(r),mode:'production',resumeUrl:'',customData:{set(){},get(){},setAll(){},getAll(){return {};}}};return new Function('$','$input','$execution','return (async()=>{\n'+src+'\n})();')($,$input,$execution);};
(async()=>{let tot=0,eq=0;const diff=[],none=[],errBoth=[];const only=process.argv[2]?new Set(process.argv[2].split(',')):null;
for(const [f,x] of Object.entries(rep)){if(!x.removed)continue;const name=meta[f].name;if(only&&!only.has(name))continue;
 const sa=fs.readFileSync('eff119/'+f,'utf8'),sb=fs.readFileSync('trim119/'+f,'utf8');const ps=pred[name]||[];let k=0;
 for(const r of runs){const inp=ps.find(p=>H.out(r,p));if(!inp)continue;
  const go=async s=>{try{return strip(await RUN(s,r,inp));}catch(e){return 'ERR '+String(e&&e.message).slice(0,200);}};
  const oa=await go(sa),ob=await go(sb);k++;tot++;
  if(oa===ob){eq++;if(oa.startsWith('ERR '))errBoth.push(name+' '+r+' '+oa.slice(0,100));}
  else{const oa2=await go(sa);diff.push(name+' '+r+(oa2!==oa?' (live itself unstable)':'')+' | live '+oa.slice(0,100)+' | trim '+ob.slice(0,100));}}
 if(!k)none.push(name);fs.appendFileSync('replay_log.txt',name+' runs '+k+'\n');}
const out=['replays '+tot+' equal '+eq+' differ '+diff.length,...diff.map(d=>' DIFF '+d),'both ERR (equal): '+errBoth.length,...errBoth.slice(0,30).map(x=>'  '+x),'no stored input: '+JSON.stringify(none)].join('\n');
fs.writeFileSync('replay_out.txt',out);fs.writeFileSync('replay_errboth.txt',errBoth.join('\n'));console.log(out);})();
