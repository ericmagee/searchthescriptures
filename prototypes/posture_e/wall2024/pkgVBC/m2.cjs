const load=f=>{const c=require(f).nodes.find(n=>n.name==='Citation Scan').parameters.jsCode;const nx=c.indexOf('let F=null;try{if($(');return new Function(c.slice(0,nx)+';return {L2C,REFP};')();};
const O=load('./target.json');
const A=`**D3: Luke 1:37's wonder.**

[L1] Luke 1:36-37: "thy cousin Elisabeth, she hath also conceived a son in her old age... who was called barren. For with God nothing shall be impossible."

[L3] Luke 1:24: "And after those days his wife Elisabeth conceived."

[L4] Luke 1:37's wonder is spoken over Elisabeth's conception. She is "his wife," the wife of Zacharias. So the wonder-word fits a conception of husband and wife. The *dio kai* of 1:35 connects back to 1:32's "throne of his father David." [L1] Luke 1:36-37, [L3] Luke 1:24, [L2] *dio kai*.

**D4: the sign.**
`;
const B=`PRESSED WITH:
Luke 1:32 "the Lord God shall give unto him the throne of his father David" -- MEANS: the title and the throne are given before Mary's question, and 1:35's dio kai reaches back to them -- [L2] dio kai (therefore also) | PROVEN IN [CR1]
Acts 1:8 "ye shall receive power" -- MEANS: x -- [L2] eperchomai (to come upon) | PROVEN IN [CR1]
`;
for(const [n,t] of [['A',A],['B',B]])O.L2C.tags([['CHALLENGER','DR2',t]]).forEach(x=>console.log(n,'|',x.seg.slice(0,60),'|',x.words.map(w=>w.word||w.text||JSON.stringify(w)).join('/'),'|',x.verses.join(',')));
