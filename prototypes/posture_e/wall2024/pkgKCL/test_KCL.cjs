// pkgKCL test (K-CMT per-line commitment tag as TRIAL K-CMTL beside the LIVE grouped item; W3 Wall 2437, 2481). Run from wall2024/: node pkgKCL/test_KCL.cjs
const fs=require('fs');const crypto=require('crypto');const rd=f=>fs.readFileSync(f,'utf8');const sha=s=>crypto.createHash('sha256').update(s).digest('hex').slice(0,16);
const {execSync}=require('child_process');let ok=0,bad=0;const T=(n,c)=>{if(c){ok++;console.log('OK   '+n);}else{bad++;console.log('FAIL '+n);}};
const plan=JSON.parse(rd('pkgKCL/plan_KCL.json'));
T('22 nodes: base (pkgKF) and final shas match the plan; 19 cure nodes take 7 edits, 3 raise-only nodes 4',plan.nodes.length===22&&plan.nodes.every(n=>sha(rd('pkgKF/patched/'+n.file))===n.base_sha&&sha(rd('pkgKCL/patched/'+n.file))===n.final_sha&&n.edits.length===(n.cure?7:4))&&plan.nodes.filter(n=>n.cure).length===19);
const KL=p=>{const t=rd(p+'/patched/Panel_Cure_Check.js');const i=t.indexOf('function kcmtGrade2024'),j=t.indexOf('// WALL-2024 Commitment 11, K-RUL');return new Function(t.slice(i,j)+'\nreturn {kcmtLines2024,kcmtGrade2024};')();};
const KO=KL('pkgKF'),KN=KL('pkgKCL');
const C=rd('corpus/texts.jsonl').split('\n').filter(Boolean).map(l=>JSON.parse(l)).filter(o=>/^(verdict_gate|alt_verdict_gate|verdict_final)$/.test(o.src));
let same=true,nG=0,nL=0,lines=0;
for(const o of C){const T0=o.jtext;const a=KO.kcmtLines2024(T0),b=KN.kcmtLines2024(T0);const L=String(T0).split('\n').map(l=>l.trim()).filter(l=>l&&KO.kcmtGrade2024(l));
 const g=b.items.filter(x=>x.rule==='K-CMT'),pl=b.items.filter(x=>x.rule==='K-CMTL');nG+=g.length;nL+=pl.length;lines+=L.length;
 if(JSON.stringify(g)!==JSON.stringify(a.items)||JSON.stringify(b.marks)!==JSON.stringify(a.marks)||pl.length!==L.length)same=false;
 pl.forEach((x,k)=>{if(x.link!=='line '+(k+1)||!x.line.startsWith('"'+L[k].slice(0,400)+'"')||!x.line.includes('RESPONSE: K-CMTL line '+(k+1)+' |')||!x.line.includes('TRIAL rule'))same=false;});}
