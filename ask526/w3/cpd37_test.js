const fs=require('fs');const src=fs.readFileSync('src_cpd2.js','utf8');
const mk=()=>({isExecuted:false,first:()=>({json:{}}),all:()=>[],params:{}});const $=()=>mk();const $input={all:()=>[],first:()=>({json:{}})};
(async()=>{try{await new Function('$','$input','return (async()=>{\n'+src+'\n})();')($,$input);}catch(e){}
const L=globalThis.__grab();const D=JSON.parse(fs.readFileSync('cpd37.json','utf8'));const out=[];
for(const r of D){const raw=r.raw;let d=0,b=-1,ins=false,esc=false;for(let i=0;i<raw.length;i++){const c=raw[i];if(ins){if(esc)esc=false;else if(c==='\\')esc=true;else if(c==='"')ins=false;continue;}if(c==='"')ins=true;else if(c==='{')d++;else if(c==='}'){d--;if(!d){b=i+1;break;}}}
 const j=raw.slice(0,b);let ob;try{ob=JSON.parse(j);}catch(e){out.push(r.id+' '+r.seat+' JSON-PARSE-FAIL');continue;}
 // new rule: pre = a value never equal to n, so the count-unchanged skip is gone
 const pre={conceded_links:-1,challenger_conceded_links:-1};const res=L.cpdSync(j,pre,r.seat);
 const marks=res.mark.split('\n').filter(Boolean).map(x=>{const sd=(x.match(/SIDE: (\w+)/)||[])[1];if(/PREMISES DERIVED/.test(x))return sd+' DERIVED '+(x.match(/WAS: (\[[^\]]*\]); NOW: (\[[^\]]*\])/)||[]).slice(1).join(' -> ');return sd+' NOT DERIVED: '+((x.match(/WHY: ([^;]*)/)||[])[1]||'').slice(0,90);});
 out.push(r.id+' '+r.seat+' D'+ob.conceded_links+JSON.stringify(ob.counted_premises_defender)+' C'+ob.challenger_conceded_links+JSON.stringify(ob.counted_premises_challenger)+' => '+(marks.join(' | ')||'none'));}
console.log(out.join('\n'));})();
