// pkgKDV: __df (deferral test) of the base (pkgKBG) against pkgKDV, taken from Send Back Record; same text checked in all 3 nodes.
const fs=require('fs');const g=f=>{let d=JSON.parse(fs.readFileSync(f,'utf8'));d=d.data||d;return d.workflow||d;};
const BASE=process.env.BASE||__dirname+'/../pkgKBG/parent_s94_KBG.json',CAND=process.env.CAND||__dirname+'/parent_s94_KDV.json';
const df=(W,nm)=>{const s=W.nodes.find(n=>n.name===nm).parameters.jsCode;const i=s.indexOf('const __df=');const j=s.indexOf('<=15;',i);return [s.slice(i,j+4),new Function('return '+s.slice(i+11,j+4))()];};
const B=g(BASE),C=g(CAND);let ok=0,bad=0;const chk=(c,m)=>{if(c){ok++;console.log('OK   '+m);}else{bad++;console.log('FAIL '+m);}};
const N=['Send Back Record','Alt Send Back Record','R2 Alt Send Back Record'];chk(N.every(n=>df(C,n)[0]===df(C,N[0])[0]),'__df is the same text in the 3 nodes');
const b=df(B,N[0])[1],c=df(C,N[0])[1];
const T=[ // [sentence, base, KDV]
 ['- **Matthew 17:5** is answered under Luke 9:34.',false,true],
 ['- **Isaiah 8:3** is answered with Isaiah 7:14.',false,true],
 ['Matthew 17:5 is answered under Luke 9:34.',false,true],
 ['Isaiah 8:3 is answered with Isaiah 7:14-15.',false,true],
 ['1 John 5:1 is answered as under John 1:13.',false,true],
 ['**[L3]** Luke 9:34 is answered together with Matthew 17:5.',false,true],
 ['Romans 1:4 is answered above under Luke 1:35;',true,true],
 ['"Matthew 17:5 is answered under Luke 9:34."',false,true],
 // must stay not-deferral: the sentence states the answer after the reference, or is long
 ['- **Luke 2:48**: Mary\'s "thy father" is answered in Luke 2:49 by "my Father\'s."',false,false],
 ['Matthew 17:5 is answered under Luke 9:34, where the voice names the Son.',false,false],
 ['What is at issue is the last step, and that is answered by Matthew 1:20 and Luke 1:35.',false,false],
 ['Mary\'s question in Luke 1:34 is answered in Luke 1:35 by naming the Holy Ghost and the power of the Highest.',false,false],
 ['The defender\'s sentence about the sign of the prophet in his own day and its plain words is answered by Isaiah 8:3.',false,false],
 ['Isaiah 8:3 is answered with Isaiah 7:14 and Isaiah 8:18 and the sign given to Ahaz in its own day by the Lord.',false,false],
 ['I answer it under LINK 2.',true,true],['Answered in [CR2].',true,true],['See LINK 3.',true,true],
 ['The verb is answered by its subject.',false,false],['Luke 1:35 answers the how.',false,false]];
for(const [s,eb,ec] of T)chk(b(s)===eb&&c(s)===ec,(ec?'DEFERRAL ':'not      ')+'base '+b(s)+' KDV '+c(s)+' | '+s);
console.log(ok+' OK, '+bad+' FAIL');process.exit(bad?1:0);
