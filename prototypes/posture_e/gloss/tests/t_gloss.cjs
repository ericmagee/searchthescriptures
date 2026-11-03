// GLOSS CHECK test on run 32404's real [L2] tags and the record's lexicon entries served on its sheets.
const fs=require('fs'),path=require('path');const D=path.join(__dirname,'..');
const cp=fs.readFileSync(path.join(D,'new','L2 Count Plan.js'),'utf8');
const lib=cp.slice(cp.indexOf('const L2C='),cp.indexOf('// ======== end judge_fix9 libraries'));
const gl=cp.slice(cp.indexOf('// judge_fix10 G (GLOSS CHECK)'),cp.indexOf('const gloss=__GLOSS'));
const {__GLOSS}=new Function(lib+'\n'+gl+'\nreturn {__GLOSS};')();
const fx=JSON.parse(fs.readFileSync(path.join(__dirname,'fx32404.json'),'utf8'));
const out=__GLOSS(fx.tags,fx.lex);let pass=0,fail=0;const ok=(c,m)=>{if(c)pass++;else{fail++;console.log('FAIL',m);}};
const f=(side,round,num)=>out.filter(g=>g.side===side&&g.round===round&&g.num===num);
const ch=f('CHALLENGER','DR3','G4905');console.log('DR3 G4905',JSON.stringify(ch));
ok(ch.length===1&&ch[0].status==='GLOSS TRIMMED'&&/cohabit conjugally/.test(ch[0].missing)&&!/convene/.test(ch[0].missing),'challenger round 3 cut of cohabit (conjugally) caught, nothing else missing');
const de=f('DEFENDER','CR3','G4905');console.log('CR3 G4905',JSON.stringify(de));
ok(de.length>=1&&de.every(g=>g.status==='GLOSS TRIMMED'&&/convene/.test(g.missing)&&!/cohabit/.test(g.missing)),'defender round 3 cut of convene/depart/associate caught');
const d4=f('CHALLENGER','DR4','G4905');console.log('DR4 G4905',JSON.stringify(d4));
ok(d4.length===1&&d4[0].status==='GLOSS TRIMMED'&&/cohabit/.test(d4[0].missing),'challenger close cut caught');
// a whole quotation reads WHOLE
const whole=__GLOSS([{side:'X',round:'CR3',seg:'Synerchomai (G4905) means "to convene, depart in company with, associate with, or (specially), cohabit (conjugally)."',words:[{w:'G4905',ok:true,num:'G4905'}],status:'COUNTED'}],fx.lex);
ok(whole.length===1&&whole[0].status==='WHOLE','whole quotation read WHOLE: '+JSON.stringify(whole));
// a verse quotation next to a tag is not taken for a gloss
const verse=__GLOSS([{side:'X',round:'CR3',seg:'Matthew 1:18 (G4905): "before they came together, she was found with child of the Holy Ghost"',words:[{w:'G4905',ok:true,num:'G4905'}],status:'COUNTED'}],fx.lex);
ok(verse.length===0,'verse words not read as a gloss: '+JSON.stringify(verse));
// no lexicon row: nothing reported
ok(__GLOSS([{side:'X',round:'CR3',seg:'G9999 means "abc def ghi"',words:[{w:'G9999',ok:true,num:'G9999'}],status:'COUNTED'}],fx.lex).length===0,'no entry, no line');
const tr=out.filter(g=>g.status==='GLOSS TRIMMED');console.log('all quoted meanings',out.length,'trimmed',tr.length,'whole',out.length-tr.length);
for(const g of out.slice(0,12))console.log(' ',g.side,g.round,g.num,g.status,'|',g.quote.slice(0,60),'| left out:',g.missing.slice(0,80));
// the render block, run as the judges' text is built
const pb=fs.readFileSync(path.join(D,'new','Panel Build.js'),'utf8');const r0=pb.indexOf(' const GL=Array.isArray(q.l2.gloss)');const r1=pb.indexOf('/* judge_fix10 G */',r0);
const L=[];new Function('q','L',pb.slice(r0,r1))({l2:{gloss:out}},L);console.log('render lines',L.length);console.log(L.slice(0,4).join('\n').slice(0,1400));
ok(L.length===1+Math.min(tr.length,60)+(tr.length>60?1:0),'render line count');ok(!L.join('\n').includes('accompany, assemble'),'render prints no rendering list (only senses left out)');
const iDR3=L.findIndex(l=>/\[DR3\] G4905/.test(l)),iCR3=L.findIndex(l=>/\[CR3\] G4905/.test(l)),iR1=L.findIndex(l=>/\[(?:CR|DR)1\]/.test(l));console.log('line index DR3',iDR3,'CR3',iCR3,'first round-1',iR1);ok(iDR3>0&&iCR3>0&&(iR1<0||(iDR3<iR1&&iCR3<iR1)),'link-round cuts listed, before round 1');
const blk=L.join('\n');console.log('render chars',blk.length);ok(blk.length<16000,'block under 16,000 characters');
console.log('PASS',pass,'FAIL',fail);process.exit(fail?1:0);
