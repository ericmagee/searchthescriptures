const fs=require('fs');const D='/tmp/claude-0/-home-user/86d59483-62fd-5fa0-b8c4-6322500f4823/scratchpad/';
const src=fs.readFileSync(D+'act274/kcnt.js','utf8');const W=JSON.parse(fs.readFileSync(D+'act/target.json','utf8')).nodes.find(n=>n.name==='C4 Extract').parameters.jsCode;const i=W.indexOf('const REFP'),j=W.indexOf('const C4P');
const K=new Function(W.slice(i,j)+'\n'+src+'\nreturn __kcnt;')();
const R=JSON.parse(fs.readFileSync(process.argv[2],'utf8')).result;const a0=R.indexOf('\n[{"j":')+1,a1=R.lastIndexOf(']\n</untrusted')+1;const X=JSON.parse(R.slice(a0,a1))[0].j;
let n=0,f=0,rpt=0;for(const x of X){const t=String(x.t);const body=t.replace(/\\n/g,'\n').replace(/\\"/g,'"');const sup=[...body.matchAll(/\[AUDIT v27: SUPERSEDED LINE -- (?:SEAT: [^;]*; )?LABEL: ([^;]*); ORIGINAL: ([\s\S]*?) ; END\]/g)];const cut=body.indexOf('\n[AUDIT');const main=(cut<0?body:body.slice(0,cut)).split('\n');
 const rp=[];for(const s of sup){const o=s[2];const key=o.match(/^(?:[-•]\s*)?(ANSWER CHECK: [^-]+?) --|^(?:[-•]\s*)?(D\d+ vs C\d+)/);if(!key)continue;const k=key[1]||key[2];const nn=main.find(l=>l.replace(/^(?:[-•]\s*)?/,'').startsWith(k)&&l!==o)||'';rp.push([o,nn,'S?']);}
 n++;rpt+=rp.length;const o=K(rp,t,'j'+x.id);if(o){f++;console.log('== judgment',x.id,o.replace(/\n/g,' ').slice(0,700));}}
console.log({judgments:n,rp_pairs:rpt,flagged:f});
