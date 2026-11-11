const fs=require('fs');const un=p=>{let j=JSON.parse(fs.readFileSync(p,'utf8'));j=j.data||j;return j.workflow||j;};
const L=w=>{const T=un(w).nodes.find(n=>n.name==='Shared Library').parameters.jsCode;return JSON.parse(T.slice(T.indexOf('\n/*LIB*/')+8,T.lastIndexOf('\n/*MAP*/')));};
const N=new Function(L('/mnt/project-files/wall2024/parent_s143_DFR.json')[1898].trim()+';return OPEN;')();
for(const l of fs.readFileSync('dfr_out.txt','utf8').split('\n').filter(x=>x.includes('FAIL->PASS'))){const m=l.match(N);console.log(l.slice(0,5),JSON.stringify(m&&m[0]),'|',l.slice(l.search(/D\d+ vs C\d+/),l.search(/D\d+ vs C\d+/)+40));}
