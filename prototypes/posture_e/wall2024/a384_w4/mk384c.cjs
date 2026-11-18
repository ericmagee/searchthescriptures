// ASK 384 candidate R1-double-prime: a bare number after a comma keeps the live rule (bound unless a capital word follows), and is refused only when BOTH hold:
// it is not above the list's last verse, and a lowercase word follows it ("1:18, 2 witnesses", "7:14, 3 times"). "and" / "&" forms keep W1's terminator set.
const fs=require('fs');const L=fs.readFileSync(__dirname+'/refp_new2.txt','utf8').split('\n');
L[16]='    if((x=rest.match(BARE))){const n=+(x[1]||x[2]);if(!(n<=items[items.length-1].v2&&/^\\s+[a-z]/.test(rest.slice(x[0].length)))){items.push({book:b,ctx,c,v1:n,v2:n,at:m.index,pos:i+x[0].search(/\\d/),head:false});i+=x[0].length;continue;}}';
const N=L.join('\n');fs.writeFileSync(__dirname+'/refp_new3.txt',N);fs.writeFileSync(__dirname+'/refp_new3.cjs',N+'\nmodule.exports=REFP;\n');console.log('len',N.length,'lines',N.split('\n').length);
