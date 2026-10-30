const fs=require('fs');const S=process.argv[2];const F=JSON.parse(fs.readFileSync(process.argv[3],'utf8'));const LF='\n';
const T={'[CR1]':F.cr1,'[DR1]':F.gr1,'[CR2]':F.cr2,'[DR2]':F.gr2,'[CR3]':F.cr3,'[DR3]':F.dr3};
for(const [node,rounds] of [['D3_Build',['[DR1]','[DR2]']],['C3_Build',['[CR1]','[CR2]','[CR3]']]]){
 const s=fs.readFileSync(S+'/new/'+node+'.js','utf8');const i=s.indexOf('const PWL=(()=>{');const j=s.indexOf('})();',s.indexOf('return {',i))+5;
 eval(s.slice(i,j).replace('const PWL=','globalThis.PWL='));
 const b=PWL.citedBlock(rounds.map(k=>[k,T[k]]),'X').split(LF).slice(1);let n=0,bad=[];
 for(const line of b){const k=line.slice(0,line.indexOf(': '));const rest=line.slice(line.indexOf(': ')+2);if(rest==='none')continue;
  for(const lab of rest.split(', ')){n++;const m=lab.match(/^(.*) (\d+:\d+)(?:-(\d+))?$/);const re=new RegExp(m[1].replace(/ /g,'\\s')+'\\.?\\s'+m[2]+(m[3]?'\\s?[-–—]\\s?'+m[3]:'')+'(?!\\d)');if(!re.test(T[k]))bad.push(k+' '+lab);}}
 console.log(node,'listed',n,'not found written with book in its round:',bad.length?bad.join('; '):'none');}
