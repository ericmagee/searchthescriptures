// W2 grade of pkgPCS: extract the clause reader from the rebuilt sources (live s141 and parent), run both on every CONCEDED LINKS line in the 12 exports.
const fs=require('fs');
const load=p=>{const w=JSON.parse(fs.readFileSync(p,'utf8'));const W=w.data?.workflow||w.data||w;const T=W.nodes.find(x=>x.name=="Shared Library").parameters.jsCode;
 const M=JSON.parse(T.slice(T.lastIndexOf("\n/*MAP*/")+8,T.lastIndexOf("\n/*END*/")));const Lb=JSON.parse(T.slice(T.indexOf("\n/*LIB*/")+8,T.lastIndexOf("\n/*MAP*/")));
 return n=>M[n].p.map(e=>typeof e==="number"?Lb[e]:typeof e[0]==="string"?e[0]:Lb.slice(e[0],e[1]+1).join("\n")).join("\n");};
const L=load('/mnt/project-files/wall2024/fetchback_live_s141.json'),P=load('/mnt/project-files/wall2024/parent_s141_PCS.json');
// find the function that holds the clause loop, by its name, in a node's source
const fnOf=(src,anchor)=>{const k=src.indexOf(anchor);if(k<0)return null;const s=src.lastIndexOf('function ',k);const name=src.slice(s+9,src.indexOf('(',s));
 let d=0,i=src.indexOf('{',src.indexOf(')',s));const st=s;for(;i<src.length;i++){if(src[i]=='{')d++;else if(src[i]=='}'){d--;if(!d)break;}}return {name,code:src.slice(st,i+1)};};
const A='for(const c0 of t.split(';
const out={};
for(const node of ['Gate Record','Panel Cure Check']){for(const [tag,S] of [['live',L],['pcs',P]]){const src=S(node);const f=fnOf(src,A);const dep=[];for(const d of ['ri3Head2024']){const k=src.indexOf('function '+d+'(');if(k>=0)dep.push(fnOf(src,src.slice(k,k+40)).code);else dep.push('function '+d+'(){return null;}');}f.code=dep.join('\n')+'\n'+f.code;out[node+tag]=f;}
 console.log(node,'reader function:',out[node+'live'].name,out[node+'live'].code.length,'->',out[node+'pcs'].code.length);}
const mk=f=>{try{return new Function(f.code+'\nreturn '+f.name+';')();}catch(e){console.log('compile',f.name,e.message);return null;}};
const fns={};for(const k in out)fns[k]=mk(out[k]);
const lines=new Set();for(const f of fs.readdirSync('/mnt/project-files/wall2024/').filter(x=>/^ex\d+_full\.json$/.test(x))){const s=fs.readFileSync('/mnt/project-files/wall2024/'+f,'utf8').replace(/\\+n/g,'\n').replace(/\\+"/g,'"');
 for(const m of s.matchAll(/(?:CHALLENGER )?CONCEDED LINKS:[^\n]{0,500}/g))lines.add(m[0].replace(/"[,}\]].*$/,''));}
console.log('distinct CONCEDED LINKS lines',lines.size);
for(const node of ['Gate Record','Panel Cure Check']){const a=fns[node+'live'],b=fns[node+'pcs'];let ch=0,err=0;
 for(const l of lines){let x,y;try{x=JSON.stringify(a(l));y=JSON.stringify(b(l));}catch(e){err++;continue;}if(x!==y){ch++;console.log(' ['+node+'] '+l.slice(0,230)+'\n    live '+x+'\n    pcs  '+y);}}
 console.log(node,'changed',ch,'errors',err);}
const plants=['CONCEDED LINKS: 0 -- premises 1 and 6 spared, while premises 3 to 5 are spared','CONCEDED LINKS: 1 -- Premise 2: VOID, but premise 4 is spared','CONCEDED LINKS: 0 -- premises 2, 3, and 5 are spared','CONCEDED LINKS: 0 -- premises 1 and 6, and premises 2 to 5, are spared','CONCEDED LINKS: 1 -- premise 3 is UNEXHIBITED, and premises 1, 2 and 4 are spared','CONCEDED LINKS: 0 -- premise 4 is not counted UNEXHIBITED, and premise 5 is VOID','CHALLENGER CONCEDED LINKS: 0 -- VOID: Premise 1 adds "alone", and premise 3 is spared'];
for(const p of plants)for(const node of ['Gate Record','Panel Cure Check'])console.log('PLANT',node,'|',p,'\n   live',JSON.stringify(fns[node+'live'](p)?.g),' pcs',JSON.stringify(fns[node+'pcs'](p)?.g));
