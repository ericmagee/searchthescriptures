// W2 pkgRCL rev 2: own plants on the 34852 close (both "as declared" sentences replaced by the planted one).
const {LIVE,RCL,load,build}=require(__dirname+'/h.cjs');
const P=async(name,s)=>{const rd=load(34852);const F=rd['Final Output'][0].data.main[0][0].json;F.cr4=F.cr4.replace('My chain stands as declared, D1 to D6.',s).replace('I keep D1 to D6 as declared.','');const b=await build(RCL,rd);
 console.log('##',name,'|',JSON.stringify(s),'->',JSON.stringify((b.cands||[]).filter(c=>/pkgRCL/.test(c.by||'')).map(c=>'L'+c.n)));};
(async()=>{await P('Q1 inside a quotation','The challenger quoted me: "my chain stands as declared."');
await P('Q2 inside a quotation, no speaker word','I once wrote "I keep D1 to D6 as declared," and I now narrow.');
await P('Q3 range after the phrase','My chain stands as declared, D1 to D3.');
await P('Q4 range after, then a narrowed clause','D1 to D6 stand as declared; D3 is kept as narrowed.');
await P('Q5 "but" clause','I keep D3 and D4 as declared, but D1 as narrowed.');
await P('Q6 contraction negation',"I don't keep D1 to D6 as declared.");
await P('Q7 never','My chain never stood as declared after round 3.');
await P('Q8 plain keep, D5 only','D5 remains as declared.');})();
