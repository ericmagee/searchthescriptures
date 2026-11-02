const fs=require('fs');
const src=fs.readFileSync('unit.cjs','utf8');const T=eval(src.slice(src.indexOf('const T=[')+8,src.indexOf('];',src.indexOf('const T=['))+1));
const lib=f=>{const s=fs.readFileSync(f,'utf8');const a=s.indexOf('const NET_STATE');const b=s.indexOf(' return out;}',s.indexOf('function netLines'))+13;return new Function(s.slice(a,b)+';return netLines;')();};
let tot=0;for(const f of fs.readdirSync('new')){const N=lib('new/'+f);let bad=0;for(const [nm,txt,e] of T){bad+=((N(txt,['C4','C6']).length>0?1:0)!==e);}tot+=bad;console.log(bad?'BAD':'OK ',f);}
console.log('nodes bad',tot);
