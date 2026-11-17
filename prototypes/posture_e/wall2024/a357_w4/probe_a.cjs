const fs=require('fs');const {unpack,rb,load}=require('../tools/lib.cjs');const $=()=>({all:()=>[],first:()=>({json:{}}),isExecuted:false});
for(const f of ['rev2.json','target_357.json']){const u=unpack(JSON.parse(fs.readFileSync(f)));const T=load(rb(u.L,u.M['Panel Cure Check']),$);
for(const t of ['the meaning that was pressed is not met','D1 vs C1 (x): CHALLENGER LINK BROKEN -- the meaning that was pressed is not met. GROUND: [L1] Luke 1:1 "a"'])console.log(f,T.g4Press2024(t),t);}
