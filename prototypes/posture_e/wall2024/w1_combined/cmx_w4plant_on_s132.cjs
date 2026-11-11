// W4's mirror plant (w4/cecmirror/plant.cjs) on Panel Cure Check cureRecompute, run for s130 and for pkgCMX. No model call.
const fs=require('fs');const run=require(process.cwd()+'/pkgKSR/run_node.cjs');
const rebuild=(stub,lib)=>{let i=stub.indexOf('\nreturn await new Function(');if(i<0)i=stub.indexOf('\nconst __e4h');const $=n=>({params:{jsCode:lib}});return new Function('$',stub.slice(0,i)+'\nreturn __S;')($);};
const code0f=f=>{let D=JSON.parse(fs.readFileSync(f));D=D.data||D;const W=D.workflow||D;return rebuild(W.nodes.find(x=>x.name==='Panel Cure Check').parameters.jsCode,W.nodes.find(x=>x.name==='Shared Library').parameters.jsCode);};
const RD0=JSON.parse(fs.readFileSync('/mnt/project-files/wall2024/ex35067_full.json','utf8')).data.resultData.runData;
const base=JSON.parse(fs.readFileSync(process.env.J1)).reasoning;
const hook=c=>{const ls=c.split('\n');const at=ls.findIndex((l,i)=>i>5&&/cureRecompute/.test(l)&&/function cureRecompute|const cureRecompute|cureRecompute=/.test(l));const L2=ls.slice();L2.splice(+process.env.AT||1389,0,'if(globalThis.__T)return [{json:globalThis.__T(cureRecompute)}];');return {code:L2.join('\n'),def:at};};
const over=conf=>({'Close Enforcer Record':[[{json:{cec:{confirmed:conf}}}]],'Judge Contradiction Record':[[{json:{jcc:{confirmed:[]}}}]]});
const plant=(t,res)=>{t=t.replace(/^D3 vs C5 \(Luke 3:23\): UNDERDETERMINED/m,'D3 vs C5 (Luke 3:23): DEFENDER LINK BROKEN').replace(/^CLAUSE: HELD-1 -- n=5 w=0 k=0/m,'CLAUSE: BROKEN-1 -- n=5 w=0 k=1').replace(/^DEFENSE STANDING: SELF-SUPPORTED -- L=4 c=0/m,'DEFENSE STANDING: PROP-DEPENDENT -- L=4 c=0');if(res)t=t.replace(/^RESULT: DEFENDER WINS/m,'RESULT: '+res);return t;};
const X={side:'CHALLENGER',link:5,earlier_round:'DR3',earlier_q:'planted earlier line',closing_round:'DR4',closing_q:'planted closing line'};
const F={verdict_tag:'BROKEN',defense_standing:'PROP-DEPENDENT',challenge_standing:'PROP-DEPENDENT'};
const live=JSON.parse(fs.readFileSync('/mnt/project-files/wall2024/ex35067_full.json')).data.resultData.runData['Close Enforcer Record'][0].data.main[0][0].json.cec.confirmed;
const cases=[
 ['C0 control: planted D3 vs C5 DEFENDER LINK BROKEN, no confirmed contradiction',plant(base,'CHALLENGER WINS'),[],F],
 ['C1 mirror: CHALLENGER link 5 confirmed',plant(base,'CHALLENGER WINS'),[X],F],
 ['C2 mirror, judge RESULT left DEFENDER WINS',plant(base,null),[X],F],
 ['C3 mirror plus DEFENDER link 3 confirmed first',plant(base,'CHALLENGER WINS'),[{...X,side:'DEFENDER',link:3},X],F],
 ['C4 the run as stored: luna original text, live confirmed X3 (D1) and X4 (D4)',base,live,{verdict_tag:'HELD',defense_standing:'SELF-SUPPORTED',challenge_standing:'PROP-DEPENDENT'}],
];
(async()=>{for(const [lab,f] of [['s130','/mnt/project-files/wall2024/fetchback_live_s130.json'],['CMX','/mnt/project-files/wall2024/fetchback_live_s132.json']]){const h=hook(code0f(f));console.log('######',lab,'cureRecompute defined at line',h.def);
 for(const [nm,t,conf,FF] of cases){globalThis.__T=cr=>cr('luna',t,FF,[],[],null);const o=await run(h.code,'Panel Cure Check',RD0,over(conf));delete globalThis.__T;
  if(o.err){console.log(nm,'ERR',o.err);continue;}const r=o[0]||{};console.log('##',nm,'| tag',JSON.stringify(r.tag),'result',JSON.stringify(r.result));(r.trig||[]).forEach(x=>console.log('   trig:',x));}}})();
