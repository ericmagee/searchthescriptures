// pkgKRC (W1, 11-09; W3 grade 3547 countermeasure 3): a valid ruling card that names a K-RUL item answers it without a "RESPONSE: K-RUL ..." line.
// One substitution in cureVerdicts (Shared Library only): the "no written response" gate lets a K-RUL item through when krulCure finds a valid card for it;
// krulCure then rules it as before (same card check, CURED or UNCURED with its reason). Every other rule is unchanged.
// Base: live s75 (library strip_WLG = Shared Library ed1ec6fb07c0). Run from wall2024/: node pkgKRC/build_KRC.cjs
const fs=require('fs'),cr=require('crypto');const h=s=>cr.createHash('sha256').update(s).digest('hex').slice(0,12);
const OLD="if(!respOf(x)&&!(x.rule==='K-B'&&(wd.has(U(x.link))||cureRest(o,x).length))){";
const NEW="if(!respOf(x)&&!(x.rule==='K-B'&&(wd.has(U(x.link))||cureRest(o,x).length))&&!(x.rule==='K-RUL'&&krulCure(x,reply.text,R,'').st==='CURED')){ /* pkgKRC */";
const SRC='pkgLIB/strip_WLG/patched/',DST='pkgLIB/strip_KRC/patched/';
const plan={base:{library:SRC},library:{},tally:0};
fs.rmSync('pkgLIB/strip_KRC',{recursive:true,force:true});fs.mkdirSync(DST,{recursive:true});
for(const f of fs.readdirSync(SRC).filter(f=>f.endsWith('.js')).sort()){const s0=fs.readFileSync(SRC+f,'utf8');const n=s0.split(OLD).length-1;if(n>1)throw new Error(f+' x'+n);
 const s=n?s0.split(OLD).join(NEW):s0;if(n){new Function('$','$input','return (async()=>{\n'+s+'\n})();');plan.library[f]={base:h(s0),patched:h(s),hits:n};plan.tally+=n;}fs.writeFileSync(DST+f,s);}
fs.writeFileSync('pkgKRC/plan_KRC.json',JSON.stringify(plan,null,1)+'\n');console.log('library files',Object.keys(plan.library).length,'tally',plan.tally);
