// ASK 626 build (W4): a premise list written with bold or heading numbers ("**1.**", "### 1.", "#### **1.**") is read, and a list under its heading that the system reads no premise from is reported as LIST NOT READ, never forfeited, and is not acted on (operator "Build it" 21:01 CST 11-24).
// Engine only (node code and Shared Library; the child holds no list reader). node b626.cjs base_eng.json outdir
const fs=require('fs');const [,,BE,OUT]=process.argv;const E=JSON.parse(fs.readFileSync(BE,'utf8'));
const node=n=>{const x=E.nodes.find(k=>k.name===n);if(!x)throw new Error('no node '+n);return x;};
const split=T=>({head:T.slice(0,T.indexOf('\n/*LIB*/')),L:JSON.parse(T.slice(T.indexOf('\n/*LIB*/')+8,T.lastIndexOf('\n/*MAP*/'))),M:JSON.parse(T.slice(T.lastIndexOf('\n/*MAP*/')+8,T.lastIndexOf('\n/*END*/')))});
const join=p=>p.head+'\n/*LIB*/'+JSON.stringify(p.L)+'\n/*MAP*/'+JSON.stringify(p.M)+'\n/*END*/\n';
const cnt=(s,a)=>s.split(a).length-1;
const all=(s,a,b,n,w)=>{const k=cnt(s,a);if(k!==n)throw new Error('expected '+n+' of '+JSON.stringify(a)+' in '+w+', found '+k);return s.split(a).join(b);};
const once=(s,a,b,w)=>all(s,a,b,1,w);
// THE ONE HEAD FORM (ASK 626): optional heading marks "#", bold marks, the number, "." or ")", optional closing bold marks, then space.
const H1o='\\s*\\**\\s*(?:\\d+[.)]\\s|LINK',H1n='\\s*(?:#{1,6}\\s*)?\\**\\s*(?:\\d+[.)]\\**\\s|LINK';            // readers with the LINK k: form
const H2o='\\s*\\**\\s*\\d+[.)]\\s',H2n='\\s*(?:#{1,6}\\s*)?\\**\\s*\\d+[.)]\\**\\s';                              // readers without it
const LCo='^\\s*[*_]*\\s*\\d+[.)]\\s+\\S',LCn='^\\s*(?:#{1,6}\\s*)?[*_]*\\s*\\d+[.)][*_]*\\s+\\S';                // listCount
const STo='\\n[ \\t]*(?:#{1,3}\\s|---',STn='\\n[ \\t]*(?:#{1,3}\\s(?![ \\t]*\\**[ \\t]*\\d+[.)])|---';              // a "### 1." item does not end the list body
const LNR="lnr626=s=>{s=String(s||'');if(/PREMISE COUNT:\\s*\\**\\s*0\\b/i.test(s))return false;return s.split('\\n').slice(1).some(l=>/[A-Za-z]{3,}/.test(l)&&!/^\\W*(?:none|no premises?)\\b/i.test(l));}";
const LNRL=w=>"'LIST NOT READ: "+w+" -- the heading is present but the system read no premise under it; grade the list from the round text'";
const T='/* ASK 626 */';
// THE STYLE LOCK (ASK 626, C3 on run 42234 [CR3] 8dd067f4): the first premise head sets the form. When it is a "#" heading, a plain numbered line under it ("1. The coming together") is a line of that premise, not a new one; when it is plain, a "#" numbered line stays inside the item it falls in, as it does live. One spelling everywhere:
const RLK=".reduce((a,x)=>{if(a.length&&/^\\s*#/.test(a[0])!==/^\\s*#/.test(x))a[a.length-1]+='\\n'+x;else a.push(x);return a;},[])";
const F1="/i.test(x))",F1h="/^\\s*(?:#{1,6}\\s*)?\\**\\s*(?:\\d+[.)]\\**\\s|LINK\\s+(?:\\d+|none)\\s*:)"+F1;
const F2="/.test(x))",F2h="/^\\s*(?:#{1,6}\\s*)?\\**\\s*\\d+[.)]\\**\\s"+F2;
// For split readers the lock walks the pieces of the split itself, so a merged line keeps every newline it had: a piece that is not a head of the first head's form joins the item before it; a blank piece is dropped only when a head of that form follows (which is what the live filter does).
const WALK=re=>".reduce((a,x,i,A)=>{const H=y=>"+re+".test(y)&&(a.f===null||a.f===/^\\s*#/.test(y));if(a.f===null&&H(x))a.f=/^\\s*#/.test(x);if(H(x))a.p.push(x);else if(a.p.length&&!(/^\\s*$/.test(x)&&i+1<A.length&&H(A[i+1])))a.p[a.p.length-1]+='\\n'+x;return a;},{p:[],f:null}).p";
const lock1=(s,k,w)=>all(s,'.filter(x=>'+F1h,WALK(F1h.slice(0,-F1.length+1)+'i'),k,w),lock2=(s,k,w)=>all(s,'.filter(x=>'+F2h,WALK(F2h.slice(0,-F2.length+1)),k,w);

