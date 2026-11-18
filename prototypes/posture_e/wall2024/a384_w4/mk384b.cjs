// ASK 384 candidate R1-prime: comma forms keep the live rule (", N" not followed by a capital word) and add one test: the number must be above the last verse of the list in the same chapter (lists ascend).
// "and" / "&" forms (new binds) keep W1's terminator set and the same ascending test. Lines 5 and 16 change; line 20 is the same as refp_new.txt.
const fs=require('fs');const R=fs.readFileSync(__dirname+'/refp_live.txt','utf8');const L=R.split('\n');const NW=fs.readFileSync(__dirname+'/refp_new.txt','utf8').split('\n');
const i5=L[5].indexOf(' BARE=');
L[5]=L[5].slice(0,i5)+' BARE=/^\\s?(?:,\\s?(?:and\\s)?(\\d{1,3})(?!\\d|:\\d|\\s+[A-Z])|\\s(?:and|&)\\s(\\d{1,3})(?!\\d|:\\d)(?=\\s*(?:$|[,;.:()\\[\\]!?\'"“”‘’]|[–—-]|and\\s+\\d|&\\s*\\d)))/;';
const o16='    if((x=rest.match(BARE))){items.push({book:b,ctx,c,v1:+x[1],v2:+x[1],at:m.index,pos:i+x[0].search(/\\d/),head:false});i+=x[0].length;continue;}';
if(L[16]!==o16)throw new Error('line 16 differs');
L[16]='    if((x=rest.match(BARE))&&+(x[1]||x[2])>items[items.length-1].v2){const n=+(x[1]||x[2]);items.push({book:b,ctx,c,v1:n,v2:n,at:m.index,pos:i+x[0].search(/\\d/),head:false});i+=x[0].length;continue;}';
L[20]=NW[20];const N=L.join('\n');fs.writeFileSync(__dirname+'/refp_new2.txt',N);fs.writeFileSync(__dirname+'/refp_new2.cjs',N+'\nmodule.exports=REFP;\n');console.log('len',N.length,'lines',N.split('\n').length);
