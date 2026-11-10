// pkgRLF test (W2). Runs live s106 Close Enforcer Record and the pkgRLF one on: set A (34108, both sides, W4 replies_css_s105), set C (W4 setC_replies_s106),
// and planted label forms. Close Enforcer Build (s106) is run on each run's saved data to give the Build items. Usage (from wall2024/): node pkgRLF/test_RLF.cjs
const fs=require('fs');const {harness}=require(process.cwd()+'/pkgGSL/harness.cjs');
const g=f=>{let d=JSON.parse(fs.readFileSync(f,'utf8'));d=d.data||d;return d.workflow||d;};
const L=g('/mnt/project-files/wall2024/fetchback_live_s106.json'),N=g('pkgRLF/parent_s106_RLF.json');const code=(w,n)=>w.nodes.find(z=>z.name===n).parameters.jsCode;
const S='/mnt/project-files/wall2024/staged_w4/';const fin=r=>{const x=JSON.parse(fs.readFileSync('/mnt/project-files/wall2024/inputs/'+r+'_Final_Output.json','utf8'));const y=Array.isArray(x)?x[x.length-1]:x;return ((y.data&&y.data.main)||y.main)[0][0].json;};
const cache={};async function build(r){if(cache[r])return cache[r];const F=fin(r);
 const BA=(await harness(r,{'Final Output':[{json:F}],'Resolve Seats':[{json:{deepseek:{api_model:'deepseek-flash'}}}],'Init Seats':[{json:{run_token:r}}]})('return (async()=>{\n'+code(L,'Close Enforcer Build')+'\n})();','Quote Report'));
 return cache[r]={F,BA};}
async function rec(w,r,replies){const {F,BA}=await build(r);const sides=BA.map(b=>b.json.side);const inp=sides.map(s=>({json:{choices:[{message:{content:replies[s]!=null?replies[s]:'CLOSE-CONTRADICTION: NONE'}}]}}));
 const o=await harness(r,{'Close Enforcer Build':BA,'Final Output':[{json:F}],'__R':inp})('return (async()=>{\n'+code(w,'Close Enforcer Record')+'\n})();','__R');return o[0].json.cec;}