const tag=(s0,s1,w)=>{const a=s0.split('\n'),b=s1.split('\n');if(a.length!==b.length)throw new Error('line count changed in '+w);return b.map((l,i)=>l!==a[i]&&!l.includes('ASK 626')?l+' '+T:l).join('\n');}; // ASK 599: every changed line carries its ASK
const NE={};const ed=(n,f)=>{const x=node(n);const s0=x.parameters.jsCode;const s1=tag(s0,f(s0,n),n);if(s1===s0)throw new Error('no change '+n);x.parameters.jsCode=s1;NE[n]=(NE[n]||0)+1;};
// 1. node readers, LINK form
for(const n of ['D3 Build','D4 Build','Panel Build','Build Independent Verdict','Build Save Body','Assume Check Build'])ed(n,(s,w)=>lock1(all(s,H1o,H1n,2,w),1,w));
// 2. node readers without LINK form
ed('C3 Build',(s,w)=>lock2(all(s,H2o,H2n,4,w),2,w));ed('C3 Extract',(s,w)=>lock2(all(s,H2o,H2n,2,w),1,w));ed('C4 Build',(s,w)=>lock2(all(s,H2o,H2n,2,w),1,w));
// 3. listCount and the FORFEITED / LIST NOT READ lines (review notes; transcript)
ed('Build Save Body',(s,w)=>{s=once(s,"return {n:(tail.match(/"+LCo+"/gm)||[]).length,missing:false};};","{const hs=tail.match(/"+LCn+"/gm)||[];const n=hs.filter(h=>/^\\s*#/.test(h)===/^\\s*#/.test(hs[0])).length;return {n,missing:false,unread:n===0&&lnr626(tail)};}};const "+LNR+"; "+T,w);
 s=once(s,"if(vsDef.n===0)FF.push('LINK ROUND FORFEITED: CHALLENGER","if(vsDef.n===0)FF.push(vsDef.unread?"+LNRL('CHALLENGER')+":'LINK ROUND FORFEITED: CHALLENGER",w);
 s=once(s,"if(vsCh.n===0)FF.push('LINK ROUND FORFEITED: DEFENDER","if(vsCh.n===0)FF.push(vsCh.unread?"+LNRL('DEFENDER')+":'LINK ROUND FORFEITED: DEFENDER",w);return s;});
ed('Format Markdown',(s,w)=>{s=once(s,"return {n:(tail.match(/"+LCo+"/gm)||[]).length,missing:false};};","{const hs=tail.match(/"+LCn+"/gm)||[];const n=hs.filter(h=>/^\\s*#/.test(h)===/^\\s*#/.test(hs[0])).length;return {n,missing:false,unread:n===0&&lnr626(tail)};}};const "+LNR+"; "+T,w);
 s=once(s,"if(vsDef.n===0)FF.push('**Link round forfeited by the challenger:**","if(vsDef.n===0)FF.push(vsDef.unread?"+LNRL('CHALLENGER')+":'**Link round forfeited by the challenger:**",w);
 s=once(s,"if(vsCh.n===0)FF.push('**Link round forfeited by the defender:**","if(vsCh.n===0)FF.push(vsCh.unread?"+LNRL('DEFENDER')+":'**Link round forfeited by the defender:**",w);return s;});
// 4. Assume Check Build: item split, item head, the STEP form, and the body end
ed('Assume Check Build',(s,w)=>{s=all(s,"body.split(/\\n(?=[ \\t]*\\**[ \\t]*\\d+[.)]\\s)/)","body.split(/\\n(?=[ \\t]*(?:#{1,6}[ \\t]*)?\\**[ \\t]*\\d+[.)]\\**\\s)/)"+WALK("/^\\s*(?:#{1,6}\\s*)?\\**\\s*\\d+[.)]\\**\\s/"),2,w);
 s=all(s,"^\\s*\\**\\s*(\\d+)[.)]\\s+([\\s\\S]*)$","^\\s*(?:#{1,6}\\s*)?\\**\\s*(\\d+)[.)]\\**\\s+([\\s\\S]*)$",2,w);
 s=once(s,"\\n(?=[ \\t]*\\**[ \\t]*(?:\\d+[.)]\\s|STEP","\\n(?=[ \\t]*(?:#{1,6}[ \\t]*)?\\**[ \\t]*(?:\\d+[.)]\\**\\s|STEP",w);
 return all(s,STo,STn,3,w);});
