// pkgGKW test. Run from wall2024/: node pkgGKW/test_GKW.cjs
const fs=require('fs');let ok=0,bad=0;const T=(n,c,d)=>{if(c){ok++;console.log('OK   '+n);}else{bad++;console.log('FAIL '+n+(d?' -- '+d:''));}};
const mk=dir=>{const AM=fs.readFileSync(dir+'Alternate_Merge.js','utf8');const i0=AM.indexOf("const AM=$('Alternate Merge Seat')");const lib=AM.slice(0,i0);if(i0<0)throw new Error('library end not found');
 return new Function('$','$input',lib+'\nreturn {sbApply2024,gateItems2024,gateCure2024};')(()=>{throw new Error('offline');},null);};
const B=mk('pkgG4W/patched/'),N=mk('pkgGKW/patched/');
// grok 32998 shape: the judge text keeps KEYSTONE D6 STANDS; its send-back S19 sets KEYSTONE D6 BROKEN with no D6 collision graded DEFENDER LINK BROKEN, so E-APPLY refuses it
const raw='KEYSTONE: D6 -- STANDS -- D6 is not graded DEFENDER LINK BROKEN.\nCONCEDED LINKS: 0\nD6 vs C6 (Romans 1:3): CHALLENGER LINK BROKEN -- GROUND: [L1] Romans 1:3 "made of the seed of David according to the flesh" with [L3] Matthew 1:18 "she was found with child of the Holy Ghost."\nD1 vs C1 (Luke 1:35): STANDS -- GROUND: x.\nCLAUSE: HELD n=2 w=0 k=0\nRESULT: DEFENDER WINS';
const F={verdict_tag:'HELD',defense_standing:'SELF-SUPPORTED',conceded_links:0,challenge_standing:'COLLAPSED',challenger_conceded_links:1};
const its=[{seat:'grok',sid:'S19',ans:'CHANGE',line:'KEYSTONE: D6 -- STANDS -- D6 is not graded DEFENDER LINK BROKEN.',to:'KEYSTONE: D6 -- BROKEN -- D6 is broken at D6 vs C6 because it cannot agree with the loins-seed through Joseph.'}];
const ctx={R:null,DL:[],ask:false};
for(const [nm,M] of [['base',B],['new',N]]){const G=M.gateItems2024('grok',raw,F,its,ctx).items;
 T(nm+': S19 raises one gate item, CONTRADICTION from E-APPLY S19',G.length===1&&G[0].kind==='CONTRADICTION'&&G[0].src==='E-APPLY S19',JSON.stringify(G.map(x=>[x.gid,x.kind,x.src])));}
const G=N.gateItems2024('grok',raw,F,its,ctx).items;
const run=(M,reply)=>M.gateCure2024('grok',raw,F,its,G,reply,ctx);
const rb=run(B,'GATE: G1 || KEEP || The collision keeps D6 on Matthew 1:18.');const rn=run(N,'GATE: G1 || KEEP || The collision keeps D6 on Matthew 1:18.');
const r0=x=>(x.res||x.results||x.items||x)[0]||x;const pick=x=>Array.isArray(x)?x[0]:(x.res?x.res[0]:(x.results?x.results[0]:null));
const b1=pick(rb),n1=pick(rn);
T('base (live be10d6ae): KEEP on G1 is UNCURED, as on 32998 (row 5040)',b1&&!b1.cured&&/KEEP does not cure/.test(b1.why),JSON.stringify(b1));
T('new: KEEP on G1 is CURED, recorded "change withdrawn"',n1&&n1.cured&&/change withdrawn/.test(n1.why),JSON.stringify(n1));
// a CHANGE answer on the same item behaves as before
const cb=pick(run(B,'GATE: G1 || CHANGE TO: KEYSTONE: D6 -- STANDS -- kept. || x')),cn=pick(run(N,'GATE: G1 || CHANGE TO: KEYSTONE: D6 -- STANDS -- kept. || x'));
T('a CHANGE answer to G1 is decided the same in base and new',cb&&cn&&cb.cured===cn.cured&&cb.why===cn.why,JSON.stringify([cb,cn]));
// silence still counts
const sn=pick(run(N,''));T('new: no GATE line for G1 stays UNCURED (silence counts)',sn&&!sn.cured&&/silence/.test(sn.why));
// a CONTRADICTION with both lines in the judge text (E-GATE B, 2243) is not cured by KEEP
const GB=[{gid:'G1',kind:'CONTRADICTION',src:'E-GATE B',key:'CONTRADICTION|B|x',why:'w',lines:['D1 vs C1 (Luke 1:35): STANDS -- GROUND: x.'],live:true}];
const kb=N.gateCure2024('grok',raw,F,[],GB,'GATE: G1 || KEEP || y',ctx);const k1=pick(kb);
T('new: KEEP on an E-GATE B CONTRADICTION stays UNCURED (2243)',k1&&!k1.cured&&/KEEP does not cure/.test(k1.why),JSON.stringify(k1));
// the prompt states it
for(const f of ['Gate_Build','Alt_Gate_Build']){const s=fs.readFileSync('pkgGKW/patched/'+f+'.js','utf8');T(f+' prompt tells the judge KEEP withdraws an E-APPLY contradiction',s.includes('A KEEP also answers a CONTRADICTION item whose source is E-APPLY'));}
// the six nodes share the changed library
const L=f=>{const s=fs.readFileSync('pkgGKW/patched/'+f+'.js','utf8');return s.includes('wd2299')&&(s.match(/wd2299/g)||[]).length===3;};
for(const f of ['Gate_Build','Alt_Gate_Build','Gate_Record','Alt_Gate_Record','Alternate_Merge','Alternate_Merge_Seat'])T(f+' carries the KEEP-withdraw code',L(f));
console.log(ok+' OK, '+bad+' FAIL');process.exit(bad?1:0);
