// W2: write every Code node source (stubs rebuilt) of a fetch-back into pkgLIB/strip_<SET>/patched/<Node>.js. usage: node mkstrip.cjs <fetchback> <SET>
const fs=require('fs');let D=JSON.parse(fs.readFileSync(process.argv[2],'utf8'));const W=(D.data||D).workflow||(D.data||D);const lib=W.nodes.find(n=>n.name==='Shared Library').parameters.jsCode;
const dir='pkgLIB/strip_'+process.argv[3]+'/patched/';fs.mkdirSync(dir,{recursive:true});let k=0;
for(const n of W.nodes){let s=n.parameters&&n.parameters.jsCode;if(!s||!/\.code$/.test(n.type))continue;let i=s.indexOf('\nreturn await new Function(');if(i<0)i=s.indexOf('\nconst __e4h');if(i>=0)s=new Function('$',s.slice(0,i)+'\nreturn __S;')(()=>({params:{jsCode:lib}}));fs.writeFileSync(dir+n.name.replace(/ /g,'_')+'.js',s);k++;}
console.log(dir,k,'nodes');
