const fs=require('fs'),path=require('path');
const cut=(s,a,b)=>{const i=s.indexOf(a),j=s.indexOf(b,i);return s.slice(i,j);};
const load=f=>{const s=fs.readFileSync(f,'utf8');return new Function(cut(s,'const CURE_RULE=','function cureBroken')+cut(s,'function cureRounds','// The rounds that press')+cut(s,'const cureQ=','const CURE_KEY=')+';return {cureRounds,cureQ,cureFound};')();};
const U=fs.readFileSync('text2_user.txt','utf8');
const B=load('base/Cure_Check.js');const R=B.cureRounds({messages:[{role:'user',content:U}]});
const i=R.DR2.indexOf('before they came together');console.log('DR2 context:',JSON.stringify(R.DR2.slice(Math.max(0,i-60),i+40)));
const qDS='Matthew 1:18: the child was "found... of the Holy Ghost" *before* "they came together." [L1] Matthew 1:25: Joseph "knew her not till she had brought forth." Round 2 reduces both to "a state at a time."';
const muts={'Ghost->Spirit':qDS.replace('Holy Ghost','Holy Spirit'),'till->until':qDS.replace('knew her not till','knew her not until'),'drop a word':qDS.replace('brought forth','brought')};
let bad=0;
for(const f of fs.readdirSync('new').filter(x=>x.endsWith('.js'))){const F=load('new/'+f);
 if(!F.cureFound(qDS,R.DR2)){bad++;console.log('orig not found',f)}
 for(const [k,q] of Object.entries(muts)){const hit=F.cureFound(q,R.DR2);if(k==='drop a word'?false:hit){bad++;console.log('MUTANT ACCEPTED',k,f)}}
 if(F.cureQ('a **b** _c_ `d`')!=='a b c d'){bad++;console.log('strip',f)}
}
const F=load('new/Cure_Check.js');
console.log('drop-a-word (prefix) found:',F.cureFound(muts['drop a word'],R.DR2),'(a shorter quotation is a substring; expected true, not a defect)');
console.log('underscore side effect: "snake_case" vs "snakecase" equal:',F.cureQ('snake_case')===F.cureQ('snakecase'));
console.log('bad',bad);
