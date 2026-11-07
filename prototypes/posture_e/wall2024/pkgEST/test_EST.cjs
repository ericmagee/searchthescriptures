// pkgEST test: base s49 vs patched Enforcer Build on every saved run that has Enforcer Build saved (harness, fetchback_live_s49).
// The output must be identical once the pkgEST rule sentence, the "RESPONSE: " label and the added " || STATEMENT: ..." are removed.
// Counts the STATEMENT lines attached per run and prints one built 33461 answer line (sol).
const fs=require('fs');const {harness,feeder}=require('../pkgGSL/harness.cjs');const D='/mnt/project-files/wall2024/inputs/';const rd=f=>fs.readFileSync(f,'utf8');
const F='/mnt/project-files/wall2024/fetchback_live_s49.json';const node='Enforcer Build';const IN=feeder(F,node)[0];
const A=rd('pkgEST/base_s49/Enforcer_Build.js'),B=rd('pkgEST/patched/Enforcer_Build.js');
const RS='A judge may give its answer in its RESPONSE or in its STATEMENT for the item (shown after "|| STATEMENT:"). Read the form from either line: when one of them is in the rule\'s form, judge that form and its reason; NO ANSWER only when neither line is in a form (pkgEST).\n';
const LN=/(^|\n)(- A\d+\.\d+ \([^)\n]*\): )RESPONSE: ([^\n]*?)(?: \|\| STATEMENT: [^\n]*)?(?=\n|$)/g;
const strS=t=>t.split(RS).join('').replace(LN,'$1$2$3');
const walk=o=>typeof o==='string'?strS(o):Array.isArray(o)?o.map(walk):(o&&typeof o==='object')?Object.fromEntries(Object.entries(o).map(([k,v])=>[k,walk(v)])):o;
const runs=[...new Set(fs.readdirSync(D).filter(x=>/^33\d{3}_Enforcer_Build\.json$/.test(x)).map(x=>x.slice(0,5)))].sort();
let ok=0,bad=0,tot=0,ans=0;const per=[];
(async()=>{for(const R of runs){const run=async c=>{try{return await harness(R)('return (async()=>{'+c+'\n})()',IN);}catch(e){return 'ERR '+e.message;}};
 const a=await run(A),b=await run(B);const sa=JSON.stringify(a),sb=JSON.stringify(b);
 if(typeof a==='string'||typeof b==='string'){if(sa===sb){ok++;per.push(R+': same error/empty');}else{bad++;console.log('FAIL '+R+' '+sa.slice(0,120)+' | '+sb.slice(0,120));}continue;}
 const nb=JSON.stringify(walk(b));if(nb===sa)ok++;else{bad++;let i=0;while(sa[i]===nb[i])i++;console.log('FAIL '+R+' differs at '+i+':\n a '+sa.slice(i-120,i+150)+'\n b '+nb.slice(i-120,i+150));}
 const txt=JSON.parse(sb.replace(/^/,'')) ;const all=[];const w=o=>{if(typeof o==='string')all.push(o);else if(o&&typeof o==='object')Object.values(o).forEach(w);};w(b);const s=all.join('\n');
 const n=(s.match(/\n- A\d+\.\d+ \([^)\n]*\): RESPONSE: /g)||[]).length,m=(s.match(/ \|\| STATEMENT: /g)||[]).length;ans+=n;tot+=m;per.push(R+': '+n+' answer lines, '+m+' given the STATEMENT');
 if(R==='33461'){const L=s.split('\n').filter(l=>/^- A\d+\.\d+ \(sol\): RESPONSE: .* \|\| STATEMENT: /.test(l));if(L.length)console.log('33461 sol answer lines with STATEMENT: '+L.length+'\nONE: '+L[0].slice(0,600)+'\n');}}
 per.forEach(x=>console.log(x));console.log('runs identical apart from pkgEST text: '+ok+', differing: '+bad+'; answer lines '+ans+', given the STATEMENT '+tot);console.log(bad===0?'OK':'FAIL');})();
