const fs=require('fs'),cr=require('crypto');
const [IN,OUT]=process.argv.slice(2);let w=JSON.parse(fs.readFileSync(IN));w=w.workflow||w;
if(w.nodes.some(n=>n.name==='Library Check'))throw new Error('refuse: Library Check already present');
const src=w.nodes.find(n=>n.name==='Library Sha (ASK 422a)').parameters.jsCode;
const a=src.indexOf('const __SHA422='),b=src.indexOf('const __LIBSHA422='),c=src.indexOf('\n',b);
if(a<0||b<0||c<0)throw new Error('refuse: hash functions not found');
const fns=src.slice(a,c+1);
const body="const __lc=$('Shared Library').params.jsCode;const __hm=__lc.match(/library sha ([0-9a-f]{16})/);const __hd=__hm?__hm[1]:null;const __ls=__LIBSHA422(__lc);\n"+
"if(!__hd||!__ls||__hd!==__ls)throw new Error('pkgLIB2: Shared Library text sha '+(__ls||'none')+' differs from its header sha '+(__hd||'none'));\n"+
"return $input.all();\n";
const ds=w.nodes.find(n=>n.name==='Debate Start');
if(JSON.stringify(w.connections['Debate Start'])!==JSON.stringify({main:[[{node:'Accept Models',type:'main',index:0}]]}))throw new Error('refuse: Debate Start wiring moved');
const ids=new Set(w.nodes.map(n=>n.id));const id=cr.createHash('sha256').update('ASK 443 Library Check').digest('hex').replace(/^(.{8})(.{4})(.{4})(.{4})(.{12}).*/,'$1-$2-$3-$4-$5');if(ids.has(id))throw new Error('id clash');
w.nodes.push({parameters:{jsCode:fns+body},type:'n8n-nodes-base.code',typeVersion:2,position:[ds.position[0]+220,ds.position[1]-320],id,name:'Library Check'});
w.connections['Debate Start']={main:[[{node:'Library Check',type:'main',index:0}]]};
w.connections['Library Check']={main:[[{node:'Accept Models',type:'main',index:0}]]};
fs.writeFileSync(OUT,JSON.stringify(w));
console.log('base',w.versionId,'nodes',w.nodes.length,'node text sha256',cr.createHash('sha256').update(fns+body).digest('hex').slice(0,12),'chars',(fns+body).length);
