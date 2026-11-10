// W1 offline: pkgBRF (bare reference fix). In scoped mode REFP tests for a sentence break between the last book and a reference with
// T.slice(lastAt,m.index). When a capitalised non-book word stands before a bare reference ("So 1:18"), m.index is at that word, the
// slice ends before its capital, the break is missed, and the bare reference takes the previous book ("Deuteronomy 1:18", 34726).
// Fix: slice to HEAD.lastIndex (end of the match). Same change in every REFP copy (the Shared Library line and 33 node copies).
// usage: node pkgBRF/build.cjs <fetch-back> <out>
const fs=require('fs');const crypto=require('crypto');const [inF,outF]=process.argv.slice(2);
const REV=process.env.REV||'2';
// rev 1: slice to HEAD.lastIndex (the scoped sentence rule applied as written). rev 2: a bare reference takes the book of the last earlier
// "<Book> c:v" naming the same chapter and verse in the same text; otherwise the s114 rule is unchanged.
const OLD=REV==='1'?'SENT.test(T.slice(lastAt,m.index))':'const ctx=b||((sc',NEW=REV==='1'?'SENT.test(T.slice(lastAt,HEAD.lastIndex))':String.raw`const ctx=b||(T.slice(0,m.index).match(RegExp('\\b(?:'+BOOKS.join('|')+')(?= '+m[2]+':'+m[3]+'(?!\\d))','g'))||[]).pop()||((sc`;
let D=JSON.parse(fs.readFileSync(inF,'utf8'));const W=(D.data||D).workflow||(D.data||D);
const code=()=>W.nodes.reduce((t,n)=>t+((n.parameters&&n.parameters.jsCode)||'').length,0);const c0=code();let n=0,lib=0;
const rebuild=(stub,lib)=>{let i=stub.indexOf('\nreturn await new Function(');if(i<0)i=stub.indexOf('\nconst __e4h');return i;};
for(const x of W.nodes){const c=x.parameters&&x.parameters.jsCode;if(!c)continue;const k=c.split(OLD).length-1;if(!k)continue;if(k!==1)throw new Error('count '+k+' in '+x.name);
 if(x.name==='Shared Library'){const a=c.indexOf('\n/*LIB*/')+8,b=c.lastIndexOf('\n/*MAP*/'),e=c.lastIndexOf('\n/*END*/');const L=JSON.parse(c.slice(a,b)),M=JSON.parse(c.slice(b+8,e));
  const idx=L.map((l,i)=>l.includes(OLD)?i:-1).filter(i=>i>=0);if(idx.length!==1)throw new Error('lib lines '+idx);const i=idx[0];const d=NEW.length-OLD.length;L[i]=L[i].replace(OLD,NEW);
  const uses=Object.entries(M).filter(([nm,v])=>v.p.some(p=>p===i||(Array.isArray(p)&&typeof p[0]==='number'&&p[0]<=i&&i<=p[1])));for(const [,v] of uses)v.n+=d;
  const LJ=JSON.stringify(L);let nc=c.slice(0,a)+LJ+'\n/*MAP*/'+JSON.stringify(M)+c.slice(e);const sha=crypto.createHash('sha256').update(LJ).digest('hex').slice(0,16);
  nc=nc.replace(/library sha [0-9a-f]{16}, \d+ lines/,'library sha '+sha+', '+L.length+' lines');x.parameters.jsCode=nc;lib=uses.length;console.log('library line',i,'used by',uses.length,'stub nodes');}
 else{x.parameters.jsCode=c.replace(OLD,NEW);new Function('$','$input','return (async()=>{\n'+x.parameters.jsCode+'\n})');}n++;}
console.log('copies changed',n);console.log('SIZE (measured): code',c0,'->',code(),'=',(code()-c0>=0?'+':'')+(code()-c0),'; prompt text: none added');
fs.writeFileSync(outF,JSON.stringify(D));
