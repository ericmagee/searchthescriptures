const {fs}=require('./x.cjs');
const wf=JSON.parse(fs.readFileSync('/mnt/project-files/wall2024/fetchback_live_s112.json','utf8'));
const lib=wf.nodes.find(n=>n.name==='Shared Library').parameters.jsCode;
const show=(s,a,b,max=3)=>{let i=-1,c=0;while((i=lib.indexOf(s,i+1))>=0&&c<max){c++;console.log('@',i,'::',lib.slice(Math.max(0,i-a),i+b));console.log('-----')}};
show('function netLines',0,2600,1);
show("x.rule==='K-C'){",300,1800,2);
show('NOT COUNTED (K-C UNCURED)',900,500,2);
show('enfUncured',0,700,2);
show('K-C (',200,1400,1);
