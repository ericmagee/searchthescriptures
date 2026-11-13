// W2 pkgHYD rev 2 (ASK 149 option 1; W4 Wall 5513: hydrogen passed its check only at reasoning effort low).
// Rev 1 (build.cjs: alternate order grok, hydrogen, argon, haiku) plus: every request-body finisher __orc sends
// "reasoning":{"effort":"low"} for google/gemini-4-hydrogen only, unless the body already sets reasoning. max_tokens is unchanged.
// __orc copies: every plain node that defines it, and the Shared Library line (MAP lengths and header sha recomputed, as pkgKNC).
// usage: node pkgHYD/build2.cjs <parent in> <parent out>
const fs=require('fs');const cp=require('child_process');const [,,fin,fout]=process.argv;const tmp=fout+'.rev1.json';
console.log(cp.execFileSync('node',[__dirname+'/build.cjs',fin,tmp]).toString().trim());
const raw=JSON.parse(fs.readFileSync(tmp,'utf8'));fs.unlinkSync(tmp);const W=(raw.data||raw).workflow||(raw.data||raw);
const A="const o={...b,session_id:String(key).slice(0,128)};",B=A+"if(/^google\\/gemini-4-hydrogen$/.test(String(model))&&!o.reasoning)o.reasoning={effort:'low'};";
const DEF=/const __orc=\(/g;let d=0,cnt=0;
for(const n of W.nodes){if(n.name==='Shared Library'||typeof n.parameters?.jsCode!=='string')continue;let s=n.parameters.jsCode;const k=(s.match(DEF)||[]).length;if(!k)continue;
 const c=s.split(A).length-1;if(c!==k)throw new Error(n.name+': __orc defs '+k+' anchors '+c);const s0=s;s=s.split(A).join(B);
 new Function('$','$input','$execution','return (async()=>{'+s+'})');n.parameters.jsCode=s;d+=s.length-s0.length;cnt+=k;console.log(n.name,'+'+(s.length-s0.length));}
const N=W.nodes.find(n=>n.name==='Shared Library');const T=N.parameters.jsCode;
const a=T.indexOf('\n/*LIB*/'),b=T.lastIndexOf('\n/*MAP*/'),c=T.lastIndexOf('\n/*END*/');const Lb=JSON.parse(T.slice(a+8,b)),M=JSON.parse(T.slice(b+8,c));
let li=0;Lb.forEach((l,i)=>{if(/const __orc=\(/.test(l)){if(l.split(A).length-1!==1)throw new Error('lib line '+i);Lb[i]=l.replace(A,B);li++;console.log('Shared Library line',i);}});
if(li!==1)throw new Error('lib __orc lines '+li);
const reb=e=>M[e].p.map(x=>typeof x==='number'?Lb[x]:typeof x[0]==='string'?x[0]:Lb.slice(x[0],x[1]+1).join('\n')).join('\n');for(const e in M)M[e].n=reb(e).length;
const LJ=JSON.stringify(Lb);N.parameters.jsCode=(T.slice(0,a+8)+LJ+T.slice(b,b+8)+JSON.stringify(M)+T.slice(c)).replace(/(\/\/ library sha )[0-9a-f]{16}/,(x,h)=>h+require('crypto').createHash('sha256').update(LJ).digest('hex').slice(0,16));
const dl=N.parameters.jsCode.length-T.length;d+=dl;
fs.writeFileSync(fout,JSON.stringify(raw));
console.log('plain __orc copies',cnt,'| Shared Library jsCode +'+dl,'sha',N.parameters.jsCode.match(/library sha ([0-9a-f]{16})/)[1]);
console.log('SIZE rev 2 over rev 1 (measured): code +'+d+' | prompt text 0');
