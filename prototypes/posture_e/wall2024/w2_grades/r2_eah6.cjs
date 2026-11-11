// W2 repeat 2: why do some grant-or-short [CR3] E-ANS items get no THE ANSWER IN FULL? Probe of eahFull inside live s125 Judge Enforcer Build on stored 34852.
const fs=require('fs');const run=require(process.cwd()+'/pkgKSR/run_node.cjs');const {rebuild}=require(process.cwd()+'/pkgLIB/unpack.cjs');
const g=f=>{let d=JSON.parse(fs.readFileSync(f));d=d.data||d;return d.workflow||d;};const L=g('/mnt/project-files/wall2024/fetchback_live_s125.json');
const lt=L.nodes.find(x=>x.name==='Shared Library').parameters.jsCode;let s=rebuild(L.nodes.find(x=>x.name==='Judge Enforcer Build').parameters.jsCode,lt);
const hook="const eahLine=(a,acc)=>{const b=eahFull(a);";if(!s.includes(hook))throw new Error('hook not found');
s=s.replace(hook,"const eahLine=(a,acc)=>{const b=eahFull(a);try{const m=String(a).match(AC);if(!m){(globalThis.__LOG=globalThis.__LOG||[]).push({nomatch:String(a).slice(0,400)});}if(m&&/CR3/.test(m[2])){const ans=m[4];const gate=/^\\s*(?:i\\s+grant|i\\s+concede|i\\s+accept|granted)\\b/i.test(N(ans))||N(ans).length<60;const rk=m[2].split(/\\s*[;,]\\s*/);const f=x=>x?{len:N(x.t).length,need:N(ans).length+60,head:x.t.slice(0,160)}:null;(globalThis.__LOG=globalThis.__LOG||[]).push({verse:m[1],rk:m[2],means:m[3].slice(0,80),ans,gate,served:!!b,w:f(eawBlock(R,rk,m[1],ans)),wm:f(eawBlockMeans(R,rk,m[3],ans)),wi:f(eaiBlock(R,rk,ans))});}}catch(e){(globalThis.__LOG=globalThis.__LOG||[]).push({err:String(e)});}");
const X=JSON.parse(fs.readFileSync('/mnt/project-files/wall2024/ex34852_full.json'));const rd=(X.data||X).resultData.runData;
(async()=>{globalThis.__LOG=[];const o=await run(s,'Judge Enforcer Build',rd);if(o.err)console.log('ERR',o.err);
 const seen=new Set();const rows=globalThis.__LOG.filter(x=>{const k=x.verse+'|'+x.ans;if(seen.has(k))return false;seen.add(k);return true;});
 console.log('distinct [CR3] answer lines',rows.length,'served',rows.filter(x=>x.served).length,'gate fail',rows.filter(x=>!x.gate).length);
 for(const x of rows.filter(x=>x.gate&&!x.served))console.log(JSON.stringify(x,null,1));
 // the R text around each unserved verse
 let R=null;for(const n of ['Panel Cure Normalize 1','Panel Cure Normalize 2','Panel Cure Normalize 3']){const r=rd[n];if(!r)continue;for(const it of r[r.length-1].data.main[0]){const c=it.json&&it.json.cure;if(c&&c.rounds){R=c.rounds;break;}}if(R)break;}
 for(const x of rows.filter(x=>x.gate&&!x.served)){const t=R.CR3;const v=x.verse.match(/^((?:[1-3]\s)?[A-Za-z][A-Za-z ]*?\s\d+:\d+)/);const i=v?t.indexOf(v[1]):-1;console.log('\n### CR3 around',x.verse,'@',i,'\n'+(i>=0?t.slice(Math.max(0,t.lastIndexOf('\n',i-1)),i+500):'(verse not found as written)'));}})();
// lines for the six items' verses: AC parse failures and every logged form
setTimeout(()=>{const V=['Isaiah 7:16','Matthew 1:25','Hebrews 2:16','Luke 1:13','Luke 1:63','Hebrews 2:14'];console.log('\n=== logged entries for the six verses');
 for(const x of globalThis.__LOG){const t=x.nomatch||x.verse||'';if(V.some(v=>t.includes(v)))console.log(JSON.stringify(x.nomatch?{nomatch:x.nomatch}:{verse:x.verse,rk:x.rk,ans:x.ans,gate:x.gate,served:x.served,w:x.w&&x.w.len,wm:x.wm&&x.wm.len,wi:x.wi&&x.wi.len,need:(x.w||x.wi||{}).need}));}},3000);
