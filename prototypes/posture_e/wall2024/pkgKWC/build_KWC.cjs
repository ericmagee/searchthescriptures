// pkgKWC (W1, 11-07; W3 grade_33430, HIGH): a K-W grant with no object. 33430 [CR2] "Jesus is of David's flesh, which I grant." was flagged as "I grant."
// (the sentence cut starts at the verb), so the body was empty and no NOT HELD reason could quote it; sol and grok were both UNCURED (sol not counted).
// (1) kwLines421 (22 library nodes): when nothing but punctuation follows the verb, the flagged sentence is the whole sentence that holds it; if no words
//     stand before the verb (after a trailing "which", "as", "that" or "this"), no K-W item is raised (the number is kept, as pkgKW does).
// (2) the K-W NOT HELD runs (19 nodes): a body ending "[which|as|that|this] I grant|concede|withdraw|drop" ALSO takes the runs of the words before it,
//     when 3 or more remain. Runs are only added (monotone), like pkgKWT. Base: pkgLIB v7 full sources (pkgKWC/base_v7). Run from wall2024/.
const fs=require('fs');const crypto=require('crypto');const h=s=>crypto.createHash('sha256').update(s).digest('hex').slice(0,12);const B='pkgKWC/base_v7/';
const A1="const s=t.slice(m.index).split(/(?<=[.!?])\\s|\\n/)[0].slice(0,220).trim();n++;";
const N1="let s=t.slice(m.index).split(/(?<=[.!?])\\s|\\n/)[0].slice(0,220).trim();if(!/[A-Za-z0-9]/.test(s.slice(m[0].length))){const ls2=Math.max(pre.lastIndexOf('\\n')+1,...[...pre.matchAll(/[.!?][\"\\u201d']?\\s+/g)].map(z=>z.index+z[0].length));const own=t.slice(ls2,m.index).replace(/[,;:\\s]*(?:which|as|that|this)?\\s*$/i,'');if(!/[A-Za-z0-9]/.test(own)){n++;continue;}s=(t.slice(ls2,m.index)+s).slice(0,220).trim();} /* pkgKWC (1): a grant with no object takes its whole sentence (33430 \"..., which I grant.\") */n++;";
const A2="if(b0.length>=4&&/^(?:that|how|whether)$/.test(b0[0]))r.push(...__rn0(b0.slice(1)));return r;};";
const N2="if(b0.length>=4&&/^(?:that|how|whether)$/.test(b0[0]))r.push(...__rn0(b0.slice(1)));{let k=b0.length;if(k>=2&&/^(?:grant|concede|withdraw|drop)$/.test(b0[k-1])&&b0[k-2]==='i'){k-=2;if(k>0&&/^(?:which|as|that|this)$/.test(b0[k-1]))k--;if(k>=3)r.push(...__rn0(b0.slice(0,k)));}} /* pkgKWC (2): \"X, which I grant\" also takes X */return r;};";
const plan={};for(const f of fs.readdirSync(B).filter(f=>f.endsWith('.js'))){let s=fs.readFileSync(B+f,'utf8');const s0=s;
 const c1=s.split(A1).length-1;if(c1!==1)throw new Error(f+': A1 x '+c1);s=s.replace(A1,()=>N1);const c2=s.split(A2).length-1;if(c2>1)throw new Error(f+': A2 x '+c2);if(c2)s=s.replace(A2,()=>N2);
 fs.writeFileSync('pkgKWC/patched/'+f,s);plan[f]={base:h(s0),patched:h(s),runs_fix:!!c2};console.log(f.padEnd(34),h(s0),'->',h(s),c2?'(1)+(2)':'(1)');}
fs.writeFileSync('pkgKWC/patched.plan.json',JSON.stringify(plan,null,1));console.log(Object.keys(plan).length,'nodes');
