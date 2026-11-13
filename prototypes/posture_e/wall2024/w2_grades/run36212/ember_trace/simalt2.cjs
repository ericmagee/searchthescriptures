const fs=require('fs');
const D=JSON.parse(fs.readFileSync('sim36212.json','utf8'));const R=D.rounds;
const src=fs.readFileSync('lib/AJEB_dbg.js','utf8');
const body=JSON.stringify({payload:{judge_seat:'ember',judge_api_model:'meta/muse-ember',verdict_raw:(process.env.FIX?D.ember_raw_fixed:D.ember_raw)}});
const nodes={
 'Alt Seated':{json:{bodies:[body],judges:[],alt_seats:[{seat:'ember',removed_seat:'luna',api_model:'meta/muse-ember'}],run_token:'ODV1-36212-ld47uzqy',f:{cr1:R.cr1,cr2:R.cr2,cr3:R.cr3,cr4:R.cr4,gr1:R.gr1,gr2:R.gr2,dr3:R.dr3,dr4:R.dr4,synthesis:''},enf421_rows:[],enf428_rows:[],alt_needed:false}},
 'Init Seats':{json:{run_token:'ODV1-36212-ld47uzqy'}},
 'Resolve Seats':{json:{deepseek:{api_model:'deepseek/deepseek-v4',max_tokens:16000}}},
};
const $=n=>{const x=nodes[n];if(!x)return {isExecuted:false,first:()=>{throw new Error('not run '+n)},all:()=>{throw new Error('not run '+n)}};return {isExecuted:true,first:()=>x,all:()=>[x],params:{}};};
const $input={first:()=>nodes['Alt Seated'],all:()=>[nodes['Alt Seated']]};
(async()=>{const out=await new Function('$','$input','return (async()=>{\n'+src+'\n})();')($,$input);
 console.log('items out',out.length);for(const o of out){const j=o.json;console.log(JSON.stringify({je_skip:j.je_skip,why:j.why,eak:j.eak,call:j.call,calls:j.calls,nids:(j.ids||[]).length,rules:[...new Set((j.ids||[]).map(x=>x.rule))]}));}
})().catch(e=>console.log('ERR',e.message));
setTimeout(()=>{const J=globalThis.__J||[];console.log('judges',J.length);for(const j of J){const L=j.t.split('\n');console.log(j.seat,'lines',L.length,'len',j.t.length);console.log(L.slice(0,12).map(x=>x.slice(0,140)).join('\n'));}},500);
