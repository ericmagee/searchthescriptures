const fs=require('fs');const [src,out,node,mode]=process.argv.slice(2);let w=JSON.parse(fs.readFileSync(src));w=w.data||w;w=JSON.parse(JSON.stringify(w));delete w.versionId;
const n=w.nodes.find(x=>x.name===node);const c=n.parameters.jsCode;
if(mode==='line')n.parameters.jsCode='// planted comment\n'+c;
if(mode==='block')n.parameters.jsCode=c+'\n/* planted block */';
if(mode==='url')n.parameters.jsCode="const __u='https://example.org/a//b';\n"+c;
if(mode==='sha')n.parameters.jsCode=c.replace(/library sha [0-9a-f]+/,'library sha 0000000000000000');
if(mode==='shaadd')n.parameters.jsCode='// extra header line\n'+c;
if(mode==='eab')n.parameters.jsCode=c+'\n;';
fs.writeFileSync(out,JSON.stringify(w));
