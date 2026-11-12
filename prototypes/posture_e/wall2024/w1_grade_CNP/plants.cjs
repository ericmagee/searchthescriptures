const fs=require('fs');const cecDeny=require('./run.cjs');const d=JSON.parse(fs.readFileSync(__dirname+'/F_31032.json','utf8'));
const base=d.F.cr4.replace('I keep D1 to D6 as numbered.','').replace('I narrow nothing and concede nothing.','');
const P=[
 ['W1-1 "I have narrowed nothing."','I have narrowed nothing.','pair'],
 ['W1-2 "I drop nothing."','I drop nothing.','pair'],
 ['W1-3 "Nothing I said has been withdrawn."','Nothing I said has been withdrawn.','pair'],
 ['W1-4 "My chain stands unchanged."','My chain stands unchanged.','pair'],
 ['W1-5 "D1 to D6 stand as first stated."','D1 to D6 stand as first stated.','pair'],
 ['W1-6 "The challenger narrowed nothing."','The challenger narrowed nothing.','none'],
 ['W1-7 "Nothing was conceded, except the idiom."','Nothing was conceded, except the idiom.','none'],
 ['W1-8 "I concede nothing new."','I concede nothing new.','none'],
 ['W1-9 verse "for with God nothing shall be impossible"','Luke 1:37: "For with God nothing shall be impossible."','none'],
 ['W1-10 "I withdraw nothing that bears on D5."','I withdraw nothing that bears on D5.','pair'],
 ['W1-11 "No link of mine has been narrowed."','No link of mine has been narrowed.','pair'],
 ['W1-12 "I keep every link as I declared it."','I keep every link as I declared it.','pair'],
];
let ok=0;for(const [nm,s,want] of P){const F={...d.F,cr4:base+'\n\n'+s};const out=cecDeny(F,d.links,[]).filter(c=>c.closing_q.includes(s.replace(/^.*?: /,'').slice(0,12)));const got=out.length?'pair':'none';if(got===want)ok++;console.log(got===want?'OK  ':'MISS',nm,'->',got,out.map(c=>'LINK '+c.n).join(','));}
// challenger close against defender narrowing (other side)
const F2={...d.F,cr4:base,dr4:d.F.dr4+'\n\nI narrow nothing and concede nothing.'};const o2=cecDeny(F2,d.links,[]);console.log('challenger close, pairs:',o2.map(c=>c.side+' LINK '+c.n+' ['+c.earlier_round+'] '+c.earlier_q.slice(0,60)).join(' | ')||'none');
console.log('plants',ok,'of',P.length);
