// runs the s430 Format Markdown block alone on Send Back Record's output from a saved live run (no model call; a made-up reply as in tsb.cjs)
const fs=require('fs');const src=fs.readFileSync(__dirname+'/../new/Format Markdown.js','utf8');
const a=src.indexOf('// s430 (ruling 428)');const b=src.indexOf("t += '---\\n\\n';\nt += '## How to read this debate");const block=src.slice(a,b);
const e=JSON.parse(fs.readFileSync(process.argv[2],'utf8'));const rd=e.data.resultData.runData;const one=n=>{const r=rd[n];return r?r[r.length-1].data.main[0]:null;};
const jer=one('Judge Enforcer Record');const run=(f,$,i)=>new Function('$','$input',fs.readFileSync(__dirname+'/../new/'+f,'utf8'))($,i);
const $1=n=>{const it=one(n);return {isExecuted:!!it,first:()=>it?it[0]:{json:{}},all:()=>it||[]};};
const out=run('Send Back Build.js',$1,{first:()=>jer[0],all:()=>jer});
const fake=out.map(x=>({json:{choices:[{message:{content:'SENDBACK: S1 || KEEP || "made of the seed" decides it.'}}]}}));
const $2=n=>n==='Send Back Build'?{isExecuted:true,first:()=>out[0],all:()=>out}:n==='Judge Enforcer Record'?{isExecuted:true,first:()=>jer[0],all:()=>jer}:$1(n);
const rec=run('Send Back Record.js',$2,{first:()=>fake[0],all:()=>fake})[0];
const nm=s=>({chatgpt:'ChatGPT',gemini:'Gemini',grok:'Grok'}[s]||s);let t='';
new Function('$','nm','tt',block+';return t;'.replace('return t','return t'));
const f=new Function('$','nm',"let t='';"+block+"return t;");
const md=f(n=>n==='Send Back Record'?{first:()=>rec}:null,nm);console.log(md.slice(0,1500));console.log('... lines',md.split('\n').length);
