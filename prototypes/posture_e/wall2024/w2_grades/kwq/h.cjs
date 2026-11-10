// W3 harness: cureVerdicts of a workflow file on stored and planted inputs. usage: node h.cjs
const fs=require('fs');const {rebuild}=require('../../pkgLIB/unpack.cjs');const cl=x=>JSON.parse(JSON.stringify(x));
const X=JSON.parse(fs.readFileSync(process.env.EX||'/mnt/project-files/wall2024/ex34703_full.json','utf8'));const RD=(X.data||X).resultData.runData;
const out=n=>{const r=RD[n];if(!r)return null;return r[r.length-1].data.main[0]||[]};
function lib(wf,over){let d=JSON.parse(fs.readFileSync(wf,'utf8'));d=d.data||d;d=d.workflow||d;const by={};d.nodes.forEach(n=>by[n.name]=n);const s=rebuild(by['Gate Record'].parameters.jsCode,by['Shared Library'].parameters.jsCode);const cut=s.indexOf("const PASS=$('Send Back Record')");if(cut<0)throw new Error('cut');
 const $=name=>{let it;if(over&&name in over){if(over[name]===null)return {isExecuted:false,first:()=>{throw new Error('unexecuted')},all:()=>{throw new Error('unexecuted')}};it=[{json:over[name]}];}else{it=out(name);}
  if(!it||!it.length)return {isExecuted:false,first:()=>{throw new Error('unexecuted '+name)},all:()=>{throw new Error('unexecuted '+name)}};return {isExecuted:true,first:()=>cl(it[0]),all:()=>cl(it),last:()=>cl(it[it.length-1])};};
 return new Function('$','$input','$json','$execution',s.slice(0,cut)+'\n;return {cureVerdicts,enfUncured,cecBroken2024};')($,{all:()=>[],first:()=>({json:{}})},{},{id:'x'});}
const BASE=process.env.BASE||'/mnt/project-files/wall2024/fetchback_live_s113.json',CAND=process.env.W3_C;
const srcs={};{const a=out('Alternate Cure Normalize');if(a&&a[0]&&a[0].json&&a[0].json.cure)srcs[a[0].json.cure.seat]=a[0].json;}for(const k of [1,2,3]){const a=out('Panel Cure Normalize '+k);if(a&&a[0]&&a[0].json&&a[0].json.cure)srcs[a[0].json.cure.seat]=a[0].json;}
function run(wf,src,over,mut){const L=lib(wf,over);const items=cl(src.cure.items);const reply=cl(src.reply);if(mut)mut(items,reply);const v=L.cureVerdicts(items,reply,src.cure.broken,src.cure.rounds);return {v,n:L.enfUncured(v),cec:L.cecBroken2024()};}
function cmp(label,src,over,mut,show){const a=run(BASE,src,over,mut),b=run(CAND,src,over,mut);const d=[];a.v.forEach((x,i)=>{const y=b.v[i];if(x.status!==y.status||String(x.why)!==String(y.why))d.push(x.rule+' '+x.link+': '+x.status+' ['+String(x.why).slice(0,90)+'] -> '+y.status+' ['+String(y.why).slice(0,110)+']')});
 console.log('## '+label+' | items '+a.v.length+' | uncured base '+a.n+' cand '+b.n+' | cec '+JSON.stringify(b.cec.map(c=>c.side[0]+c.link))+' | diffs '+d.length);d.forEach(x=>console.log('   '+x));if(show)show(a,b);return {a,b,d};}
module.exports={cmp,run,srcs,out,cl,BASE,CAND};
if(require.main===module){
 const CE=out('Close Enforcer Record')[0].json;const conf=CE.cec.confirmed[0];const ce=(list)=>({cec:{...CE.cec,confirmed:list}});
 for(const s of ['haiku','chatgpt','luna','sol'])cmp('R real '+s,srcs[s]);
 const H=srcs.haiku;
 cmp('P1 no confirmed',H,{'Close Enforcer Record':ce([]),'Judge Contradiction Record':null});
 cmp('P2 defender link 5 only',H,{'Close Enforcer Record':ce([{...conf,link:5}]),'Judge Contradiction Record':null});
 cmp('P3 challenger link 6 only',H,{'Close Enforcer Record':ce([{...conf,side:'CHALLENGER'}]),'Judge Contradiction Record':null});
 const setLink=(l,side)=>(items)=>{const x=items.find(x=>x.rule==='K-G7');x.link=l;if(side)x.side=side;x.line=x.line.replace(/^D6: D6 vs C5/,l)};
 cmp('P4 D16 vs C5, links 6 and 1 confirmed',H,{'Close Enforcer Record':ce([conf,{...conf,link:1}])},setLink('D16 vs C5'));
 cmp('P5 D6 vs C2',H,null,setLink('D6 vs C2'));
 cmp('P6a CHALLENGER item D2 vs C6, challenger 6 confirmed',H,{'Close Enforcer Record':ce([{...conf,side:'CHALLENGER'}]),'Judge Contradiction Record':null},setLink('D2 vs C6','CHALLENGER'));
 cmp('P6b CHALLENGER item D2 vs C6, defender 6 confirmed',H,null,setLink('D2 vs C6','CHALLENGER'));
 cmp('P6c CHALLENGER item D6 vs C2, challenger 6 confirmed',H,{'Close Enforcer Record':ce([{...conf,side:'CHALLENGER'}]),'Judge Contradiction Record':null},setLink('D6 vs C2','CHALLENGER'));
 cmp('P7 extra K-G7 on D1',H,null,(items)=>{const x=items.find(x=>x.rule==='K-G7');items.push({...x,link:'D1 vs C1',premise:5,line:'D1 vs C1 (Luke 1:34): DEFENDER LINK BROKEN -- the pressed witness Luke 1:34 was left unanswered. GROUND: [L1] Luke 1:34 "How shall this be, seeing I know not a man?"'})},(a,b)=>{for(const r of [a,b])console.log('   D1:',JSON.stringify(r.v.filter(x=>x.rule==='K-G7').map(x=>[x.link,x.status,String(x.why).slice(0,160)])))});
 cmp('P8a link as string',H,{'Close Enforcer Record':ce([{...conf,link:'6'}])});
 cmp('P8b side missing',H,{'Close Enforcer Record':ce([{...conf,side:undefined}]),'Judge Contradiction Record':null});
 cmp('P9 from Judge Contradiction Record only',H,{'Close Enforcer Record':ce([]),'Judge Contradiction Record':{jcc:{confirmed:[conf]}}});
 cmp('P10 neither executed',H,{'Close Enforcer Record':null,'Judge Contradiction Record':null});
 for(const r of ['K-G4','K-G1','K-F','K-C','K-G6'])cmp('P11 rule '+r+' on D6',H,null,(items)=>{const x=items.find(x=>x.rule==='K-G7');x.rule=r});
 cmp('P12 witness-ground line on D6',H,null,(items)=>{const x=items.find(x=>x.rule==='K-G7');x.line='D6: D6 vs C5 (Hebrews 2:14): DEFENDER LINK BROKEN -- the pressed witness Hebrews 2:14 was left unanswered by the defender. GROUND: [L1] Hebrews 2:14 "he also himself likewise took part of the same"'});
 console.log('JCR present in 34703:',!!out('Judge Contradiction Record'),JSON.stringify((out('Judge Contradiction Record')[0].json.jcc||{}).confirmed||null).slice(0,300));
}
