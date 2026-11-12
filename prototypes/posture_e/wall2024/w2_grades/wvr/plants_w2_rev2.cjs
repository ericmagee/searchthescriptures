const fs=require('fs');const W=JSON.parse(fs.readFileSync('/mnt/project-files/wall2024/parent_s158_WVR2.json')).nodes.find(n=>n.name==='Close Enforcer Build').parameters.jsCode;
const i=W.indexOf('const cecWvr=');let d=0,j=i;for(;j<W.length;j++){if(W[j]==='{')d++;if(W[j]==='}'){d--;if(d===0&&W.slice(j,j+3)==='};\n'||(d===0&&W.slice(j+1,j+2)===';'))break;}}
const f=new Function(W.slice(i,j+2)+';return cecWvr;')();
const run=(n,F,exp)=>{const o=f(F,[]);const got=o.length;console.log((got===exp?'AS EXPECTED ':'NOT AS EXPECTED ')+n+' -> '+got+(o[0]?' | '+o[0].earlier_q.slice(0,70)+' || '+o[0].closing_q.slice(0,80):''));};
const base={cr2:'',cr3:'',cr4:'',gr2:'',dr3:'',dr4:''};
run('reinstated in round 3, then cited',{...base,cr2:'I withdraw Galatians 4:4 as a witness.',cr3:'I restore Galatians 4:4: it rests the link again.',cr4:'## D6\nD6 rests on Galatians 4:4 and Luke 1:35.'},0);
run('withdrawal scoped to another link, close names other link',{...base,cr3:'LINK 2: I drop Isaiah 7:14 from link 2.',cr4:'## D5\nD5 rests on Isaiah 7:14.'},1);
run('withdraw in CR2, close uses verse as opponent footing',{...base,cr2:'I withdraw Isaiah 7:14.',cr4:'## D3\nThe challenger rests on Isaiah 7:14, and I answered it.'},0);
run('verse abbreviation in close (Gal 4:4)',{...base,cr2:'I withdraw Galatians 4:4.',cr4:'## D6\nD6 rests on Gal. 4:4 and Luke 1:35.'},1);
run('range in close (Galatians 4:4-5)',{...base,cr2:'I withdraw Galatians 4:4.',cr4:'## D6\nD6 rests on Galatians 4:4-5.'},1);
run('withdraw with range (Matthew 1:18-20), close cites 1:20',{...base,cr2:'I drop Matthew 1:18-20.',cr4:'## D2\nD2 rests on Matthew 1:20.'},1);
run('abbrev without period (Gal 4:4)',{...base,cr2:'I withdraw Galatians 4:4.',cr4:'## D6\nD6 rests on Gal 4:4 and Luke 1:35.'},1);
run('withdrawal of 1 John 3:6, close cites John 3:6',{...base,cr2:'I withdraw 1 John 3:6.',cr4:'## D6\nD6 rests on John 3:6.'},0);
run('challenger side, verse withdrawn, close rests',{...base,gr2:'I withdraw Romans 1:3.',dr3:'LINK 2: x',dr4:'**LINK 2**\nC2 rests on Romans 1:3.'},1);
run('withdraw, close negated "does not rest on"',{...base,cr2:'I withdraw Isaiah 7:14.',cr4:'## D3\nD3 does not rest on Isaiah 7:14.'},0);
run('quoted opponent withdrawal in own round',{...base,cr2:'The challenger said: "I withdraw Isaiah 7:14."',cr4:'## D3\nD3 rests on Isaiah 7:14.'},0);
