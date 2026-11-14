const W=require('./target.json');const L=JSON.parse((t=>t.slice(t.indexOf('\n/*LIB*/')+8,t.lastIndexOf('\n/*MAP*/')))(W.nodes.find(n=>n.name==='Shared Library').parameters.jsCode));
const d=require('./rounds.json');
const REF='(?:[1-3]\\s)?[A-Z][a-z]+(?:\\s(?:of\\s)?[A-Z][a-z]+)?\\.?\\s\\d{1,3}:\\d{1,3}(?:\\s?[-–]\\s?\\d{1,3})?';const REF0=REF;
const grab=(c,re)=>{const m=c.match(re);return eval(m[1]);};
const srcs={LIB4:L[4]};for(const nm of ['Panel Build','Build Independent Verdict','D4 Build','Build Save Body'])srcs[nm]=W.nodes.find(n=>n.name===nm).parameters.jsCode;
const R={};for(const k in srcs){const m=srcs[k].match(/(?:START|ST)=(new RegExp\('\(\^\|\(\?<!.*?,'g'\))/);R[k]=eval(m[1]);}
const heads=(re,s)=>{const at=[];let m;re.lastIndex=0;while((m=re.exec(s))){const i=m.index+m[1].length;if(!at.length||i>at[at.length-1])at.push(i);if(re.lastIndex===m.index)re.lastIndex++;}return at.length;};
const O=new RegExp('(^|[;\\n]|^\\s*[-*•]|\\n\\s*[-*•])\\s*[*_]*\\s*('+REF+')[*_]*\\s*[:,]?\\s*(?=["“])','g');
for(const k in R){let n=0,df=0;for(const r of d)for(const f of ['r1','r2','r3']){const t=String(r[f]||'');for(const m of t.matchAll(/PRESSED WITH\s*:/gi)){let seg=t.slice(m.index);const b=seg.search(/\n\s*\n/);if(b>=0)seg=seg.slice(0,b);const s=seg.replace(/^[\s*_]*PRESSED WITH\s*:\s*/i,'');n++;if(heads(O,s)!==heads(R[k],s))df++;}}console.log(k,'blocks',n,'differ',df);}
