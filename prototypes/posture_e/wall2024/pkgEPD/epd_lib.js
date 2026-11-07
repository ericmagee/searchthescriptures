/* pkgEPD (W3 2849 item 4): an unlabelled COUNTED push that quotes 6 or more consecutive words of a sentence in the side's own block containing drop, withdraw or grant is a concession push: not held. */
function epdWords(s){return String(s||'').toLowerCase().replace(/[‘’']/g,'').replace(/[^a-z0-9Ͱ-Ͽ֐-׿]+/g,' ').trim().split(' ').filter(Boolean);}
function epdDrop(why,blk){const sents=String(blk||'').split(/(?<=[.;:!?])\s+|\n+/).filter(s=>/\b(?:drop|drops|dropped|withdraw|withdraws|withdrew|withdrawn|grant|grants|granted)\b/i.test(s));if(!sents.length)return null;
 const w=epdWords(why);if(w.length<6)return null;const runs=new Set();for(let i=0;i+6<=w.length;i++)runs.add(w.slice(i,i+6).join(' '));
 for(const s of sents){const t=epdWords(s);for(let i=0;i+6<=t.length;i++)if(runs.has(t.slice(i,i+6).join(' ')))return s.trim().slice(0,160);}return null;}
