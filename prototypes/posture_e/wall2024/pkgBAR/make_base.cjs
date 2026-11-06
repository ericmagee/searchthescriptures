// pkgBAR test base: live 98daac9e (W4's fetch-back) + n19 (pkgKWA finals, carrying pkgUAP and pkgKVE; pkgMNP) + n20 (pkgOAN: code, and its
// C3G Route and 7 C3G Calls built per pkgOAN/WIRING.md) + pkgIMP b0208c5. W4 runs build_BAR.cjs on the real fetch-back after n20 and pkgIMP
// instead; this base only stands in for it offline. Run from wall2024/: node pkgBAR/make_base.cjs -> pkgBAR/base/workflow_base.json
const fs=require('fs');const {addStage}=require('./stage.cjs');
const w=JSON.parse(fs.readFileSync('/mnt/project-files/wall2024/fetchback_98daac9e.json','utf8'));
const N=Object.fromEntries(w.nodes.map(n=>[n.name,n]));const log=[];
const put=(dir)=>{for(const f of fs.readdirSync(dir).filter(f=>f.endsWith('.js'))){const n=f.slice(0,-3).replace(/_/g,' ');if(!N[n]){if(/^C3G /.test(n))continue;throw new Error(dir+': no node '+n);}N[n].parameters.jsCode=fs.readFileSync(dir+'/'+f,'utf8');log.push(dir+' '+n);}};
put('pkgKWA/patched');put('pkgMNP/patched');
// n20: the stage first (C3 Extract output 0 -> C3G Build ... C3G Extract -> D4 Verse Sheet), then the code
const OB=fs.readFileSync('pkgOAN/patched/C3G_Build.js','utf8'),OX=fs.readFileSync('pkgOAN/patched/C3G_Extract.js','utf8');
addStage(w,'C3G','C3 Extract','C3 Route',OB,OX);put('pkgOAN/patched');
N['D4 Verse Sheet'].parameters.url="={{ $('C3G Extract').first().json.sheet_url }}";
put('pkgIMP/patched');
fs.mkdirSync('pkgBAR/base',{recursive:true});fs.writeFileSync('pkgBAR/base/workflow_base.json',JSON.stringify(w));
console.log(w.nodes.length+' nodes; '+log.length+' code nodes set');
