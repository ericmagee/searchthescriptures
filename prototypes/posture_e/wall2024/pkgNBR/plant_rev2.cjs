// pkgNBR plant: on 33149, set one judge's K-W report for the bracketed item "DEFENDER CR3 LINK 6 [premise 1] #5" to UNCURED;
// that judge's flag must print Review, the other judges' stay Cured. Control P0 (no edit): all three Cured.
const fs=require('fs');const run=require('../pkgKSR/run_node.cjs');const P='/mnt/project-files/wall2024/';
const un=p=>{let j=JSON.parse(fs.readFileSync(p));j=j.data||j;return j.workflow||j};const C=un('/tmp/claude-0/cmx/nbr2.json').nodes.find(x=>x.name==='Format Markdown').parameters.jsCode;
const md=o=>JSON.stringify(o).replace(/\\n/g,'\n');
(async()=>{for(const plant of [null,'chatgpt','sol','gemini']){const rd=JSON.parse(fs.readFileSync(P+'ex33149_full.json','utf8')).data.resultData.runData;let hit=0;
 for(const it of rd['Get Judgments'][0].data.main[0]){const j=it.json;if(plant&&j.judge_seat===plant){const re=/(ITEM: DEFENDER CR3 LINK 6 \[premise 1\] #5; RULE: K-W; RESULT: )CURED/;if(re.test(j.verdict_raw)){j.verdict_raw=j.verdict_raw.replace(re,'$1UNCURED');hit++;}}}
 const o=await run(C,'Format Markdown',rd);const L=md(o).split('\n').filter(l=>/LINK 6 \[premise 1\] #5/.test(l)&&/^\| (Cured|Review) flag/.test(l)).map(l=>l.slice(2,l.indexOf(')')+1));
 console.log('plant',plant||'P0 none','reports edited',hit,'->',L.join(' ; '));}})();
