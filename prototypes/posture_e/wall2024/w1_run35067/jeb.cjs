// W1 second grade on run 35067: pkgEAF AU (s127 vs s128 rebuild), pkgA1N rev 3 (s128 vs s130 rebuild + stored output), Judge Enforcer Build and Alt.
const fs=require('fs');const L=require('/mnt/project-files/w4/kwn/lib.cjs');const run=require('../pkgKSR/run_node.cjs');const P='/mnt/project-files/wall2024/';
const rd=JSON.parse(fs.readFileSync(P+'ex35067_full.json','utf8')).data.resultData.runData;
const V={s127:L(P+'fetchback_live_s127.json'),s128:L('/tmp/claude-0/fetchback_live_s128.json'),s130:L('/tmp/claude-0/live_now.json')};
const items=o=>{const m=new Map();for(const c of o){const s=c.body&&c.body.messages?c.body.messages.map(x=>x.content).join('\n'):JSON.stringify(c.body);for(const t of s.split(/(?=ITEM [A-Z]+\d+ \()/))if(/^ITEM [A-Z]+\d+ \(/.test(t))m.set(t.match(/^ITEM ([A-Z]+\d+)/)[1],t.replace(/\s+$/,''));}return m;};
const body=c=>c.body&&c.body.messages?c.body.messages.map(x=>x.content).join('\n'):JSON.stringify(c.body);
(async()=>{for(const n of ['Judge Enforcer Build','Alt Judge Enforcer Build']){const st=rd[n][0].data.main[0].map(x=>x.json);const O={};for(const v in V)O[v]=await run(V[v].code(n),n,rd);
 console.log('\n####',n,'stored calls',st.length,'je_skip',st[0]&&st[0].je_skip,'| replay calls s127',O.s127.length,'s128',O.s128.length,'s130',O.s130.length);
 if(st[0]&&st[0].je_skip){console.log(' skipped:',JSON.stringify(st[0]).slice(0,300));continue;}
 const strip=v=>JSON.stringify(v).replace(/20\d\d-\d\d-\d\dT\d\d:\d\d:\d\d(\.\d+)?Z/g,'<ts>');console.log(' s130 replay equals stored output:',strip(O.s130)===strip(st));
 const I={};for(const v in O)I[v]=items(O[v]);const S=items(st);
 const ea=v=>[...I[v]].filter(([k,t])=>/E-ANS/.test(t.slice(0,60)));
 // EAF checks
 const full=v=>new Set(ea(v).filter(([k,t])=>/THE ANSWER IN FULL, FROM/.test(t)).map(x=>x[0]));const f7=full('s127'),f8=full('s128');
 console.log(' EAF1 FULL items s127',f7.size,'s128',f8.size,'lost',[...f7].filter(x=>!f8.has(x)).join(',')||'none');
 const id7=ea('s127').map(x=>x[0]).join(),id8=ea('s128').map(x=>x[0]).join();const grades=v=>ea(v).map(([k,t])=>k+'|'+(t.split("THE JUDGES' GRADES:")[1]||'').split('REPLY LINES')[0]).join('\n');
 console.log(' EAF2 E-ANS items s127',ea('s127').length,'s128',ea('s128').length,'same ids',id7===id8,'same grades/seats',grades('s127')===grades('s128'));
 console.log(' EAF3 calls s127',O.s127.length,'s128',O.s128.length,'max call chars s128',Math.max(...O.s128.map(c=>body(c).length)),'stored max',Math.max(...st.map(c=>body(c).length)));
 const bs=ea('s130').filter(([k,t])=>/\\["”]/.test(t.split('THE ANSWER')[1]||''));console.log(' EAF4 E-ANS items with a backslash before a quote mark (s130):',bs.length,bs.map(x=>x[0]).join(','));
 // A1N checks
 const rules=st.map(c=>/and also the block the answer points to/.test(body(c)));console.log(' A1N1 new RULE sentence in every stored call:',rules.every(Boolean),rules.length);
 const ol=[...S].filter(([k,t])=>/THE SIDE'S OTHER LINES ON THIS VERSE/.test(t));let bad=[];const lbl=[];
 for(const [k,t] of ol){const sec=(t.match(/THE SIDE'S OTHER LINES ON THIS VERSE[^"]*"([\s\S]*?)"\nTHE JUDGES/)||[])[1]||'';const body0=sec.replace(/ \[\.\.\.\]$/,'');if(body0.length>900)bad.push(k+' len '+sec.length);if(/PRESSED WITH|--\s*MEANS:/i.test(sec))bad.push(k+' press line');
  const rk=(t.match(/wrote this in \[([A-Z]+)\d/)||[])[1];for(const m of sec.matchAll(/\[([A-Z]{2})\d(?:, LINK (\d+))?\]/g)){if(rk&&m[1]!==rk)bad.push(k+' other side '+m[0]);if(m[2]){const ans=(t.match(/THE ANSWER: "([\s\S]*?)"\n/)||[])[1]||'';lbl.push(k+' '+m[0]+' answer: '+ans.slice(0,90));if(!new RegExp('under\\s+link\\s+'+m[2]+'\\b|\\(\\s*link\\s+'+m[2]+'\\s*\\)','i').test(ans))bad.push(k+' label not matching pointer');}}}
 console.log(' A1N2 items with other-lines section (stored)',ol.length,'of E-ANS',[...S].filter(([k,t])=>/E-ANS/.test(t.slice(0,60))).length,'| faults:',bad.join('; ')||'none');
 console.log(' A1N3 pointed blocks:',lbl.join(' || ')||'none');
 const nonOL=[...I.s130].filter(([k,t])=>!/THE SIDE'S OTHER LINES/.test(t)&&I.s128.get(k)!==t).map(x=>x[0]);console.log(' A1N2b items without the section that differ from s128:',nonOL.join(',')||'none');
 console.log(' A1N4 calls s128',O.s128.length,'s130',O.s130.length,'stored',st.length);
 const chars=o=>o.reduce((a,c)=>a+body(c).length,0);console.log(' A1N5 check text s128',chars(O.s128),'stored',chars(st),'+'+(chars(st)-chars(O.s128)));
 const nc8=new Set((O.s128[0]||{}).not_checked||[]),ncS=(st[0]||{}).not_checked||[];console.log(' A1N6 not_checked s128',nc8.size,'stored',ncS.length,'lost',ncS.filter(x=>!nc8.has(x)).join(',')||'none','| ids sent s128 vs stored equal',[...I.s128.keys()].sort().join()===[...S.keys()].sort().join());
 const eaw=v=>ea(v).map(([k,t])=>k+':'+((t.match(/THE ANSWER IN FULL, FROM[\s\S]*?"\n/)||[''])[0])).join('\n');console.log(' A1N7 FULL blocks s128 vs s130 equal',eaw('s128')===eaw('s130'));
}})();
