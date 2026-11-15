// ASK 324 test: load L2C from every changed reader (library lines 92-233 and the 21 inline nodes), old vs new; synthetic cases; 60-debate replay.
const fs=require('fs'),zlib=require('zlib');
const OLD=JSON.parse(fs.readFileSync('../a323/target_323.json')).nodes,NEW=JSON.parse(fs.readFileSync('target_324.json')).nodes;
const libS=(ns,k)=>{const T=ns.find(n=>n.name==='Shared Library').parameters.jsCode;const L=JSON.parse(T.slice(T.indexOf('\n/*LIB*/')+8,T.lastIndexOf('\n/*MAP*/')));const M=JSON.parse(T.slice(T.lastIndexOf('\n/*MAP*/')+8,T.lastIndexOf('\n/*END*/')));const m=M[k];return m.p.map(e=>typeof e==='number'?L[e]:typeof e[0]==='string'?e[0]:L.slice(e[0],e[1]+1).join('\n')).join('\n');};
const grab=src=>{const i=src.indexOf('const L2C=(()=>{');const j=src.indexOf('return {tags',i);const k=src.indexOf('})();',j)+5;return src.slice(i,k);};
const ev=s=>new Function(s+'\nreturn L2C;')();
const readers=[];
for(const k of ['Cure Check','Alternate Merge Seat','Extract Independent Verdict','Panel Payloads','Gate Record'])readers.push([k==='Cure Check'?'LIB 92-233':'LIB:'+k,ev(grab(libS(OLD,k))),ev(grab(libS(NEW,k)))]);
for(const n of NEW){const s=n.parameters&&n.parameters.jsCode;if(!s||n.name==='Shared Library'||!s.includes('function tagWords('))continue;const o=OLD.find(x=>x.name===n.name).parameters.jsCode;readers.push([n.name,ev(grab(o)),ev(grab(s))]);}
console.log('readers loaded',readers.length);
let p=0,t=0;const ok=(nm,c)=>{t++;if(c)p++;else console.log('FAIL '+nm);};
const LAB='G1 [CR2] "I grant three points." -- SUPPORTS: none\nG5 [CR2] "I grant that ek marks mothers in all three." -- SUPPORTS: x\n**G6** [CR3] "I grant y." -- SUPPORTS: z\n';
const BLK=b=>'### 7. Matthew\'s line\n\n- [L1] Matthew 1:16: "And Jacob begat Joseph the husband of Mary, of whom was born Jesus, who is called Christ."\n'+b+'\n- [L4] The verse names the mother.\n\n';
const W=r=>r.flatMap(x=>x.words.map(w=>w.w));
const C={
 c37281:LAB+BLK('- [L2] *gennaō* (G1080) passive with the feminine relative. The defender grants that *ek* "marks mothers in all three" (G5).'),
 abba:LAB+BLK('- [L2] *abba* (G5) beside *gennaō* (G1080).'),
 abbaNoSp:LAB+BLK('- [L2] *abba*(G5) beside *gennaō* (G1080).'),
 greek:LAB+BLK('- [L2] ἀββα (G5) beside *gennaō* (G1080).'),
 list:LAB+BLK('- [L2] *gennaō* (G1080), as granted at (G5, G6).'),
 nolabel:BLK('- [L2] *gennaō* (G1080). The defender grants that *ek* "marks mothers in all three" (G5).'),
 grantedAt:LAB+BLK('- [L2] *gennaō* (G1080), granted at G5.'),
 h5:LAB+BLK('- [L2] *gennaō* (G1080) and the grant (H5).'),
};
const X={c37281:['G1080','gennaō','ek'],abba:['G5','G1080','abba','gennaō'],abbaNoSp:['G5','G1080','abba','gennaō'],greek:['G5','G1080','ἀββα','gennaō'],list:['G1080','gennaō'],nolabel:['G5','G1080','gennaō','ek'],grantedAt:['G1080','gennaō'],h5:['H5','G1080','gennaō']};
for(const [nm,o,n] of readers)for(const [k,txt] of Object.entries(C)){const got=W(n.tags([['C',4,txt]]));const want=X[k].slice().sort().join(',');ok(nm+' '+k+' got '+got.join(','),got.slice().sort().join(',')===want);
 if(nm==='LIB 92-233')console.log(k.padEnd(10),'old:',W(o.tags([['C',4,txt]])).join(','),' new:',got.join(','));}
// countClaims
const CC={a:LAB+'The *ek* (G1537) mother form is granted at G5, 3 verses in all.',b:LAB+'*abba* (G5) stands in 3 verses.',c:'*abba* (G5) stands in 3 verses.'};
const XC={a:'G1537',b:'G5',c:'G5'};
for(const [nm,o,n] of readers){if(!n.countClaims)continue;for(const [k,txt] of Object.entries(CC)){const r=n.countClaims([['C',4,txt]]);ok(nm+' cc '+k+' '+JSON.stringify(r.map(x=>x.subj)),r.length===1&&r[0].subj===XC[k]);
 if(nm==='LIB 92-233')console.log('cc '+k,'old:',o.countClaims([['C',4,txt]]).map(x=>x.subj).join(','),' new:',r.map(x=>x.subj).join(','));}}
// replay: 60 stored debates, all 8 round columns
const R=JSON.parse(zlib.gunzipSync(fs.readFileSync('../r383/data/rounds8.json.gz')));
const cols=['claude_r1','claude_r2','engine_r3','defender_r4','engine_r1','engine_r2','challenger_r3','challenger_r4'];
const [nmL,oL,nL]=readers[0];let tg=0,tgd=0,cc=0,ccd=0;const diffs=[];
for(const d of R)for(const c of cols){const x=d[c];if(!x)continue;const a=oL.tags([['X',1,x]]),b=nL.tags([['X',1,x]]);tg+=a.length;
 a.forEach((u,i)=>{const v=b[i];if(JSON.stringify(u)!==JSON.stringify(v)){tgd++;const gone=W([u]).filter(w=>!W([v]).includes(w));diffs.push([d.id.slice(0,8),c,gone.join('+'),v.seg.slice(0,110)]);}});
 const e=oL.countClaims([['X',1,x]]),f=nL.countClaims([['X',1,x]]);cc+=e.length;if(JSON.stringify(e)!==JSON.stringify(f)){ccd++;e.forEach((u,i)=>{if(JSON.stringify(u)!==JSON.stringify(f[i]))diffs.push([d.id.slice(0,8),c,'CC '+u.subj+'->'+(f[i]&&f[i].subj),u.text.slice(0,110)]);});}
 // every reader agrees with the library on this text
 for(const [nm,o,n] of readers.slice(1)){if(JSON.stringify(n.tags([['X',1,x]]))!==JSON.stringify(b)){ok(nm+' tags agree '+d.id.slice(0,8)+' '+c,false);}}
}
console.log('replay: debates',R.length,'tags',tg,'changed',tgd,'| countClaims',cc,'changed rounds',ccd);
for(const z of diffs)console.log('  ',z.join(' | '));
console.log(`TESTS ${p}/${t}`);
