// W1 grade of pkgCMX: replay every node whose code holds a changed Shared Library line (1323, 1484, 1671), s130 vs CMX, on every stored export.
const fs=require('fs');const L=require('/mnt/project-files/w4/kwn/lib.cjs');const run=require('../pkgKSR/run_node.cjs');const P='/mnt/project-files/wall2024/';
const A=L('/tmp/claude-0/live_now.json'),B=L('/mnt/project-files/wall2024/parent_s130_CMX.json');
const ch=[];for(let i=0;i<A.Lb.length;i++)if(A.Lb[i]!==B.Lb[i])ch.push(i);
const NODES=Object.keys(A.M).filter(e=>A.M[e].p.some(p=>typeof p==='number'?ch.includes(p):typeof p[0]!=='string'&&ch.some(i=>p[0]<=i&&p[1]>=i)));
console.log('changed lines',ch,'nodes',NODES.length,NODES.join(', '));
const S=v=>JSON.stringify(v).replace(/20\d\d-\d\d-\d\dT\d\d:\d\d:\d\d(\.\d+)?Z/g,'<ts>');
(async()=>{let t=0,eq=0,er=0;for(const e of fs.readdirSync(P).filter(x=>/^ex\d+_full\.json$/.test(x))){const rd=JSON.parse(fs.readFileSync(P+e,'utf8')).data.resultData.runData;
 for(const n of NODES){if(!rd[n])continue;const a=await run(A.code(n),n,rd),b=await run(B.code(n),n,rd);t++;
  if(a.err||b.err){if(String(a.err)===String(b.err)){er++;continue;}console.log(e.slice(2,7),n,'ERR DIFFERS live:',a.err,'| CMX:',b.err);continue;}
  const sa=S(a),sb=S(b);if(sa===sb){eq++;continue;}let i=0;while(sa[i]===sb[i])i++;console.log('DIFF',e.slice(2,7),n,'at',i,'\n live:',sa.slice(Math.max(0,i-200),i+300),'\n CMX: ',sb.slice(Math.max(0,i-200),i+300));}}
 console.log('replays',t,'equal',eq,'same error both',er);})();
