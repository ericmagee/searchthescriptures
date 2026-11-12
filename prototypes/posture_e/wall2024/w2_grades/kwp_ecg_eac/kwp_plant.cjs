// W2 plants on luna's K-W #4 RESPONSE and STATEMENT in run 35296 (Panel Cure Check, pkgKWP parent)
const run=require('./rep.cjs');
const RESP='NOT HELD: The grant “that her ‘know’ is present” and that “thou shalt conceive” is future',STMT='NOT HELD: “that her ‘know’ is present (Luke 1:31, ‘thou shalt conceive’ is future)”';
const P=[['as run (control)',null],['unrelated 4 words','that her womb was blessed'],['3 words only','her know present'],['4-word piece','her know is present'],['the clause with the lead','I grant that her ‘know’ is present'],['inside the parenthetical only','thou shalt conceive is future'],['clause with the parenthetical','that her ‘know’ is present (Luke 1:31, ‘thou shalt conceive’ is future)']];
(async()=>{for(const [lab,rep] of P){let hits=0;global.PLANT=(raw,fn)=>{if(fn!=='ex35296_full.json'||!rep)return raw;const n1=raw.split(RESP).length-1,n2=raw.split(STMT).length-1;hits=n1+'/'+n2;return raw.split(RESP).join('NOT HELD: The grant “'+rep+'” accepts the timing').split(STMT).join('NOT HELD: “'+rep+'”');};
 await run('parent_s148_KWP.json',['Panel Cure Check'],(fn,n,a,b)=>{if(fn!=='35296')return;const st=o=>{const L=(o[0].json.summary||[]).find(x=>x.seat==='luna');const c=(L&&L.cure||[]).find(c=>c.rule==='K-W'&&/#4$/.test(c.link||''));return c?c.status:'(none)';};
  console.log(lab.padEnd(30),'plant hits',hits,'live:',st(a),'| pkgKWP:',st(b));});}})();
