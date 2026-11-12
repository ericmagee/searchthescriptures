const fs=require('fs');const W=JSON.parse(fs.readFileSync('/mnt/project-files/wall2024/parent_s160_WVR7.json')).nodes.find(n=>n.name==='Close Enforcer Build').parameters.jsCode;
const i=W.indexOf('const cecWvr=');let d=0,j=i;for(;j<W.length;j++){if(W[j]==='{')d++;if(W[j]==='}'){d--;if(d===0&&W.slice(j,j+3)==='};\n'||(d===0&&W.slice(j+1,j+2)===';'))break;}}
const f=new Function(W.slice(i,j+2)+';return cecWvr;')();
let ok=0,n=0;const run=(nm,F,exp)=>{n++;const o=f(F,[]);const got=o.length;if(got===exp)ok++;console.log((got===exp?'AS EXPECTED ':'NOT AS EXPECTED ')+nm+' -> '+got+(o[0]?' | '+o[0].earlier_q.slice(0,70)+' || '+o[0].closing_q.slice(0,70):''));};
const B={cr2:'',cr3:'',cr4:'',gr2:'',dr3:'',dr4:''};
run('rev7: "Matthew 1:18 & 20" close',{...B,cr2:'I withdraw Matthew 1:20.',cr4:'## D2\nD2 rests on Matthew 1:18 & 20.'},1);
run('rev7: withdrawal "Matthew 1:18 & 20"',{...B,cr2:'I withdraw Matthew 1:18 & 20.',cr4:'## D2\nD2 rests on Matthew 1:20.'},1);
run('rev7: "; 20" then a new clause',{...B,cr2:'I withdraw Matthew 1:20.',cr4:'## D2\nD2 rests on Matthew 1:18; 20 more rows agree.'},1);
run('rev7: semicolon then other verse with book, withdrawn Luke',{...B,cr2:'I withdraw Luke 1:20.',cr4:'## D2\nD2 rests on Matthew 1:18; Luke 1:35.'},0);
run('rev7: "; 2 Samuel 7:12" not read as verse 2',{...B,cr2:'I withdraw Matthew 1:2.',cr4:'## D2\nD2 rests on Matthew 1:18; 2 Samuel 7:12.'},0);
run('rev7: "& 1 John 5:1" not read as verse 1',{...B,cr2:'I withdraw Matthew 1:1.',cr4:'## D2\nD2 rests on Matthew 1:18 & 1 John 5:1.'},0);
console.log(ok+' of '+n);
