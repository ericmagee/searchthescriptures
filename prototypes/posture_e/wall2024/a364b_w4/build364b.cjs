// ASK 364 Part B: the round 1 layers check. Adds the D1B chain (Build, Route, three Calls, Extract), on the D2B pattern, and repoints the readers of D1 Extract to D1B Extract.
// Usage: node build364b.cjs <partA_target.json> <out.json>. The Call nodes are copied from the D1 Call nodes unchanged (model settings untouched).
const fs=require('fs'),crypto=require('crypto');const w=JSON.parse(fs.readFileSync(process.argv[2]));
const N={};for(const n of w.nodes)N[n.name]=n;const J=x=>JSON.parse(JSON.stringify(x));
const uid=s=>{const h=crypto.createHash('sha1').update('ASK364B|'+s).digest('hex');return h.slice(0,8)+'-'+h.slice(8,12)+'-4'+h.slice(13,16)+'-a'+h.slice(17,20)+'-'+h.slice(20,32);};
const sub=(s,o,n,k)=>{const c=s.split(o).length-1;if(c!==k)throw new Error('count '+c+' (want '+k+') for '+o.slice(0,70));return s.split(o).join(n);};
for(const nm of ['D1B Build','D1B Route','D1B Call anthropic','D1B Call openrouter','D1B Call deepseek','D1B Extract'])if(N[nm])throw new Error(nm+' exists');
const RD2="const __RD=(own)=>{const o={};const rd=(k,f)=>{try{const j=f();if(j&&typeof j.raw==='string')o[k]=j.raw;}catch(e){}};if((()=>{try{return $('D1 Extract').isExecuted;}catch(e){return false;}})())rd('CR1',()=>$('D1 Extract').first().json);if((()=>{try{return $('C1B Extract').isExecuted;}catch(e){return false;}})())rd('DR1',()=>$('C1B Extract').first().json);o['CR2']=own;return o;};";
const RD1="const __RD=(own)=>{const o={};o['CR1']=own;return o;}; /* ASK 364 Part B: round 1 has no earlier round */";
// D1B Build
let b=N['D2B Build'].parameters.jsCode;
b=sub(b,RD2,RD1,1);b=sub(b,"$('D2 Extract')","$('D1 Extract')",1);b=sub(b,"$('D2 Build')","$('D1 Build')",1);b=sub(b,"__base='D2 Build'","__base='D1 Build'",1);
b=sub(b,"round:'D2B'","round:'D1B'",2);b=sub(b,"BAR.check('CR2',X.raw","BAR.check('CR1',X.raw",1);
b='/* ASK 364 Part B: D1B Build, the round 1 copy of D2B Build. BAR reads no CR1 round (its ROUNDS list starts at CR2), so this resend fires on layer points only. */\n'+b;
// D1B Extract: D2B Extract wrapper around the D1 Extract code
const x2=N['D2B Extract'].parameters.jsCode,in2=N['D2 Extract'].parameters.jsCode.split("$('D2 Build')").join("$('D2B Build')");
const OPEN='let __X2=null;try{__X2=(()=>{\n';const i=x2.indexOf(OPEN+in2);if(i<0)throw new Error('D2B wrapper not found');
let pre=x2.slice(0,i+OPEN.length),post=x2.slice(i+OPEN.length+in2.length);
const in1=sub(N['D1 Extract'].parameters.jsCode,"$('D1 Build')","$('D1B Build')",1);
pre=sub(pre,RD2,RD1,1);pre=sub(pre,"$('D2 Extract')","$('D1 Extract')",1);pre=sub(pre,"$('D2B Build')","$('D1B Build')",1);pre=sub(pre,"round:'CR2',node:'D2'","round:'CR1',node:'D1'",1);
post=sub(post,"BAR.check('CR2',__X2.raw","BAR.check('CR1',__X2.raw",1);post=sub(post,"side:'DEFENDER',round:'CR2'","side:'DEFENDER',round:'CR1'",1);
const x1='/* ASK 364 Part B: D1B Extract, the D2B Extract wrapper around the D1 Extract code (reading the D1B re-call). */\n'+pre+in1+post;
// nodes
const P=N['D1 Extract'].position;const pos=k=>[P[0]+220*k,P[1]+1100];
const mk=(name,src,k,params)=>{const n=J(N[src]);n.name=name;n.id=uid(name);n.position=pos(k);if(params)n.parameters=params;delete n.webhookId;return n;};
const NB=mk('D1B Build','D2B Build',0,{...J(N['D2B Build'].parameters),jsCode:b});
const NR=mk('D1B Route','D2B Route',1);
const CA=mk('D1B Call anthropic','D1 Call anthropic',2),CO=mk('D1B Call openrouter','D1 Call openrouter',3),CD=mk('D1B Call deepseek','D1 Call deepseek',4);
const NX=mk('D1B Extract','D2B Extract',5,{...J(N['D2B Extract'].parameters),jsCode:x1});
// readers
const KEEP=new Set(['D1B Build','D1B Extract','Failure Salvage','Build Save Body']);const rp=[];
for(const n of w.nodes){if(KEEP.has(n.name)||!n.parameters||typeof n.parameters.jsCode!=='string')continue;const c=n.parameters.jsCode;const k=c.split("$('D1 Extract')").length-1;if(!k)continue;n.parameters.jsCode=c.split("$('D1 Extract')").join("$('D1B Extract')").split('"D1 Extract":()=>$(\'D1B Extract\')').join('"D1B Extract":()=>$(\'D1B Extract\')');rp.push(n.name+':'+k);}
for(const n of w.nodes){if(!n.parameters||n.parameters.jsCode!==undefined)continue;if(JSON.stringify(n.parameters).includes('D1 Extract'))throw new Error('non-code reader '+n.name);}
// Failure Salvage: the D1B entry in its node map, and claude_r1 from the kept round
let fsx=N['Failure Salvage'].parameters.jsCode;fsx=sub(fsx,"\"D1 Extract\":()=>$('D1 Extract'),","\"D1 Extract\":()=>$('D1 Extract'),\"D1B Extract\":()=>$('D1B Extract'),",1);
fsx=sub(fsx,"claude_r1:P('D1 Extract',j=>j.labelled)","claude_r1:(P('D1B Extract',j=>j.labelled)||P('D1 Extract',j=>j.labelled))",1);N['Failure Salvage'].parameters.jsCode=fsx;
// Build Save Body: the D1B record joins the barred-moves records
let bsb=N['Build Save Body'].parameters.jsCode;bsb=sub(bsb,"const __BARB=[];","const __BARB=[];try{if($('D1B Extract').isExecuted)__BARB.push($('D1B Extract').first().json.bar);}catch(e){} /* ASK 364 Part B */",1);N['Build Save Body'].parameters.jsCode=bsb;
// insert the six nodes after D2B Extract's neighbours: at the end, in chain order
w.nodes.push(NB,NR,CA,CO,CD,NX);
// connections
const C=w.connections;const e=n=>({node:n,type:'main',index:0});
if(JSON.stringify(C['D1 Extract'].main[0])!==JSON.stringify([e('C1 Verse Sheet')]))throw new Error('D1 Extract edge drifted');
C['D1 Extract'].main[0]=[e('D1B Build')];
C['D1B Build']={main:[[e('D1B Route')]]};
const R2=C['D2B Route'].main.map(o=>o.map(x=>x.node));const map={'D2B Call anthropic':'D1B Call anthropic','D2B Call openrouter':'D1B Call openrouter','D2B Call deepseek':'D1B Call deepseek','D2B Extract':'D1B Extract','Provider Removed Stop':'Provider Removed Stop'};
C['D1B Route']={main:R2.map(o=>o.map(n=>{if(!map[n])throw new Error('route target '+n);return e(map[n]);}))};
for(const f of ['anthropic','openrouter','deepseek'])C['D1B Call '+f]={main:[[e('D1B Extract')],[e('D1B Extract')]]};
C['D1B Extract']={main:[[e('C1 Verse Sheet')]]};
fs.writeFileSync(process.argv[3],JSON.stringify(w));console.log('ok; readers repointed:',rp.length,rp.join(', '));
