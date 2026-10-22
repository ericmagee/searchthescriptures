// F3b and F5 harness (Worker_A3): cureVerdicts, cureSet, cureSetApply and cureRounds cut from each node's own source (up to
// "function cureCorrected", then cureSet and cureSetApply); rounds from Text 1 of report27665.md; items as drvLedger raised them.
const fs=require('fs');const [dir,rep]=process.argv.slice(2);const md=fs.readFileSync(rep,'utf8');
const sent=md.slice(md.indexOf('## What the judges were sent'));
const text1=[...sent.matchAll(/### Text (\d+), md5 \w+\n\nSent to: ([^\n]*)[\s\S]*?\*\*user message\*\* \(\d+ characters\)\n\n```text\n([\s\S]*?)\n```/g)].map(m=>m[3])[0];
const load=f=>{const s=fs.readFileSync(f,'utf8');const i=s.indexOf('\nfunction cureCorrected');const a=s.indexOf('function cureSet(');const b=s.indexOf('const cureCorrLine=');
 return new Function(s.slice(0,i)+'\n'+s.slice(a,b)+'\n;return {cureVerdicts,cureRounds,cureSet,cureSetApply};')();};
const K=(side,n,conc,st)=>({rule:'K-G6',side,link:side+' premise '+n,line:'premise '+n+': ... NOT NAMED: x',conc,st,L:6});
const gem=[K('DEFENDER',1,0,'SELF-SUPPORTED'),K('DEFENDER',3,0,'SELF-SUPPORTED'),K('CHALLENGER',1,1,'PROP-DEPENDENT'),K('CHALLENGER',6,1,'PROP-DEPENDENT')];
// a real quotation from the transcript: cut from Text 1, never typed
const q=(()=>{const m=text1.match(/LINK 1[^\n]{0,40}?SUPPORTED[^\n]*/);return m?m[0].replace(/[*_`"“”]/g,'').slice(0,60).trim():null;})();
const CASES={
 a_count_all:['CORRECTED COUNT: DEFENDER 2','CORRECTED STANDING: DEFENDER PROP-DEPENDENT','CORRECTED COUNT: CHALLENGER 3','CORRECTED STANDING: CHALLENGER PROP-DEPENDENT'],
 b_nothing:[],
 c_count_low:['CORRECTED COUNT: DEFENDER 1','CORRECTED STANDING: DEFENDER PROP-DEPENDENT','CORRECTED COUNT: CHALLENGER 3','CORRECTED STANDING: CHALLENGER PROP-DEPENDENT'],
 d_stmt_plus_count:['STATEMENT: K-G6 DEFENDER premise 1 | the round says "'+q+'"','CORRECTED COUNT: DEFENDER 1','CORRECTED STANDING: DEFENDER PROP-DEPENDENT','CORRECTED COUNT: CHALLENGER 3','CORRECTED STANDING: CHALLENGER PROP-DEPENDENT'],
 e_stmt_quote_absent:['STATEMENT: K-G6 DEFENDER premise 1 | the round says "these words are not in any round of this debate"','CORRECTED COUNT: DEFENDER 1','CORRECTED STANDING: DEFENDER PROP-DEPENDENT'],
 f_wrong_standing:['CORRECTED COUNT: DEFENDER 2','CORRECTED STANDING: DEFENDER COLLAPSED','CORRECTED COUNT: CHALLENGER 3','CORRECTED STANDING: CHALLENGER COLLAPSED'],
 g_count_no_standing:['CORRECTED COUNT: DEFENDER 2','CORRECTED COUNT: CHALLENGER 3']};
const files=fs.readdirSync(dir).filter(f=>/Cure|Alternate_Build|Alternate_Merge/.test(f)&&f.endsWith('.js')).sort();
console.log('quotation cut from Text 1:',JSON.stringify(q),'| nodes',files.length);
const tally={};
for(const f of files){const F=load(dir+'/'+f);const R=F.cureRounds({messages:[{role:'user',content:text1}]});
 for(const [k,lines] of Object.entries(CASES)){const v=F.cureVerdicts(gem,{ok:true,text:lines.join('\n')},{DEFENDER:[],CHALLENGER:[]},R);
  const key=k+' => '+v.map(x=>x.link.replace(' premise ','')+':'+x.status).join(' ');tally[key]=(tally[key]||0)+1;
  if(f==='Panel_Cure_Check.js')console.log('  ',k.padEnd(20),v.map(x=>x.link+' '+x.status+(x.status==='UNCURED'?' ('+x.why+')':'')).join(' | '));}}
for(const [k,n] of Object.entries(tally))console.log(n+'/'+files.length,k);
// F5: Gemini's stored cure reply (K-G3 CORRECTED STANDING) applied to its payload; GLM with no reply untouched
const F=load(dir+'/Panel_Cure_Check.js');
const gk3=[{rule:'K-G3',side:'DEFENDER',link:null,line:null,status:'CURED'}];
const pg={defense_standing:'SELF-SUPPORTED',conceded_links:0,challenge_standing:'PROP-DEPENDENT',challenger_conceded_links:1};
const cs=F.cureSet({ok:true,text:'CORRECTED STANDING: DEFENDER PROP-DEPENDENT'},gk3);const lines=cs?F.cureSetApply(pg,cs,'gemini'):[];
console.log('F5 gemini after:',JSON.stringify(pg),'|',lines.join(' '));
const pl={defense_standing:'SELF-SUPPORTED',conceded_links:0,challenge_standing:'PROP-DEPENDENT',challenger_conceded_links:3};
const cs2=F.cureSet(null,[]);console.log('F5 glm (no reply):',cs2===null?'untouched':'CHANGED',JSON.stringify(pl));
