// W2 test file only (not a candidate): joint5 (GFC s, QRD 5, F3A 2s, KSR/ECB 3, GCCN 2) with its three Gate Record nodes unpacked to full source,
// then GCCN rev 3's tag change and, if GUB=1, the pkgGUB block, line and filter applied. Used to reach Alt and R2 Alt Gate Record with W1's round 2 plant.
const fs=require('fs');const {rebuild}=require('../../pkgLIB/unpack.cjs');
let d=JSON.parse(fs.readFileSync('/mnt/project-files/wall2024/joint5_GFS_QRD_F3A2s_KSR_ECB_rev3_GCCN2.json','utf8'));d=d.data||d;d=d.workflow||d;
const lib=d.nodes.find(n=>n.name==='Shared Library').parameters.jsCode;
const SBR=fs.readFileSync('pkgLIB/strip_R1/patched/Send_Back_Record.js','utf8').split('\n');const a=SBR.findIndex(l=>l.startsWith('const ECL=(()=>{')),z=SBR.findIndex(l=>l.startsWith(' return {rounds,pressed,graded,missing,undOk'));
const GUB=fs.readFileSync('pkgGUB/gub_line.js','utf8').trim();
for(const name of ['Gate Record','Alt Gate Record','R2 Alt Gate Record']){const n=d.nodes.find(x=>x.name===name);let s=n.parameters.jsCode;if(/^\/\/ pkgLIB stub/.test(s))s=rebuild(s,lib);
 const c0=s.split("/^\\[AUDIT v4\\d: .*counted in drv_uncured/").length-1;s=s.replace("/^\\[AUDIT v4\\d: .*counted in drv_uncured/","/^\\[AUDIT v(?:4\\d|51): .*counted in drv_uncured/");
 let c1=1;if(process.env.GUB){const L=s.split('\n');const k=L.findIndex(l=>/^const PASS=\$\('/.test(l));L.splice(k+1,0,GUB);L.splice(k,0,...SBR.slice(a,z+1));s=L.join('\n');
  const F="/^E-APPLY S\\d+$/.test(r.src)&&String(p.verdict_raw)";c1=s.split(F).length-1;s=s.replace(F,"/^E-APPLY S\\d+$/.test(r.src)&&__gub(r,g.seat,p.verdict_raw,res)&&String(p.verdict_raw)");}
 new Function('$','$input','return (async()=>{\n'+s+'\n})();');n.parameters.jsCode=s;console.log(name+': GCCN tag pattern found '+c0+', GUB filter found '+c1);}
fs.writeFileSync(process.argv[2],JSON.stringify(d));console.log('wrote '+process.argv[2]);
