// ASK 364 Part A (operator 01:21 CST 11-17: "why wasn't the defender forced to prove their position with the layers"; plan Wall 7641, rev 2 Wall 7647; acks W3 7649, W1 7650).
// The layers check joins the barred-moves resend in D2B, D3B, D4B (Build and Extract). Usage: node build364.cjs <base.json> <out.json> <bare:1|0>
const fs=require('fs');const w=JSON.parse(fs.readFileSync(process.argv[2]));const BARE=process.argv[4]==='1';
const LAYM=fs.readFileSync(__dirname+'/lay_module.js','utf8').trim();
const N={};for(const n of w.nodes)N[n.name]=n;
const rep=(nm,o,n)=>{const c=N[nm].parameters.jsCode;const k=c.split(o).length-1;if(k!==1)throw new Error(nm+' anchor count '+k+' for '+o.slice(0,60));N[nm].parameters.jsCode=c.replace(o,()=>n);};
for(const r of ['D2','D3','D4']){
 const b=r+'B Build',x=r+'B Extract';
 rep(b,'const __RD=',LAYM+'\nconst __RD=');
 rep(b,"if(!c.applies)return pass('no round text',c);if(c.pass)return pass(","let __lc=null;try{__lc=LAY.check(X.raw);}catch(e){__lc=null;}const __ln=__lc&&__lc.items?__lc.items.length:0; /* ASK 364 */\nif(!c.applies)return pass('no round text',c);if(c.pass&&!__ln)return pass(");
 rep(b,'const note=BAR.note(c);',"const note=[__ln?LAY.note(__lc,!c.pass):'',c.pass?'':BAR.note(c)].filter(Boolean).join('\\n\\n'); /* ASK 364: one resend carries both checks */");
 rep(b,"why:c.hits.length+' barred sentence(s)',note,bar_check:c,","why:c.hits.length+' barred sentence(s); '+__ln+' layer point(s)',note,bar_check:c,lay_check:__lc,");
 rep(x,'const __RD=',LAYM+'\nconst LAY_BARE='+(BARE?'true':'false')+'; /* ASK 364: '+(BARE?'a point still short after the resend is written into the round as a BARE CLAIM line':'record only: a point still short after the resend is recorded, not written into the round')+' */\nconst __RD=');
 rep(x,"return [{json:{...__K,raw:__S.raw,labelled:typeof __K.labelled==='string'?__SL.raw:__K.labelled,bar:__rec({",
  "const __L2=(()=>{try{return LAY.check(__S.raw);}catch(e){return null;}})();const __BC=LAY_BARE&&__L2&&__L2.items&&__L2.items.length?LAY.bare(__L2.items):''; /* ASK 364: the kept round is checked again */\nreturn [{json:{...__K,raw:__S.raw+__BC,labelled:typeof __K.labelled==='string'?__SL.raw+__BC:__K.labelled,bar:__rec({layers:{first:(__G&&__G.lay_check)||null,after:__L2,bare_written:!!__BC},");
}
fs.writeFileSync(process.argv[3],JSON.stringify(w));console.log('ok',BARE?'bare':'resend-only');
