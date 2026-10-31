const fs=require('fs');
const iv0=JSON.parse(fs.readFileSync('p3/iv_runB.json'))[0].independent_verdict_raw;const cut=iv0.indexOf('\n\n[');const iv=cut>0?iv0.slice(0,cut):iv0;
const r=JSON.parse(fs.readFileSync('row_d1c76ad8-c1da-4790-ad19-9e62d6ea9f5d.json'))[0];
const prev={cr1:r.claude_r1,gr1:r.engine_r1,cr2:r.claude_r2,gr2:r.engine_r2,cr3:r.engine_r3,dr3:r.challenger_r3};
const run=(file)=>{const code=fs.readFileSync(file,'utf8');const $input={first:()=>({json:{choices:[{message:{content:iv},finish_reason:'stop'}]}})};const $=()=>({first:()=>({json:prev})});const o=(new Function('$input','$',code))($input,$)[0].json;const {independent_verdict_raw,...rest}=o;return JSON.stringify({rest:Object.fromEntries(Object.entries(rest).filter(([k])=>!(k in prev))),raw:independent_verdict_raw});};
const a=run('p3/x_before.js'),b=run('p3/new/Extract_Independent_Verdict.js');console.log('run B single judge: before X == after X:',a===b,'len',a.length);
const c=run('new/Extract_Independent_Verdict.js');console.log('run B: S1 file == after X (N1 + X):',c===b);
