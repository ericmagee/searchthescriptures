// pkgUNXA2 tests. Run from wall2024/ after `node pkgUNXA2/build_UNXA2.cjs`: node pkgUNXA2/test_UNXA2.cjs
const fs=require('fs');const crypto=require('crypto');const sha=s=>crypto.createHash('sha256').update(s).digest('hex').slice(0,16);let ok=0,bad=0;const out=[];const T=(n,c,x)=>{out.push((c?'OK   ':'FAIL ')+n+(x?' :: '+x:''));c?ok++:bad++;};
const {harness}=require('../pkgGSL/harness.cjs');const W=JSON.parse(fs.readFileSync('/mnt/project-files/wall2024/fetchback_live_s28.json','utf8'));const L=(W.data||W).nodes;const base=n=>L.find(z=>z.name===n).parameters.jsCode;
const plan=JSON.parse(fs.readFileSync('pkgUNXA2/plan_UNXA2.json','utf8'));const pat=n=>fs.readFileSync('pkgUNXA2/patched/'+n.replace(/ /g,'_')+'.js','utf8');
T('A1 22 nodes (19 with the cure, 3 raise-only); each base sha is live 4f62e6cf; patched sha holds',plan.nodes.length===22&&plan.nodes.filter(n=>n.edits===4).length===19&&plan.nodes.every(n=>sha(base(n.name))===n.base_sha&&sha(pat(n.name))===n.final_sha));
// the two cure predicates, from the node code itself
const fnOf=(s,name)=>{const a=s.indexOf('function '+name+'(');let d=0,i=s.indexOf('{',a);for(;i<s.length;i++){if(s[i]==='{')d++;else if(s[i]==='}'&&--d===0)break;}return s.slice(a,i+1);};
const unxLack=new Function(fnOf(base('Panel Cure Check'),'unxLack')+';return unxLack;')();
const oldLack=st=>/\b(?:not|no|lacks?|lacking|without|silent|never|nothing|none|neither|nor)\b/i.test(String(st||'').replace(/["“][^"”]*["”]/g,' '));const newLack=(st,k)=>!!st&&unxLack(st,k).missing.length>0;
const K=['L1','L2','L3'];
const G='In [DR3] LINK 1, the challenger quotes [L1] Matthew 1:18 "When as his mother Mary was espoused to Joseph, before they came together, she was found with child." but that verse lacks any footing for the step that Joseph knew Mary within the espousal, because the text explicitly states she was found with child before they came together.';
T('G1 33276 gemini challenger premise 1 (W3 grade_33276 item 4): the fit ground "lacks any footing for the step" cured before, does not now',oldLack(G)&&!newLack(G,K));
T('G2 the same STATEMENT plus "[L4] does not follow from [L1] to [L3]" cures (a layer the block does not exhibit)',newLack(G+' Its [L4] does not follow from [L1] to [L3].',K));
T('G3 a block exhibiting L1 and L3 only: "[L2] is missing" cures',newLack('[L1] Matthew 1:18 "x y z" stands, but [L2] is missing.',['L1','L3']));
T('N1 "[L1] does not meet the press" names L1, which the block exhibits: no cure',!newLack('[L1] Matthew 1:18 "a b c" does not meet the press.',K));
T('N2 no STATEMENT: no cure',!newLack('',K)&&!newLack(null,K));
// the cure message and the uncured message in the patched node
{const s=pat('Panel Cure Check');T('M1 cure and uncured messages name a layer the block does not exhibit; old messages gone',s.includes("and names a layer the block does not exhibit ([L'")&&s.includes('but names no layer the block does not exhibit')&&!s.includes('says what it lacks')&&!s.includes('says nothing it lacks'));}
// replay: every K-UNX-A cure status on the saved runs, base vs patched
const NODES=[['Panel Cure Check','Panel Cure Needed?'],['Alternate Merge Seat','Alternate Calls?'],['Gate Record','Gate Call openrouter']];
const rows=[];const walk=(o,f)=>{if(Array.isArray(o))o.forEach(v=>walk(v,f));else if(o&&typeof o==='object'){f(o);Object.values(o).forEach(v=>walk(v,f));}};
const stat=r=>{const m=[];walk(r,o=>{if(typeof o.cure_reason==='string'&&/K-UNX-A/.test(o.cure_reason))m.push([o.seat,o.item,o.cure_status].join(' | '));});return m.sort();};
const auditA=r=>{const m=[];const s=JSON.stringify(r);for(const x of s.matchAll(/ITEM: ([^;]{0,60}); RULE: K-UNX; RESULT: (\w+); WHY: [^;]*?K-UNX-A/g))m.push(x[1]+' | '+x[2]);return m;};
for(const RUN of ['33218','33222','33249','33261']){for(const [n,inp] of NODES){let a,b;try{a=harness(RUN)(base(n),inp);b=harness(RUN)(pat(n),inp);}catch(e){rows.push(RUN+' '+n+': not replayable ('+String(e.message).slice(0,60)+')');continue;}
 const sa=stat(a),sb=stat(b);const fl=sa.filter((x,i)=>x!==sb[i]);rows.push(RUN+' '+n+': K-UNX-A cure rows '+sa.length+' / '+sb.length+', flips '+fl.length+(fl.length?' :: '+fl.join(' ; ')+' -> '+sb.filter(x=>!sa.includes(x)).join(' ; '):''));
 const strip=s=>JSON.stringify(s).replace(/name the layer the block lacks \(\\"\[L1\]\\", \\"\[L2\]\\", \\"\[L3\]\\" or \\"\[L4\]\\", one the block does not exhibit; a failure of fit is not a missing layer\)/g,'name what that verse lacks for the step');
 if(!sa.length)T('P '+RUN+' '+n+': no K-UNX-A cure row, so output equal apart from the item line text',strip(b)===JSON.stringify(a));}}
fs.writeFileSync('pkgUNXA2/replay_UNXA2.txt',rows.join('\n')+'\n');out.push(...rows.map(r=>'INFO '+r));
// the built item line, for W3's prompt check
{const s=pat('Panel Payloads');const i=s.indexOf("+' in a STATEMENT for this item and name the layer");out.push('INFO item line (Panel Payloads): '+s.slice(s.lastIndexOf("line:id+': '+why+'",i),s.indexOf("A KEEP does not cure it",i)+24));}
const txt=out.join('\n')+'\n'+ok+' OK, '+bad+' FAIL\n';fs.writeFileSync('pkgUNXA2/test_UNXA2.txt',txt);console.log(txt);process.exit(bad?1:0);
