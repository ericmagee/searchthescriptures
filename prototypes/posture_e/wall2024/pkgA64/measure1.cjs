// W2 ASK 64 option 1 measure: Judge Enforcer Build on stored runs, live s127 vs O1: items given THE SIDE'S OTHER LINES, check-visible growth, calls;
// and the stored E-ANS DISAGREE (right: MISSES) rows whose item would now carry the side's other lines (the MISSES option 1 puts new text against).
const fs=require('fs');const run=require(process.cwd()+'/pkgKSR/run_node.cjs');
const rebuild=(stub,lib)=>{let i=stub.indexOf('\nreturn await new Function(');if(i<0)i=stub.indexOf('\nconst __e4h');const $=n=>({params:{jsCode:lib}});return new Function('$',stub.slice(0,i)+'\nreturn __S;')($);};
const g=f=>{let d=JSON.parse(fs.readFileSync(f));d=d.data||d;return d.workflow||d;};const eff=(W,n)=>rebuild(W.nodes.find(x=>x.name===n).parameters.jsCode,W.nodes.find(x=>x.name==='Shared Library').parameters.jsCode);
const A=eff(g('/mnt/project-files/wall2024/fetchback_live_s127.json'),'Judge Enforcer Build'),B=eff(g('pkgA64/parent_s127_A64_'+(process.env.V||'O1')+'.json'),'Judge Enforcer Build');
const out=(rd,n)=>{const r=rd[n];if(!r)return null;const m=(r[r.length-1].data||{}).main;return m&&m[0]?m[0].map(x=>x.json):null;};
(async()=>{const T={n:0,ol:0,dis:0,disOl:0};for(const r of fs.readdirSync('/mnt/project-files/wall2024/').filter(f=>/^ex\d+_full\.json$/.test(f)).sort()){const X=JSON.parse(fs.readFileSync('/mnt/project-files/wall2024/'+r));const rd=(X.data||X).resultData.runData;if(!rd['Judge Enforcer Build'])continue;
 const oa=await run(A,'Judge Enforcer Build',rd),ob=await run(B,'Judge Enforcer Build',rd);if(oa.err||ob.err){console.log(r,'ERR',oa.err||ob.err);continue;}
 const txt=o=>o.map(it=>((it.body||it).messages||[]).map(m=>m.content).join('\n'));const ta=txt(oa),tb=txt(ob);const ca=ta.reduce((s,x)=>s+x.length,0),cb=tb.reduce((s,x)=>s+x.length,0);
 const items={};for(const u of tb)for(const m of ('\n\n'+u).matchAll(/\n\nITEM (B\d+) \(E-ANS; the answering side wrote this in \[([^\]]+)\][^\n]*\n([\s\S]*?)(?=\n\nITEM |$)/g)){const v=(m[3].match(/PRESSED VERSE: ([^\n]*)/)||[])[1];const seats=[...m[3].matchAll(/- B\d+\.\d+ \(([^)]+)\)/g)].map(x=>x[1]);items[m[1]]={key:'ANSWER CHECK '+v+' ['+m[2]+']',ol:/THE SIDE'S OTHER LINES ON THIS VERSE/.test(m[3]),seats};}
 const its=Object.values(items);const nOl=its.filter(x=>x.ol).length;
 // stored DISAGREE (right: MISSES) rows: does the same item (verse, round) and seat get other lines under O1?
 const jer=[];for(const n of ['Judge Enforcer Record']){const o=out(rd,n);if(o)o.forEach(j=>(j.enf428_rows||[]).forEach(x=>jer.push(x)));}
 const dis=jer.filter(x=>x.rule==='E-ANS'&&/^ENFORCER DISAGREE \(right: MISSES\)/.test(String(x.cure_reason||'')));const olKeys=new Set(its.filter(x=>x.ol).flatMap(x=>x.seats.map(s=>x.key+'|'+s)));const allKeys=new Set(its.flatMap(x=>x.seats.map(s=>x.key+'|'+s)));
 const dOl=dis.filter(x=>olKeys.has(x.item+'|'+x.seat)).length,dFound=dis.filter(x=>allKeys.has(x.item+'|'+x.seat)).length;
 console.log(r,'| E-ANS items',its.length,'| given the side\'s other lines',nOl,'| check calls',ta.length,'->',tb.length,'| check-visible chars',ca,'->',cb,'('+(cb-ca>=0?'+':'')+(cb-ca)+')','| stored MISSES disagreements',dis.length,'(matched to a replay item',dFound+')','| of them now given other lines',dOl);
 T.n+=its.length;T.ol+=nOl;T.dis+=dis.length;T.disOl+=dOl;
 if(process.env.SHOW&&r.includes(process.env.SHOW))for(const u of tb)for(const m of ('\n\n'+u).matchAll(/\n\nITEM (B\d+) \(E-ANS[^\n]*\n([\s\S]*?)(?=\n\nITEM |$)/g))if(/OTHER LINES/.test(m[2]))console.log('---',m[1],m[2].slice(0,1400));}
 console.log('TOTAL',JSON.stringify(T));})();
