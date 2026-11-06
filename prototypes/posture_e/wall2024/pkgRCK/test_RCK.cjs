// pkgRCK test (K-RECHK, W3 Wall 2493). Run from wall2024/: node pkgRCK/test_RCK.cjs
const fs=require('fs');const crypto=require('crypto');const rd=f=>fs.readFileSync(f,'utf8');const sha=s=>crypto.createHash('sha256').update(s).digest('hex').slice(0,16);
const {execSync}=require('child_process');let ok=0,bad=0;const T=(n,c)=>{if(c){ok++;console.log('OK   '+n);}else{bad++;console.log('FAIL '+n);}};
const plan=JSON.parse(rd('pkgRCK/plan_RCK.json'));
T('22 nodes: base (pkgKCL) and final shas match the plan; 19 cureRewrite nodes carry the marks, 3 raise-only nodes the helper only',plan.nodes.length===22&&plan.nodes.every(n=>sha(rd('pkgKCL/patched/'+n.file))===n.base_sha&&sha(rd('pkgRCK/patched/'+n.file))===n.final_sha&&n.edits.length===(n.cure?2:1))&&plan.nodes.filter(n=>n.cure).length===19);
const s=rd('pkgRCK/patched/Panel_Cure_Check.js');const M=new Function('$','$input',s.slice(0,s.indexOf("const PP=$('Panel Payloads')"))+'\nreturn {rechk2024,cureRewrite,cureRounds};')(()=>{throw 0},null);
const rounds=(run,seat)=>{try{const F=JSON.parse(rd('corpus/fix_'+run+'.json'));const pool=[...(F.PB.judges||[]),...((F.alt&&F.alt.PB&&F.alt.PB.judges)||[])];const J=pool.find(q=>q.seat===seat)||pool[0];return J?M.cureRounds(J.body):null;}catch(e){return null;}};
// every CHANGE TO in the logged send-back and gate replies, paired with its flagged (original) line
const pairs=[];for(const f of fs.readdirSync('corpus/raw').filter(f=>/^log_\d+\.json$/.test(f)).sort()){const run=f.slice(4,9);const LG=JSON.parse(rd('corpus/raw/'+f));
 for(const x of LG.filter(x=>x.full_reply&&(x.rule==='E-GATE'||x.kind==='send_back'))){const R=String(x.full_reply).replace(/\\n/g,'\n').replace(/\\"/g,'"');
  for(const l of R.split('\n')){const m=l.match(/^\W*(?:SENDBACK|GATE)?\s*:?\s*(?:ITEM\s*)?#?\s*([SG]\s*\d+)\s*:?\s*\|\|\s*CHANGE TO:\s*(.*?)\s*(?:\|\||$)/i);if(!m)continue;const id=m[1].replace(/\s+/g,'').toUpperCase();
   let o=LG.find(y=>y.seat===x.seat&&y.rule===x.rule&&String(y.item||'').toUpperCase().startsWith(id+' '));if(!o&&id[0]==='S'){const sb=LG.filter(y=>y.seat===x.seat&&y.kind==='send_back'&&y.rule!=='E-APPLY'&&y.rule!=='E-GATE'&&y.full_reply==null||(y.seat===x.seat&&y.kind==='send_back'&&y.rule!=='E-APPLY'&&y.rule!=='E-GATE'&&y.id===x.id)).sort((a,b)=>a.id-b.id);o=sb[+id.slice(1)-1]||null;} /* send-back items are S1..Sn in the seat's row order */const to=m[2].replace(/^["“]+([\s\S]*?)["”]+$/,(a,c)=>c);
   pairs.push({run,seat:x.seat,id,orig:o?String(o.flagged_line||''):'',to});}}}
const hits=[];for(const p of pairs){for(const h of M.rechk2024([[p.orig,p.to]],rounds(p.run,p.seat)))hits.push({...p,h});}
const seen=new Set();const U=hits.filter(x=>{const k=x.run+x.seat+x.h.rule+x.h.line;if(seen.has(k))return false;seen.add(k);return true;});
console.log('   CHANGE TO pairs: '+pairs.length+' ('+pairs.filter(p=>p.orig).length+' with the flagged line); distinct hits: '+U.length);
U.forEach(x=>console.log('     '+x.run+' '+x.seat+' '+x.id+' '+x.h.rule+' '+(x.h.old===null?'NOT CHECKED':x.h.old?'ALREADY IN THE ORIGINAL':'NEW')+' | '+x.h.line.slice(0,90)+' || ORIGINAL: '+(x.h.orig||'(not paired in the log)').slice(0,90)));
T('33040 grok: the corrected CHALLENGER CONCEDED LINKS line raises K-CMT',U.some(x=>x.run==='33040'&&x.seat==='grok'&&x.h.rule==='K-CMT'&&/^CHALLENGER CONCEDED LINKS: 4/.test(x.h.line)));
const g6=U.filter(x=>x.run==='33006'&&x.seat==='gemini'&&x.h.rule==='K-CMT'&&/^ANSWER CHECK:/.test(x.h.line));
T('33006 gemini: the 8 ANSWER CHECK lines raise, each NEW or ALREADY IN THE ORIGINAL with its original shown',g6.length===8&&g6.every(x=>typeof x.h.old==='boolean'&&x.h.orig!==undefined));
const other=U.filter(x=>!(x.run==='33040'&&x.seat==='grok')&&!(x.run==='33006'&&x.seat==='gemini')&&!(x.run==='32998'&&x.seat==='grok'&&/^KEYSTONE: D6/.test(x.h.line)));
T('no other corpus change raises (32998 grok KEYSTONE D6, from the 2492 count, aside): '+other.length,other.length===0);
// cureRewrite unit: marks after the SUPERSEDED marks, nothing else changed
const raw='KEYSTONE: D3 -- STANDS (Commitment 3) -- the press is answered.\nRESULT: DEFENDER WINS';const R={rp:[['KEYSTONE: D3 -- STANDS (Commitment 3) -- the press is answered.','KEYSTONE: D3 -- BROKEN -- the press stands.']],audit:'[AUDIT v24: X]',fields:{}};
const a=M.cureRewrite(raw,false,R,'grok',null);const base=a.split('\n[AUDIT v39: K-RECHK')[0];
T('unit: a change that drops the Commitment N gives one K-RECHK mark, NEW, after the SUPERSEDED mark',/\[AUDIT v27: SUPERSEDED LINE[^\n]*\n\[AUDIT v39: K-RECHK -- SEAT: grok; RULE: K-CMT; NEW: /.test(a)&&a.split('K-RECHK').length===2);
const b=M.cureRewrite('KEYSTONE: D3 -- BROKEN -- old reason.',false,{...R,rp:[['KEYSTONE: D3 -- BROKEN -- old reason.','KEYSTONE: D3 -- BROKEN -- the press stands.']]},'grok',null);
T('unit: the original had the same fault: ALREADY IN THE ORIGINAL',/RULE: K-CMT; ALREADY IN THE ORIGINAL/.test(b));
const c=M.cureRewrite(raw,false,{...R,rp:[[R.rp[0][0],'KEYSTONE: D3 -- BROKEN (Commitment 3) -- the press stands.']]},'grok',null);
T('unit: a change that keeps its Commitment N gives no mark',!/K-RECHK/.test(c));
T('unit: with no rounds, a changed FORCED line is marked NOT CHECKED, not NEW',/RULE: K-F; NOT CHECKED: not re-checked: no rounds/.test(M.cureRewrite('x',false,{rp:[['D1 vs C2 (Luke 1:35): STANDS (Commitment 3)','D1 vs C2 (Luke 1:35): STANDS (Commitment 3)\nFORCED: D1 vs C2 -- MEANS [CR3]: "a" -- ANSWER [DR3]: "b" -- FAILS: "b"']],audit:'',fields:{}},'grok',null)));
// whole nodes on saved inputs: only K-RECHK marks differ
const strip=t=>t.replace(/\\n\[AUDIT v39: K-RECHK[^\]]*?; END\]/g,'').replace(/\n\[AUDIT v39: K-RECHK[^\n]*/g,'');let same=true,n=0,mk=0;
for(const run of ['32998','33014','33020','33021','33025','33040'])for(const node of ['Panel_Cure_Check','Gate_Record','Alternate_Merge','Alternate_Merge_Seat']){let x,y;try{x=execSync('node corpus/replay_node.cjs pkgKCL '+run+' '+node+' 2>/dev/null',{encoding:'utf8',maxBuffer:1<<28});y=execSync('node corpus/replay_node.cjs pkgRCK '+run+' '+node+' 2>/dev/null',{encoding:'utf8',maxBuffer:1<<28});}catch(e){continue;}
 n++;mk+=(y.match(/K-RECHK -- /g)||[]).length;if(strip(x)!==strip(y)){same=false;console.log('     differs beyond K-RECHK: '+run+' '+node);}}
console.log('   whole-node replays: '+n+'; K-RECHK marks added: '+mk);
T('whole nodes on the 6 saved runs: output identical to pkgKCL apart from K-RECHK marks',same);
console.log(ok+' OK, '+bad+' FAIL');process.exit(bad?1:0);
