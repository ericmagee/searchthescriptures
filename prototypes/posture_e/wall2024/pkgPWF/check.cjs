// pkgPWF check: every stub node rebuilds and parses on the target library; only the 6 send-back stubs change; all other nodes and the
// connections are byte-identical; the header sha matches the /*LIB*/ text. usage: node check.cjs <live s191 json> <target json>
const fs=require('fs'),vm=require('vm'),crypto=require('crypto');
const get=f=>{const r=JSON.parse(fs.readFileSync(f,'utf8'));return (r.data||r).workflow||(r.data||r);};
const A=get(process.argv[2]),B=get(process.argv[3]);const lib=W=>W.nodes.find(n=>n.name==='Shared Library').parameters.jsCode;let f=[];
const MARK=c=>{const j=c.indexOf('if(__S.length!==__N)throw');return j<0?-1:c.indexOf('\n',j);};
const run=(stub,L)=>{const i=MARK(stub);if(i<0)throw new Error('no stub marker');return new Function('$',stub.slice(0,i)+'\nreturn __S;')(n=>{if(n!=='Shared Library')throw new Error('read '+n);return {params:{jsCode:L}};});};
if(A.nodes.length!==B.nodes.length)f.push('node count');A.nodes.forEach((n,i)=>{if(n.name!=='Shared Library'&&JSON.stringify(n)!==JSON.stringify(B.nodes[i]))f.push('changed '+n.name);});
if(JSON.stringify(A.connections)!==JSON.stringify(B.connections))f.push('connections');
const stubs=A.nodes.filter(n=>n.type==='n8n-nodes-base.code'&&/\$\('Shared Library'\)/.test(n.parameters.jsCode||'')&&n.name!=='Shared Library');const ch=[];
for(const s of stubs){try{const a=run(s.parameters.jsCode,lib(A)),b=run(s.parameters.jsCode,lib(B));new vm.Script('(async()=>{\n'+b+'\n})();',{filename:s.name});if(a!==b)ch.push(s.name);}catch(e){f.push(s.name+': '+e.message);}}
const want=['Alt Send Back Build','Alt Send Back Record','R2 Alt Send Back Build','R2 Alt Send Back Record','Send Back Build','Send Back Record'].sort();
if(JSON.stringify(ch.sort())!==JSON.stringify(want))f.push('changed stubs '+JSON.stringify(ch));
const T=lib(B);const j=T.slice(T.indexOf('\n/*LIB*/')+8,T.lastIndexOf('\n/*MAP*/'));const h=crypto.createHash('sha256').update(j).digest('hex').slice(0,16);if(!T.includes('// library sha '+h+','))f.push('header sha');
console.log(stubs.length+' stubs rebuilt and parsed; changed: '+ch.length+' ('+ch.join(', ')+'); header sha '+h);console.log(f.length?'FAULTS: '+f.join(' | '):'faults NONE');process.exit(f.length?1:0);
