// pkgKGL (ASK 129 option 1): the key-word reader kwLines421 (Shared Library) takes the same grant sentences as the live grants
// finder after pkgGAV rev 3: up to two adverbs between "I" and the verb; verbs admit, retract, give up, no longer rest added
// (set aside left out); headings with up to two words before the verb skipped (plus set aside, release); a verb list ending
// in none/nothing/no skipped; a new-form match does not take one of the 10 item slots, so every live item stays; a question, and a sentence opened by If/Unless/Should/Nor with no , ; : before the verb, skipped.
// MAP lengths and the header sha are recomputed (as pkgOAD). Usage: node build_KGL.cjs <parent json> <out json>
const fs=require('fs');const un=p=>{let j=JSON.parse(fs.readFileSync(p,'utf8'));j=j.data||j;return j.workflow||j;};
const W=un(process.argv[2]);const N=W.nodes.find(n=>n.name==='Shared Library');const T=N.parameters.jsCode;
const a=T.indexOf('\n/*LIB*/'),b=T.lastIndexOf('\n/*MAP*/'),c=T.lastIndexOf('\n/*END*/');const Lb=JSON.parse(T.slice(a+8,b)),M=JSON.parse(T.slice(b+8,c));
const T0=T.slice(0,a+8)+JSON.stringify(Lb)+T.slice(b,b+8)+JSON.stringify(M)+T.slice(c);if(T0!==T)throw new Error('serialisation differs from the parent');
const OV=String.raw`(?:do\s+not\s+claim|no\s+longer\s+claim|withdraw|grant|concede|drop)`;
const ADV=String.raw`(?:(?:also|now|further|readily|freely|fully|plainly|openly|likewise|therefore|thus|hereby|still|so)\s+){0,2}`;
const NV=String.raw`(?:do\s+not\s+claim|no\s+longer\s+claim|no\s+longer\s+rest|withdraw|grant|concede|drop|admit|retract|give\s+up)`;
const HV=String.raw`(?:\w+\s+){0,2}(?:do\s+not\s+claim|no\s+longer\s+claim|no\s+longer\s+rest|withdraw|grant|concede|drop|admit|retract|give\s+up|set\s+aside|release)`;
const one=(re)=>{const h=Lb.map((l,i)=>re.test(l)?i:-1).filter(i=>i>=0);if(h.length!==1)throw new Error('anchor hits '+h.length+' '+re);return h[0];};
const i0=one(/^function kwLines421\(/),i1=i0+1,i3=i0+3;
// cap: a new-form match (adverb or new verb) does not take one of the 10 slots, so every live item stays
{const o='let n=0;';if(Lb[i1].split(o).length!==2)throw new Error('n anchor');Lb[i1]=Lb[i1].replace(o,'let n=0,xn=0;');}
// line 0: RX
{const o=String.raw`const RX=/\bI\s+`+OV+String.raw`\b/gi;`;const L=Lb[i0];if(L.split(o).length!==2)throw new Error('RX anchor');Lb[i0]=L.replace(o,()=>String.raw`const RX=/\bI\s+`+ADV+NV+String.raw`\b/gi; /* pkgKGL */`);}
// line 3: heading verb lists, nothing-list, question/conditional
{let L=Lb[i3];const parts=L.split(OV);if(parts.length!==6)throw new Error('heading verb lists '+(parts.length-1));
 // occurrences 1..5 in order: heading what-I (x2), h-match (x2), tail scan in r (x1), r.test (x1)? check count
 L=parts.join(HV);
 const on=String.raw`/^\s*(?:none|nothing|no)\b/i.test(t.slice(m.index+m[0].length))`;if(L.split(on).length!==2)throw new Error('nothing anchor');
 L=L.replace(on,()=>String.raw`/^(?:\s*,?\s*(?:and\s+|or\s+)?(?:set\s+aside|`+NV.slice(3)+String.raw`)*\s*(?:none|nothing|no)\b/i.test(t.slice(m.index+m[0].length))||(()=>{const z=bf.replace(/^[\s>*#-]*(?:\[[A-Za-z]{1,3}\d*\][\s:]*)*/,'');const k=[...z.matchAll(/[.!?]["”')\]]?\s+/g)].pop();const ld=(k?z.slice(k.index+k[0].length):z).trim();const sq=t.slice(m.index).split(/(?<=[.!?])["”')\]]?\s/)[0].trim();return /\?["”')\]]?$/.test(sq)||/^(?:if|unless|should|nor)\b[^,;:]*$/i.test(ld);})()/* pkgKGL */`);
 {const o='for(const m of t.matchAll(RX)){if(n>=10)break;';if(L.split(o).length!==2)throw new Error('cap anchor');L=L.replace(o,()=>'for(const m of t.matchAll(RX)){if(n-xn>=10)break;if(!/^I\\s+'+OV+'$/i.test(m[0]))xn++;');}
 Lb[i3]=L;}
const reb=e=>M[e].p.map(x=>typeof x==='number'?Lb[x]:typeof x[0]==='string'?x[0]:Lb.slice(x[0],x[1]+1).join('\n')).join('\n');for(const e in M)M[e].n=reb(e).length;
const LJ=JSON.stringify(Lb);N.parameters.jsCode=(T.slice(0,a+8)+LJ+T.slice(b,b+8)+JSON.stringify(M)+T.slice(c)).replace(/(\/\/ library sha )[0-9a-f]{16}/,(x,h)=>h+require('crypto').createHash('sha256').update(LJ).digest('hex').slice(0,16));
fs.writeFileSync(process.argv[3],JSON.stringify(W));console.log('lines',i0,i3,'jsCode delta',N.parameters.jsCode.length-T.length);
