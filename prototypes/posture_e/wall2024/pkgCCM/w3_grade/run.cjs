const fs=require('fs');const J=f=>JSON.parse(fs.readFileSync(f));
const L=J('/mnt/project-files/wall2024/fetchback_live_s115.json'),C=J('/mnt/project-files/wall2024/parent_s115_CCM.json');
const out=[];const say=(k,ok,d)=>{out.push(k+' '+(ok?'PASS':'FAIL')+' '+(d||''));};
// A1
let diff=[];const ln=new Map(L.nodes.map(n=>[n.name,n]));
for(const n of C.nodes){const l=ln.get(n.name);if(!l){diff.push('NEW '+n.name);continue;}if(JSON.stringify(l)!==JSON.stringify(n)){const {parameters:pa,...ra}=l,{parameters:pb,...rb}=n;const {jsCode:ca,...qa}=pa,{jsCode:cb,...qb}=pb;diff.push(n.name+' '+((cb||'').length-(ca||'').length)+(JSON.stringify([ra,qa])===JSON.stringify([rb,qb])?'':' OTHER-FIELDS'));}}
const rest=o=>{const {nodes,...r}=o;return JSON.stringify(r);};
say('A1',diff.join(';')==='C2 Build -9;C3 Build -159;C4 Build -159'&&L.nodes.length===C.nodes.length&&rest(L)===rest(C),diff.join(';')+' nodes '+C.nodes.length+' rest-equal '+(rest(L)===rest(C)));
const mk=(w,n)=>{const s=w.nodes.find(x=>x.name===n).parameters.jsCode;const a=s.indexOf("const __cc=");const b=s.indexOf('const bodyFor=');const e=s.indexOf('messages:m};};',b)+14;
 return new Function('__AIDV','__DPREV',s.slice(a,e)+'\nreturn bodyFor;')(m=>m,null);};
