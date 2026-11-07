// pkgACM (reader phase 2 completion, W3 order item 1, Wall 2992; Eric approved the track 16:50 CST 11-07). Run from wall2024/: node pkgACM/build_ACM.cjs
// The ANSWER CHECK line and its MEANS / ANSWER / grade fields, in the 4 Send Back nodes, move to the shared reader (__RL.readLine form 'ANSWER CHECK').
//  - claims() (pkgMNP): verse, round, MEANS and grade from the reader. Before: MEANS read by (["\u201c]?)([^"\u201d]*?)\1, which cannot cross an inner quote.
//  - cure() (pkgMNP): the CHANGE TO's verse, grade and MEANS from the same reader read. Before: three separate reads (split('--'), grade regex, pkgMNQ span).
//  - enf428Cure() E-ANS (Send Back Record x2): the flagged line and the CHANGE TO from the reader. Before: one AC regex needing quoted MEANS, -- separators
//    and MEETS|MISSES|FAILS.
// A line the reader refuses keeps the old read (pkgACR/pkgSBX rule). In claims(), a reader read with more than one round also keeps the old read (it takes the first bracket).
// Send Back Build and Alt Send Back Build had no reader: they get the same embedded __RL text the Record nodes carry (pkgSBX), so all 4 nodes read alike.
// Base: live s50 (0247fc93); the 4 nodes equal pkgMNQ/patched. Library reads of the same field (gateAnsGround2024, ac, dptCheck, kagRow0) are item 1b, a LIB repack.
const fs=require('fs');const crypto=require('crypto');const h=s=>crypto.createHash('sha256').update(s).digest('hex').slice(0,12);
const B='pkgACM/base_s50/',O='pkgACM/patched/';
const rec=fs.readFileSync(B+'Send_Back_Record.js','utf8');const a=rec.indexOf('const __RL=(function(){');const e=rec.indexOf('\nfunction __sbxRL(');
if(a<0||e<a)throw new Error('reader block not found in Send Back Record');const RLTXT=rec.slice(a,e+1);
const HELP="function __acm(l){let r;try{r=__RL.readLine(String(l==null?'':l));}catch(x){return null;}return r&&r.form==='ANSWER CHECK'&&r.f?r.f:null;} /* pkgACM: the shared reader's ANSWER CHECK fields, or null when it refuses the line */\n"
 +"function __acm4(l){const f=__acm(l);if(!f||!f.rounds||!f.rounds.length||f.means===undefined||f.answer===undefined||!/^(MEETS|MISSES|FAILS)$/.test(f.grade))return null;const x=[l,f.verse,f.rounds.join('; '),String(f.means),String(f.answer),f.grade];return x;} /* pkgACM: the old AC match shape [line, verse, rounds, MEANS, ANSWER, grade] */\n";
const R=[
 // claims()
 [String.raw`  const m=l.match(/^ANSWER CHECK\s*:\s*(.+?)\s*--\s*\[\s*([CD])R\s*(\d)\s*\]/);if(!m)continue;const mm=l.match(/--\s*MEANS\s*:\s*(["\u201c]?)([^"\u201d]*?)\1\s*(?:--|$)/);const mv=mm?mm[2].trim():null;`,
  String.raw`  const A0=__acm(l);const A=A0&&A0.rounds.length===1?A0:null;let m,mv,gr; /* pkgACM: the shared reader first; the old read only for a line it refuses */
  if(A){m=[l,A.verse,A.rounds[0][0]==='C'?'C':'D',A.rounds[0].slice(2)];mv=A.means===undefined?null:String(A.means).trim();gr=A.grade;}
  else{m=l.match(/^ANSWER CHECK\s*:\s*(.+?)\s*--\s*\[\s*([CD])R\s*(\d)\s*\]/);if(!m)continue;const mm=l.match(/--\s*MEANS\s*:\s*(["\u201c]?)([^"\u201d]*?)\1\s*(?:--|$)/);mv=mm?mm[2].trim():null;gr=(l.match(/--\s*(MEETS|MISSES|FAILS|UNPROVEN)\b/)||[])[1]||null;}`],
 [String.raw`means:mv,grade:(l.match(/--\s*(MEETS|MISSES|FAILS|UNPROVEN)\b/)||[])[1]||null});}return out;}`,String.raw`means:mv,grade:gr});}return out;}`],
 // cure()
 [String.raw`if(keyOf(to.replace(/^ANSWER CHECK\s*:\s*/,'').split('--')[0])!==p.key)`,String.raw`const TA=__acm(to); /* pkgACM */if(keyOf(TA?TA.verse:to.replace(/^ANSWER CHECK\s*:\s*/,'').split('--')[0])!==p.key)`],
 [String.raw`const g=(to.match(/--\s*(MEETS|MISSES|FAILS|UNPROVEN)\b/)||[])[1];if(!g)return R(false,'the CHANGE TO has no grade (pkgMNP)');`,String.raw`const g=TA?TA.grade:(to.match(/--\s*(MEETS|MISSES|FAILS|UNPROVEN)\b/)||[])[1];if(!g)return R(false,'the CHANGE TO has no grade (pkgMNP)');`],
 [String.raw`const mvq=mm?mm[1].trim().replace(/^["\u201c]([\s\S]*)["\u201d]$/,'$1'):'';`,String.raw`const mvq=TA&&TA.means!==undefined?String(TA.means).trim():mm?mm[1].trim().replace(/^["\u201c]([\s\S]*)["\u201d]$/,'$1'):'';`],
];
const R4=[ // enf428Cure E-ANS, Record nodes only
 [String.raw`const f=String(it.line||'').replace(/\\+"/g,'"').match(AC);`,String.raw`const f=__acm4(String(it.line||'').replace(/\\+"/g,'"'))||String(it.line||'').replace(/\\+"/g,'"').match(AC); /* pkgACM */`],
 [String.raw`const t=String(a.to||'').replace(/\\+"/g,'"').match(AC);`,String.raw`const t=__acm4(String(a.to||'').replace(/\\+"/g,'"'))||String(a.to||'').replace(/\\+"/g,'"').match(AC); /* pkgACM */`],
];
const plan={base:'live s50 0247fc93',reader_embedded_sha:h(RLTXT),nodes:{}};
for(const f of fs.readdirSync(B).sort()){let s=fs.readFileSync(B+f,'utf8');const s0=s;const isRec=/Record/.test(f);
 for(const [x,y] of R.concat(isRec?R4:[])){const c=s.split(x).length-1;if(c!==1)throw new Error(f+': '+c+' x '+x.slice(0,70));s=s.replace(x,()=>y);}
 if(isRec)s=s.replace('\nfunction __sbxRL(',()=>'\n'+HELP+'function __sbxRL(');
 else s="// pkgACM: the shared line reader, the same text the Send Back Record nodes carry (pkgSBX)\n"+RLTXT+HELP+s;
 new Function('$','$input',s);fs.writeFileSync(O+f,s);plan.nodes[f.replace(/_/g,' ').replace(/\.js$/,'')]={base:h(s0),patched:h(s)};console.log(f.padEnd(26),h(s0),'->',h(s));}
fs.writeFileSync('pkgACM/patched.plan.json',JSON.stringify(plan,null,1));
