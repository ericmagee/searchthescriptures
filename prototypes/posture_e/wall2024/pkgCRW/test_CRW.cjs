// pkgCRW unit test: crwRep on encoded (JSON) and plain text.
const fs=require('fs');const src=fs.readFileSync('pkgCRW/patched/Gate_Record.js','utf8');const m=src.match(/function crwRep[^\n]*?\}return fb<0\?null:h\.slice\(0,fb\)\+n\+h\.slice\(fb\+o\.length\);\}/);
const crwRep=new Function(m[0]+';return crwRep;')();const enc=x=>JSON.stringify(String(x)).slice(1,-1);let ok=0,bad=0;const t=(name,got,want)=>{const p=got===want;p?ok++:bad++;console.log((p?'OK   ':'FAIL ')+name+(p?'':'\n  got  '+got+'\n  want '+want));};
const J=JSON.stringify({reasoning:'X\nCONCEDED LINKS: 0\nY\nCHALLENGER CONCEDED LINKS: 0\nZ'});
let j=crwRep(J,enc('CONCEDED LINKS: 0'),enc('CONCEDED LINKS: 1 -- P2'),true);t('33411: first replace hits the defender line',j,JSON.stringify({reasoning:'X\nCONCEDED LINKS: 1 -- P2\nY\nCHALLENGER CONCEDED LINKS: 0\nZ'}));
t('33411: the second (duplicate) replace finds no whole line, does not touch CHALLENGER',crwRep(j,enc('CONCEDED LINKS: 0'),enc('CONCEDED LINKS: 1 -- P2'),true),null);
t('a line at the start of reasoning',crwRep(JSON.stringify({reasoning:'CONCEDED LINKS: 0\nA'}),enc('CONCEDED LINKS: 0'),'N',true),JSON.stringify({reasoning:'N\nA'}));
t('a line at the end of reasoning',crwRep(JSON.stringify({reasoning:'A\nKEYSTONE: D6 -- STANDS'}),enc('KEYSTONE: D6 -- STANDS'),'N',true),JSON.stringify({reasoning:'A\nN'}));
t('line-start match with trailing words is still taken (old behaviour)',crwRep('A\nKEYSTONE: D6 -- STANDS because\nB','KEYSTONE: D6 -- STANDS','N',false),'A\nN because\nB');
t('whole line preferred over an earlier line-start partial',crwRep('KEYSTONE: D6 x\nKEYSTONE: D6\n','KEYSTONE: D6','N',false),'KEYSTONE: D6 x\nN\n');
t('plain: CHALLENGER line untouched',crwRep('CHALLENGER CONCEDED LINKS: 0','CONCEDED LINKS: 0','N',false),null);
console.log(ok+' OK, '+bad+' FAIL');
