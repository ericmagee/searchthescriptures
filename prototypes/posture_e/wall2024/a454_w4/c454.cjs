// ASK 454 C1/C2 (W4): K-V kind test, OLD library (before ASK 422(c)) vs LIVE, on every line of all debate_judgments rows
// plus the ASK 422(c) population (K-V rows and alternate lines). Usage: node c454.cjs OLD.json LIVE.json POP.json
const fs=require('fs');const {unpack,rb}=require(process.env.TOOLS+'/lib.cjs');
const K='sb_publishable_rgfWFjynRqBdzyEeBRHcig_c6pHysAi',B='https://bhffmkginddovmdcpnty.supabase.co/rest/v1/';
const ld=p=>{let d=JSON.parse(fs.readFileSync(p));return d.data||d;};
const kvOf=p=>{const u=unpack(ld(p));const src=rb(u.L,u.M['Cure Check']);const KV=src.match(/const KV_KIND=.*?\*\//s)[0];return new Function(KV+';return {KV_KIND,KV_EXCL};')();};
const A=kvOf(process.argv[2]),N=kvOf(process.argv[3]);
console.log('KV_EXCL old:',A.KV_EXCL.source);console.log('KV_EXCL live:',N.KV_EXCL.source);
const mask=s=>String(s).replace(/["“][^"”\n]*["”]/g,'"Q"').replace(/(^|[\s(\[:;,])['‘](?:[^'’\n]|['’](?=[A-Za-z]))+?['’](?=$|[\s.,;:!?)\]])/g,"$1'Q'");
const kind=(f,s)=>f.KV_KIND.test(s)||f.KV_KIND.test(mask(s))||f.KV_EXCL.test(mask(s));
(async()=>{let rows=[];for(let o=0;;o+=100){const r=await fetch(B+`debate_judgments?select=id,judge_seat,verdict_raw&order=id&limit=100&offset=${o}`,{headers:{apikey:K,Authorization:'Bearer '+K}});const j=await r.json();rows.push(...j);if(j.length<100)break;}
 const C=JSON.parse(fs.readFileSync(process.argv[5]));let cf=0;for(const c of C){if(kind(N,c.text)!==c.new)cf++;}
 console.log('C2: ASK 422(c) cases on LIVE',C.length,'fail',cf);
 let nl=0,nm=0,ch=[];const re=/\b(make|makes|made|exclude|excludes|excluded)\b/i;
 for(const r of rows)for(const l of String(r.verdict_raw||'').split('\n')){nl++;if(re.test(l))nm++;if(kind(A,l)!==kind(N,l))ch.push(['J',r.id,r.judge_seat,l]);}
 const P=JSON.parse(fs.readFileSync(process.argv[4]));const pr=[...P.el.filter(x=>x[3]),...(P.al||[])];let np=0;
 for(const x of pr)for(const l of String(x[3]).split('\n')){np++;if(kind(A,l)!==kind(N,l))ch.push([x[0],x[1],x[2],l]);}
 console.log('C1: judgments',rows.length,'lines',nl,'lines holding make/exclude forms',nm,'| K-V and alternate lines',np,'| LINES CHANGED',ch.length);
 for(const x of ch)console.log(' ',x[0],x[1],x[2],'old',kind(A,x[3]),'live',kind(N,x[3]),JSON.stringify(x[3].slice(0,400)));
})();
