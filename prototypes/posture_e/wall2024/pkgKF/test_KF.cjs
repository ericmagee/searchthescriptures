// pkgKF test (W3 queue item 5: K-F to LIVE at zero false items). Run from wall2024/: node pkgKF/test_KF.cjs
const fs=require('fs');const crypto=require('crypto');const rd=f=>fs.readFileSync(f,'utf8');const sha=s=>crypto.createHash('sha256').update(s).digest('hex').slice(0,16);
const {execSync}=require('child_process');let ok=0,bad=0;const T=(n,c)=>{if(c){ok++;console.log('OK   '+n);}else{bad++;console.log('FAIL '+n);}};
const plan=JSON.parse(rd('pkgKF/plan_KF.json'));
T('22 nodes: base (pkgCK) and final shas match the plan',plan.nodes.length===22&&plan.nodes.every(n=>sha(rd('pkgCK/patched/'+n.file))===n.base_sha&&sha(rd('pkgKF/patched/'+n.file))===n.final_sha));
T('every node has K-F LIVE and no K-F TRIAL; kfLines has no TRIAL mark',plan.nodes.every(n=>{const s=rd('pkgKF/patched/'+n.file);const i=s.indexOf('function kfLines('),j=s.indexOf('const KR_LINE=',i);return s.includes("'K-F':'LIVE'")&&!s.includes("'K-F':'TRIAL'")&&!/TRIAL rule/.test(s.slice(i,j));}));
T('no cure check splits the raw reply (19 cure nodes x 3 read through cureUnwrap)',plan.nodes.every(n=>!rd('pkgKF/patched/'+n.file).includes("String(reply&&reply.ok?reply.text:'').split('\\n')")));
const mk=p=>{const s=rd(p+'/patched/Panel_Cure_Check.js');return new Function('$','$input',s.slice(0,s.indexOf("const PP=$('Panel Payloads')"))+'\nreturn {cureVerdicts,cureRounds,cureJText,kfLines,ENF_STATUS};')(()=>{throw 0},null);};
const O=mk('pkgCK'),N=mk('pkgKF');
// cure replay, log items
const t=execSync('node corpus/replay_cure.cjs pkgCK pkgKF',{encoding:'utf8',maxBuffer:1<<26});
const rows=p=>{const o=[];let h=null;for(const l of t.split('\n')){const m=l.match(/^(pkg\w+) (\d+) (\S+): cure items/);if(m){h=m[1]===p?m[2]+' '+m[3]:null;continue;}if(h&&/^     [A-Z]/.test(l))o.push(h+' '+l.trim());}return o;};
const A=rows('pkgCK'),B=rows('pkgKF');const ch=B.filter((r,i)=>r!==A[i]);console.log('   cure rows replayed: '+B.length+'; rows that change: '+ch.length);ch.forEach(r=>console.log('     '+r.slice(0,200)));
T('the only rows that change are the 3 K-F items of 33006 chatgpt and sol, whose FORCED line is now found in the JSON reply',ch.length===3&&ch.every(r=>/^33006 (chatgpt|sol) K-F /.test(r)&&/FORCED line does not hold/.test(r)));
// 33006 has no node fixture: the quotes were checked against the stored rounds (pkgKF/q33006.json)
const Q=JSON.parse(rd('pkgKF/q33006.json'));T('33006: all 18 quotations of the 6 K-F cure FORCED lines stand in the stored rounds (chatgpt, sol, single would be CURED live)',Object.values(Q.found).length===6&&Object.values(Q.found).every(a=>a.length===3&&a.every(Boolean)));
// 33021 single has no saved body of its own; the rounds are the debate's, the same for every seat: take the panel's
{const F=JSON.parse(rd('corpus/fix_33021.json'));const R=N.cureRounds(F.PB.judges[0].body);const LG=JSON.parse(rd('corpus/raw/log_33021.json')).filter(x=>x.kind==='cure'&&x.seat==='single');
 const it=LG.filter(x=>x.rule==='K-F').map(x=>({rule:'K-F',link:x.item,line:x.flagged_line,side:'BOTH'}));const v=N.cureVerdicts(it,{ok:true,text:LG.find(x=>x.full_reply).full_reply},{},R);
 T('33021 single K-F D1 vs C1 on the debate rounds: CURED',v.length===1&&v[0].status==='CURED');}
