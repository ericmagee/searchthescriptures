const C=require('./core.js');
const rows=[{book:'Matthew',chapter:1,verse:23,text:'Behold, a virgin shall be with child, and shall bring forth a son, and they shall call his name Emmanuel, which being interpreted is, God with us. [they...: or, his name shall be called]'},
{book:'Matthew',chapter:1,verse:24,text:'Then Joseph being raised from sleep did as the angel of the Lord had bidden him, and took unto him his wife:'},
{book:'Matthew',chapter:1,verse:25,text:'And knew her not till she had brought forth her firstborn son: and he called his name JESUS.'},
{book:'Luke',chapter:1,verse:33,text:'And he shall reign over the house of Jacob for ever; and of his kingdom there shall be no end.'},
{book:'Luke',chapter:1,verse:34,text:'Then said Mary unto the angel, How shall this be, seeing I know not a man?'},
{book:'Luke',chapter:1,verse:35,text:'And the angel answered and said unto her, The Holy Ghost shall come upon thee, and the power of the Highest shall overshadow thee: therefore also that holy thing which shall be born of thee shall be called the Son of God.'}];
const I=C.mlsIdx(rows);
const CR3='Matthew 1:25 "And knew her not till she had brought forth her firstborn son: and he called his name JESUS." -- MEANS: Joseph did not know her at all until she brought forth her firstborn son. -- [L2] ginōskō (to know) | PROVEN IN [DR1]\nLuke 1:34 "Then said Mary unto the angel, How shall this be, seeing I know not a man?" -- MEANS: Mary affirms during espousal that she does not know a man. -- [L2] anḗr (a man) | PROVEN IN [round 1]';
for(const [name,q,b,c,v] of [['BAD row 42664','Joseph did not know her at all until she brought forth her firstborn son.','Matthew',1,25],['GOOD Luke 1:34 MEANS','Mary affirms during espousal that she does not know a man.','Luke',1,34]]){
 const U=C.mlsUnit(I,b,c,v,v);const add=C.mlsAdded(q,U.text);const blk=C.mlsBlock(CR3,q);const res=add.map(p=>[p,C.mlsCarried(p,blk,I)]);
 console.log(name,'| unit',U.ref,'| added',JSON.stringify(add),'| carried',JSON.stringify(res.map(r=>r[1].carried)),'=>',res.some(r=>!r[1].carried)?'SEND BACK':'PASS');}
