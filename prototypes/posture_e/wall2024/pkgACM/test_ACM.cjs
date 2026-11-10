// pkgACM test (labels pkgACM/labels_ACM.md). Live s109 Anticheat Record vs pkgACM on every stored run, and plants on 33218 X57. Run from wall2024/.
const fs=require('fs');const RM=require('../pkgLIB/runner_model.cjs');const D='/mnt/project-files/wall2024/inputs/';
const Ld=f=>{let d=JSON.parse(fs.readFileSync(f,'utf8'));d=Array.isArray(d)?d[0]:d;d=d.data||d;return d.workflow||d;};
const L=Ld('/mnt/project-files/wall2024/fetchback_live_s109.json'),N=Ld('pkgACM/parent_s109_ACM.json');const code=(w,n)=>w.nodes.find(x=>x.name===n).parameters.jsCode;
let bad=0;const T=(c,m)=>{console.log((c?'OK   ':'FAIL ')+m);if(!c)bad++;};
const dn=N.nodes.filter(n=>JSON.stringify(n)!==JSON.stringify(L.nodes.find(x=>x.name===n.name))).map(n=>n.name);
T(dn.length===1&&dn[0]==='Anticheat Record'&&JSON.stringify(N.connections)===JSON.stringify(L.connections),'A1 only Anticheat Record changes; '+code(L,'Anticheat Record').length+' -> '+code(N,'Anticheat Record').length+' (+'+(code(N,'Anticheat Record').length-code(L,'Anticheat Record').length)+')');
const files=new Set(fs.readdirSync(D));const runs=[...files].filter(f=>/_index\.json$/.test(f)).map(f=>f.split('_')[0]).sort();
const raw=(run,n)=>{const k=run+'_'+n.replace(/ /g,'_')+'.json';if(!files.has(k))return null;const d=JSON.parse(fs.readFileSync(D+k,'utf8'));const r=Array.isArray(d)?d[0]:d;const m=(r.data&&r.data.main)||r.main;return (m&&m[0])||[];};
const cl=x=>JSON.parse(JSON.stringify(x));const AF=Object.getPrototypeOf(async function(){}).constructor;
async function go(w,run,over){const c=code(w,'Anticheat Record');const s=n=>over&&over[n]!==undefined?over[n]:raw(run,n);const inp=s('Anticheat Call deepseek')||[];
 const mk=name=>{const it=s(name);if(it===null){const no=()=>{throw new Error('unexecuted '+name);};return {isExecuted:false,first:no,last:no,all:no,params:{}};}return {isExecuted:true,first:()=>cl(it[0]),last:()=>cl(it[it.length-1]),all:()=>cl(it),params:{}};};
 const $input={first:()=>cl(inp[0]),last:()=>cl(inp[inp.length-1]),all:()=>cl(inp),get item(){return cl(inp[0]);}};
 try{return (await new AF('$','$input','$json','$execution',c)(RM.gate(RM.needs(c),mk),$input,inp[0]&&inp[0].json,{id:run}))[0].json.acx;}catch(e){return {ERR:String(e.message||e)};}}
(async()=>{
 // A2
 let n=0;const ch=[];let other=[];
 for(const r of runs){if(raw(r,'Anticheat Call deepseek')===null)continue;const a=await go(L,r),b=await go(N,r);if(a.ERR&&b.ERR)continue;n++;
  if(JSON.stringify(a)===JSON.stringify(b))continue;const ra={},rb={};(a.rows||[]).forEach(x=>ra[x.id]=JSON.stringify(x));(b.rows||[]).forEach(x=>rb[x.id]=JSON.stringify(x));
  for(const id of Object.keys(rb))if(ra[id]!==rb[id]){if(!ra[id]&&(a.no_answer||[]).includes(id))ch.push(r+' '+id+' NO ANSWER -> '+JSON.parse(rb[id]).answer+(JSON.parse(rb[id]).shown?' SHOWN':''));else other.push(r+' '+id);}
  for(const id of Object.keys(ra))if(!rb[id])other.push(r+' '+id+' lost');
  if(JSON.stringify(a.reversed)!==JSON.stringify(b.reversed))other.push(r+' shown marks differ');}
 const exp=['33389 X34 NO ANSWER -> CONSISTENT','33389 X36 NO ANSWER -> CONSISTENT','33617 X75 NO ANSWER -> CONSISTENT'];
 T(JSON.stringify(ch.sort())===JSON.stringify(exp)&&!other.length,'A2 '+n+' stored runs: changes '+(ch.join('; ')||'none')+(other.length?'; OTHER: '+other.join('; '):''));
 // A3 plants on 33218 X57
 const C0=raw('33218','Anticheat Call deepseek');let ci=-1,line=null;C0.forEach((i,k)=>{const t=(i.json.choices&&i.json.choices[0].message.content)||'';const l=t.split('\n').find(l=>/ANTICHEAT:\s*X57\s*--\s*REVERSED/.test(l));if(l){ci=k;line=l;}});
 console.log('     stored line: '+line.slice(0,220));
 const P=async(id,ln,exp)=>{const C=cl(C0);C[ci].json.choices[0].message.content=C[ci].json.choices[0].message.content.replace(line,ln);const f=x=>{if(x.ERR)return 'ERR';const r=(x.rows||[]).find(z=>z.id==='X57');return !r?'not read':r.answer+(r.shown?' shown':'')+(r.note?' '+r.note:'');};
  const a=f(await go(L,'33218',{'Anticheat Call deepseek':C})),b=f(await go(N,'33218',{'Anticheat Call deepseek':C}));T(a===exp[0]&&b===exp[1],'A3 '+id+': live '+a+'; pkgACM '+b+' (expected '+exp.join(' / ')+')');};
 const base=line.replace(/\s+$/,'');const m=base.match(/^(.*-- CLOSE:\s*["“].*?["”])\s*(--\s*EARLIER:\s*["“])(.*)(["”])$/);
 await P('c control as stored',line,['REVERSED shown','REVERSED shown']);
 await P('a period after the EARLIER quote',base+'.',['not read','REVERSED shown']);
 await P('b period after the CLOSE quote, no EARLIER part',m[1]+'.',['not read','REVERSED QUOTE NOT FOUND']);
 await P('d1 EARLIER with no closing mark',m[1]+' '+m[2]+m[3],['not read','not read']);
 await P('d2 text after the period',base+'. (see above)',['not read','not read']);
 await P('d3 lower-case "Reversed"',base.replace('REVERSED','Reversed'),['not read','not read']);
 await P('d4 two periods',base+'..',['not read','not read']);
 await P('e no quotes, "REVERSED."',base.replace(/REVERSED.*$/,'REVERSED.'),['not read','REVERSED QUOTE NOT FOUND']);
 console.log(bad?bad+' FAIL':'ALL OK');})();
