// ASK 365 (operator 11:15 CST 11-17, ASK 1: "rules should be applied both ways ... else an advantage occurs"; W1 7683, W2 7684, W3 7685, W1 7686, W2 7687):
// the same LAY module (byte-equal with D2B/D3B/D4B) joins the barred-moves resend in C2B, C3B, C4B (Build and Extract), record only (operator "B").
// Usage: node build365.cjs <base.json, already carrying ASK 364 Part A> <out.json>
const fs=require('fs');const w=JSON.parse(fs.readFileSync(process.argv[2]));
const LAYM=fs.readFileSync(__dirname+'/../a364/lay_module.js','utf8').trim();
const N={};for(const n of w.nodes)N[n.name]=n;
const rep=(nm,o,n)=>{const c=N[nm].parameters.jsCode;const k=c.split(o).length-1;if(k!==1)throw new Error(nm+' anchor count '+k+' for '+o.slice(0,60));N[nm].parameters.jsCode=c.replace(o,()=>n);};
const LC="let __lc=null;try{__lc=LAY.check(X.raw);}catch(e){__lc=null;}const __ln=__lc&&__lc.items?__lc.items.length:0; /* ASK 365 */\n";
// C2B Build carries pkgPIN as well: LAY note first (it never closes: BAR closes when it is present, else the existing closing line does)
rep('C2B Build','const __RD=',LAYM+'\nconst __RD=');
rep('C2B Build',"if(!c.applies)return pass('no round text',c);if(c.pass&&!__pin.length)return pass(",LC+"if(!c.applies)return pass('no round text',c);if(c.pass&&!__pin.length&&!__ln)return pass(");
rep('C2B Build',"const note=[c.pass?null:BAR.note(c),__pin.length?PIN.note(__pin):null]","const note=[__ln?LAY.note(__lc,true):null,c.pass?null:BAR.note(c),__pin.length?PIN.note(__pin):null]");
rep('C2B Build',"__pin.length?__pin.length+' PROVEN IN round(s) that do not name the verse (pkgPIN)':null].filter(Boolean).join('; '),note,bar_check:c,pin_check:__pin,","__pin.length?__pin.length+' PROVEN IN round(s) that do not name the verse (pkgPIN)':null,__ln?__ln+' layer point(s)':null].filter(Boolean).join('; '),note,bar_check:c,pin_check:__pin,lay_check:__lc,");
// C3B and C4B Build: the same four edits as D2B/D3B/D4B Build in ASK 364
for(const r of ['C3','C4']){const b=r+'B Build';
 rep(b,'const __RD=',LAYM+'\nconst __RD=');
 rep(b,"if(!c.applies)return pass('no round text',c);if(c.pass)return pass(",LC+"if(!c.applies)return pass('no round text',c);if(c.pass&&!__ln)return pass(");
 rep(b,'const note=BAR.note(c);',"const note=[__ln?LAY.note(__lc,!c.pass):'',c.pass?'':BAR.note(c)].filter(Boolean).join('\\n\\n'); /* ASK 365: one resend carries both checks */");
 rep(b,"why:c.hits.length+' barred sentence(s)',note,bar_check:c,","why:c.hits.length+' barred sentence(s); '+__ln+' layer point(s)',note,bar_check:c,lay_check:__lc,");}
// Extract: the kept round is checked again and recorded (record only, as ASK 364 "B")
for(const r of ['C2','C3','C4']){const x=r+'B Extract';
 rep(x,'const __RD=',LAYM+'\nconst LAY_BARE=false; /* ASK 365: record only: a point still short after the resend is recorded, not written into the round */\nconst __RD=');
 const o="raw:__S.raw,labelled:typeof __K.labelled==='string'?__SL.raw:__K.labelled,bar:__rec({resent:true,";
 const c=N[x].parameters.jsCode;const L=c.split('\n');const i=L.findIndex(l=>l.includes(o));if(i<0||L.filter(l=>l.includes(o)).length!==1)throw new Error(x+' return line');
 L[i]="const __L2=(()=>{try{return LAY.check(__S.raw);}catch(e){return null;}})();const __BC=LAY_BARE&&__L2&&__L2.items&&__L2.items.length?LAY.bare(__L2.items):''; /* ASK 365: the kept round is checked again */\n"
  +L[i].replace(o,"raw:__S.raw+__BC,labelled:typeof __K.labelled==='string'?__SL.raw+__BC:__K.labelled,bar:__rec({layers:{first:(__G&&__G.lay_check)||null,after:__L2,bare_written:!!__BC},resent:true,");
 N[x].parameters.jsCode=L.join('\n');}
fs.writeFileSync(process.argv[3],JSON.stringify(w));console.log('ok');
