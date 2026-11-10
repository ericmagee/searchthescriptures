// W1: pkgBRF rev 4 test. For W2 plants (plants_brf3c.json) and W3 labels (w3_grade/labels3c.json): live list, 3c list, rev 4 list + book-check line,
// on all 12 nodes. NO SILENT DROP = every reference live lists is in rev 4's list or in its book-check line.
const fs=require('fs');const g=f=>{let d=JSON.parse(fs.readFileSync(f,'utf8'));d=d.data||d;return d.workflow||d;};
const A=g('/mnt/project-files/wall2024/fetchback_live_s115.json'),C=g('/mnt/project-files/wall2024/parent_s115_BRF3c.json'),B=g(__dirname+'/parent_s116_BRF5.json');const S=JSON.stringify;
const mk=(W,name)=>{const c=W.nodes.find(x=>x.name===name).parameters.jsCode;const k=c.indexOf('const REFP=');const ke=c.indexOf('})();',k)+5;const i=c.indexOf('const C4P=');const e=c.indexOf('})();',i)+5;return new Function(c.slice(k,ke)+'\n'+c.slice(i,e)+'\nreturn {REFP,C4P};')();};
const N=B.nodes.filter(n=>(n.parameters.jsCode||'').includes('const C4P=')).map(n=>n.name);
const cases=[];for(const p of JSON.parse(fs.readFileSync(__dirname+'/../w2_grades/brf/plants_brf3c.json')))cases.push({id:'W2 '+p.id,F:p.F,FD:p.FD});
const L3=JSON.parse(fs.readFileSync(__dirname+'/w3_grade/labels3c.json'));for(const c of L3.cases){cases.push({id:'W3 '+c.id+' DR4',F:{gr1:c.E,gr2:'',dr3:'',dr4:c.c}});cases.push({id:'W3 '+c.id+' CR4',FD:{cr1:c.E,gr1:'',cr2:'',gr2:'',cr3:'',dr3:'',cr4:c.c}});}
for(const c of JSON.parse(fs.readFileSync(__dirname+'/w3_grade/labels.json')).cases)cases.push({id:'W3 '+c.id+' rev3 set',F:{gr1:c.earlier[0]||'',gr2:c.earlier[1]||'',dr3:c.earlier[2]||'',dr4:c.c4}});
const run=(h,p)=>p.F?{l:h.C4P.of(p.F),t:h.C4P.note(p.F)}:{l:h.C4P.ofD(p.FD),t:h.C4P.noteD(p.FD)};
const a=mk(A,'Build Synthesis'),c3=mk(C,'Build Synthesis');let drops=0,dis=0,diff3=0;
for(const p of cases){const x=run(a,p),y=run(c3,p);const outs=new Set(N.map(n=>{const z=run(mk(B,n),p);return S({l:z.l,u:z.l.u||[],t:z.t});}));if(outs.size>1)dis++;const z=JSON.parse([...outs][0]);
 if(S(z.l)!==S(y.l))diff3++;const lost=x.l.filter(r=>!z.l.includes(r)&&!z.u.some(q=>q.startsWith(r.replace(/.* /,''))));drops+=lost.length;
 console.log(p.id,'| live',S(x.l),'| 3c',S(y.l),'| rev4',S(z.l),'book line',S(z.u),lost.length?'SILENT DROP '+S(lost):'');}
console.log('cases',cases.length,'| nodes',N.length,'| copies disagreeing',dis,'| rev4 list differs from 3c list',diff3,'| silent drops',drops);
const p0=cases[0];console.log('SAMPLE press note, W2 Q1:',S(run(mk(B,'Build Synthesis'),p0).t));
