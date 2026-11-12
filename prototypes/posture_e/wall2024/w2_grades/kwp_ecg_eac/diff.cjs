// W2: map and rebuilt-source diff of a parent against live s148
const fs=require('fs');const D='/mnt/project-files/wall2024/';const ld=f=>{const X=JSON.parse(fs.readFileSync(D+f,'utf8'));return X.data&&X.data.nodes?X.data:X;};
const libOf=W=>W.nodes.find(n=>n.name==='Shared Library').parameters.jsCode;
const src=(W,n)=>{const st=(W.nodes.find(x=>x.name===n)||{}).parameters;if(!st||!st.jsCode)return null;const stub=st.jsCode;let i=stub.indexOf('\nreturn await new Function(');if(i<0)i=stub.indexOf('\nconst __e4h');if(i<0)return stub;try{return new Function('$',stub.slice(0,i)+'\nreturn __S;')(q=>({params:{jsCode:libOf(W)}}));}catch(e){return 'REBUILD ERROR '+e.message;}};
module.exports={ld,src,libOf};
if(require.main===module){const L=ld('fetchback_live_s148.json'),P=ld(process.argv[2]);
 console.log('nodes',L.nodes.length,P.nodes.length);const by=w=>Object.fromEntries(w.nodes.map(n=>[n.name,n]));const bl=by(L),bp=by(P);
 for(const n in bp)if(!bl[n])console.log('NEW',n);for(const n in bl)if(!bp[n])console.log('GONE',n);
 const ce=w=>JSON.stringify(w.connections);console.log('connections equal',ce(L)===ce(P));
 let code=0;for(const n in bp)if(bl[n]){const a=(bl[n].parameters.jsCode||''),b=(bp[n].parameters.jsCode||'');code+=b.length-a.length;if(JSON.stringify(bl[n])!==JSON.stringify(bp[n]))console.log('CHANGED node',n,b.length-a.length);}
 console.log('jsCode total',code);
 const all=new Set([...L.nodes,...P.nodes].filter(n=>n.type==='n8n-nodes-base.code').map(n=>n.name));let ch=0;
 for(const n of all){const a=src(L,n),b=src(P,n);if(a===b)continue;ch++;const A=new Set((a||'').split('\n')),B=new Set((b||'').split('\n'));console.log('## rebuilt',n,(b||'').length-(a||'').length);
  if(process.argv[3])for(const l of (b||'').split('\n'))if(!A.has(l))console.log('  +',l.slice(0,+process.argv[3]));if(process.argv[3])for(const l of (a||'').split('\n'))if(!B.has(l))console.log('  -',l.slice(0,+process.argv[3]));}
 console.log('rebuilt sources changed',ch);}
