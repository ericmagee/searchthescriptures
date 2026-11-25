// ASK 638 A build (W4): when a cure takes named premises out of a count, the counted-premises array drops the same premises. Engine Shared Library only. node b638.cjs base_eng.json out_target.json
const fs=require('fs');const [,,BE,OUT]=process.argv;const E=JSON.parse(fs.readFileSync(BE,'utf8'));
const n0=E.nodes.find(k=>k.name==='Shared Library');const T=n0.parameters.jsCode;
const P={head:T.slice(0,T.indexOf('\n/*LIB*/')),L:JSON.parse(T.slice(T.indexOf('\n/*LIB*/')+8,T.lastIndexOf('\n/*MAP*/'))),M:JSON.parse(T.slice(T.lastIndexOf('\n/*MAP*/')+8,T.lastIndexOf('\n/*END*/')))};
const tail=T.slice(T.lastIndexOf('\n/*END*/')+8);const L0=P.L.slice();
const once=(i,a,b)=>{if(P.L[i].split(a).length!==2||P.L.filter(l=>l.includes(a)).length!==1)throw new Error('ASK 638 build: anchor not found exactly once at LIB '+i+': '+a.slice(0,60));P.L[i]=P.L[i].replace(a,()=>b);};
// 1. LIB 1366: the premises CURED items took out of the count, per side
const A1="__cpAdd[x.side].push(x.premise);}});";
once(1366,A1,A1+String.raw`const __cpDrop={DEFENDER:[],CHALLENGER:[]};(v||[]).forEach(x=>{if(x&&x.status==='CURED'&&/\bCORRECTED COUNT \d+ takes the premise out of the count$/.test(String(x.why||''))&&__cpDrop[x.side]&&Number.isInteger(x.premise)&&x.premise>=1&&__cpDrop[x.side].indexOf(x.premise)<0)__cpDrop[x.side].push(x.premise);}); /* ASK 638: the premises CURED K-UNX, K-UNX-A, K-UNX range and E-ASM items took out of the count */`);
// 2. LIB 1368 and 1501: the result carries cpDrop
once(1368,"retracted:wd.map(x=>x.link),cpAdd:__cpAdd};}","retracted:wd.map(x=>x.link),cpAdd:__cpAdd,cpDrop:__cpDrop /* ASK 638 */};}");
once(1501,"cpAdd:null,items,applied:sids,","cpAdd:null,cpDrop:null /* ASK 638 */,items,applied:sids,");
// 3. LIB 1556: drop them before cpdSync, only when the drop matches the cut exactly
const A3="let __cpd='';try{const __c=cpdSync(j,__cpdPre,seat);j=__c.j;__cpd=__c.mark;}catch(e){__cpd='\\n[AUDIT v50: COUNTED PREMISES -- the derive failed: '";
const B3=String.raw`let __cpd='';if(R.cpDrop)for(const [sd,key,ck] of [['DEFENDER','counted_premises_defender','conceded_links'],['CHALLENGER','counted_premises_challenger','challenger_conceded_links']]){const dr=R.cpDrop[sd]||[];if(!dr.length)continue;const rx=new RegExp('("'+key+'"\\s*:\\s*)\\[([^\\]]*)\\]');const m=j.match(rx);if(!m)continue;const cur=(m[2].match(/\d+/g)||[]).map(Number);const add=(R.cpAdd&&R.cpAdd[sd])||[];const n=F[ck],a=__cpdPre[ck];const nu=cur.filter(k=>dr.indexOf(k)<0);if(!Number.isInteger(n)||n===0||a==null||a-n!==dr.length||!dr.every(k=>cur.indexOf(k)>=0)||dr.some(k=>add.indexOf(k)>=0)||nu.length!==n)continue;j=j.replace(rx,(_,h)=>h+'['+nu.join(',')+']');__cpd+='\n[AUDIT v50: COUNTED PREMISES DERIVED (pkgCPD) -- '+(seat?'SEAT: '+seat+'; ':'')+'SIDE: '+sd+'; COUNT: '+a+' to '+n+'; WAS: ['+cur.join(',')+']; NOW: ['+nu.join(',')+']; FROM: the cure took premise(s) '+dr.join(', ')+' out of the count; record-only, it removes no seat ; END]';} /* ASK 638: a cure's removed premises leave the array when the drop equals the cut, each is in the array, none is also added, and the array then has the count's length (a count of 0 is left to pkgCPD, which sets []); otherwise pkgCPD runs as before */try{const __c=cpdSync(j,__cpdPre,seat);j=__c.j;__cpd+=__c.mark;}catch(e){__cpd+='\n[AUDIT v50: COUNTED PREMISES -- the derive failed: '`;
once(1556,A3,B3);
const reb=p=>p.map(x=>typeof x==='number'?P.L[x]:typeof x[0]==='string'?x[0]:P.L.slice(x[0],x[1]+1).join('\n')).join('\n');
const touched=[];for(const [k,v] of Object.entries(P.M)){if(!v||!Array.isArray(v.p))continue;const n=reb(v.p).length;if(n!==v.n){touched.push(k);v.n=n;}}
n0.parameters.jsCode=P.head+'\n/*LIB*/'+JSON.stringify(P.L)+'\n/*MAP*/'+JSON.stringify(P.M)+'\n/*END*/'+tail;
fs.writeFileSync(OUT,JSON.stringify(E));console.log('ASK 638 A built:',OUT,'| LIB lines changed:',P.L.map((l,i)=>l!==L0[i]?i:null).filter(x=>x!==null).join(','),'| MAP entries re-measured:',touched.length,touched.join(', '));
