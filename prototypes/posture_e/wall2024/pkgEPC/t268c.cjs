const W=require('./target.json');const L=JSON.parse((t=>t.slice(t.indexOf('\n/*LIB*/')+8,t.lastIndexOf('\n/*MAP*/')))(W.nodes.find(n=>n.name==='Shared Library').parameters.jsCode));
const REF='(?:[1-3]\\s)?[A-Z][a-z]+(?:\\s(?:of\\s)?[A-Z][a-z]+)?\\.?\\s\\d{1,3}:\\d{1,3}(?:\\s?[-–]\\s?\\d{1,3})?';const REF0=REF;
const srcs={LIB4:L[4]};for(const nm of ['Panel Build','Build Independent Verdict','D4 Build','Build Save Body'])srcs[nm]=W.nodes.find(n=>n.name===nm).parameters.jsCode;
const R={};for(const k in srcs){const m=srcs[k].match(/(?:START|ST)=(new RegExp\('\(\^\|\(\?<!.*?,'g'\))/);R[k]=eval(m[1]);}
const heads=(re,s)=>{const at=[];let m;re.lastIndex=0;while((m=re.exec(s))){const i=m.index+m[1].length;if(!at.length||i>at[at.length-1])at.push(i);if(re.lastIndex===m.index)re.lastIndex++;}return at.length;};
const O=new RegExp('(^|[;\\n]|^\\s*[-*•]|\\n\\s*[-*•])\\s*[*_]*\\s*('+REF+')[*_]*\\s*[:,]?\\s*(?=["“])','g');
const d=require('./rounds.json');
const syn={F1:'Isaiah 7:14 "a virgin shall conceive" -- MEANS: a -- [L2] parthenos | [L3] Isaiah 7:14 "a virgin shall conceive"; Luke 1:34 "How shall this be" -- MEANS: b -- [L3] Luke 1:27 "a virgin espoused"; Matthew 1:23 "Behold, a virgin" -- MEANS: c',
 plain:'Matthew 1:18 "before they came together"; Matthew 1:24 "took unto him his wife"; Luke 2:4 "of the house"',
 proven:'Acts 2:30 "fruit of his loins" -- MEANS: x -- [L2] osphys | PROVEN IN [CR1]; Romans 1:3 "seed of David" -- MEANS: y | PROVEN IN [CR1]; Luke 2:4 "of the house" -- MEANS: z',
 ezra:'Hebrews 7:14 "For [it is] evident that our Lord sprang out of Juda" -- MEANS: m -- [L3] Numbers 1:2 "by the house of their fathers"; Ezra 2:59 "they could not shew their father\'s house" | PROVEN IN [CR1]\nHebrews 2:17 "Wherefore in all things" -- MEANS: n -- [L3] Hebrews 2:16 "seed of Abraham" | PROVEN IN [CR1]'};
for(const k in R){let n=0,df=[];for(const r of d)for(const f of ['r1','r2','r3']){const t=String(r[f]||'');for(const m of t.matchAll(/PRESSED WITH\s*:/gi)){let seg=t.slice(m.index);const b=seg.search(/\n\s*\n/);if(b>=0)seg=seg.slice(0,b);const s=seg.replace(/^[\s*_]*PRESSED WITH\s*:\s*/i,'');n++;const a=heads(O,s),c=heads(R[k],s);if(a!==c)df.push(r.id.slice(0,8)+' '+f+' '+a+'->'+c);}}
 console.log(k,'blocks',n,'differ',df.length,df.join('; '),'| synth',Object.entries(syn).map(([q,s])=>q+' '+heads(O,s)+'->'+heads(R[k],s)).join(', '));}
