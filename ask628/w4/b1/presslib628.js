const PRESSL=(()=>{ /* ASK 628: one reader of the verses pressed under PRESSED WITH and of the close's ANSWER lines (moved from Build Save Body's CLOSE PRESS LIST audit; used by Build Save Body, D4 Build, D4B Build, Panel Build, Build Independent Verdict) */
 const RF='((?:[1-3] )?[A-Z][a-z]+(?: (?:of )?[A-Z][a-z]+)* \\d+:\\d+)';
 const pressed=rounds=>{const PR=[];let on=false;for(const l of rounds.map(x=>String(x||'')).join('\n').split('\n')){const h=l.search(/PRESSED WITH\s*:/i);if(h>=0){on=true;const r=l.slice(h).replace(/^PRESSED WITH\s*:/i,'');const q=r.search(/["“]/);for(const m of (q>=0?r.slice(0,q):r).matchAll(new RegExp(RF,'g')))if(PR.indexOf(m[1])<0)PR.push(m[1]);continue;}const m=on&&l.match(new RegExp('^[\\s>*_#-]*(?:\\[L[1-4]\\][\\s*:]*)?'+RF));if(m){if(PR.indexOf(m[1])<0)PR.push(m[1]);}else on=false;}return PR;};
 const answered=close=>String(close||'').split('\n').map(l=>l.match(new RegExp('^[\\s>*_#-]*ANSWER\\s*:\\s*'+RF,'i'))).filter(Boolean).map(m=>m[1]);
 const open=(rounds,close)=>{const A=answered(close);return pressed(rounds).filter(r=>A.indexOf(r)<0).sort();};
 return {pressed,answered,open};})();
