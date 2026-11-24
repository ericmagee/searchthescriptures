// W4 (ASK 579, W3 note Wall 11147): reset the Shared Library header (sha and line count) in place, then run the engine's Library Check node on the result.
// node fixhdr579.js <engine.json> <child.json>   (files rewritten in place)
// The engine Library Check runs here on the first file; the child side is checked by the pair check (test557.js --pair).
const fs=require('fs'),cr=require('crypto');let fail=0;
const FS=process.argv.slice(2);for(const f of FS){const W=JSON.parse(fs.readFileSync(f));const n=W.nodes.find(x=>x.name==='Shared Library');const c=n.parameters.jsCode;const a=c.indexOf('\n/*LIB*/'),b=c.lastIndexOf('\n/*MAP*/');
 const L=JSON.parse(c.slice(a+8,b));const sha=cr.createHash('sha256').update(JSON.stringify(L)).digest('hex').slice(0,16);
 const head=c.slice(0,a);if((head.match(/library sha [0-9a-f]{16}, \d+ lines/g)||[]).length!==1){console.log('FAIL header form in '+f);fail++;continue;}
 n.parameters.jsCode=head.replace(/library sha [0-9a-f]{16}, \d+ lines/,'library sha '+sha+', '+L.length+' lines')+c.slice(a);fs.writeFileSync(f,JSON.stringify(W));
 const lc=f===FS[0]?W.nodes.find(x=>/^Library Check/.test(x.name)):null; /* the child's check needs the engine's Library Sha output: that is the pair check */let r='ran';if(lc){try{new Function('$','$input',lc.parameters.jsCode)(()=>({params:{jsCode:n.parameters.jsCode}}),{all:()=>['ok']})}catch(e){r=e.message}}
 const ok=!lc||r==='ran';if(!ok)fail++;console.log((ok?'PASS ':'FAIL ')+f.split('/').pop()+': header library sha '+sha+', '+L.length+' lines'+(lc?'; '+lc.name+' '+r:''));}
console.log(fail?'FAILURES: '+fail:'ALL PASS');
