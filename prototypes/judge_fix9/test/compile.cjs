// Every changed and added node compiles: new Function on the file's text (n8n Code nodes run as a function body); and no model call body
// field for reasoning, effort or thinking is introduced (the changed files hold none outside comments; base for comparison).
const fs=require('fs');let bad=0,n=0;const D=__dirname+'/../';
const strip=s=>s.replace(/\/\/[^\n]*/g,'').replace(/\/\*[\s\S]*?\*\//g,'');
const RX=/\b(?:reasoning_effort|reasoning\s*:\s*\{|thinking\s*:\s*\{|thinkingConfig|effort\s*:\s*['"])/;
for(const d of ['new','add']){if(!fs.existsSync(D+d))continue;for(const f of fs.readdirSync(D+d).filter(f=>f.endsWith('.js'))){const s=fs.readFileSync(D+d+'/'+f,'utf8');
 try{new Function('$','$input','$execution',s);n++;console.log('OK  ',d+'/'+f);}catch(e){bad++;console.log('FAIL',d+'/'+f,e.message);}
 const b=fs.existsSync(D+'base/'+f)?fs.readFileSync(D+'base/'+f,'utf8'):'';if(RX.test(strip(s))&&!RX.test(strip(b))){bad++;console.log('FAIL',d+'/'+f,'a reasoning/effort/thinking field was introduced');}}}
console.log('files compiled',n,'| failures',bad);process.exitCode=bad?1:0;
