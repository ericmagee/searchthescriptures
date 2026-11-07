// pkgKWA (W1, 11-07; W3 2942): K-W pronoun and standalone grants take the antecedent sentence.
// "I grant it." / "I grant that." had one-word bodies, so any NOT HELD reason holding "it" cured them (~25 distinct stored lines); after pkgKWC a standalone
// "I grant." raised nothing. Now, when only a pronoun (it, that, this, so, them, these, those) or nothing follows the verb and no words stand before it in
// its own sentence, the flagged line is the previous sentence plus the grant ("Mary is of David. I grant it."). The antecedent must end a sentence or hold a quoted proposition
// (33345: the press line MEANS [CR3] P5.1: "..."); otherwise (a heading, a label, the round start) no item (the number is kept). The NOT HELD runs drop a trailing pronoun after the verb before pkgKWC's tail rule, so the antecedent
// words alone (3+) also count. Runs are only added. Base: pkgLIB v9 full sources (pkgKWA/base_v9 = pkgLIB_v9/orig_stack: v8 + pkgL1Q2). Run from wall2024/.
const fs=require('fs');const crypto=require('crypto');const h=s=>crypto.createHash('sha256').update(s).digest('hex').slice(0,12);const B='pkgKWA/base_v9/';
const A1="if(!/[A-Za-z0-9]/.test(s.slice(m[0].length))){const ls2=Math.max(pre.lastIndexOf('\\n')+1,...[...pre.matchAll(/[.!?][\"\\u201d']?\\s+/g)].map(z=>z.index+z[0].length));const own=t.slice(ls2,m.index).replace(/[,;:\\s]*(?:which|as|that|this)?\\s*$/i,'');if(!/[A-Za-z0-9]/.test(own)){n++;continue;}s=(t.slice(ls2,m.index)+s).slice(0,220).trim();}";
const N1="if(/^\\s*(?:it|that|this|so|them|these|those)?\\s*[.!?]?[\"\\u201d']?\\s*$/i.test(s.slice(m[0].length))){const bnd=x=>Math.max(t.lastIndexOf('\\n',x-1)+1,...[...t.slice(0,x).matchAll(/[.!?][\"\\u201d']?\\s+/g)].map(z=>z.index+z[0].length));const ls2=bnd(m.index);const own=t.slice(ls2,m.index).replace(/[,;:\\s]*(?:which|as|that|this)?\\s*$/i,'');"
 +"if(/[A-Za-z0-9]/.test(own)){if(!/[A-Za-z0-9]/.test(s.slice(m[0].length)))s=(t.slice(ls2,m.index)+s).slice(0,220).trim();}"
 +"else{let q=ls2;while(q>0&&/\\s/.test(t[q-1]))q--;const pv=q>0?t.slice(bnd(q-1),q).trim():'';if(!/[A-Za-z0-9]/.test(pv)||!(/[.!?][\"\\u201d')]?$/.test(pv)||/\"[^\"]{3,}\"|\\u201c[^\\u201d]{3,}\\u201d/.test(pv))){n++;continue;}s=(pv+' '+s).slice(0,300).trim();} /* pkgKWA (W3 2942): a pronoun or standalone grant takes the antecedent sentence */}";
const A2="{let k=b0.length;if(k>=2&&/^(?:grant|concede|withdraw|drop)$/.test(b0[k-1])&&b0[k-2]==='i'){";
const N2="{let k=b0.length;if(k>=3&&/^(?:it|that|this|so|them|these|those)$/.test(b0[k-1])&&/^(?:grant|concede|withdraw|drop)$/.test(b0[k-2])&&b0[k-3]==='i')k--; /* pkgKWA: \"X. I grant it.\" */if(k>=2&&/^(?:grant|concede|withdraw|drop)$/.test(b0[k-1])&&b0[k-2]==='i'){";
const plan={};for(const f of fs.readdirSync(B).filter(f=>f.endsWith('.js'))){let s=fs.readFileSync(B+f,'utf8');const s0=s;
 const c1=s.split(A1).length-1;if(c1!==1)throw new Error(f+': A1 x '+c1);s=s.replace(A1,()=>N1);const c2=s.split(A2).length-1;if(c2>1)throw new Error(f+': A2 x '+c2);if(c2)s=s.replace(A2,()=>N2);
 fs.writeFileSync('pkgKWA/patched/'+f,s);plan[f]={base:h(s0),patched:h(s),runs_fix:!!c2};}
fs.writeFileSync('pkgKWA/patched.plan.json',JSON.stringify(plan,null,1));console.log(Object.keys(plan).length,'nodes,',Object.values(plan).filter(x=>x.runs_fix).length,'with the runs fix');
