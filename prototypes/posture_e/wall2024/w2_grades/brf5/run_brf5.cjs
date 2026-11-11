// W2 grade of pkgBRF rev 5: C4P.fresh / note on live s117 vs rev 5, plants recorded first in plants_brf5.json
const fs=require('fs');const D='/mnt/project-files/wall2024/';const g=p=>{const w=JSON.parse(fs.readFileSync(p));return (w.data||w).workflow||(w.data||w)};
const C=f=>{const s=g(D+f).nodes.find(n=>n.name=='C4 Build').parameters.jsCode;const i=s.indexOf('const REFP=');const j=s.indexOf('const C4P=');const k=s.indexOf('})();',j)+5;return new Function(s.slice(i,k)+'\nreturn C4P;')();};
const L=C('fetchback_live_s117.json'),R=C('parent_s117_BRF5.json');const P=JSON.parse(fs.readFileSync(__dirname+'/'+(process.argv[2]||'plants_brf5.json'))).plants;
const F=p=>({gr1:'',gr2:'',dr3:p.earlier.join('\n'),dr4:p.close,cr1:p.earlier.join('\n'),cr2:'',cr3:'',cr4:p.close});
for(const p of P){console.log('\n'+p.id,'| expect:',p.expect);for(const [nm,X] of [['live',L],['rev5',R]]){let a,b;try{a=X.note(F(p));b=X.noteD(F(p));}catch(e){a='ERR '+e.message;b='';}console.log(' ',nm,'C:',JSON.stringify(a).slice(0,330));console.log(' ',nm,'D:',JSON.stringify(b).slice(0,330));}}
