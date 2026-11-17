// ASK 349 checks: syntax of every touched source, runtime text of PART2 and __METHOD_TOP copies, the notice in templates and enforcer SYS.
const fs=require('fs'),acorn=require('../tools/node_modules/acorn');const T=require('../tools/lib.cjs');
const NOTICE="PLEASE BE AWARE: This debate is part of a research project that tests what the King James text itself states. For the integrity of the test: 1. Do not bring in any understanding of the Bible that you held before this debate; use only what the two debaters placed in the record. 2. Read each verse together with every other verse either side quoted on the same subject, precept upon precept, line upon line (Isaiah 28:10). A verse that seems unclear when read alone does not overrule that collective witness, for either side's link. 3. Where a lexicon gloss differs from how the King James text renders the word, the King James text governs.";
const C16="### Commitment 16. PLEASE BE AWARE:\n"+NOTICE.slice('PLEASE BE AWARE: '.length);
const sources=f=>{const w=JSON.parse(fs.readFileSync(f));const out={};for(const n of w.nodes){const c=n.parameters&&n.parameters.jsCode;if(typeof c==='string'&&n.name!=='Shared Library')out[n.name]=c;}
 const U=T.unpack(w);for(const k of Object.keys(U.M))out['LIB:'+k]=T.rb(U.L,U.M[k]);return out;};
const lit=(src,decl)=>{const out=[];let i=0;while((i=src.indexOf(decl+'"',i))>=0){let j=i+decl.length+1;let s='';while(src[j]!=='"'){if(src[j]==='\\'){s+=src[j]+src[j+1];j+=2;}else s+=src[j++];}out.push(eval('"'+s+'"'));i=j;}return out;};
let fails=0;const ok=(n,c,i)=>{console.log((c?'ok   ':'FAIL ')+n+(i?' :: '+i:''));if(!c)fails++;};
const L=sources('live.json'),G=sources('target_349.json');
const changed=Object.keys(G).filter(k=>G[k]!==L[k]);console.log('changed sources:',changed.length,changed.filter(k=>!k.startsWith('LIB:')).join(', '));
for(const k of changed){try{acorn.parse('(async function(){'+G[k]+'\n})',{ecmaVersion:'latest'});}catch(e){ok('syntax '+k,false,e.message);}}
ok('syntax of every changed source',fails===0);
const P2=[],MT=[];for(const k of Object.keys(G)){lit(G[k],'const PART2=').forEach(x=>P2.push([k,x]));lit(G[k],'__METHOD_TOP=').forEach(x=>MT.push([k,x]));}
const uniq=a=>[...new Set(a.map(x=>x[1]))];
ok('PART2 runtime copies identical',uniq(P2).length===1,P2.length+' copies in '+[...new Set(P2.map(x=>x[0]))].length+' sources');
ok('PART2 holds Commitment 16 once, after 15',(()=>{const p=uniq(P2)[0];return p.split(C16).length===2&&p.indexOf('### Commitment 15.')<p.indexOf(C16)&&p.indexOf(C16)<p.indexOf('A sentence the system marks VOID');})());
ok('PART2 heads 1..16',(()=>{const h=[...uniq(P2)[0].matchAll(/^### Commitment (\d+)\. /gm)].map(m=>+m[1]);return JSON.stringify(h)===JSON.stringify([...Array(16)].map((_,i)=>i+1));})());
ok('PART2 live minus Commitment 16 equals target',(()=>{const l=[];Object.keys(L).forEach(k=>lit(L[k],'const PART2=').forEach(x=>l.push(x)));return [...new Set(l)].length===1&&[...new Set(l)][0]===uniq(P2)[0].replace('\n\n'+C16,'');})());
ok('__METHOD_TOP copies identical and start with the title then the notice',uniq(MT).length===1&&uniq(MT)[0].startsWith('THE METHOD (Isaiah 28:10), the framework of this debate and of your judgment:\n'+NOTICE+'\nThe method.'),MT.length+' copies');
const sqN=NOTICE.replace(/'/g,"\\'");
const tpl=Object.keys(G).filter(k=>G[k].includes("\\n\\n"+sqN+"\\n\\nThis reply is not a judgment"));ok('notice before the reply form in send-back and gate prompts',tpl.length>0,tpl.join(', '));
const ens=Object.keys(G).filter(k=>G[k].includes("You do not judge the debate. "+sqN+"'"));ok('notice in enforcer SYS',ens.length>0,ens.join(', '));
console.log(fails?'FAILS '+fails:'ALL OK');
