// pkgUNA replay: whole-node Send Back Build, pkgPAB/patched (live) vs pkgUNA/patched. Run from wall2024/: node pkgUNA/replay_UNA.cjs <runs>
const fs=require('fs');const rd=f=>fs.readFileSync(f,'utf8');const {I}=require('../pkgPAB/scan_PAB.cjs');
const L=require('../pkgECL/libload.cjs');const keysOf=require('../pkgECL/keys.cjs');const ADD=JSON.parse(rd('pkgABS/data_33107_add.json'));
const ctxOf=run=>{let c;try{c=L.data(keysOf(run).keys);}catch(e){c=L.data();c.fallback=true;}if(run==='33107')c.rows=c.rows.concat(ADD.kjv);return c;};
const mk=nodes=>n=>{const it=nodes[n];if(!it)return {isExecuted:false,first:()=>{throw new Error(n);},all:()=>{throw new Error(n);}};return {isExecuted:true,first:()=>({json:it[0]}),all:()=>it.map(j=>({json:j}))};};
const sb=(f,run)=>{const G=JSON.parse(rd('corpus/raw/gate_'+run+'.json'));const g=G['Gate Record'].slice(-1)[0][0];const ctx=ctxOf(run);
 const nodes={'Panel Build':G['Panel Build'].slice(-1)[0],'Panel Cure Check':I(run,'Panel_Cure_Check'),'Enforcer Record':[{enf421_rows:g.enf421_rows||[]}],'Judge Enforcer Build':I(run,'Judge_Enforcer_Build')||[],'Cited Verses':ctx.rows,'L2 Words':ctx.ow,'L2 Lexicon':ctx.lex};
 const PASS={enf428_rows:g.enf428_rows||[],bodies:nodes['Panel Cure Check'][0].bodies};
 return {fb:!!ctx.fallback,o:new Function('$','$input','$json',rd(f))(mk(nodes),{first:()=>({json:PASS}),all:()=>[{json:PASS}]},PASS).map(x=>x.json)};};
const itemsOf=o=>o.filter(x=>!x.sb_skip&&x.items).flatMap(x=>x.items.map(i=>({seat:x.seat,...i})));module.exports={sb,itemsOf};
if(require.main===module)for(const run of process.argv.slice(2)){const A=sb('pkgPAB/patched/Send_Back_Build.js',run),B=sb('pkgUNA/patched/Send_Back_Build.js',run);const a=itemsOf(A.o),b=itemsOf(B.o);
 const k=i=>i.seat+'|'+i.rule+'|'+i.item+'|'+i.line;const ka=new Set(a.map(k));const nw=b.filter(i=>!ka.has(k(i)));const mk2=b.filter(i=>ka.has(k(i))&&i.und&&i.und.kind==='E-HOLD-UNA');
 console.log('== '+run+(A.fb?' (KJV data fallback)':'')+': items '+a.length+' -> '+b.length+'; new '+nw.length+'; existing E-HOLD marked '+mk2.length);
 for(const i of nw.concat(mk2))console.log('  '+(ka.has(k(i))?'MARK ':'NEW  ')+i.seat+' '+i.item+'\n     LINE: '+i.line.slice(0,230)+'\n     WHY: '+i.reason.replace(/^.*?pkgUNA\): /,'').slice(0,260));}
