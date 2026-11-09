// pkgEAB (W1, Wall 3726): Early Alternate Build's stub head is stale since s80, so the node throws "Shared Library does not match this stub"
// on every run and the early alternate start does nothing. Fix: the head that gate/pack.cjs e4_rebase writes for the live library.
//   node pkgEAB/build_EAB.cjs [fetchback]  -> pkgEAB/early_alternate_build_s83.js, pkgEAB/check_EAB.txt
const fs=require('fs');const FB=process.argv[2]||'/mnt/project-files/wall2024/fetchback_live_s83.json';const L=JSON.parse(fs.readFileSync(FB,'utf8'));
const g=n=>L.nodes.find(x=>x.name===n).parameters.jsCode;const LT=g('Shared Library');const LL=JSON.parse(LT.slice(LT.indexOf('\n/*LIB*/')+8,LT.lastIndexOf('\n/*END*/')));
const len=s=>{const N=+s.match(/const __N=(\d+);/)[1];const P=JSON.parse(s.match(/const __P=(\[.*?\]);\n/s)[1]);const S=P.map(e=>typeof e==='number'?LL[e]:typeof e[0]==='string'?e[0]:LL.slice(e[0],e[1]+1).join('\n')).join('\n');return {N,S};};
const out=[];const A=g('Alternate Build'),E=g('Early Alternate Build');
const nw=A.split('\n').slice(0,8).concat(E.split('\n').slice(8)).join('\n');
for(const [lab,s] of [['live Alternate Build',A],['live Early Alternate Build',E],['fixed Early Alternate Build',nw]]){const {N,S}=len(s);out.push(lab.padEnd(28)+' expects '+N+', rebuilt '+S.length+' '+(S.length===N?'OK':'MISMATCH (throws)'));}
const {S:SA}=len(A),{S:SE}=len(nw);out.push('fixed Early Alternate Build rebuilds the same source as Alternate Build: '+(SA===SE));
const la=E.split('\n'),lb=nw.split('\n');out.push('lines changed: '+la.map((x,i)=>x!==lb[i]?i+1:0).filter(Boolean).join(', ')+' of '+la.length+' (the 8-line head only)');
out.push('equals pkgLIB_SJR/e4_rebase/Early_Alternate_Build.js: '+(nw===fs.readFileSync(__dirname+'/../pkgLIB_SJR/e4_rebase/Early_Alternate_Build.js','utf8')));
fs.writeFileSync(__dirname+'/early_alternate_build_s83.js',nw);fs.writeFileSync(__dirname+'/check_EAB.txt',out.join('\n')+'\n');console.log(out.join('\n'));
