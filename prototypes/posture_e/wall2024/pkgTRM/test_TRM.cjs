// pkgTRM test. Run from wall2024/: node pkgTRM/test_TRM.cjs
// Every saved run 33218+: (1) each patched node's output equals base output minus the dropped keys; (2) the next nodes, fed the trimmed outputs,
// give byte-equal output to base: Gate Build, Gate Record, Alternate Merge Seat, Alternate Merge (when the alternate path ran); (3) bytes saved.
const fs=require('fs');const {harness,feeder}=require('../pkgGSL/harness.cjs');const D='/mnt/project-files/wall2024/inputs/';const BASEW='/mnt/project-files/wall2024/fetchback_live_s45.json';
const B='pkgL1Q/patched/',P=__dirname+'/patched/';const rf=(d,n)=>fs.readFileSync(d+n.replace(/ /g,'_')+'.js','utf8');const has=(R,n)=>fs.existsSync(D+R+'_'+n.replace(/ /g,'_')+'.json');
let ok=0,bad=0;const out=[];const log=s=>{out.push(s);console.log(s);};const T=(c,m)=>{if(c){ok++;out.push('OK '+m);}else{bad++;log('FAIL '+m);}};
const st=x=>JSON.stringify(x);const drop=(o,ks)=>o.map(it=>{const j={...it.json};for(const k of ks)delete j[k];return {...it,json:j};});
const inOf=(R,n)=>{const f=feeder(BASEW,n);return [...f.filter(x=>/Call/.test(x)),...f.filter(x=>!/Call/.test(x))].find(x=>has(R,x));};
const runs=fs.readdirSync(D).filter(f=>/^\d+_Send_Back_Record\.json$/.test(f)).map(f=>f.split('_')[0]).filter(r=>+r>=33218).sort();
let saved=0;
for(const RUN of runs)for(const pre of ['','Alt ']){
 const N={sbb:pre+'Send Back Build',sbr:pre+'Send Back Record',gb:pre+'Gate Build',gr:pre+'Gate Record'};if(!has(RUN,N.sbr))continue;
 const ov0={},ov1={};let fail=false;
 for(const [k,ks] of [['sbb',['enf428_rows','enf421_rows']],['sbr',['enf428_rows','enf421_rows']],['gr',['enf428_rows','enf421_rows','sb_rows']]]){const n=N[k];if(!has(RUN,n))continue;const inp=inOf(RUN,n);if(!inp)continue;
  let a,b,e0=null,e1=null;try{a=harness(RUN,ov0)(rf(B,n),inp);}catch(e){e0=String(e.message).slice(0,100);}try{b=harness(RUN,ov1)(rf(P,n),inp);}catch(e){e1=String(e.message).slice(0,100);}
  if(e0||e1){T(e0===e1,RUN+' '+n+': base and patched throw the same on this old saved input ('+e0+')');fail=true;break;}
  const eq=st(drop(a,ks))===st(b);const sv=st(a).length-st(b).length;saved+=sv;T(eq,RUN+' '+n+': output = base minus '+ks.join(', ')+' ('+Math.round(sv/1000)+'K less)');
  ov0[n]=a;ov1[n]=b; /* the next nodes read these */
  if(k==='sbr'&&has(RUN,N.gb)){const x0=harness(RUN,ov0)(rf(B,N.gb),N.sbr),x1=harness(RUN,ov1)(rf(B,N.gb),N.sbr);T(st(x0)===st(x1),RUN+' '+N.gb+': equal on the trimmed Send Back Record output');}}
 if(fail)continue;
 const tail=pre?['Alternate Merge']:['Alternate Merge Seat'];
 for(const n of tail){if(!has(RUN,n))continue;const inp=inOf(RUN,n);if(!inp)continue;let a,b;try{a=harness(RUN,ov0)(rf(B,n),inp);b=harness(RUN,ov1)(rf(B,n),inp);}catch(e){T(false,RUN+' '+n+' threw '+String(e.message).slice(0,120));continue;}
  T(st(a)===st(b),RUN+' '+n+': byte-equal when fed the trimmed outputs');}}
log('bytes not copied over all checked node outputs: '+Math.round(saved/1000)+'K');log('TOTAL '+ok+' OK, '+bad+' FAIL');fs.writeFileSync(__dirname+'/test_TRM.txt',out.join('\n')+'\n');
