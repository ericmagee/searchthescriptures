// trim every effective source in IN: remove outermost dead functions and their module export properties. Writes OUT/<file>, OUT.report.json
const fs=require('fs');const acorn=require('/opt/node-tools/node_modules/acorn');const {analyze}=require('./dead.cjs');
const [IN,OUT]=process.argv.slice(2);fs.mkdirSync(OUT,{recursive:true});const rep={};let tot=0;
for(const f of fs.readdirSync(IN).filter(f=>f.endsWith('.js')).sort()){const src=fs.readFileSync(IN+'/'+f,'utf8');let r;
 try{r=analyze(src);}catch(e){rep[f]={error:String(e.message)};fs.writeFileSync(OUT+'/'+f,src);continue;}
 const cuts=[];const deadNames=new Set();
 const outerSet=new Set(r.outer);const doneDecl=new Set();
 for(const c of r.outer){let s=c.start,e=c.end;if(!c.stmt&&c.declN.declarations.every(dc=>r.outer.some(o=>o.decl===dc))){if(doneDecl.has(c.declN))continue;doneDecl.add(c.declN);cuts.push([c.declN.start,c.declN.end,c.declN.declarations.map(dc=>dc.id.name).join('+')]);continue;}
  if(!c.stmt){// one declarator of several: take it with one comma
   const ds=c.declN.declarations;const i=ds.indexOf(c.decl);if(i<ds.length-1)e=ds[i+1].start;else s=ds[i-1].end;}
  cuts.push([s,e,c.name]);deadNames.add(c);}
 // export properties whose local function was cut
 const cutFns=new Set(r.outer.map(c=>c.fn));const deadAll=new Set(r.dead.map(c=>c.name));
 for(const [M,m] of Object.entries(r.modules)){const props=m.obj.properties;const rm=m.exports.filter(e=>{const cs=r.cands.filter(c=>c.name===e.local);return cs.length&&cs.every(c=>r.dead.includes(c));});
  for(const e of rm){const i=props.indexOf(e.prop);let s=e.prop.start,en=e.prop.end;if(i<props.length-1)en=props[i+1].start;else if(i>0)s=props[i-1].end;cuts.push([s,en,'export '+M+'.'+e.key]);}}
 // merge overlapping cuts (a prop cut and a neighbour prop cut can touch)
 cuts.sort((a,b)=>a[0]-b[0]);const mg=[];for(const c of cuts){const l=mg[mg.length-1];if(l&&c[0]<l[1]){l[1]=Math.max(l[1],c[1]);l[2]+=' + '+c[2];}else mg.push(c.slice());}
 let out='',p=0;for(const [s,e] of mg){out+=src.slice(p,s);p=e;}out+=src.slice(p);
 let ok=true,err='';try{acorn.parse(out,{ecmaVersion:'latest',allowReturnOutsideFunction:true,allowAwaitOutsideFunction:true,sourceType:'script'});}catch(e){ok=false;err=e.message;}
 const d=src.length-out.length;tot+=d;rep[f]={before:src.length,after:out.length,removed:d,parse:ok,err,dead:r.outer.map(c=>c.name+' '+(c.end-c.start)),exportsCut:mg.length-r.outer.length};
 fs.writeFileSync(OUT+'/'+f,ok?out:src);}
fs.writeFileSync(OUT+'.report.json',JSON.stringify(rep,null,1));
const bad=Object.entries(rep).filter(([f,x])=>x.error||x.parse===false);console.log('files',Object.keys(rep).length,'removed (effective sources)',tot,'parse failures',bad.length);bad.forEach(([f,x])=>console.log(' ',f,x.error||x.err));
