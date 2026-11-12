// W2 plants on luna's own K-W #4 replies (Panel Cure Call 1 and its follow-up), run 35296, Panel Cure Check
const run=require('./rep.cjs');const RX=/I grant that her ['‘]know['’] is present(?=\\+"|”)/g;
const P=[['as run (control)',null],['unrelated 4 words','that her womb was blessed'],['3 words of it','her know present'],['4-word piece','her know is present'],['parenthetical words only','thou shalt conceive is future'],['clause plus parenthetical','I grant that her know is present (Luke 1:31, thou shalt conceive is future)']];
(async()=>{for(const [lab,rep] of P){let hits=0;global.PLANT=(raw,fn)=>{if(fn!=='ex35296_full.json'||!rep)return raw;hits=(raw.match(RX)||[]).length;return raw.replace(RX,rep);};
 await run('parent_s148_KWP.json',['Panel Cure Check'],(fn,n,a,b)=>{if(fn!=='35296')return;const st=o=>{if(o.ERR)return 'ERR '+o.ERR;const L=(o[0].json.summary||[]).find(x=>x.seat==='luna');const c=(L&&L.cure||[]).find(c=>c.rule==='K-W'&&/#4$/.test(c.link||''));return c?c.status:'(none)';};
  console.log(lab.padEnd(28),'hits',hits,'| live:',st(a),'| pkgKWP:',st(b));});}})();
