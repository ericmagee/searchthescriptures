// run Citation Scan on stored rounds; print [L2] tags (round, verses, words) and read keys
const W=require(process.argv[2]);const R=require('../a287/runs.json');const tok=process.argv[3]||'ODV1-37113-vaaf3hwh';const r=R[tok].r;
const F={...r,cr1:r.claude_r1,gr1:r.engine_r1,cr2:r.claude_r2,gr2:r.engine_r2,cr3:r.engine_r3,dr3:r.challenger_r3,cr4:r.defender_r4,dr4:r.challenger_r4};
const c=W.nodes.find(n=>n.name==='Citation Scan').parameters.jsCode;
const $=nm=>{if(nm==='Final Output')return {isExecuted:true,first:()=>({json:F}),all:()=>[{json:F}]};if(nm==='Regrade Load')return {isExecuted:false,first:()=>{throw new Error('x')}};throw new Error('no stub '+nm)};
const out=new Function('$','$input','return (()=>{'+c+'\n})()')($,{first:()=>({json:F}),all:()=>[{json:F}]});const o=(Array.isArray(out)?out[0].json:out);
module.exports=o;if(require.main===module){console.log(Object.keys(o).join(','));console.log('read',o.l2_read.length,o.l2_read.join(' '));for(const t of o.l2_tags)if(/CR3/.test(t.round))console.log(t.round,JSON.stringify(t.verses),JSON.stringify((t.words||[]).map(w=>w.w)),String(t.text||t.seg||'').slice(0,120));}
