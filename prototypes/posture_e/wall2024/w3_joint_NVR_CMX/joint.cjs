const fs=require('fs'),crypto=require('crypto');const L=require('/mnt/project-files/w4/kwn/lib.cjs');const run=require('../pkgKSR/run_node.cjs');const P='/mnt/project-files/wall2024/';
const JF=process.argv[2];const S0=L(P+'fetchback_live_s130.json'),J=L(P+JF),C=L(P+'parent_s130_CMX.json'),N=L(P+'parent_s130_NVR.json');
const raw=f=>{let d=JSON.parse(fs.readFileSync(P+f,'utf8'));d=(d.data||d).workflow||(d.data||d);return d;};
const W=raw(JF);const names=W.nodes.filter(n=>n.parameters&&typeof n.parameters.jsCode==='string').map(n=>n.name);
// header sha
const t=W.nodes.find(n=>n.name==='Shared Library').parameters.jsCode;const m=t.match(/library sha (\w+)/)[1];
const i=t.indexOf('/*LIB*/')+7;let depth=0,k=i,inS=false;for(;k<t.length;k++){const ch=t[k];if(inS){if(ch==='\\')k++;else if(ch==='"')inS=false;}else if(ch==='"')inS=true;else if(ch==='[')depth++;else if(ch===']'){depth--;if(!depth){k++;break;}}}
const lj=t.slice(i,k);const sha=s=>crypto.createHash('sha256').update(s).digest('hex').slice(0,16);
console.log('header sha',m,'computed raw',sha(lj),'computed restringify',sha(JSON.stringify(JSON.parse(lj))));
let rebuilt=0,changed=0,bad=0,err=0;const chg=[];
for(const n of names){if(n==='Shared Library')continue;let s,j,c,v;try{s=S0.code(n);j=J.code(n);c=C.code(n);v=N.code(n);}catch(e){err++;console.log('ERR',n,String(e).slice(0,100));continue;}
 rebuilt++;if(j===s)continue;changed++;const a=s.split('\n'),b=j.split('\n'),cc=c.split('\n'),vv=v.split('\n');let ok=a.length===b.length&&a.length===cc.length&&a.length===vv.length;let nl=0;
 if(ok)for(let q=0;q<a.length;q++){const want=cc[q]!==a[q]?cc[q]:vv[q];if(b[q]!==want)ok=false;if(b[q]!==a[q])nl++;if(cc[q]!==a[q]&&vv[q]!==a[q])ok=false;}
 if(!ok)bad++;chg.push(n+':'+nl+':'+(j.length-s.length));try{new Function('$','$input','$json','$node','require','return (async()=>{'+j+'\n})()');}catch(e){bad++;console.log('COMPILE FAIL',n,String(e).slice(0,80));}}
console.log('rebuilt',rebuilt,'changed',changed,'bad',bad,'err',err);console.log(chg.join(' | '));
const Sx=v=>JSON.stringify(v).replace(/20\d\d-\d\d-\d\dT\d\d:\d\d:\d\d(\.\d+)?Z/g,'<ts>');
(async()=>{for(const [e,n,ref,lab] of [['ex33490_full.json','Alt Gate Build',N,'NVR'],['ex35067_full.json','Send Back Record',N,'NVR'],['ex34780_full.json','Panel Cure Check',C,'CMX'],['ex35067_full.json','Panel Cure Check',C,'CMX'],['ex35067_full.json','Panel Cure Check',N,'NVR(should be false or equal-to-s130)'],['ex35067_full.json','Send Back Record',C,'CMX(should be false)']]){const rd=JSON.parse(fs.readFileSync(P+e,'utf8')).data.resultData.runData;const a=await run(J.code(n),n,rd),b=await run(ref.code(n),n,rd),s=await run(S0.code(n),n,rd);console.log(e.slice(2,7),n,'joint equals',lab,Sx(a)===Sx(b),'| joint equals s130',Sx(a)===Sx(s));}})();
