// pkgABW test. Run from wall2024/: node pkgABW/test_ABW.cjs
const fs=require('fs');const crypto=require('crypto');const sha=s=>crypto.createHash('sha256').update(s).digest('hex').slice(0,16);const rd=f=>fs.readFileSync(f,'utf8');
let ok=0,bad=0;const T=(n,c,d)=>{console.log((c?'OK  ':'FAIL')+' '+n+(d?'\n     '+d:''));c?ok++:bad++;};
const plan=JSON.parse(rd('pkgABW/plan_ABW.json'));
T('4 nodes; base (pkgUNL/patched) and final shas match; each carries src_ABW.js and not src_ABS.js',plan.nodes.length===4&&plan.nodes.every(n=>sha(rd('pkgUNL/patched/'+n.file))===n.base_sha&&sha(rd('pkgABW/patched/'+n.file))===n.final_sha&&rd('pkgABW/patched/'+n.file).includes(rd('pkgABW/src_ABW.js'))&&!rd('pkgABW/patched/'+n.file).includes(rd('pkgABS/src_ABS.js'))));
const L=require('../pkgECL/libload.cjs');const keysOf=require('../pkgECL/keys.cjs');const ADD=JSON.parse(rd('pkgABS/data_33107_add.json'));
const ctxOf=run=>{let c;try{c=L.data(keysOf(run).keys);}catch(e){c=L.data();}if(run==='33107')c.rows=c.rows.concat(ADD.kjv);return c;};
const lib=src=>new Function('$',L.LIBSRC+'\n'+rd(src)+'\nreturn ABS;')(()=>{throw new Error('no $');});const A0=lib('pkgABS/src_ABS.js'),A1=lib('pkgABW/src_ABW.js');
// units
for(const [t,w] of [['D5: STANDS -- GROUND: Galatians 4:4 and Genesis 3:15 name the woman and her seed without asserting a male begetter.',true],['D1: STANDS -- GROUND: the change is exhibited and is not itself denied by the challenger\'s account.',true],
 ['D2: STANDS -- GROUND: the reading was not contradicted in DR3.',true],['D3: STANDS -- GROUND: Luke 1:35 states the source of the conception.',false],['D4: STANDS -- GROUND: without doubt the verse names the Holy Ghost.',false],['D6: STANDS -- GROUND: it is not only denied but refuted.',false]])
 T('unit: '+(w?'absence':'no absence')+': '+t.slice(0,70),!!A1.absence(t)===w,'matched: '+A1.absence(t));
// replay: JEB ids from the live enforcer Build on each run's inputs
const I=(run,n)=>{const f='/mnt/project-files/wall2024/inputs/'+run+'_'+n+'.json';return fs.existsSync(f)?JSON.parse(rd(f))[0].main[0].map(x=>x.json):null;};
const mk=nodes=>n=>{const it=nodes[n];if(!it)return {isExecuted:false,first:()=>{throw new Error(n);},all:()=>{throw new Error(n);}};return {isExecuted:true,first:()=>({json:it[0]}),all:()=>it.map(j=>({json:j}))};};
const jeb=run=>{const nodes={'Panel Cure Check':I(run,'Panel_Cure_Check'),'Init Seats':I(run,'Init_Seats')||[{run_token:'r'}],'Resolve Seats':[{deepseek:{api_model:'stub'}}]};for(const k of [1,2,3]){const v=I(run,'Panel_Cure_Normalize_'+k);if(v)nodes['Panel Cure Normalize '+k]=v;}
 return new Function('$','$input','$json',rd('pkgECL/patched/Judge_Enforcer_Build.js'))(mk(nodes),{first:()=>({json:{}}),all:()=>[],item:{json:{}}},{}).map(x=>x.json);};
let tot=0;for(const r of ['33040','33060','33083','33107','33129','33149']){if(!I(r,'Panel_Cure_Check')){console.log('  == '+r+': no inputs');continue;}const ctx=ctxOf(r);const seen=new Set();let n=0;const add=[],lost=[];
 for(const id of jeb(r).flatMap(c=>c.ids||[])){const k=id.rule+'|'+id.seat+'|'+id.flagged_line;if(seen.has(k))continue;seen.add(k);const a=A0.check(id,ctx),b=A1.check(id,ctx);if(!b.applies)continue;n++;
  if(b.raise&&!a.raise)add.push(id.seat.padEnd(8)+id.rule.padEnd(7)+String(id.grade).padEnd(16)+String(id.item).padEnd(30)+' "'+b.absence+'" | '+String(id.flagged_line).slice(0,140));if(a.raise&&!b.raise)lost.push(id.seat+' '+id.item);}
 tot+=add.length;console.log('  == '+r+': '+n+' lines read; newly raised '+add.length+(add.length?'\n     '+add.join('\n     '):''));T(r+': nothing raised before is dropped',!lost.length,lost.join('; '));
 if(r==='33149')T('33149: gemini D5 and chatgpt D1 STANDS now raised',add.some(x=>/^gemini/.test(x)&&/D5/.test(x))&&add.some(x=>/^chatgpt/.test(x)&&/D1/.test(x)));}
console.log('  newly raised in all: '+tot);console.log(ok+' OK, '+bad+' FAIL');process.exitCode=bad?1:0;
