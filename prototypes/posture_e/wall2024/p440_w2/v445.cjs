const fs=require('fs'),z=require('zlib'),cr=require('crypto');
const rd=p=>{let w=JSON.parse(z.gunzipSync(fs.readFileSync(p)));if(w.data&&w.data.nodes)w=w.data;return w;};
const T={'443':'a443_w4/t443_eng.json.gz','444 A2':'a444_w4/t444a2_eng.json.gz','455':'a455_w4/t455_eng.json.gz','456':'a8456_w2/engine_target.json.gz'};
const S=rd('astk_w4/stack2_eng.json.gz');
const h=o=>cr.createHash('md5').update(JSON.stringify(o)).digest('hex');
const nm=w=>Object.fromEntries(w.nodes.map(n=>[n.name,h({p:n.parameters,t:n.type})]));
const W=Object.fromEntries(Object.entries(T).map(([k,p])=>[k,rd(p)]));
const N=Object.fromEntries(Object.entries(W).map(([k,w])=>[k,nm(w)]));
const names=new Set([].concat(...Object.values(N).map(Object.keys),Object.keys(nm(S))));
const C={};for(const k in N)C[k]=[];
const base={};
for(const n of names){const vals=Object.keys(N).map(k=>N[k][n]||'ABSENT');const cnt={};vals.forEach(v=>cnt[v]=(cnt[v]||0)+1);
 const top=Object.entries(cnt).sort((a,b)=>b[1]-a[1])[0];base[n]=top[1]>=2?top[0]:'NOBASE';
 for(const k in N)if((N[k][n]||'ABSENT')!==base[n])C[k].push(n);}
let ok=true;
for(const k in C){console.log('package',k,'changes',C[k].length,'nodes:',C[k].join(', '));}
const all=[].concat(...Object.values(C));const dup=all.filter((x,i)=>all.indexOf(x)!==i);console.log('nodes changed by two packages:',dup.length?dup.join(', '):'none');if(dup.length)ok=false;
const SN=nm(S);let bad=[];
for(const n of names){let want=base[n];for(const k in C)if(C[k].includes(n))want=N[k][n];if((SN[n]||'ABSENT')!==want)bad.push(n);}
console.log('stack2 = base + every package\'s own nodes:',bad.length?'NO '+bad.join(','):'yes ('+names.size+' node names)');if(bad.length)ok=false;
const cn=w=>h(w.connections);const cb={};Object.keys(W).forEach(k=>{cb[cn(W[k])]=(cb[cn(W[k])]||[]).concat(k)});
console.log('connection sets among targets:',JSON.stringify(Object.values(cb)),'| stack2 connections equal t443:',cn(S)===cn(W['443']));
for(const k in C){const rev={};for(const n of names){if(C[k].includes(n))rev[n]=base[n];else rev[n]=SN[n];}
 const miss=C[k].filter(n=>base[n]==='ABSENT');
 console.log('revert',k,': restore',C[k].length,'nodes from the other targets'+(miss.length?'; '+miss.length+' node(s) absent in base (added by the package, revert removes them): '+miss.join(','):''));}
console.log(ok?'RESULT: each package is separable; its revert is the stack with its own nodes set back to base':'RESULT: NOT separable');
