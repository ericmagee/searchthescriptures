// ASK 340 build: Part A (English words set aside) in every copy of check(); Part B gloss trial; reads in 3 new nodes (L2 Gloss Plan, L2 Gloss Any, L2 Gloss Read).
const fs=require('fs'),cr=require('crypto'),acorn=require('../tools/node_modules/acorn');const T=require('../tools/lib.cjs');
const IN=process.argv[2]||'../rdf/fetchback_s229_339.json',OUT=process.argv[3]||'target_340.json';
const d=JSON.parse(fs.readFileSync(IN));const P=JSON.parse(fs.readFileSync(__dirname+'/chk340.json'));
const rd=f=>fs.readFileSync(__dirname+'/'+f,'utf8');
const once=(s,a,b,tag)=>{const k=s.split(a).length-1;if(k!==1)throw new Error(tag+' count '+k);return s.replace(a,()=>b);};
const touched=[];
for(const n of d.nodes){if(n.name==='Shared Library')continue;const c=n.parameters.jsCode;if(!c||!c.includes(P.A1))continue;let s=c;
 for(const k of ['1','2','3','4'])s=once(s,P['A'+k],P['B'+k],n.name+' A'+k);n.parameters.jsCode=s;touched.push(n.name);}
// Shared Library: same four edits on its lines
const U=T.unpack(d);const L=U.L,M=U.M;const li=i=>{const x=L.findIndex(l=>l.includes(i));if(x<0||L.filter(l=>l.includes(i)).length!==1)throw new Error('lib '+i.slice(0,40));return x;};
{let i=li(P.A1);L[i]=once(L[i],P.A1,P.B1,'lib1');i=li(P.A2.replace(/\n$/,''));L[i]=once(L[i],P.A2.replace(/\n$/,''),P.B2.replace(/\n$/,''),'lib2');i=li(P.A3);L[i]=once(L[i],P.A3,P.B3,'lib3');
 const [a4a,a4b]=P.A4.split('\n'),[b4a,b4b]=P.B4.split('\n');i=li(a4a);if(L[i+1]!==a4b)throw new Error('lib4 next');L[i]=once(L[i],a4a,b4a,'lib4a');L[i+1]=b4b;}