const sum=c=>({rows:c.rows.map(x=>x.side+' L'+x.link+' '+x.earlier_round+'/'+x.closing_round+' '+x.status+(x.note&&x.status!=='CONFIRMED'?' ('+x.note.slice(0,90)+')':'')),broken:c.confirmed.map(x=>x.side+' LINK '+x.link),errors:c.errors});
const cases=[];const rd=f=>JSON.parse(fs.readFileSync(f,'utf8')).content;
cases.push({id:'A 34108 both sides',r:'34108',rep:{DEFENDER:rd(S+'stage_CSS/replies_css_s105/34108_css_DEFENDER_reply.json'),CHALLENGER:rd(S+'stage_CSS/replies_css_s105/34108_css_CHALLENGER_reply.json')}});
for(const f of fs.readdirSync(S+'setC_replies_s106').sort()){const m=f.match(/^(\d+)_css_(DEFENDER|CHALLENGER)_send(\d)/);cases.push({id:'C '+m[1]+' '+m[2]+' send '+m[3],r:m[1],rep:{[m[2]]:rd(S+'setC_replies_s106/'+f)}});}
// planted forms on the 34108 defender reply (true case: labels [CR3]/[CR4]); expected: the same rows and statuses as the original
const D0=cases[0].rep.DEFENDER;const P=(id,fn,expect)=>cases.push({id:'P '+id,r:'34108',rep:{DEFENDER:fn(D0),CHALLENGER:cases[0].rep.CHALLENGER},expect});
P('[round N]',t=>t.replace(/\[CR(\d)\]/g,'[round $1]'),'same');P('round N no brackets',t=>t.replace(/\[CR(\d)\]/g,'round $1'),'same');
P('[Round N]',t=>t.replace(/\[CR(\d)\]/g,'[Round $1]'),'same');P('[ROUND N]',t=>t.replace(/\[CR(\d)\]/g,'[ROUND $1]'),'same');
P('[CR N] spaced',t=>t.replace(/\[CR(\d)\]/g,'[CR $1]'),'same');P('[cr N] lower',t=>t.replace(/\[CR(\d)\]/g,'[cr$1]'),'same');
P('mixed: earlier [CR3], closing [round 4]',t=>t.replace(/CLOSING \[CR4\]/g,'CLOSING [round 4]'),'same');
// negatives: must not confirm
P('NEG [round 5] closing',t=>t.replace(/CLOSING \[CR4\]/g,'CLOSING [round 5]'),'none');
P('NEG earlier given as [round 4]',t=>t.replace(/EARLIER \[CR\d\]/g,'EARLIER [round 4]'),'none');
P('NEG [DR 4] on defender line',t=>t.replace(/CLOSING \[CR4\]/g,'CLOSING [DR 4]'),'none');
P('[round4] no space',t=>t.replace(/\[CR(\d)\]/g,'[round$1]'),'same');
// the challenger side with "round N": 34108 challenger reply relabeled
const C0=cases[0].rep.CHALLENGER;
// a real challenger pair built from 34108's own DR3 and DR4 sentences and a declared challenger link: the [DRn] line and the [round n] line must read alike
const sent=t=>String(t||'').split(/\n+|(?<=[.!?])\s+/).map(x=>x.replace(/[*_#>]/g,'').trim()).filter(x=>x.split(' ').length>=7&&!/["“”]/.test(x));
cases.push({id:'P challenger [DRn] built pair',r:'34108',lazy:async()=>{const {F}=await build('34108');const lk=(F.dr3.match(/LINK\s+(\d+)/)||[])[1];return {DEFENDER:'CLOSE-CONTRADICTION: NONE',CHALLENGER:'CLOSE-CONTRADICTION: NEW -- CHALLENGER -- LINK '+lk+' -- CONFIRMED -- EARLIER [DR3] "'+sent(F.dr3)[2]+'" -- CLOSING [DR4] "'+sent(F.dr4)[2]+'" -- built pair'};},expect:'ref'});
cases.push({id:'P challenger [round n] built pair',r:'34108',lazy:async()=>{const c=cases.find(x=>x.id==='P challenger [DRn] built pair');const r=await c.lazy();r.CHALLENGER=r.CHALLENGER.replace(/\[DR(\d)\]/g,'[round $1]');return r;},expect:'asDR'});cases.push({id:'P challenger [round N]',r:'34108',rep:{DEFENDER:D0,CHALLENGER:C0.replace(/\[DR(\d)\]/g,'[round $1]')},expect:'same'});
cases.push({id:'P NEG defender quotes moved to a CHALLENGER line as [round N]',r:'34108',rep:{DEFENDER:'CLOSE-CONTRADICTION: NONE',CHALLENGER:D0.replace(/-- DEFENDER --/g,'-- CHALLENGER --').replace(/\[CR(\d)\]/g,'[round $1]')},expect:'nochal'});
(async()=>{let fail=0;const base={};for(const c of cases){if(c.lazy)c.rep=await c.lazy();const a=sum(await rec(L,c.r,c.rep)),b=sum(await rec(N,c.r,c.rep));
  let verdict='';if(c.id.startsWith('A')||c.id.startsWith('C')){base[c.id]=b;verdict=JSON.stringify(a)===JSON.stringify(b)?'same as live':'CHANGED';}
  else{const ref=base['A 34108 both sides'];const st=x=>x.rows.map(z=>z.replace(/ \(.*$/,'').replace(/ (CR|DR)\d\/(CR|DR)\d/,''));
   if(c.expect==='same')verdict=JSON.stringify(st(b))===JSON.stringify(st(ref))&&JSON.stringify(b.broken)===JSON.stringify(ref.broken)?'OK (reads as the [CRn] original)':(fail++,'FAIL');
   if(c.expect==='none')verdict=b.broken.filter(x=>x.startsWith('DEFENDER')).length===0?'OK (no defender link broken)':(fail++,'FAIL');
   if(c.expect==='ref'){base[c.id]=b;verdict='reference (the challenger pair in [DRn] form)';}
   if(c.expect==='asDR'){const r=base['P challenger [DRn] built pair'];verdict=JSON.stringify(b.rows.map(z=>z.replace(/ \(.*$/,'')))===JSON.stringify(r.rows.map(z=>z.replace(/ \(.*$/,'')))&&JSON.stringify(b.broken)===JSON.stringify(r.broken)?'OK (reads as the [DRn] line)':(fail++,'FAIL');}
   if(c.expect==='nochal')verdict=b.broken.filter(x=>x.startsWith('CHALLENGER')).length===0?'OK (no challenger link broken)':(fail++,'FAIL');}
  console.log('\n== '+c.id+': '+verdict);console.log('  live s106: broken ['+a.broken.join(', ')+'] rows '+a.rows.length+(a.errors.length?' errors '+a.errors.join('; '):''));
  console.log('  pkgRLF   : broken ['+b.broken.join(', ')+'] rows '+b.rows.length);for(const x of b.rows)console.log('    '+x);}
 console.log('\n'+(fail?'FAIL '+fail:'ALL PLANTS OK'));})();
