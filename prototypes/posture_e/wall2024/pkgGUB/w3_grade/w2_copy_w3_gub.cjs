// W3 grade of pkgGUB: plants through my chain replay of execution 34626, read at the written rows.
const chain=require('../../pkgKSR/w3_grade/chain.cjs');const rd=chain.rd;const cl=x=>JSON.parse(JSON.stringify(x));
const F={S:process.env.W3_S||'/mnt/project-files/wall2024/fetchback_live_s110.json',N:process.env.W3_N||(__dirname+'/../../pkgGCC/parent_s110_GCCN2.json'),U:process.env.W3_U||'/mnt/project-files/wall2024/parent_s110_GUB.json'};
const SID=process.env.W3_SID||'S10'; /* W2: on s111 the D2 vs C1 item is S6 (G1); on s110 it is S10 */
const G1='GATE: G1 || CHANGE TO: ';const TAIL=' || [CR3] says “The matter he must deal with is a pregnancy found before any coming together of the pair.”';
const L1ok='[L1] Matthew 1:19 “being a just [man], and not willing to make her a publick example, was minded to put her away privily”';
const HEAD='D2 vs C1 (Matthew 1:19): UNDERDETERMINED -- ';
const LINE={
 a:HEAD+'the record leaves open what Joseph believed about paternity. -- GROUND: '+L1ok,
 b:HEAD+'the record leaves open what Joseph believed about paternity. -- GROUND: [L1] Matthew 1:19 “Joseph knew that the child was not his own and resolved to hide it”',
 c:HEAD+'Joseph acted as a just man. -- GROUND: '+L1ok,
 d:HEAD+'the record leaves open what Joseph believed about paternity. -- GROUND: [L3] Matthew 1:18 “before they came together, she was found with child.”',
 e:'D2 vs C1 (Matthew 1:19): STANDS -- the answer fits the verse. -- GROUND: '+L1ok+' | [CR3] “The matter he must deal with is a pregnancy found before any coming together of the pair.”',
 f:'D2 vs C1 (Matthew 1:19): STANDS -- the answer fits the verse. -- GROUND: '+L1ok,
 g:(HEAD+'the record leaves open what Joseph believed about paternity. -- GROUND: '+L1ok).replace(/[“”]/g,'"'),
 j:HEAD+'the record leaves open what Joseph believed about paternity. -- GROUND: [L1] Obadiah 1:3 “The pride of thine heart hath deceived thee”',
};
const und=(seat,s)=>'[AUDIT v42: COLLISION GRADE UNCURED (pkgUND) -- SEAT: '+seat+'; ITEMS: '+s+' (E-HOLD on UNDERDETERMINED COLLISION D2 vs C1: kept UNDERDETERMINED; no counted [L1]); counted in drv_uncured. REVIEW THIS ROW.]';
const ecf=(seat,s)=>'[AUDIT v41: E-COL UNCURED (pkgECF, W3 2534) -- SEAT: '+seat+'; ITEMS: '+s+' (COLLISION D2 vs C1: no layer); counted in drv_uncured. REVIEW THIS ROW.]';
async function run(file,c){
 const opt={after:{
  'Send Back Record':(over)=>{if(!c.audit)return;const o=cl(over['Send Back Record']);const J=o[0][0].json;const i=J.bodies.findIndex(b=>JSON.parse(b).payload.judge_seat==='luna');const b=JSON.parse(J.bodies[i]);b.payload.verdict_raw+='\n'+c.audit;b.payload.drv_uncured=(b.payload.drv_uncured||0)+(c.add==null?1:c.add);J.bodies[i]=JSON.stringify(b);
    if(c.ung){const it=J.sb_items.find(x=>x.seat==='luna'&&x.sid===SID);it.rule='E-UNG';it.item='COLLISION D2 (pressed: [DR2] premise 2)';}
    over['Send Back Record']=o;},
  'Gate Build':(over)=>{if(!c.g2same)return;const o=cl(over['Gate Build']);const g=o[0].find(x=>x.json.seat==='luna').json;const a=g.items.find(x=>x.gid==='G1'),b=g.items.find(x=>x.gid==='G2');b.lines=cl(a.lines);b.why=a.why;b.to=a.to;if(g.msg)g.msg=g.msg;over['Gate Build']=o;},
  'Gate Call openrouter':(over,out)=>{const o=cl(out('Gate Call openrouter'));const k=rd['Gate Build'][0].data.main[0].findIndex(x=>x.json.seat==='luna');let t=o[0][k].json.choices[0].message.content;const ls=t.split('\n');
    if(c.g1!=null){const i=ls.findIndex(l=>l.startsWith('GATE: G1 '));ls[i]=G1+c.g1+TAIL;}
    if(c.g2!=null){const i=ls.findIndex(l=>l.startsWith('GATE: G2 '));ls[i]='GATE: G2 || CHANGE TO: '+c.g2+TAIL;}
    o[0][k].json.choices[0].message.content=ls.join('\n');over['Gate Call openrouter']=o;}},
  before:c.noverse?{'Gate Record':(over)=>{for(const n of ['Cited Verses','L2 Words','L2 Lexicon'])over[n]=[[]];}}:undefined};
 const r=await chain(file,opt);const lu=r.rows.find(x=>(x.judge_seat||x.seat)==='luna');const all=r.rows.map(x=>(x.judge_seat||x.seat)+':'+x.drv_uncured).join(' ');
 const g=(lu.verdict_raw.match(/\[AUDIT v38: E-GATE -- SEAT: luna; G[12] [^\]]*\]/g)||[]).map(s=>s.replace('[AUDIT v38: E-GATE -- SEAT: luna; ','').slice(0,c.long?400:150));
 const gr=JSON.stringify((r.over['Gate Record'][0][0].json.gate_rows||[]).map(x=>[x.seat,x.item,x.cure_status,x.cure_reason,x.response_line]));
 const J0=lu.verdict_raw.slice(0,lu.verdict_raw.indexOf('[AUDIT'));const fin=J0.split(/\\n|\n/).filter(l=>l.includes('D2 vs C1 (Matthew 1:19)')).map(s=>s.trim().slice(0,170)).join(' ## ');return {u:lu.drv_uncured,all,g,gr,fin,rows:chain.nt(r.rows)};}
