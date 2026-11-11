const fs=require('fs');const run=require('../pkgKSR/run_node.cjs');const L=require('/mnt/project-files/w4/kwn/lib.cjs');const P='/mnt/project-files/wall2024/';
const S=L(P+'fetchback_live_s123.json'),N=L(P+(process.env.F||'parent_s123_SYL.json'));const ex=fs.readdirSync(P).filter(x=>/^ex\d+_full\.json$/.test(x));const SHOW=process.env.SHOW;
(async()=>{for(const e of ex){const RD=JSON.parse(fs.readFileSync(P+e,'utf8')).data.resultData.runData;if(!RD['Build Save Body']){console.log(e,'BSB NOT REACHED');continue;}
 const a=await run(S.code('Build Save Body'),'Build Save Body',RD),b=await run(N.code('Build Save Body'),'Build Save Body',RD);if(a.err||b.err){console.log(e,'ERR',a.err,b.err);continue;}
 const st=RD['Build Save Body'][0].data.main[0][0].json;const A=a[0],B=b[0];
 const sa=A.saveBody.synthesis,sb=B.saveBody.synthesis;const A2=JSON.parse(JSON.stringify(A)),B2=JSON.parse(JSON.stringify(B));delete A2.saveBody.synthesis;delete B2.saveBody.synthesis;
 let conf=[];try{conf=RD['Close Enforcer Record'][0].data.main[0][0].json.cec.confirmed||[];}catch(x){}
 const add=sb.split('\n').filter(l=>!sa.split('\n').includes(l));
 console.log(e,'| live==stored synth',sa===st.saveBody.synthesis,'| rest equal',JSON.stringify(A2)===JSON.stringify(B2),'| confirmed',conf.map(x=>x.side[0]+x.link).join(',')||'none','| added lines',add.length,'| removed',sa.split('\n').filter(l=>!sb.split('\n').includes(l)).length);
 if(SHOW)add.forEach(l=>console.log('   +',l));
 if(RD['Format Markdown']&&RD['Get Row']){const gr=JSON.parse(JSON.stringify(RD['Get Row'][0].data.main));gr[0]=gr[0].map(i=>({json:{...i.json,synthesis:sb}}));const fa=await run(S.code('Format Markdown'),'Format Markdown',RD),fb=await run(S.code('Format Markdown'),'Format Markdown',RD,{'Get Row':gr});
  if(fa.err||fb.err){console.log('  FM ERR',fa.err,fb.err);continue;}const ta=JSON.stringify(fa),tb=JSON.stringify(fb);const ma=fa[0].markdown||fa[0].md||Object.values(fa[0]).find(v=>typeof v==='string'&&v.length>10000)||'',mb=fb[0].markdown||fb[0].md||Object.values(fb[0]).find(v=>typeof v==='string'&&v.length>10000)||'';
  const ad=mb.split('\n').filter(l=>!ma.split('\n').includes(l));console.log('  export: added lines',ad.length,'removed',ma.split('\n').filter(l=>!mb.split('\n').includes(l)).length,'| stored synthesis in Get Row == live BSB synth',RD['Get Row'][0].data.main[0][0].json.synthesis===sa);if(SHOW)ad.forEach(l=>console.log('   export+',l.slice(0,400)));}}})();
