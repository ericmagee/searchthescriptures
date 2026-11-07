// pkgRCT tests: sbApply2024 copied byte for byte (with everything it uses) from base and patched nodes, on the 33311 gemini fixture (DB rows; node inputs lost).
const fs=require('fs');const {closure}=require('../pkgEPK/lib_extract.cjs');const DIR=process.argv[2]||'pkgRCT/patched';const BDIR=DIR==='pkgRCT/patched'?'pkgRCT/base':DIR+'_base';
let ok=0,bad=0;const t=(n,c,x)=>{if(c){ok++;console.log('OK  ',n);}else{bad++;console.log('FAIL',n,x||'');}};
const FX=JSON.parse(fs.readFileSync('pkgRCT/fixture_33311_gemini.json','utf8'));const RD={DR3:FX.DR3,CR3:'',CR1:'',DR1:'',CR2:'',DR2:'',CR4:'',DR4:''};
const ld=(d,node)=>new Function('$',closure(fs.readFileSync(d+'/'+node+'.js','utf8'),['sbApply2024']).text+';return sbApply2024;')(()=>{throw new Error('no node');});
const it=(g,to,why)=>({seat:'gemini',sid:g,rule:'E-GATE',item:'NOT APPLIED',line:FX.flagged,ans:'CHANGE',to,why});
for(const node of ['Gate_Record','Gate_Build','Alt_Gate_Record','Alternate_Merge_Seat']){const sb=ld(BDIR,node),sp=ld(DIR,node);
 for(const g of ['G7','G10','G12']){const [to,why]=FX.G[g];const b=sb('gemini',FX.raw,FX.F,[it(g,to,why)],RD),p=sp('gemini',FX.raw,FX.F,[it(g,to,why)],RD);
  t(node+' '+g+' base: applied, count 0 to 1 (as stored)',b&&b.fields.challenger_conceded_links===1&&b.applied.includes(g),b&&JSON.stringify(b.fields));
  t(node+' '+g+' patched: NOT APPLIED by pkgRCT, count stays 0',p&&p.fields.challenger_conceded_links===0&&!p.applied.includes(g)&&p.items.some(z=>z.sid===g&&z.rct&&/RECOUNTED AFTER CURE \(pkgRCT/.test(z.why)),p&&JSON.stringify(p.items.map(z=>z.why)));}
 {const [to]=FX.G.G12;const to2=to.replace('Premise 4: UNEXHIBITED;','Premise 4: UNEXHIBITED (the block lacks [L4] for the step to Joseph);');const p=sp('gemini',FX.raw,FX.F,[it('G12',to2,'test')],RD);
  t(node+' N1 a recount naming a layer the block lacks ([L4] reads as missing in unxLack): applied',p&&p.fields.challenger_conceded_links===1&&p.applied.includes('G12'),p&&JSON.stringify(p.items));}
 {const [to]=FX.G.G12;const to3=to.replace('CHALLENGER CONCEDED LINKS: 1 -- ','CHALLENGER CONCEDED LINKS: 1 -- ').replace('Premise 4: UNEXHIBITED; Premise 5: SPARED','Premise 4: SPARED; Premise 5: UNEXHIBITED');const p=sp('gemini',FX.raw,FX.F,[it('G12',to3,'test')],RD),b=sb('gemini',FX.raw,FX.F,[it('G12',to3,'test')],RD);
  t(node+' N2 a recount of a premise the cure did not take out (premise 5): untouched, same as base',p&&b&&JSON.stringify(p.fields)===JSON.stringify(b.fields)&&p.applied.includes('G12'));}
 {const raw2=FX.raw.replace(/\n\[AUDIT v21:[^\n]*/,'');const [to,why]=FX.G.G12;const p=sp('gemini',raw2,FX.F,[it('G12',to,why)],RD),b=sb('gemini',raw2,FX.F,[it('G12',to,why)],RD);
  t(node+' N3 no CURED CORRECTED COUNT report in the text: untouched, same as base',JSON.stringify(p)===JSON.stringify(b));}
 {const [to,why]=FX.G.G12;const p=sp('gemini',FX.raw,FX.F,[it('G12',to,why)],{...RD,DR3:''}),b=sb('gemini',FX.raw,FX.F,[it('G12',to,why)],{...RD,DR3:''});
  t(node+' N4 the block cannot be read: not refused (same as base)',JSON.stringify(p)===JSON.stringify(b));}
 {const raw5=FX.raw.replace('CHALLENGER CONCEDED LINKS: 0 -- recomputed after the cure from the cured lines (CORRECTED COUNT CHALLENGER 0).','CHALLENGER CONCEDED LINKS: 1 -- Premise 4 UNEXHIBITED (its answer fails).');const F5={...FX.F,challenger_conceded_links:1};const [to,why]=FX.G.G12;const x5={...it('G12',to,why),line:'CHALLENGER CONCEDED LINKS: 1 -- Premise 4 UNEXHIBITED (its answer fails).'};const p=sp('gemini',raw5,F5,[x5],RD),b=sb('gemini',raw5,F5,[x5],RD);
  t(node+' N5 the line being replaced already counts the premise (33249 alternate grok shape): not refused, same as base',JSON.stringify(p)===JSON.stringify(b)&&p.applied.includes('G12'),p&&JSON.stringify(p.items));}}
console.log(ok+' OK, '+bad+' FAIL ('+DIR+')');process.exit(bad?1:0);
