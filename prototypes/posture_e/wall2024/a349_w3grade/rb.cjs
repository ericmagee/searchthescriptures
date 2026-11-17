const fs=require('fs');
function lib(f){const w=JSON.parse(fs.readFileSync(f));const N={};for(const n of w.nodes)N[n.name]=n;
 const T=N['Shared Library'].parameters.jsCode;
 const L=JSON.parse(T.slice(T.indexOf('\n/*LIB*/')+8,T.lastIndexOf('\n/*MAP*/')));
 const M=JSON.parse(T.slice(T.lastIndexOf('\n/*MAP*/')+8,T.lastIndexOf('\n/*END*/')));
 const out={};for(const k in M){const m=M[k];const S=m.p.map(e=>typeof e==='number'?L[e]:typeof e[0]==='string'?e[0]:L.slice(e[0],e[1]+1).join('\n')).join('\n');out[k]={S,n:m.n};}
 const plain={};for(const n of w.nodes){const c=n.parameters&&n.parameters.jsCode;if(typeof c==='string'&&n.name!=='Shared Library'&&!c.includes("$('Shared Library').params.jsCode"))plain[n.name]=c;}
 return {out,plain};}
const a=lib('live.json'),b=lib('target.json');
let bad=0;
for(const k in b.out){const {S,n}=b.out[k];
  const lenok=S.length===n; let syn='ok';try{new Function('$','$input','return (async()=>{\n'+S+'\n})();');}catch(e){syn='SYNTAX '+e.message}
  const changed=a.out[k].S!==S;
  if(!lenok||syn!=='ok')bad++;
  if(changed||!lenok||syn!=='ok')console.log('LIB',k,'changed',changed,'len',S.length,'n',n,lenok?'':'LEN MISMATCH',syn);}
for(const k in b.plain){if(a.plain[k]===b.plain[k])continue;let syn='ok';try{new Function('$','$input','return (async()=>{\n'+b.plain[k]+'\n})();');}catch(e){syn='SYNTAX '+e.message;bad++}console.log('NODE',k,syn);}
console.log('library entries',Object.keys(b.out).length,'bad',bad);
fs.writeFileSync('rebuilt.json',JSON.stringify({live:Object.fromEntries(Object.entries(a.out).map(([k,v])=>[k,v.S])),tgt:Object.fromEntries(Object.entries(b.out).map(([k,v])=>[k,v.S])),lp:a.plain,tp:b.plain}));
