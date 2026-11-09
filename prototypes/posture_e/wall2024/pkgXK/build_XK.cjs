// pkgXK stage A (WALL-3617 final list item 1, approved by the operator 16:27Z 11-09): one exact item key in the cure reader.
// A judge line now goes to the item it names most exactly: among the lines that match an item, the reader takes the line that names the FEWEST distinct items
// (ties: the first line, as before). A line naming one item therefore beats a line naming several, whatever the order of the lines.
// Applies to: respOf and stmtOf in cureVerdicts (passes 1 to 3; the lone-rule pass 4 and the K-CMT/K-CMTL paths are unchanged), and the K-RUL card pick in krulCure
// (among cards krulMatch ties to the item, the card whose RULING target names the fewest K-RUL items of the build).
// When every line names one item (every saved run but the cases the replay lists), the output is byte-equal to live.
// Run from wall2024/: node pkgXK/build_XK.cjs [base strip] [out strip]
const fs=require('fs'),cr=require('crypto');const h=s=>cr.createHash('sha256').update(s).digest('hex').slice(0,12);
const BASE=process.argv[2]||'pkgLIB/strip_FUM',OUT=process.argv[3]||'pkgLIB/strip_XK';
const sub=(s,a,b,f)=>{const n=s.split(a).length-1;if(n!==1)throw new Error(f+': '+n+' hits for '+a.slice(0,70));return s.split(a).join(b);};
const R0="const r=o.response.find(s=>{const L=U(s.label);return HAS(L,lb)&&ruleOk(L);})||(x.rule==='K-W'&&KWK(x.link)?o.response.find(s=>ruleOk(U(s.label))&&KWK(s.label)===KWK(x.link)):null)||o.response.find(s=>{const L=U(s.label);return ruleOk(L)&&(x.link?HAS(L,x.link):(L.includes(x.side)&&L.includes('STANDING')));})";
const R1="const r=xkPick(o.response,s=>{const L=U(s.label);return HAS(L,lb)&&ruleOk(L);})||(x.rule==='K-W'&&KWK(x.link)?xkPick(o.response,s=>ruleOk(U(s.label))&&KWK(s.label)===KWK(x.link)):null)||xkPick(o.response,s=>{const L=U(s.label);return ruleOk(L)&&(x.link?HAS(L,x.link):(L.includes(x.side)&&L.includes('STANDING')));})";
const PICK="/* pkgXK: the number of distinct item keys (the link, or SIDE STANDING) a RESPONSE/STATEMENT label names (each item tested as respOf tests it; two rules on one key count once), and the pick: among matching lines, the one naming the fewest items, first on a tie */\n"+
 "const xkN=new Map();const xkCnt=s=>{if(xkN.has(s))return xkN.get(s);const L=U(s.label);const rs=L.match(/\\bK-[A-Z]+[0-9]*\\b/g)||[];const K=new Set();for(const y of items){if(!y)continue;const ok=!rs.length||rs.includes(U(y.rule||''));if(!ok)continue;const ly=U(cureLabel(y));"+
 "if(HAS(L,ly)||(y.rule==='K-W'&&KWK(y.link)&&KWK(L)===KWK(y.link))||(y.link?HAS(L,y.link):(L.includes(String(y.side))&&L.includes('STANDING'))))K.add(NZ(y.link!=null&&y.link!==''?String(y.link):String(y.side)+' STANDING'));}xkN.set(s,K.size);return K.size;};\n"+
 "const xkPick=(A,f)=>{let b=null,bn=Infinity;for(const s of A){if(!f(s))continue;const n=xkCnt(s);if(n<bn){b=s;bn=n;}}return b;};\n";
const CARD="/* pkgXK: among the cards krulMatch ties to item x, the card whose RULING target names the fewest K-RUL items of the build (__XK_ITEMS, set by cureVerdicts); first on a tie */\n"+
 "function xkCard(cards,x){const I=((typeof __XK_ITEMS!=='undefined'&&__XK_ITEMS)||[]).filter(y=>y&&y.rule==='K-RUL');const m=(c,y)=>{try{return krulMatch(c,y.ruling||y.link,y.krul_ctx||null);}catch(e){return false;}};let b=null,bn=Infinity;"+
 "for(const c of cards){if(!m(c,x))continue;const n=I.length?new Set(I.filter(y=>m(c,y)).map(y=>String(y.ruling||y.link))).size:0;if(n<bn){b=c;bn=n;}}return b||undefined;}\n";
fs.rmSync(OUT,{recursive:true,force:true});fs.mkdirSync(OUT+'/patched',{recursive:true});const plan={base:BASE,library:{}};
for(const f of fs.readdirSync(BASE+'/patched').filter(f=>f.endsWith('.js')).sort()){const s0=fs.readFileSync(BASE+'/patched/'+f,'utf8');let s=s0;
 if(s.includes('const respOf=(x)=>{')){
  s=sub(s,'const respOf=(x)=>{',PICK+'const respOf=(x)=>{',f);s=sub(s,R0,R1,f);s=sub(s,'const st=o.statement.find(s=>','const st=xkPick(o.statement,s=>',f);
  s=sub(s,'__RXR_R=rounds||null;','__RXR_R=rounds||null;__XK_ITEMS=items||null; /* pkgXK */',f);s=sub(s,'var __RXR_R=null;','var __RXR_R=null;var __XK_ITEMS=null; /* pkgXK */',f);}
 if(s.includes('function krulCure(')){s=sub(s,'function krulCure(',CARD+'function krulCure(',f);s=sub(s,'const c=krulCards(T).find(c=>krulMatch(c,x.ruling||x.link,x.krul_ctx||null));','const c=xkCard(krulCards(T),x); /* pkgXK */',f);}
 if(s!==s0)new Function('$','$input','return (async()=>{\n'+s+'\n})();');
 fs.writeFileSync(OUT+'/patched/'+f,s);plan.library[f]={base:h(s0),patched:h(s)};}
fs.writeFileSync('pkgXK/plan_XK.json',JSON.stringify(plan,null,1)+'\n');console.log('library',Object.keys(plan.library).length,'changed',Object.values(plan.library).filter(x=>x.base!==x.patched).length);
