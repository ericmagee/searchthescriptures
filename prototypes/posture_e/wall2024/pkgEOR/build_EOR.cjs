// pkgEOR (D7; W1 Wall 2881 option A; Eric's outside review of 33371: the challenger's "Note, outside the round" after FINAL WORDS). DeepSeek enforcer fix,
// side-neutral. Anticheat Build (the DeepSeek anti-cheat): each side's close is cut at its own out-of-round marker, so the out-of-round tail is never
// sent as close-round words (33371 X60 raised the note as REVERSED against the challenger). Judge Enforcer Build and Alt (E-OOR code check): an
// OUT-OF-ROUND CONCESSIONS line naming [CR4]/[DR4] whose sentence stands in that round's out-of-round tail is refused ("ENFORCER DISAGREE: ...").
// Bases: Anticheat Build from live s44 (unchanged since s39); Judge Enforcer Builds from --bbase (default pkgEFG/patched_live).
// Run from wall2024/: node pkgEOR/build_EOR.cjs [--bbase dir] [--out dir]
const fs=require('fs');const crypto=require('crypto');const sha=s=>crypto.createHash('sha256').update(s).digest('hex').slice(0,12);
const arg=(k,d)=>{const i=process.argv.indexOf(k);return i>0?process.argv[i+1]:d;};
const BB=arg('--bbase','pkgEFG/patched_live');const OUT=arg('--out','pkgEOR/patched_on_'+BB.replace(/\//g,'_'));const FB='/mnt/project-files/wall2024/fetchback_live_s44.json';
const LIB=fs.readFileSync(__dirname+'/eor_lib.js','utf8');
const rep=(s,a,b,f)=>{const n=s.split(a).length-1;if(n!==1)throw new Error(f+': anchor x'+n);return s.split(a).join(b);};
const A1="const SIDES={D:{name:'DEFENDER',close:F.cr4,";const A1b="/* pkgEOR */\n"+LIB+"const SIDES={D:{name:'DEFENDER',close:eorHead(F.cr4),";
const A2="C:{name:'CHALLENGER',close:F.dr4,";const A2b="C:{name:'CHALLENGER',close:eorHead(F.dr4),";
const J1="  const q=NQ(sent);if(q.split(' ').length>=4&&!NQ(RT[rd]).includes(q.slice(0,240)))cv4('E-OOR',j.seat,l,'the sentence is not found verbatim in ['+rd+'] (\"the verbatim sentence in which the ground was granted\")');";
const J1b=J1+"\n  if(/^(CR4|DR4)$/.test(rd)&&q.split(' ').length>=4){const __t=eorTail(RT[rd]);if(__t&&NQ(__t).includes(q.slice(0,240)))cv4('E-OOR',j.seat,l,'the sentence stands after the side\\'s own out-of-round marker in ['+rd+'] (\"outside the round\"); it is not a close-round concession (pkgEOR)');}";
const J0="const RT={CR1:R&&R.CR1,";const J0b="/* pkgEOR */\n"+LIB+J0;
const W=JSON.parse(fs.readFileSync(FB,'utf8'));const NS=(W.data||W).nodes||(W.data||W).workflow.nodes;
fs.mkdirSync(OUT,{recursive:true});const plan={bbase:BB,fb:FB,nodes:[]};
const out=(f,s0,s)=>{new Function('$','$input','$json','$execution','$workflow',s);fs.writeFileSync(OUT+'/'+f,s);plan.nodes.push({file:f,base_sha:sha(s0),final_sha:sha(s)});console.log(f.padEnd(30),sha(s0),'->',sha(s));};
{const s0=NS.find(n=>n.name==='Anticheat Build').parameters.jsCode;let s=rep(s0,A1,A1b,'AC D');s=rep(s,A2,A2b,'AC C');out('Anticheat_Build.js',s0,s);fs.mkdirSync(OUT+'_base',{recursive:true});fs.writeFileSync(OUT+'_base/Anticheat_Build.js',s0);}
for(const f of ['Judge_Enforcer_Build.js','Alt_Judge_Enforcer_Build.js']){const s0=fs.readFileSync(BB+'/'+f,'utf8');let s=rep(s0,J0,J0b,f+' lib');s=rep(s,J1,J1b,f+' eor');out(f,s0,s);}
fs.writeFileSync(OUT+'.plan.json',JSON.stringify(plan,null,1));console.log('->',OUT);
