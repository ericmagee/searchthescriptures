const fs=require('fs');const ex=f=>{const o=JSON.parse(fs.readFileSync(f,'utf8')).result;const a=o.indexOf('\n[{'),b=o.lastIndexOf('}]\n');return JSON.parse(o.slice(a+1,b+2));};
const [nbf,rf,libf]=process.argv.slice(2);
const r0=ex(nbf)[0];const R=JSON.parse(ex(rf)[0].rounds);const SRC=Object.values(R).filter(v=>typeof v==='string').join('\n');
const lib=f=>{const j=JSON.parse(fs.readFileSync(f));const L=j.nodes.find(n=>n.name==='Shared Library').parameters.jsCode;const a=L.indexOf('\n/*LIB*/'),b=L.lastIndexOf('\n/*MAP*/'),c=L.lastIndexOf('\n/*END*/');const Lb=JSON.parse(L.slice(a+8,b)),M=JSON.parse(L.slice(b+8,c));
 const reb=e=>M[e].p.map(x=>typeof x==='number'?Lb[x]:typeof x[0]==='string'?x[0]:Lb.slice(x[0],x[1]+1).join('\n')).join('\n');
 const e=Object.keys(M).find(e=>{const t=reb(e);return t.includes('function krulQs(')&&t.includes('function krulNorm(')});const t=reb(e);
 const g=(nm,end)=>{const i=t.indexOf('function '+nm+'(');const k=t.indexOf(end,i);return t.slice(i,k);};
 const src=g('krulNorm','\nfunction krulFound')+'\n'+g('krulFound','\nfunction krulText')+'\n'+g('krulQs','\nfunction krulCheckCard');
 return {stub:e,...new Function(src+'\nreturn {krulFound,krulQs,krulNorm};')()};};
const O=lib(libf+'/live_un.json'),N=lib(libf+'/new_un.json');
const lines=(r0.nb||'').split('\n').filter(x=>x.trim());let q=0,diff=[];const res={of:0,nf:0};
for(const l of lines){const qs=O.krulQs(l);const qs2=N.krulQs(l);if(JSON.stringify(qs)!==JSON.stringify(qs2))diff.push('krulQs differs: '+l.slice(0,100));
 for(const x of qs){q++;const a=O.krulFound(x,SRC),b=N.krulFound(x,SRC);if(a)res.of++;if(b)res.nf++;if(a!==b)diff.push((a?'found->MISS':'MISS->found')+' '+JSON.stringify(x.slice(0,140)));}}
console.log('src chars',SRC.length,'(sql said',r0.src+')','judgments',r0.nj,'NAMED BY lines',lines.length,'quotes',q,'found old',res.of,'found new',res.nf);console.log(diff.join('\n')||'no change');
console.log('NAMED BY line lengths',lines.map(l=>l.length).join(','),'| stub used',O.stub);
const q33990='[CR4] I keep D1 to D6 exactly as declared. I narrow nothing, concede nothing and restore nothing.';
console.log('row 33990 quote: old',O.krulFound(q33990,SRC),'new',N.krulFound(q33990,SRC));
console.log('label-bearing quotes', lines.flatMap(l=>O.krulQs(l)).filter(x=>/\[[cdg]r\d\]|\b[cdg]r\d\b/i.test(x)).length);
