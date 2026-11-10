// pkgKDV rev 2: __lm then __df (as the nodes call it), base (pkgKBG rev 5) against pkgKDV rev 2. Rev 1 cases (test_KDV_fn) plus W3's 3903 cases.
const fs=require('fs');const g=f=>{let d=JSON.parse(fs.readFileSync(f,'utf8'));d=d.data||d;return d.workflow||d;};
const BASE=process.env.BASE||__dirname+'/../pkgKBG/parent_s98_KBG5.json',CAND=process.env.CAND||__dirname+'/parent_s98_KDV2.json';
const fn=(W,nm)=>{const s=W.nodes.find(n=>n.name===nm).parameters.jsCode;const i=s.indexOf('const __df=');const j=s.indexOf('<=15;',i);const k=s.indexOf('const __lm=');const e=s.indexOf('return y.trim();};',k)+18;
 const df=new Function('return '+s.slice(i+11,j+4))(),lm=new Function(s.slice(k,e)+'return __lm;')();return [s.slice(i,j+4)+s.slice(k,e),x=>df(lm(x))];};
const B=g(BASE),C=g(CAND);let ok=0,bad=0;const chk=(c,m)=>{if(c){ok++;console.log('OK   '+m);}else{bad++;console.log('FAIL '+m);}};
const N=['Send Back Record','Alt Send Back Record','R2 Alt Send Back Record'];chk(N.every(n=>fn(C,n)[0]===fn(C,N[0])[0]),'__df and __lm are the same text in the 3 nodes');
const b=fn(B,N[0])[1],c=fn(C,N[0])[1];
const T=[ // [sentence, want KDV2]  true = deferral (cut), false = not
 ['- **Matthew 17:5** is answered under Luke 9:34.',true],['- **Isaiah 8:3** is answered with Isaiah 7:14.',true],['Matthew 17:5 is answered under Luke 9:34.',true],
 ['Isaiah 8:3 is answered with Isaiah 7:14-15.',true],['1 John 5:1 is answered as under John 1:13.',true],['**[L3]** Luke 9:34 is answered together with Matthew 17:5.',true],
 ['Romans 1:4 is answered above under Luke 1:35;',true],['"Matthew 17:5 is answered under Luke 9:34."',true],['This is answered under Luke 9:34.',true],['It was answered by Luke 1:35.',true],
 ['That is answered in Luke 1:35.',true],['The same is answered under Luke 9:34.',true],['Matthew 17:5 was answered at Luke 9:34-35.',true],['Matthew 17:5 is answered under 1 John 5:1.',true],
 ['I answer it under LINK 2.',true],['Answered in [CR2].',true],['See LINK 3.',true],
 // content of its own: not a deferral
 ['- **Luke 2:48**: Mary\'s "thy father" is answered in Luke 2:49 by "my Father\'s."',false],['Matthew 17:5 is answered under Luke 9:34, where the voice names the Son.',false],
 ['What is at issue is the last step, and that is answered by Matthew 1:20 and Luke 1:35.',false],['Mary\'s question in Luke 1:34 is answered in Luke 1:35 by naming the Holy Ghost and the power of the Highest.',false],
 ['The defender\'s sentence about the sign of the prophet in his own day and its plain words is answered by Isaiah 8:3.',false],
 ['Isaiah 8:3 is answered with Isaiah 7:14 and Isaiah 8:18 and the sign given to Ahaz in its own day by the Lord.',false],['The verb is answered by its subject.',false],['Luke 1:35 answers the how.',false],
 ['The verse names no father, which is answered under Matthew 1:16.',false],['Joseph is the legal husband and not the begetter, as is answered under Matthew 1:16.',false],
 ['The phrase is general and denies no father; it is answered with Job 14:1.',false],['That objection fails because it was answered by Luke 1:35.',false],['It is not answered under Luke 9:34.',false],
 ['Whether the cloud is the Father is answered in Luke 9:35.',false],['This cannot be answered by Matthew 1:16.',false],['- **Luke 1:35** The holy thing is answered by Luke 1:35.',false],
 ['Job 14:1 speaks of all men, and this is answered by Luke 1:35.',false],['He is answered by Luke 1:35.',false]];
for(const [s,w] of T)chk(c(s)===w,(w?'DEFERRAL':'not     ')+' base '+b(s)+' KDV2 '+c(s)+' | '+s);
console.log('-- limits (rev 1 limits; read not a deferral, stays CURED as on live) --');
for(const s of ['Answered under Luke 9:34.','Matthew 17:5: answered under Luke 9:34.','Matthew 17:5 is answered under Luke 9:34 and Matthew 3:17.','Matthew 17:5 is answered under Luke 9:34 above.','Matthew 17:5 is answered under Luke 9:34 (see above).','For Matthew 17:5 see Luke 9:34.','Matthew 17:5 is answered under Song of Solomon 2:1.','This has been answered under Luke 9:34.'])console.log('     KDV2 '+c(s)+' | '+s);
console.log(ok+' OK, '+bad+' FAIL');process.exit(bad?1:0);
