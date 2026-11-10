// W3 study plant: terra keeps its own D6 break line (no RETRACTED for D6 vs C5). Live s112 against pkgK7C.
const {cmp,srcs}=require('./h.cjs');const T=srcs.chatgpt;
console.log(T.reply.text.split('\n').filter(l=>/D6 vs C5/.test(l)).map(l=>'  REPLY| '+l.slice(0,230)).join('\n'));
const show=(a,b)=>{for(const [n,r] of [['live',a],['K7C',b]])console.log('   '+n,JSON.stringify(r.v.filter(x=>/D6 vs C5/.test(String(x.link))).map(x=>[x.rule,x.status,String(x.why).slice(0,150)])))};
cmp('S0 terra as stored',T,null,null,show);
cmp('S1 terra keeps the line: RETRACTED D6 vs C5 removed',T,null,(items,reply)=>{const n=reply.text.split('\n').length;reply.text=reply.text.split('\n').filter(l=>!/^RETRACTED:\s*D6 vs C5/.test(l)).join('\n');if(reply.text.split('\n').length!==n-1)throw new Error('plant')},show);
cmp('S2 terra keeps the line and says why: RETRACTED removed, responses say NOT HELD on the confirmed contradiction',T,null,(items,reply)=>{reply.text=reply.text.split('\n').filter(l=>!/^RETRACTED:\s*D6 vs C5/.test(l)).map(l=>/^RESPONSE: K-G[47] D6 vs C5/.test(l)?l.replace(/\|[^|]*$/,'| NOT HELD: the break is the confirmed closing contradiction: [CR3] "I drop the wording \\"no biological father\\" as a bare statement" against [CR4] "Christ had no biological father."'):l).join('\n')},show);
