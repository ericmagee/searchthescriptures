const fs=require('fs');const W=JSON.parse(fs.readFileSync('/mnt/project-files/wall2024/parent_s160_WVR6.json')).nodes.find(n=>n.name==='Close Enforcer Build').parameters.jsCode;
const i=W.indexOf('const cecWvr=');let d=0,j=i;for(;j<W.length;j++){if(W[j]==='{')d++;if(W[j]==='}'){d--;if(d===0&&W.slice(j,j+3)==='};\n'||(d===0&&W.slice(j+1,j+2)===';'))break;}}
const f=new Function(W.slice(i,j+2)+';return cecWvr;')();
let ok=0,n=0;const run=(nm,F,exp)=>{n++;const o=f(F,[]);const got=o.length;if(got===exp)ok++;console.log((got===exp?'AS EXPECTED ':'NOT AS EXPECTED ')+nm+' -> '+got+(o[0]?' | '+o[0].earlier_q.slice(0,70)+' || '+o[0].closing_q.slice(0,70):''));};
const B={cr2:'',cr3:'',cr4:'',gr2:'',dr3:'',dr4:''};
run('rev6: withdrawal list "Matthew 1:16, 18 and 20", close Matthew 1:20',{...B,cr2:'I withdraw Matthew 1:16, 18 and 20.',cr4:'## D2\nD2 rests on Matthew 1:20.'},1);
run('rev6: list with range "Matthew 1:18, 20-22", close 1:21',{...B,cr2:'I withdraw Matthew 1:21.',cr4:'## D2\nD2 rests on Matthew 1:18, 20-22.'},1);
run('rev6: "Luke 9:34, 1 Samuel 16:13" withdrawal Luke 9:1 not matched',{...B,cr2:'I withdraw Luke 9:1.',cr4:'## D2\nD2 rests on Luke 9:34, 1 Samuel 16:13.'},0);
run('rev6: prose number after list "Matthew 1:18, 20 times" (false)',{...B,cr2:'I withdraw Matthew 1:20.',cr4:'## D2\nD2 rests on Matthew 1:18, cited 20 times.'},0);
run('rev6: bare number then word "Matthew 1:18, 2 witnesses"',{...B,cr2:'I withdraw Matthew 1:2.',cr4:'## D2\nD2 rests on Matthew 1:18, 2 witnesses agree.'},0);
run('rev6: list after semicolon "Matthew 1:18; 20"',{...B,cr2:'I withdraw Matthew 1:20.',cr4:'## D2\nD2 rests on Matthew 1:18; 20.'},1);
run('rev6: G3 six words "For that very same reason, I withdraw it."',{...B,cr2:'Galatians 4:4 does not exclude a father. For that very same reason, I withdraw it.',cr4:'## D6\nD6 rests on Galatians 4:4.'},1);
run('rev6: seven+ words before I (stated limit, not named)',{...B,cr2:'Galatians 4:4 does not exclude a father. Having weighed the rows the challenger pressed, I withdraw it.',cr4:'## D6\nD6 rests on Galatians 4:4.'},0);
run('rev6: quotation before I blocks look-back',{...B,cr2:'Galatians 4:4 is weak. He said "drop it", so I withdraw it.',cr4:'## D6\nD6 rests on Galatians 4:4.'},0);
run('rev6: lead phrase naming another verse "Since Luke 1:35 stands, I withdraw it."',{...B,cr2:'Galatians 4:4 is weak. Since Luke 1:35 stands, I withdraw it.',cr4:'## D6\nD6 rests on Galatians 4:4.'},0);
run('rev6: challenger list withdrawal "Romans 1:3, 4"',{...B,gr2:'I withdraw Romans 1:3, 4.',dr3:'LINK 2: x',dr4:'**LINK 2**\nC2 rests on Romans 1:4.'},1);
console.log(ok+' of '+n);