const ch=[];for(const k of Object.keys(M)){const n2=T.rb(L,M[k]).length;if(n2!==M[k].n){ch.push(k);M[k].n=n2;}}
const LJ=JSON.stringify(L);const lsha=cr.createHash('sha256').update(LJ).digest('hex').slice(0,16);
const h2=U.hdr.replace(/library sha [0-9a-f]{16}, (\d+) lines/,()=>'library sha '+lsha+', '+L.length+' lines');if(h2===U.hdr)throw new Error('hdr');
const sl=d.nodes.find(n=>n.name==='Shared Library');sl.parameters.jsCode=h2+'\n/*LIB*/'+LJ+'\n/*MAP*/'+JSON.stringify(M)+U.tail;touched.push('Shared Library');
// L2 Count Plan: Part A decisions and Part B trial
const cp=d.nodes.find(n=>n.name==='L2 Count Plan');let c=cp.parameters.jsCode;
c=once(c,'const tags=l2EnglishPass2024(L2C.check(S.l2_tags||[],ow,lex,[...read]),read);',rd('e340.js').trim()+'\nconst tags=l2EnglishPass2024(L2C.check(S.l2_tags||[],ow,lex,[...read],__E340?{ok:__E340.ok,eng:__E340.eng}:null),read);','cp check');
c=once(c,'l2_trial:__L2T329}}]','l2_trial:__L2T329,...(__E340?{e340:__E340}:{})}}]','cp ret');cp.parameters.jsCode=c;
// Build Save Body: AUDIT v57
const bs=d.nodes.find(n=>n.name==='Build Save Body');bs.parameters.jsCode=once(bs.parameters.jsCode,".]');}} /* pkgL2T ASK 329 */",".]');}} /* pkgL2T ASK 329 */"+rd('bsb340.js').trimEnd(),'bsb');touched.push('Build Save Body');
// Format Markdown: section
const fm=d.nodes.find(n=>n.name==='Format Markdown');fm.parameters.jsCode=once(fm.parameters.jsCode,"} catch (e) {} /* pkgL2T ASK 329 */\n","} catch (e) {} /* pkgL2T ASK 329 */\n"+rd('fm340.js').trim()+'\n','fm');touched.push('Format Markdown');
// new nodes
const lx=d.nodes.find(n=>n.name==='L2 Lexicon');const cpc=cp.parameters.jsCode;const a=cpc.indexOf('const L2C=(()=>{'),b=cpc.indexOf("const S=$('Citation Scan')");if(a<0||b<a)throw new Error('L2C block');
const id=s=>{const h=cr.createHash('sha256').update('ask340 '+s).digest('hex');return h.slice(0,8)+'-'+h.slice(8,12)+'-5'+h.slice(13,16)+'-a'+h.slice(17,20)+'-'+h.slice(20,32);};
const [x,y]=lx.position;
const GP={id:id('plan'),name:'L2 Gloss Plan',type:'n8n-nodes-base.code',typeVersion:2,position:[x+120,y+200],parameters:{jsCode:cpc.slice(a,b)+rd('gplan340.js').trim()}};
const GA={id:id('any'),name:'L2 Gloss Any',type:'n8n-nodes-base.if',typeVersion:2.2,position:[x+240,y+200],parameters:{conditions:{combinator:'and',conditions:[{id:'gloss-any-340',leftValue:'={{ $json.none !== true }}',operator:{operation:'true',singleValue:true,type:'boolean'},rightValue:''}],options:{caseSensitive:true,leftValue:'',typeValidation:'loose'}},options:{}}};
const GR={id:id('read'),name:'L2 Gloss Read',type:'n8n-nodes-base.httpRequest',typeVersion:4.3,alwaysOutputData:true,retryOnFail:true,maxTries:2,waitBetweenTries:3000,onError:'continueRegularOutput',position:[x+360,y+200],
 parameters:{url:'={{ $json.url }}',authentication:'genericCredentialType',genericAuthType:'httpHeaderAuth',sendHeaders:true,headerParameters:{parameters:[{name:'Prefer',value:"={{ $json.prefer || '' }}"}]},options:{timeout:30000,response:{response:{fullResponse:true,neverError:true,responseFormat:'json'}}}},credentials:JSON.parse(JSON.stringify(lx.credentials))};
d.nodes.push(GP,GA,GR);
const C=d.connections;const lc=C['L2 Lexicon'].main;if(JSON.stringify(lc)!==JSON.stringify([[{node:'L2 Count Plan',type:'main',index:0}]]))throw new Error('L2 Lexicon edges '+JSON.stringify(lc));
C['L2 Lexicon']={main:[[{node:'L2 Gloss Plan',type:'main',index:0}]]};C['L2 Gloss Plan']={main:[[{node:'L2 Gloss Any',type:'main',index:0}]]};
C['L2 Gloss Any']={main:[[{node:'L2 Gloss Read',type:'main',index:0}],[{node:'L2 Count Plan',type:'main',index:0}]]};C['L2 Gloss Read']={main:[[{node:'L2 Count Plan',type:'main',index:0}]]};
const PA={ecmaVersion:'latest',allowReturnOutsideFunction:true,allowAwaitOutsideFunction:true};
for(const k of Object.keys(M)){try{acorn.parse(T.rb(L,M[k]),PA);}catch(e){throw new Error('parse '+k+': '+e.message);}}
for(const n of d.nodes)if(n.parameters&&n.parameters.jsCode&&n.name!=='Shared Library'&&(touched.includes(n.name)||n.name==='L2 Gloss Plan')){try{acorn.parse(n.parameters.jsCode,PA);}catch(e){throw new Error('parse '+n.name+': '+e.message);}}
fs.writeFileSync(OUT,JSON.stringify(d));
console.log('copies of check edited',touched.filter(n=>!['Build Save Body','Format Markdown'].includes(n)).length,'| nodes touched',touched.length,'| new nodes 3 | MAP lengths changed',ch.length,'| lib sha',lsha,'| out sha',cr.createHash('sha256').update(fs.readFileSync(OUT)).digest('hex').slice(0,12));
