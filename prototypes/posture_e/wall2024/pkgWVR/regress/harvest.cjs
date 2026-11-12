// Builds regress.json: every plant from every grade of pkgWVR (W1 plants.cjs, W3 plant*.cjs, W2 plants_w2*.cjs), with its expected answer.
const fs=require('fs');const B={cr2:'',cr3:'',cr4:'',gr2:'',dr3:'',dr4:''};const REC=[];
const W3='/mnt/project-files/w3/grade_WVR/',W2=__dirname+'/../../w2_grades/wvr/';
const files=[[W3+'plant.cjs','W3'],[W3+'plant_r2.cjs','W3'],[W3+'plant2.cjs','W3'],[W3+'plant3.cjs','W3'],[W3+'plant4.cjs','W3b'],[W2+'plants_w2.cjs','W2'],[W2+'plants_w2_rev2.cjs','W2'],[W2+'plants_w2_rev3.cjs','W2'],[W2+'plants_w2_rev4.cjs','W2'],[W2+'plants_w2_rev4_cross.cjs','W2'],[W2+'plants_w2_rev5.cjs','W2']];
for(const [p,k] of files){let s=fs.readFileSync(p,'utf8').split('\n');
 if(k==='W2')s=s.filter(l=>!/^const (fs|i|f)=|^const fs=require/.test(l));else s=s.filter(l=>!/require\('\.\/scan/.test(l));
 let src=s.join('\n');
 if(k==='W3')src=src.replace(/const T=\(nm,F,exp\)=>/,"const T=(nm,F,exp)=>REC.push({src:FN,name:nm,F:Object.assign({},B0,F),exp:exp});const T_=(nm,F,exp)=>");
 if(k==='W3b')src=src.replace(/const T=\(nm,a,exp,c\)=>/,"const T=(nm,a,exp,c)=>REC.push({src:FN,name:nm,F:Object.assign({},B0,{cr2:a,cr4:c||'## D6\\nD6 stands on Galatians 4:4.'}),exp:exp});const T_=(nm,a,exp,c)=>");
 if(k==='W2')src=src.replace(/const run=\((n|nm),F,exp\)=>/,"const run=(nm,F,exp)=>REC.push({src:FN,name:nm,F:Object.assign({},B0,F),exp:exp});const run_=(nm,F,exp)=>");
 const before=REC.length;new Function('REC','B0','FN','require','console',src)(REC,B,p.split('/').slice(-1)[0],require,{log(){}});console.log(p.split('/').slice(-1)[0],REC.length-before);}
// W1 plants.cjs: array P
{const s=fs.readFileSync(__dirname+'/../plants.cjs','utf8');const a=s.indexOf('const P=['),b=s.indexOf('];let ok=0;');const E={cr2:'',cr3:'',cr4:'',gr2:'',dr3:'',dr4:''};const f=o=>Object.assign({},E,o);
 const P=new Function('f','return '+s.slice(a+8,b+1))(f);for(const [n,F,want,prev,chk] of P)REC.push({src:'plants.cjs (W1)',name:n,F,exp:want,prev:prev||[],chk:chk?chk.toString():null});console.log('plants.cjs',P.length);}
// dedupe on (F, exp)
const seen=new Map();for(const r of REC){const k=JSON.stringify([r.F,r.exp,r.prev||[]]);if(!seen.has(k))seen.set(k,r);}
fs.writeFileSync(__dirname+'/regress.json',JSON.stringify([...seen.values()],null,1));console.log('total',REC.length,'unique',seen.size);