const cc=o=>(JSON.stringify(o).match(/"cache_control"/g)||[]).length;
const msgsN=n=>Array.from({length:n},(_,k)=>({role:k%2?'assistant':'user',content:'m'+k}));
const SYS='AAA\n\n=== DEFENSE DISCIPLINE\nBBB';
const marks=b=>{const ms=b.messages.filter(m=>m.role!=='system');return ms.map((m,k)=>JSON.stringify(m).includes('cache_control')?k:null).filter(x=>x!==null);};
const fl={},fc={};for(const n of ['C2','C3','C4']){fl[n]=mk(L,n+' Build');fc[n]=mk(C,n+' Build');}
for(const [lab,fam,model] of [['A2','anthropic','claude-x'],['A3','openrouter','anthropic/claude-x']]){let ok=true,d=[];for(const k of [1,3,5]){const b=fc.C2(fam,model,100,SYS,msgsN(k));const m=marks(b);d.push(k+':'+m.join(','));const m0=b.messages.filter(x=>x.role!=='system')[0];if(m.join()!=='0'||JSON.stringify(m0.content[0].cache_control)!=='{"type":"ephemeral","ttl":"1h"}')ok=false;}say(lab,ok,d.join(' '));}
{let ok=true,d=[];for(const n of ['C3','C4'])for(const [fam,model] of [['anthropic','claude-x'],['openrouter','anthropic/claude-x']])for(const k of [1,3,5]){const b=fc[n](fam,model,100,SYS,msgsN(k)),l=fl[n](fam,model,100,SYS,msgsN(k));const sysC=fam==='anthropic'?b.system:b.messages[0].content,sysL=fam==='anthropic'?l.system:l.messages[0].content;if(marks(b).length||JSON.stringify(sysC)!==JSON.stringify(sysL)||cc(sysC)!==2)ok=false;const strip=JSON.parse(JSON.stringify(l));(strip.messages).forEach(m=>{if(m.role!=='system'&&Array.isArray(m.content))m.content=m.content[0].text;});if(JSON.stringify(strip)!==JSON.stringify(b)){ok=false;d.push(n+fam+k+' not live-minus-marker');}}say('A4',ok,d.join(' '));}
{let ok=true,n=0;const fams=[['openai','gpt'],['gemini','g'],['grok','x'],['mimo','x'],['deepseek','d'],['openrouter','openai/x'],['openrouter','google/x'],['openrouter','x-ai/x'],['openrouter','xiaomi/x'],['openrouter','qwen/x']];for(const nn of ['C2','C3','C4'])for(const [f,m] of fams)for(const k of [1,4]){n++;if(JSON.stringify(fl[nn](f,m,100,SYS,msgsN(k)))!==JSON.stringify(fc[nn](f,m,100,SYS,msgsN(k))))ok=false;}say('A5',ok,n+' cases');}
{let ok=true,d='';const one=JSON.stringify(fl.C2('anthropic','c',100,SYS,msgsN(1)))===JSON.stringify(fc.C2('anthropic','c',100,SYS,msgsN(1)));let arr;try{const m=msgsN(3);m[0]={role:'user',content:[{type:'text',text:'x'}]};arr=marks(fc.C2('anthropic','c',100,SYS,m)).length===0;}catch(e){arr=false;d=e.message;}say('A6',one&&arr,'one-message equal '+one+'; array message 0 unmarked '+arr+' '+d);}
{let mx=0;for(const n of ['C2','C3','C4'])for(const [f,m] of [['anthropic','c'],['openrouter','anthropic/c']])for(const k of [1,3,5])mx=Math.max(mx,cc(fc[n](f,m,100,SYS,msgsN(k))));say('A7',mx<=4,'max breakpoints '+mx);}
// A8 stored
const d='/mnt/project-files/wall2024/inputs/';const body=f=>{try{const j=J(d+f);const x=Array.isArray(j)?j[0]:j;return ((x.data||x).main[0][0].json).call.body;}catch(e){return null;}};
const runs=[...new Set(fs.readdirSync(d).filter(f=>/_C2_Build\.json$/.test(f)).map(f=>f.split('_')[0]))];
let r={runs:runs.length,c2ok:0,c2bad:[],c2none:0,s3:0,s3bad:[],s4:0,s4bad:[],s3n:0,s4n:0,fams:{}};
for(const run of runs){const b1=body(run+'_C1_Build.json'),b2=body(run+'_C2_Build.json'),b3=body(run+'_C3_Build.json'),b4=body(run+'_C4_Build.json');
 if(!b1||!b2||!b1.system||!b2.system){r.c2none++;continue;}
 const sys=b2.system.map(x=>x.text).join('');const msgs=b2.messages.map(m=>({role:m.role,content:Array.isArray(m.content)?m.content.map(c=>c.text).join(''):m.content}));
 const cb=fc.C2('anthropic',b2.model,b2.max_tokens,sys,msgs);
 (JSON.stringify(cb.messages[0])===JSON.stringify(b1.messages[0])&&JSON.stringify(cb.system)===JSON.stringify(b1.system))?r.c2ok++:r.c2bad.push(run);
 for(const [b,k,kb,kn] of [[b3,'s3','s3bad','s3n'],[b4,'s4','s4bad','s4n']]){if(!b||!b.system){r[kn]++;continue;}(JSON.stringify(b.system[0])===JSON.stringify(b2.system[0]))?r[k]++:r[kb].push(run+':'+(b.system.length)+'v'+b2.system.length);}}
say('A8',r.c2bad.length===0,JSON.stringify(r));
// A9 consumers
const cons=[];for(const n of L.nodes){const c=(n.parameters&&n.parameters.jsCode)||JSON.stringify(n.parameters||{});const m=c.match(/\$\(['"]C[234] Build['"]\)/g);if(m)cons.push(n.name+'['+n.type.split('.').pop()+']:'+[...new Set(m)].join(','));}
out.push('A9 consumers: '+cons.join(' | '));
console.log(out.join('\n'));
