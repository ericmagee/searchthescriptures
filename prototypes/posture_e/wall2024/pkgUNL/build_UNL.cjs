// pkgUNL (run 33149; W1's own pkgUND fault). Base: live ff8967bb; the 4 Send Back nodes are pkgABS/patched cd5d7aa (which carries pkgUND 43622ed).
// Run from wall2024/: node pkgUNL/build_UNL.cjs
//  (1) the UND library is replaced by src_UNL.js: a [DR2] premise presses the link its "LINK <n>:" label names (pkgUND took the premise's
//      position as the link: 33149 premise 1 = LINK 6 was sent back as D1, premise 5 = LINK 3 as D5; sol's correct KEEP cost its seat);
//      the open-point test of an UNDERDETERMINED cure also reads "disputed", "dispute", "unsettled", "leaves ... to the other ...".
//  (2) Send Back Build (+Alt): the E-UNG item names the premise numbers that press the link.
const fs=require('fs');const crypto=require('crypto');const sha=s=>crypto.createHash('sha256').update(s).digest('hex').slice(0,16);
const OLD=fs.readFileSync('pkgUND/src_UND.js','utf8'),NEW=fs.readFileSync('pkgUNL/src_UNL.js','utf8');
const BASE='pkgABS/patched',OUT='pkgUNL/patched';fs.mkdirSync(OUT,{recursive:true});const plan={base:'live ff8967bb ('+BASE+' cd5d7aa)',nodes:[]};
const rep=(s,a,b,f)=>{const n=s.split(a).length-1;if(n!==1)throw new Error(f+': anchor found '+n+' times: '+a.slice(0,80));return s.replace(a,()=>b);};
const L0="item:'COLLISION D'+__m.n+' (pressed: [DR2] premise '+__m.n+')'",L1="item:'COLLISION D'+__m.n+' (pressed: [DR2] premise '+__m.ps+')'";
for(const f of ['Send_Back_Build.js','Alt_Send_Back_Build.js','Send_Back_Record.js','Alt_Send_Back_Record.js']){const s0=fs.readFileSync(BASE+'/'+f,'utf8');let s=rep(s0,OLD,NEW,f),e=1;
 if(/Build/.test(f)){s=rep(s,L0,L1,f);e++;}
 new Function('$','$input','$json',s);fs.writeFileSync(OUT+'/'+f,s);plan.nodes.push({file:f,base_sha:sha(s0),final_sha:sha(s),edits:e});console.log(f.padEnd(28),sha(s0),'->',sha(s),e+' edits');}
fs.writeFileSync('pkgUNL/plan_UNL.json',JSON.stringify(plan,null,1));
