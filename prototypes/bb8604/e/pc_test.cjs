const fs=require('fs');const s=fs.readFileSync(process.argv[2],'utf8');
const i=s.indexOf('function preCheckSide');const j=s.indexOf('function preCheckBlock');
eval(s.slice(i,j));
const opp=['The defender said: "Joseph begat Jesus by the flesh" and later quoted "it is evident that our Lord sprang out of Juda" in passing.'];
const list='UNSUPPORTED-L4 PREMISES\n1. LINK 2: the defender assumes paternity. Quote: "Joseph begat Jesus by the flesh"\n';
const list2='UNSUPPORTED-L4 PREMISES\n1. LINK 2: the defender assumes paternity. Quote: "Joseph begat Jesus by the flesh" PRESSED WITH: Hebrews 7:14 "it is evident that our Lord sprang out of Juda"; Matthew 1:16 "of whom was born Jesus, who is called Christ"\n';
console.log('WITHOUT:',preCheckSide(list,opp,'L'));console.log('WITH   :',preCheckSide(list2,opp,'L'));
