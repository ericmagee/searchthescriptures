// ASK 390 build (plan rev 2, Wall 8102/8115; operator ruling 22:09 CST 11-17: option C, MARK ONLY).
// In each of the 17 Extract nodes: one inline copy of wn390 (a390/wn390.js, byte-equal), run on raw right after the round-heading fix (__RFX), before labelled is built.
// A round with no working note is unchanged byte for byte (no new output key). A round with one gets its sentence wrapped "[working note: ...]", plus round_notes and raw_unmarked.
// Usage: node build390.cjs IN OUT
const fs=require('fs');const acorn=require('../tools/node_modules/acorn');
const [IN,OUT]=process.argv.slice(2);let d=JSON.parse(fs.readFileSync(IN));if(d.data&&d.data.nodes)d=d.data;
const FN=fs.readFileSync(__dirname+'/wn390.js','utf8').trim();
const A="if(fx.heading)raw=L.join('\\n');return fx;})();";
const A2=A+'\n'+FN+'\nconst __WN=(()=>{const w=wn390(raw);if(!w.notes.length)return null;const r0=raw;raw=w.text;return {notes:w.notes,raw_unmarked:r0};})(); /* pkgWN (ASK 390): marked, never removed */';
const B='round_fix:__RFX,',B2='round_fix:__RFX,...(__WN?{round_notes:__WN.notes,raw_unmarked:__WN.raw_unmarked}:{}),';
const done=[];for(const n of d.nodes){if(!/ Extract$/.test(n.name)||!/\.code$/.test(n.type))continue;let j=n.parameters.jsCode;
 for(const [o,nw] of [[A,A2],[B,B2]]){const c=j.split(o).length-1;if(c!==1)throw new Error(n.name+': anchor found '+c+' times: '+o.slice(0,40));j=j.replace(o,()=>nw);}
 acorn.parse(j,{ecmaVersion:'latest',allowReturnOutsideFunction:true,allowAwaitOutsideFunction:true});n.parameters.jsCode=j;done.push(n.name);}
if(done.length!==17)throw new Error('Extract nodes '+done.length);
fs.writeFileSync(OUT,JSON.stringify(d));console.log('Extract nodes changed',done.length,done.join(', '));
