// W3 grade of pkgKBN: the round cut test of the node (__lm, then __gr and not __oc, or __df), live s100 against pkgKBN, sentence by sentence.
const fs=require('fs');const g=f=>{let d=JSON.parse(fs.readFileSync(f,'utf8'));d=d.data||d;return d.workflow||d;};
const mk=W=>{const s=W.nodes.find(n=>n.name==='Send Back Record').parameters.jsCode;const i=s.indexOf('function enf428Cure'),j=s.indexOf('\nfunction ',i+10);const body=s.slice(i,j);
 const cut=(a,b)=>{const i=body.indexOf(a);const j=body.indexOf(b,i+a.length);if(i<0||j<0)throw new Error('no '+a);return body.slice(i,j).replace(/\/\*[\s\S]*?\*\//g,'');};
 return new Function(cut('const __gr=','const __lm=')+';'+cut('const __lm=','const __bare=')+';'+cut('const __oc=','const __bq=')+';return x=>{const y=__lm(x);return !!(y&&((__gr(y)&&!__oc(y))||__df(y)));};')();};
const L=mk(g('/mnt/project-files/wall2024/fetchback_live_s100.json')),K=mk(g(__dirname+'/../parent_s100_KBN.json'));
const T=[ // [sentence, want cut (bare) under KBN]
 ['On Luke 3:23, I grant it.',true],['As to 1 John 5:1, granted.',true],['Regarding Luke 3:23-24, I grant the reckoning as stated.',true],['- On Luke 3:23, I accept that men supposed it.',true],['In Luke 3:23 I grant the words as they stand.',true],['Luke 3:23, I grant it.',true],
 ['On Luke 3:23, I grant the supposition, and I rest the begetting on Matthew 1:18.',false],['For Luke 3:23, I grant only that men supposed it, because the text says so.',false],['Regarding Luke 3:23, I grant the reckoning; D6 asks about begetting, not reckoning.',false],
 ['On Luke 3:23, the phrase "as was supposed" marks a supposition and no begetting.',false],['For Matthew 1:16 names a husband and no begetter.',false],['In Luke 3:23, Joseph is named as supposed father, which I grant as the legal place.',false],['Luke 3:23, as I grant, gives the legal line, so D6 is untouched.',false],
 ['Under Luke 3:23, I answer that the supposition is the people\'s and not the writer\'s.',false],['At Luke 2:48 Mary speaks the title of the house, and I grant no more than that.',false],
 ['On the reckoning in Luke 3:23, I grant it.',true],['On Luke 3:23 and Matthew 1:16, I grant both.',true]];
let n=0;for(const [x,w] of T){const a=L(x),b=K(x);if(b!==w)n++;console.log((b===w?'ok   ':'DIFF ')+'want '+(w?'cut':'left')+' | live '+(a?'cut':'left')+' | KBN '+(b?'cut':'left')+' | '+x);}console.log(n+' of '+T.length+' differ from what W3 expects');
