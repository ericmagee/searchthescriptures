// ASK 355 structure checks. Usage: node struct355.cjs <target> <base> <lib.cjs>
const fs=require('fs');const {unpack,rb,declsOnly}=require(process.argv[4]);const acorn=require(require.resolve('acorn',{paths:[require('path').dirname(process.argv[4])]}));
const A=JSON.parse(fs.readFileSync(process.argv[3])),Tw=JSON.parse(fs.readFileSync(process.argv[2]));const ua=unpack(A),ut=unpack(Tw);let n=0,f=0;const ok=(t,c,d)=>{n++;if(!c)f++;console.log((c?'ok   ':'FAIL ')+t+(d?' :: '+d:''));};
const S=JSON.stringify;ok('only the Shared Library node changed',S(Tw.nodes.filter(x=>x.name!=='Shared Library'))===S(A.nodes.filter(x=>x.name!=='Shared Library')));
ok('connections and settings equal',S(Tw.connections)===S(A.connections)&&S(Tw.settings)===S(A.settings));
const ch=ut.L.map((l,i)=>l!==ua.L[i]?i:-1).filter(i=>i>=0);ok('library lines changed are 3198, 3200, 3500 only; line count equal',ch.join()==='3198,3200,3500'&&ut.L.length===ua.L.length,ch.join());
ok('header and tail equal',ut.hdr===ua.hdr&&ut.tail===ua.tail);
ok('every MAP entry rebuilds to its n',Object.entries(ut.M).every(([k,m])=>rb(ut.L,m).length===m.n),Object.keys(ut.M).length+' entries');
ok('MAP layouts (p) unchanged',Object.keys(ut.M).every(k=>S(ut.M[k].p)===S(ua.M[k].p)));
const users=i=>Object.entries(ut.M).filter(([k,m])=>m.p.some(e=>typeof e==='number'?e===i:typeof e[0]!=='string'&&i>=e[0]&&i<=e[1])).map(([k])=>k);
const touched=[...new Set(ch.flatMap(users))];let bad=[];for(const k of touched){try{acorn.parse(rb(ut.L,ut.M[k]),{ecmaVersion:'latest',allowReturnOutsideFunction:true,allowAwaitOutsideFunction:true});}catch(e){bad.push(k+': '+e.message);}}
ok('syntax of every node that holds a changed line',!bad.length,touched.length+' nodes'+(bad.length?' '+bad.join('; '):''));
const txt=JSON.stringify(Tw.nodes.map(x=>x.parameters));const base=JSON.stringify(A.nodes.map(x=>x.parameters));
for(const w of ['max_tokens','temperature','reasoning','effort','thinking'])ok('model setting word "'+w+'": same count as live',(txt.split(w).length)===(base.split(w).length),(base.split(w).length-1)+' -> '+(txt.split(w).length-1));
ok('no operator name added (op doc 0 (7))',(txt.match(/Eric|Magee/gi)||[]).length===(base.match(/Eric|Magee/gi)||[]).length);
console.log('nodes holding changed lines: '+touched.join(', '));
console.log(n+' checks, '+(f?'FAILS '+f:'ALL OK'));
