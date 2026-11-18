// ASK 409 plants (W3 8738 item 4, rev 2 8741). Offline. node a409/plants.cjs
const fs=require('fs'),cr=require('crypto');const T=require('../tools/lib.cjs');
const rd=p=>{let d=JSON.parse(fs.readFileSync(p));return d.data||d;};
const OLD=rd('rdf/fetchback_w408.json'),NEW=rd('a409/t409.json');
const REF=T.rb(T.unpack(OLD).L,{n:8133,p:[[490,511]]});
const md5=s=>cr.createHash('md5').update(s).digest('hex');
const inl=new Function(REF+'\nreturn REFP;')();
let out=[];const say=s=>{out.push(s);console.log(s);};
// 4a: the rebuilt block equals the old inline block
const U=T.unpack(NEW);const RB=T.rb(U.L,U.M.REFP);say('4a rebuilt '+RB.length+' md5 '+md5(RB)+' equal to inline: '+(RB===REF));
// rounds of the last ten stored runs
const D=JSON.parse(fs.readFileSync('a405/debates.json')).sort((a,b)=>String(a.created_at).localeCompare(String(b.created_at))).slice(-10);
const texts=[];for(const r of D)for(const k of ['claude_r1','engine_r1','claude_r2','engine_r2','engine_r3','challenger_r3','defender_r4','challenger_r4','synthesis'])if(r[k])texts.push(String(r[k]));
say('rounds: '+texts.length+' texts from 10 runs ('+D[0].run_token+' .. '+D[D.length-1].run_token+')');
const probe=R=>{const o=[];for(const t of texts){o.push(JSON.stringify(R.parse(t)));o.push(JSON.stringify(R.parse(t,{scoped:true})));o.push(JSON.stringify(R.keys(t)));for(const l of t.split('\n').slice(0,400)){const b=R.book(l);if(b!==undefined)o.push(JSON.stringify(b));}}o.push(JSON.stringify(R.BK),JSON.stringify(R.BOOKS));return md5(o.join('\u0001'));};
const H0=probe(inl);say('inline probe md5 '+H0);
// 4b: each of the 30 loader nodes, run its own loader text against the new library
const lib=NEW.nodes.find(n=>n.name==='Shared Library');let ok=0,bad=[];const ldr=new Set();
for(const n of NEW.nodes){const j=n.parameters&&n.parameters.jsCode;if(typeof j!=='string')continue;const i=j.indexOf("const REFP=(T=>{");if(i<0)continue;const e=j.indexOf("*/",j.indexOf("/* ASK 409:",i))+2;const L=j.slice(i,e);ldr.add(md5(L));
 const R=new Function('$',L+'\nreturn REFP;')(x=>{if(x!=='Shared Library')throw new Error('read '+x);return {params:lib.parameters};});
 if(probe(R)===H0)ok++;else bad.push(n.name);}
say('4b loader nodes '+ok+' identical, '+bad.length+' differ'+(bad.length?': '+bad.join(', '):'')+'; loader texts: '+ldr.size);
// 4d: fail closed
const L1=[...NEW.nodes].find(n=>/const REFP=\(T=>\{/.test(n.parameters&&n.parameters.jsCode||'')).parameters.jsCode;const i=L1.indexOf("const REFP=(T=>{");const LD=L1.slice(i,L1.indexOf('*/',L1.indexOf('/* ASK 409:',i))+2);
const mk=M=>U.hdr+'\n/*LIB*/'+JSON.stringify(U.L)+'\n/*MAP*/'+JSON.stringify(M)+U.tail;
for(const [nm,M] of [['no REFP entry',(({REFP,...r})=>r)(U.M)],['wrong n',{...U.M,REFP:{n:8132,p:U.M.REFP.p}}],['wrong lines',{...U.M,REFP:{n:8133,p:[[491,512]]}}]]){
 try{new Function('$',LD+'\nreturn REFP;')(()=>({params:{jsCode:mk(M)}}));say('4d '+nm+': DID NOT THROW (FAIL)');}catch(e){say('4d '+nm+': throws "'+e.message+'"');}}
// D1 Build and C1 Build: removed text is exactly the block, and nothing else in the node names REFP
for(const nm of ['D1 Build','C1 Build']){const a=OLD.nodes.find(n=>n.name===nm).parameters.jsCode,b=NEW.nodes.find(n=>n.name===nm).parameters.jsCode;say(nm+': old minus block equals new: '+(a.replace(REF,'')===b)+'; REFP named after: '+/\bREFP\b/.test(b)+'; length '+a.length+' -> '+b.length);}
fs.writeFileSync('a409/plants_out.txt',out.join('\n')+'\n');
