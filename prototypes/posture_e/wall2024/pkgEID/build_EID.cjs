// pkgEID (W3 Wall 2893 lane 1 D9; W4 33389 report). DeepSeek enforcer fix, 4 nodes. Run 33389: one call (21 lines) was answered with lines keyed by
// judge name ("ENFORCER: gemini -- ..."), so 51 of 276 E-items got NO VERDICT; run 33411 call 4 wrote "ENFORCER: P1.1 (gemini) -- AGREE".
// Build (Judge Enforcer Build, Alt): the reply form says ITEM id, with an example, the id alone.
// Record (Judge Enforcer Record, Alt): (a) "ID (seat)" and "ID, seat" labels are read; (b) lines keyed by judge name are mapped onto the call's items in
// order ONLY when their count and judge sequence equal the call's items exactly; otherwise they stay NO VERDICT and enf428.errors names the label fault.
// (c) a bare item number ("ENFORCER: Y1 --", run 33249) is read as the call's one item Y1.x; with none or several, NO VERDICT and a label fault. Mapped rows carry no other change. enf428.eid counts both. Run from wall2024/: node pkgEID/build_EID.cjs [--base dir] [--out dir]
const fs=require('fs');const crypto=require('crypto');const sha=s=>crypto.createHash('sha256').update(s).digest('hex').slice(0,12);
const arg=(k,d)=>{const i=process.argv.indexOf(k);return i>0?process.argv[i+1]:d;};
const BASE=arg('--base','pkgEFG/patched_live_on_pkgEAM'),OUT=arg('--out','pkgEID/patched');
const rep=(s,a,b,f)=>{const n=s.split(a).length-1;if(n!==1)throw new Error(f+': anchor x'+n+': '+a.slice(0,60));return s.split(a).join(b);};
const B1a="'Reply with exactly one line per judge id, and nothing else, in this form:\\nENFORCER: <judge id> -- ";
const B1b="'Reply with exactly one line per ITEM id (the id alone, for example H2.1; never the judge\\'s name, and never the name beside the id), and nothing else, in this form:\\nENFORCER: <item id> -- ";
const RIGHT="(MEETS|MISSES|NOT VOID|VOID|BROKEN|STANDS|UNDERDETERMINED|COUNTED|SPARED|DOES NOT FOLLOW|FOLLOWS|TRUE|OVERSTATED)";
const R1a=" for(const l of txt.split('\\n')){const m=l.replace(/[*_`]+/g,'').trim().match(/^ENFORCER\\s*:\\s*(?:(?:ITEM|ANSWER|ID)\\s+)?([BVKYHZPR]\\d+\\.\\d+)\\s*(?:--|—|–|-)\\s*(AGREE|DISAGREE|NO ANSWER)\\s*(?:--|—|–|-)?\\s*(?:RIGHT\\s*:\\s*"+RIGHT+"\\s*(?:--|—|–|-)?)?\\s*(.*)$/i);\n  if(m)V[m[1].toUpperCase()]={v:m[2].toUpperCase(),right:(m[3]||'').toUpperCase(),why:m[4].trim()};}});";
const R1b=" /* pkgEID (W3 2893) */const __sk=[];\n for(const l of txt.split('\\n')){const __t=l.replace(/[*_`]+/g,'').trim();const m=__t.match(/^ENFORCER\\s*:\\s*(?:(?:ITEM|ANSWER|ID)\\s+)?([BVKYHZPR]\\d+(?:\\.\\d+)?)(?:\\s*(?:\\(\\s*[A-Za-z][\\w.-]*\\s*\\)|,\\s*[A-Za-z][\\w.-]*))?\\s*(?:--|—|–|-)\\s*(AGREE|DISAGREE|NO ANSWER)\\s*(?:--|—|–|-)?\\s*(?:RIGHT\\s*:\\s*"+RIGHT+"\\s*(?:--|—|–|-)?)?\\s*(.*)$/i);\n"+
 "  if(m&&!/\\./.test(m[1])){const __c=((B[i]||{}).ids||[]).filter(x=>String(x.id).toUpperCase().startsWith(m[1].toUpperCase()+'.'));if(__c.length!==1){__eid.unmapped++;errors.push('call '+(i+1)+': reply label '+m[1]+' names no single item of the call; NO VERDICT (pkgEID label fault)');continue;}__eid.bare_number++;m[1]=__c[0].id;}\n"+
 "  if(m){if(/^ENFORCER\\s*:\\s*(?:(?:ITEM|ANSWER|ID)\\s+)?[BVKYHZPR]\\d+\\.\\d+\\s*[(,]/i.test(__t))__eid.seat_beside_id++;V[m[1].toUpperCase()]={v:m[2].toUpperCase(),right:(m[3]||'').toUpperCase(),why:m[4].trim()};continue;}\n"+
 "  const s=__t.match(/^ENFORCER\\s*:\\s*(?:(?:JUDGE|SEAT)\\s+)?([A-Za-z][\\w.-]*)\\s*(?:--|—|–|-)\\s*(AGREE|DISAGREE|NO ANSWER)\\s*(?:--|—|–|-)?\\s*(?:RIGHT\\s*:\\s*"+RIGHT+"\\s*(?:--|—|–|-)?)?\\s*(.*)$/i);if(s&&!/^[BVKYHZPR]\\d/i.test(s[1]))__sk.push(s);}\n"+
 " if(__sk.length){const ids=((B[i]||{}).ids||[]);const seq=ids.map(x=>String(x.seat||'').toLowerCase()).join('|');\n"+
 "  if(ids.length===__sk.length&&__sk.map(s=>s[1].toLowerCase()).join('|')===seq){let n=0;ids.forEach((x,k)=>{const id=String(x.id).toUpperCase();if(V[id])return;const s=__sk[k];V[id]={v:s[2].toUpperCase(),right:(s[3]||'').toUpperCase(),why:s[4].trim()};n++;});__eid.mapped_by_order+=n;__eid.calls_mapped.push(i+1);}\n"+
 "  else{__eid.unmapped+=__sk.length;errors.push('call '+(i+1)+': '+__sk.length+' reply line(s) keyed by judge name, not item id, do not match the call\\'s '+ids.length+' item line(s) in count and judge order; those items stay NO VERDICT (pkgEID label fault)');}}});";
const R0a="const R=$input.all().map(x=>x.json);const V={};const errors=[];";
const R0b="const __eid={bare_number:0,seat_beside_id:0,mapped_by_order:0,calls_mapped:[],unmapped:0}; /* pkgEID */\n"+R0a;
const R2a="tally,errors},enf428_rows:rows";const R2b="tally,errors,eid:__eid},enf428_rows:rows";
fs.mkdirSync(OUT,{recursive:true});const plan={base:BASE,nodes:[]};
for(const f of ['Judge_Enforcer_Build.js','Alt_Judge_Enforcer_Build.js','Judge_Enforcer_Record.js','Alt_Judge_Enforcer_Record.js']){let s=fs.readFileSync(BASE+'/'+f,'utf8');const s0=s;
 if(/Build/.test(f))s=rep(s,B1a,B1b,f);else{s=rep(s,R0a,R0b,f);s=rep(s,R1a,R1b,f);s=rep(s,R2a,R2b,f);}
 new Function(s);fs.writeFileSync(OUT+'/'+f,s);plan.nodes.push({file:f,base_sha:sha(s0),final_sha:sha(s)});console.log(f.padEnd(30),sha(s0),'->',sha(s));}
fs.writeFileSync(OUT+'.plan.json',JSON.stringify(plan,null,1));console.log('->',OUT);
