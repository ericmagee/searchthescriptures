// W2: write a copy of a fetch-back with every library stub replaced by its rebuilt source (for older harnesses that read jsCode directly). usage: node destub.cjs <in> <out>
const fs=require('fs');let D=JSON.parse(fs.readFileSync(process.argv[2],'utf8'));const W=(D.data||D).workflow||(D.data||D);const lib=W.nodes.find(n=>n.name==='Shared Library').parameters.jsCode;let k=0;
for(const n of W.nodes){const s=n.parameters&&n.parameters.jsCode;if(!s)continue;let i=s.indexOf('\nreturn await new Function(');if(i<0)i=s.indexOf('\nconst __e4h');if(i<0)continue;n.parameters.jsCode=new Function('$',s.slice(0,i)+'\nreturn __S;')(()=>({params:{jsCode:lib}}));k++;}
fs.writeFileSync(process.argv[3],JSON.stringify(D));console.log('rebuilt',k,'stubs');
