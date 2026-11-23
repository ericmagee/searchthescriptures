const fs=require('fs');const src=fs.readFileSync('src_cpd2.js','utf8');
const mk=()=>({isExecuted:false,first:()=>({json:{}}),all:()=>[],params:{}});const $=()=>mk();const $input={all:()=>[],first:()=>({json:{}})};
const body=src;
(async()=>{try{await new Function('$','$input','return (async()=>{\n'+body+'\n})();')($,$input);}catch(e){console.log('main threw (expected):',String(e.message).slice(0,100));}
const L=globalThis.__grab();
const raw=fs.readFileSync('v_qwen4max_1265.txt','utf8');
const a=raw.indexOf('{');let d=0,b=-1,ins=false,esc=false;for(let i=a;i<raw.length;i++){const c=raw[i];if(ins){if(esc)esc=false;else if(c==='\\')esc=true;else if(c==='"')ins=false;continue;}if(c==='"')ins=true;else if(c==='{')d++;else if(c==='}'){d--;if(!d){b=i+1;break;}}}
const j=raw.slice(a,b);const ob=JSON.parse(j);
const line=ob.reasoning.split('\n').find(l=>/^CONCEDED LINKS\s*:/.test(l));
console.log('LINE',line.slice(0,100));const g=L.psGrades(line);console.log('psGrades n',g&&g.n,JSON.stringify(g&&g.g));
console.log('array',JSON.stringify(ob.counted_premises_defender),'count',ob.conceded_links);
console.log('today, pre=3:',JSON.stringify(L.cpdSync(j,{conceded_links:3,challenger_conceded_links:0},'qwen4max').mark));
console.log('pre=4:',L.cpdSync(j,{conceded_links:4,challenger_conceded_links:0},'qwen4max').mark.slice(0,300));
})();
