// pkgKCL test (K-CMT per-line commitment tag, W3 Wall 2437). Run from wall2024/: node pkgKCL/test_KCL.cjs
const fs=require('fs');const crypto=require('crypto');const rd=f=>fs.readFileSync(f,'utf8');const sha=s=>crypto.createHash('sha256').update(s).digest('hex').slice(0,16);
const {execSync}=require('child_process');let ok=0,bad=0;const T=(n,c)=>{if(c){ok++;console.log('OK   '+n);}else{bad++;console.log('FAIL '+n);}};
const plan=JSON.parse(rd('pkgKCL/plan_KCL.json'));
T('22 nodes: base (pkgKF) and final shas match the plan',plan.nodes.length===22&&plan.nodes.every(n=>sha(rd('pkgKF/patched/'+n.file))===n.base_sha&&sha(rd('pkgKCL/patched/'+n.file))===n.final_sha));
const KL=p=>{const t=rd(p+'/patched/Panel_Cure_Check.js');const i=t.indexOf('function kcmtGrade2024'),j=t.indexOf('// WALL-2024 Commitment 11, K-RUL');return new Function(t.slice(i,j)+'\nreturn {kcmtLines2024,kcmtGrade2024};')();};
const KO=KL('pkgKF'),KN=KL('pkgKCL');
const C=rd('corpus/texts.jsonl').split('\n').filter(Boolean).map(l=>JSON.parse(l)).filter(o=>/^(verdict_gate|alt_verdict_gate|verdict_final)$/.test(o.src));
let same=true,nOld=0,nNew=0,lines=0;const per=[];
for(const o of C){const T0=o.jtext;const a=KO.kcmtLines2024(T0),b=KN.kcmtLines2024(T0);const L=String(T0).split('\n').map(l=>l.trim()).filter(l=>l&&KO.kcmtGrade2024(l));
 nOld+=a.items.length;nNew+=b.items.length;lines+=L.length;if(L.length)per.push(o.run+' '+o.seat+' '+o.src+' '+L.length);
 if(b.items.length!==L.length||(a.items.length?1:0)!==(L.length?1:0)||b.marks.length!==a.marks.length)same=false;
 b.items.forEach((x,k)=>{if(x.link!=='line '+(k+1)||!x.line.startsWith('"'+L[k].slice(0,400)+'"')||!x.line.includes('RESPONSE: K-CMT line '+(k+1)+' |'))same=false;});}
console.log('   '+C.length+' verdict texts: '+nOld+' K-CMT items before, '+nNew+' after (one per contested line; '+lines+' lines)');console.log('   per judgment: '+per.join('; '));
T('raise: the contested lines are unchanged; one item per line, "line k" in order, the line quoted whole, its own RESPONSE form named',same&&nNew===lines&&nNew>nOld);
// cure prompt
const s=rd('pkgKCL/patched/Panel_Cure_Check.js');const M=new Function('$','$input',s.slice(0,s.indexOf("const PP=$('Panel Payloads')"))+'\nreturn {cureVerdicts,cureAsk,kcmtLines2024};')(()=>{throw 0},null);
const V='D1 vs C2 (Luke 1:35): CHALLENGER LINK BROKEN -- the therefore grounds it -- GROUND: forced.\nKEYSTONE: D3 -- BROKEN -- the press stands.\nANSWER CHECK: Luke 1:34 -- [DR3] -- MEANS: "x y" -- ANSWER: "z w" -- MISSES -- the answer does not meet it.';
const it=M.kcmtLines2024(V).items;const ask=M.cureAsk(it,{});
T('cure prompt: three lines give three flagged items, "K-CMT line 1:" to "K-CMT line 3:", each with its own RESPONSE form',it.length===3&&[1,2,3].every(k=>ask.includes('K-CMT line '+k+': "')&&ask.includes('RESPONSE: K-CMT line '+k+' |')));
const cv=txt=>M.cureVerdicts(it,{ok:true,text:txt},{},{}).map(v=>v.status).join(',');
T('cure: each line answered with its Commitment N cures all three',cv('RESPONSE: K-CMT line 1 | (Commitment 3)\nRESPONSE: K-CMT line 2 | Commitment 7 applies.\nRESPONSE: K-CMT line 3 | NOT A GRADE: MISSES is the answer check verdict.')==='CURED,CURED,CURED');
T('cure: a line left unanswered stays UNCURED (line 2)',cv('RESPONSE: K-CMT line 1 | (Commitment 3)\nRESPONSE: K-CMT line 3 | Commitment 3')==='CURED,UNCURED,CURED');
T('cure: a RESPONSE naming no commitment stays UNCURED',cv('RESPONSE: K-CMT line 1 | Accepted.\nRESPONSE: K-CMT line 2 | Commitment 7\nRESPONSE: K-CMT line 3 | Commitment 3')==='UNCURED,CURED,CURED');
T('cure: one bare "RESPONSE: K-CMT | Commitment 3" does not answer three lines',cv('RESPONSE: K-CMT | Commitment 3 for all of them.')==='UNCURED,UNCURED,UNCURED');
T('cure: with a RESPONSE written, the line\'s STATEMENT may carry the Commitment N',cv('STATEMENT: K-CMT line 1 | the grade applies Commitment 3.\nRESPONSE: K-CMT line 1 | Accepted.\nRESPONSE: K-CMT line 2 | Commitment 7\nRESPONSE: K-CMT line 3 | Commitment 3')==='CURED,CURED,CURED');
{const one=M.kcmtLines2024('KEYSTONE: D3 -- BROKEN -- the press stands.').items;T('cure: a judgment with one contested line is still answered by the bare "RESPONSE: K-CMT | Commitment 3" (pkgKCMT fallback)',one.length===1&&M.cureVerdicts(one,{ok:true,text:'RESPONSE: K-CMT | Commitment 3'},{},{})[0].status==='CURED');}
{const V11=Array.from({length:11},(_,k)=>'KEYSTONE: D'+(k+1)+' -- BROKEN -- reason '+k).join('\n');const i11=M.kcmtLines2024(V11).items;const r=M.cureVerdicts(i11,{ok:true,text:'RESPONSE: K-CMT line 10 | Commitment 3'},{},{}).map(v=>v.status);
 T('cure: "K-CMT line 10" answers line 10 only, not line 1 (word-edge match)',i11.length===11&&r[9]==='CURED'&&r[0]==='UNCURED'&&r.filter(x=>x==='CURED').length===1);}
// cure replay on log items: the cure code is unchanged, so log items replay the same
const t=execSync('node corpus/replay_cure.cjs pkgKF pkgKCL',{encoding:'utf8',maxBuffer:1<<26});const rows=p=>{const o=[];let h=null;for(const l of t.split('\n')){const m=l.match(/^(pkg\w+) (\d+) (\S+): cure items/);if(m){h=m[1]===p?m[2]+' '+m[3]:null;if(h)o.push(l.replace(/^pkg\w+ /,''));continue;}if(h&&/^     [A-Z]/.test(l))o.push(h+' '+l.trim());}return o;};
const A=rows('pkgKF'),B=rows('pkgKCL');T('cure replay of the logged items: identical pkgKF and pkgKCL ('+B.length+' lines)',A.length===B.length&&A.every((x,i)=>x===B[i]));
console.log(ok+' OK, '+bad+' FAIL');process.exit(bad?1:0);
