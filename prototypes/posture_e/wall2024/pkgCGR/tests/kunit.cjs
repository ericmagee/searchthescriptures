const fs=require('fs');const src=fs.readFileSync('krep.cjs','utf8');const lib=eval('('+src.slice(src.indexOf('const lib=f=>'),src.indexOf('const O=lib')).replace(/^const lib=/,'').replace(/;\s*$/,'')+')');
const O=lib('live_un.json'),N=lib('new_un.json');
const q='[CR4] I keep D1 to D6 exactly as declared. I narrow nothing, concede nothing and restore nothing.';const rec='... closing. I keep D1 to D6 exactly as declared. I narrow nothing, concede nothing and restore nothing. More text [L1] here';
console.log('W2 sentence: old found',O.krulFound(q,rec),'| new found',N.krulFound(q,rec));
for(const t of ['[L1] Luke 1:35','[R2] x','[CR1] a','[DR3] y','[GR2] z','D6 vs C6','CR4 without brackets','[CR10] two digits','[XR1] other'])console.log(JSON.stringify(t),'old:',JSON.stringify(O.krulNorm(t)),'new:',JSON.stringify(N.krulNorm(t)));
console.log('--- rev 2 plants (W3 F1 and more)');
const pl=[['... PROVEN IN CR1 and more','x ... PROVEN IN [CR1] and more y'],['(CR4) I keep D1 to D6 exactly as declared.','[CR4] I keep D1 to D6 exactly as declared.'],['[CR4] I keep D1 to D6 exactly as declared.','CR4: I keep D1 to D6 exactly as declared.'],['[CR4] I keep D1 to D6 exactly as declared.','(CR4) I keep D1 to D6 exactly as declared.'],['I keep D1 to D6','I keep D1 to D6'],['Luke 1:35 says','[L1] Luke 1:35 says'],['[CR4] Granted.','[CR4] Granted.'],['microcr1 test words','microcr1 test words'],['DR. Smith said so','DR. Smith said so']];
for(const [q,r] of pl)console.log(JSON.stringify(q),'in',JSON.stringify(r),'| old',O.krulFound(q,r),'new',N.krulFound(q,r));
