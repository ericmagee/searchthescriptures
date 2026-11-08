// E4 measure (W2, 11-08): would starting the alternate at Panel Cure Check have hit the seat the gate removes?
// Candidate = drv_uncured > 0 after Panel Cure Check; removed = drv_uncured > 0 after Gate Record (saved outputs).
const fs=require('fs');const D='/mnt/project-files/wall2024/inputs/';
const rd=f=>{try{const d=JSON.parse(fs.readFileSync(D+f));const r=d[0];return (r.data?r.data.main:r.main)[0];}catch(e){return null;}};
const seats=it=>{const o={};if(!it)return null;for(const x of it)for(const b of x.json.bodies||[]){const p=JSON.parse(b).payload;o[p.judge_seat]=p.drv_uncured||0;}return o;};
const tot={cand:0,removed:0,hit:0,wasted:0,missed:0};
for(const f of fs.readdirSync(D).filter(f=>/^\d+_Panel_Cure_Check\.json$/.test(f)).sort()){const R=f.split('_')[0];const a=seats(rd(f)),g=seats(rd(R+'_Gate_Record.json'));if(!a||!g)continue;
 const C=Object.keys(a).filter(k=>a[k]>0),G=Object.keys(g).filter(k=>g[k]>0);const hit=C.filter(k=>G.includes(k)),w=C.filter(k=>!G.includes(k)),m=G.filter(k=>!C.includes(k));
 tot.cand+=C.length;tot.removed+=G.length;tot.hit+=hit.length;tot.wasted+=w.length;tot.missed+=m.length;
 console.log(R,'candidates',C.join(',')||'-','| removed at gate',G.join(',')||'-','| wasted',w.join(',')||'-','| missed',m.join(',')||'-');}
console.log(JSON.stringify(tot));
