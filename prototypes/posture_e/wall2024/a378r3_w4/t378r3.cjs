// ASK 378 rev 3.3 harness: header (up to DRV_EFFECT) from live s261 and from the target, over stored rows (pop3.json: 166 debates, 483 judgments, 59 removed seats).
const fs=require('fs');
const src=w=>{const c=JSON.parse(fs.readFileSync(w)).nodes.find(n=>n.name==='Format Markdown').parameters.jsCode;const k=c.indexOf('const drvCell');if(k<0)throw new Error('cut');return c.slice(0,k)+'\nreturn {md:t,chgList:typeof chgList==="function"?chgList:null,resWord:typeof resWord==="function"?resWord:null};';};
const mk=code=>new Function('$','$input','require',code);
const run=(f,d)=>{const $=nm=>{const M={'Get Row':[d.r],'Get Judgments':(d.J||[]),'Get Verse':[{text:''}]};if(nm in M)return {isExecuted:true,first:()=>({json:M[nm][0]}),all:()=>M[nm].map(json=>({json}))};return {isExecuted:false,first:()=>{throw new Error('not run '+nm)},all:()=>{throw new Error('not run '+nm)}};};return f($,{all:()=>[],first:()=>({json:{}})},require);};
const OLD=mk(src(process.argv[2])),NEW=mk(src(process.argv[3]));const pop=JSON.parse(fs.readFileSync(process.argv[4]));const only=process.argv[5];
const hdr=md=>md.split('\n').filter(l=>/^\*\*Outcome:\*\*|^- (Panel judge|Panel result|Verdict of the debate|Reserve seated)/.test(l));
const S={debates:0,errors:[],changed:0,dod1_lines:0,dod1_bad:[],rw_port:{eq:0,ne:[]},chain:{rows:0,bad:[]},lastRes:{rows:0,bad:[]},kinds:{},diffKinds:{},seatsOld:0,seatsNew:0};
for(const d of pop){d.J=(d.J||[]).map(j=>({...j,verdict_raw:j.verdict_raw||''}));d.r.drv_removed=d.r.drv_removed||null;if(only&&d.r.run_token!==only)continue;S.debates++;
 let o,w;try{o=run(OLD,d);}catch(e){S.errors.push(['old',d.r.run_token,e.message]);continue;}try{w=run(NEW,d);}catch(e){S.errors.push(['new',d.r.run_token,e.message]);continue;}
 const ho=hdr(o.md),hn=hdr(w.md);if(ho.join('\n')!==hn.join('\n'))S.changed++;
 const so=new Set(ho),sn=new Set(hn);ho.filter(l=>!sn.has(l)).concat(hn.filter(l=>!so.has(l))).forEach(l=>{const k=(l.match(/^(\*\*Outcome|- Panel judge \d+[^:]*'s seat stayed empty|- Panel judge|- Panel result|- Verdict of the debate|- Reserve seated)/)||['other'])[0].replace(/\d+/,'N');S.diffKinds[k]=(S.diffKinds[k]||0)+1;});
 S.seatsOld+=new Set(ho.filter(l=>/^- Panel judge \d+/.test(l)).map(l=>l.match(/^- Panel judge (\d+)/)[1])).size;S.seatsNew+=new Set(hn.filter(l=>/^- Panel judge \d+/.test(l)).map(l=>l.match(/^- Panel judge (\d+)/)[1])).size;
 // DoD 1: every NOT COUNTED line (removed or not) lists exactly drv_uncured reasons
 hn.filter(l=>/NOT COUNTED: \d+ debate rule violation/.test(l)).forEach(l=>{S.dod1_lines++;if(/named in the judgment's own record/.test(l))S.dod1_bad.push([d.r.run_token,l.slice(0,200)]);});
 // DoD 2 and W2 A: per judgment row and removed seat
 const rows=d.J.map(j=>({seat:j.judge_seat,raw:j.verdict_raw,vt:j.verdict_tag,cs:j.challenge_standing,sql:j.sql_rw,id:j.id})).concat((d.r.drv_removed||[]).map(x=>({seat:x.seat,raw:x.verdict_raw||'',vt:x.verdict_tag,cs:x.challenge_standing,sql:x.sql_rw,id:'drv:'+x.seat})));
 for(const q of rows){const rw=w.resWord(q.raw,q.seat,q.cs);if(rw===(q.sql||null))S.rw_port.eq++;else S.rw_port.ne.push([d.r.run_token,q.id,rw,q.sql]);
  const L=w.chgList(q.raw);const key=L.map(c=>c.k).join('')||'none';S.kinds[key]=(S.kinds[key]||0)+1;
  const V=L.filter(c=>c.of&&c.to&&c.of!==c.to);if(V.length){S.chain.rows++;let ok=true;for(let i=1;i<V.length;i++)if(V[i].of!==V[i-1].to)ok=false;if(V[V.length-1].to!==q.vt)ok=false;if(!ok)S.chain.bad.push([d.r.run_token,q.id,V.map(c=>c.k+':'+c.of+'>'+c.to).join(' '),q.vt]);}
  const R=L.filter(c=>c.ro&&c.rt&&c.ro!==c.rt);if(R.length){S.lastRes.rows++;if(R[R.length-1].rt!==rw)S.lastRes.bad.push([d.r.run_token,q.id,R.map(c=>c.k+':'+c.ro+'>'+c.rt).join(' '),'shown',rw]);}}
 if(only){console.log('--- OLD\n'+ho.join('\n')+'\n--- NEW\n'+hn.join('\n'));}}
console.log(JSON.stringify({debates:S.debates,errors:S.errors.length,errs:S.errors.slice(0,3),header_changed:S.changed,diff_line_kinds:S.diffKinds,panel_seat_numbers_old:S.seatsOld,new:S.seatsNew,
 dod1:{lines:S.dod1_lines,bad:S.dod1_bad.length,ex:S.dod1_bad.slice(0,3)},resultword_port_vs_sql:{equal:S.rw_port.eq,differ:S.rw_port.ne.length,ex:S.rw_port.ne.slice(0,5)},
 change_kinds:S.kinds,dod2_chain:{rows:S.chain.rows,bad:S.chain.bad.length,ex:S.chain.bad.slice(0,5)},dod2_last_result_vs_shown:{rows:S.lastRes.rows,bad:S.lastRes.bad.length,ex:S.lastRes.bad.slice(0,8)}},null,1));
