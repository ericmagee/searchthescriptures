// ASK 306 end-to-end: drvVoid (K-V) and drvPressWith (K-P/K-G10) items, old library vs new, on stored judgments whose debate rounds are stored (rounds8). conc=1 on both sides so drvPressWith reads every side.
const fs=require('fs'),z=require('zlib');const st=require(__dirname+'/stub.cjs');
const load=(f,node,names)=>{const d=st(f,node);const skip=new Set();d.own.forEach(([a,n])=>{for(let i=a;i<a+n;i++)skip.add(i);});const S=d.S.map((l,i)=>skip.has(i)?'':l);const keep=[];
 for(let i=0;i<S.length;i++){const l=S[i];if(!/^(?:function |const |let )/.test(l))continue;for(let k=i;k<Math.min(S.length,i+150);k++){const s=S.slice(i,k+1).join('\n');try{new Function(s);keep.push(/^function /.test(l)?s:'try{eval('+JSON.stringify(s.replace(/^(?:const|let) /,'var '))+')}catch(e){}');i=k;break;}catch(e){}}}
 return new Function('$','$input',keep.join('\n')+'\nreturn {'+names.join(',')+'};')(()=>({isExecuted:false,first:()=>({json:{}}),all:()=>[]}),null);};
const NM=['drvVoid','drvPressWith'];const O=load(process.argv[2],'Panel Payloads',NM),N=load(process.argv[3],'Panel Payloads',NM);
const RD=JSON.parse(z.gunzipSync(fs.readFileSync(__dirname+'/../a293/data/rounds8.json.gz')));const byP={};RD.forEach(r=>byP[r.id.slice(0,8)]=r);
const M={};fs.readFileSync(__dirname+'/map.txt','utf8').trim().split(',').forEach(e=>{const [p,r]=e.split(':');const [a,b]=r.split('-').map(Number);for(let i=a;i<=b;i++)M[i]=p;});
let rows=[];for(const f of ['j0','j300','j600'])rows=rows.concat(require('../a297/data/'+f+'.json'));
const txt=v=>{let T=String(v||'');const s=T.trim();if(s[0]==='{'){const i=s.lastIndexOf('}');try{const J=JSON.parse(s.slice(0,i+1));if(J&&typeof J.reasoning==='string')T=J.reasoning;}catch(e){}}return T.replace(/\n\n\[AUDIT v[\s\S]*$/,'');};
const K=[['CR1','claude_r1'],['CR2','claude_r2'],['CR3','engine_r3'],['CR4','defender_r4'],['DR1','engine_r1'],['DR2','engine_r2'],['DR3','challenger_r3'],['DR4','challenger_r4']];
let n=0,err=0;const tot={old:{},new:{}};const diffs=[];
for(const r of rows){const p=M[r.id];if(!p||!byP[p])continue;const D=byP[p];const PT=K.map(([k,f])=>'=== ['+k+'] round ===\n'+String(D[f]||'')).join('\n\n');const T=txt(r.verdict_raw);n++;
 for(const fn of NM){let a,b;try{a=O[fn](T,PT,1,1,'','',null);b=N[fn](T,PT,1,1,'','',null);}catch(e){err++;console.log('ERR',r.id,fn,e.message);continue;}
  const ka=a.items.map(x=>x.rule+' '+x.link).sort(),kb=b.items.map(x=>x.rule+' '+x.link).sort();ka.forEach(k=>{const q=k.split(' ')[0];tot.old[q]=(tot.old[q]||0)+1;});kb.forEach(k=>{const q=k.split(' ')[0];tot.new[q]=(tot.new[q]||0)+1;});
  if(JSON.stringify(ka)!==JSON.stringify(kb)){const lost=ka.filter(k=>!kb.includes(k)),gain=kb.filter(k=>!ka.includes(k));diffs.push({id:r.id,seat:r.judge_seat,deb:p,fn,lost,gain,gl:b.items.filter(x=>gain.includes(x.rule+' '+x.link)).map(x=>x.line.slice(0,260))});}}}
const RU=require('../a287/runs.json');for(const tok in RU){const D=RU[tok].r;const PT=K.map(([k,f])=>'=== ['+k+'] round ===\n'+String(D[f]||'')).join('\n\n');const JJ=RU[tok].j;for(const s0 in JJ){const r={id:tok+'#'+s0,judge_seat:s0,verdict_raw:JJ[s0].verdict_raw||JJ[s0]};const T=txt(r.verdict_raw);n++;
 for(const fn of NM){let a,b;try{a=O[fn](T,PT,1,1,'','',null);b=N[fn](T,PT,1,1,'','',null);}catch(e){err++;console.log('ERR',r.id,fn,e.message);continue;}
  const ka=a.items.map(x=>x.rule+' '+x.link).sort(),kb=b.items.map(x=>x.rule+' '+x.link).sort();ka.forEach(k=>{const q=k.split(' ')[0];tot.old[q]=(tot.old[q]||0)+1;});kb.forEach(k=>{const q=k.split(' ')[0];tot.new[q]=(tot.new[q]||0)+1;});
  if(JSON.stringify(ka)!==JSON.stringify(kb)){const lost=ka.filter(k=>!kb.includes(k)),gain=kb.filter(k=>!ka.includes(k));diffs.push({id:r.id,seat:r.judge_seat,deb:tok,fn,lost,gain,gl:b.items.filter(x=>gain.includes(x.rule+' '+x.link)).map(x=>x.line.slice(0,260))});}}}}
for(const d of diffs){console.log(d.id,d.seat,d.deb,d.fn,'LOST',JSON.stringify(d.lost),'GAINED',JSON.stringify(d.gain));d.gl.forEach(l=>console.log('    + '+l));}
console.log('judgments',n,'errors',err,'items old',JSON.stringify(tot.old),'new',JSON.stringify(tot.new),'judgments changed',diffs.length);
