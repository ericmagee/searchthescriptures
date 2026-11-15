// Run live Citation Scan on one stored debate; print items near a pattern.
const fs=require('fs');const W=JSON.parse(fs.readFileSync(process.argv[2]));const code=W.nodes.find(n=>n.name==='Citation Scan').parameters.jsCode;
const r=JSON.parse(fs.readFileSync(process.argv[3]))[0];const F={cr1:r.claude_r1||'',gr1:r.engine_r1||'',cr2:r.claude_r2||'',gr2:r.engine_r2||'',cr3:r.engine_r3||'',dr3:r.challenger_r3||'',cr4:r.defender_r4||'',dr4:r.challenger_r4||''};
const M={'Final Output':[F],'Init Seats':[{run_token:'X'}]};
const $=n=>{const m=M[n];return m?{isExecuted:true,all:()=>m.map(j=>({json:j})),first:()=>({json:m[0]})}:{isExecuted:false,all:()=>[],first:()=>({json:{}})};};
const out=new Function('$','$input',code)($,{all:()=>[{json:{}}],first:()=>({json:{}})});const j=out[0].json;
const items=j.items||j.cite_items||[];console.log('keys',Object.keys(j).slice(0,20).join(','),'items',items.length);
const pat=new RegExp(process.argv[4]||'.');for(const i of items)if(pat.test(JSON.stringify(i)))console.log(JSON.stringify({ref:i.ref,side:i.side,round:i.round,quote:(i.quote||'').slice(0,90),alt:i.alt,after_first:i.after_first,order:i.order,cite_form:i.cite_form}));
