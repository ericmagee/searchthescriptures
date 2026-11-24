// ASK 596 S3 (W4): the judge's line is never cut where it is stored or shown. Places are found by scanning the code, not by a list.
// (a) every object that sets flagged_line: a cut in its value, or in the property its value reads from a producer in the same source, is a FAIL.
//     A place whose producer the scan cannot follow is UNRESOLVED; their count has a baseline, and a count above it is a FAIL (a new place must be read and the baseline raised by its ASK).
// (b) a send-back text that shows the judge its own line ("Your line: ...") with a cut: baseline count (3 on the ASK 595 target, ASK 597 takes it to 0).
const {sources}=require('../lib.cjs');
const CUT=/\.(?:slice|substring|substr)\(\s*0\s*,\s*\d+\s*\)|\bleft\(/;
function expr(s,i){let d=0;for(let k=i;k<s.length;k++){const ch=s[k];if(ch==="'"||ch==='"'||ch==='`'){const q=ch;k++;while(k<s.length&&s[k]!==q){if(s[k]==='\\')k++;k++;}continue;}if('([{'.includes(ch))d++;else if(')]}'.includes(ch)){if(d===0)return s.slice(i,k);d--;}else if(ch===','&&d===0)return s.slice(i,k);}return s.slice(i);}
function body(s,name){const esc=name.replace(/[$]/g,'\\$');const re=new RegExp('(?:function\\s+'+esc+'\\s*\\(|(?:const|let|var)\\s+'+esc+'\\s*=|[{,]\\s*'+esc+'\\s*:\\s*(?:function|\\(|[A-Za-z_$][\\w$]*\\s*=>))');const m=re.exec(s);if(!m)return null;const b=s.indexOf('{',m.index+m[0].length-1);if(b<0)return null;let d=0;for(let k=b;k<s.length;k++){const ch=s[k];if(ch==="'"||ch==='"'||ch==='`'){const q=ch;k++;while(k<s.length&&s[k]!==q){if(s[k]==='\\')k++;k++;}continue;}if(ch==='{')d++;else if(ch==='}'){d--;if(d===0)return s.slice(m.index,k+1);}}return null;}
function producer(s,at,v){const pre=s.slice(0,at);const esc=v.replace(/[$]/g,'\\$');const pats=[new RegExp('for\\s*\\(\\s*(?:const|let|var)\\s+'+esc+'\\s+of\\s+([^;{]+?)\\)\\s*[{\\w]','g'),new RegExp('(?:const|let|var)\\s+'+esc+'\\s*=\\s*([^;\\n]+)','g'),new RegExp('\\.(?:forEach|map|filter|flatMap|find|some|every)\\(\\s*\\(?\\s*'+esc+'\\s*(?:,[^)]*)?\\)?\\s*=>','g')];
 let best=null;for(const re of pats){let m;while((m=re.exec(pre))){if(!best||m.index>best.i)best={i:m.index,src:m[1]||null,kind:re===pats[2]?'param':'bind'};}}return best;}
function scan(W,tag){const out=[];const seen=new Set();
 for(const [name,s] of sources(W)){let m;const re=/\bflagged_line\s*:/g;while((m=re.exec(s))){const e=expr(s,m.index+m[0].length).trim();const key=s.slice(Math.max(0,m.index-120),m.index+e.length+40);if(seen.has(key))continue;seen.add(key);
  const site={where:tag+' '+name,expr:e.slice(0,160)};if(e==='null')continue;
  if(CUT.test(e)){out.push({...site,state:'CUT',why:'the value is cut: '+e.slice(0,120)});continue;}
  const mm=e.match(/^(?:String\()?\s*([A-Za-z_$][\w$]*)(?:\.([A-Za-z_$][\w$]*))?/);if(!mm){out.push({...site,state:'UNRESOLVED',why:'value form'});continue;}
  const v=mm[1],p=mm[2];if(!p){out.push({...site,state:/^(?:l|ln|line|__l|t|raw)$/.test(v)?'UNRESOLVED':'UNRESOLVED',why:'a plain variable ('+v+')'});continue;}
  const pr=producer(s,m.index,v);if(!pr||!pr.src){out.push({...site,state:'UNRESOLVED',why:'no producer of '+v+' in the same source'});continue;}
  const call=pr.src.match(/(?:^|[^\w$.])([A-Za-z_$][\w$]*)(?:\.([A-Za-z_$][\w$]*))?\s*\(/);let fb=null;if(call)fb=body(s,call[2]||call[1]);
  if(!fb){out.push({...site,state:'UNRESOLVED',why:v+' comes from '+pr.src.slice(0,80)});continue;}
  const pre=new RegExp('[{,]\\s*'+p+'\\s*:\\s*([^,}]*)','g');let q,cutp=null,setp=false;while((q=pre.exec(fb))){setp=true;if(CUT.test(expr(fb,q.index+q[0].length-q[1].length)))cutp=q[0];}
  if(cutp)out.push({...site,state:'CUT',why:v+'.'+p+' is set cut by '+(call[2]||call[1])+': '+cutp.slice(0,120)});
  else if(setp)out.push({...site,state:'OK',why:v+'.'+p+' set whole by '+(call[2]||call[1])});
  else out.push({...site,state:'UNRESOLVED',why:(call[2]||call[1])+' sets no '+p+':'});}}
 return out;}
function shown(W){const set=new Set();for(const [,s] of sources(W)){let m;const re=/[Yy]our line:\s*(?:\\?["'])?'\s*\+\s*([^+]{1,80}?)\.slice\(0,\s*\d+\)/g;while((m=re.exec(s)))set.add(s.slice(Math.max(0,m.index-60),m.index+m[0].length));}return [...set];}
module.exports=(ctx)=>{const {E,C,T,group,base}=ctx;const K=x=>x.where+' :: '+x.expr;
 group('S3 (a): flagged_line is stored and shown whole',()=>{const all=scan(E,'engine').concat(scan(C,'child'));const known=base('s3_cut_known')||[];const cut=all.filter(x=>x.state==='CUT'),un=all.filter(x=>x.state==='UNRESOLVED'),ok=all.filter(x=>x.state==='OK');
  const newcut=cut.filter(x=>!known.includes(K(x)));for(const x of newcut)T('S3.a CUT',false,x.where+': '+x.why);
  T('S3.a',newcut.length===0,'places that set flagged_line: '+all.length+' found by scan ('+ok.length+' traced whole, '+un.length+' not traced, '+cut.length+' cut, of them '+(cut.length-newcut.length)+' on the named baseline list); new cuts: '+newcut.length);
  const bu=base('s3_unresolved')||[];const nu=un.filter(x=>!bu.includes(K(x)));T('S3.a UNTRACED',nu.length===0,'places the scan cannot trace: '+un.length+', not on the baseline list: '+nu.length+(nu.length?' ('+nu.map(K).join(' | ').slice(0,600)+')':''));
  ctx.detail('s3_unresolved',un.map(K));ctx.detail('s3_cut',cut.map(K));});
 group('S3 (b): the judge\'s own line shown in a send-back text',()=>{const s=[...new Set(shown(E).concat(shown(C)))];const b=base('s3_shown_cut');T('S3.b',s.length<=b,'send-back texts that show "Your line:" cut: '+s.length+' (baseline '+b+'; ASK 597 takes it to 0)');ctx.detail('s3_shown_cut',s);});
};
module.exports.scan=scan;module.exports.shown=shown;
