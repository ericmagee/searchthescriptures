// W2 pkgEAF: Judge Enforcer Build on stored runs, live s125 vs each variant: E-ANS items, items given THE ANSWER IN FULL, prompt characters sent to the check.
const fs=require('fs');const run=require(process.cwd()+'/pkgKSR/run_node.cjs');const {rebuild}=require(process.cwd()+'/pkgLIB/unpack.cjs');
const g_=f=>{let d=JSON.parse(fs.readFileSync(f));d=d.data||d;return d.workflow||d;};
const src=f=>{const W=g_(f);const lt=W.nodes.find(x=>x.name==='Shared Library').parameters.jsCode;return rebuild(W.nodes.find(x=>x.name==='Judge Enforcer Build').parameters.jsCode,lt);};
const V=[['live s125','/mnt/project-files/wall2024/fetchback_live_s125.json'],...process.argv.slice(2).map(v=>[v,'pkgEAF/parent_s125_EAF_'+v+'.json'])];
const RUNS=['34852','34726','34703','34780'];
(async()=>{for(const r of RUNS){const X=JSON.parse(fs.readFileSync('/mnt/project-files/wall2024/ex'+r+'_full.json'));const rd=(X.data||X).resultData.runData;let base=null;
 for(const [vn,f] of V){const o=await run(src(f),'Judge Enforcer Build',rd);if(o.err){console.log(r,vn,'ERR',o.err);continue;}
  let n=0,full=0,ch=0,fullch=0;const per={};const items={};
  for(const it of o){const u=((it.body||it).messages||[]).map(m=>m.content).join('\n');ch+=u.length;
   for(const m of u.matchAll(/ITEM (B\d+) \(E-ANS[^\n]*\n([\s\S]*?)(?=\n\nITEM |$)/g)){if(items[m[1]])continue;items[m[1]]=m[2];n++;const fm=m[2].match(/\nTHE ANSWER IN FULL[\s\S]*?(?=\nTHE JUDGES' GRADES:)/);if(fm){full++;fullch+=fm[0].length;}
    const vs=(m[2].match(/PRESSED VERSE: ([^\n]*)/)||[])[1];const rk=(u.match(new RegExp('ITEM '+m[1]+' \\(E-ANS; the answering side wrote this in \\[([^\\]]+)\\]'))||[])[1];const k=vs+' ['+rk+']';per[k]=per[k]||[];per[k].push(m[1]+(fm?'+':'-'));}}
  const multi=Object.entries(per).filter(([k,v])=>v.length>1);const mixed=multi.filter(([k,v])=>v.some(x=>x.endsWith('+'))&&v.some(x=>x.endsWith('-')));
  console.log(r,'|',vn.padEnd(9),'| E-ANS items',n,'| with full',full,'| full-block chars',fullch,'| prompt chars (all calls)',ch,base===null?'':'('+(ch-base>=0?'+':'')+(ch-base)+')','| verse+round groups with 2+ items',multi.length,'| of them mixed (some full, some not)',mixed.length);
  if(base===null)base=ch;if(process.env.SHOW)for(const [k,v] of mixed)console.log('   mixed:',k,v.join(' '));}}})();
