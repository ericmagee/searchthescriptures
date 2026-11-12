const fs=require('fs');const W=JSON.parse(fs.readFileSync('/mnt/project-files/wall2024/parent_s159x_WVR4.json')).nodes.find(n=>n.name==='Close Enforcer Build').parameters.jsCode;
const i=W.indexOf('const cecWvr=');let d=0,j=i;for(;j<W.length;j++){if(W[j]==='{')d++;if(W[j]==='}'){d--;if(d===0&&W.slice(j,j+3)==='};\n'||(d===0&&W.slice(j+1,j+2)===';'))break;}}
const f=new Function(W.slice(i,j+2)+';return cecWvr;')();
let ok=0,n=0;const run=(nm,F,exp)=>{n++;const o=f(F,[]);const got=o.length;if(got===exp)ok++;console.log((got===exp?'AS EXPECTED ':'NOT AS EXPECTED ')+nm+' -> '+got+(o[0]?' | '+o[0].earlier_q.slice(0,70)+' || '+o[0].closing_q.slice(0,70):''));};
const B={cr2:'',cr3:'',cr4:'',gr2:'',dr3:'',dr4:''};const C='## D6\nD6 rests on Galatians 4:4.';
run('"Unless he answers, I drop Galatians 4:4."',{...B,cr2:'Unless he answers, I drop Galatians 4:4.',cr4:C},0);
run('"Should the court ask, I withdraw Galatians 4:4."',{...B,cr2:'Should the court ask, I withdraw Galatians 4:4.',cr4:C},0);
run('"Once he shows a row, I withdraw Galatians 4:4."',{...B,cr2:'Once he shows a row, I withdraw Galatians 4:4.',cr4:C},0);
run('"Provided that he shows a row, I withdraw ..."',{...B,cr2:'Provided that he shows a row, I withdraw Galatians 4:4.',cr4:C},0);
run('"If the challenger shows a row, then I withdraw ..."',{...B,cr2:'If the challenger shows a row, then I withdraw Galatians 4:4.',cr4:C},0);
run('"Even though he asks, I withdraw ..." (concessive, real)',{...B,cr2:'Even though he asks, I withdraw Galatians 4:4.',cr4:C},1);
run('withdrawal, then a conditional restore sentence',{...B,cr2:'I withdraw Galatians 4:4. If he shows a row, I will restore it.',cr4:C},1);
run('"As he asks, I withdraw ..." (not a condition)',{...B,cr2:'As he asks, I withdraw Galatians 4:4.',cr4:C},1);
run('F2 with "so": "...third layer; so I drop it."',{...B,cr2:'Galatians 4:4 was my third layer; so I drop it.',cr4:C},1);
run('F2 with "then": "...; then I withdraw it."',{...B,cr2:'Galatians 4:4 was my third layer; then I withdraw it.',cr4:C},1);
run('semicolon, clause before names the opponent verse',{...B,cr2:"Isaiah 7:14 stands; the challenger's reading of Galatians 4:4 fails; I withdraw it.",cr4:C},0);
run('semicolon chain, "it" clause names a verse itself',{...B,cr2:'Galatians 4:4 was my third layer; I withdraw Luke 2:4 instead.',cr4:C},0);
run('challenger side F2 form',{...B,gr2:'Romans 1:3 was my second layer; I withdraw it.',dr3:'LINK 2: x',dr4:'**LINK 2**\nC2 rests on Romans 1:3.'},1);
console.log(ok+' of '+n);
