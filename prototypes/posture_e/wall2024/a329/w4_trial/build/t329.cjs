// PRE/POST replay of L2 Count Plan on 67 stored debates (incl. 37372): output minus l2_trial byte-identical; l2_trial equals the standalone trial.
const fs=require('fs');const PRE=JSON.parse(fs.readFileSync(process.argv[2]||'../rdf/fetchback_s220_328.json')),POST=JSON.parse(fs.readFileSync('target_329.json'));
const code=w=>w.nodes.find(n=>n.name==='L2 Count Plan').parameters.jsCode;const cP=code(PRE),cQ=code(POST);
const L2C=require('../a329/l2c_load.cjs')(process.argv[2]||'../rdf/fetchback_s220_328.json');
const D=JSON.parse(fs.readFileSync('../a329/debates.json'));const OD=JSON.parse(fs.readFileSync('../a329/data_ow.json'));const lexBy={};for(const l of OD.lex)lexBy[l.strongs_number]=l;
const TR=new Function('L2C',fs.readFileSync('../a329/trial329.js','utf8')+'\nreturn __l2trial329;')(L2C);
let same=0,trialEq=0,err=0,tot={};const out37372={};
for(const r of D){const F={cr1:r.claude_r1,gr1:r.engine_r1,cr2:r.claude_r2,gr2:r.engine_r2,cr3:r.engine_r3,dr3:r.challenger_r3,cr4:r.defender_r4,dr4:r.challenger_r4};
 const ra=[['DEFENDER','CR1',F.cr1],['CHALLENGER','DR1',F.gr1],['DEFENDER','CR2',F.cr2],['CHALLENGER','DR2',F.gr2],['DEFENDER','CR3',F.cr3],['CHALLENGER','DR3',F.dr3],['DEFENDER','CR4',F.cr4],['CHALLENGER','DR4',F.dr4]].filter(x=>x[2]);
 const tg=L2C.tags(ra);const keys=new Set(tg.flatMap(t=>t.verses));const ow=OD.ow.filter(w=>keys.has(w.book+' '+w.chapter+':'+w.verse));const lex=[...new Set(ow.map(w=>w.strongs_number))].map(n=>lexBy[n]).filter(Boolean);const kv=OD.kjv.filter(v=>keys.has(v.book+' '+v.chapter+':'+v.verse));
 const S={l2_tags:tg,l2_claims:(L2C.countClaims?L2C.countClaims(ra):[])};
 const M={'Citation Scan':[S],'L2 Words':ow,'L2 Lexicon':lex,'Cited Verses':kv,'Final Output':[F]};
 const $=n=>{const m=M[n];return m?{isExecuted:true,all:()=>m.map(j=>({json:JSON.parse(JSON.stringify(j))})),first:()=>({json:JSON.parse(JSON.stringify(m[0]))})}:{isExecuted:false,all:()=>[],first:()=>({json:{}})};};
 const run=c=>new Function('$','$input',c)($,{all:()=>[],first:()=>({json:{}})})[0].json;
 const a=run(cP),b=run(cQ);const t=b.l2_trial;delete b.l2_trial;if(JSON.stringify(a)===JSON.stringify(b))same++;
 const ref=TR(JSON.parse(JSON.stringify(a.tags)),ra,ow,lex,kv);if(JSON.stringify(ref)===JSON.stringify(t))trialEq++;if(t.error){err++;console.log('ERR',r.run_token,t.error);}
 for(const [k,v] of Object.entries(t.n))tot[k]=(tot[k]||0)+v;if(/37372/.test(r.run_token))Object.assign(out37372,{run:r.run_token,n:t.n,items:t.items.map(x=>x.round+' '+x.num+' '+x.trial+' -- '+x.why.slice(0,150))});}
console.log('debates',D.length,'| output minus l2_trial identical',same,'| l2_trial equals standalone',trialEq,'| errors',err);console.log('totals',JSON.stringify(tot));console.log(JSON.stringify(out37372,null,1));