console.log('   '+C.length+' verdict texts: grouped K-CMT items '+nG+' (unchanged), K-CMTL items '+nL+' (one per contested line; '+lines+' lines)');
T('raise: the grouped LIVE K-CMT item and its mark are byte-identical; one TRIAL K-CMTL item per contested line, in order, quoted whole, its form named',same&&nL===lines&&nL>0);
const s=rd('pkgKCL/patched/Panel_Cure_Check.js');const M=new Function('$','$input',s.slice(0,s.indexOf("const PP=$('Panel Payloads')"))+'\nreturn {cureVerdicts,cureAsk,kcmtLines2024,ENF_STATUS};')(()=>{throw 0},null);
T('ENF_STATUS: K-CMT LIVE, K-CMTL TRIAL',M.ENF_STATUS['K-CMT']==='LIVE'&&M.ENF_STATUS['K-CMTL']==='TRIAL');
const V='D1 vs C2 (Luke 1:35): CHALLENGER LINK BROKEN -- the therefore grounds it -- GROUND: forced.\nKEYSTONE: D3 -- BROKEN -- the press stands.\nANSWER CHECK: Luke 1:34 -- [DR3] -- MEANS: "x y" -- ANSWER: "z w" -- MISSES -- the answer does not meet it.\nKEYSTONE: D4 -- BROKEN -- the second press stands.';
const it=M.kcmtLines2024(V).items;const ask=M.cureAsk(it,{});
T('prompt: the grouped item and 4 line items are listed ("K-CMTL line 1:" to "line 4:"), each naming its RESPONSE form',it.length===5&&ask.includes('K-CMT contested grades without a commitment:')&&[1,2,3,4].every(k=>ask.includes('K-CMTL line '+k+': "')&&ask.includes('RESPONSE: K-CMTL line '+k+' |')));
T('prompt: the shared-RESPONSE form appears once, with its example',ask.split('Several lines may share one RESPONSE').length===2&&ask.includes('RESPONSE: K-CMTL lines | line 1: (Commitment 3); line 2: (Commitment 7); line 4: NOT A GRADE.'));
const cv=txt=>M.cureVerdicts(it,{ok:true,text:txt},{},{}).map(v=>v.rule+' '+v.link.split(' ').slice(-1)+' '+v.status).join(', ');
const st=txt=>M.cureVerdicts(it,{ok:true,text:txt},{},{}).map(v=>v.status).join(',');
console.log('   example: '+cv('RESPONSE: K-CMTL lines | line 1: (Commitment 3); line 2: (Commitment 7); line 3: NOT A GRADE; line 4: (Commitment 3)'));
T('cure: one shared RESPONSE, each line with its own answer, cures all 4 lines and the grouped item',st('RESPONSE: K-CMTL lines | line 1: (Commitment 3); line 2: (Commitment 7); line 3: NOT A GRADE; line 4: (Commitment 3)')==='CURED,CURED,CURED,CURED,CURED');
T('cure: shared form with grouped numbers ("lines 1, 2: Commitment 3") answers both',st('RESPONSE: K-CMTL lines | lines 1, 2: Commitment 3; line 3: NOT A GRADE; line 4: Commitment 7')==='CURED,CURED,CURED,CURED,CURED');
T('cure: a line missing from the shared RESPONSE stays UNCURED (line 4); the others cure',st('RESPONSE: K-CMTL lines | line 1: (Commitment 3); line 2: (Commitment 7); line 3: NOT A GRADE')==='CURED,CURED,CURED,CURED,UNCURED');
T('cure: a segment naming no commitment stays UNCURED (line 2: accepted)',st('RESPONSE: K-CMTL lines | line 1: (Commitment 3); line 2: accepted; line 3: NOT A GRADE; line 4: Commitment 3')==='CURED,CURED,UNCURED,CURED,CURED');
T('cure: "line 1" in the shared RESPONSE does not answer line 10 or line 4 (exact numbers)',(()=>{const V11=Array.from({length:11},(_,k)=>'KEYSTONE: D'+(k+1)+' -- BROKEN -- reason '+k).join('\n');const i11=M.kcmtLines2024(V11).items.filter(x=>x.rule==='K-CMTL');const r=M.cureVerdicts(i11,{ok:true,text:'RESPONSE: K-CMTL lines | line 1: Commitment 3; line 10: Commitment 7'},{},{}).map(v=>v.status);return r[0]==='CURED'&&r[9]==='CURED'&&r.filter(x=>x==='CURED').length===2;})());
T('cure: one RESPONSE per line cures each',st('RESPONSE: K-CMTL line 1 | (Commitment 3)\nRESPONSE: K-CMTL line 2 | Commitment 7\nRESPONSE: K-CMTL line 3 | NOT A GRADE\nRESPONSE: K-CMTL line 4 | Commitment 3')==='CURED,CURED,CURED,CURED,CURED');
T('cure: the grouped answer alone (as today) cures the LIVE grouped item; the TRIAL line items stay UNCURED',st('RESPONSE: K-CMT contested grades without a commitment | Commitment 3 for every line.')==='CURED,UNCURED,UNCURED,UNCURED,UNCURED');
T('cure: the grouped LIVE item is not cured by a K-CMTL answer that names no commitment',st('RESPONSE: K-CMTL lines | line 1: accepted')==='UNCURED,UNCURED,UNCURED,UNCURED,UNCURED');
{const one=M.kcmtLines2024('KEYSTONE: D3 -- BROKEN -- the press stands.').items;T('one contested line: 1 grouped + 1 line item, no shared-form example; bare "RESPONSE: K-CMT | Commitment 3" still cures the grouped item',one.length===2&&!one[1].line.includes('Several lines')&&M.cureVerdicts(one,{ok:true,text:'RESPONSE: K-CMT | Commitment 3'},{},{})[0].status==='CURED');}
// LIVE effect: no seat can lose by this package. Live uncured counts only K-CMT (LIVE); the grouped item is identical and gains one more way to cure.
const t=execSync('node corpus/replay_cure.cjs pkgKF pkgKCL',{encoding:'utf8',maxBuffer:1<<26});const rows=p=>{const o=[];let h=null;for(const l of t.split('\n')){const m=l.match(/^(pkg\w+) (\d+) (\S+): cure items/);if(m){h=m[1]===p?m[2]+' '+m[3]:null;if(h)o.push(l.replace(/^pkg\w+ /,''));continue;}if(h&&/^     [A-Z]/.test(l))o.push(h+' '+l.trim());}return o;};
const A=rows('pkgKF'),B=rows('pkgKCL');T('cure replay of the logged items: identical pkgKF and pkgKCL, LIVE uncured counts included ('+B.length+' lines)',A.length===B.length&&A.every((x,i)=>x===B[i]));
console.log(ok+' OK, '+bad+' FAIL');process.exit(bad?1:0);
