const fs=require('fs');const W=JSON.parse(fs.readFileSync(process.argv[2],'utf8'));const T=W.nodes.find(n=>n.name==='Shared Library').parameters.jsCode;
const LIB=JSON.parse(T.slice(T.indexOf('\n/*LIB*/')+8,T.lastIndexOf('\n/*MAP*/')));
const grab=i=>{const s=LIB.slice(i,i+40).join('\n');const k=s.indexOf('function psGrades(');let d=0,j=s.indexOf('{',k);for(let p=j;p<s.length;p++){const ch=s[p];if(ch==='{')d++;else if(ch==='}'){d--;if(!d)return s.slice(k,p+1);}}throw 'x';};
fs.writeFileSync(process.argv[3],'function ri3Head2024(l){return null}\nconst P1=(()=>{'+grab(1376)+';return psGrades;})();\nconst P2=(()=>{'+grab(2644)+';return psGrades;})();\nmodule.exports={P1,P2};');
