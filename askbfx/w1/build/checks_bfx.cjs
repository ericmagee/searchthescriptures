// pkgBFX build checks C3, C4 (W1).
const fs=require('fs');const S=JSON.stringify;const out=[];const ok=(n,c,i)=>out.push((c?'PASS ':'FAIL ')+n+(i?' -- '+i:''));
const ld=f=>{const d=JSON.parse(fs.readFileSync(__dirname+'/'+f));const T=d.nodes.find(n=>n.name==='Shared Library').parameters.jsCode;return {d,T,L:JSON.parse(T.slice(T.indexOf('\n/*LIB*/')+8,T.lastIndexOf('\n/*MAP*/'))),M:JSON.parse(T.slice(T.lastIndexOf('\n/*MAP*/')+8,T.lastIndexOf('\n/*END*/')))};};
const LE=ld('live_moMxiV4Irg1uRBZN.json'),LC=ld('live_MqQHRl7mQQ0z8QdT.json'),E=ld('target_engine_bfx.json'),C=ld('target_child_bfx.json');
ok('C3 engine and child library arrays equal (the MAP differs by node set: engine '+Object.keys(E.M).length+', child '+Object.keys(C.M).length+' entries, as live: '+Object.keys(LE.M).length+'/'+Object.keys(LC.M).length+')',S(E.L)===S(C.L)&&Object.keys(E.M).every(k=>!(k in C.M)||S(E.M[k])===S(C.M[k])));
for(const [nm,A,B] of [['engine',LE,E],['child',LC,C]]){
 const NA={},NB={};A.d.nodes.forEach(x=>NA[x.name]=x);B.d.nodes.forEach(x=>NB[x.name]=x);
 const ch=Object.keys(NA).filter(k=>S(NA[k])!==S(NB[k]));
 ok('C4 '+nm+': same nodes and connections; only Shared Library changes',Object.keys(NA).length===Object.keys(NB).length&&S(A.d.connections)===S(B.d.connections)&&S(ch)===S(['Shared Library']),ch.join(', '));
 const dl=B.L.map((x,i)=>x!==A.L[i]?i:-1).filter(i=>i>=0);ok('C4 '+nm+': library lines differing from live = index 466 (line 467) and new 3566',S(dl)===S([466,3566])&&B.L.length===A.L.length+1,S(dl));
 const mk=Object.keys(B.M).filter(k=>S(B.M[k])!==S(A.M[k]));ok('C4 '+nm+': 15 MAP entries change',mk.length===15,mk.join(', '));
 const src=(L,p)=>p.map(x=>typeof x==='number'?L[x]:typeof x[0]==='string'?x[0]:L.slice(x[0],x[1]+1).join('\n')).join('\n');
 let bad=[],nolen=[],nodef=[];for(const k of Object.keys(B.M)){const s=src(B.L,B.M[k].p);if(s.length!==B.M[k].n)nolen.push(k);try{new Function('$','$input','$json','$items','$node','$execution','$workflow','items',`return (async()=>{${s}\n})`);}catch(e){bad.push(k+': '+e.message);}
  if(mk.includes(k)){if(!/\nfunction bfx544Block\(round,j\)\{/.test(s)||!s.includes('if(!bfx544Block(R[rk],j))'))nodef.push(k);
   const dfn=new Function(s.match(/function bfx544Block\(round,j\)\{[^\n]*?\}(?= \/\*)/)[0]+';return bfx544Block;')();if(typeof dfn!=='function')nodef.push(k);}}
 ok('C3 '+nm+': every MAP entry ('+Object.keys(B.M).length+') rebuilds to its n',nolen.length===0,nolen.join(', '));
 ok('C3 '+nm+': every MAP entry compiles',bad.length===0,bad.join(' | '));
 ok('C3 '+nm+': each of the 15 rebuilt stubs defines bfx544Block and the range test calls it',nodef.length===0,nodef.join(', '));}
fs.writeFileSync(__dirname+'/out_checks_bfx.txt',out.join('\n')+'\n');console.log(out.join('\n'));
