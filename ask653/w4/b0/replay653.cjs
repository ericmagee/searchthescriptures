const fs=require('fs');
const T=fs.readFileSync('lib_base.js','utf8');
const L0=JSON.parse(T.slice(T.indexOf('\n/*LIB*/')+8,T.lastIndexOf('\n/*MAP*/')));
const M=JSON.parse(T.slice(T.lastIndexOf('\n/*MAP*/')+8,T.lastIndexOf('\n/*END*/')))['L2C Count Plan'];
function patch(L){L=L.slice();const o146=L[146];
 L[146]=o146.replace("|\\brelated\\s+to)","|\\brelated\\s+to|\\bcompare|\\bakin\\s+to)").replace("(?:\\s+(?:root|verb|noun|word|stem|lemma|greek|hebrew|aramaic))*","(?:\\s+(?:root|verb|noun|word|stem|lemma|greek|hebrew|aramaic))*(?:\\s+(?:variation|derivative|prolonged\\s+form|form)\\s+of)?")+" /* ASK 653: compare, akin to, a variation/derivative/form of mark a root */";
 const A="if(!pass)return false;";if(!L[153].includes(A))throw 'anchor';
 L[153]=L[153].replace(A,A+"const __a=pre.match(/([^\\s(*_\"\\u201c\\u201d]+)[*_\"\\u201d\\u2019]*\\s+(?:and|or)(?:\\s+(?:a|an|the))?(?:\\s+(?:variation|derivative|prolonged\\s+form|form)\\s+of)?[\\s*_\"\\u201c\\u201d\\u2018\\u2019'(]*$/i);if(__a){const j=i-pre.length+pre.lastIndexOf(__a[1]);if(wds.some((w,k)=>R.has(k)&&pos[k].includes(j)))return true;} /* ASK 653: an etymology word joined to a root by and/or is a root too */");
 return L;}
function mk(L){let S=M.p.map(e=>typeof e==='number'?L[e]:typeof e[0]==='string'?e[0]:L.slice(e[0],e[1]+1).join('\n')).join('\n');
 S=S.replace('return {tags,tagWords,','return {markRoots,tags,tagWords,');if(!S.includes('return {markRoots,'))throw 'export';
 const $=()=>{throw new Error('no $')};return new Function('$','REFP',S+'\nreturn L2C;')($,new Proxy({},{get:()=>undefined}));}
const OLD=mk(L0),NEW=mk(patch(L0));
for(const run of ['42528','42373']){
 const F=JSON.parse(fs.readFileSync('fx_'+run+'.json','utf8'));const GD={ok:F.e340.ok,eng:F.e340.eng};
 const strip=t=>({...t,words:(t.words||[]).map(w=>({w:w.w,kind:w.kind})),status:undefined,why:undefined});
 const run1=(X)=>X.check(F.tags.map(strip).map(t=>({...t,words:X.markRoots(t.seg,t.words)})),F.ow,F.lex,F.read,GD);
 const A=run1(OLD),B=run1(NEW);
 let repro=0,diff=[];F.tags.forEach((t,j)=>{if(A[j].status===t.status)repro++;if(A[j].status!==B[j].status)diff.push([j,t.side,t.round,A[j].status,B[j].status,(B[j].words||[]).filter(w=>w.root).map(w=>w.w).join(' '),t.seg.slice(0,110)]);});
 const cnt=X=>X.reduce((o,t)=>(o[t.status]=(o[t.status]||0)+1,o),{});
 console.log('RUN',run,'tags',F.tags.length,'harness reproduces stored status',repro+'/'+F.tags.length,'| before',JSON.stringify(cnt(A)),'| after',JSON.stringify(cnt(B)));
 for(const d of diff)console.log('  CHANGED',d.join(' | '));
}
