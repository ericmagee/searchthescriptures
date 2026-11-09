const fs=require('fs');eval(fs.readFileSync(process.argv[2],'utf8')+';global.F=knlNone2024;');
const T=[
// must stay CHECKED (false = real FORCED line)
['FORCED: none (the third link is not forced, the fourth is)',false],
['FORCED: none (no forced link; the keystone link fails)',false],
['FORCED: none (not the virgin-birth link, which is forced)',false],
['FORCED: none (nothing forced, although LINK four is broken)',false],
['FORCED: no (D6 is forced)',false],
['FORCED: none (no link, only the keystone premise)',false],
['FORCED: none of the collisions except D6',false],
['FORCED: there are no forced links other than D6',false],
['FORCED: D3, D6',false],
['FORCED LINKS: D6 (none other)',false],
// must be ACCEPTED (nothing graded)
['FORCED: none (no link is graded forced)',true],
['FORCED LINES: none',true],
['FORCED: — none',true],
['**FORCED:** none of the collisions are forced.',true],
['FORCED: There are no forced links.',true],
];let ok=0,bad=[];for(const [l,e] of T){const g=F(l);if(g===e)ok++;else bad.push((e?'MISS-ACCEPT ':'WRONG-ACCEPT ')+JSON.stringify(l));}
console.log(ok+' OK, '+bad.length+' FAIL');bad.forEach(b=>console.log(b));
