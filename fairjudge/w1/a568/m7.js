const E=require('./env.js');const fs=require('fs');const R=E.J('rounds41822.json'),P=E.J('p_c1b_41822.json');
let OW=E.J('ow_d2_41822.json'),LX=E.J('lx_d2_41822_plus.json');const lxN=new Set(LX.map(x=>x.strongs_number));
for(const [k,ws] of JSON.parse(fs.readFileSync('extra.json'))){const m=k.match(/^(.+) (\d+):(\d+)$/);ws.forEach(([n,mo,len],i)=>{OW.push({book:m[1],chapter:+m[2],verse:+m[3],word_position:i+1,strongs_number:n,transliteration:'x',original_script:'',morph:mo});if(len&&!lxN.has(n)){lxN.add(n);LX.push({strongs_number:n,original_script:'',transliteration:'x',anchor_gloss:'g'.repeat(Math.max(1,len-(n+'  x: ').length))});}});}
const A565='for(const k of order)for(const r of (IX.V[k]||[])){const n=numOf(r.strongs_number);if(!n||seen.has(n))continue;seen.add(n);if(byN[n].every(isFunc)&&!KEEP.has(n)){fw++;continue;}';
const I565="for(const k of order)for(const r of (IX.V[k]||[])){const n=numOf(r.strongs_number);if(!n||seen.has(n)||!KEEP.has(n))continue;const L=IX.X[n];if(!L)continue;seen.add(n);const line=n+' '+String(L.original_script||'').trim()+' '+String(L.transliteration||'').trim()+': '+String(L.anchor_gloss||'');if(ch+line.length>CAPC){left.push(n);continue;}rows.push(line);ch+=line.length;}\n  ";
const src=E.l2cSrc('D2 Build');if(src.split(A565).length!==2)throw 'anchor';
const mk=(s565,cap)=>{let s=src;if(s565)s=s.replace(A565,I565+A565);if(cap)s=s.replace('const CAPC=26000;','const CAPC='+cap+';');return E.mkL2C(s);};
const keepOf=ts=>[...new Set(ts.join('\n').match(/\b[GH]0*\d{1,5}\b/g).map(x=>x.replace(/^([GH])0*/,'$1')))];
const L0=E.mkL2C(src);const plan=ts=>{const k=[];for(const t of ts)for(const r of L0.refsIn(t))if(!k.includes(r))k.push(r);return L0.sheetPlan(ts,k).l2_req;};
const cases={D2:{req:P.l2_req,prior:[R.DR1,R.CR1]},D3:{prior:[R.DR1,R.CR1,R.DR2,R.CR2]},D4:{prior:[R.DR1,R.CR1,R.DR2,R.CR2,R.DR3,R.CR3]}};
const IXa=L0.index(OW,LX);const nums=k=>[...new Set((IXa.V[k]||[]).map(r=>L0.numOf(r.strongs_number)).filter(Boolean))];
const rowsN=s=>new Set(s.split('\n').filter(l=>/^[GH]\d+ /.test(l)).map(l=>l.split(' ')[0]));
const out=[];
for(const [nm,c] of Object.entries(cases)){const req=c.req||plan(c.prior);const PP={l2_req:req,l2_keep:keepOf(c.prior)};
 for(const [lab,L] of [['565 only, cap 26000',mk(true,null)],['565 + ASK 568, cap 130000',mk(true,130000)]]){const s=L.sheet(OW,LX,PP);const got=rowsN(s);
  // every lexicon-held number on every cited verse, function words included only if served
  let need=0,miss=[];for(const k of req)for(const n of nums(k)){if(!IXa.X[n])continue;const fwd=OW.filter(r=>L0.numOf(r.strongs_number)===n).every(L0.isFunc)&&!PP.l2_keep.includes(n);if(fwd)continue;need++;if(!got.has(n))miss.push(k+' '+n);}
  const l135=nums('Luke 1:35').filter(n=>IXa.X[n]&&!(OW.filter(r=>L0.numOf(r.strongs_number)===n).every(L0.isFunc)&&!PP.l2_keep.includes(n)));
  const line=`${nm} | ${lab} | sheet ${s.length} chars, ${got.size} rows | content numbers on cited verses ${need}, unserved ${new Set(miss.map(x=>x.split(' ').pop())).size} | Luke 1:35 ${l135.filter(n=>got.has(n)).length}/${l135.length} served (${l135.join(' ')}) | G2316 ${got.has('G2316')} G1352 ${got.has('G1352')} | LEFT tail: ${/over the sheet cap/.test(s)}`;
  out.push(line);console.log(line);}}
fs.writeFileSync('m7_out.txt',out.join('\n')+'\n');
