// pkgEGL (W1, 11-07; 33497 Lane 1 DeepSeek enforcer fix). In 33497 the K-W/K-S3 DeepSeek check (Enforcer Call deepseek) answered each ITEM by its
// label ("ENFORCER: G1 -- AGREE -- ...") instead of one line per judge answer ("A1.1", "A1.2"). Enforcer Record reads only A<k>.<n> ids, so all
// 52 answers were NO VERDICT.
// (1) Enforcer Build: the reply rule now says the answer id is the A<item>.<n> label in front of each judge's answer, and that an item label (G1) is
//     never an answer id.
// (2) Enforcer Record: a reply line "ENFORCER: G<k> -- <verdict>" is applied to every answer A<k>.<n> of that item, ONLY when the item has no line
//     of its own for any of its answers and every answer in the item opens with the same answer form (COUNTED, TOUCHES NO LINK, STANDS WITHOUT IT,
//     CONCEDED, NOT HELD or REASSERTED), so one verdict means the same for each. Otherwise those answers stay NO VERDICT. Each fanned row says so.
// Base: live s52. Run from wall2024/: node pkgEGL/build_EGL.cjs
const fs=require('fs');const crypto=require('crypto');const h=s=>crypto.createHash('sha256').update(s).digest('hex').slice(0,12);
const R={
 'Enforcer_Build.js':[["NO ANSWER -- NEEDS: YES | NO -- <one sentence that quotes the side\\'s words that decide it>';",
  "NO ANSWER -- NEEDS: YES | NO -- <one sentence that quotes the side\\'s words that decide it>\\n'\n +'The answer id is the A<item>.<n> label in front of each judge\\'s answer (A1.1, A1.2, ...). An ITEM label (G1, G2, ...) is never an answer id: write one line for each judge answer under the item, even when they agree (pkgEGL).';"]],
 'Enforcer_Record.js':[
  ["if(m)V[m[1].toUpperCase()]={v:m[2].toUpperCase(),why:m[3].trim()};}",
   "if(m)V[m[1].toUpperCase()]={v:m[2].toUpperCase(),why:m[3].trim()};\n  else{const g=l.replace(/[*_`]+/g,'').trim().match(/^ENFORCER\\s*:\\s*(?:ITEM\\s+)?G(\\d+)\\s*(?:--|—|–|-)\\s*(AGREE|DISAGREE|NO ANSWER)\\s*(?:--|—|–|-)?\\s*(.*)$/i);if(g&&!GV[g[1]])GV[g[1]]={v:g[2].toUpperCase(),why:g[3].trim()};}}\n /* pkgEGL (33497): an item-label verdict (G<k>) is applied to the item's answers only when none has its own line and all open with one form */\n const FORM=s=>{const m=String(s||'').replace(/[*_`\"\\u201c]+/g,'').trim().match(/^(COUNTED|TOUCHES NO LINK|STANDS WITHOUT IT|CONCEDED|NOT HELD|REASSERTED)\\b/i);return m?m[1].toUpperCase():null;};\n for(const [k,gv] of Object.entries(GV)){const A=(B.ids||[]).filter(x=>new RegExp('^A'+k+'\\\\.\\\\d+$','i').test(x.id));if(!A.length||A.some(x=>V[x.id.toUpperCase()]))continue;const f=A.map(x=>FORM(x.response_line));\n  if(f[0]&&f.every(z=>z===f[0]))for(const x of A)V[x.id.toUpperCase()]={v:gv.v,why:gv.why+' [pkgEGL: the enforcer answered item G'+k+' as a whole; applied to each of its '+A.length+' answers, all '+f[0]+']'};}"],
  ["if(!B.enf_skip){const e=env(rep);const V={};","if(!B.enf_skip){const e=env(rep);const V={},GV={};"]]};
const plan={};for(const [f,rs] of Object.entries(R)){let s=fs.readFileSync('pkgEGL/base_s52/'+f,'utf8');const s0=s;
 for(const [a,b] of rs){const c=s.split(a).length-1;if(c!==1)throw new Error(f+': '+c+' x '+a.slice(0,60));s=s.replace(a,()=>b);}
 new Function('$','$input',s);fs.writeFileSync('pkgEGL/patched/'+f,s);plan[f]={base:h(s0),patched:h(s)};console.log(f.padEnd(22),h(s0),'->',h(s));}
fs.writeFileSync('pkgEGL/patched.plan.json',JSON.stringify(plan,null,1));
