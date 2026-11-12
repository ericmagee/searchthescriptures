const fs=require('fs');function load(f){const w=JSON.parse(fs.readFileSync(f));const c=w.nodes.find(n=>n.name==='C4 Build').parameters.jsCode;const i=c.indexOf('const OGR=(()=>{');const j=c.indexOf('\n return {harvest',i);const k=c.indexOf('})();',j);return new Function(c.slice(i,k+5)+';return OGR;')();}
const B=load('parent_s155_SGJ.json');
const P=[
['short grant then bullet','- Levi\'s reach runs by begetting through each father, and I grant that.\n  - [L4] The last step is stated differently.',"Levi's reach runs by begetting through each father, and I grant that."],
['short alone then bullet','I grant it.\n- [L4] That order dates the taking.',null],
['short joins same line','I grant the tense. Her question asks the means of it all.','I grant the tense. Her question asks the means of it all.'],
['grant at end','The reckoning is by usage, as I grant.','The reckoning is by usage, as I grant.'],
['tag stripped','- [L4] I grant that these verbs name power at other rows.','I grant that these verbs name power at other rows.'],
['heading dropped','**What I grant and what I withdraw.** I grant that born of women is said of men with fathers.','I grant that born of women is said of men with fathers.'],
['quote kept','I drop the wording "in the husband\'s place."','I drop the wording "in the husband\'s place."'],
['long lead cut','A'.repeat(0)+'Word '.repeat(60)+'and I grant it.',null],
['inside quote skipped','He wrote "I grant nothing here at all to you" in reply.',null],
['Granted line','Granted: Joseph is of David\'s house.','Granted: Joseph is of David\'s house.'],
];
let ok=0;for(const [nm,txt,want] of P){const g=B.harvest({CR3:txt}).map(x=>x.text);
 let pass;if(nm==='short alone then bullet')pass=g.length===0||g.every(x=>!/order dates/.test(x));
 else if(nm==='long lead cut')pass=g.length===1&&g[0].length<=260&&/I grant it\.$/.test(g[0]);
 else if(want===null)pass=g.length===0;else pass=g.length===1&&g[0]===want;
 if(pass)ok++;console.log(pass?'OK ':'BAD',nm,JSON.stringify(g));}
console.log(ok+'/'+P.length);
