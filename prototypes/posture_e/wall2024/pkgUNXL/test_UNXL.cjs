// pkgUNXL tests. Run from wall2024/: node pkgUNXL/test_UNXL.cjs   (needs npm ci --prefix pkgEPK for lib_extract)
const fs=require('fs');const {closure}=require('../pkgEPK/lib_extract.cjs');const {harness}=require('../pkgGSL/harness.cjs');const crypto=require('crypto');const sha=s=>crypto.createHash('sha256').update(s).digest('hex').slice(0,16);
let ok=0,bad=0;const t=(n,c,x)=>{if(c){ok++;console.log('OK  ',n);}else{bad++;console.log('FAIL',n,x||'');}};
const P=n=>fs.readFileSync('pkgUNXL/patched/'+n.replace(/ /g,'_')+'.js','utf8'),B=n=>fs.readFileSync('pkgUNXL/base/'+n.replace(/ /g,'_')+'.js','utf8');
const lib=(code)=>{const L=closure(code,['kunxLines']);return new Function('$',(typeof L==='string'?L:L.text||L.join('\n'))+';return kunxLines;')(()=>{throw 0;});};
const FX=JSON.parse(fs.readFileSync('pkgUNXL/fixture_33289_grok.json','utf8'));const R={CR3:FX.CR3,DR3:'',CR1:'',DR1:'',CR2:'',DR2:''};
for(const node of ['Gate Build','Panel Payloads']){const kb=lib(B(node)),kp=lib(P(node));
 const b=kb(FX.count,R),p=kp(FX.count,R);
 t(node+' U1 33289 grok premise 6 as stored: base raises nothing',b.items.length===0,JSON.stringify(b.items));
 t(node+' U1 33289 grok premise 6 as stored: patched raises one K-UNX item naming [L1] lacked while the block exhibits L1, L2 and L3 (lbFoot, full block)',p.items.length===1&&p.items[0].link==='DEFENDER premise 6'&&JSON.stringify(p.items[0].lack)==='["1"]'&&JSON.stringify(p.items[0].kinds)==='["L1","L2","L3"]',JSON.stringify(p.items));
 const c2=FX.count.replace('lacks [L1] for a gift','lacks [L4] for a gift');t(node+' U2 control: "lacks [L4]" (L4 always reads as missing): no item',kp(c2,R).items.length===0);
 const c3=FX.count.replace("the block exhibits [L1] Luke 1:32 and [L2] patēr and lacks [L1] for a gift apart from David's loins; ",'');t(node+' U3 control: ASSUMES ground naming no lacking layer: no item (K-UNX-A unchanged)',kp(c3,R).items.length===0&&kb(c3,R).items.length===0);
 const R4={...R,CR3:FX.CR3.slice(0,FX.CR3.indexOf('- **[L1]**'))+'- **[L1]** Luke 1:32: "the Lord God shall give unto him the throne of his father David."\n- **[L2]** *patēr* (G3962, father).\n'}; /* block 6 cut to its [L1] verse and a bare [L2]: lbFoot reads L1 and L2 only (the real [L2] line quotes Luke 1:34, which reads as L3) */const c4=FX.count.replace('lacks [L1] for a gift','lacks [L3] for a gift');
 t(node+' U4 control: block of L1+L2 only, count "lacks [L3]": no item',kp(c4,R4).items.length===0&&lib(B(node))(c4,R4).items.length===0);
 t(node+' U5 a count naming [L3] lacked on the full block: one item',kp(c4,R).items.length===1);}
for(const RUN of ['33197','33218','33222','33249','33261']){const b=JSON.stringify(harness(RUN)(B('Panel Payloads'),'Reserve Needed?')),p=JSON.stringify(harness(RUN)(P('Panel Payloads'),'Reserve Needed?'));t('P parity '+RUN+' Panel Payloads: patched output equals base',b===p);}
for(const RUN of ['33218','33249']){const b=JSON.stringify(harness(RUN)(B('Panel Cure Check'),'Panel Cure Normalize 3')),p=JSON.stringify(harness(RUN)(P('Panel Cure Check'),'Panel Cure Normalize 3'));t('P parity '+RUN+' Panel Cure Check: patched output equals base',b===p);}
const W=JSON.parse(fs.readFileSync('/mnt/project-files/wall2024/fetchback_live_s31.json','utf8'));const NS=(W.data||W).nodes||(W.data||W).workflow.nodes;const plan=JSON.parse(fs.readFileSync('pkgUNXL/plan_UNXL.json','utf8'));
t('G1 '+plan.nodes.length+' bases equal live s31',plan.nodes.every(n=>sha(NS.find(z=>z.name===n.name).parameters.jsCode)===n.base_sha&&sha(B(n.name))===n.base_sha));
t('G2 finals match plan shas',plan.nodes.every(n=>sha(P(n.name))===n.final_sha));
t('G3 the 3 raise-only nodes carry unxLack identical to Gate Build',['Extract Independent Verdict','Panel Payloads','Alternate Payloads'].every(n=>{const g=P('Gate Build'),s=P(n);const cut=x=>x.slice(x.indexOf('function unxLack('),x.indexOf('\n',x.indexOf('function unxLack(')+400));return cut(g)===cut(s);}));
console.log(ok+' OK, '+bad+' FAIL');process.exit(bad?1:0);
