const fs=require('fs');const [IN,OUT]=process.argv.slice(2);const W=JSON.parse(fs.readFileSync(IN));
const OLD='left out by the 60-gloss and 30-number caps)',NEW='left out by the 250-gloss and 100-number caps)';
const n=W.nodes.find(x=>x.name==='Build Save Body');const s=n.parameters.jsCode;const c=s.split(OLD).length-1;if(c!==1)throw new Error('count '+c);
const g=W.nodes.find(x=>x.name==='L2 Gloss Plan').parameters.jsCode.match(/GLOSS_CAP=(\d+),NUM_CAP=(\d+)/);if(!g||g[1]!=='250'||g[2]!=='100')throw new Error('live caps are not 250 and 100');
n.parameters.jsCode=s.replace(OLD,NEW);fs.writeFileSync(OUT,JSON.stringify(W));console.log('applied 1; caps in L2 Gloss Plan',g[1],g[2]);
