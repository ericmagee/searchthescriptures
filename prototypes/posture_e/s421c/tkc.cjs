const fs=require('fs');const c=fs.readFileSync(process.argv[2],'utf8');
// a function's full text by brace matching
const fnText=name=>{const i=c.indexOf('function '+name+'(');let d=0,j=c.indexOf('{',i);for(let k=j;k<c.length;k++){if(c[k]==='{')d++;else if(c[k]==='}'&&--d===0)return c.slice(i,k+1);}};
const sec=c.slice(c.indexOf('const NET_STATE='),c.indexOf('// BB-8327 D1 (q3)'));
const X=new Function(fnText('drvGround')+'\n'+sec+';return {netLines,netKeeps};')();
const T=['D2 vs C3 (Matthew 1:20): CHALLENGER LINK BROKEN -- GROUND: Scripture, read precept upon precept, does not give Joseph as the begetter: Matthew 1:20 and Luke 1:35 name the Holy Ghost.',
 'D2 vs C3 (Matthew 1:20): CHALLENGER LINK BROKEN -- GROUND: Scripture nowhere states that Joseph begat Jesus.',
 'D2 vs C3 (Matthew 1:20): CHALLENGER LINK BROKEN -- GROUND: no verse states that Joseph begat Jesus, as Matthew 1:16 and Luke 3:23 show.',
 'D2 vs C3 (Matthew 1:20): CHALLENGER LINK BROKEN -- GROUND: Scripture does not state that Joseph begat Jesus; Matthew 1:16 and Luke 3:23 name him otherwise.'];
for(const t of T)console.log(X.netLines(t,null,null).length?'FLAGGED ':'admitted','| keeps:',X.netKeeps(t),'|',t.slice(50,135));
