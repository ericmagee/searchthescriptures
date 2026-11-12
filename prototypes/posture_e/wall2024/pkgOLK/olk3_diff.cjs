const fs=require('fs');process.env.BASE=__dirname+'/s152.json';process.argv[2]=__dirname+'/olk3.json';const {LV,PK,run}=require('./replay_base.cjs');
const dec=s=>{for(let k=0;k<3;k++)s=s.replace(/\\\\/g,'\\').replace(/\\n/g,'\n').replace(/\\"/g,'"');return s;};
(async()=>{for(const ex of ['33490','33497','34852']){const f=fs.readdirSync('/mnt/project-files/wall2024/').find(x=>x.startsWith('ex'+ex)&&x.endsWith('.json'));const rd=JSON.parse(fs.readFileSync('/mnt/project-files/wall2024/'+f,'utf8')).data.resultData.runData;const n='Judge Enforcer Build';
const sc=rd[n][0].source[0];const inp=rd[sc.previousNode][sc.previousNodeRun||0].data.main[sc.previousNodeOutput||0]||[];
const A=dec((await run(LV,rd,n,inp)).map(x=>JSON.stringify(x.json)).join('\n')),B=dec((await run(PK,rd,n,inp)).map(x=>JSON.stringify(x.json)).join('\n'));
const ia=[...A.matchAll(/ITEM B\d+ \(E-ANS[\s\S]*?(?=\nITEM |$)/g)].map(m=>m[0]),ib=[...B.matchAll(/ITEM B\d+ \(E-ANS[\s\S]*?(?=\nITEM |$)/g)].map(m=>m[0]);
let ch=0;const seen=new Set();for(let i=0;i<ib.length;i++){if(ia[i]!==ib[i]){const id=ib[i].slice(0,40);if(seen.has(id))continue;seen.add(id);ch++;const ans=(ib[i].match(/THE ANSWER: ([^\n]*)/)||[])[1];const ol=(ib[i].match(/OTHER LINES[^\n]*: "([\s\S]{0,420})/)||[])[1];console.log(ex,id.replace(/\n/g,' '),'| ANSWER',ans&&ans.slice(0,120),'\n   NOW FIRST:',ol&&ol.replace(/\n/g,' ').slice(0,240));}}
const calls=s=>(s.match(/"calls?":\s*\d+/g)||[]).slice(0,2);console.log(ex,'items changed',ch,'| len A',A.length,'B',B.length,'| E-ANS items',ia.length,ib.length);}})();
