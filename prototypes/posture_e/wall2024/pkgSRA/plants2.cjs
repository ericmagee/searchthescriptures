// W1 pkgSRA rev 2 plants for W3's F1 (w3/grade_SRA_w3.md): press echo lines are not served as the side's own lines.
const fs=require('fs');eval(fs.readFileSync(__dirname+'/helper.js','utf8').replace('function sraSame','global.sraSame=function'));
let ok=0,n=0;const T=(nm,c,info)=>{n++;if(c)ok++;console.log((c?'PASS ':'FAIL ')+nm+(c?'':' :: '+JSON.stringify(info)));};
const MEANS='the stated source of the begetting is the Holy Ghost';const ANS='The angel names the child and the naming does not mark the father alone.';
const good='Luke 1:13 has the angel give the name John to Zacharias, so naming is not the father\'s alone and the begetting source stands apart.';
const R=(extra)=>['DEFENDER ROUND 3 -- LINK ROUND','- **Matthew 1:20** '+ANS,good].concat(extra).join('\n');
const sv=t=>sraSame(t,'Matthew 1:20',MEANS,ANS,'');
T('Q1 MEANS echo line not served',!/MEANS/.test(sv(R(['MEANS [CR3] P1.1: "the stated source of the begetting is the Holy Ghost"']))),sv(R(['MEANS [CR3] P1.1: "the stated source of the begetting is the Holy Ghost"'])));
T('Q2 bold MEANS echo line not served',!/MEANS/.test(sv(R(['**MEANS [CR3] P1.1:** "the stated source of the begetting is the Holy Ghost, by the angel"']))));
T('Q3 numbered line not served',!/inference/i.test(sv(R(['2. The inference that the stated source of the begetting is the Holy Ghost alone fails.']))));
T('Q4 a line holding the meaning whole not served',!/whole/.test(sv(R(['As said, the stated source of the begetting is the Holy Ghost, whole and plain.']))));
T('Q5 a line holding the answer in its middle not served',!/So 7/.test(sv(R(['So 7:16 aside, the angel names the child and the naming does not mark the father alone, again.']))));
T('Q6 the good line is still served',sv(R([])).includes('Luke 1:13'),sv(R([])));
T('Q7 the good line is still served beside echo lines',sv(R(['MEANS [CR3] P1.1: "the stated source of the begetting is the Holy Ghost"','2. The inference that the stated source of the begetting is the Holy Ghost alone fails.'])).includes('Luke 1:13'));
T('Q8 numbered charge line without "The inference" not served (W3, run 35296)',!/charge/.test(sraSame(R(['3. The charge: "the stated source of the begetting is the Holy Ghost" stands against the defender.']),'Matthew 1:20',MEANS,ANS,'')));
console.log(ok+' of '+n+' pass');
