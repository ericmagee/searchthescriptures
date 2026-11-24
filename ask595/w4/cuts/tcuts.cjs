// ASK 595 follow-on tests (W4): QR DROPPED replies stored whole; reversed-close quotations shown whole (Panel Build, BIV, LIB 3564); mlsBlock whole.
const fs=require('fs');const lp=require('/mnt/project-files/ask588/w4/build/libpatch.js');const D=__dirname;
const J=f=>JSON.parse(fs.readFileSync(f,'utf8'));const B='/mnt/project-files/ask586/w4/j6recut/';
const E0=J(B+'fetchback_eng586j6.json'),C0=J(B+'fetchback_child586j6.json'),E1=J(D+'/target_engine_cuts.json'),C1=J(D+'/target_child_cuts.json');
let pass=0,fail=0;const T=(id,ok,what)=>{ok?pass++:fail++;console.log((ok?'PASS ':'FAIL ')+id+' '+what);};
const nm=W=>Object.fromEntries(W.nodes.map(n=>[n.name,JSON.stringify(n.parameters)]));
const ENG=['Build Independent Verdict','Panel Build','QR Final','QR Follow Final','Shared Library'];
for(const [k,A,Bw,want] of [['engine',E0,E1,ENG],['child',C0,C1,['Shared Library']]]){const a=nm(A),b=nm(Bw);const ch=Object.keys(b).filter(x=>a[x]!==b[x]).sort();
 T('S1 '+k,JSON.stringify(ch)===JSON.stringify(want)&&Object.keys(a).length===Object.keys(b).length&&JSON.stringify(A.connections)===JSON.stringify(Bw.connections),k+': changed nodes '+ch.join(', ')+'; node count and connections equal');
 const LA=lp.cut(A).L,LB=lp.cut(Bw).L;const lc=LA.map((l,i)=>l!==LB[i]?i:-1).filter(i=>i>=0);T('S2 '+k,LA.length===LB.length&&JSON.stringify(lc)===JSON.stringify([2277,3564]),k+': LIB lines changed '+lc.join(', '));}
const code=(W,n)=>W.nodes.find(x=>x.name===n).parameters.jsCode;
T('S3',!/slice\(0,\s*2000\)/.test(code(E1,'QR Final'))&&!/slice\(0,\s*2000\)/.test(code(E1,'QR Follow Final')),'no 2,000 cut is left in QR Final or QR Follow Final');
T('S4',['Panel Build','Build Independent Verdict'].every(n=>!/\bx\.(?:closing|earlier)_q\)\.slice/.test(code(E1,n)))&&!/__x\.(?:closing|earlier)_q\)\.slice/.test(lp.cut(E1).L[3564]),'no cut is left on the ASK 590 closing_q or earlier_q quotations in Panel Build, Build Independent Verdict or LIB 3564 (the older TRIAL block r.close_q/r.earlier_q 400 is not in this change)');
// balanced extractor
const bal=(s,at)=>{let d=0;for(let i=at;i<s.length;i++){const ch=s[i];if(ch==="'"||ch==='"'){const q=ch;i++;while(i<s.length&&s[i]!==q){if(s[i]==='\\')i++;i++;}continue;}if(ch==='('||ch==='{')d++;else if(ch===')'||ch==='}'){d--;if(d===0)return s.slice(at,i+1);}}throw new Error('unbalanced');};
const fnText=(line,name)=>{const P=line.split(/\n(?=function )/);const f=P.filter(x=>x.startsWith('function '+name+'('));if(f.length!==1)throw new Error(name+' found '+f.length);return f[0].replace(/\}\)\(\);?\s*$/,'');};
const LONG=n=>('word '.repeat(Math.ceil(n/5))).slice(0,n-4)+'END.';
// QR Final and QR Follow Final
const qrF=W=>{const c=code(W,'QR Final');const a=c.indexOf('(ok?{}:{first_reply:');return new Function('ok','c','second','return '+bal(c,a));};
const qrG=W=>{const c=code(W,'QR Follow Final');const a=c.indexOf('(ok?{}:{reply:');return new Function('ok','t','return '+bal(c,a));};
const r3=LONG(3200);const f1=qrF(E1)(false,{first_text:r3},r3+'2'),f0=qrF(E0)(false,{first_text:r3},r3+'2');
T('Q1',f1.first_reply===r3&&f1.second_reply===r3+'2','QR Final: a DROPPED first and second reply of '+r3.length+' characters are stored whole');
T('Q2',f0.first_reply.length===2000,'control: the live QR Final stores it cut to '+f0.first_reply.length);
T('Q3',qrG(E1)(false,r3).reply===r3&&qrG(E0)(false,r3).reply.length===2000,'QR Follow Final: the DROPPED reply is stored whole (live cuts to 2,000)');
T('Q4',JSON.stringify(qrF(E1)(true,{first_text:r3},r3))==='{}','a PASSED reply adds no field, as before');
// Panel Build and BIV reversed close block
const R={verse:'Matthew 1:25',link:3,closing_round:'CR4',earlier_round:'CR3',closing_q:LONG(900),earlier_q:LONG(700)};
for(const n of ['Panel Build','Build Independent Verdict'])for(const [W,ctl] of [[E1,false],[E0,true]]){const c=code(W,n);let at=-1,k=0;const outs=[];while((at=c.indexOf("L.map(x=>'\\n- '+SD+",at+1))>=0){outs.push(new Function('L','SD','sd','return '+bal(c,at))([R],'DEFENDER','D').join(''));k++;}
 const ok=k===2&&outs.every(o=>ctl?(o.includes(R.closing_q.slice(0,500)+'"')&&!o.includes(R.closing_q)):(o.includes('"'+R.closing_q+'"')&&o.includes('"'+R.earlier_q+'"')));
 T('P '+n+(ctl?' control':''),ok,(ctl?'control: live shows the 900 and 700 character quotations cut to 500':n+': both reversed-close blocks (verse and link) show a 900-character close quotation and a 700-character earlier quotation whole'));}
