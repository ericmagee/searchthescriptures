const fs=require('fs');const c=fs.readFileSync(process.argv[2],'utf8');
const fnText=name=>{const i=c.indexOf('function '+name+'(');let d=0,j=c.indexOf('{',i);for(let k=j;k<c.length;k++){if(c[k]==='{')d++;else if(c[k]==='}'&&--d===0)return c.slice(i,k+1);}};
const X=new Function(fnText('drvGround')+'\n'+c.slice(c.indexOf('const NET_STATE='),c.indexOf('// BB-8327 D1 (q3)'))+';return {netLines};')();
const G='D2 vs C3 (Matthew 1:20): CHALLENGER LINK BROKEN -- GROUND: ';
for(const t of ['Scripture is silent here; no verse is required (Isaiah 28:10).','Scripture, read precept upon precept, does not give Joseph as the begetter: Matthew 1:20 names the Holy Ghost.',
 'Scripture, read precept upon precept, does not give Joseph as the begetter: Matthew 1:20 and Luke 1:35 name the Holy Ghost.',
 'Scripture does not state that Joseph begat Jesus; [L3] the angel names the Holy Ghost.',
 'Scripture nowhere states that Joseph begat Jesus.',
 'no verse states that Joseph begat Jesus, as Matthew 1:16 shows.'])console.log(X.netLines(G+t,null,null).length?'FLAGGED ':'admitted','|',t.slice(0,90));
