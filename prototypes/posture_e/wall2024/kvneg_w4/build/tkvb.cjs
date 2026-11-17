// Test of the built K-V guard on the rebuilt library text (target_kv.json) against live.json.
const fs=require('fs');const {unpack,rb}=require('../../tools/lib.cjs');
let fails=0;const ok=(n,c,d)=>{console.log((c?'ok  ':'FAIL')+' '+n+(d?' :: '+d:''));if(!c)fails++;};
const lw=JSON.parse(fs.readFileSync('live.json')),tw=JSON.parse(fs.readFileSync(process.argv[2]||'target_kv.json'));
const lu=unpack(lw),tu=unpack(tw);
const dl=tu.L.map((l,i)=>l!==lu.L[i]?i:-1).filter(i=>i>=0);ok('library lines changed are 987, 1024, 2187 only',tu.L.length===lu.L.length&&dl.join()==='987,1024,2187',dl.join(', '));
const LN={};for(const n of lw.nodes)LN[n.name]=n;const dn=tw.nodes.filter(n=>JSON.stringify(n)!==JSON.stringify(LN[n.name])).map(n=>n.name);ok('only the Shared Library node changed',dn.join()==='Shared Library',dn.join(', '));
const bad=Object.keys(tu.M).filter(k=>rb(tu.L,tu.M[k]).length!==tu.M[k].n);ok('every MAP entry rebuilds to its n',bad.length===0,Object.keys(tu.M).length+' entries'+(bad.length?' bad: '+bad.join(', '):''));
const ch=Object.keys(tu.M).filter(k=>rb(tu.L,tu.M[k])!==rb(lu.L,lu.M[k]));let syn=[];for(const k of ch){try{new Function('$','$input','return (async()=>{\n'+rb(tu.L,tu.M[k])+'\n})();');}catch(e){syn.push(k+': '+e.message);}}
ok('syntax of every changed library entry',syn.length===0,ch.length+' entries'+(syn.length?' '+syn.join('; '):''));
const kv=Object.keys(tu.M).filter(k=>rb(tu.L,tu.M[k]).includes('function kvSegments'));ok('14 kvSegments entries carry the new guard (W4 miscounted 16 at Wall 7379 and 7383)',kv.length===14&&kv.every(k=>rb(tu.L,tu.M[k]).includes(tu.L[1024])),kv.length+' entries');
const lits=[987,1024,2187].map(i=>{const m=tu.L[i].match(/\.replace\((\/[\s\S]*?\/gim),' '\)\)/);return m?m[1]:null;});ok('the three copies hold one identical guard literal',lits.every(x=>x&&x===lits[0]));
const NEG=eval(lits[0]);const skip=t=>!/\bVOID\b/.test(String(t).replace(NEG,' '));
const src=fs.readFileSync('../tkv.cjs','utf8');const C=eval('['+src.slice(src.indexOf('const C=[')+9,src.indexOf('];',src.indexOf('const C=[')))+']');
const cb=C.filter(([t,e])=>skip(t)!==e);ok('design cases on the built literal',cb.length===0,C.length+' cases'+(cb.length?' failing: '+cb.map(x=>x[0]).join(' | '):''));
ok("sol's 37891 sentence clears (rows 42373 to 42376)",skip('Premises 1, 2, 3 and 5 are spared; no listed premise is VOID.'));
console.log(fails?'FAILS '+fails:'ALL OK');
