const fs=require('fs'),cr=require('crypto');const T=fs.readFileSync(__dirname+'/../rb566/eng_Shared_Library_new.js','utf8');
const L=JSON.parse(T.slice(T.indexOf('\n/*LIB*/')+8,T.lastIndexOf('\n/*MAP*/')));const M=JSON.parse(T.slice(T.lastIndexOf('\n/*MAP*/')+8,T.lastIndexOf('\n/*END*/')));
const A='a conclusion drawn from it is a point.';
const ADD=' A summary line that restates a point (a line of a DECLARED CHAIN, or a line of a closing list such as "D1: ...") is a point too. It may carry its verses by reference instead of quoting them again: write the tag first, then the reference and the words "quoted above", as in "[L1] Romans 1:3, quoted above; [L3] Galatians 4:4, quoted above". This counts only for a verse quoted with its layer elsewhere in this same round, and the line still needs two verses with an [L1] among them.';
const L2=L.slice();L2[3552]=L[3552].replace(A,A+ADD);
const rb=(LL)=>M.LAY.p.map(e=>typeof e==='number'?LL[e]:typeof e[0]==='string'?e[0]:LL.slice(e[0],e[1]+1).join('\n')).join('\n');
const sha=x=>cr.createHash('sha256').update(JSON.stringify(x)).digest('hex').slice(0,16);
const S0=rb(L),S1=rb(L2);console.log('LAY n',S0.length,'->',S1.length,'(+'+(S1.length-S0.length)+') sha',sha(L),'->',sha(L2));
const mk=S=>new Function(S.replace('return {check,note,bare,words,structure,points};','return {check,note,bare,words,structure,points,verses};')+'\nreturn LAY;')();
const A0=mk(S0),A1=mk(S1);const R=require('/mnt/project-files/ask557/w4/build/rounds41822.json');
let same=true;for(const k of Object.keys(R))for(const o of [undefined,{oracle:true}]){const c0=A0.check(R[k],undefined,o),c1=A1.check(R[k],undefined,o);if(JSON.stringify(c0)!==JSON.stringify(c1))same=false;}
console.log('items identical on all 8 rounds x 2 modes:',same);
const c=A1.check(R.DR1);const n=A1.note(c);console.log('note holds sentence once:',n.split(ADD.trim()).length-1,'note len',A0.note(c).length,'->',n.length);
// form tests
const E=require('../a568/env.js');const L2C=E.mkL2C(E.l2cSrc('D2 Build'));
const body=R.DR1;const t=(line)=>A1.check(body.replace(/^- \*\*D3\.\*\*.*$/m,line)).items.filter(x=>/D3/.test(x.head)).map(x=>x.why.slice(0,50));
console.log('F1 tag-first by reference, two quoted verses:',JSON.stringify(t('- **D3.** The stated means is the Holy Ghost. [L1] Luke 1:35, quoted above; [L3] Isaiah 7:14, quoted above')));
console.log('F2 tag-after ref:',JSON.stringify(t('- **D3.** The stated means is the Holy Ghost. Luke 1:35 [L1], quoted above; Isaiah 7:14 [L3], quoted above')));
console.log('F3 by reference to a verse never quoted (Luke 9:99 style -> Ruth 1:1):',JSON.stringify(t('- **D3.** The stated means is the Holy Ghost. [L1] Luke 1:35, quoted above; [L3] Ruth 1:1, quoted above')));
console.log('F4 as written in 41822:',JSON.stringify(t(body.match(/^- \*\*D3\.\*\*.*$/m)[0])));
fs.writeFileSync(__dirname+'/add569.txt',ADD);
