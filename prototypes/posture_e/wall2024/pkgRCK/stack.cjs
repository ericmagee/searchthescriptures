// The base pkgRCK builds on: live 5a710187 fetch-back, then pkgUNXS/patched, then pkgUNXW/patched (W2's write order UNXS, UNXW, RCK).
const fs=require('fs'),path=require('path');
const FB='/mnt/project-files/wall2024/fetchback_live_s22.json';const LAYERS=['pkgUNXS/patched','pkgUNXW/patched'].map(d=>path.join(__dirname,'..',d));
const fname=n=>n.replace(/[^A-Za-z0-9]+/g,'_')+'.js';
function stacked(src){const W0=JSON.parse(fs.readFileSync(src||FB,'utf8'));const W=W0.data||W0;const used={};
 for(const n of W.nodes){if(!n.parameters||typeof n.parameters.jsCode!=='string')continue;for(const L of LAYERS){const f=path.join(L,fname(n.name));if(fs.existsSync(f)){n.parameters.jsCode=fs.readFileSync(f,'utf8');used[L]=(used[L]||0)+1;}}}
 return {W0,W,used};}
const baseCode=n=>{if(!baseCode.c){const {W}=stacked();baseCode.c=Object.fromEntries(W.nodes.filter(z=>z.parameters&&z.parameters.jsCode).map(z=>[z.name,z.parameters.jsCode]));}return baseCode.c[n];};
module.exports={stacked,baseCode,FB};
