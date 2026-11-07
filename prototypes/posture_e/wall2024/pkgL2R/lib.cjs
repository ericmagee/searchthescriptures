// pkgL2R: load L2C (and REFP, which it reads) out of a node's code, as the node defines them
function stmt(code,head){const a=code.indexOf(head);if(a<0)throw new Error('no '+head);const e=code.indexOf('})();',a);if(e<0)throw new Error('no end of '+head);return code.slice(a,e+5);}
function load(code){const src=stmt(code,'const L2C=(()=>{')+'\n'+stmt(code,'const REFP=(()=>{');
 const m={};new Function('m',src+'\n;m.L2C=L2C;m.REFP=REFP;')(m);return m;}
module.exports={load,stmt};
