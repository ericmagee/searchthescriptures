// Which node outputs of stored 34726 change when REFP's scoped sentence test is fixed (rev 1, all 34 copies)? Chain from START.
const chain=require('../w2_grades/ead/chain_w2.cjs');const fs=require('fs');
(async()=>{const st=process.env.START;process.env.CHAIN_WF='/mnt/project-files/wall2024/fetchback_live_s114.json';
 const a=await chain('S114L',st);delete require.cache[require.resolve('../w2_grades/ead/chain_w2.cjs')];
 process.env.CHAIN_WF='pkgBRF/parent_s114_BRF_rev1.json';const chain2=require('../w2_grades/ead/chain_w2.cjs');const b=await chain2('BRF_s114',st);
 const ks=new Set([...Object.keys(a.over),...Object.keys(b.over)]);let d=0;
 for(const k of ks){const x=JSON.stringify(a.over[k]),y=JSON.stringify(b.over[k]);if(x!==y){d++;let i=0;while(i<x.length&&x[i]===y[i])i++;console.log('DIFF',k,'| s114:',(x||'').slice(Math.max(0,i-120),i+80).replace(/\s+/g,' '),'\n      fix :',(y||'').slice(Math.max(0,i-120),i+80).replace(/\s+/g,' '));}}
 console.log('nodes compared',ks.size,'differing',d,'| fallbacks',(a.fb||[]).length,(b.fb||[]).length);})();
