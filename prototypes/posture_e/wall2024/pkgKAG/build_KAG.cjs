// pkgKAG (ASK 135 option 1, item d): the key-word reader kwLines421 (Shared Library) reads "I accept that" and "I agree that"
// (up to two adverbs before, as the other verbs) as a grant. Negated and conditional forms stay unread by the live rules
// ("I do not agree that", "I cannot accept that", "I would accept that" do not match; "If I accept that ..." is skipped).
// Skipped as a pointing word before a noun (W3's class B, Wall 5446): "that" + one lowercase word that is not a pronoun,
// with at most an "in/of/on the" phrase of one or two words, then a stop, a dash, "and" or "against" ("I accept that standard
// -- and apply it", "I accept that correction and adjust", "I accept that interlocking in the legal sense.").
// "that" pointing back ("I accept that.", "I accept that, and ...", "I accept that -- but ...", "I accept that as ...") takes its own
// clause before "I", or when none the sentence before, as the live rule for "I grant it." does. Quoted words of the other side
// are skipped by the live quote rule. Like the other new forms (pkgKGL) these take no cap slot.
// MAP lengths and the header sha are recomputed (as pkgOAD). Usage: node build_KAG.cjs <parent json> <out json>
const fs=require('fs');const un=p=>{let j=JSON.parse(fs.readFileSync(p,'utf8'));j=j.data||j;return j.workflow||j;};
const W=un(process.argv[2]);const N=W.nodes.find(n=>n.name==='Shared Library');const T=N.parameters.jsCode;
const a=T.indexOf('\n/*LIB*/'),b=T.lastIndexOf('\n/*MAP*/'),c=T.lastIndexOf('\n/*END*/');const Lb=JSON.parse(T.slice(a+8,b)),M=JSON.parse(T.slice(b+8,c));
const T0=T.slice(0,a+8)+JSON.stringify(Lb)+T.slice(b,b+8)+JSON.stringify(M)+T.slice(c);if(T0!==T)throw new Error('serialisation differs from the parent');
const one=(re)=>{const h=Lb.map((l,i)=>re.test(l)?i:-1).filter(i=>i>=0);if(h.length!==1)throw new Error('anchor hits '+h.length+' '+re);return h[0];};
const i0=one(/^function kwLines421\(/),i3=i0+3;
const rep=(i,o,nw)=>{if(Lb[i].split(o).length!==2)throw new Error('anchor '+o);Lb[i]=Lb[i].replace(o,()=>nw);};
rep(i0,String.raw`|admit|retract|give\s+up)\b/gi; /* pkgKGL */`,String.raw`|admit|retract|give\s+up|accept(?=\s+that\b)|agree(?=\s+that\b))\b/gi; /* pkgKGL, pkgKAG */`);
const sk=String.raw`||(/(?:accept|agree)$/i.test(m[0])&&/^\s+that\s+(?!(?:it|he|she|they|we|you|this|these|those|there|then|so|is|was)\b)[a-z][\w'’-]*(?:\s+(?:in|of|on)\s+(?:the|a|an)(?:\s+[a-z]+){1,2})?\s*(?:[.;,:!?)]|--|—|–|and\b|against\b)/.test(t.slice(m.index+m[0].length)))/* pkgKAG */`;
rep(i3,'/* pkgKGL */){n++;continue;}','/* pkgKGL */'+sk+'){n++;continue;}');
// pointing back: "I accept that." / "I accept that, and ..." / "I accept that -- but ..." / "I accept that as ..." take their own clause
// before "I" or, when none, the sentence before (the live rule for "I grant it."), also when words follow.
{const o=String.raw`let s=kwiCut2024(t,m.index);if(/^\s*(?:it|that|this|so|them|these|those)?\s*[.!?]?["\u201d']?\s*$/i.test(s.slice(m[0].length))){`;
 rep(i3+1,o,String.raw`let s=kwiCut2024(t,m.index);const pb=/(?:accept|agree)$/i.test(m[0])&&/^\s+that\s*(?:[.!?,;]|--|—|–|as\b)/i.test(s.slice(m[0].length));/* pkgKAG */if(pb||/^\s*(?:it|that|this|so|them|these|those)?\s*[.!?]?["\u201d']?\s*$/i.test(s.slice(m[0].length))){`);
 rep(i3+1,String.raw`if(/[A-Za-z0-9]/.test(own)){if(!/[A-Za-z0-9]/.test(s.slice(m[0].length)))s=`,String.raw`if(/[A-Za-z0-9]/.test(own)){if(pb||!/[A-Za-z0-9]/.test(s.slice(m[0].length)))s=`);}
const reb=e=>M[e].p.map(x=>typeof x==='number'?Lb[x]:typeof x[0]==='string'?x[0]:Lb.slice(x[0],x[1]+1).join('\n')).join('\n');for(const e in M)M[e].n=reb(e).length;
const LJ=JSON.stringify(Lb);N.parameters.jsCode=(T.slice(0,a+8)+LJ+T.slice(b,b+8)+JSON.stringify(M)+T.slice(c)).replace(/(\/\/ library sha )[0-9a-f]{16}/,(x,h)=>h+require('crypto').createHash('sha256').update(LJ).digest('hex').slice(0,16));
fs.writeFileSync(process.argv[3],JSON.stringify(W));console.log('lines',i0,i3,'jsCode delta',N.parameters.jsCode.length-T.length,'sha',N.parameters.jsCode.match(/library sha ([0-9a-f]{16})/)[1]);
