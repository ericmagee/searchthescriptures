// pkgLIB comment strip (Eric approved 11:06 CST 2026-11-07: efficiency items). Removes JavaScript comments from the 22 library node sources, using
// acorn's own comment ranges (so "//" or "/*" inside strings, regexes and templates is never touched). A line comment is removed; a block comment
// becomes "\n" if it spans a line break (keeps automatic semicolon insertion the same) and " " otherwise; lines left empty are dropped.
// Run from wall2024/: node pkgLIB/strip.cjs <src dir> <out dir>
const fs=require('fs');const acorn=require('./vendor/acorn.cjs');
function strip(code){const W='async function VmCodeWrapper() { ',cm=[];acorn.parse(W+code+' }',{ecmaVersion:2025,sourceType:'module',onComment:(block,text,s,e)=>cm.push({block,s:s-W.length,e:e-W.length,nl:(text.includes('\n')||text.includes('\r')||text.includes(String.fromCharCode(8232))||text.includes(String.fromCharCode(8233)))})});
 let out='',at=0;for(const c of cm){out+=code.slice(at,c.s)+(c.block?(c.nl?'\n':' '):'');at=c.e;}out+=code.slice(at);
 return out.split('\n').map(l=>l.replace(/[ \t]+$/,'')).filter(l=>l.trim()!=='').join('\n');}
module.exports={strip};
if(require.main===module){const [SRC,OUT]=process.argv.slice(2);fs.mkdirSync(OUT,{recursive:true});let a=0,b=0;
 for(const f of fs.readdirSync(SRC).filter(f=>f.endsWith('.js')).sort()){const s=fs.readFileSync(SRC+'/'+f,'utf8');const t=strip(s);new Function('$','$input','return (async()=>{'+t+'\n})()');fs.writeFileSync(OUT+'/'+f,t);a+=s.length;b+=t.length;console.log(f.padEnd(34),s.length,'->',t.length);}
 console.log('total',a,'->',b,'('+Math.round(100*(a-b)/a)+'% smaller)');}
