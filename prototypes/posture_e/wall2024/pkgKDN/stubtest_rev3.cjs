// pkgKDN rev 3 stub test (W3; parent = rev 2 target; the edit pairs are the 4 whole kwLines421 lines that rev 3 changes)
// was: pkgKDN rev 2 stub test (W2: first pair = the antecedent edit) (adapted from pkgAJN stubtest.cjs): every stub node rebuilt from live and target library passes its own length check
// and parses; the rebuilt source differs from live only by the K-W verb edit. Other nodes and connections byte-identical.
// Header library sha must match the /*LIB*/ text. usage: node stubtest.cjs <live json> <target json>
const fs=require('fs'),vm=require('vm'),crypto=require('crypto');
const get=f=>{const r=JSON.parse(fs.readFileSync(f,'utf8'));return (r.data||r).workflow||(r.data||r);};
const A=get(process.argv[2]),B=get(process.argv[3]);let pass=0,fail=0;
const t=(n,f)=>{try{const g=f();pass++;console.log('PASS '+n+(g?' -> '+g:''));}catch(e){fail++;console.log('FAIL '+n+' -> '+e.message);}};
const lib=W=>W.nodes.find(n=>n.name==='Shared Library').parameters.jsCode;
const MARK=c=>{const j=c.indexOf('if(__S.length!==__N)throw');return j<0?-1:c.indexOf('\n',j);};
const stubs=A.nodes.filter(n=>n.type==='n8n-nodes-base.code'&&/\$\('Shared Library'\)/.test(n.parameters.jsCode||'')&&n.name!=='Shared Library');
const run=(stub,L)=>{const i=MARK(stub);if(i<0)throw new Error('no stub marker');return new Function('$',stub.slice(0,i)+'\nreturn __S;')(n=>{if(n!=='Shared Library')throw new Error('read '+n);return {params:{jsCode:L}};});};
const {parseLib}=require(__dirname+'/rebuild.cjs');const LA=parseLib(lib(A)).L,LB=parseLib(lib(B)).L;if(LA.length!==LB.length)throw new Error('line count');const PAIRS=[];LA.forEach((l,i)=>{if(l!==LB[i])PAIRS.push([l,LB[i]]);});console.log('library lines changed: '+LA.map((l,i)=>l!==LB[i]?i:-1).filter(i=>i>=0).join(', '));
t('nodes other than Shared Library and the connections are byte-identical',()=>{if(A.nodes.length!==B.nodes.length)throw new Error('count');A.nodes.forEach((n,i)=>{if(n.name!=='Shared Library'&&JSON.stringify(n)!==JSON.stringify(B.nodes[i]))throw new Error(n.name);});if(JSON.stringify(A.connections)!==JSON.stringify(B.connections))throw new Error('conn');return A.nodes.length+' nodes';});
let changed=[];
for(const s of stubs)t('stub '+s.name,()=>{const a=run(s.parameters.jsCode,lib(A)),b=run(s.parameters.jsCode,lib(B));new vm.Script('(async()=>{\n'+b+'\n})();',{filename:s.name});
 let x=a;for(const [o,n] of PAIRS)x=x.split(o).join(n);if(x!==b)throw new Error('differs beyond the edits');if(a!==b)changed.push(s.name);return a.length+' -> '+b.length;});
t('stub count is 46',()=>{if(stubs.length!==46)throw new Error(stubs.length);});
t('rebuilt source changed in exactly the 4 K-W reader nodes',()=>{const want=['Alternate Payloads','Extract Independent Verdict','Panel Payloads','R2 Alternate Payloads'];const g=changed.slice().sort();if(JSON.stringify(g)!==JSON.stringify(want.sort()))throw new Error(JSON.stringify(g));return g.length;});
t('header library sha matches its /*LIB*/ text',()=>{const T=lib(B);const j=T.slice(T.indexOf('\n/*LIB*/')+8,T.lastIndexOf('\n/*MAP*/'));const h=crypto.createHash('sha256').update(j).digest('hex').slice(0,16);if(!T.includes('// library sha '+h+','))throw new Error(h);return h;});
console.log('\n'+pass+' pass, '+fail+' fail');process.exit(fail?1:0);
