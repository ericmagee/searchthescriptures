// W3 grade of pkgBRF rev 5 on s117: size, scope, labels5 on all 12 copies (both checks), stored scan of 8 executions.
const fs=require('fs');const g=f=>{let d=JSON.parse(fs.readFileSync(f,'utf8'));d=d.data||d;return d.workflow||d;};
const A=g('/mnt/project-files/wall2024/fetchback_live_s117.json'),B=g('/mnt/project-files/wall2024/parent_s117_BRF5.json');const S=JSON.stringify;
const by={};A.nodes.forEach(n=>by[n.name]=n);let tot=0,d=[],other=0;B.nodes.forEach(n=>{if(S(by[n.name])!==S(n)){const ca=by[n.name].parameters.jsCode||'',cb=n.parameters.jsCode||'';tot+=cb.length-ca.length;d.push(cb.length-ca.length);if(S({...n,parameters:{...n.parameters,jsCode:0}})!==S({...by[n.name],parameters:{...by[n.name].parameters,jsCode:0}}))other++;}});
const {nodes:_a,...ra}=A,{nodes:_b,...rb}=B;console.log('DIFF nodes',d.length,'each',[...new Set(d)].join(','),'total',tot,'non-code differences',other,'nodes',A.nodes.length,B.nodes.length,'rest equal',S(ra)===S(rb));
const cut=c=>{const k=c.indexOf('const REFP=');const ke=c.indexOf('})();',k)+5;const i=c.indexOf('const C4P=');const e=c.indexOf('})();',i)+5;return [c.slice(k,ke),c.slice(i,e)];};
const mk=(W,name)=>{const [r,p]=cut(W.nodes.find(x=>x.name===name).parameters.jsCode);return new Function(r+'\n'+p+'\nreturn {REFP,C4P};')();};
const N=B.nodes.filter(n=>(n.parameters.jsCode||'').includes('const C4P=')).map(n=>n.name);
// the C4P and REFP blocks outside the two edited expressions must be equal to live
let blk=0;for(const n of N){const [ra_,pa]=cut(by[n].parameters.jsCode),[rb_,pb]=cut(B.nodes.find(x=>x.name===n).parameters.jsCode);if(ra_!==rb_)blk++;}
console.log('C4P copies',N.length,'| REFP block differs in',blk);
const a=mk(A,'Build Synthesis'),b=mk(B,'Build Synthesis');
const F1=(E,c)=>({gr1:E[0],gr2:E[1],dr3:E[2],dr4:c}),F2=(E,c)=>({cr1:E[0],gr1:'',cr2:E[1],gr2:'',cr3:E[2],dr3:'',cr4:c});
const res=(R,E,c)=>{const x=R.C4P.of(F1(E,c)),y=R.C4P.ofD(F2(E,c));return {dr:{n:[...x],u:x.u||[]},cr:{n:[...y],u:y.u||[]},note:R.C4P.note(F1(E,c)),noteD:R.C4P.noteD(F2(E,c))};};
let dis=0,bad=0;
for(const c of require('./labels5.json').cases){const l=res(a,c.E,c.c),r=res(b,c.E,c.c);let ok=true;const why=[];
 if(!c.record)for(const k of ['dr','cr']){const o=r[k];if(S(o.n)!==S(c.new)){ok=false;why.push(k+' new');}if(S(o.u)!==S(c.line)){ok=false;why.push(k+' line');}}
 if(c.same4&&S(l)!==S(r)){ok=false;why.push('differs from live');}
 for(const k of ['dr','cr'])for(const lab of l[k].n){const cv=lab.replace(/.* /,'');if(!r[k].n.some(z=>z.endsWith(cv))&&!r[k].u.some(z=>z.startsWith(cv+' '))){ok=false;why.push(k+' DROP '+lab);}}
 for(const k of ['dr','cr'])for(const e of l[k].u){const cv=e.split(' ')[0];if(!r[k].u.some(z=>z.startsWith(cv+' '))){ok=false;why.push(k+' LINE ENTRY LOST '+e);}}
 if(!ok)bad++;
 console.log(c.id,'|',c.record?'RECORD':(ok?'AS LABELLED':'NOT AS LABELLED '+why.join(',')),'\n   live new',S(l.dr.n),'line',S(l.dr.u),'\n   rev5 new',S(r.dr.n),'line',S(r.dr.u).slice(0,700),S(r.dr)===S(r.cr)?'':'\n   CR4 differs '+S(r.cr).slice(0,400),'\n   note len live',l.note.length,l.noteD.length,'rev5',r.note.length,r.noteD.length);
 for(const n of N){const z=res(mk(B,n),c.E,c.c);if(S(z)!==S(r))dis++;}}
console.log('labels not as labelled',bad,'| copies',N.length,'disagreeing',dis);
// stored scan
const Fs=[];const walk=(id,v,dp)=>{if(dp>12||v==null||typeof v!=='object')return;if(Array.isArray(v)){v.forEach(x=>walk(id,x,dp+1));return;}if((typeof v.dr4==='string'||typeof v.cr4==='string')&&typeof v.gr1==='string')Fs.push({id,F:v});for(const k in v)walk(id,v[k],dp+1);};
const seen=new Set();let n=0,dp=0,dd=0,lines=0;
for(const e of '33149 33371 33490 34299 34626 34703 34726 34780'.split(' ')){const p='/mnt/project-files/wall2024/ex'+e+'_full.json';if(!fs.existsSync(p)){console.log('no export',e);continue;}const X=JSON.parse(fs.readFileSync(p,'utf8'));const rd=(X.data||X).resultData.runData;Fs.length=0;for(const k in rd)walk(e,rd[k],0);
 for(const {F} of Fs){const k=e+'|'+(F.dr4||'').length+'|'+(F.cr4||'').length;if(seen.has(k))continue;seen.add(k);n++;const p0=a.C4P.note(F),p1=b.C4P.note(F),d0=a.C4P.noteD(F),d1=b.C4P.noteD(F);
  for(const [nm,x,y] of [['DR4',a.C4P.of(F),b.C4P.of(F)],['CR4',a.C4P.ofD(F),b.C4P.ofD(F)]]){if((x.u||[]).length){lines++;console.log(e,nm,'line live',S(x.u),'| rev5',S(y.u),'| NEW list equal',S([...x])===S([...y]));}}
  if(p0!==p1)dp++;if(d0!==d1)dd++;}}
console.log('distinct stored F:',n,'| with a book line on live:',lines,'| press notes differing:',dp,'| CR4 notes differing:',dd);
