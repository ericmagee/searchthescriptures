// W1 grade of pkgCMX: own plants in both directions on Panel Cure Check cureRecompute, s130 vs CMX. Harness from W2's pkgCMX/plant.cjs. No model call.
// J1 = luna's original verdict JSON from run 35067 (Panel Judge 1 openrouter, content parsed).
const fs=require('fs');const run=require(process.cwd()+'/pkgKSR/run_node.cjs');
const rebuild=(stub,lib)=>{let i=stub.indexOf('\nreturn await new Function(');if(i<0)i=stub.indexOf('\nconst __e4h');const $=n=>({params:{jsCode:lib}});return new Function('$',stub.slice(0,i)+'\nreturn __S;')($);};
const code0f=f=>{let D=JSON.parse(fs.readFileSync(f));D=D.data||D;const W=D.workflow||D;return rebuild(W.nodes.find(x=>x.name==='Panel Cure Check').parameters.jsCode,W.nodes.find(x=>x.name==='Shared Library').parameters.jsCode);};
const RD0=JSON.parse(fs.readFileSync('/mnt/project-files/wall2024/ex35067_full.json','utf8')).data.resultData.runData;
const base=JSON.parse(fs.readFileSync(process.env.J1||'/tmp/claude-0/cmx/judge_luna.json')).reasoning;
const hook=c=>{const L2=c.split('\n');L2.splice(1389,0,'if(globalThis.__T)return [{json:globalThis.__T(cureRecompute)}];');return L2.join('\n');};
const over=conf=>({'Close Enforcer Record':[[{json:{cec:{confirmed:conf}}}]],'Judge Contradiction Record':[[{json:{jcc:{confirmed:[]}}}]]});
const X=(side,link)=>({side,link,earlier_round:side==='DEFENDER'?'DR3':'CR3',earlier_q:'planted earlier line',closing_round:side==='DEFENDER'?'DR4':'CR4',closing_q:'planted closing line'});
const sub=(t,pairs)=>{for(const [a,b] of pairs){if(!a.test(t))throw new Error('plant anchor missing '+a);t=t.replace(a,b);}return t;};
const D3C5=[/^D3 vs C5 \(Luke 3:23\): UNDERDETERMINED/m,'D3 vs C5 (Luke 3:23): DEFENDER LINK BROKEN'];
const BRK=[[/^CLAUSE: HELD-1 -- n=5 w=0 k=0/m,'CLAUSE: BROKEN-1 -- n=5 w=0 k=1'],[/^RESULT: DEFENDER WINS/m,'RESULT: CHALLENGER WINS']];
const F0={verdict_tag:'HELD',defense_standing:'SELF-SUPPORTED',challenge_standing:'PROP-DEPENDENT'};const FB={...F0,verdict_tag:'BROKEN',defense_standing:'PROP-DEPENDENT'};
const cases=[
 ['P1 challenger contradiction C1; both C1 lines already CHALLENGER LINK BROKEN (same side, no change expected)',base,[X('CHALLENGER',1)],F0],
 ['P2 defender contradiction D2; D2 vs C1 is CHALLENGER LINK BROKEN, D2 vs C3 UNDERDETERMINED',base,[X('DEFENDER',2)],F0],
 ['P3 defender contradiction D1 only (35067 shape minus D4)',base,[X('DEFENDER',1)],F0],
 ['P4 challenger contradiction C1; both C1 lines planted DEFENDER LINK BROKEN (no line can take it)',sub(base,[[/^D1 vs C1 \(Matthew 1:25\): CHALLENGER LINK BROKEN/m,'D1 vs C1 (Matthew 1:25): DEFENDER LINK BROKEN'],[/^D2 vs C1 \(Matthew 1:25\): CHALLENGER LINK BROKEN/m,'D2 vs C1 (Matthew 1:25): DEFENDER LINK BROKEN'],...BRK]),[X('CHALLENGER',1)],FB],
 ['P5 order A: challenger C5 then defender D3, D3 vs C5 judge DEFENDER LINK BROKEN',sub(base,[D3C5,...BRK]),[X('CHALLENGER',5),X('DEFENDER',3)],FB],
 ['P6 order B: defender D3 then challenger C5 (same as P5 reversed)',sub(base,[D3C5,...BRK]),[X('DEFENDER',3),X('CHALLENGER',5)],FB],
 ['P7 bold grade: D3 vs C5 **DEFENDER LINK BROKEN**, challenger C5',sub(base,[[D3C5[0],'D3 vs C5 (Luke 3:23): **DEFENDER LINK BROKEN**'],...BRK]),[X('CHALLENGER',5)],FB],
 ['P8 defender contradiction D3 on a line the judge graded DEFENDER LINK BROKEN (same side)',sub(base,[D3C5,...BRK]),[X('DEFENDER',3)],FB],
 ['P9 both sides on two lines: defender D1 and challenger C1 (D1 vs C1 judge CHALLENGER)',base,[X('DEFENDER',1),X('CHALLENGER',1)],F0],
];
(async()=>{const out={};for(const [lab,f] of [['s130','/mnt/project-files/wall2024/fetchback_live_s130.json'],['CMX','/mnt/project-files/wall2024/fetchback_live_s132.json']]){const code=hook(code0f(f));console.log('######',lab);
 for(const [nm,t,conf,FF] of cases){globalThis.__T=cr=>cr('luna',t,FF,[],[],null);const o=await run(code,'Panel Cure Check',RD0,over(conf));delete globalThis.__T;
  if(o.err){console.log(nm,'ERR',o.err);continue;}const r=o[0]||{};const s='tag '+JSON.stringify(r.tag)+' result '+JSON.stringify(r.result)+' fields '+JSON.stringify(r.fields||{});console.log('##',nm,'|',s);(r.trig||[]).forEach(x=>console.log('   trig:',x));
  out[nm]=out[nm]||{};out[nm][lab]=s+' '+JSON.stringify(r.trig||[]);}}
 console.log('\nSUMMARY');for(const k in out)console.log(out[k].s130===out[k].CMX?'same   ':'CHANGED',k.slice(0,3));})();
