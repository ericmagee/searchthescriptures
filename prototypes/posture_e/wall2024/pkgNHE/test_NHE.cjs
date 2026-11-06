// pkgNHE test. Run from wall2024/: node pkgNHE/test_NHE.cjs
const fs=require('fs');const crypto=require('crypto');const sha=s=>crypto.createHash('sha256').update(s).digest('hex').slice(0,16);const {execFileSync}=require('child_process');
let ok=0,bad=0;const T=(n,c,d)=>{console.log((c?'OK  ':'FAIL')+' '+n+(d?'\n     '+d:''));c?ok++:bad++;};
const plan=JSON.parse(fs.readFileSync('pkgNHE/plan_NHE.json','utf8'));
T('22 nodes; base and final shas match',plan.nodes.length===22&&plan.nodes.every(n=>sha(fs.readFileSync(n.base+'/'+n.file,'utf8'))===n.base_sha&&sha(fs.readFileSync('pkgNHE/patched/'+n.file,'utf8'))===n.final_sha));
const nhq=f=>{const s=fs.readFileSync(f,'utf8');const i=s.indexOf('function nhqFull');let d=0,j=s.indexOf('{',i);for(let k=j;k<s.length;k++){if(s[k]==='{')d++;else if(s[k]==='}'){d--;if(!d){j=k;break;}}}return new Function(s.slice(i,j+1)+';return nhqFull;')();};
const R=JSON.parse(fs.readFileSync('/mnt/project-files/wall2024/inputs/33129_Panel_Cure_Normalize_3.json','utf8'))[0].main[0][0].json.cure.rounds;const L='[DR3] LINK 3: "I grant [L2] patēr (G3962), "a \'father\'..."';
const o=nhq('pkgKVQ/patched/Panel_Cure_Check.js')(L,R),n=nhq('pkgNHE/patched/Panel_Cure_Check.js')(L,R);
T('33129 DR3 LINK 3: base stops at "...", pkgNHE reads to the sentence end',/\.\.\.$/.test(o[0])&&/David is the remote father\.$/.test(n[0]),JSON.stringify(o)+' -> '+JSON.stringify(n));
const R2={CR2:'I grant this. It ends here. And "so it goes"! Next one.'};T('a plain sentence end is still an end',nhq('pkgNHE/patched/Panel_Cure_Check.js')('[CR2] X: "I grant this."',R2)[0]==='I grant this.');
const rg=r=>execFileSync('node',['corpus/regrade_run.cjs',r,'pkgKVQ','pkgNHE']).toString();const pat=s=>s.slice(s.indexOf('PATCHED')),bas=s=>s.slice(s.indexOf('BASE'),s.indexOf('PATCHED'));
const o29=rg('33129');T('33129 replay: sol K-W CHALLENGER DR3 LINK 3 cured; its CR2 D4 and CR3 LINK 4 stay uncured',/sol +HELD +drv_uncured 2 .*CR2 D4.*CR3 LINK 4 #5\]/.test(pat(o29))&&!/DR3 LINK 3/.test(pat(o29).split('\n').find(l=>/^\s+sol/.test(l))));
for(const r of ['33107','33083','33060']){const s=rg(r);const strip=x=>x.split('\n').slice(1).join('\n');T(r+' replay: unchanged from pkgKVQ',strip(bas(s))===strip(pat(s)));}
console.log('\n'+ok+' OK, '+bad+' FAIL');process.exit(bad?1:0);
