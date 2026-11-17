// ASK 378 harness: runs Format Markdown's header (up to DRV_EFFECT) from live s258 and from the target on stored rows; prints diffs and checks.
const fs=require('fs');
const src=w=>{const c=JSON.parse(fs.readFileSync(w)).nodes.find(n=>n.name==='Format Markdown').parameters.jsCode;const k=c.indexOf('const drvCell');if(k<0)throw new Error('cut');return c.slice(0,k)+'\nreturn {md:t,DRV_EFFECT};';};
const mk=code=>new Function('$','$input','require',code);
const run=(f,d)=>{const $=nm=>{const M={'Get Row':[d.r],'Get Judgments':(d.J||[]),'Get Verse':[{text:''}]};if(nm in M)return {isExecuted:true,first:()=>({json:M[nm][0]}),all:()=>M[nm].map(json=>({json}))};return {isExecuted:false,first:()=>{throw new Error('not run '+nm)},all:()=>{throw new Error('not run '+nm)}};};
 return f($,{all:()=>[],first:()=>({json:{}})},require);};
const OLD=mk(src(process.argv[2])),NEW=mk(src(process.argv[3]));
const pop=JSON.parse(fs.readFileSync(process.argv[4]));const only=process.argv[5];
const hdr=md=>md.split('\n').filter(l=>/^\*\*Outcome:\*\*|^- (Panel judge|Panel result|Seat \d|Verdict of the debate|Reserve seated)/.test(l));
let n=0,err=[],chg=0,stats={agree:0,disagree:[],cntMismatch:[]};
for(const d of pop){d.J=(d.J||[]).map(j=>({...j,verdict_raw:j.verdict_raw||''}));d.r.drv_removed=d.r.drv_removed||null;if(only&&d.r.run_token!==only)continue;n++;
 let o,w;try{o=run(OLD,d);}catch(e){err.push(['old',d.r.run_token,e.message]);continue;}try{w=run(NEW,d);}catch(e){err.push(['new',d.r.run_token,e.message]);continue;}
 // DoD 1 check: counted set against panel_split's "N not counted"
 const cnt=(d.J||[]).filter(j=>!j.truncated&&(+j.drv_uncured||0)===0&&/^(HELD|PARTIAL|BROKEN)$/.test(String(j.verdict_tag||''))).length;const nc=(d.J||[]).length-cnt;const m=String(d.r.panel_split||'').match(/\((\d+) not counted/);const ps=m?+m[1]:0;
 if(nc===ps)stats.agree++;else stats.disagree.push([d.r.run_token,d.r.panel_split,'ours',nc]);
 // DoD 2 check: reasons listed equal drv_uncured
 for(const l of hdr(w.md)){if(/named in the judgment's own record/.test(l))stats.cntMismatch.push([d.r.run_token,(l.match(/NOT COUNTED: .*?own record/)||[''])[0].slice(0,220)]);}
 const ho=hdr(o.md).join('\n'),hn=hdr(w.md).join('\n');if(ho!==hn)chg++;
 if(only){console.log('--- OLD\n'+ho+'\n--- NEW\n'+hn);}
}
console.log('debates',n,'header changed',chg,'errors',err.length,JSON.stringify(err.slice(0,5)));
console.log('DoD1 counted vs panel_split: agree',stats.agree,'disagree',stats.disagree.length,JSON.stringify(stats.disagree.slice(0,10)));
console.log('DoD2 listed != drv_uncured:',stats.cntMismatch.length,JSON.stringify(stats.cntMismatch.slice(0,5)));
if(process.argv[6]==='dump'){for(const d of pop){if(only&&d.r.run_token!==only)continue;try{const w=run(NEW,d);console.log('\n## '+d.r.run_token+'\n'+hdr(w.md).join('\n'));}catch(e){}}}