// today's raise on every saved verdict with rounds
const raised=[];for(const run of ['32998','33014','33020','33021','33025','33040']){const F=JSON.parse(rd('corpus/fix_'+run+'.json'));const pool=[...(F.PB.judges||[]),...((F.alt&&F.alt.PB&&F.alt.PB.judges)||[])];
 for(const b of [...(F.bodies||[]),...((F.alt&&F.alt.bodies)||[])]){const J=pool.find(q=>q.seat===b.seat);if(!J)continue;for(const x of N.kfLines(N.cureJText(b.verdict_raw,true),N.cureRounds(J.body)).items)raised.push(run+' '+b.seat+' '+x.link+': '+x.why);}}
console.log('   K-F raised today on saved verdicts with rounds: '+raised.length);raised.forEach(r=>console.log('     '+r));
T('today\'s raise: 1 item, 33025 grok D5 vs C5 (ANSWER adds "therefore"; not in [DR3]): true; grok retracted it',raised.length===1&&/^33025 grok D5 vs C5: the ANSWER quotation is not in \[DR3\]$/.test(raised[0]));
T('32998 gemini D3 vs C1 (log item from the old reader) is not raised today',!raised.some(r=>/^32998 gemini/.test(r)));
// units
const R={CR3:'Here the press: the row denies the knowing through the pregnancy, plainly.',DR3:'So the abstinence runs to the birth. That is the pregnancy after the taking.'};
const FL='FORCED: D1 vs C2 -- MEANS [CR3]: "the row denies the knowing through the pregnancy" -- ANSWER [DR3]: "So the abstinence runs to the birth." -- FAILS: "That is the pregnancy after the taking."';
const it=[{rule:'K-F',side:'BOTH',link:'D1 vs C2',line:'D1 vs C2 (Matthew 1:25): CHALLENGER LINK BROKEN -- GROUND: forced'}];const cv=(M,txt)=>M.cureVerdicts(it,{ok:true,text:txt},{},R)[0];
const J=JSON.stringify({verdict_tag:'HELD',reasoning:'HELD.\nSTATEMENT: K-F D1 vs C2 | supplied.\nRESPONSE: K-F D1 vs C2 | Accepted; the FORCED line is supplied.\n'+FL});
T('unit: a FORCED line inside a JSON reply (chatgpt and sol form) cures with pkgKF; pkgCK read none',cv(N,J).status==='CURED'&&/no FORCED line/.test(cv(O,J).why));
T('unit: a plain-text reply cures as before',cv(N,'STATEMENT: K-F D1 vs C2 | x\nRESPONSE: K-F D1 vs C2 | Accepted.\n'+FL).status==='CURED'&&cv(O,'STATEMENT: K-F D1 vs C2 | x\nRESPONSE: K-F D1 vs C2 | Accepted.\n'+FL).status==='CURED');
T('unit: a JSON reply whose FORCED quote is not in the round stays UNCURED',cv(N,JSON.stringify({reasoning:'RESPONSE: K-F D1 vs C2 | Accepted.\n'+FL.replace('So the abstinence runs','So the abstinence ran')})).status==='UNCURED');
T('unit: no FORCED line stays UNCURED',cv(N,JSON.stringify({reasoning:'RESPONSE: K-F D1 vs C2 | NOT HELD'})).status==='UNCURED');
T('ENF_STATUS K-F is LIVE in the cure library',N.ENF_STATUS['K-F']==='LIVE'&&O.ENF_STATUS['K-F']==='TRIAL');
console.log(ok+' OK, '+bad+' FAIL');process.exit(bad?1:0);
