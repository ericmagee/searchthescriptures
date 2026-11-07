// pkgUNXA (W3 2721, 2727): K-UNX-A, two grounds K-UNX exempted outright, now checked. TRIAL, side-neutral, raised as rule K-UNX with a:'ASSUMES'|'UNANSWERED'.
// A: a premise counted UNEXHIBITED on an ASSUMES ground, whose answering block exhibits 2 or more layer kinds with a counted [L1], and whose ASSUMES clause
//    (with its ROWS GIVE part) holds no 6 words in a row of that [L1] quotation (all of it when shorter).
// B: a premise counted UNEXHIBITED on an "unanswered" ground that names a press (its verse, or 8 words in a row of its MEANS) whose MEANS the answering
//    block quotes on a line holding "MEANS" (the pkgOAN 8-word test), the block exhibiting 2 or more layer kinds.
// Any other ground that is not a layer (NOT COUNTED, narrowed, VOID, struck, barred, not named, unmet, without answers) stays exempt; "no row gives" is the ASSUMES ground itself and is read with it.
const UNXA_HARD=/\b(?:not|never)\s+named\b|\bNOT\s+COUNTED\b|\bnarrowed\b|\bleaves?\s+[^.;]{0,80}?\bunmet\b|\bstruck\b|\bbarred\b|\bVOID\b|\bwithout\s+(?:\S+\s+){0,2}?answers?\b/i;
const UNXA_ASM=/\bASSUMES\b/;const UNXA_UNA=/\bunanswered\b|\bno\s+answer\b|\bnot\s+answered\b/i;
// the block's [L1]: the first quotation carrying a reference, read as lbFoot reads it (ruling 400)
function unxaL1(blk){const t=String(blk==null?'':blk).replace(/\*\*/g,'').replace(/__/g,'');const R=[...t.matchAll(LB_REF)].map(m=>({k:m[0].replace(/\.\s/,' '),a:m.index,b:m.index+m[0].length}));
 for(const m of t.matchAll(/["“][^"”\n]{4,}?["”]|(?<=^|[\s(:])['‘][^'’\n]{4,}?['’](?=$|[\s.,;:)\]])/g)){const a=m.index,b=a+m[0].length;const aft=R.find(r=>r.a>=b&&r.a-b<=4&&/^[\s(]*$/.test(t.slice(b,r.a)));const bef=R.filter(r=>r.b<=a&&a-r.b<=80).pop();const r=aft||bef;
  if(r)return {ref:r.k,q:m[0].slice(1,-1)};}return null;}
// a segment runs to the next premise header, so the words before that header ("). VOID premise 2", "). Spared: premise 3") belong to the next entry:
// the exempt grounds are read only up to the segment's last stop when what follows it is 40 characters or less
const unxaHead=s=>{const m=String(s).match(/^([\s\S]*[.;)])\s*[^.;)]{0,40}$/);return m?m[1]:String(s);};
function unxaCheck(all,blk,k,P){if(all.some(z=>UNXA_HARD.test(unxaHead(z.seg))))return null;if(k.length<2)return null;
 const A=all.filter(z=>UNXA_ASM.test(z.seg)),B=all.filter(z=>UNXA_UNA.test(z.seg));
 if(A.length&&k.includes('L1')){const l1=unxaL1(blk);if(l1){const cl=A.map(z=>z.seg.slice(z.seg.search(UNXA_ASM))).join(' ');if(!UNX_MRUN(cl,l1.q,6))return {a:'ASSUMES',l1,seg:A[0].seg};}}
 if(B.length){const BL=String(blk).split('\n');const L=BL.filter(l=>/\bMEANS\b/.test(l));
  // the answer to that press: from its MEANS line to the next MEANS line; its [L1] is the first quotation with a reference there
  const sub=p=>{const i=BL.findIndex(l=>/\bMEANS\b/.test(l)&&UNX_MRUN(l,p.means,8));if(i<0)return '';let e=BL.findIndex((l,x)=>x>i&&/\bMEANS\b/.test(l));return BL.slice(i,e<0?BL.length:e).join('\n');};
  for(const z of B){const sg=z.seg.replace(/\s+/g,' ');for(const p of P){const ref=p.ref.replace(/\s+/g,'\\s+').replace(/\./g,'\\.');
   if(!(new RegExp('\\b'+ref+'\\b(?!\\s*[-–]?\\d)').test(sg)||UNX_MRUN(sg,p.means,8)))continue;if(L.some(l=>UNX_MRUN(l,p.means,8)))return {a:'UNANSWERED',press:p,l1:unxaL1(sub(p))||unxaL1(blk),seg:z.seg};}}}
 return null;}
