// W1 pkgSRA rev 2: every served "same round" line on the stored exports, with echo-form counts. usage: node audit.cjs <candidate json>
const fs=require('fs');const L=require('/mnt/project-files/w4/kwn/lib.cjs');const run=require('../pkgKSR/run_node.cjs');const B=L(process.argv[2]);const P='/mnt/project-files/wall2024/';
(async()=>{let lines=0,items=0,echo=0,num=0,chars=0;for(const f of fs.readdirSync(P).filter(f=>/^ex\d+_full\.json$/.test(f))){let d;try{d=JSON.parse(fs.readFileSync(P+f));}catch(e){continue;}const rd=d.data.resultData.runData;if(!rd['Judge Enforcer Build'])continue;
 const o=await run(B.code('Judge Enforcer Build'),'Judge Enforcer Build',rd);if(o.err){console.log(f,'ERR',o.err);continue;}const s=JSON.stringify(o);
 const re=/THE SIDE'S LINES ELSEWHERE IN THE SAME ROUND[^\\]*?\\n((?:(?!\\n\\n).)*)/g;let m,k=0;
 for(const x of s.matchAll(/THE SIDE'S LINES ELSEWHERE IN THE SAME ROUND[^\n]*?\\n(.*?)(?=\\n\\n|\\n[A-Z][A-Z' ]{8,}|")/g)){k++;const ls=x[1].split('\\n');lines+=ls.length;chars+=x[1].length;for(const l of ls){if(/^[\W_]*MEANS\b/i.test(l))echo++;if(/^[\W_]*\d+[.)]\s+(?:the\s+)?inference\b/i.test(l))num++;}}
 items+=k;console.log(f.slice(2,7),'blocks',k);}
console.log('blocks',items,'lines',lines,'MEANS lines',echo,'numbered inference lines',num,'chars',chars);})();
