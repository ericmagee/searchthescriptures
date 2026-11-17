// ASK 355 replay and tests. Usage: node replay355.cjs <target> <base> <lib.cjs> <data355.json>
const fs=require('fs');const {unpack,rb,load}=require(process.argv[4]);const D=JSON.parse(fs.readFileSync(process.argv[5]));
const $=()=>({all:()=>[],first:()=>({json:{}}),isExecuted:false});
const ecw=p=>{const u=unpack(JSON.parse(fs.readFileSync(p)));return load(rb(u.L,u.M['Judge Enforcer Record']),$).ECW;};
const T=ecw(process.argv[2]),B=ecw(process.argv[3]);
let n=0,f=0;const ok=(t,c,d)=>{n++;if(!c)f++;console.log((c?'ok   ':'FAIL ')+t+(d?' :: '+d:''));};
const R={};for(const r of D.rounds)R[r.run.slice(5,10)]=r;
function parse(row){const cr=String(row.cr||'');const m=cr.match(/^ENFORCER (?:DISAGREE|HELD \(pkgECW[^)]*\)) \(right: ([A-Z]+)\): ([\s\S]*)$/);if(!m)return null;
 const head=m[2].slice(0,50);const ln=String(row.fr||'').split('\n').find(l=>l.includes(head.slice(0,40)));
 let why=m[2].replace(/\s*\[pkgECW code check:[\s\S]*$/,'').replace(/\s*\(judge wrote [\s\S]*$/,'');
 if(ln){const k=ln.match(/^ENFORCER:\s*\S+\s*--\s*DISAGREE\s*--\s*RIGHT:\s*[A-Z]+\s*--\s*([\s\S]*)$/);if(k)why=k[1];}
 return {v:'DISAGREE',right:m[1],why};}
const runs=[...new Set(D.logs.map(r=>r.run.slice(5,10)))];const out=[];
for(const run of runs){const rows=D.logs.filter(r=>r.run.slice(5,10)===run);const ids=rows.map(r=>({id:r.id,rule:r.rule,seat:r.seat,item:r.item,flagged_line:r.fl}));
 const Rr=R[run];const RR={};for(const k of ['CR1','CR2','CR3','CR4','DR1','DR2','DR3','DR4'])RR[k]=Rr[k]||'';
 rows.forEach((r,k)=>{const v=parse(r);if(!v)return;const ctx={R:RR,rows:D.verses,words:[],sib:ids};const g1=B.gate(ids[k],v,ctx),g2=T.gate(ids[k],v,ctx);
  const st=g=>!g.applies?(g.exempt?'EXEMPT(sent)':'n/a'):g.send?'SENT':'HELD';out.push({id:r.id,run,rule:r.rule,seat:r.seat,item:r.item,live:st(g1),t:st(g2),why:g2.why||g2.note||'',cb:(T.field(v.why)||{}).ref});});}
for(const o of out)console.log(o.id,o.run,o.rule,o.seat,o.item,'| CB',o.cb,'| live',o.live,'-> ASK355',o.t,o.live!==o.t?'  CHANGED: '+o.why.slice(0,160):'');
const st=id=>(out.find(o=>o.id===id)||{}).t;
for(const id of [42486,42659,42660,42661,42662,42227,42228,42229])ok('MUST NOT PASS '+id+' is HELD on the pressed verse',st(id)==='HELD'&&/pressed verse/.test((out.find(o=>o.id===id)||{}).why),st(id));
for(const id of [42223,42224])ok('MUST STILL PASS '+id+' reads as live',st(id)===(out.find(o=>o.id===id)||{}).live&&st(id)==='SENT',st(id));
ok('no other row changes status',out.filter(o=>o.live!==o.t).every(o=>[42486,42659,42660,42661,42662,42227,42228,42229].includes(o.id)),out.filter(o=>o.live!==o.t).map(o=>o.id).join());
// plants
const L1='D3 vs C3 (Matthew 1:25): CHALLENGER LINK BROKEN -- x -- GROUND: [L1] Matthew 1:25 "And knew her not till she had brought forth her firstborn son" | [L3] Matthew 1:24 "and took unto him his wife"';
const Rp={CR1:'',CR2:'',CR3:'',CR4:'',DR1:'',DR2:'',DR3:'Matthew 1:24 "Then Joseph being raised from sleep did as the angel of the Lord had bidden him, and took unto him his wife" read with Matthew 1:25.',DR4:''};
const pv=[...D.verses];const x={id:'P1',rule:'E-COL',seat:'p',item:'COLLISION D3 vs C3',flagged_line:L1};
let g=T.gate(x,{v:'DISAGREE',right:'STANDS',why:'the answer reads the not-knowing from the taking -- CARRIED BY: Matthew 1:24 "did as the angel of the Lord had bidden him, and took unto him his wife"'},{R:Rp,rows:pv,words:[],sib:[x]});
ok('PLANT MUST STILL PASS: CARRIED BY an [L3] verse of the GROUND (Matthew 1:24) is sent',g.applies&&g.send===true,g.note||g.why);
g=T.gate(x,{v:'DISAGREE',right:'STANDS',why:'the answer reads till as the taking -- CARRIED BY: Matthew 1:25 "And knew her not till she had brought forth her firstborn son"'},{R:{...Rp,DR3:Rp.DR3+' Matthew 1:25 "knew her not till"'},rows:pv,words:[],sib:[x]});
ok('PLANT MUST NOT PASS: CARRIED BY the [L1] verse is HELD',g.applies&&g.send===false&&/pressed verse/.test(g.why),g.why);
const xf={id:'P2',rule:'E-COL',seat:'p',item:'COLLISION D3 vs C3',flagged_line:'FORCED: D3 vs C3 -- MEANS [CR3]: "x" -- ANSWER [DR3]: "y" -- FAILS: "y"'};
g=T.gate(xf,{v:'DISAGREE',right:'STANDS',why:'z -- CARRIED BY: Matthew 1:25 "And knew her not till she had brought forth her firstborn son"'},{R:{...Rp,DR3:Rp.DR3+' Matthew 1:25'},rows:pv,words:[],sib:[x,xf]});
ok('PLANT: a FORCED item reads its pressed verse from the same seat\'s collision line',g.send===false&&/collision line/.test(g.why),g.why);
g=T.gate(xf,{v:'DISAGREE',right:'STANDS',why:'z -- CARRIED BY: Matthew 1:25 "And knew her not till she had brought forth her firstborn son"'},{R:{...Rp,DR3:Rp.DR3+' Matthew 1:25'},rows:pv,words:[],sib:[xf,{...x,seat:'other'}]});
ok('PLANT: another seat\'s collision line is not read (no pressed verse found; the gate reads as live)',JSON.stringify(g)===JSON.stringify(B.gate(xf,{v:'DISAGREE',right:'STANDS',why:'z -- CARRIED BY: Matthew 1:25 "And knew her not till she had brought forth her firstborn son"'},{R:{...Rp,DR3:Rp.DR3+' Matthew 1:25'},rows:pv,words:[],sib:[xf,{...x,seat:'other'}]})),g.note||g.why);
g=T.gate(x,{v:'AGREE',right:'BROKEN',why:'w -- CARRIED BY: Matthew 1:25 "And knew her not till she had brought forth her firstborn son"'},{R:Rp,rows:pv,words:[]});
ok('PLANT: the pressed-verse rule does not apply to an AGREE',g.applies===false,JSON.stringify(g));
g=T.gate(x,{v:'DISAGREE',right:'STANDS',why:'the break rests on an absence'},{R:Rp,rows:pv,words:[]});
ok('PLANT: an absence ground with no CARRIED BY stays exempt as live',g.exempt===true);
g=T.gate(x,{v:'DISAGREE',right:'STANDS',why:'the answer\'s words rest on an absence, while the row gives a rival reading -- CARRIED BY: Matthew 1:25 "And knew her not till she had brought forth her firstborn son"'},{R:{...Rp,DR3:Rp.DR3+' Matthew 1:25'},rows:pv,words:[],sib:[x]});
ok('PLANT (row 42661 form): an absence word plus a CARRIED BY goes through the gate',g.applies===true&&g.send===false,g.why);
// rev 2 plants (W3 7502 F1): every [L1] of the GROUND
const LU='D5 vs C4 (Luke 2:48): UNDERDETERMINED -- GROUND: [L1] Luke 2:48 \u201cbehold, thy father and I have sought thee sorrowing\u201d | [L1] Luke 3:23 \u201cbeing (as was supposed) the son of Joseph\u201d -- [CR3] says Mary used \u201ccustomary parental speech,\u201d while the challenger takes her words as naming Joseph father; the record leaves open whether \u201cthy father\u201d establishes biological paternity or parental standing (Commitment 7).';
const xl={id:'P3',rule:'E-HOLD',seat:'luna',item:'COLLISION D5 vs C4',flagged_line:LU};
ok('REAL line (judgment 1208, luna D5 vs C4): pressed() reads both [L1] verses, Luke 2:48 and Luke 3:23',JSON.stringify([...new Set(T.pressed(xl,[]).refs.map(p=>p.book+' '+p.ch+':'+p.v1))])==='["Luke 2:48","Luke 3:23"]',JSON.stringify(T.pressed(xl,[]).refs));
const LB=LU.replace(': UNDERDETERMINED --',': CHALLENGER LINK BROKEN --');const xb={...xl,rule:'E-COL',flagged_line:LB};
g=T.gate(xb,{v:'DISAGREE',right:'STANDS',why:'the answer reads the son as supposed -- CARRIED BY: Luke 3:23 "being (as was supposed) the son of Joseph"'},{R:{...Rp,DR3:'Luke 3:23 "being (as was supposed) the son of Joseph"'},rows:pv,words:[],sib:[xb]});
ok('PLANT (1208 line as a break): a CARRIED BY on the second [L1], Luke 3:23, is HELD',g.send===false&&/pressed verse/.test(g.why),g.why);
g=T.gate({...xl,rule:'E-HOLD',flagged_line:LU.replace(': UNDERDETERMINED --',': STANDS --')},{v:'DISAGREE',right:'UNDERDETERMINED',why:'both readings fit -- CARRIED BY: Luke 3:23 "being (as was supposed) the son of Joseph"'},{R:Rp,rows:pv,words:[],sib:[]});
ok('PLANT: an E-HOLD push on a line with no answering side, CARRIED BY its [L1] Luke 3:23, is HELD (the check runs before NOT CHECKED)',g.send===false&&/pressed verse/.test(g.why),g.why||g.note);
g=T.gate({...xl,rule:'E-HOLD',flagged_line:LU.replace(': UNDERDETERMINED --',': STANDS --')},{v:'DISAGREE',right:'UNDERDETERMINED',why:'both readings fit -- CARRIED BY: Matthew 1:16 "Joseph the husband of Mary, of whom was born Jesus"'},{R:Rp,rows:pv,words:[],sib:[]});
ok('PLANT: the same push with another row reads as live (NOT CHECKED, sent)',g.send===true&&/NOT CHECKED/.test(g.note||''),g.note);
console.log(n+' checks, '+(f?'FAILS '+f:'ALL OK'));
