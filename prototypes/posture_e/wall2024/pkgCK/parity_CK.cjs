// pkgCK field parity: the live cureLines (pkgRC) and the reader-based cureLines (pkgCK/cureLines_new.js) on every corpus text, line by line.
// Lists each keyed line whose bucket or fields differ. Run from wall2024/: node pkgCK/parity_CK.cjs
const fs=require('fs');const s=fs.readFileSync('pkgRC/patched/Panel_Cure_Check.js','utf8');const N=fs.readFileSync('pkgCK/cureLines_new.js','utf8');
const head=s.slice(0,s.indexOf('function cureRecompute('));const mk=src=>new Function('$','$input',src+'\nreturn {cureLines,cureUnwrap,CURE_KEY};')(()=>{throw 0},null);
const A=mk(head);const i0=head.indexOf('function cureLines(');let d=0,j=head.indexOf('{',i0);for(;j<head.length;j++){if(head[j]=='{')d++;if(head[j]=='}'){d--;if(!d)break;}}
const B=mk(head.slice(0,i0)+N.trim()+head.slice(j+1));
const rows=fs.readFileSync('corpus/texts.jsonl','utf8').split('\n').filter(Boolean).map(JSON.parse);const seen=new Set();const diff=[];let keyed=0;const tal={};
const flat=o=>Object.entries(o).filter(([k])=>k!=='prose').flatMap(([k,v])=>v.map(x=>k+' '+JSON.stringify(x)));
for(const r of rows){const T=A.cureUnwrap(r.text);for(const raw of String(T||'').split('\n')){const l=raw.trim().replace(/^[*`]+|[*`]+$/g,'').trim();if(!l||!A.CURE_KEY.test(l)||seen.has(l))continue;seen.add(l);keyed++;
 const a=flat(A.cureLines(l)),b=flat(B.cureLines(l));const k=l.match(A.CURE_KEY)[1];tal[k]=(tal[k]||0)+1;if(JSON.stringify(a)!==JSON.stringify(b))diff.push({k,run:r.run,seat:r.seat,src:r.src,l,a,b});}}
console.log('distinct keyed lines '+keyed+' '+JSON.stringify(tal)+'; differ '+diff.length);
for(const x of diff){console.log('\n['+x.k+'] '+x.run+' '+x.seat+' '+x.src+' :: '+x.l.slice(0,220));console.log('   old: '+x.a.join(' / ').slice(0,400));console.log('   new: '+x.b.join(' / ').slice(0,400));}
