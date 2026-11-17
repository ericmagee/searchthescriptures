// K-V negation guard build (run 37891 Root 3; design rev 3 passed W1, W2 Wall 7394). Library lines 987, 1024, 2187.
const fs=require('fs');const {unpack,rb}=require('../../tools/lib.cjs');
const W='(?:[A-Za-z]+\\s+){0,3}';const N='(?:premise|charge|link)s?';
const ALTS=['\\b(?:not|never)\\s+(?:be\\s+|been\\s+|ruled\\s+)?VOID\\b',
 '\\bno\\s+'+W+N+'(?:\\s+of\\s+the\\s+[A-Za-z]+)?\\s+(?:is|are|was|were|stands?)\\s+(?:ruled\\s+)?VOID\\b',
 '\\bnone\\s+(?:of\\s+(?:the\\s+|them\\s*)'+W+'(?:'+N+'\\s+)?)?(?:is|are|was|were)\\s+(?:ruled\\s+)?VOID\\b',
 '\\b(?:rule|ruled|rules|find|finds|found)\\s+no\\s+'+W+N+'\\s+VOID\\b',
 '\\bneither\\b[^.;:]{0,60}?\\b(?:is|are)\\s+VOID\\b',
 '\\bnothing\\s+(?:is\\s+|was\\s+)?(?:ruled\\s+)?VOID\\b'];
const EXC='(?!\\s*,?\\s*(?:except|but|save|besides|other\\s+than)\\s+(?:for\\s+)?(?:premises?\\s+)?\\d+(?:\\s*(?:,|and|or)\\s*(?:premises?\\s+)?\\d+)*\\s*(?:[.;:]|$))';
const NEG=new RegExp(ALTS.map(a=>'(?:'+a+')'+EXC).join('|'),'gim');
const LIT='/'+NEG.source+'/gim';
const negd=x=>'!/\\bVOID\\b/.test(String('+x+').replace('+LIT+',\' \'))';
const w=JSON.parse(fs.readFileSync('live.json'));const u=unpack(w);
const OLD987="/\\b(?:not|never)\\s+(?:be\\s+)?VOID\\b|\\bno\\s+(?:premise|charge|link)s?\\s+(?:is|are|was|were)\\s+VOID\\b/i.test(s)";
const OLD3="/\\b(?:not|never)\\s+(?:be\\s+)?VOID\\b|\\bno\\s+(?:premise|charge|link)s?\\s+(?:is|are|was|were)\\s+VOID\\b|\\bnone\\s+(?:is|are|of\\s+them\\s+(?:is|are))\\s+VOID\\b/i.test(";
const L=u.L.slice();const ed=[[987,OLD987,negd('s')],[1024,OLD3+'seg)',negd('seg')],[2187,OLD3+'s)',negd('s')]];
for(const [i,o,n] of ed){const c=L[i].split(o).length-1;if(c!==1)throw new Error('line '+i+' anchor count '+c);L[i]=L[i].replace(o,()=>n);console.log('line',i,'changed');}
const M=JSON.parse(JSON.stringify(u.M));const fixed=[];for(const k in M){const len=rb(L,M[k]).length;if(len!==M[k].n){fixed.push(k+' '+M[k].n+'->'+len);M[k].n=len;}}
const T=u.T;const iL=T.indexOf('\n/*LIB*/'),iM=T.lastIndexOf('\n/*MAP*/'),iE=T.lastIndexOf('\n/*END*/');
if(JSON.stringify(u.L)!==T.slice(iL+8,iM)||JSON.stringify(u.M)!==T.slice(iM+8,iE))throw new Error('LIB/MAP serialization differs; stop');
w.nodes.find(n=>n.name==='Shared Library').parameters.jsCode=T.slice(0,iL+8)+JSON.stringify(L)+T.slice(iM,iM+8)+JSON.stringify(M)+T.slice(iE);
fs.writeFileSync('target_kv.json',JSON.stringify(w));
console.log('MAP n updated',fixed.length);fixed.forEach(x=>console.log('  '+x));
