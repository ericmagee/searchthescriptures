// pkgWVS rev 2 (W1, ASK 144 option 2; W3's option (a), Wall after 5499): no limit is read in code. Every pkgWVR note carries one fixed sentence:
// a withdrawal limited to a named use covers only that use; the enforcer reads the limit from the quoted earlier line.
module.exports=s=>{const R=(a,b)=>{const k=s.split(a).length-1;if(k!==1)throw 'anchor x'+k+': '+a;s=s.replace(a,()=>b);};
R("it does not apply to any other pair'","it does not apply to any other pair. By the operator\\'s ruling, if the earlier line limited the withdrawal to a named use (a purpose, a link or a point) and the close uses '+w.ref+' only for a use that limit left open, the close does not rest again on what was given up'");
return s;};
