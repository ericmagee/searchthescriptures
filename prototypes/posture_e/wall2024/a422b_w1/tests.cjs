// ASK 422(b) (W1): unit cases for the comment rule (W3 8865 B) and plants that the proof must catch.
const {strip,tokens,tree}=require('./strip.cjs');let bad=0;
const eq=(name,src,want)=>{const got=strip(src).text;const ok=got===want&&tokens(src)===tokens(got)&&tree(src)===tree(got);if(!ok)bad++;console.log(ok?'OK  ':'FAIL',name,JSON.stringify(got));};
eq('a block with line breaks -> its line breaks','x=1;/* a\n b\n*/y=2;','x=1;\n\ny=2;');
eq('b block with no line break -> one space','a=b/* x */+c;','a=b +c;');
eq('b joins nothing: "a/* x */b"-style','let a/* x */=1;return/* y */a;','let a =1;return a;');
eq('c line comment text removed, line break stays','x=1; // note\ny=2;','x=1; \ny=2;');
eq('c line comment on last line','x=1;// end','x=1;');
eq('string holding // and /* stays','s="http://a/*b*/";','s="http://a/*b*/";');
eq('regex holding /* stays','r=/a\\/*b/g; // c','r=/a\\/*b/g; ');
eq('template holding // stays','t=`//x ${1/*y*/+2} /*z*/`;','t=`//x ${1 +2} /*z*/`;');
eq('CRLF block keeps CRLF','a;/*\r\n*/b;','a;\r\nb;');
eq('return with multi-line comment keeps ASI','function f(){return/*\n*/1}','function f(){return\n1}');
// plants: a wrong strip must fail token or tree equality
const plant=(name,src,wrong)=>{let caught;try{caught=tokens(src)!==tokens(wrong)||tree(src)!==tree(wrong);}catch(e){caught=true;}if(!caught)bad++;console.log(caught?'OK  ':'FAIL','plant caught:',name);};
plant('join to nothing changes a token','return/* x */a1;','returna1;');
plant('newline lost before 1 changes ASI','function f(){return/*\n*/1}','function f(){return 1}');
plant('string text cut (does not parse)','s="a//b";','s="a');
console.log(bad?'TESTS FAIL '+bad:'TESTS PASS');process.exit(bad?1:0);
