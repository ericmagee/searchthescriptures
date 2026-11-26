// Shared Library header fix (W4): the header comment "library sha <16>, <n> lines" names the LIB body's sha and line count, so the engine's Library Check passes. Only that comment changes. node b661.cjs base.json out.json
const fs=require('fs'),cr=require('crypto');const [,,BE,OUT]=process.argv;const E=JSON.parse(fs.readFileSync(BE,'utf8'));
const n=E.nodes.find(k=>k.name==='Shared Library');const c=n.parameters.jsCode;const a=c.indexOf('\n/*LIB*/')+8,b=c.indexOf('\n/*MAP*/');const L=JSON.parse(c.slice(a,b));
const sha=cr.createHash('sha256').update(JSON.stringify(L),'utf8').digest('hex').slice(0,16);
const re=/library sha [0-9a-f]{16}, \d+ lines/;const m=c.slice(0,a).match(re);if(!m||c.slice(0,a).split(m[0]).length!==2)throw new Error('header not found once');
n.parameters.jsCode=c.slice(0,a).replace(re,'library sha '+sha+', '+L.length+' lines')+c.slice(a);fs.writeFileSync(OUT,JSON.stringify(E));console.log('old',m[0],'new','library sha '+sha+', '+L.length+' lines');