// 5. __LC423 (the challenger-list count that bounds the LINK labels of [DR3])
for(const n of ['C2B Extract','D3B Extract','C3B Extract'])ed(n,(s,w)=>{s=once(s,STo,STn,w);return once(s,"/^[ \\t]*\\**[ \\t]*(\\d+)[.)]\\s/gm","/^[ \\t]*(?:#{1,6}[ \\t]*)?\\**[ \\t]*(\\d+)[.)]\\**\\s/gm",w);});
// 6. preCheckSide (judge packet): the "### 1." item neither ends the body nor is missed
for(const n of ['Panel Build','Build Independent Verdict'])ed(n,(s,w)=>{s=once(s,"/\\n\\s*(?:PREMISE COUNT\\s*:|-{3,}|#{1,3}\\s)/i","/\\n\\s*(?:PREMISE COUNT\\s*:|-{3,}|#{1,3}\\s(?![ \\t]*\\**[ \\t]*\\d+[.)]))/i",w);
 s=once(s,"/\\n(?=[ \\t]*(?:\\*\\*)?(?:\\d+\\.|LINK","/\\n(?=[ \\t]*(?:#{1,6}[ \\t]*)?(?:\\*\\*)?(?:\\d+\\.|LINK",w);return once(s,"\\s*:))/i).slice(1);","\\s*:))/i).slice(1)"+RLK+";",w);});
// 7. the judges' PRESSED-WITNESS LEDGER: a list not read says so, never an empty side
for(const n of ['Panel Build','Build Independent Verdict'])ed(n,(s,w)=>{s=once(s,"  return {list:true,premises};};","  return {list:true,premises,unread:!premises.length&&lnr626(list)};};const "+LNR+"; "+T,w);
 return once(s,"const sideLines=(s,label)=>{if(!s.list)return [label+': no closing premise list found.'];","const sideLines=(s,label)=>{if(!s.list)return [label+': no closing premise list found.'];if(s.unread)return [label+': LIST NOT READ: '+(/AGAINST THE DEFENDER/.test(label)?'CHALLENGER':'DEFENDER')+' -- the heading is present but the system read no premise under it; grade the list from the round text.'];"+T,w);});
// 8. Shared Library (engine; the child is served it)
const n0=node('Shared Library');const P=split(n0.parameters.jsCode);const L0=P.L.slice();
const lb=(i,f)=>{const s=f(P.L[i],'LIB '+i);if(s===P.L[i])throw new Error('no change LIB '+i);P.L[i]=s;};
for(const [i,k] of [[998,2],[1027,1],[1672,2],[2035,2],[2550,2]])lb(i,(s,w)=>{s=all(s,H1o,H1n,k,w);return (k===2?lock1(s,1,w):s)+' '+T;});
for(const i of [437,3716])lb(i,(s,w)=>lock2(all(s,H2o,H2n,2,w),1,w)+' '+T);
lb(996,s=>s+' function '+LNR.replace('lnr626=s=>{','lnr626(s){')+' '+T);
lb(999,s=>' if(!its.length&&lnr626(t.slice(i)))return null; /* ASK 626 (pwList only; LIB 998 is shared with kvCharges and kvUni): a list under its heading that the system reads no premise from is no list to the K checks (no K-G10, K-P, K-R or broken-press item, no count from it) */'+s);
const CH=new Set(P.L.map((l,i)=>l!==L0[i]?i:-1).filter(i=>i>=0));const reb=p=>p.map(x=>typeof x==='number'?P.L[x]:typeof x[0]==='string'?x[0]:P.L.slice(x[0],x[1]+1).join('\n')).join('\n');
const touched=[];for(const [k,v] of Object.entries(P.M)){if(!v||!Array.isArray(v.p))continue;const n=reb(v.p).length;if(n!==v.n){touched.push(k);v.n=n;}}
n0.parameters.jsCode=join(P);
fs.writeFileSync(OUT+'/target_engine_626.json',JSON.stringify(E));
console.log('nodes: '+Object.entries(NE).map(([k,v])=>k+' x'+v).join(', '));console.log('LIB lines changed: '+[...CH].join(', ')+'; MAP n changed: '+touched.length);
