// ASK 654 build b2 (W4): parts 1, 1b, 1c, 1d and 2 of plan rev 9 (9e3f9f23). b2 = b1 with the FORM line of rev 9 ("another passage", operator 16:05 CST "Both places") and part 1d in D4 Build. node b654.cjs live.json out.json
// Part 1: block A (plan lines 25-29 and 32, copied character for character) appended to GUARDHOLD (Oracle prompt, Init with Guards).
// Part 1c (operator 15:48 CST, "Add the five words"): the ASK 408 line gains "after the pressed verse's own layers".
// Part 1b: two replacements in TEXTPROOF's ONE-VERSE RESTRICTION paragraph.
// Part 2: Shared Library PLY module + MAP entry "PRESS LAYERS"; D3B Build and D4B Build join it to the one existing send-back (Oracle seat only).
const fs=require('fs');const [,,BE,OUT]=process.argv;const E=JSON.parse(fs.readFileSync(BE,'utf8'));const D=__dirname+'/';
const one=(s,a,b,w)=>{if(s.split(a).length!==2)throw new Error('ASK 654 build: anchor not found exactly once: '+w);return s.replace(a,()=>b);};
const node=n=>{const x=E.nodes.find(k=>k.name===n);if(!x)throw new Error('no node '+n);return x;};
// ---- block A, from the plan file
const PL=fs.readFileSync('/mnt/project-files/ask654/w3/plan654.md','utf8').split('\n');
const strip=s=>{if(s[0]!=='"'||s[s.length-1]!=='"')throw new Error('block A line not quoted as expected');return s.slice(1,-1);};
const lay=PL.slice(24,29).join('\n');const form=PL[31];
if(!lay.startsWith('"ANSWER AT THE PRESSED VERSE.')||!lay.endsWith('L4 must have two supporting layers."')||!form.startsWith('"FORM. Head each answer'))throw new Error('block A lines moved in the plan');
const A=strip(lay)+'\n'+strip(form);fs.writeFileSync(D+'blockA.txt',A);
// ---- part 1 and 1b: Init with Guards
const ig=node('Init with Guards');let s=ig.parameters.jsCode;
const esc=t=>JSON.stringify(t).slice(1,-1);
s=one(s,'do not drop it.";\nconst TEXTPROOF=','do not drop it.'+esc('\n\n'+A)+'";\nconst TEXTPROOF=','GUARDHOLD end');
s=one(s,'then answer the pressed verse from the chain: quote it whole with the rows that join it, each tagged with its layer.','then take the pressed verse itself through the four layers.','1b first');
s=one(s,'A restriction named and not answered from the chain leaves the press unanswered.','A restriction named and not answered through the layers leaves the press unanswered.','1b second');
s=one(s,'or challenges the union, answer from the DAVIDIC seed rows','or challenges the union, answer, after the pressed verse\'s own layers, from the DAVIDIC seed rows','1c ASK 408 order clause');
ig.parameters.jsCode=s;
// ---- part 2: Shared Library
const n0=node('Shared Library');const T=n0.parameters.jsCode;
const P={head:T.slice(0,T.indexOf('\n/*LIB*/')),L:JSON.parse(T.slice(T.indexOf('\n/*LIB*/')+8,T.lastIndexOf('\n/*MAP*/'))),M:JSON.parse(T.slice(T.lastIndexOf('\n/*MAP*/')+8,T.lastIndexOf('\n/*END*/')))};
const tail=T.slice(T.lastIndexOf('\n/*END*/')+8);
if(P.M['PRESS LAYERS'])throw new Error('PRESS LAYERS already present');
const add=fs.readFileSync(D+'ply_lines.js','utf8').replace(/\n$/,'').split('\n');const a0=P.L.length;P.L.push(...add);
P.M['PRESS LAYERS']={n:0,p:P.M['PRESS LIST'].p.concat([[a0,a0+add.length-1]])};
const reb=p=>p.map(x=>typeof x==='number'?P.L[x]:typeof x[0]==='string'?x[0]:P.L.slice(x[0],x[1]+1).join('\n')).join('\n');
const touched=[];for(const [k,v] of Object.entries(P.M)){if(!v||!Array.isArray(v.p))continue;const m=reb(v.p).length;if(m!==v.n){touched.push(k);v.n=m;}}
n0.parameters.jsCode=P.head+'\n/*LIB*/'+JSON.stringify(P.L)+'\n/*MAP*/'+JSON.stringify(P.M)+'\n/*END*/'+tail;
// ---- part 2: D3B Build, D4B Build
const LOAD="const PLY=(T=>{const L=JSON.parse(T.slice(T.indexOf('\\n/*LIB*/')+8,T.lastIndexOf('\\n/*MAP*/')));const M=JSON.parse(T.slice(T.lastIndexOf('\\n/*MAP*/')+8,T.lastIndexOf('\\n/*END*/')))['PRESS LAYERS'];if(!M)throw new Error('ASK 654: the Shared Library holds no PRESS LAYERS entry');const S=M.p.map(e=>typeof e==='number'?L[e]:typeof e[0]==='string'?e[0]:L.slice(e[0],e[1]+1).join('\\n')).join('\\n');if(S.length!==M.n)throw new Error('ASK 654: rebuilt PRESS LAYERS is '+S.length+', expected '+M.n);return new Function(S+'\\nreturn PLY;')();})($('Shared Library').params.jsCode); /* ASK 654 */\n";
const ORA="((($('Init Seats').first().json.defender||{}).profile)==='oracle')";
// D4B
{const d=node('D4B Build');let c=d.parameters.jsCode;
 c=one(c,'const X=$(\'D4 Extract\').first().json;',LOAD+'const X=$(\'D4 Extract\').first().json;','D4B X');
 c=one(c,' /* ASK 628: pressed verses with no ANSWER line in the Oracle close */\n',' /* ASK 628: pressed verses with no ANSWER line in the Oracle close */\nlet __ply=null;try{if('+ORA+'){const o=__RD(X.raw);__ply=PLY.check([o.DR1,o.DR2,o.DR3],X.raw,o);__ply.items=__ply.items.filter(i=>!(i.lacks.length===1&&i.lacks[0]===\'B\'&&__un.includes(i.ref)));}}catch(e){__ply={error:String(e&&e.message||e).slice(0,200),items:[]};}const __pn=__ply&&__ply.items?__ply.items.length:0; /* ASK 654: pressed verses short of their layers (a verse with no ANSWER line is left to ASK 628) */\n','D4B after __un');
 c=one(c,'if(c.pass&&!__ln&&!__un.length)return','if(c.pass&&!__ln&&!__un.length&&!__pn)return','D4B pass');
 c=one(c,"Return the whole round; this is the only request of its kind.':''].filter(Boolean)","Return the whole round; this is the only request of its kind.':'',__pn?PLY.note(__ply.items):''].filter(Boolean)",'D4B note');
 c=one(c,"' pressed verse(s) with no ANSWER line',press_open:__un,","' pressed verse(s) with no ANSWER line; '+__pn+' pressed verse(s) short of their layers',press_open:__un,press_layers:__ply,",'D4B why');
 d.parameters.jsCode=c;}
