// node run.cjs [fn.js]  runs the fixed regression set (regress.json) and the agreed overrides (overrides.json) against a cecWvr source
const fs=require('fs');const fp=process.argv[2]||__dirname+'/../wvr_fn.js';eval(fs.readFileSync(fp,'utf8').replace('const cecWvr','globalThis.cecWvr'));
const R=JSON.parse(fs.readFileSync(__dirname+'/regress.json'));let O={};try{O=JSON.parse(fs.readFileSync(__dirname+'/overrides.json'));}catch(e){}
let ok=0,bad=[];for(const r of R){const key=r.src+' | '+r.name;let exp=r.exp;if(O[key])exp=O[key].exp;let o;try{o=cecWvr(r.F,r.prev||[]);}catch(e){bad.push([key,'THROW '+e.message]);continue;}
 const got=o.map(c=>c.side[0]+' LINK '+c.n).join('; ')||'none';let pass;
 if(exp==='any')pass=true;else if(typeof exp==='number')pass=o.length===exp&&(!r.chk||eval('('+r.chk+')')(o));else pass=got===exp||(/none or enforcer/.test(exp));
 if(pass)ok++;else bad.push([key,'got '+got+' want '+JSON.stringify(exp)]);}
for(const b of bad)console.log('FAIL',b[0],'::',b[1]);console.log(ok+'/'+R.length,'pass');process.exitCode=bad.length?1:0;
