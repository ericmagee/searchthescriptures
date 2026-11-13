// W2 pkgMUS: operator 20:34 CST 11-12 (W3 thread): "add meta/muse-spark-1.3 and meta/muse-ember to alternate list. make muse-ember the first alternate, then hydrogen".
// Seats ember (meta/muse-ember) and spark (meta/muse-spark-1.3), family meta. Alternate order (ORDER0 governs; __ALT is membership):
// ember, hydrogen, grok, argon, haiku, spark. Spark's place is not in the operator's words: proposed last, for his confirmation.
// Every __orc copy sends reasoning effort low for both models (as hydrogen), unless the body already sets reasoning.
// usage: node pkgMUS/build.cjs <parent in> <parent out>
const fs=require('fs');const [,,fin,fout]=process.argv;const raw=JSON.parse(fs.readFileSync(fin,'utf8'));const W=(raw.data||raw).workflow||(raw.data||raw);
const E={
 'Init Seats':[
  ["const ORDER0=['chatgpt','sol','luna','grok','hydrogen','argon','haiku','qwen'];","const ORDER0=['chatgpt','sol','luna','ember','hydrogen','grok','argon','haiku','spark','qwen'];"],
  ["hydrogen:'google',argon:'google'};","hydrogen:'google',argon:'google',ember:'meta',spark:'meta'};"],
  ["const __ALT=['grok','hydrogen','argon','haiku'];","const __ALT=['ember','hydrogen','grok','argon','haiku','spark'];"],
  ["argon:'openrouter',hydrogen:'openrouter'};\nconst ALT_ORDER","argon:'openrouter',hydrogen:'openrouter',ember:'openrouter',spark:'openrouter'};\nconst ALT_ORDER"]],
 'Resolve Seats':[["argon:'openrouter',hydrogen:'openrouter'};\nconst judges","argon:'openrouter',hydrogen:'openrouter',ember:'openrouter',spark:'openrouter'};\nconst judges"]],
 'Accept Build':[
  ["argon:'argon',hydrogen:'hydrogen'};","argon:'argon',hydrogen:'hydrogen',ember:'ember',spark:'spark'};"],
  ["const ORDER=['chatgpt','sol','luna','grok','hydrogen','argon','haiku','qwen'];","const ORDER=['chatgpt','sol','luna','ember','hydrogen','grok','argon','haiku','spark','qwen'];"]]};
let d=0;for(const [nm,eds] of Object.entries(E)){const n=W.nodes.find(x=>x.name===nm);let s=n.parameters.jsCode;const s0=s;
 for(const [a,b] of eds){const c=s.split(a).length-1;if(c!==1)throw new Error(nm+': anchor found '+c+' times: '+a.slice(0,60));s=s.replace(a,b);}
 n.parameters.jsCode=s;d+=s.length-s0.length;console.log(nm,'+'+(s.length-s0.length));}
const A="if(/^google\\/gemini-4-hydrogen$/.test(String(model))",B="if(/^(?:google\\/gemini-4-hydrogen|meta\\/muse-ember|meta\\/muse-spark-1\\.3)$/.test(String(model))";
let cnt=0;for(const n of W.nodes){if(n.name==='Shared Library'||typeof n.parameters?.jsCode!=='string')continue;let s=n.parameters.jsCode;const k=(s.match(/const __orc=\(/g)||[]).length;if(!k)continue;
 const c=s.split(A).length-1;if(c!==k)throw new Error(n.name+': __orc defs '+k+' anchors '+c);const s0=s;s=s.split(A).join(B);n.parameters.jsCode=s;d+=s.length-s0.length;cnt+=k;}
for(const nm of ['Init Seats','Resolve Seats','Accept Build',...W.nodes.filter(n=>/const __orc=\(/.test(n.parameters?.jsCode||'')&&n.name!=='Shared Library').map(n=>n.name)])new Function('$','$input','$execution','return (async()=>{'+W.nodes.find(x=>x.name===nm).parameters.jsCode+'})');
const N=W.nodes.find(n=>n.name==='Shared Library');const T=N.parameters.jsCode;
const a=T.indexOf('\n/*LIB*/'),b=T.lastIndexOf('\n/*MAP*/'),c=T.lastIndexOf('\n/*END*/');const Lb=JSON.parse(T.slice(a+8,b)),M=JSON.parse(T.slice(b+8,c));
let li=0;Lb.forEach((l,i)=>{if(/const __orc=\(/.test(l)){if(l.split(A).length-1!==1)throw new Error('lib line '+i);Lb[i]=l.replace(A,B);li++;console.log('Shared Library line',i);}});
if(li!==1)throw new Error('lib __orc lines '+li);
const reb=e=>M[e].p.map(x=>typeof x==='number'?Lb[x]:typeof x[0]==='string'?x[0]:Lb.slice(x[0],x[1]+1).join('\n')).join('\n');for(const e in M)M[e].n=reb(e).length;
const LJ=JSON.stringify(Lb);N.parameters.jsCode=(T.slice(0,a+8)+LJ+T.slice(b,b+8)+JSON.stringify(M)+T.slice(c)).replace(/(\/\/ library sha )[0-9a-f]{16}/,(x,h)=>h+require('crypto').createHash('sha256').update(LJ).digest('hex').slice(0,16));
d+=N.parameters.jsCode.length-T.length;
fs.writeFileSync(fout,JSON.stringify(raw));
console.log('plain __orc copies',cnt,'| sha',N.parameters.jsCode.match(/library sha ([0-9a-f]{16})/)[1]);
console.log('SIZE (measured): code +'+d+' | prompt text 0');
