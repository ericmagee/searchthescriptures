// W1 pkgSRA plants on the helper (the served text) and on the built Shared Library line (helper equal to helper.js).
const fs=require('fs');eval(fs.readFileSync(__dirname+'/helper.js','utf8').replace('function sraSame','global.sraSame=function'));
const R=JSON.parse(fs.readFileSync('/tmp/claude-0/sra/R34852.json'));let ok=0,bad=0;const t=(nm,got,want)=>{const p=want(got);p?ok++:bad++;console.log((p?'PASS ':'FAIL ')+nm+(p?'':' :: '+JSON.stringify(got).slice(0,300)));};
const M20="four verses after 1:16 the angel greets the husband of 1:16 as David’s son and gives him the child’s naming",A20="It is Joseph’s address, and the same verse states the source of the child.";
t('P1 34852 B13: a same-round naming answer is served',sraSame(R.CR3,'Matthew 1:20',M20,A20,''),s=>/Naming is not the father's alone|Naming therefore does not mark/.test(s));
t('P2 answer uses every word of the meaning: nothing served',sraSame(R.CR3,'Matthew 1:20','the angel greets the husband','The angel greets the husband, granted.',''),s=>s==='');
t('P3 a line naming the pressed verse is not served (it is the answer block)',sraSame('x\n- **Matthew 1:20** the naming is given to Joseph as husband here and elsewhere.\n- other words of nothing much at all here today.','Matthew 1:20',M20,A20,''),s=>s==='');
t('P4 press lines are not served',sraSame('Luke 1:31 "thou shalt call his name" -- MEANS: naming marks the husband who greets.\nPRESSED WITH: naming of the husband here today','Matthew 1:20',M20,A20,''),s=>s==='');
t('P5 the round header is not served',sraSame('DEFENDER (standard reading) -- ROUND 3, LINK ROUND naming husband angel\n- Naming is not the husband\'s alone, as Luke 1:31 gives it to Mary.','Matthew 1:20',M20,A20,''),s=>!/ROUND 3/.test(s)&&/Luke 1:31/.test(s));
t('P6 a line already served as other lines is not served again',sraSame('- Naming is not the husband\'s alone, as Luke 1:31 gives it to Mary.','Matthew 1:20',M20,A20,'[CR3, LINK 3] - Naming is not the husband\'s alone, as Luke 1:31 gives it to Mary.'),s=>s==='');
const many=Array.from({length:6},(_,i)=>'- line '+i+' speaks of David and the angel and the husband in common words.').join('\n');
t('P7 only common words of the meaning (df > 3): nothing served',sraSame(many,'Matthew 1:20',M20,A20,''),s=>s==='');
t('P8 at most two lines, each cut at 400',sraSame('- Naming is given to Joseph: '+'a'.repeat(500)+' naming.\n- Naming two is here for the husband in this line now.\n- Naming three is here for the husband in this line too.','Matthew 1:20',M20,A20,''),s=>s.split('\n').length===2&&s.split('\n').every(l=>l.length<=405));
t('P9 a bad verse string does not throw',(()=>{try{return sraSame('- Naming is here for the husband in this line.','Matthew (1:20',M20,A20,'');}catch(e){return 'THREW';}})(),s=>s!=='THREW');
// built library line holds the helper verbatim
const raw=JSON.parse(fs.readFileSync(process.argv[2]||'/tmp/claude-0/sra173.json'));const W=(raw.data||raw).workflow||(raw.data||raw);const T=W.nodes.find(n=>n.name==='Shared Library').parameters.jsCode;const a=T.indexOf('\n/*LIB*/'),b=T.lastIndexOf('\n/*MAP*/');const Lb=JSON.parse(T.slice(a+8,b));
t('P10 library line 3036 starts with helper.js',Lb[3036].startsWith(fs.readFileSync(__dirname+'/helper.js','utf8').trim()),x=>x===true);
console.log(ok+' of '+(ok+bad)+' pass');
