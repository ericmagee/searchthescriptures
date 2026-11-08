// pkgEKD test: Judge Enforcer Build and Alt Judge Enforcer Build, live s58 vs pkgEKD, over every saved run.
// Bars: base equals live s58; prompts change only by the rule sentence and the added words block in E-KEY items on a D keystone;
// 33617 gemini and sol keystone items carry the defender's opening statement "no biological human father ... of the Holy Ghost".
const fs=require('fs');const crypto=require('crypto');const {harness}=require('../pkgGSL/harness.cjs');const D='/mnt/project-files/wall2024/inputs/';
const W=JSON.parse(fs.readFileSync('/mnt/project-files/wall2024/fetchback_live_s58.json','utf8'));const h=s=>crypto.createHash('sha256').update(s).digest('hex').slice(0,12);
let ok=0,bad=0;const out=[];const T=(c,m)=>{c?ok++:bad++;out.push((c?'OK ':'FAIL ')+m);};
const pr=o=>o.map(x=>x.json&&x.json.body&&x.json.body.messages?x.json.body.messages.map(m=>m.content).join('\n#MSG#\n'):'');
const ADD=/\nTHE DEFENDER'S OWN WORDS FOR THE KEYSTONE \(from the rounds\):(?:\n- [^\n]*)+/g;const RULE=/ A ground that restates the defender's own words for the keystone[^\n]*?\(pkgEKD\)\./g;
let n=0,stray=0,hit=0,miss=[],tot=0;const samp={};
for(const [node,inp] of [['Judge Enforcer Build','Panel Cure Check'],['Alt Judge Enforcer Build','Alt Gate Record']]){const B0=W.nodes.find(z=>z.name===node).parameters.jsCode,P1=fs.readFileSync('pkgEKD/patched/'+node.replace(/ /g,'_')+'.js','utf8');
 T(h(B0)===h(fs.readFileSync('pkgEWB/patched/'+node.replace(/ /g,'_')+'.js','utf8')),node+': live s58 equals the pkgEWB base ('+h(B0)+')');
 for(const R of fs.readdirSync(D).filter(f=>f.endsWith('_'+node.replace(/ /g,'_')+'.json')).map(f=>f.split('_')[0]).sort()){let a,b;try{a=harness(R)(B0,inp);b=harness(R)(P1,inp);}catch(e){out.push('   '+R+' '+node+' skipped: '+e.message.slice(0,70));continue;}n++;
  const its=o=>pr(o).flatMap(c=>{const u=c.split('\n#MSG#\n').pop();return u.split(/\n(?=ITEM [A-Z]\d+ \()/).slice(1).map(x=>x.replace(/\n\n[\s\S]*$/,'').replace(/\nYou are the enforcer[\s\S]*$/,'').replace(/ITEM [A-Z]\d+/g,'ITEM').trimEnd());}).sort();
  const ia=its(a),ib=its(b).map(x=>x.replace(ADD,''));if(JSON.stringify(ia)!==JSON.stringify(ib))stray++;
  const sa=pr(a).map(x=>x.split('\n#MSG#\n')[0]).join(''),sb=pr(b).map(x=>x.split('\n#MSG#\n')[0].replace(RULE,'')).join('');if(sa!==sb)stray++;
  for(const x of its(b))if(/^ITEM \(E-KEY/.test(x)&&/^ITEM \(E-KEY[^\n]*\nTHE LINE \([^)]*\): KEYSTONE\s*:\s*D/m.test(x)){tot++;const w=x.match(ADD);if(w){hit++;if(/OPENING STATEMENT/.test(w[0])&&!/PREMISE LINE/.test(w[0]))miss.push(R+' no premise line');}else miss.push(R+' no words');if(R==='33617')samp[x.match(/\(Z\d+\.1, ([^)]+)\)/)[1]]=x;}}}
T(n>=10,'replay ran on '+n+' node runs');T(stray===0,'every node run builds the same items and system text, apart from the words block and the rule sentence ('+stray+')');
T(hit===tot&&tot>0,'every D keystone item carries the words block: '+hit+' of '+tot);out.push('   items with no premise line found: '+miss.length+(miss.length?' ('+[...new Set(miss)].join(', ')+')':''));
const g=samp.gemini||'',s=samp.sol||'';T(/no biological human father/.test(g)&&/of the Holy Ghost/.test(g)&&/no biological human father/.test(s),'33617 gemini and sol keystone items carry the defender opening "no biological human father ... of the Holy Ghost"');
out.push('   sample (33617 sol):\n'+s.split('\n').map(l=>'     '+l.slice(0,400)).join('\n'));
out.push('TOTAL '+ok+' OK, '+bad+' FAIL');console.log(out.join('\n'));fs.writeFileSync('pkgEKD/test_EKD.txt',out.join('\n')+'\n');
