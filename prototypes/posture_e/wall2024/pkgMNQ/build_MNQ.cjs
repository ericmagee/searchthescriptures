// pkgMNQ (W2, 11-07; W3 grade_33461 proposal, HIGH, false not-counted seat). Run 33461: sol's 4 E-MNP send-back answers (Matthew 1:24, Luke 1:32,
// Ezra 2:61, Luke 1:35) quoted the press ledger's MEANS word for word, and all 4 stayed UNCURED, so sol was not counted. Each of those MEANS holds an
// inner quoted word ("coming together", "therefore", "of Heli"). The pkgMNP cure read the MEANS with /--\s*MEANS\s*:\s*(["“]?)([^"”]*?)\1\s*--/,
// which cannot cross an inner quote: the match failed, the MEANS read as empty, and each item fell to "quotes no 6 words in a row".
// Fix (the cure only, in the 4 Send Back nodes): the MEANS is the span from "MEANS:" to the next "-- ANSWER:" (else the next "--"), with only the outer
// quote pair taken off; inner quotes stay (the word compare drops all quote marks anyway). Side-neutral. Base: live s49. Run from wall2024/: node pkgMNQ/build_MNQ.cjs
const fs=require('fs');const crypto=require('crypto');const h=s=>crypto.createHash('sha256').update(s).digest('hex').slice(0,12);
const R=[[String.raw`const mm=to.match(/--\s*MEANS\s*:\s*(["\u201c]?)([^"\u201d]*?)\1\s*--/);const pw=nw(p.ledger_means);const T=' '+nw(mm?mm[2]:'').join(' ')+' ';`,
 String.raw`const mm=to.match(/--\s*MEANS\s*:\s*([\s\S]*?)\s*--\s*ANSWER\s*:/)||to.match(/--\s*MEANS\s*:\s*([\s\S]*?)\s*--/);const mvq=mm?mm[1].trim().replace(/^["\u201c]([\s\S]*)["\u201d]$/,'$1'):'';const pw=nw(p.ledger_means);const T=' '+nw(mvq).join(' ')+' '; /* pkgMNQ: 33461 sol, a MEANS with an inner quote read as empty */`]];
const plan={};for(const f of fs.readdirSync('pkgMNQ/base_s49')){let s=fs.readFileSync('pkgMNQ/base_s49/'+f,'utf8');const s0=s;
 for(const [a,b] of R){const c=s.split(a).length-1;if(c!==1)throw new Error(f+': '+c+' x '+a.slice(0,60));s=s.replace(a,()=>b);}
 new Function('$','$input',s);fs.writeFileSync('pkgMNQ/patched/'+f,s);plan[f]={base:h(s0),patched:h(s)};console.log(f.padEnd(26),h(s0),'->',h(s));}
fs.writeFileSync('pkgMNQ/patched.plan.json',JSON.stringify(plan,null,1));
