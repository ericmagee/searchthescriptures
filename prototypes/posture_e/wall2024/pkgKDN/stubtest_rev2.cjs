// pkgKDN rev 2 stub test (W2: first pair = the antecedent edit) (adapted from pkgAJN stubtest.cjs): every stub node rebuilt from live and target library passes its own length check
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
const PAIRS=[["let s=kwiCut2024(t,m.index);","let s=kwiCut2024(t,m.index);if(/do\\s+not\\s+rest$/i.test(m[0])&&/^\\s+(?:[^\\s.!?]+\\s+){0,4}?on\\s+(?:it|them|this|that|these|those|either|both|one)\\b[^.!?\\n]{0,60}[.!?]?[\"\\u201d']?\\s*$|^\\s+on\\s*[.!?]?[\"\\u201d']?\\s*$/i.test(s.slice(m[0].length))){const tl=(x,n)=>x.length>n?x.slice(x.length-n).replace(/^\\S*\\s+/,''):x;const bd=x=>Math.max(t.lastIndexOf('\\n',x-1)+1,...[...t.slice(0,x).matchAll(/[.!?][\"\\u201d']?\\s+/g)].map(z=>z.index+z[0].length));const l0=bd(m.index);const own=t.slice(l0,m.index);if(/[A-Za-z0-9]/.test(own))s=(tl(own,Math.max(0,300-s.length))+s).trim();else{let q=l0;while(q>0&&/\\s/.test(t[q-1]))q--;const pv=q>0?t.slice(bd(q-1),q).trim():'';if(/[A-Za-z0-9]/.test(pv))s=(tl(pv,Math.max(0,300-s.length))+' '+s).trim();}}/* pkgKDN: name what \"it\" is */"],["no\\s+longer\\s+rest","no\\s+longer\\s+rest|do\\s+not\\s+rest"]];
t('nodes other than Shared Library and the connections are byte-identical',()=>{if(A.nodes.length!==B.nodes.length)throw new Error('count');A.nodes.forEach((n,i)=>{if(n.name!=='Shared Library'&&JSON.stringify(n)!==JSON.stringify(B.nodes[i]))throw new Error(n.name);});if(JSON.stringify(A.connections)!==JSON.stringify(B.connections))throw new Error('conn');return A.nodes.length+' nodes';});
let changed=[];
for(const s of stubs)t('stub '+s.name,()=>{const a=run(s.parameters.jsCode,lib(A)),b=run(s.parameters.jsCode,lib(B));new vm.Script('(async()=>{\n'+b+'\n})();',{filename:s.name});
 let x=a;for(const [o,n] of PAIRS)x=x.split(o).join(n);if(x!==b)throw new Error('differs beyond the edits');if(a!==b)changed.push(s.name);return a.length+' -> '+b.length;});
t('stub count is 46',()=>{if(stubs.length!==46)throw new Error(stubs.length);});
t('rebuilt source changed in exactly the 4 K-W reader nodes',()=>{const want=['Alternate Payloads','Extract Independent Verdict','Panel Payloads','R2 Alternate Payloads'];const g=changed.slice().sort();if(JSON.stringify(g)!==JSON.stringify(want.sort()))throw new Error(JSON.stringify(g));return g.length;});
t('header library sha matches its /*LIB*/ text',()=>{const T=lib(B);const j=T.slice(T.indexOf('\n/*LIB*/')+8,T.lastIndexOf('\n/*MAP*/'));const h=crypto.createHash('sha256').update(j).digest('hex').slice(0,16);if(!T.includes('// library sha '+h+','))throw new Error(h);return h;});
console.log('\n'+pass+' pass, '+fail+' fail');process.exit(fail?1:0);
