const fs=require('fs');const W=JSON.parse(fs.readFileSync('/mnt/project-files/wall2024/parent_s159x_WVR4.json')).nodes.find(n=>n.name==='Close Enforcer Build').parameters.jsCode;
const i=W.indexOf('const cecWvr=');let d=0,j=i;for(;j<W.length;j++){if(W[j]==='{')d++;if(W[j]==='}'){d--;if(d===0&&W.slice(j,j+3)==='};\n'||(d===0&&W.slice(j+1,j+2)===';'))break;}}
const f=new Function(W.slice(i,j+2)+';return cecWvr;')();
let ok=0,n=0;const run=(nm,F,exp)=>{n++;const o=f(F,[]);const got=o.length;if(got===exp)ok++;console.log((got===exp?'AS EXPECTED ':'NOT AS EXPECTED ')+nm+' -> '+got+(o[0]?' | '+o[0].earlier_q.slice(0,70)+' || '+o[0].closing_q.slice(0,70):''));};
const B={cr2:'',cr3:'',cr4:'',gr2:'',dr3:'',dr4:''};
run('opponent verse in clause before',{...B,cr2:"Isaiah 7:14 stands; the challenger's reading of Galatians 4:4 fails; I withdraw it.",cr4:'## D6\nD6 rests on Galatians 4:4.'},0);
run('clause-in-verse then semicolon it',{...B,cr2:'The clause "of the house of David" in Luke 1:27 is weak; I withdraw it.',cr4:'## D3\nD3 rests on Luke 1:27.'},0);
run('"If anything, I withdraw Galatians 4:4." (idiom, real)',{...B,cr2:'If anything, I withdraw Galatians 4:4 too.',cr4:'## D6\nD6 rests on Galatians 4:4.'},1);
