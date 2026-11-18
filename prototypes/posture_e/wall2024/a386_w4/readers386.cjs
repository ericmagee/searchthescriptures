// ASK 386 item 2c (W1 8472): each JUDGE-LINE reader on one plant text, old (the judge text as stored today) against new (after ert386).
// The readers' own line tests are taken from the target library: __RL.readLine (lines 282, 283, via ri5Rd2024), pickL (3126, the E-RES checks 3128 to 3152),
// rudPair2024's RESULT test (1754), lyr2024's RES (1922), the ASK 394 layer reader's RES (3501), ri5IsRes2024 (1412), rcLines (1295).
const fs=require('fs');const TGT=__dirname+'/t386.json';const E=require('./ert_eval.cjs')(TGT);
const F=require('./stubload.cjs')(TGT,'Alternate Merge Seat',['ri5Rd2024','ri5IsRes2024','rcLines','cureJText']);
const T=require('../tools/lib.cjs');let d=JSON.parse(fs.readFileSync(TGT));if(d.data&&d.data.nodes)d=d.data;const L=T.unpack(d).L;
const grab=(i,re)=>{const m=L[i].match(re);if(!m)throw new Error('reader not found at '+i);return m[1];};
const pickSrc=grab(3126,/pickL=(\(ls,k\)=>[^;]+);/);const pickL=eval(pickSrc);
const linesOf=eval(grab(3063,/const linesOf=(t=>[^;]+);/));
const RUD=/^RESULT\s*:\s*((?:DEFENDER|CHALLENGER)\s+WINS)\b(.*)$/i;if(!L[1754].includes(String(RUD).slice(1,-2)))throw new Error('1754 test moved');
const LYR=/^[\s>-]*RESULT\s*:\s*(?!CURED\b|UNCURED\b)/i;if(!L[1922].includes('const RES=/^[\\s>-]*RESULT\\s*:\\s*(?!CURED\\b|UNCURED\\b)/i'))throw new Error('1922 test moved');
const L94=/^[\s>*_-]*\**\s*RESULT\s*:/i;if(!L[3501].includes('const RES=/^[\\s>*_-]*\\**\\s*RESULT\\s*:/i'))throw new Error('3501 test moved');
const Fd={verdict_tag:'BROKEN',defense_standing:'PROP-DEPENDENT',challenge_standing:'SELF-SUPPORTED',conceded_links:1,challenger_conceded_links:0};
const reasoning=['BROKEN -- text','D1 vs C1 (John 1:1): DEFENDER LINK BROKEN -- ground',
 '[AUDIT v61: ENGINE RESULT -- SEAT: s1; WORD: DEFENDER WINS; RESULT: DEFENDER WINS; END]',
 'RESULT: DEFENDER WINS -- my word'].join('\n');
const old=JSON.stringify({...Fd,reasoning})+'\n[AUDIT v61: ENGINE RESULT -- SEAT: s1; WORD: DEFENDER WINS; END]';
const neu=E.ert386(old,'s1',Fd);
const run=(raw,full)=>{const t=F.cureJText(raw,true)+(full?raw.slice(raw.indexOf('\n')):'');const ls=linesOf(t);const all=String(t).split('\n');const sel=f=>ls.filter(f);
 return {'282 __RL RESULT form':sel(l=>{const r=F.ri5Rd2024(l);return r&&r.form==='RESULT';}),
  '283 __RL CORRECTED RESULT form':sel(l=>{const r=F.ri5Rd2024(l);return r&&r.form==='CORRECTED RESULT';}),
  '3126/3128 pickL RESULT (E-RES 3142, 3151, 3152 read this line)':[pickL(ls,'RESULT')].filter(Boolean),
  '1754 rudPair2024 RESULT test':all.filter(l=>RUD.test(l)),
  '1922 lyr2024 RES':all.filter(l=>LYR.test(l)),
  '3501 layer reader RES':all.filter(l=>L94.test(l)),
  '1412 ri5IsRes2024':sel(l=>F.ri5IsRes2024(l,/^RESULT\s*:/i)),
  '1295 rcLines result':[(F.rcLines(t).result||{}).raw].filter(Boolean),
  'lines holding an AUDIT v61 tag (for reference)':all.filter(l=>/AUDIT v61: ENGINE RESULT/.test(l))};};
const rows=[];let bad=0;
for(const full of [false,true]){const O=run(old,full),N=run(neu,full);
for(const k of Object.keys(O)){const same=JSON.stringify(O[k])===JSON.stringify(N[k]);const tagHit=k.startsWith('lines holding')?false:N[k].some(l=>/AUDIT v6\d|AUDIT v27/.test(l));if(!k.startsWith('lines holding')&&(!same||tagHit))bad++;rows.push({input:full?'judge text plus every tag after it':'judge text (cureJText)',reader:k,old:O[k],new:N[k],same,selects_a_tag:tagHit});}}
fs.writeFileSync(__dirname+'/readers386_out.json',JSON.stringify({old_text:old,new_text:neu,rows},null,1));
for(const r of rows)console.log((r.input.startsWith('judge text plus')?'[full] ':'[text] ')+(r.same?'SAME ':'DIFF ')+(r.selects_a_tag?'TAG! ':'')+r.reader+' | old '+JSON.stringify(r.old)+' | new '+JSON.stringify(r.new));
console.log('readers that changed or picked a tag line:',bad);
