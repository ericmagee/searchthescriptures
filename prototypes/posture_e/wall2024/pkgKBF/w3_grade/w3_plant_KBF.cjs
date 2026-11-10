// NOTE: in this file's output the column printed as 'live' is the pkgKBN base and the column printed as 'KBN' is pkgKBN + pkgKBF.
// W3 grade of pkgKBN: the round cut test of the node (__lm, then __gr and not __oc, or __df), live s100 against pkgKBN, sentence by sentence.
const fs=require('fs');const g=f=>{let d=JSON.parse(fs.readFileSync(f,'utf8'));d=d.data||d;return d.workflow||d;};
const mk=W=>{const s=W.nodes.find(n=>n.name==='Send Back Record').parameters.jsCode;const i=s.indexOf('function enf428Cure'),j=s.indexOf('\nfunction ',i+10);const body=s.slice(i,j);
 const cut=(a,b)=>{const i=body.indexOf(a);const j=body.indexOf(b,i+a.length);if(i<0||j<0)throw new Error('no '+a);return body.slice(i,j).replace(/\/\*[\s\S]*?\*\//g,'');};
 return new Function(cut('const __gr=','const __lm=')+';'+cut('const __lm=','const __bare=')+';'+cut('const __oc=','const __bq=')+';return x=>{const y=__lm(x);return !!(y&&((__gr(y)&&!__oc(y))||__df(y)));};')();};
const L=mk(g(__dirname+'/../../pkgKBN/parent_s100_KBN.json')),K=mk(g(__dirname+'/../parent_s100_KBN_KBF.json'));
const T=[
 ['- **On Job 14:1**, I grant the phrase covers kings named by their fathers.',true],['**Job 14:1**, I grant it.',true],['*On Job 14:1*, I grant it is said of all men.',true],['__Luke 3:23__: I accept the reckoning as stated.',true],['- **Regarding Luke 3:23-24**, granted.',true],['**On Job 14:1**: I grant it.',true],
 ['- **On Job 14:1**, I grant the phrase, and I rest D6 on Matthew 1:18.',false],['**Job 14:1** names the mother only and denies no father.',false],['*On Job 14:1*, the phrase is general, which I grant, so no father is denied.',false],['**On Job 14:1**, I grant it because the phrase is said of all men.',false],['- **Luke 3:23**, as was supposed, marks a supposition; I grant no more.',false],['**Job 14:1** *I answer*: the phrase names the mother.',false]];
let n=0;for(const [x,w] of T){const a=L(x),b=K(x);if(b!==w)n++;console.log((b===w?'ok   ':'DIFF ')+'want '+(w?'cut':'left')+' | live '+(a?'cut':'left')+' | KBN '+(b?'cut':'left')+' | '+x);}console.log(n+' of '+T.length+' differ from what W3 expects');
