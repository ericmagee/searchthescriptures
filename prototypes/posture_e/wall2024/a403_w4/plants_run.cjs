// ASK 403, W2 8618 condition: real v61 tags from run 39015 (3 bodies and chatgpt's removed record, from the Alternate Merge output).
// Each record's stored text ends with the live v61 tag. Strip that last tag, run ert386 under t401 and t403:
// (1) t401 must rebuild the stored tag byte for byte (the emulation holds); (2) t403's tag must equal the stored tag with "engine_manual v184 section 8" read as "engine_manual section 8".
const EV=f=>require('./ev.cjs')(f);const E={t401:EV(__dirname+'/../a401/t401.json'),t403:EV(__dirname+'/t403.json')};
const R=require('./run39015_records.json');const A='engine_manual v184 section 8',B='engine_manual section 8';let ok=true;
for(const r of R){const i=r.raw.lastIndexOf('\n[AUDIT v61: ENGINE RESULT');const pre=r.raw.slice(0,i),stored=r.raw.slice(i+1);
 const F=Object.fromEntries(Object.entries(r.F).filter(([k,v])=>v!=null));
 const a=E.t401.ert386(pre,r.seat,F),b=E.t403.ert386(pre,r.seat,F);const ta=a.slice(a.lastIndexOf('\n')+1),tb=b.slice(b.lastIndexOf('\n')+1);
 const c1=a===r.raw,c2=tb===stored.split(A).join(B),c3=b===pre+'\n'+tb; /* the stored text before the tag is kept as is (earlier v25 tags in it keep their old text) */if(!(c1&&c2&&c3))ok=false;
 console.log((r.seat+(r.removed?' (removed)':'')).padEnd(18),'t401 rebuilds stored text:',c1,'| t403 tag = stored tag with section form:',c2,'| t403 adds only the tag:',c3);
 console.log('   stored :',stored.slice(0,200));console.log('   t403   :',tb.slice(0,200));}
console.log(ok?'RESULT: PASS':'RESULT: FAIL');
