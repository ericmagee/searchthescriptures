// node pkgSEG/w1_grade/scan.cjs <live> <new> <synthesis dump>   S-E lines live vs new over the stored corpus runs
const fs=require('fs');const F=require('./se_fn.cjs');const L=F(process.argv[2]),N=F(process.argv[3]);
let raw=fs.readFileSync(process.argv[4],'utf8');let j;try{j=JSON.parse(raw);}catch(e){j=null;}
const find=o=>{if(Array.isArray(o)&&o.length&&o[0]&&o[0].run!==undefined&&'syn' in o[0])return o;if(o&&typeof o==='object'){for(const v of Object.values(o)){const r=find(typeof v==='string'&&/^[\[{]/.test(v.trim())?(()=>{try{return JSON.parse(v)}catch(e){return null}})():v);if(r)return r;}}return null;};
if(!j){const m=raw.match(/\[\{"json_agg":(.*)\}\]/s);j=m?JSON.parse(m[1]):null;}
let rows=find(j);if(!rows){const i=raw.indexOf('[{\\"json_agg\\":');const t=raw.slice(i);const e=t.lastIndexOf('}]');rows=find(JSON.parse(JSON.parse('"'+t.slice(0,e+2)+'"')));}
const syn={};for(const r of rows)if(r.run)syn[r.run]=r.syn;
const C='/mnt/project-files/wall2024/pkgWVL/corpus/';const runs={};for(const f of ['corpus_F.json','corpus2_F.json']){const a=JSON.parse(fs.readFileSync(C+f));(Array.isArray(a)?a:Object.values(a)).forEach(x=>{if(x.run)runs[x.run]=x;});}
const f1=JSON.parse(fs.readFileSync(C+'F35856.json'));const x1=(Array.isArray(f1)?f1:Object.values(f1))[0];const k=Object.keys(syn).find(r=>r.startsWith('ODV1-35856'));if(k)runs[k]=x1;
let n=0,lt=0,nt=0,drop=[],add=[];
for(const [run,x] of Object.entries(runs)){if(!syn[run])continue;n++;const d={synthesis:syn[run],cr1:x.cr1,cr2:x.cr2,cr3:x.cr3,cr4:x.cr4,gr1:x.gr1,gr2:x.gr2,dr3:x.dr3,dr4:x.dr4};
 const a=L(d),b=N(d);lt+=a.length;nt+=b.length;for(const l of a)if(!b.includes(l)){const t=l.replace(/\s*\([^)]*\)/,'');if(!b.some(y=>y.replace(/\s*\([^)]*\)/,'')===t))drop.push(run+' '+l);}
 for(const l of b)if(!a.some(y=>y.replace(/\s*\([^)]*\)/,'')===l.replace(/\s*\([^)]*\)/,'')))add.push(run+' '+l);}
console.log('runs with synthesis',n,'| S-E lines live',lt,'new',nt);console.log('DROPPED BY NEW:');drop.forEach(l=>console.log(' - '+l));console.log('ADDED BY NEW:');add.forEach(l=>console.log(' + '+l));
