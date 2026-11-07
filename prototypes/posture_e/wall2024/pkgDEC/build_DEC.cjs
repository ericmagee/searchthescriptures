// pkgDEC (W1; Eric approved the efficiency items 11:06 CST 2026-11-07). Decode once: each judgment body's seat is parsed once per node run, not once per
// scan. Send Back Record and Alt (8 scans each) and Alternate Merge Seat (1 scan per alternate tried): findIndex(x=>{try{return JSON.parse(x).payload.
// judge_seat===S;}catch(e){return false;}}) becomes findIndex(x=>__seatOf(x)===S), with __seatOf memoised per body string. A body that does not parse
// still matches nothing. Output byte-identical. Base: pkgL1Q/patched (W3 PASS, next to write; W2 12:12). Run from wall2024/: node pkgDEC/build_DEC.cjs [--base dir] [--out dir]
const fs=require('fs');const crypto=require('crypto');const sha=s=>crypto.createHash('sha256').update(s).digest('hex').slice(0,12);
const arg=(k,d)=>{const i=process.argv.indexOf(k);return i>0?process.argv[i+1]:d;};const BASE=arg('--base','pkgL1Q/patched'),OUT=arg('--out','pkgDEC/patched');
const HEAD="const __seatC=new Map(),__seatBad={};const __seatOf=x=>{if(__seatC.has(x))return __seatC.get(x);let s;try{s=JSON.parse(x).payload.judge_seat;}catch(e){s=__seatBad;}__seatC.set(x,s);return s;}; /* pkgDEC: decode once */\n";
const P=[["Send_Back_Record.js","findIndex(x=>{try{return JSON.parse(x).payload.judge_seat===seat;}catch(e){return false;}})","findIndex(x=>__seatOf(x)===seat)",8],
 ["Alt_Send_Back_Record.js","findIndex(x=>{try{return JSON.parse(x).payload.judge_seat===seat;}catch(e){return false;}})","findIndex(x=>__seatOf(x)===seat)",8],
 ["Alternate_Merge_Seat.js","findIndex(b=>{try{return JSON.parse(b).payload.judge_seat===x.removed_seat;}catch(e){return false;}})","findIndex(b=>__seatOf(b)===x.removed_seat)",1]];
fs.mkdirSync(OUT,{recursive:true});const plan={base:BASE,nodes:[]};
for(const [f,a,b,n] of P){const s0=fs.readFileSync(BASE+'/'+f,'utf8');const k=s0.split(a).length-1;if(k!==n)throw new Error(f+': '+k+' scans, expected '+n);
 if(s0.includes('__seatOf'))throw new Error(f+': __seatOf already present');const s=HEAD+s0.split(a).join(b);new Function('$','$input','return (async()=>{'+s+'\n})()');
 fs.writeFileSync(OUT+'/'+f,s);plan.nodes.push({file:f,scans:n,base_sha:sha(s0),final_sha:sha(s)});console.log(f.padEnd(28),sha(s0),'->',sha(s),n+' scans');}
fs.writeFileSync(OUT+'.plan.json',JSON.stringify(plan,null,1));
