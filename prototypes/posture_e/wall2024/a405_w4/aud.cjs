const fs=require('fs');const {replay}=require('./chain.cjs');
const T=JSON.parse(fs.readFileSync('t405.json'));const live=JSON.parse(fs.readFileSync('../rdf/fetchback_w407.json'));
const D=JSON.parse(fs.readFileSync('debates.json'));const r=D.find(x=>new RegExp(process.env.ONLY||'39015').test(x.run_token));
const M=replay(T,r);const J=M['L2 Count Plan'][0].json;const ML=replay(live,r);const JL=ML['L2 Count Plan'][0].json;
const a={...JL},b={...J};delete b.l2_t405;console.log('L2 Count Plan output identical apart from l2_t405:',JSON.stringify(a)===JSON.stringify(b));
const bs=T.nodes.find(n=>n.name==='Build Save Body').parameters.jsCode;const i=bs.indexOf('{let T5=null;');const e=bs.indexOf('/* ASK 405 */',i);const blk=bs.slice(i,e);
const out=[];new Function('$','out',blk)(n=>({isExecuted:true,first:()=>({json:J})}),out);console.log(out[0]);console.log('n:',JSON.stringify(J.l2_t405.n));
