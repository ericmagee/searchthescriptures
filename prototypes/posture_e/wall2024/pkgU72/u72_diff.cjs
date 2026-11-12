const fs=require('fs');process.env.BASE=__dirname+'/s152.json';process.argv[2]=__dirname+'/u72.json';const {LV,PK,run}=require('./replay_base.cjs');
(async()=>{for(const [ex,n] of [['34780','Panel Payloads'],['35296','Alternate Payloads']]){const f=fs.readdirSync('/mnt/project-files/wall2024/').find(x=>x.startsWith('ex'+ex)&&x.endsWith('.json'));
const rd=JSON.parse(fs.readFileSync('/mnt/project-files/wall2024/'+f,'utf8')).data.resultData.runData;const sc=rd[n][0].source[0];const inp=rd[sc.previousNode][sc.previousNodeRun||0].data.main[sc.previousNodeOutput||0]||[];
const a=(await run(LV,rd,n,inp)).map(x=>JSON.stringify(x.json)),b=(await run(PK,rd,n,inp)).map(x=>JSON.stringify(x.json));
for(let i=0;i<b.length;i++){if(a[i]===b[i])continue;const A=a[i]||'',B=b[i];let s=0;while(A[s]===B[s])s++;console.log('==',ex,n,'item',i,'lenA',A.length,'lenB',B.length);console.log('A:',A.slice(Math.max(0,s-300),s+500));console.log('B:',B.slice(Math.max(0,s-300),s+200));}}})();
