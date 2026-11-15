// ASK 330 tests: kunxLines old vs new on 26 stored debates (every judge text); planted forms; cure path plants.
const fs=require('fs');const T=require('../tools/lib.cjs');
const OLD=T.unpack(JSON.parse(fs.readFileSync('live.json'))),NEW=T.unpack(JSON.parse(fs.readFileSync('target_330.json')));
const D=JSON.parse(fs.readFileSync('data30.json'));let VR=[];
const ptOf=r=>[['CR1','claude_r1'],['DR1','engine_r1'],['CR2','claude_r2'],['DR2','engine_r2'],['CR3','engine_r3'],['DR3','challenger_r3'],['CR4','defender_r4'],['DR4','challenger_r4']].filter(([k,c])=>r[c]).map(([k,c])=>'=== ['+k+'] ===\n'+r[c]).join('\n\n');
let PT='';const $=n=>{if(n==='Cited Verses')return {isExecuted:true,all:()=>VR.map(j=>({json:j})),first:()=>({json:VR[0]||{}})};if(n==='Panel Build')return {isExecuted:true,all:()=>[],first:()=>({json:{judges:[{seat:'x',body:{messages:[{role:'user',content:PT}]}}]}})};return {isExecuted:false,all:()=>[],first:()=>({json:{}})};};
const ld=(U,k)=>T.load(T.rb(U.L,U.M[k]),$);
const GO=ld(OLD,'Gate Record'),GN=ld(NEW,'Gate Record');const CO=ld(OLD,'Cure Check'),CN=ld(NEW,'Cure Check');
const txt=raw=>{let t=String(raw||'');const s=t.trim();if(s[0]==='{'){const i=s.lastIndexOf('}');try{const J=JSON.parse(s.slice(0,i+1));if(J&&typeof J.reasoning==='string')t=J.reasoning;}catch(e){}}return t.replace(/\n\n\[AUDIT v[\s\S]*$/,'');};
let n=0,same=0,diff=[],KX=0;
for(const r of D){PT=ptOf(r);for(const j of (r.js||[])){n++;const t=txt(j.raw);let a,b;try{a=JSON.stringify(GO.kunxLines(t,PT));}catch(e){a='ERR '+e.message;}try{b=JSON.stringify(GN.kunxLines(t,PT));}catch(e){b='ERR '+e.message;}if(a===b){same++;try{KX+=JSON.parse(a).items.length;}catch(e){}}else diff.push(r.run_token.slice(0,10)+' '+j.seat);}}
console.log('REPLAY kunxLines: judge texts',n,'K-UNX items seen',KX,'identical',same,'differ',diff.length,diff.join('; '));
// plants on 37372 rounds
const r72=D.find(r=>r.run_token.startsWith('ODV1-37372'));PT=ptOf(r72);
VR=JSON.parse(fs.readFileSync('verses_plant.json'));
const STEP='Assembled: the Christ was conceived in the virgin Mary by the Holy Ghost, before her union with Joseph';
const base=c=>'CONCEDED LINKS: 1 -- Premise 6: UNEXHIBITED '+c+'\nCHALLENGE STANDING: PROP-DEPENDENT -- L=4 c=0 -- x\n';
let pass=0,tot=0;const ok=(nm,c,extra)=>{tot++;if(c)pass++;console.log((c?'PASS ':'FAIL ')+nm+(extra?' | '+extra:''));};
const F=GN.__af330;
const good='-- STEP: "'+STEP+'" -- ASSUMES: Mary is of the house of David -- ROWS GIVE: Luke 1:27 "a virgin espoused to a man whose name was Joseph, of the house of David"';
ok('form: valid',F(good,'DEFENDER',null).ok,F(good,'DEFENDER',null).why);
ok('form: lower-case labels with bold marks',F(good.replace('STEP','**step**').replace('ASSUMES','**assumes**').replace('ROWS GIVE','rows give'),'DEFENDER',null).ok);
ok('form: STEP not in the side rounds',!F(good.replace('Assembled','Gathered'),'DEFENDER',null).ok,F(good.replace('Assembled','Gathered'),'DEFENDER',null).why);
ok('form: STEP from the other side only',!F(good,'CHALLENGER',null).ok,F(good,'CHALLENGER',null).why);
ok('form: ROWS GIVE quote not in the verse',!F(good.replace('whose name was Joseph','whose name was Jacob'),'DEFENDER',null).ok);
ok('form: ROWS GIVE verse not read',!F(good.replace('Luke 1:27','Luke 1:28'),'DEFENDER',null).ok);
ok('form: ASSUMES names an act',!F(good.replace('Mary is of the house of David','Joseph begat the child'),'DEFENDER',null).ok);
ok('form: ASSUMES names contested links',!F(good.replace('Mary is of the house of David','the contested conclusions of Links 1-5'),'DEFENDER',null).ok);
ok('form: no STEP (37281 luna shape)',!F('(ASSUMES: "Mary carries the seed of David according to the flesh"; ROWS GIVE: Joseph is "of the house of David")','DEFENDER',null).ok);
ok('form: quote then reference',F(good.replace('Luke 1:27 "a virgin espoused to a man whose name was Joseph, of the house of David"','"a virgin espoused to a man whose name was Joseph, of the house of David" (Luke 1:27)'),'DEFENDER',null).ok);
// raise path through kunxLines on a planted count section (premise 1 of the 37372 defender list)
const sec=c=>'CONCEDED LINKS: 1 -- Premise 1: UNEXHIBITED '+c;
const KO=GO.kunxLines(sec(good),PT),KN=GN.kunxLines(sec(good),PT);ok('raise: valid form raises no K-UNX item',KO.items.length===1&&KN.items.length===0&&KN.marks.some(m=>m.startsWith('[AUDIT v55:')));
for(const [nm,bad] of [['STEP not verbatim',good.replace('Assembled','Gathered')],['ROWS GIVE not in verse',good.replace('Joseph, of','Jacob, of')],['ASSUMES act',good.replace('Mary is of the house of David','Joseph begat the child')],['ASSUMES contested',good.replace('Mary is of the house of David','the contested conclusions of Links 1-5')]]){const a=JSON.stringify(GO.kunxLines(sec(bad),PT)),b=JSON.stringify(GN.kunxLines(sec(bad),PT));ok('raise: '+nm+' handled as today (byte-identical)',a===b);}
console.log('  raise plant old items',KO.items.map(x=>x.rule+' '+x.link+' '+x.a).join(', ')||'none','| new items',KN.items.map(x=>x.rule+' '+x.link+' '+x.a).join(', ')||'none','| new marks',KN.marks.map(m=>m.slice(0,80)).join(' / '));
// cure path: the item the live code raises on a count without the form; the judge answers with a STATEMENT in the form
{const it=GO.kunxLines(sec('-- ASSUMES: Mary is of the house of David -- ROWS GIVE: Luke 1:27 "of the house of David"'),PT).items;const RD=GO.ciRounds(PT);
 const rep=s=>({ok:true,text:'RESPONSE: K-UNX DEFENDER premise 1 | The count stands; the step takes a given fact no row states.\nSTATEMENT: K-UNX DEFENDER premise 1 | '+s});const goodS=good.replace(/^-- /,'');
 const st=(C,s)=>{const v=C.cureVerdicts(JSON.parse(JSON.stringify(it)),rep(s),{},RD);return v.map(x=>x.status+' '+String(x.why).slice(0,110)).join(' / ');};
 console.log('  cure item raised:',it.map(x=>x.rule+' '+x.link+' a='+x.a).join(', '));
 const a=st(CO,goodS),b=st(CN,goodS);ok('cure: STATEMENT in full form CURED (live: '+a.slice(0,40)+')',/^CURED .*ASK 330/.test(b),b);
 const bad=goodS.replace('Assembled','Gathered');ok('cure: STEP not verbatim falls to today\'s reading (identical)',st(CO,bad)===st(CN,bad),st(CN,bad));
 const none='The premise stands as counted.';ok('cure: no form, identical to live',st(CO,none)===st(CN,none));}
console.log('TOTAL',pass,'of',tot);
