// pkgRLF rev 2 test (W2; labels pkgRLF/rev2/labels_RLF2.md). Live s108 Close Enforcer Record vs rev 2 on every stored per-side reply on the mount, plus plants.
// Usage (from wall2024/): node pkgRLF/rev2/test_RLF2.cjs
const fs=require('fs');const {harness}=require(process.cwd()+'/pkgGSL/harness.cjs');
const g=f=>{let d=JSON.parse(fs.readFileSync(f,'utf8'));d=d.data||d;return d.workflow||d;};
const L=g('/mnt/project-files/wall2024/fetchback_live_s108.json'),N=g('pkgRLF/rev2/parent_s108_RLF2.json');const code=(w,n)=>w.nodes.find(z=>z.name===n).parameters.jsCode;
const S='/mnt/project-files/wall2024/staged_w4/';const fin=r=>{const x=JSON.parse(fs.readFileSync('/mnt/project-files/wall2024/inputs/'+r+'_Final_Output.json','utf8'));const y=Array.isArray(x)?x[x.length-1]:x;return ((y.data&&y.data.main)||y.main)[0][0].json;};
const cache={};async function build(r){if(cache[r])return cache[r];const F=fin(r);
 const BA=(await harness(r,{'Final Output':[{json:F}],'Resolve Seats':[{json:{deepseek:{api_model:'deepseek-flash'}}}],'Init Seats':[{json:{run_token:r}}]})('return (async()=>{\n'+code(L,'Close Enforcer Build')+'\n})();','Quote Report'));
 return cache[r]={F,BA};}
async function rec(w,r,replies){const {F,BA}=await build(r);const sides=BA.map(b=>b.json.side);const inp=sides.map(s=>({json:{choices:[{message:{content:replies[s]!=null?replies[s]:'CLOSE-CONTRADICTION: NONE'}}]}}));
 const o=await harness(r,{'Close Enforcer Build':BA,'Final Output':[{json:F}],'__R':inp})('return (async()=>{\n'+code(w,'Close Enforcer Record')+'\n})();','__R');return o[0].json.cec;}
const sum=c=>({rows:c.rows.map(x=>x.side+' L'+x.link+' '+x.earlier_round+'/'+x.closing_round+' '+x.status+(x.note&&x.status!=='CONFIRMED'?' ('+x.note.slice(0,90)+')':'')),broken:c.confirmed.map(x=>x.side+' LINK '+x.link),errors:c.errors});
const rd=f=>JSON.parse(fs.readFileSync(f,'utf8')).content;const cases=[];
const add=(set,dir,re)=>{for(const f of fs.readdirSync(S+dir).sort()){const m=f.match(re);if(!m)continue;cases.push({set,id:set+' '+f,r:m[1],rep:{[m[2]]:rd(S+dir+'/'+f)}});}};
add('R1','check34108_s108',/^(\d+)_X_live_(DEFENDER|CHALLENGER)_s\d_reply\.json$/);
add('R2','stage_CSS/replies_css_s105',/^(\d+)_css_(DEFENDER|CHALLENGER)_reply\.json$/);
add('R2','setC_replies_s106',/^(\d+)_css_(DEFENDER|CHALLENGER)_send\d/);
add('R2','check34108_s108',/^(\d+)_Y_rac_(DEFENDER|CHALLENGER)_s\d_reply\.json$/);
add('R2','ctl_replay_s108',/^(\d+)_ctl_(DEFENDER|CHALLENGER)_/);
const X=rd(S+'check34108_s108/34108_X_live_DEFENDER_s1_reply.json');
const P=(set,id,fn,side)=>cases.push({set,id:set+' '+id,r:'34108',rep:{[side||'DEFENDER']:fn(X)}});
P('R3','[CRn]/[CRn] reference',t=>t.replace(/EARLIER \[(\d)\]/g,'EARLIER [CR$1]').replace(/CLOSING \[(\d)\]/g,'CLOSING [CR$1]'));
P('R3','mixed [CR3]/[4]',t=>t.replace(/EARLIER \[(\d)\]/g,'EARLIER [CR$1]'));
P('R3','mixed [3]/[CR4]',t=>t.replace(/CLOSING \[(\d)\]/g,'CLOSING [CR$1]'));
P('R3','mixed [3]/[round 4]',t=>t.replace(/CLOSING \[(\d)\]/g,'CLOSING [round $1]'));
P('R3','unbracketed 3/4',t=>t.replace(/(EARLIER|CLOSING) \[(\d)\]/g,'$1 $2'));
P('R3','spaced [ 3 ]/[ 4 ]',t=>t.replace(/(EARLIER|CLOSING) \[(\d)\]/g,'$1 [ $2 ]'));
P('R4','NEG closing [5]',t=>t.replace(/CLOSING \[\d\]/g,'CLOSING [5]'));
P('R4','NEG closing [0]',t=>t.replace(/CLOSING \[\d\]/g,'CLOSING [0]'));
P('R4','NEG earlier [4]',t=>t.replace(/EARLIER \[\d\]/g,'EARLIER [4]'));
P('R4','NEG two digits [34]',t=>t.replace(/EARLIER \[\d\]/g,'EARLIER [34]'));
P('R4','NEG closing [DR4] on defender line',t=>t.replace(/CLOSING \[\d\]/g,'CLOSING [DR4]'));
P('R4','NEG defender quotes on a CHALLENGER line, bare labels',t=>t.replace(/-- DEFENDER --/g,'-- CHALLENGER --'),'CHALLENGER');
(async()=>{let fail=0;let ref=null;
 for(const c of cases){const a=sum(await rec(L,c.r,c.rep)),b=sum(await rec(N,c.r,c.rep));let v;
  if(c.set==='R1'){v=b.broken.includes('DEFENDER LINK 6')&&!a.broken.includes('DEFENDER LINK 6')?'OK (link 6 breaks; live breaks none)':(fail++,'FAIL');}
  else if(c.set==='R2'){v=JSON.stringify(a)===JSON.stringify(b)?'OK same as live':(fail++,'FAIL changed');}
  else if(c.id.endsWith('reference')){ref=b;v=b.broken.includes('DEFENDER LINK 6')?'reference':(fail++,'FAIL reference');}
  else if(c.set==='R3'){const st=x=>x.rows.map(z=>z.replace(/ \(.*$/,''));v=JSON.stringify(st(b))===JSON.stringify(st(ref))&&JSON.stringify(b.broken)===JSON.stringify(ref.broken)?'OK reads as [CRn]':(fail++,'FAIL');}
  else{v=b.broken.length===0?'OK no link broken':(fail++,'FAIL');}
  console.log('\n== '+c.id+': '+v);console.log('  live s108: broken ['+a.broken.join(', ')+'] rows '+a.rows.length+(a.errors.length?' errors '+a.errors.join('; '):''));
  console.log('  rev 2    : broken ['+b.broken.join(', ')+'] rows '+b.rows.length);for(const x of b.rows)console.log('    '+x);}
 console.log('\n'+cases.length+' cases; '+(fail?'FAIL '+fail:'ALL OK'));})();
