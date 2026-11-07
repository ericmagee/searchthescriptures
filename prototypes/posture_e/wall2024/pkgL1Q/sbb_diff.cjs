// pkgL1Q: Send Back Build items removed/added by the patch, per saved run (base s44 vs patched, same input).
const fs=require('fs');const {harness,feeder}=require('../pkgGSL/harness.cjs');const B='/mnt/project-files/wall2024/fetchback_live_s44.json';const W=JSON.parse(fs.readFileSync(B));
const out=[];for(const nm of ['Send Back Build','Alt Send Back Build'])for(const RUN of ['33218','33222','33249','33261','33276','33289','33299','33311','33322','33345','33371']){
 const H=harness(RUN);const f=feeder(B,nm).find(x=>fs.existsSync('/mnt/project-files/wall2024/inputs/'+RUN+'_'+x.replace(/ /g,'_')+'.json'));if(!f||!fs.existsSync('/mnt/project-files/wall2024/inputs/'+RUN+'_'+nm.replace(/ /g,'_')+'.json'))continue;
 const c0=W.nodes.find(n=>n.name===nm).parameters.jsCode,c1=fs.readFileSync(__dirname+'/patched/'+nm.replace(/ /g,'_')+'.js','utf8');
 const its=X=>{const s=[];const walk=(o,seat)=>{if(Array.isArray(o))return o.forEach(z=>walk(z,seat));if(o&&typeof o==='object'){const st=o.seat||o.judge_seat||seat;if(o.sid&&o.rule&&o.line)s.push(st+'|'+o.rule+'|'+o.item+'|'+String(o.line).slice(0,140));else for(const v of Object.values(o))walk(v,st);}};walk(X.map(i=>i.json));return s;};
 const a=its(H(c0,f)),b=its(H(c1,f));const A=new Set(a),Bs=new Set(b);
 for(const x of a)if(!Bs.has(x))out.push(RUN+' '+nm+' NOT SENT (patched): '+x);for(const x of b)if(!A.has(x))out.push(RUN+' '+nm+' NEW: '+x);}
console.log(out.join('\n'));fs.writeFileSync(__dirname+'/sbb_diff.txt',out.join('\n')+'\n');
