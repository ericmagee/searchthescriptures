const nrm=s=>String(s).replace(/\\+/g,'').replace(/[*_`]+/g,'').replace(/\s+/g,' ').trim();
const H=/^RETRACTED\s*:\s*D\d+\s+VS\.?\s+C\d+\s*\S/i;
const P=['RETRACTED: D1 vs C3','RETRACTED: D1 vs C3.','RETRACTED: D1 vs C3 -- withdrawn','RETRACTED: D1 vs C3 -- the ruling holds','RETRACTED: D1 vs C3; withdrawn','RETRACTED: D1 vs C3 (withdrawn)','RETRACTED: D1 vs C3 - withdrawn','**RETRACTED:** D1 vs C3 -- upheld','RETRACTED: D1 vs. C3 -- withdrawn','RETRACTED D1 vs C3 -- withdrawn','RETRACTED: D1 vs C3, D2 vs C4','Retracted: D1 vs C3 -- x','RETRACTED: D1 vs C3—withdrawn','RETRACTED: D1 and C3 -- withdrawn','RETRACTED: the D1 vs C3 ruling','D1 vs C3 (x): RETRACTED -- withdrawn'];
for(const s of P)console.log(H.test(nrm(s))?'CLAUSE   ':'no clause',JSON.stringify(s));
