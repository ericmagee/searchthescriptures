// W2 ASK 435 plan probe: REFP (Shared Library lines 491-512 of live engine 06967796) old against a proposed new BARE rule, on stored debates and fixtures.
const fs=require('fs');const w=JSON.parse(fs.readFileSync(process.argv[2]));const c=w.nodes.find(x=>x.name==='Shared Library').parameters.jsCode;const L=JSON.parse(c.match(/\/\*LIB\*\/(\[.*?\])\n/s)[1]);
const SRC=L.slice(490,512).join('\n');if(!/^const REFP=/.test(SRC))throw new Error('REFP not at 491');
const OB="BARE=/^\\s?(?:,\\s?(?:and\\s)?(\\d{1,3})(?!\\d|:\\d|\\s+[A-Z])|";const NB="BARE=/^\\s?(?:,\\s?(?:and\\s)?(\\d{1,3})(?!\\d|:\\d)|";
const OL="if((x=rest.match(BARE))){const n=+(x[1]||x[2]);";const NL="if((x=rest.match(BARE))){const n=+(x[1]||x[2]);{const nb=(rest.slice(x[0].length).match(/^\\s+([A-Z][A-Za-z]+)/)||[])[1];if(nb&&(BK[key(n+nb)]||!/^\\s?,/.test(x[0])))break;}";
if(SRC.split(OB).length!==2||SRC.split(OL).length!==2)throw new Error('anchor');
const NEW=SRC.replace(OB,()=>NB).replace(OL,()=>NL);fs.writeFileSync('refp_new.js',NEW);
const mk=s=>new Function(s+'\nreturn REFP;')();const A=mk(SRC),B=mk(NEW);
const lab=x=>x.map(i=>(i.book||i.ctx||'?')+' '+i.label).join('; ');
const FX=[["Psalms 2:7, 12 Kiss the Son","Psalms 2:7; Psalms 2:12"],["John 3:16, 1 John 4:8","John 3:16; 1 John 4:8"],["Genesis 1:1, 2 Kings 3:4","Genesis 1:1; 2 Kings 3:4"],["Romans 8:28, 1 Cor 2:9","Romans 8:28; 1 Corinthians 2:9"],["Luke 21:26, 35","Luke 21:26; Luke 21:35"],["Matthew 1:20, 18 says","Matthew 1:20"],["Luke 1:36, 5 makes","Luke 1:36"],["Isaiah 7:11, 7:14","Isaiah 7:11; Isaiah 7:14"],["John 10:14, 16 These sheep","John 10:14; John 10:16"],["Matt 1:21, 25 Joseph names","Matthew 1:21; Matthew 1:25"],["Psalms 2:7 and 12 Kiss","Psalms 2:7"],["Genesis 3:15, 3 John 1:2","Genesis 3:15; 3 John 1:2"]];
let pass=0;for(const [t,e] of FX){const g=lab(B.parse(t));const ok=g===e;pass+=ok;console.log(ok?'PASS':'FAIL',JSON.stringify(t),'old:',lab(A.parse(t)),'| new:',g);}console.log('fixtures',pass,'of',FX.length);
if(process.argv[3]){const D=JSON.parse(fs.readFileSync(process.argv[3]));const F=['claude_r1','engine_r1','claude_r2','engine_r2','engine_r3','challenger_r3','defender_r4','challenger_r4','synthesis'];let texts=0,diff=0,lost=0,gained=0;const ex=[];
 for(const r of D)for(const f of F){const t=r[f];if(!t)continue;texts++;for(const sc of [false,true]){const a=A.parse(t,{scoped:sc}).map(i=>i.at+'|'+(i.book||i.ctx)+' '+i.label),b=B.parse(t,{scoped:sc}).map(i=>i.at+'|'+(i.book||i.ctx)+' '+i.label);const sa=new Set(a),sb=new Set(b);const g=b.filter(x=>!sa.has(x)),l=a.filter(x=>!sb.has(x));
  if(g.length||l.length){diff++;gained+=g.length;lost+=l.length;if(!sc)for(const x of g.concat(l.map(y=>'LOST '+y))){const at=+x.replace('LOST ','').split('|')[0];ex.push(r.run_token.slice(5,10)+' '+f+' '+x.replace(/^\d+\|/,'')+' :: '+t.slice(at,at+70).replace(/\n/g,' '));}}}}
 console.log('texts',texts,'texts x modes with a difference',diff,'items gained',gained,'items lost',lost);ex.forEach(x=>console.log('  ',x));}
