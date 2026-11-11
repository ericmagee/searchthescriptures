// pkgNBR rev 2 plants: Format Markdown on 35067, one flag appended to one panel judge's text; live s133 vs rev 2.
const fs=require('fs');const run=require('../pkgKSR/run_node.cjs');const P='/mnt/project-files/wall2024/';
const un=p=>{let j=JSON.parse(fs.readFileSync(p));j=j.data||j;return j.workflow||j};const cd=(p)=>un(p).nodes.find(x=>x.name==='Format Markdown').parameters.jsCode;
const A=cd(P+'fetchback_live_s133.json'),B=cd(process.argv[2]||'/tmp/claude-0/cmx/nbr2.json');
const PL={N8_open_bracket_cut:'[AUDIT v18: COLLISION POINTS ENTRY NOT READ: "LUKE 3:31 \\"WHICH WAS [THE ". REVIEW THIS ROW.]',
 N9_two_open:'[AUDIT v18: COLLISION POINTS ENTRY NOT READ: "[CR3] AND [CR". REVIEW THIS ROW.]',
 N10_two_level:'[AUDIT v18: COLLISION POINTS ENTRY NOT READ: "see [[CR3]] here". REVIEW THIS ROW.]',
 B1_one_pair:'[AUDIT v42: TEST PLANT (pkgX) -- SEAT: sol; ITEMS: S1 (pressed: [DR2] premise 5). REVIEW THIS ROW.]',
 B2_two_pairs:'[AUDIT v42: TEST PLANT (pkgX) -- [DR2] and [CR3] both. REVIEW THIS ROW.]',
 B3_pair_after:'[AUDIT v42: TEST PLANT (pkgX) -- plain. REVIEW THIS ROW. see [CR3]]',
 B4_bold:'[AUDIT v42: TEST PLANT (pkgX) -- **[CR3]** bold. REVIEW THIS ROW.]',
 B5_empty:'[AUDIT v42: TEST PLANT (pkgX) -- empty [] pair. REVIEW THIS ROW.]',
 C0_plain:'[AUDIT v42: TEST PLANT (pkgX) -- plain control. REVIEW THIS ROW.]'};
const md=o=>JSON.stringify(o).replace(/\\n/g,'\n');
(async()=>{for(const [k,f] of Object.entries(PL)){const rd=JSON.parse(fs.readFileSync(P+'ex35067_full.json','utf8')).data.resultData.runData;const it=rd['Get Judgments'][0].data.main[0][0].json;it.verdict_raw+='\n'+f+'\n';
 const tag=f.slice(f.indexOf(':')+2,f.indexOf(':')+30);const cnt=async c=>md(await run(c,'Format Markdown',rd)).split('\n').filter(l=>/^\| (Review|Cured) flag/.test(l)&&l.includes(f.slice(1,40).replace(/"/g,'\\"').slice(0,20))).length;
 const a=await cnt(A),b=await cnt(B);console.log(k.padEnd(22),'s133',a,'rev2',b,b>=a?'ok':'LOST');}})();
