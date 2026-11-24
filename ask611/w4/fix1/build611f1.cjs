// ASK 611 fix 1 (W4): run 42283 failed at the judges with n8n "invalid syntax". Two ASK 611 expressions held "}}" inside, which ends an n8n expression early:
// Panel Judges Parallel jsonBody and Alternate Pass Call workflowInputs.value.pass (both from the QR rebuild code).
// Change: a space between each inner pair of closing braces ("} }"); the JavaScript is the same. Base: live engine fbc09389.
// Check: every expression in the engine compiles in n8n's own expression parser (@n8n/tournament).
const fs=require('fs');const crypto=require('crypto');const md5=s=>crypto.createHash('md5').update(s).digest('hex');
const E=JSON.parse(fs.readFileSync(process.env.BF1||'/mnt/project-files/ask611/w4/write/fetchback_eng611.json','utf8'));
const fix=v=>{if(!v.startsWith('={{ ')||!v.endsWith(' }}'))throw new Error('expression form');let b=v.slice(4,-3);if(b.indexOf('}}')<0)throw new Error('no inner }}');while(b.indexOf('}}')>=0)b=b.replace(/\}\}/g,'} }');return '={{ '+b+' }}';};
const p=E.nodes.find(x=>x.name==='Panel Judges Parallel').parameters;p.jsonBody=fix(p.jsonBody).replace('/* ASK 611: ','/* ASK 611 (fix 1: no two closing braces together, n8n ends an expression there): ');
const a=E.nodes.find(x=>x.name==='Alternate Pass Call').parameters.workflowInputs.value;a.pass=fix(a.pass);
const {Tournament}=require('/tmp/claude-0/-home-user/86d59483-62fd-5fa0-b8c4-6322500f4823/scratchpad/tour/node_modules/@n8n/tournament');const t=new Tournament(e=>{throw e;});
let n=0;const bad=[];const walk=(o,pth,name)=>{if(typeof o==='string'){if(o.startsWith('=')&&o.indexOf('{{')>=0){n++;try{t.getExpressionCode(o.slice(1));}catch(e){bad.push(name+pth);}}}else if(o&&typeof o==='object')for(const k of Object.keys(o))walk(o[k],pth+'.'+k,name);};
for(const x of E.nodes)walk(x.parameters,'',x.name);if(bad.length)throw new Error('expressions that do not compile: '+bad.join(', '));
const s=JSON.stringify(E);fs.writeFileSync(__dirname+'/target_engine_611f1.json',s);console.log('engine',md5(s).slice(0,8),'| expressions',n,'all compile in n8n tournament');
