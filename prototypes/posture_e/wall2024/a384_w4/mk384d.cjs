// ASK 384 candidate R1-narrow (rev): a bare number after a comma keeps the live rule and is refused only when BOTH hold: it is not above the list's last verse,
// and a lowercase word follows it that is not a joining word (and, or, nor, vs, with, to, in, of, for, as, at, by, on, from, than, is, are, was, were).
const fs=require('fs');const L=fs.readFileSync(__dirname+'/refp_new2.txt','utf8').split('\n');
L[16]='    if((x=rest.match(BARE))){const n=+(x[1]||x[2]);const nw=(rest.slice(x[0].length).match(/^\\s+([a-z]+)\\b/)||[])[1];if(!(n<=items[items.length-1].v2&&nw&&!/^(and|or|nor|vs|with|to|in|of|for|as|at|by|on|from|than|is|are|was|were)$/.test(nw))){items.push({book:b,ctx,c,v1:n,v2:n,at:m.index,pos:i+x[0].search(/\\d/),head:false});i+=x[0].length;continue;}}';
const N=L.join('\n');fs.writeFileSync(__dirname+'/refp_new4.txt',N);fs.writeFileSync(__dirname+'/refp_new4.cjs',N+'\nmodule.exports=REFP;\n');console.log('len',N.length,'lines',N.split('\n').length);
