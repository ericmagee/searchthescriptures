const fs=require('fs');const LIB=require('/mnt/project-files/w4/kwn/lib.cjs');const run=require('../../pkgKSR/run_node.cjs');
const L=LIB('/tmp/claude-0/fb137.json');
const ex=JSON.parse(fs.readFileSync('/mnt/project-files/wall2024/ex35067_full.json','utf8'));const rd=ex.data.resultData.runData;
const stored=rd['Verdict Call openrouter'][0].data.main[0][0].json;
const get=f=>{const R=JSON.parse(fs.readFileSync(f,'utf8'));return R.body||R;};
(async()=>{for(const [k,rep] of [['stored 35067',stored],['ASK76 control (no notes)',get('/mnt/project-files/w4/ask74/reply_control.json')],['ASK74 (notes)',get('/mnt/project-files/w4/ask74/reply.json')]]){
 const over={'Verdict Call openrouter':[[{json:rep}]]};const vn=await run(L.code('Verdict Normalizer'),'Verdict Normalizer',rd,over,[{json:rep}]);over['Verdict Normalizer']=[vn.map(j=>({json:j}))];
 const ev=await run(L.code('Extract Independent Verdict'),'Extract Independent Verdict',rd,over,vn.map(j=>({json:j})));const j=ev[0];const t=String(rep.choices[0].message.content);
 console.log(k,'| chars',t.length,'| completion',rep.usage.completion_tokens,'reasoning',(rep.usage.completion_tokens_details||{}).reasoning_tokens,'| tag',j.verdict_tag,'| marks',j.defender_chain_mark,j.challenger_chain_mark,'| no-CP flag',/NO COLLISION POINTS SECTION/.test(String(j.independent_verdict_raw)),'| cure items',(j.debate_rule_violations||[]).length,'| premise_count',j.premise_count,'| cards',(t.match(/RULING CARD|CARD \d|^CARD/gim)||[]).length,'| mentions ANTI-CHEAT',/anti-cheat/i.test(t),'| mentions disregard',/disregard/i.test(t));}})();
