// pkgUNXW2 tests. Run from wall2024/ after `node pkgRCK/build_RCK.cjs` and `node pkgUNXW2/build_UNXW2.cjs`: node pkgUNXW2/test_UNXW2.cjs
const fs=require('fs');let ok=0,bad=0;const out=[];const T=(n,c,x)=>{out.push((c?'OK   ':'FAIL ')+n+(x?' :: '+x:''));c?ok++:bad++;};
const lib=f=>{const s=fs.readFileSync(f,'utf8');const a=s.indexOf('function unxLack(');const b=s.indexOf('\nfunction unxNamed(',a);return new Function(s.slice(a,b)+';return unxLack;')();};
const N=lib('pkgUNXW2/patched/Cure_Check.js'),O=lib('pkgRCK/out/Cure_Check.js');const k=['L1','L3'];const m=(f,s)=>f(s,k).missing.join(',');
const C=[['nothing for [L2] is given','2','',"W3 2747: missed before"],['the block has L2 absent','2','',"W3 2747: missed before"],['[L2] missing; [L1] is quoted','2','','the same no-"is" form'],
 ['exhibits [L1] and [L3], not [L2]','2','2','W3 control'],['The block exhibits [L1] and [L2] patēr and [L3].','','','W3 control (33249 grok P5)'],['the count says "no [L2]" only','','','W3 control (quoted)'],
 ['its [L4] does not follow','4','4',''],['[L2] is the gloss; it exhibits [L1]','','',''],['[L1] Luke 2:49 and [L3] Psalm 2:7 exhibit it','','','']];
for(const [s,nw,od,why] of C)T('U '+JSON.stringify(s)+' -> ['+nw+'] (was ['+od+'])'+(why?' '+why:''),m(N,s)===nw&&m(O,s)===od,m(N,s)+' / '+m(O,s));
const plan=JSON.parse(fs.readFileSync('pkgUNXW2/plan_UNXW2.json','utf8'));
const fnOf=s=>{const a=s.indexOf('function unxLack(');let d=0,i=s.indexOf('{',a);for(;i<s.length;i++){if(s[i]==='{')d++;else if(s[i]==='}'&&--d===0)break;}return [a,i+1];};
T('A1 21 nodes (19 from pkgRCK/out, 2 from pkgEPK/patched); each patched file differs from its base only inside unxLack',plan.nodes.length===21&&plan.nodes.every(n=>{const a=fs.readFileSync(n.base,'utf8'),b=fs.readFileSync('pkgUNXW2/patched/'+n.file,'utf8');const cut=s=>{const [x,y]=fnOf(s);return s.slice(0,x)+s.slice(y);};return a!==b&&cut(a)===cut(b);}));
{const fl=plan.nodes.map(n=>n.file);const v=new Set(fl.map(f=>{const s=fs.readFileSync('pkgUNXW2/patched/'+f,'utf8');const [x,y]=fnOf(s);return s.slice(x,y);}));T('V2 one unxLack text in all 21 patched nodes, EPK Send Back Build and Alt Send Back Build included',v.size===1,v.size+' texts');}
const {harness}=require('../pkgGSL/harness.cjs');
for(const RUN of ['33218','33222','33249'])for(const [n,inp] of [['Panel_Cure_Check','Panel Cure Needed?'],['Alternate_Merge_Seat','Alternate Calls?']]){const H1=harness(RUN),H2=harness(RUN);
 T('C '+RUN+' '+n+': output identical to pkgRCK/out',JSON.stringify(H1(fs.readFileSync('pkgRCK/out/'+n+'.js','utf8'),inp))===JSON.stringify(H2(fs.readFileSync('pkgUNXW2/patched/'+n+'.js','utf8'),inp)));}
const txt=out.join('\n')+'\n'+ok+' OK, '+bad+' FAIL\n';fs.writeFileSync('pkgUNXW2/test_UNXW2.txt',txt);console.log(txt);process.exit(bad?1:0);
