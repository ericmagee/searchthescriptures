// W2 grade of pkgNBR: the flag pattern (old s132 vs NBR, taken from the node code) over every stored 30-day judge text.
// args: <judgments json_agg file> <debate_results json_agg file (id, ivr, rn)>
const fs=require('fs');const W='/mnt/project-files/wall2024/';
const L=f=>{let d=JSON.parse(fs.readFileSync(W+f,'utf8'));d=d.data||d;d=d.workflow||d;return d;};
const grab=(code,anchor)=>{const i=code.indexOf(anchor);const s=code.indexOf('.match(/',i)+8;const e=code.indexOf('/g)',s);return new RegExp(code.slice(s,e),'g');};
const A=L('fetchback_live_s132.json'),B=L('parent_s132_NBR.json');
const fm=d=>d.nodes.find(n=>n.name==='Format Markdown').parameters.jsCode,bs=d=>d.nodes.find(n=>n.name==='Build Save Body').parameters.jsCode;
const OLD=grab(fm(A),"(j.verdict_raw || '').match(/\\[(?:EXTRACTOR"),NEW=grab(fm(B),"(j.verdict_raw || '').match(/\\[(?:EXTRACTOR");
const OLDb=grab(bs(A),"const RVW="),NEWb=grab(bs(B),"const RVW=");
console.log('patterns equal across nodes: old',OLD.source===OLDb.source,'new',NEW.source===NEWb.source);console.log(' old',OLD.source);console.log(' new',NEW.source);
function load(f){const t=JSON.parse(fs.readFileSync(f,'utf8')).result;const a=t.indexOf('>\n',t.indexOf('<untrusted-data-'))+2,b=t.lastIndexOf('\n</untrusted-data-');const rows=JSON.parse(t.slice(a,b));return rows[0][Object.keys(rows[0])[0]];}
const inner=x=>/\[[^\]]*\[/.test(x);
function cmp(label,texts,singleFilter){const C={texts:texts.length,old:0,new:0,added:0,added_inner:0,lost:0,changed:0,rtr_total:0,rtr_unmatched:0,lone_open:0,two_level:0};const ex={added:[],lost:[],unmatched:[]};
 for(const t of texts){const o=(t.match(OLD)||[]).filter(singleFilter),n=(t.match(NEW)||[]).filter(singleFilter);C.old+=o.length;C.new+=n.length;const ns=new Set(n),os=new Set(o);
  for(const x of n)if(!os.has(x)){C.added++;if(inner(x))C.added_inner++;else if(ex.added.length<3)ex.added.push(x.slice(0,160));}
  for(const x of o)if(!ns.has(x)){C.lost++;if(ex.lost.length<3)ex.lost.push(x.slice(0,200));}
  // every REVIEW THIS ROW inside a bracketed AUDIT/EXTRACTOR line must sit inside a new match
  const spans=[];let m;const R=new RegExp(NEW.source,'g');while((m=R.exec(t)))spans.push([m.index,m.index+m[0].length]);
  let i=-1;while((i=t.indexOf('REVIEW THIS ROW',i+1))>=0){const ls=t.lastIndexOf('\n',i)+1;const line=t.slice(ls,t.indexOf('\n',i)<0?t.length:t.indexOf('\n',i));if(!/\[(?:EXTRACTOR|AUDIT) v\d+/.test(line))continue;C.rtr_total++;if(!spans.some(([a,b])=>a<=i&&i<b)){C.rtr_unmatched++;if(ex.unmatched.length<4)ex.unmatched.push(line.slice(0,220));}}
  for(const x of n){if(/\[[^\]\[]*\[[^\]\[]*\[/.test(x))C.two_level++;}
 }
 console.log('==',label,JSON.stringify(C));for(const k in ex)for(const s of ex[k])console.log('   ',k+':',s);return C;}
const J=load(process.argv[2]);cmp('PANEL (debate_judgments verdict_raw; Format Markdown filter: not "single judge")',J.map(j=>String(j.verdict_raw||'')),x=>!/single judge/i.test(x));
const R=load(process.argv[3]);cmp('SINGLE JUDGE (debate_results independent_verdict_raw; Build Save Body, no filter)',R.map(r=>String(r.ivr||'')),x=>true);
// Build Save Body part: does each single-judge flag reach review_notes today?
let br=0,brIn=0,un=0,unIn=0;const miss=[];
for(const r of R){const rn=String(r.rn||'');for(const x of (String(r.ivr||'').match(NEW)||[])){const body=x.replace(/^\[(?:EXTRACTOR|AUDIT) v\d+: /,'').slice(0,70);const inn=inner(x);const hit=rn.includes(body);if(inn){br++;if(hit)brIn++;}else{un++;if(hit)unIn++;else if(miss.length<3)miss.push(x.slice(0,160));}}}
console.log('== review_notes (stored): bracketed single-judge flags',br,'found in review_notes',brIn,'| unbracketed',un,'found',unIn);for(const s of miss)console.log('    unbracketed not found:',s);
