// pkgAJN: run every stub node (up to its own length check) against the live and the target library. Each must pass its length check
// on target and parse; the rebuilt source may differ from live only by the two ABS joins. Other nodes and connections byte-identical.
// Header library sha must match the /*LIB*/ text. usage: node stubtest.cjs <live json> <target json>
const fs=require('fs'),vm=require('vm'),crypto=require('crypto');
const get=f=>{const r=JSON.parse(fs.readFileSync(f,'utf8'));return (r.data||r).workflow||(r.data||r);};
const A=get(process.argv[2]),B=get(process.argv[3]);let pass=0,fail=0;
const t=(n,f)=>{try{const g=f();pass++;console.log('PASS '+n+(g?' -> '+g:''));}catch(e){fail++;console.log('FAIL '+n+' -> '+e.message);}};
const lib=W=>W.nodes.find(n=>n.name==='Shared Library').parameters.jsCode;
const MARK=c=>{const j=c.indexOf('if(__S.length!==__N)throw');return j<0?-1:c.indexOf('\n',j);};
const stubs=A.nodes.filter(n=>n.type==='n8n-nodes-base.code'&&/\$\('Shared Library'\)/.test(n.parameters.jsCode||'')&&n.name!=='Shared Library');
const run=(stub,L)=>{const i=MARK(stub);if(i<0)throw new Error('no stub marker');return new Function('$',stub.slice(0,i)+'\nreturn __S;')(n=>{if(n!=='Shared Library')throw new Error('read '+n);return {params:{jsCode:L}};});};
const PAIRS=[["return m?(m[1]+' '+(m[3]||'')):L;","return m?(m[1]+' || '+(m[3]||'')):L;"],["(to.match(AQ)?(to.match(AQ)[1]+' '+(to.match(AQ)[3]||'')):to)","(to.match(AQ)?(to.match(AQ)[1]+' || '+(to.match(AQ)[3]||'')):to)"]];
t('nodes other than Shared Library and the connections are byte-identical',()=>{if(A.nodes.length!==B.nodes.length)throw new Error('count');A.nodes.forEach((n,i)=>{if(n.name!=='Shared Library'&&JSON.stringify(n)!==JSON.stringify(B.nodes[i]))throw new Error(n.name);});if(JSON.stringify(A.connections)!==JSON.stringify(B.connections))throw new Error('conn');return A.nodes.length+' nodes';});
let changed=[];
for(const s of stubs)t('stub '+s.name,()=>{const a=run(s.parameters.jsCode,lib(A)),b=run(s.parameters.jsCode,lib(B));new vm.Script('(async()=>{\n'+b+'\n})();',{filename:s.name});
 let x=a;for(const [o,n] of PAIRS)x=x.split(o).join(n);if(x!==b)throw new Error('differs beyond the edits');if(a!==b)changed.push(s.name);return a.length+' -> '+b.length;});
t('stub count is 46',()=>{if(stubs.length!==46)throw new Error(stubs.length);});
t('rebuilt source changed in exactly the 6 send-back nodes',()=>{const want=['Alt Send Back Build','Alt Send Back Record','R2 Alt Send Back Build','R2 Alt Send Back Record','Send Back Build','Send Back Record'];const g=changed.slice().sort();if(JSON.stringify(g)!==JSON.stringify(want.sort()))throw new Error(JSON.stringify(g));return g.length;});
t('header library sha matches its /*LIB*/ text',()=>{const T=lib(B);const j=T.slice(T.indexOf('\n/*LIB*/')+8,T.lastIndexOf('\n/*MAP*/'));const h=crypto.createHash('sha256').update(j).digest('hex').slice(0,16);if(!T.includes('// library sha '+h+','))throw new Error(h);return h;});
console.log('\n'+pass+' pass, '+fail+' fail');process.exit(fail?1:0);
