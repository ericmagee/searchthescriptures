const fs=require('fs');
const T=fs.readFileSync(process.argv[2],'utf8');
const L=JSON.parse(T.slice(T.indexOf('\n/*LIB*/')+8,T.lastIndexOf('\n/*MAP*/')));
const patch=process.argv[3]==='new';
let src=L.slice(146,158).join('\n');
if(patch){
 const OLD146=L[146];
 const NEW146=OLD146.replace("|\\brelated\\s+to)","|\\brelated\\s+to|\\bcompare|\\bakin\\s+to)").replace("(?:\\s+(?:root|verb|noun|word|stem|lemma|greek|hebrew|aramaic))*","(?:\\s+(?:root|verb|noun|word|stem|lemma|greek|hebrew|aramaic))*(?:\\s+(?:variation|derivative|prolonged\\s+form|form)\\s+of)?");
 if(NEW146===OLD146)throw 'no change 146';
 const A="if(!pass)return false;";
 const ADD=A+"const __a=pre.match(/([^\\s(*_\"\\u201c\\u201d]+)[*_\"\\u201d\\u2019]*\\s+(?:and|or)(?:\\s+(?:a|an|the))?(?:\\s+(?:variation|derivative|prolonged\\s+form|form)\\s+of)?[\\s*_\"\\u201c\\u201d\\u2018\\u2019'(]*$/i);if(__a){const j=i-pre.length+pre.lastIndexOf(__a[1]);if(wds.some((w,k)=>R.has(k)&&pos[k].includes(j)))return true;} /* ASK 653: an etymology word joined to a root by and/or is a root too */";
 src=src.replace(OLD146,NEW146+" /* ASK 653: compare, akin to, a variation/derivative/form of mark a root */").replace(A,ADD);
}
const f=new Function(src+'\nreturn markRoots;')();
const cases=[
 ['"from σύν and ἔρχομαι; to convene"',['G4905','σύν','ἔρχομαι','synérchomai'],'ἔρχομαι'],
 ['"from παρά and λαμβάνω; to receive near"',['G3880','παρά','λαμβάνω','paralambánō'],'λαμβάνω'],
 ['G435 (*anḗr*, husband / man): "a primary word (compare ἄνθρωπος); a man"',['G435','ἄνθρωπος','anḗr'],'ἄνθρωπος'],
 ['G1080 (*gennáō*, conceived): "from a variation of γένος; to procreate"',['G1080','γένος','gennáō'],'γένος'],
 ['G5548 (*chríō*, anointed): "probably akin to χράομαι through the idea"',['G5548','χράομαι','chríō'],'χράομαι'],
 ['G1982 (*episkiázō*): "from ἐπί and a derivative of σκιά; to cast a shade"',['G1982','ἐπί','σκιά','episkiázō'],'σκιά'],
 ['G1904 (*epérchomai*): "from ἐπί and ἔρχομαι; to supervene"',['G1904','ἐπί','ἔρχομαι','epérchomai'],'ἔρχομαι'],
];
let bad=0;
for(const [seg,ws,target] of cases){const wds=ws.map(w=>({w,kind:/^[GH]\d+$/.test(w)?'strongs':/[α-ω]/i.test(w)?'greek':'latin'}));const r=f(seg,wds);const roots=r.filter(x=>x.root).map(x=>x.w);const core=r.filter(x=>!x.root).map(x=>x.w);
 const okT=roots.includes(target);const keepNum=core.includes(ws[0]);console.log((okT&&keepNum?'ROOT ':'CORE ')+target,'| roots:',roots.join(' '),'| core:',core.join(' '));}
// negatives: must stay core
const neg=[['G4905 (synerchomai) and G3880 (paralambano) in Matthew 1:18',['G4905','G3880']],['G1080 gennao and G4815 syllambano',['G1080','G4815']]];
for(const [seg,ws] of neg){const r=f(seg,ws.map(w=>({w,kind:'strongs'})));console.log('NEG',r.filter(x=>x.root).length===0?'PASS':'FAIL',seg);}
