const {RD,out,fs}=require('./x.cjs');
const wf=JSON.parse(fs.readFileSync('/mnt/project-files/wall2024/fetchback_live_s112.json','utf8'));
const lib=wf.nodes.find(n=>n.name==='Shared Library').parameters.jsCode;
let i=-1,c=0;while((i=lib.indexOf('K-G7',i+1))>=0&&c<40){c++;console.log('@',i,lib.slice(Math.max(0,i-250),i+450).replace(/\n/g,' '));console.log('---')}
