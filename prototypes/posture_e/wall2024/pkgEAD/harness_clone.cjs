// pkgVP1 harness: run one library node source on a saved run's stored node outputs. HOOK lets a probe reach the node's inner functions.
const fs=require('fs'),path=require('path');const IN='/mnt/project-files/wall2024/inputs';
const cache={};
function out(run,name){const k=run+'|'+name;if(k in cache)return cache[k];const f=path.join(IN,run+'_'+name.replace(/ /g,'_')+'.json');let v=null;if(fs.existsSync(f)){const r=JSON.parse(fs.readFileSync(f,'utf8'));const last=r[r.length-1];v=(last&&last.data&&last.data.main)||null;}return cache[k]=v;}
function mk$(run,over){over=over||{};return name=>{const o=(name in over)?over[name]:out(run,name);const items=o?JSON.parse(JSON.stringify(o.flat().filter(Boolean))):[];return {isExecuted:!!o,first:()=>{if(!items.length)throw new Error('no data '+name);return items[0];},all:()=>items,last:()=>items[items.length-1],item:items[0],params:{}};};}
function run(src,run_,inputName,over,hook){const $=mk$(run_,over);const inp=$(inputName);const $input={first:()=>inp.first(),all:()=>inp.all(),item:inp.item};
 let s=src;if(hook){const a='\nconst PASS=';const i=s.lastIndexOf(a);if(i<0)throw new Error('no PASS anchor');s=s.slice(0,i)+'\nif(globalThis.__HOOK)return globalThis.__HOOK(n=>eval(n));'+s.slice(i);globalThis.__HOOK=hook;}else globalThis.__HOOK=null;
 return new Function('$','$input','return (async()=>{\n'+s+'\n})();')($,$input);}
module.exports={out,mk$,run,IN};
