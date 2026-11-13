// pkgKFV test: kfcVerse of live and new on run 35856's [DR2] and on plants. Usage: node pkgKFV/test.cjs <live json> <new json>
const fs=require('fs');const fnOf=f=>{const w0=JSON.parse(fs.readFileSync(f));const W=(w0.data||w0).workflow||(w0.data||w0);
 const T=W.nodes.find(n=>n.name==='Shared Library').parameters.jsCode;const a=T.indexOf('\n/*LIB*/'),b=T.lastIndexOf('\n/*MAP*/');const Lb=JSON.parse(T.slice(a+8,b));
 const src=[];for(const nm of ['kkjvFold','__kfLB']){let i=Lb.findIndex(l=>new RegExp('(?:function|const)\\s+'+nm.replace('$','\\$')+'\\b').test(l));src.push(Lb[i]);while(!/^\s*(?:function|const|let)\s/.test(Lb[i+1]||'const')){i++;src.push(Lb[i]);}}
 let i=Lb.findIndex(l=>/^const KFC_REF=/.test(l));src.push(Lb[i]);i=Lb.findIndex(l=>/^function kfcVerse/.test(l));do{src.push(Lb[i]);i++;}while(!/if\(!r\)return null/.test(Lb[i-1]));
 return new Function(src.join('\n')+'\nreturn kfcVerse;')();};
const [L,K]=process.argv.slice(2,4).map(fnOf);const R=require('/mnt/project-files/w3/grade_35856/rounds.json');
const P=[['35856 DR2 Isaiah 7:16 press',"the sign is bounded in Isaiah's day.",R.engine_r2,'Isaiah 7:16'],
 ['35856 DR2 Isaiah 8:4 press','the sign child of Isaiah\'s day has a father and a mother.',R.engine_r2,'Isaiah 8:4'],
 ['head reference wins','Isaiah 7:14 the sign is a virgin.','x','Isaiah 7:14'],
 ['press line only','the virgin is Mary.','- Luke 1:27 "To a virgin espoused" -- MEANS: the virgin is Mary. -- [L3] Isaiah 7:14 "a virgin"','Luke 1:27'],
 ['prose line only (old path kept)','the virgin is Mary.','So the virgin is Mary (Luke 1:27), not another.','Luke 1:27'],
 ['prose first, press later','the virgin is Mary.','The virgin is Mary, as Matthew 1:23 says.\n- Luke 1:27 "To a virgin espoused" -- MEANS: the virgin is Mary.','Luke 1:27'],
 ['no line','nothing here matches at all.','- Luke 1:27 "x" -- MEANS: other.',null]];
let ok=0;for(const [nm,m,rt,exp] of P){const l=L(m,rt),k=K(m,rt);const r=k?k.ref:null;const pass=r===exp;if(pass)ok++;console.log((pass?'OK   ':'FAIL ')+nm+' | live '+(l?l.ref:null)+' | new '+r+' | expect '+exp);}
console.log('checks',ok,'of',P.length);
