// Worker_E WITHDRAWN cure portion harness (BB-7321), falsifiers (a)-(c), (f), (g), (h) of FALSIFIERS2.txt (git bf0ee5f).
// Runs cureLines, cureVerdicts and cureAsk from each node's own source: the file up to its first line that reads an n8n node ($('...')).
const fs=require('fs'),path=require('path');
const load=f=>{const s=fs.readFileSync(f,'utf8');const lines=s.split('\n');const i=lines.findIndex(l=>/\$\(['"]/.test(l)&&!/^\s*\/\//.test(l));
 const src=lines.slice(0,i<0?lines.length:i).join('\n');return new Function(src+'\n;return {cureVerdicts,cureAsk,cureLines};')();};
const RULE='WITHDRAWN: D<n> vs C<m> withdraws your BROKEN grade on that line; a withdrawn line is not a BROKEN line, so that one line cures every item flagged on it (layer, count, pressing, standing). A STATEMENT line never withdraws anything.';
const L='D1 vs C7 (Galatians 4:4): DEFENDER LINK BROKEN -- (L1) "made of a woman" left unanswered in (CR3).';
const items=[{rule:'K-B',side:'DEFENDER',link:'D1 vs C7',line:L},{rule:'K-G1',side:'DEFENDER',link:'D1 vs C7',line:L},{rule:'K-G4',side:'DEFENDER',link:'D1 vs C7',line:L}];
const broken={DEFENDER:['D1 vs C7'],CHALLENGER:[]};const rounds={DR1:'x',DR2:'x',CR3:'nothing here'};
const rep=t=>({ok:true,text:t});
// (h) gemini 27563, rebuilt from the report's cure column (rows 72, 74, 76) and its statement column (rows 71-76): RECONSTRUCTED, not the stored reply.
const gemItems=['D1 vs C7','D2 vs C6','D4 vs C7'].flatMap(k=>[{rule:'K-B',side:'DEFENDER',link:k,line:k+' (Romans 8:32): DEFENDER LINK BROKEN -- (L1) "x"'},{rule:'K-G1',side:'DEFENDER',link:k,line:k+' (Romans 8:32): DEFENDER LINK BROKEN -- (L1) "x"'}]);
const gemReply=['D1 vs C7','D2 vs C6','D4 vs C7'].map(k=>'WITHDRAWN: '+k+'\nSTATEMENT: '+k+' | Withdrawn to resolve K-G1 conflict, as CONCEDED LINKS is 0.').join('\n');
let fail=0;const out=[];
for(const dir of process.argv.slice(2)){const tally={a:0,b:0,c:0,g:0,h:0,n:0};
 for(const f of fs.readdirSync(dir).filter(x=>x.endsWith('.js')).sort()){tally.n++;const F=load(path.join(dir,f));
  const st=(r)=>F.cureVerdicts(items,rep(r),broken,rounds).map(v=>v.status);
  const a=st('WITHDRAWN: D1 vs C7').every(s=>s==='CURED');
  const b=st('STATEMENT: D1 vs C7 | Withdrawn, this line no longer stands as graded.').every(s=>s==='UNCURED');
  const c=st('WITHDRAWN: D2 vs C6').every(s=>s==='UNCURED');
  const ask=F.cureAsk(items,broken);const g=ask.split(RULE).length===2&&ask.indexOf('STATEMENT: <the flagged item')<ask.indexOf(RULE)&&ask.indexOf(RULE)<ask.indexOf('Write one STATEMENT line');
  const gv=F.cureVerdicts(gemItems,rep(gemReply),{DEFENDER:['D1 vs C7','D2 vs C6','D4 vs C7'],CHALLENGER:[]},rounds);
  const h=gv.filter(v=>v.rule==='K-B').every(v=>v.status==='CURED'&&v.why==='withdrawn');
  if(a)tally.a++;if(b)tally.b++;if(c)tally.c++;if(g)tally.g++;if(h)tally.h++;
  if(dir.endsWith('new')){for(const [k,v] of Object.entries({a,b,c,g,h}))if(!v){fail++;console.log('  FAIL',f,k);}}}
 console.log(dir.split('/').pop(),'nodes',tally.n,'| (a) WITHDRAWN cures K-B,K-G1,K-G4',tally.a,'| (b) STATEMENT Withdrawn cures nothing',tally.b,'| (c) other link cures nothing',tally.c,'| (g) rule served once in place',tally.g,'| (h) 27563 gemini K-B cured',tally.h);}
console.log('fail',fail);
