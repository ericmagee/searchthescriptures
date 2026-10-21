// Harness: runs Format Markdown's jsCode (file arg 1) on stored rows (arg 2), no flow, no model call; writes md to arg 3.
const fs=require('fs');const code=fs.readFileSync(process.argv[2],'utf8');const D=JSON.parse(fs.readFileSync(process.argv[3],'utf8'));
const VERSE='For precept [must be] upon precept, precept upon precept; line upon line, line upon line; here a little, [and] there a little: [must be: or, hath been]';
const items=a=>({first:()=>({json:a[0]}),all:()=>a.map(j=>({json:j})),isExecuted:true});
const src={'Get Row':[D.row],'Get Judgments':D.judgments,'Get Verse':[{text:VERSE}],'Get Guards':D.guards,'Init Seats':[{single_judge:'deepseek',t0:null}]};
const $=n=>{if(src[n])return items(src[n]);if(n==='Panel Failure Note')return {isExecuted:false,first:()=>{throw new Error('not run')}};throw new Error('node '+n+' not supplied');};
const out=new Function('$',code)($);fs.writeFileSync(process.argv[4],out[0].json.md);console.log('rendered',out[0].json.chars,'chars',out[0].json.fileName);
