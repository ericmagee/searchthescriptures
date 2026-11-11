const fs=require('fs');const {run,live,cand}=require('./t1.cjs');
const F=fs.readFileSync('luna_final.txt','utf8').split('\n');
const orig=lab=>{const l=F.find(x=>x.includes('SUPERSEDED LINE')&&x.includes('LABEL: '+lab+';'));return l.match(/ORIGINAL: (.*) ; END\]/)[1].replace(/\((CR\d|DR\d|L\d)\)/g,'[$1]');};
const P=F.slice();P[9]=orig('D1 VS C4');P[12]=orig('D4 VS C2');P[15]=orig('D6 VS C1');P.splice(13,1);
const pre=P.join('\n');fs.writeFileSync('luna_pregate.txt',pre);
const show=(n,T)=>{const a=run(live,T),b=run(cand,T);console.log('##',n,'\n live:',a.join(' ; ')||'none','\n cand:',b.join(' ; ')||'none');};
show('E1/E2 luna pre-gate text (rebuilt from the final text and its SUPERSEDED LINE marks)',pre);
const i30=P.findIndex(x=>x.startsWith('ANSWER CHECK: Matthew 1:20 -- [CR3] -- MEANS: “four verses'));const sub=(f)=>{const Q=P.slice();Q[i30]=f(Q[i30]);return Q.join('\n');};
show('E3 MEANS matches neither entry',sub(l=>l.replace(/MEANS: “[^”]*”/,'MEANS: “the angel speaks to a man about a child in a dream at night”')));
show('E5 LINK 1 MEANS graded MISSES',sub(l=>l.replace(/MEANS: “[^”]*”/,'MEANS: “the row carrying ‘of the Holy Ghost’ names Joseph son of David and Mary his wife, so the covenant source stands beside the husband”')));
show('E6 LINK 4 MEANS first 7 words',sub(l=>l.replace(/MEANS: “[^”]*”/,'MEANS: “four verses after 1:16 the angel greets”')));
show('E7 LINK 4 MEANS first 4 words',sub(l=>l.replace(/MEANS: “[^”]*”/,'MEANS: “four verses after 1:16”')));
show('E8 adversarial: MEANS: NONE',sub(l=>l.replace(/MEANS: “[^”]*”/,'MEANS: NONE')));
show('E9 adversarial: straight quotes and bold',sub(l=>'**'+l.replace(/[“”]/g,'"').replace(/[‘’]/g,"'")+'**'));
// E4 single-link verse: flip the Luke 1:32 check stays as is (already MISSES) -> shown in E1 list. Also both Matthew 1:20 checks MISSES:
const i21=P.findIndex(x=>x.startsWith('ANSWER CHECK: Matthew 1:20 -- [CR3] -- MEANS: “the row carrying'));
{const Q=P.slice();Q[i21]=Q[i21].replace('-- MEETS --','-- MISSES --');show('E10 both Matthew 1:20 checks MISSES',Q.join('\n'));}
{const Q=P.slice();Q[i30]=Q[i30].replace('-- MISSES --','-- MEETS --');Q[i21]=Q[i21].replace('-- MEETS --','-- MISSES --');show('E11 only the LINK 1 check MISSES (the check as luna wrote it, shorter MEANS)',Q.join('\n'));console.log(' line21:',Q[i21].slice(0,200));}
