const LAY=(()=>{/* ASK 364 (operator 01:21 CST 11-17: "why wasn't the defender forced to prove their position with the layers"; plan Wall 7641, rev 2 Wall 7647; reads W1 7644/7650, W2 7645, W3 7646/7649): the layers check on the defender's own round, computed by code. Each critical point carries an [L1] verse with its reference and an [L3] verse with its reference (single verse doctrine is prohibited); a limiting word added in a MEANS stands in the KJV words of the [L1] or [L3] verse quoted on that row (an [L2] gloss carries nothing). LIMIT: only the listed words are caught. */
 const LIM=['at all','only','never','none','all','alone','solely','any','every','no','entirely','wholly','exclusively','always','nothing','without'];
 const NEG=/\b(?:not|no|neither|nor|none)\b/i;const NEGW=['no','none','any'];
 const W=s=>' '+String(s||'').toLowerCase().replace(/[‘’']/g,"'").replace(/[^a-z' ]+/g,' ').replace(/\s+/g,' ').trim()+' ';
 const REF='(?:[1-3]\\s)?[A-Z][a-z]+\\.?\\s\\d{1,3}:\\d{1,3}';const L1R=new RegExp('\\[L1\\][^\\n]*?'+REF),L3R=new RegExp('\\[L3\\][^\\n]*?'+REF);
 const CP=/^[\s#>*_-]*(?:LINK\s+\d+\b|(?:Answer|ANSWER)\b[^\n]{0,40}\bpress|PREMISE\s+\d+\b|D\d+\s*(?:--|:|—))/i; /* a PRESSED WITH list is not read here: its rows name the round that proves them (PROVEN IN); their MEANS words are read */const MD=/^\s*#{1,6}\s/;
 const Q=/["“]([^"”\n]{6,})["”]/g;
 function words(t){const out=[];for(const l of String(t||'').split('\n')){const m=l.match(/MEANS\s*:\s*(.*?)(?:\s--\s|\s\|\s|$)/i);if(!m)continue;
   const before=l.slice(0,l.indexOf(m[0]));const vq=[...before.matchAll(Q)].map(x=>x[1]);const l3=[...l.matchAll(/\[L3\][^"“\n]*["“]([^"”\n]{6,})["”]/g)].map(x=>x[1]);
   const ct=vq.concat(l3).join(' ');const carried=W(ct);const neg=NEG.test(ct);let means=W(m[1]);const add=[];
   if(means.includes(' at all ')&&!carried.includes(' at all ')){add.push('at all');}means=means.split(' at all ').join(' ');
   for(const w of LIM){if(w==='at all')continue;if(means.includes(' '+w+' ')&&!carried.includes(' '+w+' ')&&!(neg&&NEGW.includes(w)))add.push(w);}
   if(add.length)out.push({kind:'WORDS',add,line:l.trim().slice(0,600),why:'the MEANS adds '+add.map(x=>'"'+x+'"').join(', ')+', which no KJV words of the [L1] or [L3] verse quoted on that row carry'});}return out;}
 function structure(t){const L=String(t||'').split('\n');const B=[];let cur=null;
   for(const l of L){if(CP.test(l)||MD.test(l)){if(cur)B.push(cur);cur=CP.test(l)?{head:l.trim(),lines:[l]}:null;continue;}if(cur)cur.lines.push(l);}if(cur)B.push(cur);
   const out=[];for(const b of B){const x=b.lines.join('\n');if(x.replace(/\s+/g,' ').trim().length<60)continue;const a=L1R.test(x),c=L3R.test(x);if(a&&c)continue;
    out.push({kind:'STRUCTURE',head:b.head.slice(0,300),why:(!a&&!c?'no [L1] verse and no [L3] verse with its reference':!a?'no [L1] verse with its reference':'no [L3] verse with its reference (an [L2] does not stand in its place)')+(/\[L4\]/.test(x)?'; its [L4] does not stand on both':'')});}return out;}
 function check(raw){const t=String(raw||'');if(!t.trim())return {applies:false,items:[]};const items=structure(t).concat(words(t)).map((x,i)=>({id:'L'+(i+1),...x}));return {applies:true,items,pass:!items.length};}
 function note(c){return 'LAYERS CHECK -- computed by the system from your round, not by a model (PROVEN STRUCTURE, rulings 397 to 400: the layers are the language of this debate). Each critical point below is short of its layers. Single verse doctrine is prohibited: a critical point carries an [L1] verse with its reference and an [L3] further verse with its reference; an [L2] is welcome but does not stand in place of the [L3]. A limiting word you add in a MEANS (such as only, never, all, at all, without) must stand in the KJV words of the [L1] verse or of an [L3] verse quoted on that row; a lexicon gloss does not carry it.\n'
   +'Write your whole round again, the same case, and for each point below add the layers it lacks, or take the added word out. The points:\n'
   +c.items.map(x=>x.id+' '+(x.kind==='WORDS'?'MEANS row: "'+x.line.slice(0,400)+'"':'"'+x.head.slice(0,200)+'"')+' -- '+x.why).join('\n')
   +'\nReturn the whole round; this is the only request of its kind.';}
 function bare(items){return items.map(x=>'\n[SYSTEM LAYERS CHECK] BARE CLAIM: '+(x.kind==='WORDS'?'MEANS row "'+x.line.slice(0,300)+'"':'"'+x.head.slice(0,200)+'"')+' -- '+x.why+'; at a critical point it carries no weight (rulings 397 to 400).').join('');}
 return {check,note,bare,words,structure};})();
