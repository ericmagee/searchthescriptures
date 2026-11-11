const ex=JSON.parse(require('fs').readFileSync('/mnt/project-files/wall2024/ex35173_full.json','utf8'));
const rd=(ex.data&&ex.data.resultData&&ex.data.resultData.runData)||ex.resultData?.runData||ex.runData;
for(const [n,runs] of Object.entries(rd)){
  const s=JSON.stringify(runs);
  const i=s.indexOf('D5 vs C6: CHALLENGER LINK BROKEN');
  if(i>=0) console.log('HIT',n,s.slice(Math.max(0,i-600),i+300).replace(/\\n/g,'\n'));
}
