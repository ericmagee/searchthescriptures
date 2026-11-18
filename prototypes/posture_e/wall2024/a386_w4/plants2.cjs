// ASK 386 rev 2 plants (W2 8474, 8478; W1 2e, 2g, 2h): the Alternate Merge ERT entry's calls; the Alternate Merge tag step run as written;
// non-JSON and cut-short bodies; missing fields; the 1336 tie guard; removed seats.
const fs=require('fs');const T=require('../tools/lib.cjs');const acorn=require('../tools/node_modules/acorn');
const ld=f=>{let d=JSON.parse(fs.readFileSync(f));if(d.data&&d.data.nodes)d=d.data;return d;};
const t2=ld(__dirname+'/t386.json'),t1=ld(__dirname+'/t386_rev1.json');const U=T.unpack(t2);const out={};
// 1. every function the entry calls, and the line that defines it
{const M=U.M['Alternate Merge ERT'];const parts=[];for(const e of M.p){if(typeof e==='number')parts.push([e,U.L[e]]);else if(typeof e[0]==='number')for(let i=e[0];i<=e[1];i++)parts.push([i,U.L[i]]);}
 const S=parts.map(x=>x[1]).join('\n');if(S.length!==M.n)throw new Error('n');const starts=[];let o=0;for(const [i,l] of parts){starts.push([o,i]);o+=l.length+1;}const lineAt=p=>{let r=null;for(const [s,i] of starts)if(s<=p)r=i;return r;};
 const ast=acorn.parse(S,{ecmaVersion:'latest',allowReturnOutsideFunction:true});const def=new Map(),calls=new Set();
 (function walk(n,top){if(!n||typeof n.type!=='string')return;if(n.type==='FunctionDeclaration'&&n.id)def.set(n.id.name,lineAt(n.start));
  if(n.type==='VariableDeclarator'&&n.id&&n.id.type==='Identifier'&&top)def.set(n.id.name,lineAt(n.start));
  if(n.type==='CallExpression'&&n.callee.type==='Identifier')calls.add(n.callee.name);
  for(const k of Object.keys(n)){const v=n[k];const t2=top&&(n.type==='Program'||n.type==='VariableDeclaration');if(Array.isArray(v))v.forEach(x=>walk(x,t2));else if(v&&typeof v.type==='string')walk(v,t2);}})(ast,true);
 const G=new Set(['String','Number','JSON','Math','Array','Object','RegExp','Set','Map','Error','parseInt','parseFloat','isNaN','Boolean','encodeURIComponent','decodeURIComponent','Symbol','Date']);
 const local=new Set();(function walk(n){if(!n||typeof n.type!=='string')return;if(n.type==='VariableDeclarator'&&n.id&&n.id.type==='Identifier')local.add(n.id.name);if((n.type==='FunctionDeclaration'||n.type==='FunctionExpression')&&n.id)local.add(n.id.name);for(const p of (n.params||[]))if(p.type==='Identifier')local.add(p.name);for(const k of Object.keys(n)){const v=n[k];if(Array.isArray(v))v.forEach(walk);else if(v&&typeof v.type==='string')walk(v);}})(ast);
 out.calls=[...calls].sort().map(c=>({fn:c,line:def.has(c)?def.get(c):(G.has(c)?'builtin':(local.has(c)?'local in its caller':'UNDEFINED'))}));
 out.undefined_calls=out.calls.filter(c=>c.line==='UNDEFINED').map(c=>c.fn);}
// 2. the Alternate Merge tag step, run as written in the node, with the given library
function step(dLib,dAM,am){const code=dAM.nodes.find(n=>n.name==='Alternate Merge').parameters.jsCode;const a=code.indexOf('\ntry{/* ASK 386');const b=code.indexOf('/* ASK 386 */',a)+'/* ASK 386 */'.length;
 const lib=dLib.nodes.find(n=>n.name==='Shared Library').parameters.jsCode;const __AMOUT=[{json:JSON.parse(JSON.stringify(am))}];
 new Function('$','__AMOUT',code.slice(a,b))(n=>{if(n!=='Shared Library')throw new Error('no '+n);return {params:{jsCode:lib}};},__AMOUT);return __AMOUT[0].json;}
