// W2 grade scan for pkgWVS: cecWvr of live s167 against the package, on corpus2 (81) and W4's stored set (91). Lists every changed candidate and every scope sentence.
const fs=require('fs');const g=f=>{let d=JSON.parse(fs.readFileSync(f,'utf8'));d=d.data||d;return d.workflow||d;};
const fnOf=f=>{const s=g(f).nodes.find(n=>n.name==='Close Enforcer Build').parameters.jsCode;const i=s.indexOf('const cecWvr=');const j=s.indexOf('\nconst ',i+10);return new Function(s.slice(i,j)+'\nreturn cecWvr;')();};
const [L,K]=process.argv.slice(2,4).map(fnOf);
const sets=[['corpus2',require('/mnt/project-files/w3/grade_WVR/corpus2.json').map(r=>({run:String(r.run),F:{cr2:r.cr2||'',cr3:r.cr3||'',cr4:r.cr4||'',gr2:r.gr2||'',dr3:r.dr3||'',dr4:r.dr4||''}}))],
 ['W4 stored',require('/mnt/project-files/w4/kgl/stored.json').map(r=>({run:r.id.slice(0,8),F:{cr2:r.claude_r2||'',cr3:r.engine_r3||'',cr4:r.defender_r4||'',gr2:r.engine_r2||'',dr3:r.challenger_r3||'',dr4:r.challenger_r4||''}}))]];
const key=c=>c.side[0]+' LINK '+c.n;
for(const [nm,rows] of sets){let add=0,lost=0,sc=0,ch=0,d=0;for(const {run,F} of rows){let a,b;try{a=L(F,[]);b=K(F,[]);}catch(e){console.log(nm,run,'THROW',e.message);continue;}
 const sa=a.map(key),sb=b.map(key);const ja=JSON.stringify(a),jb=JSON.stringify(b);d+=jb.length-ja.length;
 const p=sb.filter(x=>!sa.includes(x)),m=sa.filter(x=>!sb.includes(x));add+=p.length;lost+=m.length;
 b.forEach(c=>{const t=JSON.stringify(c);const mm=t.match(/limits the withdrawal to \\"([^\\]*)\\"/);if(mm){sc++;console.log(nm,run,key(c),'scope: '+mm[1]);}});
 if(ja!==jb){ch++;if(p.length||m.length)console.log(nm,run,'+',p.join(','),'-',m.join(','));}}
 console.log('==',nm,'runs',rows.length,'changed',ch,'candidates added',add,'lost',lost,'scope sentences',sc,'candidate JSON chars',d);}