const CASES=[
 ['L1 stored, no plant',{}, 'eq'],
 ['a good UND line',{audit:und('luna',SID),g1:LINE.a},2],
 ['b [L1] words not in the verse',{audit:und('luna',SID),g1:LINE.b},3],
 ['c no statement of what is left open',{audit:und('luna',SID),g1:LINE.c},3],
 ['d only [L3]',{audit:und('luna',SID),g1:LINE.d},3],
 ['e STANDS with [L1] and answer quote',{audit:und('luna',SID),g1:LINE.e},2],
 ['f STANDS without answer quote',{audit:und('luna',SID),g1:LINE.f},3],
 ['g straight quotes, as a',{audit:und('luna',SID),g1:LINE.g},2],
 ['h pkgECF counted line, failing new line',{audit:ecf('luna',SID),g1:LINE.c},2],
 ['i1 pkgUND line for seat sol naming S10',{audit:und('sol',SID),g1:LINE.a},3],
 ['i2 pkgUND line naming S1, gate item S10',{audit:und('luna','S1'),g1:LINE.a},3],
 ['j [L1] verse not read this run',{audit:und('luna',SID),g1:LINE.j},'rec'],
 ['k1 G1 fails, later applied G2 passes (same line)',{audit:und('luna',SID),g1:LINE.c,g2:LINE.a,g2same:true,long:true},2],
 ['k2 G1 passes, later applied G2 fails (same line)',{audit:und('luna',SID),g1:LINE.a,g2:LINE.c,g2same:true,long:true},3],
 ['l verse rows not available, good line',{audit:und('luna',SID),g1:LINE.a,noverse:true},'rec'],
 ['l2 verse rows not available, failing line c',{audit:und('luna',SID),g1:LINE.c,noverse:true},3],
 ['m1 E-UNG item, graded line passes',{audit:und('luna',SID).replace('E-HOLD on UNDERDETERMINED','E-UNG'),g1:LINE.a,ung:true},2],
 ['m2 E-UNG item, no counted [L1]',{audit:und('luna',SID).replace('E-HOLD on UNDERDETERMINED','E-UNG'),g1:LINE.b,ung:true},3],
];
(async()=>{let fail=0;const only=process.argv[2];
 for(const [name,c,exp] of CASES){if(only&&!name.startsWith(only))continue;let S,N,U;try{S=await run(F.S,c);N=await run(F.N,c);U=await run(F.U,c);}catch(e){console.log('ERR  '+name+' :: '+e.message);fail++;continue;}
  let ok;if(exp==='eq')ok=U.rows===S.rows;else if(exp==='rec')ok=null;else ok=U.u===exp;
  if(ok===false)fail++;
  console.log((ok===null?'REC ':ok?'OK  ':'FAIL')+' '+name+' | luna s110 '+S.u+' GCCN2 '+N.u+' GUB '+U.u+(typeof exp==='number'?' (label '+exp+')':'')+' | all GUB '+U.all+' | gate rows GUB=GCCN2 '+(U.gr===N.gr));
  U.g.forEach(x=>console.log('       GUB  '+x));if(c.long)console.log('       line in the written row: '+U.fin);if(c.long)N.g.forEach(x=>console.log('       GCCN '+x));}
 console.log(fail?'FAILS '+fail:'NO FAIL');})();
