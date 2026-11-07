// pkgEAI test. Run from wall2024/: node pkgEAI/test_EAI.cjs
// Every saved run, Judge Enforcer Build and Alt: base (live s45 Builds) vs patched on the same input. Lists every E-ANS / E-HOLD item that gains a
// block, checks calls <= 8, not_checked unchanged, all other ids equal. Then replays the Records on the stored 33389 replies with the new blocks fed in,
// and lists every push the pkgEAW / pkgEAH holds now catch.
const fs=require('fs');const {harness}=require('../pkgGSL/harness.cjs');const D='/mnt/project-files/wall2024/inputs/';
const W=JSON.parse(fs.readFileSync('/mnt/project-files/wall2024/fetchback_live_s45.json','utf8'));const live=n=>W.nodes.find(z=>z.name===n).parameters.jsCode;
let ok=0,bad=0;const out=[];const log=s=>{out.push(s);console.log(s);};const T=(c,m)=>{if(c){ok++;out.push('OK '+m);}else{bad++;log('FAIL '+m);}};
// unit
{const L=fs.readFileSync(__dirname+'/eai_lib.js','utf8');const eai=new Function(L+'\nreturn eaiBlock;')();
 const R={DR3:'Answers to the presses:\n\nMEANS [CR3] P3.1: "the row concerns a priestly register."\n\n- [L1] Grant the priestly setting of Ezra 2:61: "of the children of the priests".\n- [L2] The register\'s verb is *yachas* (H3187).\n- [L4] It fits the narrowed link.\n\nNext para.',
  CR3:'Para one. I grant it.\n\nPara two. I grant it.'};
 const b=eai(R,['DR3'],'Grant the priestly setting of Ezra 2:61');T(!!b&&b.t.startsWith('- [L1] Grant')&&/\[L4\]/.test(b.t)&&!/Next para/.test(b.t),'U1 bullet group found by its opening words, ends at the blank line');
 const c=eai({DR3:'- [L1] Hebrews 7:10: "x y z."\n- [L4] Grant the remote reach [L2]. The verse places Levi.\n\nZ'},['DR3'],'Grant the remote reach');T(!!c&&c.t.startsWith('- [L1] Hebrews'),'U2 a later bullet pulls in the bullets above it');
 T(eai(R,['CR3'],'I grant it.')===null,'U3 a 3-word answer in two paragraphs is refused');T(eai(R,['CR3'],'I grant')===null,'U4 under 3 words is never searched');
 T(eai(R,['DR3'],'words that stand nowhere in the round')===null,'U5 no hit, no block');}
const runs=fs.readdirSync(D).filter(f=>/_Judge_Enforcer_Record\.json$/.test(f)&&!/_Alt_/.test(f)).map(f=>f.split('_')[0]).sort();let gain=0;
for(const RUN of runs)for(const [bn,bi,rn,ri] of [['Judge Enforcer Build','Enforcer Record','Judge Enforcer Record','Judge Enforcer Call deepseek'],['Alt Judge Enforcer Build','Alt Seated','Alt Judge Enforcer Record','Alt Judge Enforcer Call deepseek']]){
 let b0,b1;try{b0=harness(RUN)(live(bn),bi);b1=harness(RUN)(fs.readFileSync(__dirname+'/patched/'+bn.replace(/ /g,'_')+'.js','utf8'),bi);}catch(e){T(false,RUN+' '+bn+' threw '+e.message.slice(0,100));continue;}
 const J0=b0.map(x=>x.json),J1=b1.map(x=>x.json);const I0=J0.flatMap(j=>j.ids||[]),I1=J1.flatMap(j=>j.ids||[]);let same=I0.length===I1.length,g=0;const BLK={};
 I0.forEach((x,k)=>{const y=I1[k]||{};const nb=('eaw_blk' in y)&&!('eaw_blk' in x),nh=JSON.stringify(y.eah_blk||[])!==JSON.stringify(x.eah_blk||[]);if(nb||nh){g++;BLK[y.id]=y;log('GAIN '+RUN+' '+bn+' '+x.rule+' '+x.item+' :: '+String(y.eaw_blk||(y.eah_blk||[]).slice(-1)[0]||'').slice(0,160).replace(/\n/g,' / '));}
  const a={...x},b={...y};delete a.eaw_blk;delete b.eaw_blk;delete a.eah_blk;delete b.eah_blk;if(JSON.stringify(a)!==JSON.stringify(b))same=false;});
 gain+=g;const nc0=(J0[0]||{}).not_checked||[],nc1=(J1[0]||{}).not_checked||[];
 T(same&&J1.length<=8&&nc1.length===nc0.length,RUN+' '+bn+': calls '+J0.length+' -> '+J1.length+', not checked '+nc0.length+' -> '+nc1.length+', '+g+' items gain a block');
 if(!g||!fs.existsSync(D+RUN+'_'+ri.replace(/ /g,'_')+'.json'))continue;
 /* the saved replies match the base call grouping: feed the record the base calls with the new blocks laid onto the same ids */
 const b0x=b0.map(x=>({json:{...x.json,ids:(x.json.ids||[]).map(y=>BLK[y.id]?{...y,eaw_blk:BLK[y.id].eaw_blk,...(BLK[y.id].eah_blk?{eah_blk:BLK[y.id].eah_blk}:{})}:y)}}));
 let r0,r1;try{r0=harness(RUN,{[bn]:b0})(live(rn),ri);r1=harness(RUN,{[bn]:b0x})(live(rn),ri);}catch(e){T(false,RUN+' '+rn+' threw '+e.message.slice(0,100));continue;}
 const rows=r=>r.flatMap(x=>{const j=x.json||{};return Object.values(j).filter(Array.isArray).flat().filter(z=>z&&z.rule&&'cure_reason' in z);});const A=rows(r0),B=rows(r1);
 let flips=0;A.forEach((x,k)=>{const y=B[k]||{};if(String(x.cure_reason).slice(0,40)!==String(y.cure_reason).slice(0,40)){flips++;log('HOLD '+RUN+' '+rn+' '+x.rule+' '+x.seat+' '+x.item+': '+String(x.cure_reason).slice(0,60)+' -> '+String(y.cure_reason).slice(0,90));}});
 T(A.length===B.length,RUN+' '+rn+': rows '+A.length+' -> '+B.length+', '+flips+' changed');}
log('items gaining a block: '+gain);log('TOTAL '+ok+' OK, '+bad+' FAIL');fs.writeFileSync(__dirname+'/test_EAI.txt',out.join('\n')+'\n');
