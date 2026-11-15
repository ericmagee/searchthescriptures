const fs=require('fs');const w=JSON.parse(fs.readFileSync(process.env.TF,'utf8'));const c=w.nodes.find(x=>x.name==='Anticheat Record').parameters.jsCode;
const a=c.indexOf('const OVS_N='),b=c.indexOf('/* pkgOVS */');const f=new Function(c.slice(a,b)+';return ovsOther2024;')();
const F=require('/home/claude/searchthescriptures/prototypes/posture_e/wall2024/r383/f2/F37203.json');const cr4=String(F.cr4);const L=cr4.split('\n');
const C=[
['37203 Mark 7:8 bullet, key mat 1:19','mat 1:19','The verse carries no words about espoused wives',[cr4],true],
['summary-section reversal after last ANSWER (Gen 4:25)','mat 1:19','Joseph knew the child was not his own and so he sought to put her away',[cr4+'\n## Summary\n- Joseph knew the child was not his own and so he sought to put her away.'],'?'],
['second ref of two-ref heading (Luke 1:13 and Matthew 1:21)','mat 1:21','Zacharias and Elisabeth were both righteous before God',['**ANSWER: Luke 1:13 and Matthew 1:21 -- D5 -- x**\n- [L3] Zacharias and Elisabeth were both righteous before God, so the line runs through the priests.'],'?'],
['section heading ## names verse, no ANSWER line','mat 1:19','he refused to shame her in public',['## D3: Matthew 1:19 and the putting away\n- he refused to shame her in public and that is all.'],false],
['same chapter other verse (lenient)','mat 1:19','fear not to take unto thee',['**ANSWER: Matthew 1:20 -- D2 -- x**\n- [L1] fear not to take unto thee Mary.'],false],
['Phi collision Philemon vs Philippians','phi 1:9','love and judgment abound more and more',['**ANSWER: Philemon 1:9 -- x**\n- love and judgment abound more and more here.'],false],
];for(const [nm,k,q,raws,want] of C){const r=f(k,q,raws);console.log((want==='?'?'?? ':r===want?'ok ':'BAD'),nm,'| OTHER VERSE =',r);}
