// Replay L2 Count Plan (live code) on stored debates, then the trial pass; map the 116 measure rows.
const fs=require('fs');const W=(process.argv[2]&&/\.json$/.test(process.argv[2]))?process.argv[2]:'../a328/target_328.json';
const wf=JSON.parse(fs.readFileSync(W));const code=wf.nodes.find(n=>n.name==='L2 Count Plan').parameters.jsCode;
const L2C=require('./l2c_load.cjs')(W);const TRIAL=fs.readFileSync(__dirname+'/trial329.js','utf8');
const trialFn=new Function('L2C',TRIAL+'\nreturn __l2trial329;')(L2C);
const D=JSON.parse(fs.readFileSync('debates.json'));const OD=JSON.parse(fs.readFileSync('data_ow.json'));
const RA=r=>[['DEFENDER','CR1',r.claude_r1],['CHALLENGER','DR1',r.engine_r1],['DEFENDER','CR2',r.claude_r2],['CHALLENGER','DR2',r.engine_r2],['DEFENDER','CR3',r.engine_r3],['CHALLENGER','DR3',r.challenger_r3],['DEFENDER','CR4',r.defender_r4],['CHALLENGER','DR4',r.challenger_r4]].filter(x=>x[2]);
const lexBy={};for(const l of OD.lex)lexBy[l.strongs_number]=l;
function runNode(r){const ra=RA(r);const tg=L2C.tags(ra);const keys=new Set(tg.flatMap(t=>t.verses));const ow=OD.ow.filter(w=>keys.has(w.book+' '+w.chapter+':'+w.verse));
 const lex=[...new Set(ow.map(w=>w.strongs_number))].map(n=>lexBy[n]).filter(Boolean);const kv=OD.kjv.filter(v=>keys.has(v.book+' '+v.chapter+':'+v.verse));
 const S={l2_tags:tg,l2_claims:(L2C.countClaims?L2C.countClaims(ra):[])};const $=n=>{const m={'Citation Scan':[S],'L2 Words':ow,'L2 Lexicon':lex,'Cited Verses':kv}[n];return m?{isExecuted:true,all:()=>m.map(j=>({json:j})),first:()=>({json:m[0]})}:{isExecuted:false,all:()=>[],first:()=>({json:{}})};};
 const o=new Function('$','$input',code)($,{all:()=>[],first:()=>({json:{}})});const J=o[0].json;
 const owAll=OD.ow,lexAll=OD.lex;const tr=trialFn(JSON.parse(JSON.stringify(J.tags)),ra,owAll,lexAll,OD.kjv);return {J,tr};}
module.exports={runNode,D,RA};
if(require.main===module){const res={};let tot={};for(const r of D){const {J,tr}=runNode(r);res[r.run_token]=tr;for(const [k,v] of Object.entries(tr.n))tot[k]=(tot[k]||0)+v;if(tr.error)console.log('ERR',r.run_token,tr.error);}
 fs.writeFileSync('trial_out.json',JSON.stringify(res));console.log('debates',D.length,JSON.stringify(tot));}
