const L=require('/mnt/project-files/w4/kwn/lib.cjs');const x=L(''+(process.env.WF||'/tmp/claude-0/live_now.json')+'');
const def=name=>{const i=x.Lb.findIndex(l=>new RegExp('function '+name+'\\b|(?:const|let|var) '+name+'\\s*=').test(l));let j=i,src='';while(j<x.Lb.length){src+=x.Lb[j]+'\n';try{new Function(src);return src;}catch(e){j++;}}};
let src=def('psGrades');const to=process.argv[2];
for(let k=0;k<20;k++){try{const ps=new Function(src+';return psGrades;')();console.log(JSON.stringify(ps(to)));break;}catch(e){const m=String(e.message).match(/(\w+) is not defined/);if(!m){console.log('ERR',e.message);break;}src=def(m[1])+src;}}
