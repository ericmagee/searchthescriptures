// pkgKSN plants on Panel Cure Check cureRecompute (luna's original 35067 text), W2's joint vs joint+KSN. Harness from w1_grade_CMX/plants.cjs.
const fs=require('fs');const run=require(process.cwd()+'/pkgKSR/run_node.cjs');
const rebuild=(stub,lib)=>{let i=stub.indexOf('\nreturn await new Function(');if(i<0)i=stub.indexOf('\nconst __e4h');const $=n=>({params:{jsCode:lib}});return new Function('$',stub.slice(0,i)+'\nreturn __S;')($);};
const code0f=f=>{let D=JSON.parse(fs.readFileSync(f));D=D.data||D;const W=D.workflow||D;return rebuild(W.nodes.find(x=>x.name==='Panel Cure Check').parameters.jsCode,W.nodes.find(x=>x.name==='Shared Library').parameters.jsCode);};
const RD0=JSON.parse(fs.readFileSync('/mnt/project-files/wall2024/ex35067_full.json','utf8')).data.resultData.runData;
const base=JSON.parse(fs.readFileSync(process.env.J1||'/tmp/claude-0/cmx/judge_luna.json')).reasoning;
const hook=c=>{const L2=c.split('\n');L2.splice(1389,0,'if(globalThis.__T)return [{json:globalThis.__T(cureRecompute)}];');return L2.join('\n');};
const over=conf=>({'Close Enforcer Record':[[{json:{cec:{confirmed:conf}}}]],'Judge Contradiction Record':[[{json:{jcc:{confirmed:[]}}}]]});
const X=(side,link)=>({side,link,earlier_round:side==='DEFENDER'?'DR3':'CR3',earlier_q:'planted earlier line',closing_round:side==='DEFENDER'?'DR4':'CR4',closing_q:'planted closing line'});
const KR=/^KEYSTONE: D5 -- STANDS -- .*$/m;const key=r=>{if(!KR.test(base))throw new Error('anchor');return base.replace(KR,'KEYSTONE: D5 -- STANDS -- '+r);};
const F0={verdict_tag:'HELD',defense_standing:'SELF-SUPPORTED',challenge_standing:'PROP-DEPENDENT'};
const cases=[
 ['K1 stored 35067 text, defender links 1 and 4 (expect note)',base,[X('DEFENDER',1),X('DEFENDER',4)],true],
 ['K2 "No other link is broken" (expect note)',key('the conclusion stands. No other link is broken.'),[X('DEFENDER',2)],true],
 ['K3 "all declared links stand" (expect note)',key('it is not withdrawn and all declared links stand.'),[X('DEFENDER',2)],true],
 ['K4 "it is not itself broken" (about the keystone; expect no note)',key('The conclusion link is not itself withdrawn or graded broken.'),[X('DEFENDER',2)],false],
 ['K5 keystone link 5 itself broken (STANDS to BROKEN path; expect no note)',base,[X('DEFENDER',5)],false],
 ['K6 challenger contradiction only (expect no note)',base,[X('CHALLENGER',3)],false],
 ['K7 reason makes no claim on links (expect no note)',key('the Holy Ghost is named as the source.'),[X('DEFENDER',2)],false],
 ['K8 no contradiction (expect no recompute)',base,[],false],
];
(async()=>{const R={};for(const [lab,f] of [['joint',process.env.A||'/mnt/project-files/wall2024/joint_s130_NVR_CMX.json'],['KSN',process.env.B||'/tmp/claude-0/cmx/ksn.json']]){const code=hook(code0f(f));
 for(const [nm,t,conf] of cases){globalThis.__T=cr=>cr('luna',t,F0,[],[],null);const o=await run(code,'Panel Cure Check',RD0,over(conf));delete globalThis.__T;if(o.err){console.log(lab,nm,'ERR',o.err);continue;}const r=o[0]||{};
  (R[nm]=R[nm]||{})[lab]={note:(r.trig||[]).filter(x=>/^STALE KEYSTONE/.test(x)),rest:JSON.stringify([r.tag,r.result,r.fields,(r.trig||[]).filter(x=>!/^STALE KEYSTONE/.test(x)),r.rp]).replace(/[;,] STALE KEYSTONE REASON D\d+ \([^)]*\)/g,'')};}}
 let bad=0;for(const [nm,,,exp] of cases){const j=R[nm].joint,k=R[nm].KSN;const ok=(k.note.length>0)===exp&&j.note.length===0&&j.rest===k.rest;if(!ok)bad++;console.log(ok?'OK   ':'WRONG',nm,'| note:',k.note[0]||'none','| all else equal to joint:',j.rest===k.rest);}
 console.log('plants',cases.length,'wrong',bad);})();
