// pkgEPD (W3 Wall 2849 item 4, follow-up to pkgEPS LIVE). DeepSeek enforcer fix, side-neutral, in Judge Enforcer Record and Alt Judge Enforcer Record.
// epsHold no longer holds an unlabelled COUNTED push that quotes 6+ consecutive words of a sentence in the side's own answering block containing
// drop/withdraw/grant (the CONCEDED-type push written without the "(CONCEDED)" label). The ASSUMES route stays held (W3 2849). Status const EPD_STATUS:
// LIVE exempts (the push is sent as before pkgEPS); TRIAL keeps the hold and appends "(TRIAL pkgEPD: ...)" to the HELD reason only.
// Base: pkgETC/patched_on_pkgEPS_patched_live (live cb7b822b = EPS LIVE + ETC stacked per W3 2851). Run from wall2024/: node pkgEPD/build_EPD.cjs [--status TRIAL]
const fs=require('fs');const crypto=require('crypto');const sha=s=>crypto.createHash('sha256').update(s).digest('hex').slice(0,16);
const arg=(k,d)=>{const i=process.argv.indexOf(k);return i>0?process.argv[i+1]:d;};
const IN=arg('--base','pkgETC/patched_on_pkgEPS_patched_live');const ST=arg('--status','LIVE');const OUT=arg('--out',ST==='LIVE'?'pkgEPD/patched_live':'pkgEPD/patched');
const LIB=fs.readFileSync(__dirname+'/epd_lib.js','utf8');
const A="if(/^\\s*\\(\\s*CONCEDED\\b/i.test(v.why))return null;const blk=__epsBlk[x.item]||'';if(!blk)return null;";
const Bt=ST==='LIVE'?A+"if(epdDrop(v.why,blk))return null;":A+"const __epd=epdDrop(v.why,blk);";
const A2="return 'the push counts the premise but names no layer the block lacks; the block exhibits '+k.map(z=>'['+z+']').join(', ');}";
const B2=ST==='LIVE'?A2:"return 'the push counts the premise but names no layer the block lacks; the block exhibits '+k.map(z=>'['+z+']').join(', ')+(__epd?'; TRIAL pkgEPD would send: it quotes the side drop '+__epd.replace(/[()]/g,' '):'');}";
const AL="function epsHold(x,v){";
const rep=(s,a,b,f)=>{const n=s.split(a).length-1;if(n!==1)throw new Error(f+': anchor x'+n);return s.split(a).join(b);};
fs.mkdirSync(OUT,{recursive:true});const plan={base:IN,status:ST,nodes:[]};
for(const f of ['Judge_Enforcer_Record.js','Alt_Judge_Enforcer_Record.js']){const s0=fs.readFileSync(IN+'/'+f,'utf8');
 let s=rep(s0,AL,"/* pkgEPD (W3 2849) */const EPD_STATUS='"+ST+"';\n"+LIB+AL,f+' lib');s=rep(s,A,Bt,f+' exempt');s=rep(s,A2,B2,f+' note');
 new Function('$','$input','$json','$execution','$workflow',s);fs.writeFileSync(OUT+'/'+f,s);plan.nodes.push({file:f,base_sha:sha(s0),final_sha:sha(s)});console.log(f.padEnd(30),sha(s0),'->',sha(s));}
fs.writeFileSync(OUT+'.plan.json',JSON.stringify(plan,null,1));
