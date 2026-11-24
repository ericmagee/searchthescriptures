// ASK 611 fix 2 (W4): the QR judges rebuild that ASK 611 put on the Library lines and two nodes is put also on the two MAP inline strings it missed (Send Back Build, Late Gate Build), in engine and child alike.
// The new text is copied from live LIB 620, so it is the same rebuild already live everywhere else. Nothing else changes.
// usage: node buildf2.cjs <engine.json> <child.json> <outdir>
const fs=require('fs');const [BE,BC,O]=process.argv.slice(2);const E=JSON.parse(fs.readFileSync(BE)),C=JSON.parse(fs.readFileSync(BC));
const S_OLD='{judges:__m.judges,qa588:__m.qa_text}';
const split=T=>({head:T.slice(0,T.indexOf('\n/*LIB*/')),L:JSON.parse(T.slice(T.indexOf('\n/*LIB*/')+8,T.lastIndexOf('\n/*MAP*/'))),M:JSON.parse(T.slice(T.lastIndexOf('\n/*MAP*/')+8,T.lastIndexOf('\n/*END*/'))),tail:T.slice(T.lastIndexOf('\n/*END*/')+8)});
const join=p=>p.head+'\n/*LIB*/'+JSON.stringify(p.L)+'\n/*MAP*/'+JSON.stringify(p.M)+'\n/*END*/'+p.tail;
const SL=W=>W.nodes.find(n=>n.name==='Shared Library');
const pe=split(SL(E).parameters.jsCode);if(join(pe)!==SL(E).parameters.jsCode)throw new Error('engine library does not split and join back');
const l620=pe.L[620];const a=l620.indexOf('{judges:__m.judges.map(');const b=l620.indexOf(',qa588:__m.qa_text}',a);if(a<0||b<0)throw new Error('no rebuild form on LIB 620');
const S_NEW=l620.slice(a,b+',qa588:__m.qa_text}'.length);
const KEYS=['Send Back Build','Late Gate Build'];
for(const W of [E,C]){const p=split(SL(W).parameters.jsCode);if(join(p)!==SL(W).parameters.jsCode)throw new Error('library does not split and join back');
 const hits=[];for(const k of Object.keys(p.M))p.M[k].p.forEach((e,j)=>{if(Array.isArray(e)&&typeof e[0]==='string'&&e[0].includes(S_OLD))hits.push([k,j]);});
 if(hits.map(h=>h[0]).sort().join()!==KEYS.slice().sort().join())throw new Error('snippet found in '+hits.map(h=>h[0]).join(', '));
 for(const [k,j] of hits){const s=p.M[k].p[j][0];if(s.split(S_OLD).length!==2)throw new Error(k+': snippet not once');p.M[k].p[j][0]=s.replace(S_OLD,()=>S_NEW);p.M[k].n+=S_NEW.length-S_OLD.length;}
 SL(W).parameters.jsCode=join(p);}
fs.writeFileSync(O+'/target_engine_f2.json',JSON.stringify(E));fs.writeFileSync(O+'/target_child_f2.json',JSON.stringify(C));
console.log('S_NEW',S_NEW.length,'characters, from LIB 620; changed MAP entries:',KEYS.join(', '),'in engine and child');
