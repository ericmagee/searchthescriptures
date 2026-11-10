// W3 J6: execution 34299 (no confirmed closing line). Each node rerun on its STORED inputs with live s110, joint base (JB) and joint candidate (JC) sources.
const fs=require('fs');process.chdir(__dirname+'/../..');const run=require('../run_node.cjs');const {rebuild}=require('../../pkgLIB/unpack.cjs');
const L=f=>{let d=JSON.parse(fs.readFileSync(f,'utf8'));d=Array.isArray(d)?d[0]:d;d=d.data||d;return d.workflow||d;};
const W={LIVE:L('/mnt/project-files/wall2024/fetchback_live_s110.json'),JB:L('pkgKSR/joint_GFS_QRD_F3A2s.json'),JC:L('/mnt/project-files/wall2024/joint_GFS_QRD_F3A2s_plus_KSR_ECB_rev3.json'),R3:L('pkgKSR/parent_s110_ALL.json')};
const src=(s,n)=>{const w=W[s];const c=w.nodes.find(x=>x.name===n).parameters.jsCode;return /^\/\/ pkgLIB stub/.test(c)?rebuild(c,w.nodes.find(x=>x.name==='Shared Library').parameters.jsCode):c;};
const X=JSON.parse(fs.readFileSync('/mnt/project-files/wall2024/ex34299_full.json','utf8'));const RD=(X.data||X).resultData.runData;const nt=s=>JSON.stringify(s).replace(/\d{4}-\d\d-\d\dT\d\d:\d\d:\d\d\.\d{3}Z/g,'T');
let ok=0,bad=0;const T=(c,m)=>{c?ok++:bad++;console.log((c?'OK   ':'FAIL ')+m);};
(async()=>{const c=RD['Close Enforcer Record'][0].data.main[0][0].json.cec;console.log('34299 closing enforcer: confirmed '+c.confirmed.length+', none '+c.none);
 for(const n of ['Panel Cure Check','Send Back Build','Send Back Record','Gate Build','Gate Record']){const o={};for(const s of Object.keys(W)){const a=await run(src(s,n),n,RD);o[s]=a&&a.err?'ERR '+a.err:nt(a);}
  const st=nt(RD[n][0].data.main[0].map(x=>x.json));
  T(o.JC===o.JB&&!/^ERR/.test(o.JC),n+': JC equals JB'+(/^ERR/.test(o.JC)?' ('+o.JC.slice(0,120)+')':''));T(o.R3===o.LIVE,n+': s110 rev 3 equals live s110');
  console.log('     '+n+': JB equals live s110: '+(o.JB===o.LIVE)+'; live s110 rerun equals the stored s94 output: '+(o.LIVE===st)+'; output size '+o.JC.length);}
 console.log(ok+' OK, '+bad+' FAIL');})();
