const fs=require('fs');const {unpack,rb}=require('../tools/lib.cjs');
const w=JSON.parse(fs.readFileSync(process.argv[2]));const u=unpack(w);let bad=0;
for(const k in u.M){const src=rb(u.L,u.M[k]);try{new Function('$','$input','$json','$node','$items','require',`return (async()=>{${src}\n})`);}catch(e){bad++;console.log('COMPILE FAIL',k,e.message);}}
console.log('stubs',Object.keys(u.M).length,'compile fails',bad);
// pull the K-V helpers out of the Cure Check source and test kvRulingOk's kind on W3's cases
const src=rb(u.L,u.M['Cure Check']);
const KV=src.match(/const KV_KIND=.*?\*\//s)[0];
const f=new Function(KV+';return {KV_KIND,KV_EXCL};')();
const mask=s=>String(s).replace(/["“][^"”\n]*["”]/g,'"Q"').replace(/(^|[\s(\[:;,])['‘](?:[^'’\n]|['’](?=[A-Za-z]))+?['’](?=$|[\s.,;:!?)\]])/g,"$1'Q'");
const kind=s=>f.KV_KIND.test(s)||f.KV_KIND.test(mask(s))||f.KV_EXCL.test(mask(s));
const T=[
 ['GOOD RESPONSE 43873','The mark is accepted: the ruling\'s kind is an exclusion the quote\'s words do not make.',true],
 ['GOOD STATEMENT 43873','The charge says "rather than as the consequence of the Spirit\'s overshadowing"; the quotation\'s connection back to verse 32 does not itself make that exclusion.',true],
 ['GOOD VOID terra','excludes a reading that the quoted connection back to verse 32 does not itself exclude',true],
 ['BAD quoted charge','The charge says "excludes Joseph"; the quotation does not make it plain.',false],
 ['BAD topic prose','The exclusion of Joseph is the defender\'s whole case.',false],
 ['BAD topic + quote','The exclusion of Joseph from the line is what the quotation is about, and it does not make sense otherwise.',false],
 ['curly quote’s','an exclusion the quote’s words do not make',true],
 ['BAD after-order prose','The quotation does not make the exclusion of Joseph plain.',false],
 ['BAD quoted charge after-order','The quotation does not make "that exclusion".',false],
 ['LIMIT makes','an exclusion the quotation never makes',null],
 ['LIMIT made','an exclusion the quote did not make',null],
 ['LIMIT made2','an exclusion the quote\'s words have not made',null]];
for(const [n,s,want] of T){const g=kind(s);console.log(want===null?'INFO':(g===want?'OK  ':'FAIL'),n,g);}
