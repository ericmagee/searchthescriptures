// pkgUOW replay: OPEN pattern, live s140 vs candidate, on every distinct UNDERDETERMINED collision line in exports 35067 and 35173.
const fs=require('fs');
const lib=JSON.parse(fs.readFileSync('/mnt/project-files/wall2024/fetchback_live_s140.json','utf8')).nodes.find(n=>n.name==='Shared Library').parameters.jsCode;
const grab=s=>{const i=s.indexOf('const OPEN=/');const j=s.indexOf('/i;',i);return JSON.parse('"'+s.slice(i+12,j)+'"');};
const OLD=new RegExp(grab(lib),'i');
const NEWSRC=grab(lib).replace(String.raw`leaves?\s+(?:\w+\s+){0,3}(?:open`,String.raw`leaves?\s+(?:[^\s.;:,]+\s+){0,8}(?:open`);
if(NEWSRC===grab(lib))throw new Error('anchor');const NEW=new RegExp(NEWSRC,'i');
const set=new Set();
for(const f of ['/mnt/project-files/wall2024/ex35173_full.json','/mnt/project-files/wall2024/ex35067_full.json']){const s=fs.readFileSync(f,'utf8').replace(/\\+n/g,'\n').replace(/\\+"/g,'"');
 for(const m of s.matchAll(/D\d+ vs C\d+[^\n]{0,80}?: UNDERDETERMINED[^\n]{0,600}/g)) set.add(m[0].slice(0,600));}
let n=0,po=0,pn=0;const up=[],down=[];
for(const l of set){n++;const o=OLD.test(l),q=NEW.test(l);po+=o;pn+=q;if(!o&&q)up.push(l);if(o&&!q)down.push(l);}
console.log('distinct lines',n,'pass live',po,'pass candidate',pn,'fail->pass',up.length,'pass->fail',down.length);
for(const l of up){const m=l.match(NEW);console.log('\nFAIL->PASS match "'+m[0]+'"\n  '+l.slice(0,400));}
for(const l of down)console.log('\nPASS->FAIL '+l.slice(0,300));
const S11='D4 vs C6 (Luke 3:23): UNDERDETERMINED -- the qualification “as was supposed” and the challenger’s household evidence leave the biological status of Joseph’s fatherhood open -- GROUND: [L1] Luke 3:23 “being (as was supposed) the son of Joseph, which was [the son] of Heli.”';
console.log('\nluna S11 live',OLD.test(S11),'candidate',NEW.test(S11));
// plants
const P=[['leaves the matter open',1],['leave the biological status of Joseph’s fatherhood open',1],['leaves whether Joseph begot the child open',1],['the record leaves the question of Heli’s daughter undecided',1],
['leaves no room; the point is not open',0],['leaves D4 standing. Open',0],['leaves the reading standing, and the press is open',0],['leaves one two three four five six seven eight nine open',0]];
for(const [t,w] of P)console.log('PLANT',(NEW.test(t)?1:0)===w?'ok ':'BAD',w,t);
fs.writeFileSync('/mnt/project-files/wall2024/uow_newsrc.txt',NEWSRC);
