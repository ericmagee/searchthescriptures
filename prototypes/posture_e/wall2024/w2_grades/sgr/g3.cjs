const fs=require('fs');const N=s=>String(s||'').toLowerCase().replace(/[“”"’‘'*_`\[\]]/g,'').replace(/\s+/g,' ').trim();
const get=f=>{const s=fs.readFileSync(f,'utf8');const e=s.indexOf('\nlet si=0;');return new Function('N','cut',s.slice(0,e)+'\nreturn giveUp;')(N,x=>x);};
const O=get('gu_old.js'),Nw=get('gu_new.js');
// [text, side, expected admitted by new?, note]
const P=[
['I granted that Joseph is called father.','D',1,'past tense own grant'],
['I grant the defender\'s point that Luke 2:4 names the house.','C',1,"own grant naming the other side's point (possessive)"],
['I grant, as the defender conceded, that the word is one of coming.','C',1,'own grant beside a report of the other side (mixed sentence)'],
['The challenger grants that eperchomai is a word of coming.','D',0,'report of the other side'],
['He wrote “I grant that Seth to Adam is by knowing.”','D',0,'quoted first-person grant'],
['It is granted that Luke 1:27 puts the house on Joseph.','D',1,'passive grant'],
['Nothing is conceded here.','D',0,'negated passive'],
['This is not granted.','D',0,'negated passive with not between'],
['It was granted by the challenger that the line is legal.','D',0,'passive with by the other side'],
['It is granted by me that the line is legal.','D',1,'passive with by me'],
['Granting that the line is legal, the link stands.','D',1,'gerund (W1 limit)'],
['**Concession:** the household names Joseph father.','C',1,'bold label'],
['- Granted: Joseph is the husband.','C',1,'list item label'],
['I keep what I granted in round 2.','D',1,'keep-form'],
['Premise 3 stays dropped.','D',1,'stays dropped'],
['I do not grant that the row names Heli.','D',0,'negated I grant'],
['The opponent conceded that the verse names no father, and I concede the same.','C',1,'mixed: opponent then own, one sentence'],
['The opponent conceded it. I concede the same.','C',1,'mixed: two sentences'],
['I grant ‘born of women’ is said of men with fathers.','D',1,'own grant with single-quoted inner phrase'],
['The defender’s grant stands; I concede nothing.','C',0,'other side grant, own negative'],
];
let ok=0;for(const [t,sd,exp,note] of P){const o=O(t,'line legal joseph father house',sd)?1:0,n=Nw(t,'line legal joseph father house',sd)?1:0;const r=n===exp;ok+=r;console.log((r?'RIGHT':'WRONG')+' old',o,'new',n,'expected',exp,'|',note,'|',t);}
console.log(ok,'of',P.length);
