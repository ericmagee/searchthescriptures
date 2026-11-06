// pkgNHQ (W3 Wall 2500; run 33060 row 7881, sol K-S3 ENGINE FAULT): the NOT HELD quote test of K-S3, K-W and K-CON reads the full flagged
// sentence from the round, never only the item line. The K-S3 item line is the close-round sentence cut (orcLines, 176 characters on 7881), so a
// NOT HELD that quotes the sentence's end ("carries a father; I keep the drop I made there.") failed the 6-word test and the seat lost a cure.
// Run from wall2024/: node pkgNHQ/build_NHQ.cjs. Base: BASE (default pkgRCK/patched, the top of the library stack; the anchors are the same on pkgKCL).
// nhqFull(line,rounds): for each quotation in the item line that follows a round label ([CR2] "..." or DR4: "..."), its text up to the closing
// quote (or the end of a cut line) is found in that round (spacing, quote marks (all read as ') and markdown * _ ` aside; the item line turns inner double quotes to single, first 60 characters), and the sentence is read on to its
// end (. ! or ? after the quotation's own length). Returns the full sentences found; an empty list leaves every test as before.
// K-S3 and K-W: the 6-word runs of the full sentences are tested as well as the line's own (a superset: nothing cured before is lost). K-CON: the full sentences
// are added to the item's quoted sentences. Status, counts and every other cure are unchanged.
const fs=require('fs');const crypto=require('crypto');const sha=s=>crypto.createHash('sha256').update(s).digest('hex').slice(0,16);
const BASE=process.env.BASE||'pkgRCK/patched';const OUT=process.env.OUT||'pkgNHQ';
const HELPER="/* pkgNHQ (W3 2500): the full flagged sentence(s) from the round, for the NOT HELD quote tests of K-S3, K-W and K-CON (run 33060 row 7881: the item line is cut) */\n"
+"function nhqFull(line,rounds){const L=String(line||'');const R=rounds||{};const Nr=s=>String(s||'').replace(/\\\\\"/g,'\"').replace(/[\\u201c\\u201d\\u2018\\u2019\"]/g,\"'\").replace(/[*_`]+/g,'').replace(/\\s+/g,' ');const out=[];\n"
+" const re=/(?:\\[([CD]R\\d)\\]|\\b([CD]R\\d)\\s*:)[^\"\\[\\]]{0,80}?\"/g;let m;while((m=re.exec(L))){const rk=m[1]||m[2];const a=m.index+m[0].length;const b=L.indexOf('\"',a);let q=Nr(b<0?L.slice(a):L.slice(a,b)).replace(/\\s*(?:\\.\\.\\.|\\u2026)\\s*$/,'').trim();\n"
+"  if(b>=0)re.lastIndex=b+1;const t=Nr(R[rk]);if(!t||q.length<12)continue;const k=q.slice(0,60);const p=t.indexOf(k);if(p<0)continue;\n"
+"  const from=p+Math.max(q.length-1,0);const e=t.slice(from).search(/[.!?](?=[\"')\\]]*(?:\\s|$))/);const full=t.slice(p,e<0?Math.min(t.length,p+1500):from+e+1).slice(0,1500);if(full.length>=q.length)out.push(full);}\n"
+" return out;}\n";
const E=[
 ["function krulCure(x,replyText,rounds,respText){",HELPER+"function krulCure(x,replyText,rounds,respText){",22],
 ["if(mn&&mn[1].split(/\\s+/).filter(Boolean).length>=5&&quoted)return res('CURED','answered NOT HELD with its reason",
  "/* pkgNHQ: also the full sentence from the round */if(!quoted)for(const __f of nhqFull(x.line,R)){const __w=krulNorm(__f).split(' ').filter(Boolean),__n=Math.min(6,__w.length);for(let i=0;__n&&i+__n<=__w.length&&!quoted;i++)quoted=RN.includes(' '+__w.slice(i,i+__n).join(' ')+' ');}\n    if(mn&&mn[1].split(/\\s+/).filter(Boolean).length>=5&&quoted)return res('CURED','answered NOT HELD with its reason",19],
 ["const runs=body.length<=6?[body.join(' ')]:body.slice(0,body.length-5).map((_,i)=>body.slice(i,i+6).join(' '));",
  "const __rn=b0=>b0.length<=6?[b0.join(' ')]:b0.slice(0,b0.length-5).map((_,i)=>b0.slice(i,i+6).join(' '));const runs=__rn(body).concat(...nhqFull(x.line,R).map(f=>__rn(nw(f.replace(/^\\s*I\\s+(?:do\\s+not\\s+claim|no\\s+longer\\s+claim|withdraw|grant|concede|drop)\\b/i,''))))); /* pkgNHQ: the line's own runs, plus those of the full sentences from the round */",19],
 ["if(x.rule==='K-CON'){const qs=[...String(x.line||'').matchAll(/\"([^\"]{12,})\"/g)].map(m=>m[1]);",
  "if(x.rule==='K-CON'){const qs=[...String(x.line||'').matchAll(/\"([^\"]{12,})\"/g)].map(m=>m[1]).concat(nhqFull(x.line,rounds)); /* pkgNHQ */",22],
];
fs.mkdirSync(OUT+'/patched',{recursive:true});const plan={base:BASE,nodes:[]};const cnt=E.map(()=>0);
for(const f of fs.readdirSync(BASE).filter(f=>f.endsWith('.js')).sort()){const s0=fs.readFileSync(BASE+'/'+f,'utf8');let s=s0;const done=[];
 E.forEach(([a,b],i)=>{const n=s.split(a).length-1;if(n>1)throw new Error(f+': anchor '+i+' found '+n+' times');if(n===1){s=s.replace(a,()=>b);cnt[i]++;done.push(i);}});
 fs.writeFileSync(OUT+'/patched/'+f,s);plan.nodes.push({file:f,base_sha:sha(s0),final_sha:sha(s),edits:done});console.log(f.padEnd(34),sha(s0),'->',sha(s),'edits',done.join(','));}
E.forEach(([a],i)=>{if(cnt[i]!==E[i][2])throw new Error('edit '+i+' applied '+cnt[i]+' times, expected '+E[i][2]);});
fs.writeFileSync(OUT+'/plan_NHQ.json',JSON.stringify(plan,null,1));console.log('edits applied',cnt.join(' '));
