const fs=require('fs');const K=JSON.parse(fs.readFileSync('keep.json','utf8'));
const mk=(file,node)=>{let d=JSON.parse(fs.readFileSync(file));d=d.data||d;d=d.workflow||d;const t=d.nodes.find(n=>n.name==='Shared Library').parameters.jsCode;
 const L=JSON.parse(t.slice(t.indexOf('\n/*LIB*/')+8,t.lastIndexOf('\n/*MAP*/'))),M=JSON.parse(t.slice(t.lastIndexOf('\n/*MAP*/')+8,t.lastIndexOf('\n/*END*/')));
 const o=[];for(const p of M[node].p){if(Array.isArray(p)){if(typeof p[0]==='string')o.push(p[0]);else for(let i=p[0];i<=p[1];i++)o.push(L[i]);}else o.push(L[p]);}let s=o.join('\n');let i=s.lastIndexOf('\nconst PASS=');if(i<0)throw new Error('no PASS in '+node);s=s.slice(0,i)+'\nreturn __H(n=>eval(n));'+s.slice(i);
 return fn=>new Function('$','$input','__H',s)(()=>{throw new Error('no $')},{},fn);};
module.exports={mk,K};
if(require.main===module){
const live=mk('/mnt/project-files/wall2024/fetchback_live_s119.json','Gate Record'),cand=mk('/mnt/project-files/wall2024/parent_s119_F1.json','Gate Record');
let body=null;const walk=(v,d)=>{if(body||d>6||!v||typeof v!=='object')return;if(Array.isArray(v)){v.forEach(x=>walk(x,d+1));return;}if(v.seat==='sol'&&v.body&&v.body.messages){body=v.body;return;}for(const k in v)walk(v[k],d+1);};walk(K['Panel Judges Prep'],0);
const FL='[CR2] LINK 2: "I grant the present tense of ginōskō (G1097, ‘to know’) at Luke 1:34."';const LB='K-W DEFENDER CR2 LINK 2 #2';
const Q='[CR2] grants "the present tense of ginōskō (G1097, \'to know\') at Luke 1:34." That grammatical grant withdraws no footing.';
const P={
 '1 stored sol line':['Fact granted: Mary\'s statement describes her present state at the announcement. NOT HELD: '+Q,'NOT HELD: "It describes her state before the conception, since Luke 1:31 is future." The grant fixes the initial time.'],
 '2a lead joined by a dash':['Fact granted, her present state -- NOT HELD: '+Q,null],
 '2b lead joined by a colon':['Fact granted: NOT HELD: '+Q,null],
 '3 NOT HELD after a lead, quote of another sentence':['Fact granted: her state. NOT HELD: "It describes her state before the conception, since Luke 1:31 is future."',null],
 '4 prose, not held inside a sentence':['Fact granted. It is not held against the link because "the present tense of ginōskō (G1097, \'to know\') at Luke 1:34" is grammar.',null],
 '5 lead then bare not held':['Fact granted: her state. not held.',null],
 '6a lead says CONCEDED then NOT HELD':['CONCEDED: the grant is real. NOT HELD: '+Q,null],
 '6b REASSERTED first':['REASSERTED IN [CR4] "the state at 1:34 is therefore the state at the conception". NOT HELD: '+Q,null],
 '7 NOT HELD only inside a quotation':['The challenger wrote "The grant fails. NOT HELD by the defender is the present tense of ginōskō (G1097, \'to know\') at Luke 1:34." I answer nothing.',null],
 '9 leading spaces before NOT HELD (live accepts)':['   NOT HELD: '+Q,null],
 '10 leading bold':['**NOT HELD:** '+Q,null],
 '11 leading quote mark':['"NOT HELD: '+Q,null],
 '12 statement line only, after a lead':[null,'Fact granted: her state. NOT HELD: '+Q],
 '13 newline then NOT HELD':['Fact granted: her state\nNOT HELD: '+Q,null],
};
for(const n in P){const [rp,sp]=P[n];const text=(rp!=null?'RESPONSE: '+LB+' | '+rp+'\n':'')+(sp!=null?'STATEMENT: '+LB+' | '+sp+'\n':'');const out=[];
 for(const h of [live,cand])h(ev=>{const R=ev('ciRounds')(ev('gatePromptText2024')(body));let r;try{r=ev('cureVerdicts')([{rule:'K-W',side:'DEFENDER',link:'DEFENDER CR2 LINK 2 #2',line:FL}],{ok:true,text},{},R);}catch(e){r='ERR '+e.message;}const v=Array.isArray(r)?r:(r&&r.items)||r;const x=Array.isArray(v)?v[0]:v;out.push(typeof x==='string'?x:(x.status||x.cure_status||JSON.stringify(x).slice(0,160))+' | '+String(x.why||x.reason||'').slice(0,90));});
 console.log('##',n,'\n live:',out[0],'\n F1  :',out[1]);}
}
