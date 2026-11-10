// Which node outputs of stored 34726 change when REFP's scoped sentence test is fixed (rev 1, all 34 copies)? Chain from START.
const chain=require('../w2_grades/ead/chain_w2.cjs');const fs=require('fs');
(async()=>{const st=process.env.START;process.env.CHAIN_WF='/mnt/project-files/wall2024/fetchback_live_s114.json';
 const a=await chain('S114L',st);delete require.cache[require.resolve('../w2_grades/ead/chain_w2.cjs')];
 process.env.CHAIN_WF='pkgBRF/parent_s114_BRF_rev1.json';const chain2=require('../w2_grades/ead/chain_w2.cjs');const b=await chain2('BRF_s114',st);
 const ks=new Set([...Object.keys(a.over),...Object.keys(b.over)]);let d=0;
 for(const k of ks){if(!["Panel Build","Panel Judges Prep","Second Alternate?","Build Save Body"].includes(k))continue;const x=JSON.stringify(a.over[k]),y=JSON.stringify(b.over[k]);if(x!==y){d++;let i=0;while(i<x.length&&x[i]===y[i])i++;{const D=[];let j=0;while(D.length<6&&j<Math.min(x.length,y.length)){if(x[j]!==y[j]){D.push(j);let k2=j;while(k2<x.length&&x[k2]!==y[k2]&&k2-j<400)k2++;j+=200;}else j++;}console.log("DIFF",k,"len",x.length,y.length);for(const p of D)console.log("   @"+p+" s114:",x.slice(p-100,p+60).replace(/\s+/g," "),"\n        fix :",y.slice(p-100,p+60).replace(/\s+/g," "));}}}
 console.log('nodes compared',ks.size,'differing',d,'| fallbacks',(a.fb||[]).length,(b.fb||[]).length);})();
