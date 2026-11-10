// W3 regrade of pkgBRF rev 3c: live s115 against parent_s115_BRF3c.json; both checks (of on [DR4], ofD on [CR4]); 12 copies; diff and size; old labels too.
const fs=require('fs');const g=f=>{let d=JSON.parse(fs.readFileSync(f,'utf8'));d=d.data||d;return d.workflow||d;};
const A=g('/mnt/project-files/wall2024/fetchback_live_s115.json'),B=g('/mnt/project-files/wall2024/parent_s115_BRF3c.json');const S=JSON.stringify;
const by={};A.nodes.forEach(n=>by[n.name]=n);let tot=0,names=[],other=0;B.nodes.forEach(n=>{if(S(by[n.name])!==S(n)){const ca=by[n.name].parameters.jsCode||'',cb=n.parameters.jsCode||'';tot+=cb.length-ca.length;names.push(n.name+' '+(cb.length-ca.length));if(S({...n,parameters:{...n.parameters,jsCode:0}})!==S({...by[n.name],parameters:{...by[n.name].parameters,jsCode:0}}))other++;}});
console.log('DIFF nodes',names.length,'|',names.join('; '),'| total',tot,'| non-code differences',other,'| nodes',A.nodes.length,B.nodes.length,'| connections equal',S(A.connections)===S(B.connections));
const cut=c=>{const k=c.indexOf('const REFP=');const ke=c.indexOf('})();',k)+5;const i=c.indexOf('const C4P=');const e=c.indexOf('})();',i)+5;return [c.slice(k,ke),c.slice(i,e)];};
const mk=(W,name)=>{const [r,p]=cut(W.nodes.find(x=>x.name===name).parameters.jsCode);return new Function(r+'\n'+p+'\nreturn {REFP,C4P};')();};
let rp=0;for(const n of B.nodes){const f=c=>{const k=c.indexOf('const REFP=');return k<0?'':c.slice(k,c.indexOf('})();',k));};if(f(by[n.name].parameters.jsCode||'')!==f(n.parameters.jsCode||''))rp++;}console.log('nodes whose REFP text differs:',rp);
const N=B.nodes.filter(n=>(n.parameters.jsCode||'').includes('const C4P=')).map(n=>n.name);
const a=mk(A,'Build Synthesis'),b=mk(B,'Build Synthesis');
const both=(R,E,c)=>[R.C4P.of({gr1:E,gr2:'',dr3:'',dr4:c}),R.C4P.ofD({cr1:E,gr1:'',cr2:'',gr2:'',cr3:'',dr3:'',cr4:c})];
const L=require('./labels3c.json').cases.concat(require('./labels.json').cases.map(c=>({id:c.id,E:c.earlier.join('\n'),c:c.c4,expect:c.expect,expect_count:c.expect_count})));
for(const c of L){const [x,xd]=both(a,c.E,c.c),[y,yd]=both(b,c.E,c.c);const ok=c.expect?S(y)===S(c.expect):c.expect_has?c.expect_has.every(l=>y.includes(l)):c.expect_count!=null?y.length===c.expect_count:null;
 console.log(c.id,'live',S(x),'| 3c',S(y),'|',ok===null?'RECORD':ok?'AS LABELLED':'NOT AS LABELLED','| CR4 path same as DR4 path: live',S(x)===S(xd),'3c',S(y)===S(yd));}
let dis=0;for(const n of N){const z=mk(B,n);for(const c of L)if(S(both(z,c.E,c.c))!==S(both(b,c.E,c.c)))dis++;}console.log('C4P copies',N.length,'disagreeing with Build Synthesis:',dis);
const [,p0]=cut(by['Build Synthesis'].parameters.jsCode),[,p1]=cut(B.nodes.find(x=>x.name==='Build Synthesis').parameters.jsCode);let i=0;while(p0[i]===p1[i])i++;let j=0;while(p0[p0.length-1-j]===p1[p1.length-1-j])j++;console.log('EDIT live:',p0.slice(i-60,p0.length-j+20));console.log('EDIT 3c  :',p1.slice(i-60,p1.length-j+20));
