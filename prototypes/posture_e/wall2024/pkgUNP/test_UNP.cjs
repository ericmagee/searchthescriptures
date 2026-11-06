// pkgUNP test. Run from wall2024/: node pkgUNP/test_UNP.cjs  -- the E-UNG items each judge would get, pkgABS/patched (live) vs pkgUNP, per run
const fs=require('fs');const crypto=require('crypto');const sha=s=>crypto.createHash('sha256').update(s).digest('hex').slice(0,16);
let ok=0,bad=0;const T=(n,c,d)=>{console.log((c?'OK  ':'FAIL')+' '+n+(d?'\n     '+d:''));c?ok++:bad++;};
const plan=JSON.parse(fs.readFileSync('pkgUNP/plan_UNP.json','utf8'));
T('4 nodes; base (pkgABS/patched) and final shas match',plan.nodes.length===4&&plan.nodes.every(n=>sha(fs.readFileSync(n.base+'/'+n.file,'utf8'))===n.base_sha&&sha(fs.readFileSync('pkgUNP/patched/'+n.file,'utf8'))===n.final_sha));
const und=f=>{const s=fs.readFileSync(f,'utf8');const i=s.indexOf('const UND=(()=>{');const j=s.indexOf('})();',i);return new Function(s.slice(i,j+5)+';return UND;')();};
const O=und('pkgABS/patched/Send_Back_Build.js'),N=und('pkgUNP/patched/Send_Back_Build.js');
T('the UND module is byte-identical in all 4 pkgUNP nodes',new Set(plan.nodes.map(n=>{const s=fs.readFileSync('pkgUNP/patched/'+n.file,'utf8');const i=s.indexOf('const UND=(()=>{');return s.slice(i,s.indexOf('})();',i));})).size===1);
const I=(run,n)=>{const f='/mnt/project-files/wall2024/inputs/'+run+'_'+n+'.json';return fs.existsSync(f)?JSON.parse(fs.readFileSync(f,'utf8'))[0].main[0].map(x=>x.json):null;};
const tx=r=>String(r||'').replace(/\\n/g,'\n').replace(/\\"/g,'"');const RES={};
for(const run of ['33040','33060','33083','33107','33129','33149']){const PB=I(run,'Panel_Build')[0],PCC=I(run,'Panel_Cure_Check')[0];RES[run]={};
 for(const b of PCC.bodies){const p=(typeof b==='string'?JSON.parse(b):b).payload;const J=PB.judges.find(q=>q.seat===p.judge_seat);if(!J)continue;
  const pt=J.body.messages.map(m=>typeof m.content==='string'?m.content:(Array.isArray(m.content)?m.content.map(c=>c&&c.text||'').join('\n'):'')).join('\n');const t=tx(p.verdict_raw).split('\n').filter(l=>!/^\s*\[AUDIT\b/.test(l)).join('\n');
  const o=O.missing(pt,t).map(m=>'D'+m.n),n=N.missing(pt,t).map(m=>'D'+m.n+'(p'+m.p+')');RES[run][p.judge_seat]={o,n,pressed:N.pressed(pt).map(x=>'p'+x.p+'->D'+x.n).join(' ')};}
 console.log('== '+run+'  pressed: '+Object.values(RES[run])[0].pressed);for(const [seat,r] of Object.entries(RES[run]))console.log('   '+seat.padEnd(8)+' live E-UNG ['+r.o.join(', ')+']  ->  pkgUNP ['+r.n.join(', ')+']');}
const r9=RES['33149'];T('33149: live raised gemini D5, sol D5, chatgpt D1 and D5; pkgUNP raises none of them (the list presses D6, D2, D3, D4)',r9.gemini.o.join()==='D5'&&r9.sol.o.join()==='D5'&&r9.chatgpt.o.join()==='D1,D5'&&!['gemini','sol','chatgpt'].some(s=>r9[s].n.some(x=>/^D[15]\(/.test(x))));
const u=N.pressed('=== [DR2] x ===\nUNSUPPORTED [L4] PREMISES\n1. LINK 6: a\n2. LINK 6: b\n3. LINK 2: c\n4. Premise with no link token\n5. LINK none: d\n');
T('unit: LINK k presses D<k>, once; no token keeps its place number; LINK none is skipped',JSON.stringify(u.map(x=>[x.p,x.n]))==='[[1,6],[3,2],[4,4]]',JSON.stringify(u.map(x=>[x.p,x.n])));
console.log('\n'+ok+' OK, '+bad+' FAIL');process.exit(bad?1:0);