const W=t=>{const m=[...String(t).matchAll(/\[AUDIT v61: ENGINE RESULT -- SEAT: ([^;\]]*); WORD: ([A-Z ]+|none);/g)].pop();return m?m[2]:'NO TAG';};
const full=JSON.stringify({verdict_tag:'BROKEN',defense_standing:'PROP-DEPENDENT',challenge_standing:'PROP-DEPENDENT',conceded_links:1,challenger_conceded_links:1,reasoning:'BROKEN\nD1 vs C1 (John 1:1): DEFENDER LINK BROKEN -- g\nRESULT: CHALLENGER WINS'});
const cut=full.slice(0,-20);const plain='BROKEN\nD1 vs C1 (John 1:1): DEFENDER LINK BROKEN -- g\nRESULT: CHALLENGER WINS';
const onlyTag=JSON.stringify({verdict_tag:'BROKEN',reasoning:'BROKEN\nRESULT: CHALLENGER WINS'});
const body=(seat,raw,extra)=>JSON.stringify({payload:{judge_seat:seat,verdict_raw:raw,...(extra||{})}});
const AM={bodies:[body('a',cut),body('b',plain,{verdict_tag:'BROKEN'}),body('c',onlyTag)],
 drv_removed:[{seat:'r1',verdict_raw:onlyTag},{seat:'r2',verdict_raw:plain,verdict_tag:'BROKEN'},{seat:'r3',verdict_raw:full}]};
const show=o=>({bodies:o.bodies.map(s=>{const p=JSON.parse(s).payload;return p.judge_seat+': '+W(p.verdict_raw);}),removed:o.drv_removed.map(x=>x.seat+': '+W(x.verdict_raw)),ert386_error:o.ert386_error||null});
out.step_rev1_library_rev1_node=show(step(t1,t1,AM));
out.step_rev1_library_rev2_node=show(step(t1,t2,AM));
out.step_rev2=show(step(t2,t2,AM));
// 3. the decider and the 1336 / 1491 guards
const E2=require('./ert_eval.cjs')(__dirname+'/t386.json'),E1=require('./ert_eval.cjs')(__dirname+'/t386_rev1.json');
out.rd386={rev1_BROKEN_no_fields:E1.rd386({verdict:'BROKEN'}),rev2_BROKEN_no_fields:E2.rd386({verdict:'BROKEN'}),
 rev2_BROKEN_equal_fields_no_collisions:E2.rd386({verdict:'BROKEN',dst:'PROP-DEPENDENT',cst:'PROP-DEPENDENT',cd:1,cc:1,col:[]}),
 rev2_HELD_tie_present:E2.rd386({verdict:'HELD',dst:'PROP-DEPENDENT',cst:'PROP-DEPENDENT',cd:1,cc:1,col:[{link:'D1 vs C1',grade:'STANDS'}]})};
const tie=d=>eval('('+T.unpack(d).L[1336].match(/const __tie421=(\([^;]+);/)[1]+')');const g1=tie(t1),g2=tie(t2);const col=[{link:'D1 vs C1',grade:'STANDS'}];
out.tie1336={rev1_empty_counts:g1(col,'PROP-DEPENDENT','PROP-DEPENDENT','','','DEFENDER WINS'),rev2_empty_counts:g2(col,'PROP-DEPENDENT','PROP-DEPENDENT','','','DEFENDER WINS'),
 rev1_missing_all:g1(col,undefined,undefined,undefined,undefined,'CHALLENGER WINS'),rev2_missing_all:g2(col,undefined,undefined,undefined,undefined,'CHALLENGER WINS'),rev2_numbers:g2(col,'PROP-DEPENDENT','PROP-DEPENDENT',1,1,'DEFENDER WINS')};
out.line1491_rev2=T.unpack(t2).L[1491];
fs.writeFileSync(__dirname+'/plants2_out.json',JSON.stringify(out,null,1));console.log(JSON.stringify(out,null,1));
