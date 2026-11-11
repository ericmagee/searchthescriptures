// pkgSJK replay: Build Save Body base (argv[2]) vs SJK (argv[3]) on every stored export. review_notes split into flag items;
// every change must be one single-judge flag whose REVIEW THIS ROW became the single judge's CURED text; nothing else may change.
const fs=require('fs');const run=require('../pkgKSR/run_node.cjs');const P='/mnt/project-files/wall2024/';
const un=p=>{let j=JSON.parse(fs.readFileSync(p));j=j.data||j;return j.workflow||j};const cd=(p,n)=>un(p).nodes.find(x=>x.name===n).parameters.jsCode;
const A=cd(process.argv[2]||'/tmp/claude-0/cmx/nbr2.json','Build Save Body'),B=cd(process.argv[3]||'/tmp/claude-0/cmx/sjk.json','Build Save Body');
const g=o=>{const j=JSON.parse(JSON.stringify(o));const x=(Array.isArray(j)?j[0]:j);const s=x&&(x.json||x);return s;};
const CUREDTXT="CURED by the single judge's cure reply; recorded, not for review.";
(async()=>{const T={};for(const e of fs.readdirSync(P).filter(x=>/^ex\d+_full\.json$/.test(x))){const rd=JSON.parse(fs.readFileSync(P+e,'utf8')).data.resultData.runData;if(!rd['Build Save Body'])continue;
 const a=g(await run(A,'Build Save Body',rd)),b=g(await run(B,'Build Save Body',rd));if(!a||!b||a.err||b.err){console.log(e,'ERR');continue;}
 const ra=(a.saveBody||{}).review_notes||'',rb=(b.saveBody||{}).review_notes||'';
 const rest=s=>JSON.stringify({...s,saveBody:{...s.saveBody,review_notes:null}});const other=rest(a)!==rest(b);
 const ITEM=/\[(?:[^\[\]]|\[(?:[^\[\]]|\[[^\[\]]*\])*\])*\]/g;const ia=ra.match(ITEM)||[],ib=rb.match(ITEM)||[];
 const strip=ra.replace(ITEM,''),stripb=rb.replace(ITEM,'');let bad=ia.length!==ib.length||strip!==stripb;const kinds={};let ch=0,odd=[];
 if(!bad)for(let i=0;i<ia.length;i++){if(ia[i]===ib[i])continue;ch++;const ok=/SINGLE JUDGE \(second opinion\)/.test(ia[i])&&/REVIEW THIS ROW\.?/.test(ia[i])&&ia[i].replace(/REVIEW THIS ROW\.?/,CUREDTXT)===ib[i];if(!ok)odd.push(ib[i].slice(0,160));const k=/\(K-W; ruling/.test(ia[i])?'K-W':/\(S3; ruling/.test(ia[i])?'K-S3':'other: '+(ia[i].match(/\((K-[A-Z0-9]+)/)||[])[1];kinds[k]=(kinds[k]||0)+1;}
 const nA=0,nB=ch;
 console.log(e,'items',ia.length,ib.length,'| changed',ch,JSON.stringify(kinds),'| not a plain REVIEW->CURED change',odd.length,'| text outside items or count differs',bad,'| other fields differ',other);odd.forEach(x=>console.log('   ODD',x));T.n=(T.n||0)+nB-nA;}
 console.log('TOTAL newly cured',T.n);})();
