// W2 plants for pkgEAD (labels in this header, written before any run of rev 2). Run on 34108 stored inputs, Send Back Build, luna item ANSWER CHECK Luke 1:34 [CR3].
// usage: CAND=<write file> node w2_grades/ead/plants_EAD_w2.cjs
// EXPECTED (rev 2):
//  N0 as stored (pointer to LINK 4, a layered answer)                                   WITHHELD
//  F1 the LINK 4 heading renamed LINK 9: the pointer names a link no round holds          SENT
//  F2 every other line of CR3 and CR4 naming Luke 1:34 removed, LINK 4 heading kept        SENT  (LINK 4 block no longer names the verse)
//  F3 the grant line alone names the verse, LINK 4 block replaced by "As above."          SENT
//  F4 rounds CR3 and CR4 absent from the stored rounds                                    SENT, no error
//  F5 the reason's deferral words removed ("I answer it fully under LINK 4" cut)           SENT
//  F6 the same reason on an E-ANS item that carries pkgUND (und:true)                      SENT
//  F7 reason "(right: FAILS)" in place of "(right: MISSES)"                                SENT
//  F8 pointer to LINK 4 whose block answers another verse only (Luke 1:34 renamed Luke 1:99 inside LINK 4) SENT, else a limit (bareness test)
const H=require('./node_EAD_w2.cjs');const cl=H.cl;const RUN='34108',N='Send Back Build',P='Judge Enforcer Record',IT='ANSWER CHECK Luke 1:34 [CR3]';
const base=n=>cl(H.raw(RUN,n));
const withRounds=f=>{const o={};for(const k of [1,2,3]){const n='Panel Cure Normalize '+k;const v=base(n);if(v&&v[0]&&v[0].json.cure&&v[0].json.cure.rounds)f(v[0].json.cure.rounds);o[n]=v;}return o;};
const withRow=f=>{const v=base(P);for(const r of (v[0].json.enf428_rows||[]))if(r.seat==='luna'&&r.item===IT)f(r);return {[P]:v};};
const link4=t=>{const a=t.indexOf('**LINK 4:'),b=t.indexOf('**LINK 5:');return [a,b];};
const P_={
 N0:{},
 F1:withRounds(R=>{R.CR3=R.CR3.replace('**LINK 4:','**LINK 9:');}),
 F2:withRounds(R=>{const g='I answer it fully under LINK 4.';R.CR3=R.CR3.split('\n').filter(l=>!/Luke 1:34/.test(l)||l.includes(g)).join('\n');R.CR4=R.CR4.split('\n').filter(l=>!/Luke 1:34/.test(l)).join('\n');}),
 F3:withRounds(R=>{const [a,b]=link4(R.CR3);R.CR3=R.CR3.slice(0,a)+'**LINK 4: SUPPORTED**\n\nAs above.\n\n'+R.CR3.slice(b);}),
 F4:withRounds(R=>{delete R.CR3;delete R.CR4;}),
 F5:withRow(r=>{r.cure_reason=r.cure_reason.replace(/ and defers, "I answer it fully under LINK 4,"/,'');}),
 F6:null,
 F7:withRow(r=>{r.cure_reason=r.cure_reason.replace('(right: MISSES)','(right: FAILS)');}),
 F8:withRounds(R=>{const [a,b]=link4(R.CR3);R.CR3=R.CR3.slice(0,a)+R.CR3.slice(a,b).replace(/Luke 1:34/g,'Luke 1:99').replace(/1:34/g,'1:99')+R.CR3.slice(b);}),
};
(async()=>{const cb=H.code(H.B,N);
 for(const [k,over] of Object.entries(P_)){let o=over,code=cb;
  if(k==='F6'){code=cb.replace('const __ead=(()=>{','const __ead=(()=>{').replace("return x=>{if(!R||","return x=>{if(x.item==='"+IT+"'&&x.seat==='luna')x.und=true;if(!R||");if(code===cb){console.log('F6 plant did not apply');continue;}}
  const g=n=>o&&n in o?o[n]:H.raw(RUN,n);
  const out=await (async()=>{const inp=g(P)||[];const AF=Object.getPrototypeOf(async function(){}).constructor;const RM=require('../../pkgLIB/runner_model.cjs');
   const mk=name=>{const it=g(name);if(it===null){const no=()=>{throw new Error('unexecuted '+name);};return {isExecuted:false,first:no,last:no,all:no,params:{}};}return {isExecuted:true,first:()=>cl(it[0]),last:()=>cl(it[it.length-1]),all:()=>cl(it),params:{}};};
   const $input={first:()=>cl(inp[0]),last:()=>cl(inp[inp.length-1]),all:()=>cl(inp),get item(){return cl(inp[0]);}};
   try{return (await new AF('$','$input','$json','$execution',code)(RM.gate(RM.needs(code),mk),$input,inp[0]&&inp[0].json,{id:RUN})).map(x=>x.json);}catch(e){return {ERR:String(e.message)};}})();
  if(out.ERR){console.log(k,'ERROR',out.ERR);continue;}
  const ns=out.flatMap(j=>(j.sb_not_sent||[]).filter(y=>y.seat==='luna'&&y.item===IT));const sent=out.some(j=>j.seat==='luna'&&(j.items||[]).some(i=>i.item===IT));
  console.log(k,sent?'SENT':(ns.length?'WITHHELD':'ABSENT'),ns.length?'| '+ns[0].why.slice(0,230):'');}})();
