// pkgEC test (W3 2333). Run from wall2024/ after the build: node pkgEC/test_EC.cjs
const fs=require('fs');const crypto=require('crypto');const rd=f=>fs.readFileSync(f,'utf8');const sha=s=>crypto.createHash('sha256').update(s).digest('hex').slice(0,16);
let ok=0,bad=0;const T=(n,c,d)=>{if(c){ok++;console.log('OK   '+n);}else{bad++;console.log('FAIL '+n+(d?' -- '+d:''));}};
const plan=JSON.parse(rd('pkgEC/plan_EC.json'));
T('2 nodes: base (pkgFC) and final shas match the plan',plan.nodes.length===2&&plan.nodes.every(n=>sha(rd('pkgFC/patched/'+n.file))===n.base_sha&&sha(rd('pkgEC/patched/'+n.file))===n.final_sha));
T('both nodes parse as n8n Code node bodies',plan.nodes.every(n=>{try{new Function('$','$input',rd('pkgEC/patched/'+n.file));return true;}catch(e){console.log('   '+e.message);return false;}}));
T('the only change from pkgFC is the E-COL group key line',plan.nodes.every(n=>{const a=rd('pkgFC/patched/'+n.file).split('\n'),b=rd('pkgEC/patched/'+n.file).split('\n');return a.length===b.length&&a.filter((l,i)=>l!==b[i]).length===1;}));
// the E-COL grouping block of a node, run on judge texts
const grouper=file=>{const s=rd(file);const a=s.indexOf('const CG=[];'),b=s.indexOf('let ci=0;',a);const nN=s.indexOf('const N=');const N=s.slice(nN,s.indexOf('\n',nN));
 return new Function('judges',N+'\n'+s.slice(a,b)+'\nreturn CG;');};
const OLD=grouper('pkgFC/patched/Judge_Enforcer_Build.js'),NEW=grouper('pkgEC/patched/Judge_Enforcer_Build.js'),ALT=grouper('pkgEC/patched/Alt_Judge_Enforcer_Build.js');
const one=s=>String(s).replace(/\\+/g,'').replace(/[*_`]+/g,'').replace(/\s+/g,' ').trim();
const own=(CG,judges)=>{const bad=[];for(const g of CG)for(const s of g.seats){const t=judges.find(j=>j.seat===s).t.split('\n').map(l=>one(l.replace(/^[\s*\-•]+/,'')));if(!t.includes(one(g.line)))bad.push(s+': '+g.line.slice(0,40));}return bad;};
// unit: two judges whose FORCED lines agree past 160 characters and differ in FAILS; and two judges with the same line in full
const P='FORCED: D1 vs C2 -- MEANS [CR3]: "the pregnancy was found before the marital union" -- ANSWER [DR3]: "So 1:18 dates the finding before the taking into his house, inside the espousal." -- FAILS: ';
const J=[{seat:'chatgpt',t:P+'"In 1 Corinthians 7:5 the word again names a couple."\nD2 vs C3: CHALLENGER LINK BROKEN -- x'},{seat:'grok',t:P+'"That is where my link places the knowing."\nD2 vs C3: CHALLENGER LINK BROKEN -- x'}];
{const o=OLD(J),n=NEW(J);T('pkgFC: the two FORCED lines are merged into one group and grok is given chatgpt\'s line',own(o,J).length===1&&/^grok/.test(own(o,J)[0]));
 T('pkgEC: each judge\'s E-COL item carries its own line ('+n.length+' groups)',own(n,J).length===0&&n.filter(g=>/^FORCED/.test(g.line)).length===2);
 T('pkgEC: an identical line in two seats is one item per seat',n.filter(g=>/^D2 vs C3/.test(g.line)).length===2&&n.every(g=>g.seats.length===1));
 T('Alt Judge Enforcer Build groups the same way',JSON.stringify(ALT(J))===JSON.stringify(n));}
// replay: run 33020 (execution data) and 32998 (fixture), every E-COL group on pkgFC and on pkgEC
const runs=[['33020',JSON.parse(rd('pkgGD/probe_33020/fixture_33020.json')).bodies],['32998',JSON.parse(rd('pkgGD/fixture_32998.json')).bodies]];
const AM=rd('pkgGDUP/patched/Alternate_Merge.js');const M=new Function('$','$input',AM.slice(0,AM.indexOf("const AM=$('Alternate Merge Seat')"))+'\nreturn {cureJText};')(()=>{throw new Error('offline');},null);
const out=[];let merges=0,wrong=0;
for(const [run,B] of runs){const J=B.map(b=>({seat:b.seat,t:M.cureJText(b.verdict_raw,true)}));const o=OLD(J),n=NEW(J);
 const cross=o.filter(g=>g.seats.length>1);merges+=cross.length;const w=own(o,J);wrong+=w.length;
 out.push(run+': pkgFC '+o.length+' E-COL groups, '+cross.length+' cross-seat ('+(cross.map(g=>g.seats.join('+')+' '+g.line.slice(0,18)).join('; ')||'none')+'), seats given a line not their own: '+(w.join('; ')||'none')+'; pkgEC '+n.length+' items, seats given a line not their own: '+(own(n,J).join('; ')||'none'));
 T(run+': on pkgEC every E-COL item carries its own seat\'s line',own(n,J).length===0);}
T('33020: pkgFC reproduces the live fault (grok given chatgpt\'s FORCED D1 vs C2)',/grok: FORCED: D1 vs C2/.test(out[0]));
console.log('\n--- replay ---\n'+out.join('\n'));
console.log('From debate_enforcer_log (every E-COL enforcer_check row, runs 32725 to 33020), the cross-seat merges are 32936 COLLISION D1 vs C2 (chatgpt+grok; grok held a different FAILS: "Matthew sets the coming-together by what follows ...") and 33020 COLLISION D1 vs C2 (chatgpt+grok). Both gave grok chatgpt\'s line. There is no other cross-seat merge.');
console.log('\n'+ok+' OK, '+bad+' FAIL');