// D3B
{const d=node('D3B Build');let c=d.parameters.jsCode;
 c=one(c,'const X=$(\'D3 Extract\').first().json;',LOAD+'const X=$(\'D3 Extract\').first().json;','D3B X');
 const L3=c.split('\n').findIndex(l=>l.startsWith('try{__lc=LAY.check('));if(L3<0)throw new Error('D3B LAY line');
 const cl=c.split('\n');cl.splice(L3+1,0,'let __ply=null;try{if('+ORA+'){const o=__RD(X.raw);__ply=PLY.check([o.DR1,o.DR2],X.raw,o);}}catch(e){__ply={error:String(e&&e.message||e).slice(0,200),items:[]};}const __pn=__ply&&__ply.items?__ply.items.length:0; /* ASK 654: pressed verses short of their layers, link round */');c=cl.join('\n');
 c=one(c,'if(c.pass&&!__ln)return','if(c.pass&&!__ln&&!__pn)return','D3B pass');
 c=one(c,"const note=[__ln?LAY.note(__lc,!c.pass):'',c.pass?'':BAR.note(c)].filter(Boolean)","const note=[__ln?LAY.note(__lc,!c.pass):'',c.pass?'':BAR.note(c),__pn?PLY.note(__ply.items):''].filter(Boolean)",'D3B note');
 c=one(c,"' layer point(s)',note,","' layer point(s); '+__pn+' pressed verse(s) short of their layers',press_layers:__ply,note,",'D3B why');
 d.parameters.jsCode=c;}
// ---- part 1d: D4 Build close message (Oracle-defender branch): the refresh (first five lines of block A) then the rev 9 sentence, replacing the live sentence
{const d=node('D4 Build');let c=d.parameters.jsCode;
 const m=PL.join('\n').match(/\(ii\) THE SENTENCE: "(Under each ANSWER line take[^\n]*?naming the pressed word\.)"/);if(!m)throw new Error('1d sentence not found in plan');
 const refresh=A.split('\n').slice(0,5).join('\n');const NEW='\n\n'+refresh+'\n'+m[1];fs.writeFileSync(D+'close1d.txt',NEW);
 const LIVE=" Under each ANSWER line write the four layers, each on its own line with its tag: [L1] the pressed verse, with its book, chapter and verse written again at the start of that line and its words quoted; [L2] each word of that verse the challenger pressed, by its Strong\\'s number from the [L2] SHEET, with its meaning; [L3] a further verse quoted with its reference; [L4] the inference from those layers that shows the fit with D<n>, naming the pressed word.";
 const sq=t=>t.replace(/\\/g,'\\\\').replace(/'/g,"\\'").replace(/\n/g,'\\n');
 c=one(c,"?'"+LIVE+"':'')","?'"+sq(NEW)+"':'')",'1d close sentence');d.parameters.jsCode=c;}
fs.writeFileSync(OUT,JSON.stringify(E));console.log('ASK 654 built:',OUT,'| block A chars',A.length,'| PLY lines',a0+'-'+(a0+add.length-1),'| MAP re-measured:',touched.join(', '));
