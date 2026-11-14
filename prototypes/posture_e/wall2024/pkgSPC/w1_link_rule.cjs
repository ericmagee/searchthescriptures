// W1 grade aid for ASK 279 pkgSPC: link-phrase tightening. Run from a dir holding target.json (pkgSPC build), tags.json (t.cjs on rounds8.json), ow60.json, spc.js.
const fs=require('fs');const base=fs.readFileSync('spc.js','utf8').trim();
const c=require('./target.json').nodes.find(n=>n.name==='L2 Count Plan').parameters.jsCode;const nx=c.indexOf("const S=$('Citation Scan')");
const L2C=new Function(c.slice(0,nx)+';return L2C;')();
const tags=require('./tags.json'),ow=require('./ow60.json');const RD=[...new Set(ow.map(r=>r.book+' '+r.chapter+':'+r.verse))];
let s=base;
const LINK="const __lk=(tl,k)=>{const cv=k.replace(/^.*\\s(\\d+:\\d+)$/,'$1');const j=tl.indexOf(cv);if(j<0)return false;let pre=tl.slice(0,j).replace(/(?:[1-3]\\s?)?[A-Z][a-z]+(?:\\s+of\\s+[A-Z][a-z]+)?\\.?\\s*$/,'');if(/\\bnot\\b/.test(tl.slice(0,j)))return false;return /\\b(?:stands?|standing|is|are|appears?|occurs?|used|word|verb|noun|form)\\s+(?:(?:the\\s+)?(?:word|verb|noun|form)\\s+)?(?:in|at|of)\\s*$/i.test(pre)||/^\\s*(?:in|at)\\s*$/i.test(pre)||/\\S\\s+(?:and|,)\\s*(?:(?:of|in|at)\\s+)?$/.test(pre)&&__lk.prev;};";
s=s.replace("const __SPC=(tags,ow,lex)=>{try{",LINK+"const __SPC=(tags,ow,lex)=>{try{");
s=s.replace("for(const k of CR){if(hit.includes(k))continue;","__lk.prev=false;const LKD=new Set();for(const k of CR){const ok=__lk(tail,k);__lk.prev=ok;if(ok)LKD.add(k);}for(const k of CR){if(hit.includes(k))continue;if(!LKD.has(k))continue;");
const SPC=new Function('L2C',s+';return __SPC;')(L2C);
const ck=L2C.check(JSON.parse(JSON.stringify(tags)),ow,[],RD);SPC(ck,ow,[]);const P=ck.filter(t=>t.place);
console.log('flagged',P.length);for(const t of P)console.log((t.id||'').slice(0,8),t.round,'|',t.seg.slice(0,220).replace(/\n/g,' '),'\n   =>',t.place.join(' ; '));
