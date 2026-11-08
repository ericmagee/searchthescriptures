// pkgEWB test: Judge/Alt Judge Enforcer Build, live s57 vs pkgEWB, every saved run. For each E-ANS item: THE ANSWER IN FULL block before and after.
// Bars: 33605 B117 (Acts 16:13) no longer gets the Genesis 4:1 block; every changed block either gains the answer's opening as whole words or is dropped;
// no block that held the opening as whole words changes; items outside E-ANS/E-HOLD full blocks are unchanged.
const fs=require('fs');const {harness}=require('../pkgGSL/harness.cjs');const D='/mnt/project-files/wall2024/inputs/';
const W=JSON.parse(fs.readFileSync('/mnt/project-files/wall2024/fetchback_live_s57.json','utf8'));
let ok=0,bad=0;const out=[];const T=(c,m)=>{c?ok++:bad++;out.push((c?'OK ':'FAIL ')+m);};
const pr=o=>o.map(x=>x.json&&x.json.body&&x.json.body.messages?x.json.body.messages[x.json.body.messages.length-1].content:'');
const items=o=>{const M={};pr(o).forEach(c=>c.split(/\n(?=ITEM [A-Z]\d+ \()/).slice(1).forEach(x=>{const id=x.match(/^ITEM ([A-Z]\d+)/)[1];M[id]=x.replace(/\n\n[\s\S]*$/,'').replace(/\nYou are the enforcer[\s\S]*$/,'').trimEnd();}));return M;};
const P=s=>' '+String(s||'').toLowerCase().replace(/[“”"’‘'*_`\[\]]/g,'').replace(/[^a-z0-9: ]+/g,' ').replace(/\s+/g,' ').trim()+' ';
const full=x=>(x.match(/THE ANSWER IN FULL, FROM \[[^\]]*\][^"]*"([\s\S]*?)"(?:\nTHE JUDGES'|\n- |$)/)||[])[1]||null;
const ans=x=>(x.match(/\nTHE ANSWER: "([\s\S]*?)"(?:\nTHE ANSWER IN FULL|\nTHE JUDGES')/)||[])[1]||'';
let n=0,changed=0,gained=0,dropped=0,badc=0,other=0,before=0,after=0,tot=0;const list=[];
for(const [node,inp] of [['Judge Enforcer Build','Panel Cure Check'],['Alt Judge Enforcer Build','Alt Gate Record']]){const B0=W.nodes.find(z=>z.name===node).parameters.jsCode,P1=fs.readFileSync('pkgEWB/patched/'+node.replace(/ /g,'_')+'.js','utf8');
 for(const R of fs.readdirSync(D).filter(f=>f.endsWith('_'+node.replace(/ /g,'_')+'.json')).map(f=>f.split('_')[0]).sort()){let a,b;try{a=harness(R)(B0,inp);b=harness(R)(P1,inp);}catch(e){continue;}n++;
  const A=items(a),B=items(b);for(const id of Object.keys(A)){const x=A[id],y=B[id]||'';if(id[0]==='B'&&ans(x)){const fa=full(x),aw=P(ans(x)).trim().split(' ').slice(0,6).join(' ');if(fa){tot++;if(!P(fa).includes(' '+aw+' '))before++;}const fb=full(y);if(fb&&!P(fb).includes(' '+aw+' '))after++;}
   if(x===y)continue;if(!/^[BH]/.test(id)){other++;continue;}changed++;const fa=full(x),fb=full(y),aw=P(ans(x)).trim().split(' ').slice(0,6).join(' ');
   if(fa&&P(fa).includes(' '+aw+' '))badc++;if(fb&&P(fb).includes(' '+aw+' '))gained++;else if(!fb)dropped++;else badc++;
   list.push('   '+R+' '+node.split(' ')[0]+' '+id+': '+(x.match(/PRESSED VERSE: ([^\n]*)/)||[,'?'])[1]+' | was: '+String(fa||'(none)').slice(0,70).replace(/\n/g,' ')+' | now: '+String(fb||'(none)').slice(0,70).replace(/\n/g,' '));}}}
T(n>=10,'replay ran on '+n+' node runs');T(other===0,'no item outside E-ANS/E-HOLD changes ('+other+')');
T(badc===0,changed+' items changed: '+gained+' now hold the answer opening as whole words, '+dropped+' dropped a wrong block; 0 bad ('+badc+')');
out.push('   E-ANS full blocks without the answer opening as whole words: '+before+' -> '+after+' (of '+tot+')');out.push(...list);
{const b=harness('33605')(fs.readFileSync('pkgEWB/patched/Judge_Enforcer_Build.js','utf8'),'Panel Cure Check');const B=items(b);const x=pr(b).join('\n').split(/\n(?=ITEM )/).find(v=>/B117\.1 \(grok\)/.test(v))||'';
 T(x&&!/Adam's way of begetting/.test(x)&&!/THE ANSWER IN FULL/.test(x),'33605 B117 Acts 16:13: the Genesis 4:1 block is gone; no full block is sent, since the Acts 16:13 bullet adds under 60 characters to the quoted answer (the pkgEAW gate), so DeepSeek reads the whole answer as quoted');}
out.push('TOTAL '+ok+' OK, '+bad+' FAIL');console.log(out.join('\n'));fs.writeFileSync('pkgEWB/test_EWB.txt',out.join('\n')+'\n');