// LIB 3564 send-back text
const run=(LL)=>{const dis=[];const RR={id:'X3',side:'DEFENDER',verse:'Deuteronomy 22:24',closing_round:'DR4',earlier_round:'DR3',closing_q:'the law counts her as a wife in the eyes of the congregation '+LONG(600),earlier_q:'The verse names her a damsel '+LONG(500)};const $=n=>({isExecuted:n==='Close Enforcer Record',first:()=>({json:{cec:{reversed:[RR]}}})});
 new Function('$','PCC','dis','E421','E428','__acxAlt',LL[3563]+'\n'+LL[3564])($,{bodies:[JSON.stringify({payload:{judge_seat:'sol62',verdict_raw:'VERDICT\nDEFENDER LINK 2 STANDS: '+RR.closing_q+'\nX'}})],alt_seats:[]},dis,[],[],false);return {dis,RR};};
for(const [k,W] of [['engine',E1],['child',C1]]){const {dis,RR}=run(lp.cut(W).L);T('R '+k,dis.length===1&&dis[0].cure_reason.includes('"'+RR.closing_q+'"')&&dis[0].cure_reason.includes('"'+RR.earlier_q+'"'),k+': the E-REVCLOSE send-back shows the '+RR.closing_q.length+' and '+RR.earlier_q.length+' character quotations whole');}
{const {dis,RR}=run(lp.cut(E0).L);T('R control',dis.length===1&&!dis[0].cure_reason.includes(RR.closing_q),'control: the live send-back text cuts them to 400');}
// mlsBlock
const mk=W=>{const l=lp.cut(W).L[2277];return new Function(['mlsNoMargin','mlsFold','mlsBlock'].map(n=>fnText(l,n)).join('\n')+'\nreturn mlsBlock;')();};
const round='LINK 2: the begetting\nMEANS [CR3] "the husband of Mary heads the born clause with begetting line to Joseph"\n'+Array.from({length:6},(_,i)=>'continuation line '+i+' '+LONG(380)).join('\n')+'\nLINK 3: next';
const q='the husband of Mary heads the born clause';const b1=mk(E1)(round,q),b0=mk(E0)(round,q),bc=mk(C1)(round,q);
T('M1',b1&&b1.length>1500&&b1.endsWith('END.')&&b1.split('\n').length===7,'mlsBlock returns the whole block ('+(b1&&b1.length)+' characters, 7 lines) in the engine');
T('M2',bc===b1,'child library: the same');T('M3',b0&&b0.length===1500,'control: the live mlsBlock cuts it to '+(b0&&b0.length));
console.log('RESULT: '+(fail?'FAIL ('+fail+' fail, '+pass+' pass)':'ALL PASS ('+pass+' pass)'));
