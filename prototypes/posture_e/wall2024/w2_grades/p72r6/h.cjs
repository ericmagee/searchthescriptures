// W2 harness for pkgP72: run the 3 enforcer Builds of a parent on the 12 exports; dump every ruling-372 block in the prompt, r372 ids, and the judge's CONCEDED LINKS line; optional plant (string replace in the export) 
const fs=require('fs');const D='/mnt/project-files/wall2024/';
const rebuild=(stub,lib)=>{let i=stub.indexOf('\nreturn await new Function(');if(i<0)i=stub.indexOf('\nconst __e4h');const $=n=>({params:{jsCode:lib}});return new Function('$',stub.slice(0,i)+'\nreturn __S;')($);};
module.exports=async function run(parentF,opts={}){const X=JSON.parse(fs.readFileSync(D+parentF,'utf8'));const PW=(X.data||X).workflow||(X.data||X);const lib=PW.nodes.find(n=>n.name==='Shared Library').parameters.jsCode;
 const out=[];const files=fs.readdirSync(D).filter(x=>/^ex3\d+_full\.json$/.test(x)).filter(x=>!opts.only||x.includes(opts.only));
 for(const fn of files){let raw=fs.readFileSync(D+fn,'utf8');if(opts.plant)raw=opts.plant(raw,fn);const rd=JSON.parse(raw).data.resultData.runData;
  const mk=name=>{const r=rd[name];const items=r?r[r.length-1].data.main.flat().filter(Boolean):[];const node=(PW.nodes.find(n=>n.name===name)||{});return {isExecuted:!!r,first:()=>items[0],all:()=>items,last:()=>items[items.length-1],item:items[0],params:node.parameters||{}};};
  for(const node of ['Judge Enforcer Build','Alt Judge Enforcer Build','R2 Alt Judge Enforcer Build']){if(!rd[node])continue;const src=rebuild(PW.nodes.find(n=>n.name===node).parameters.jsCode,lib);const inp=mk(rd[node][0].source[0].previousNode);const $i={all:()=>inp.all(),first:()=>inp.first(),item:inp.first()};
   let o;try{o=await new Function('$','$input','return (async()=>{\n'+src+'\n})();')(mk,$i);}catch(e){out.push({fn,node,err:e.message});continue;}
   for(const it of o){const j=it.json;const body=JSON.stringify(j.body||'');for(const x of (j.ids||[]))if(x.rule==='E-PREM'){
     // find this id's block in the request text
     const strs=[];const wk=v=>{if(typeof v==='string')strs.push(v);else if(v&&typeof v==='object')for(const q in v)wk(v[q]);};wk(j.body);const txt=strs.join('\n');
     const k=txt.indexOf('- '+x.id+' ('+x.seat+'): ');let blk='';if(k>=0){let seg=txt.slice(k+3);const e=seg.search(/\n- P\d+\.\d+ \(|\nITEM /);if(e>=0)seg=seg.slice(0,e);const m=seg.match(/MISSES OR FAILS \(ruling 372\): ([^]*)/);if(m)blk=m[1].slice(0,400);}
     out.push({run:fn.slice(2,7),node,id:x.id,seat:x.seat,prem:x.item,r372:x.r372||[],blk,line:x.flagged_line});}}}}
 return out;};
if(require.main===module)(async()=>{const r=await module.exports(process.argv[2]);const b=r.filter(x=>x.blk||(x.r372&&x.r372.length)||x.err);console.log('E-PREM ids',r.filter(x=>x.id).length,'with prompt block',r.filter(x=>x.blk).length,'with r372',r.filter(x=>x.r372&&x.r372.length).length,'errors',r.filter(x=>x.err).length);
 for(const x of b)console.log(x.err?('ERR '+x.run+' '+x.node+' '+x.err):(x.run+' '+x.node.split(' ')[0]+' '+x.id+' '+x.seat+' | '+x.prem+' | r372 '+JSON.stringify(x.r372)+' | prompt block '+(x.blk?'YES':'no')+(!!x.blk!==!!x.r372.length?'  <<< MISMATCH':'')));})();
