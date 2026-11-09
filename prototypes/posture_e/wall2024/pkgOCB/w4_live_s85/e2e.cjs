const {harness,live}=require('/tmp/claude-0/-home-user/86d59483-62fd-5fa0-b8c4-6322500f4823/scratchpad/sjr/prototypes/posture_e/wall2024/pkgGSL/harness.cjs');const fs=require('fs');
const L='/mnt/project-files/wall2024/fetchback_live_s85.json';const D='/mnt/project-files/wall2024/inputs/34108_Final_Output.json';
const d=JSON.parse(fs.readFileSync(D,'utf8'));const it=(Array.isArray(d)?d[0]:d).data.main[0];const fo=JSON.parse(JSON.stringify(it));
const S1="OPPONENT'S CONTRADICTIONS:\nX1 LINK 4 | EARLIER [CR3] \"I grant that this is the ordinary means\" | CLOSING [CR4] \"Genesis 4:1 therefore cannot supply the sequence for Matthew\" | granted then denied";
fo[0].json.dr4+='\n\n'+S1;
const run=o=>harness('34108',o)(live(L,'Close Enforcer Build'),'Quote Report');
let r0,r1;try{r0=JSON.stringify(run({}));}catch(e){r0='ERR '+e.message}try{r1=JSON.stringify(run({'Final Output':fo}));}catch(e){r1='ERR '+e.message}
console.log('real 34108: candidate X1 in prompt:',r0.includes('X1 LINK 4'),r0.slice(0,120));console.log('planted: candidate X1 in prompt:',r1.includes('X1')&&r1.includes('I grant that this is the ordinary means'),r1.length);
const m=r1.match(/.{0,200}X1.{0,200}/);console.log(m&&m[0]);
