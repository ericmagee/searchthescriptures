// W1 grade of pkgSDS: own harness. Captures cureLines and cureVerdicts from the rebuilt Panel Cure Check source of a workflow file.
const fs=require('fs');const crypto=require('crypto');
const cap=file=>{let w=JSON.parse(fs.readFileSync(file,'utf8'));w=w.data||w;w=w.workflow||w;const lib=w.nodes.find(n=>n.name==='Shared Library').parameters.jsCode;
 const L=JSON.parse(lib.slice(lib.indexOf('\n/*LIB*/')+8,lib.lastIndexOf('\n/*MAP*/'))),M=JSON.parse(lib.slice(lib.lastIndexOf('\n/*MAP*/')+8,lib.lastIndexOf('\n/*END*/')))['Panel Cure Check'];
 let s=M.p.map(e=>typeof e==='number'?L[e]:typeof e[0]==='string'?e[0]:L.slice(e[0],e[1]+1).join('\n')).join('\n');const at=s.indexOf('function cureOwn(');s=s.slice(0,at)+'globalThis.__W1={cureLines,cureVerdicts};\n'+s.slice(at);
 const mk=()=>({isExecuted:false,all:()=>[],first:()=>({json:{}}),item:{json:{}}});try{new Function('$','$input',s)(()=>mk(),mk());}catch(e){}const X=globalThis.__W1;delete globalThis.__W1;return X;};
const LV=cap('/mnt/project-files/wall2024/fetchback_live_s149.json'),PK=cap(process.argv[2]);
const R=require('/mnt/project-files/w4/sds/replies.json');const sol=R.find(r=>r.seat==='sol').full_reply;console.log('sol reply md5',crypto.createHash('md5').update(sol).digest('hex'),'(database 1ce4abf9ebae88754870b5617f3211c4)');
const cnt=(F,t)=>{const o=F.cureLines(t);return o.statement.length+'/'+o.response.length+'/'+o.malformed.length;};
for(const r of R)console.log(r.seat.padEnd(8),'live',cnt(LV,r.full_reply),'pkg',cnt(PK,r.full_reply),JSON.stringify(LV.cureLines(r.full_reply))===JSON.stringify(PK.cureLines(r.full_reply))?'IDENTICAL':'differs');
// item-level ESTIMATE: sol's 27 items rebuilt from debate_enforcer_log (rule, item, flagged_line) through cureVerdicts, rounds and broken unknown
const items=require('./items.json');
for(const [lab,F] of [['live',LV],['pkg',PK]]){const v=F.cureVerdicts(items,{ok:true,text:sol},null,null);const by={};v.forEach(x=>{const k=x.rule+' '+x.status;by[k]=(by[k]||0)+1;});console.log('items',lab,JSON.stringify(by));if(lab==='pkg')v.filter(x=>x.status!=='CURED').forEach(x=>console.log('   still',x.rule,x.link,'|',String(x.why).slice(0,140)));}
// plants
const P=['RESPONSE: K-W DEFENDER CR3 LINK 3 #7 -- NOT HELD: "betrothal and taking are two acts" grants a fact, not a withdrawal.',
 'RESPONSE: K-W DEFENDER CR3 LINK 3 #7 — NOT HELD: x','RESPONSE: K-W DEFENDER CR3 LINK 3 #7 -- NOT HELD | y','STATEMENT: D3 vs C3 -- STANDS','RESPONSE: K-W DEFENDER CR3 LINK 3 #7--NOT HELD: z',
 'RESPONSE: K-LB DEFENDER LINK 4: NARROWED TO: the house -- of David -- NOT HELD: w','**RESPONSE: K-S3 S3 DEFENDER CR4: #1 -- TOUCHES NO LINK: v**','RESULT: HELD -- the reason','RESPONSE:K-W DEFENDER CR3 LINK 3 #7 -- NOT HELD: q'];
for(const l of P){const a=LV.cureLines(l),b=PK.cureLines(l);const sh=o=>o.response.length?'RESP['+o.response[0].label+' | '+o.response[0].text.slice(0,30)+']':o.statement.length?'STMT['+o.statement[0].label+']':o.malformed.length?'malformed':'prose/other';console.log(l.slice(0,60).padEnd(60),'| live',sh(a),'| pkg',sh(b));}
