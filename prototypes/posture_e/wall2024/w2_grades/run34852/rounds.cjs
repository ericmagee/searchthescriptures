const {rd}=require('./ld.cjs');const fs=require('fs');
const Fs=[];const walk=(v,d)=>{if(d>12||v==null||typeof v!=='object')return;if(Array.isArray(v)){v.forEach(x=>walk(x,d+1));return;}if(typeof v.cr4==='string'&&typeof v.cr3==='string'&&typeof v.dr4==='string')Fs.push(v);for(const k in v)walk(v[k],d+1);};
for(const k in rd)walk(rd[k],0);const F=Fs.sort((a,b)=>(b.cr4.length+b.dr4.length)-(a.cr4.length+a.dr4.length))[0];
const o={};for(const k of ['cr1','gr1','cr2','gr2','cr3','dr3','cr4','dr4','dr1','dr2'])if(typeof F[k]==='string')o[k]=F[k];
fs.writeFileSync('rounds.json',JSON.stringify(o));for(const k in o)console.log(k,o[k].length);
