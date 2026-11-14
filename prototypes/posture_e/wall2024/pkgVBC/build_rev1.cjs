// ASK 281 (pkgVBC): a book-less "c:v" near an [L2] tag binds to the one book whose full references in the tag's paragraph (else block) name chapter c. Citation Scan only.
const fs=require('fs');const [, , fin, fout]=process.argv;const raw=JSON.parse(fs.readFileSync(fin,'utf8'));const W=(raw.data||raw).workflow||(raw.data||raw);
const n=W.nodes.find(x=>x.name==='Citation Scan');let c=n.parameters.jsCode;const L0=c.length;
const A1='/* pkgVBN, ASK 270';
const A2='.concat(__bv))];const ap=';
if(c.split(A1).length!==2||c.split(A2).length!==2)throw new Error('anchor');
const INS="const __cvb=(()=>{try{const pa=t.lastIndexOf('\\n\\n',i),pb=t.indexOf('\\n\\n',i);const para=t.slice(pa<0?0:pa,pb<0?t.length:pb);const got=new Set(refsIn(para).concat(refsIn(blk)));const out=[];for(const m of para.matchAll(/(?<![\\w:.])(\\d{1,3}):(\\d{1,3})\\b/g)){const pre=para.slice(Math.max(0,m.index-24),m.index);if(/(?:[1-3]\\s?)?[A-Z][a-z]+\\.?\\s*$/.test(pre))continue;const C=m[1],V=m[2];let bk=[];for(const src of [refsIn(para),refsIn(blk)]){bk=[...new Set(src.filter(k=>new RegExp('\\\\s'+C+':\\\\d+(?:[-–]\\\\d+)?$').test(k)).map(k=>k.replace(/\\s+\\d+:\\d+(?:[-–]\\d+)?$/,'')))];if(bk.length)break;}if(bk.length!==1)continue;const key=bk[0]+' '+C+':'+V;if(!got.has(key))out.push(key);}return [...new Set(out)];}catch(e){return [];}})(); /* pkgVBC, ASK 281: a book-less c:v in the tag's paragraph binds only when exactly one book among the paragraph's (else the block's) full references names chapter c; the lexicon map still decides */";
c=c.replace(A1,()=>INS+A1).replace(A2,()=>'.concat(__bv).concat(__cvb))];const ap=');
n.parameters.jsCode=c;console.log('Citation Scan',L0,'->',c.length);fs.writeFileSync(fout,JSON.stringify(W));
