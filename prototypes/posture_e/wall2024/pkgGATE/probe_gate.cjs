// Probe: gate items on stored bodies. Run from wall2024/.
const fs=require('fs');const base=fs.readFileSync('pkgKCR/patched/Alternate_Merge.js','utf8');const v1=fs.readFileSync('pkgAPPLY/sb_apply.js','utf8');
const lib0=base.slice(0,base.indexOf("const PP=$('Panel Cure Check')"));if(!lib0.includes(v1))throw new Error('sb_apply.js not found in base');
const lib=lib0.replace(v1,()=>fs.readFileSync('pkgGATE/sb_apply_v2.js','utf8')+'\n'+fs.readFileSync('pkgGATE/gate_lib.js','utf8'));
module.exports=(PB)=>new Function('$','$input',lib+'\nreturn {sbApply2024,gateItems2024,gateCure2024,gateAnsGround2024,sbKeyExempt2024,sbRoundsOf2024,ciRounds,gatePromptText2024,drvLinks,cureJText,cureRewrite,rcLines};')(n=>{if(n==='Panel Build'&&PB)return {first:()=>({json:PB})};throw new Error('offline');},null);
