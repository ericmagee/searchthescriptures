const fs=require('fs');const W='/tmp/claude-0/-home-claude/ce829ea6-86e3-51b0-af44-4033b35f6682/scratchpad/fc4/prototypes/posture_e/wall2024/';
const L=require('/mnt/project-files/w4/kwn/lib.cjs');const run=require(W+'pkgKSR/run_node.cjs');
const B=L('/mnt/project-files/wall2024/parent_s173_SRA.json');const ex=process.argv[2]||'ex34852_full.json';
(async()=>{const rd=JSON.parse(fs.readFileSync('/mnt/project-files/wall2024/'+ex,'utf8')).data.resultData.runData;
for(const n of ['Judge Enforcer Build','Alt Judge Enforcer Build']){if(!rd[n])continue;const o=await run(B.code(n),n,rd);if(o&&o.err){console.log('ERR',o.err);continue;}
 const items=[];JSON.stringify(o,(k,v)=>{if(typeof v==='string'&&/ITEM B\d+ \(E-ANS/.test(v))for(const m of v.split(/(?=ITEM [A-Z]?\d+ \()/))if(/^ITEM B\d+ \(E-ANS/.test(m))items.push(m);return v;});
 const w=items.filter(x=>x.includes('ELSEWHERE IN THE SAME ROUND'));console.log(ex,n,'E-ANS items',items.length,'with same-round text',w.length);
 fs.writeFileSync('/tmp/claude-0/-home-claude/ce829ea6-86e3-51b0-af44-4033b35f6682/scratchpad/sra/items_'+ex+'_'+n.replace(/ /g,'_')+'.json',JSON.stringify(items));}})();
