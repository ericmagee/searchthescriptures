const fs=require('fs');
const j=JSON.parse(fs.readFileSync('/mnt/project-files/wall2024/ex35067_full.json','utf8'));
const rd=(j.data&&j.data.resultData||j.resultData).runData;
const s=JSON.stringify(rd['Panel Build'][0].data.main[0][0].json);
const o=JSON.parse(s);
function walk(x,path,cb){if(typeof x==='string')cb(x,path);else if(Array.isArray(x))x.forEach((y,i)=>walk(y,path+'['+i+']',cb));else if(x&&typeof x==='object')for(const k in x)walk(x[k],path+'.'+k,cb);}
const seen=new Set();
walk(o,'',(t,p)=>{if(t.includes('ANTI-CHEAT')){for(const l of t.split('\n')){if(l.includes('ANTI-CHEAT')){const key=l;if(!seen.has(key)){seen.add(key);console.log(p,'|',l.slice(0,1500));}}}}});
