// ASK 424 R6d: the inline MAP text of "Extract Independent Verdict" compared directly, engine against child, base and target;
// and the parts that changed between base and target, with a check that no changed part gained a $( call not followed by a quote.
const path=require('path'),crypto=require('crypto');const T=require(path.join(__dirname,'../tools/lib.cjs'));
const ld=p=>{let d=require(path.resolve(p));return d.data&&d.data.nodes?d.data:d;};const sha=s=>crypto.createHash('sha256').update(s).digest('hex').slice(0,12);
const [BE,BC,TE,TC]=process.argv.slice(2).map(ld);const K='Extract Independent Verdict';const M=w=>T.unpack(w).M[K];
const s=x=>sha(JSON.stringify(x));console.log('MAP',K,'base engine',s(M(BE)),'base child',s(M(BC)),'target engine',s(M(TE)),'target child',s(M(TC)));
console.log('base engine = base child:',s(M(BE))===s(M(BC)),'| target engine = target child:',s(M(TE))===s(M(TC)));
const b=M(BE).p,t=M(TE).p;let ch=[];t.forEach((x,i)=>{if(JSON.stringify(x)!==JSON.stringify(b[i]))ch.push(i);});
console.log('parts',b.length,'->',t.length,'| changed parts',ch.join(', '),'| n',M(BE).n,'->',M(TE).n);
const bad=/\$\((?!\s*['"`])/;ch.forEach(i=>{const o=String(b[i]),n=String(t[i]);console.log('part',i,'old',sha(o),'new',sha(n),'| new $( without quote:',bad.test(n)&&!bad.test(o)?'YES':'no');});
const whole=w=>T.rb(T.unpack(w).L,M(w));console.log('rebuilt text: target engine',sha(whole(TE)),'target child',sha(whole(TC)),'equal',whole(TE)===whole(TC));
