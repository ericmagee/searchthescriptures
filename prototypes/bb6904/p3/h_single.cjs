// Runs Extract Independent Verdict, live (base/) and new, on one judge text with stubbed upstream; prints what differs.
// Usage: node h_single.cjs <raw0 json [[token, md5, text], ...]> [token]. prev carries audit_prompt ODV1-A2 and empty round texts,
// the same for both runs, so any difference is the new code's.
const fs=require('fs');const rows=JSON.parse(fs.readFileSync(process.argv[2],'utf8'));const want=process.argv[3];
const run=(file,raw0)=>{const src=fs.readFileSync(__dirname+'/'+file,'utf8');
 const prev={audit_prompt:'ODV1-A2',cr1:'',cr3:'',gr2:''};
 const $=n=>{if(n!=='Build Independent Verdict')throw new Error('unstubbed node '+n);return {first:()=>({json:prev})};};
 const $input={first:()=>({json:{choices:[{message:{content:raw0},finish_reason:'stop'}]}})};
 return new Function('$','$input',src)($,$input)[0].json;};
for(const [tok,,raw0] of rows){if(want&&tok!==want)continue;
 const a=run('base/Extract_Independent_Verdict.js',raw0),b=run('Extract_Independent_Verdict.new.js',raw0);
 const keys=[...new Set([...Object.keys(a),...Object.keys(b)])].filter(k=>JSON.stringify(a[k])!==JSON.stringify(b[k]));
 console.log('==',tok,'fields that differ:',keys.join(', ')||'none');
 for(const k of keys){if(k==='independent_verdict_raw'){const x=a[k],y=b[k];let i=0;while(i<x.length&&x[i]===y[i])i++;let j=0;while(j<x.length-i&&x[x.length-1-j]===y[y.length-1-j])j++;
   console.log(' raw: same prefix',i,'chars; base middle',JSON.stringify(x.slice(i,x.length-j)),'; new middle:');console.log(y.slice(i,y.length-j));}
  else console.log(' '+k+':',JSON.stringify(a[k]),'->',JSON.stringify(b[k]));}}
