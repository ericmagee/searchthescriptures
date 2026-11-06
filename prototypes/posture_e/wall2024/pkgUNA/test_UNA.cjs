// pkgUNA test. Run from wall2024/: node pkgUNA/test_UNA.cjs   (the full list of items: pkgUNA/replay_UNA_out.txt)
const fs=require('fs');const crypto=require('crypto');const sha=s=>crypto.createHash('sha256').update(s).digest('hex').slice(0,16);const rd=f=>fs.readFileSync(f,'utf8');
let ok=0,bad=0;const T=(n,c,d)=>{console.log((c?'OK  ':'FAIL')+' '+n+(d?'\n     '+d:''));c?ok++:bad++;};
const plan=JSON.parse(rd('pkgUNA/plan_UNA.json'));T('2 Build nodes; base (pkgPAB/patched) and final shas match',plan.nodes.length===2&&plan.nodes.every(n=>sha(rd('pkgPAB/patched/'+n.file))===n.base_sha&&sha(rd('pkgUNA/patched/'+n.file))===n.final_sha));
const {sb,itemsOf}=require('./replay_UNA.cjs');const L=require('../pkgECL/libload.cjs');
const UND=new Function('$',L.LIBSRC+'\n'+rd('pkgUNL/src_UNL.js')+'\nreturn UND;')(()=>({isExecuted:false}));
const k=i=>i.seat+'|'+i.rule+'|'+i.item+'|'+i.line;
for(const run of ['33040','33060','33083','33107','33129','33149','33160']){const a=itemsOf(sb('pkgPAB/patched/Send_Back_Build.js',run).o),b=itemsOf(sb('pkgUNA/patched/Send_Back_Build.js',run).o);const ka=new Set(a.map(k));
 const nw=b.filter(i=>!ka.has(k(i)));const same=b.filter(i=>ka.has(k(i)));
 T(run+': every live item is still sent with its rule, item and line ('+a.length+'); new items are E-HOLD UNDERDETERMINED lines marked pkgUNA ('+nw.length+')',a.every(x=>ka.has(k(x))&&b.some(y=>k(y)===k(x)))&&nw.every(i=>i.rule==='E-HOLD'&&/UNDERDETERMINED/.test(i.line)&&i.und&&i.und.kind==='E-HOLD-UNA'));
 T(run+': no UNDERDETERMINED line is sent twice for one seat',new Set(b.filter(i=>/UNDERDETERMINED/.test(i.line)&&i.rule==='E-HOLD').map(i=>i.seat+'|'+i.line)).size===b.filter(i=>/UNDERDETERMINED/.test(i.line)&&i.rule==='E-HOLD').length);}
// the cure is pkgUND's (Send Back Record unchanged): a CHANGE TO keeping UNDERDETERMINED with a counted [L1] and the open point cures; a KEEP does not
const it={rule:'E-HOLD',item:'COLLISION D6 vs C5 (UNDERDETERMINED; pkgUNA)',und:{kind:'E-HOLD-UNA'}};const D=L.data();
T('cure: KEEP does not cure',UND.cure(it,{ans:'KEEP'},D).status==='UNCURED');T('cure: RETRACTED cures',UND.cure(it,{ans:'CHANGE',to:'RETRACTED: D6 vs C5'},D).status==='CURED');
const B=rd('pkgUNA/patched/Send_Back_Build.js');T('the send-back text for a pkgUNA item does not say the enforcer reads the line as BROKEN',/i\.und\.kind==='E-HOLD-UNA'\?UND\.CURE_UND\.replace\('the enforcer reads this line as BROKEN; the decision stays yours\.'/.test(B));
console.log(ok+' OK, '+bad+' FAIL');process.exitCode=bad?1:0;
