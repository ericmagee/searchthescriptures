const fs=require('fs');const W=JSON.parse(fs.readFileSync('/mnt/project-files/wall2024/parent_s158_WVR3.json')).nodes.find(n=>n.name==='Close Enforcer Build').parameters.jsCode;
const i=W.indexOf('const cecWvr=');let d=0,j=i;for(;j<W.length;j++){if(W[j]==='{')d++;if(W[j]==='}'){d--;if(d===0&&W.slice(j,j+3)==='};\n'||(d===0&&W.slice(j+1,j+2)===';'))break;}}
const f=new Function(W.slice(i,j+2)+';return cecWvr;')();
let ok=0,n=0;const run=(nm,F,exp)=>{n++;const o=f(F,[]);const got=o.length;if(got===exp)ok++;console.log((got===exp?'AS EXPECTED ':'NOT AS EXPECTED ')+nm+' -> '+got+(o[0]?' | '+o[0].earlier_q.slice(0,70)+' || '+o[0].closing_q.slice(0,70):''));};
const B={cr2:'',cr3:'',cr4:'',gr2:'',dr3:'',dr4:''};
// 1 Luke 1:27 stored form, plain (no bold)
run('scoped clause, no bold marks',{...B,cr2:"Mary's descent from David is not left to Luke 1:27. I concede the KJV's clause \"of the house of David\" in Luke 1:27 can attach to Joseph, and I do not rest on it.",cr4:'## D3\nD3 rests on Matthew 1:25 with Luke 1:27 and 1:34.'},0);
// 2 whole-verse it after clause-free sentence: must name
run('"I do not rest on it" with verse as object',{...B,cr2:'Luke 1:27 is contested, and I do not rest on it.',cr4:'## D3\nD3 rests on Luke 1:27.'},1);
// 3 "the word in Luke 1:27" then it -> should not name (stated)
run('"the word ... in Luke 1:27", then it',{...B,cr2:'The word "espoused" in Luke 1:27 is disputed, and I do not rest on it.',cr4:'## D3\nD3 rests on Luke 1:27.'},0);
// 4 own-clause it: it in next clause after semicolon refers elsewhere
run('it in a later clause after a semicolon',{...B,cr2:'Isaiah 7:14 is plain; the challenger reads Micah 5:2 another way, and I drop it.',cr4:'## D2\nD2 rests on Isaiah 7:14.'},0);
// 5 comma-bounded condition: condition inside own clause still holds
run('condition in the same clause: "If the court requires, I withdraw"',{...B,cr2:'If the court requires it I withdraw Isaiah 7:14.',cr4:'## D2\nD2 rests on Isaiah 7:14.'},0);
// 6 comma after a non-condition intro
run('"For clarity, I withdraw X" (not a condition)',{...B,cr2:'For clarity, I withdraw Isaiah 7:14.',cr4:'## D2\nD2 rests on Isaiah 7:14.'},1);
// 7 prefix abbreviations
run('"Jud 6:12" close after Judges 6:12 withdrawn',{...B,cr2:'I withdraw Judges 6:12.',cr4:'## D2\nD2 rests on Judg 6:12.'},1);
run('"Jude 1:6" withdrawn, close Judges 1:6',{...B,cr2:'I withdraw Jude 1:6.',cr4:'## D2\nD2 rests on Judges 1:6.'},0);
run('"Phil 2:7" close after Philippians 2:7 withdrawn',{...B,cr2:'I withdraw Philippians 2:7.',cr4:'## D2\nD2 rests on Phil 2:7.'},1);
run('"Philem 1:10" close after Philippians 1:10 withdrawn',{...B,cr2:'I withdraw Philippians 1:10.',cr4:'## D2\nD2 rests on Philem 1:10.'},0);
// 8 colon after verse
run('"Luke 1:5: I withdraw it."',{...B,cr2:'Luke 1:5: I withdraw it.',cr4:'## D2\nD2 rests on Luke 1:5.'},1);
// 9 staying list
run('"I drop Genesis 3:15, and Galatians 4:4 stays" close Gal 4:4',{...B,cr2:'I drop Genesis 3:15, and Galatians 4:4 stays.',cr4:'## D2\nD2 rests on Galatians 4:4.'},0);
run('"I drop Genesis 3:15 and Galatians 4:4." close Gal 4:4',{...B,cr2:'I drop Genesis 3:15 and Galatians 4:4.',cr4:'## D2\nD2 rests on Galatians 4:4.'},1);
// 10 bold after period
run('bold heading verse then withdrawal',{...B,cr2:'**Luke 1:27.** I withdraw Luke 1:27 from D3.',cr4:'## D3\nD3 rests on Luke 1:27.'},1);
// 11 "has not answered" close
run('"has not answered that D6 rests on X"',{...B,cr2:'I withdraw Galatians 4:4.',cr4:'## D6\nThe challenger has not answered that D6 rests on Galatians 4:4.'},1);
console.log(ok+' of '+n);
