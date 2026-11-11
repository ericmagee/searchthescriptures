// counts stored-export occurrences of the stated limits of today's packages. distinct lines per export.
const fs=require('fs');const D='/mnt/project-files/wall2024/';
const F={
 EKR_res_noword:l=>/^\W*RESULT\s*:\s*CHALLENGER WINS\b/i.test(l)&&!/contradict/i.test(l)&&/inconsisten|conflict|incompatib|self-refut|clash|cannot both/i.test(l),
 EKR_res_all_cw:l=>/^\W*RESULT\s*:\s*CHALLENGER WINS\b/i.test(l),
 EKR_res_contradict:l=>/^\W*RESULT\s*:\s*CHALLENGER WINS\b/i.test(l)&&/contradict/i.test(l),
 SGR_cond:l=>/\b(?:if|were\s+it|suppose|even\s+if|assuming)\b[^.;:]{0,40}\b(?:is|are|was|were)\s+(?:also\s+)?(?:granted|conceded)\b(?!\s+by\b)/i.test(l),
 SGR_nothing:l=>/\b(?:nothing|none|no\s+\w+)\s+(?:is|are|was|were)\s+(?:also\s+)?(?:granted|conceded)\b/i.test(l),
 SGR_granting:l=>/(?:^|[.!?]\s+|^\W*)Granting\s+(?:that|this|the|for)\b/.test(l),
 RRT_nocolon:l=>/\bRETRACTED\b(?!\s*:)/.test(l)&&!/RETRACTED:/.test(l),
 RRT_colon:l=>/\bRETRACTED\s*:/.test(l),
 AMG_rightq:l=>/\(right:\s*MEETS\s*\?/i.test(l),
 AMG_right:l=>/\(right:\s*MEETS\b/i.test(l),
 UOW_disputing:l=>/UNDERDETERMINED/.test(l)&&/\b(?:disputing|differ(?:s|ing)?\s+on|disagree)\b/i.test(l)&&!/\bleaves?\b(?:\s+[^\s.;:,!?()—–]+){0,8}\s+(?:open|disputed|undecided|unsettled|unresolved|contested|in\s+dispute)\b/i.test(l),
 UOW_nothing:l=>/UNDERDETERMINED/.test(l)&&/\bleaves?\s+nothing\s+open\b/i.test(l),
};
const tot={},ex={};for(const k in F){tot[k]=0;ex[k]=[];}
for(const fn of fs.readdirSync(D).filter(x=>/^ex3\d+_full\.json$/.test(x))){const run=fn.slice(2,7);const seen=new Set();const walk=v=>{if(typeof v==='string'){if(v.length>20)for(const l of v.split(/\n/))seen.add(l.trim());}else if(v&&typeof v==='object')for(const k in v)walk(v[k]);};walk(JSON.parse(fs.readFileSync(D+fn,'utf8')).data.resultData.runData);
 const row=[run];for(const k in F){let n=0;for(const l of seen)if(l.length<4000&&F[k](l)){n++;if(ex[k].length<6)ex[k].push(run+': '+l.slice(0,260));}tot[k]+=n;row.push(k+'='+n);}console.log(row.join(' '));}
console.log('TOTAL',JSON.stringify(tot));for(const k in ex){console.log('--',k);ex[k].forEach(x=>console.log('  ',x));}
