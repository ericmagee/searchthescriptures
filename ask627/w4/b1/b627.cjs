// ASK 627 build: Panel Tokens (engine) prices every model call; Alternate Pass Out (child) carries back R2 Alt Judge Enforcer Resend Call.
// Usage: node b627.cjs base_eng.json base_child.json outdir
const fs=require('fs');const [,,BE,BC,OUT]=process.argv;
const E=JSON.parse(fs.readFileSync(BE,'utf8')),C=JSON.parse(fs.readFileSync(BC,'utf8'));
const node=(d,n)=>{const x=d.nodes.find(k=>k.name===n);if(!x)throw new Error('no node '+n);return x;};
const once=(s,a,b,what)=>{const i=s.indexOf(a);if(i<0||s.indexOf(a,i+1)>=0)throw new Error('anchor not unique: '+what);return s.slice(0,i)+b+s.slice(i+a.length);};
const ENG_ADD=['QR Answer D anthropic','QR Answer C anthropic','QR Answer C openrouter','QR Follow Ask','QR Follow D anthropic','QR Follow D openrouter','QR Follow C anthropic','QR Follow C openrouter','Enforcer Resend Call openrouter','Judge Enforcer Resend Call openrouter','Alt Judge Enforcer Resend Call openrouter','Close Group Retry Call openrouter'];
const R2='R2 Alt Judge Enforcer Resend Call openrouter';
const pt=node(E,'Panel Tokens');
const A0="()=>$('Get Early Alternate')];";
pt.parameters.jsCode=once(pt.parameters.jsCode,A0,"()=>$('Get Early Alternate'),/*ASK 627: every model call is priced*/"+ENG_ADD.map(n=>"()=>$('"+n+"')").join(',')+",()=>__A379('"+R2+"')];",'Panel Tokens __CL end');
const ap=node(C,'Alternate Pass Out');let s=ap.parameters.jsCode;
s=once(s,'"FUM Call R2 Alternate openrouter"];','"FUM Call R2 Alternate openrouter","'+R2+'"];/*ASK 627: resend carried back for pricing*/','NM end');
s=once(s,'"FUM Call R2 Alternate openrouter":()=>$("FUM Call R2 Alternate openrouter")};','"FUM Call R2 Alternate openrouter":()=>$("FUM Call R2 Alternate openrouter"),"'+R2+'":()=>$("'+R2+'")};','A end');
ap.parameters.jsCode=s;
fs.writeFileSync(OUT+'/target_engine_627.json',JSON.stringify(E));fs.writeFileSync(OUT+'/target_child_627.json',JSON.stringify(C));
console.log('built: engine Panel Tokens +'+(ENG_ADD.length+1)+' entries; child Alternate Pass Out +1 node');
