// pkgCRX: the shared contradiction rule text. Source of truth = the PROMPT of Close Enforcer Build.
// RULES = the definition, the NOT-a-contradiction list and the CLOSING BLOCK sentence (lines 3-5); FORMAT = the reply lines (from "Reply with").
const lit=(s,k)=>{const i=s.indexOf('const '+k+'=')+('const '+k+'=').length;const q=s[i];let j=i+1;while(s[j]!==q){if(s[j]==='\\')j++;j++;}return eval(s.slice(i,j+1));};
const RULES=p=>{const a=p.indexOf('A contradiction is two statements');const b=p.indexOf('Quote both sentences word for word');if(a<0||b<0)throw new Error('RULES anchors');return p.slice(a,b);};
const FORMAT=p=>{const a=p.indexOf('Reply with one line per contradiction');if(a<0)throw new Error('FORMAT anchor');return p.slice(a);};
const cecBlockOf=s=>{const a=s.indexOf('const cecBlock=function');const e='return T.slice(s,e).trim();};';const b=s.indexOf(e,a);if(a<0||b<0)throw new Error('cecBlock');return s.slice(a,b+e.length);};
module.exports={lit,RULES,FORMAT,cecBlockOf};
