const rows=require('./cure_rows.json');
const mask=s=>String(s).replace(/["“][^"”\n]*["”]/g,'"Q"').replace(/(^|[\s(\[:;,])['‘](?:[^'’\n]|['’](?=[A-Za-z]))+?['’](?=$|[\s.,;:!?)\]])/g,"$1'Q'");
const EX='\\bexclu(?:sions?|des?|ding)\\b';
const Q='\\b(?:quote|quoted|quotation)\\b';
const NEG='\\b(?:do(?:es)?\\s+not|never)\\s+(?:[a-z]+\\s+)?(?:make|exclude)\\b';
const KV_EXCL=new RegExp(EX+'[^.;]{0,40}'+Q+'[^.;]{0,40}'+NEG+'\\s*(?=$|[.;,:)\\]])|'+Q+'[^.;]{0,60}'+NEG+'\\s+(?:that|this|the|such|an|any)\\s+'+EX+'\\s*(?=$|[.;,:)\\]])','i');console.log(KV_EXCL.source);
const tests=[
 ['GOOD RESPONSE 43873','The mark is accepted: the ruling\'s kind is an exclusion the quote\'s words do not make.',true],
 ['GOOD STATEMENT 43873','The charge says "rather than as the consequence of the Spirit\'s overshadowing"; the quotation\'s connection back to verse 32 does not itself make that exclusion.',true],
 ['GOOD VOID terra','excludes a reading that the quoted connection back to verse 32 does not itself exclude',true],
 ['BAD quoted charge','The charge says "excludes Joseph"; the quotation does not make it plain.',false],
 ['BAD topic prose','The exclusion of Joseph is the defender\'s whole case.',false],
 ['BAD topic + quote','The exclusion of Joseph from the line is what the quotation is about, and it does not make sense otherwise.',false],
 ['curly quote’s','an exclusion the quote’s words do not make',true],
['BAD after-order prose','The quotation does not make the exclusion of Joseph plain.',false],
 ['BAD quoted charge after-order','The quotation does not make "that exclusion".',false],
];
for(const [n,s,want] of tests){const got=KV_EXCL.test(mask(s));console.log((got===want?'OK  ':'FAIL'),n,'got',got);}
let hits=[];
for(const r of rows){for(const f of ['response_line','flagged_line']){const v=r[f]||'';if(KV_EXCL.test(mask(v)))hits.push([r.id,r.cure_status,f,v.slice(0,220)]);}}
console.log('rows',rows.length,'hits',hits.length);hits.forEach(h=>console.log(h.join(' | ')));
const KV_KIND=/\bnegations?\b|\bnegative\b|\buniversals?\b|\bclaim\b[^.;]{0,60}\b(?:quote|quoted|quotation)\b[^.;]{0,40}\b(?:do(?:es)?\s+not|never)\s+(?:[a-z]+\s+)?make|\bgo(?:es)?\s+beyond\s+(?:the\s+)?(?:quoted?\b|quotation\b|['‘"“])|\bclaim\b[^.;]{0,30}\bnot\s+(?:made|in)\b[^.;]{0,20}\b(?:quote|quoted|quotation)\b/i;
for(const id of [19468,41520,43873]){const r=rows.find(x=>x.id===id);for(const f of ['response_line','flagged_line']){const v=(r[f]||'').split(' -- ')[0];console.log(id,f,'old',KV_KIND.test(v)||KV_KIND.test(mask(v)),'new',KV_KIND.test(v)||KV_KIND.test(mask(v))||KV_EXCL.test(mask(v)));}}
