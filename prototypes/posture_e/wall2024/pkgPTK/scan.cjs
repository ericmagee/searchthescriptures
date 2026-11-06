// pkgPTK: find the computed $() calls in a node's code.
/* every $( call, its argument read to the matching ")" (strings and nested parens skipped); a call whose argument is not one plain
   single-quoted string is computed. W3 2644 (3): the first pattern missed $('lit'+x). */
function calls(src){const out=[];const re=/(^|[^\w$.])\$\(/g;let m;while((m=re.exec(src))){const st=m.index+m[1].length,a0=st+2;let d=1,i=a0,q=null;
  for(;i<src.length&&d>0;i++){const c=src[i];if(q){if(c==='\\'){i++;continue;}if(c===q)q=null;continue;}if(c==="'"||c==='"'||c==='`'){q=c;continue;}if(c==='(')d++;else if(c===')')d--;}
  const arg=src.slice(a0,i-1);out.push({st,en:i,arg,lit:/^\s*'(?:[^'\\]|\\.)*'\s*$/.test(arg)});}return out;}
const COMPN=s=>calls(s).filter(c=>!c.lit);
module.exports={calls,COMPN};
