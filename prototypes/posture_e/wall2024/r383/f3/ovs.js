const OVS_N=s=>String(s||'').toLowerCase().replace(/[“”"’‘'*_`\[\]]/g,'').replace(/[^a-z0-9:\s]/g,' ').replace(/\s+/g,' ').trim();
const OVS_R=/\b((?:[1-3] ?)?[a-z]+) (\d{1,3}):(\d{1,3})|(?:^|\s)(\d{1,3}):(\d{1,3})/g;
const OVS_B=new Set('gen exo lev num deu jos jdg jud rut 1sa 2sa 1ki 2ki 1ch 2ch ezr neh est job psa pro ecc son sol can isa jer lam eze dan hos joe amo oba jon mic nah hab zep hag zec mal mat mar luk joh act rom 1co 2co gal eph phi col 1th 2th 1ti 2ti tit phm heb jam 1pe 2pe 1jo 2jo 3jo rev'.split(' '));
/* rev 3 (W1 6616): a book token that is not a Bible book ("in 1:19", "and 1:20") or a bare "n:n" takes the last real book named before it, else the default book (the ANSWER heading's); with none it is dropped */
const ovsRefs=(t,dflt)=>{const o=[];let last=dflt||null;for(const m of String(t||'').matchAll(OVS_R)){let b=m[1]?m[1].replace(/\s/g,'').slice(0,3):null;const c=m[1]?m[2]:m[4],v=+(m[1]?m[3]:m[5]);if(b&&OVS_B.has(b))last=b;else b=last;if(b)o.push({b,c,v});}return o;};
const ovsHead=/ANSWER:\s*\**\s*((?:[1-3]\s?)?[A-Z][a-z]+)\.?\s+(\d{1,3}):(\d{1,3})/;
function ovsGov(q,raw){const x=OVS_N(q);if(x.split(' ').length<3)return null;const parts=String(q).split(/\.\.\.|…/).map(OVS_N).filter(p=>p.split(' ').length>=3);const p0=parts[0]||x;
 const L=String(raw||'').split('\n');let hd=null;
 for(const l of L){if(ovsHead.test(l))hd=ovsRefs(OVS_N(l));else if(/^\s*#|^\s*\*\*[^*].*\*\*\s*:?\s*$/.test(l))hd=null; /* rev 2 (W2 6615): every verse on the heading; a non-ANSWER heading ends its reach */const nl=OVS_N(l);const i=nl.indexOf(p0);if(i<0)continue;
  const H=hd||[];const own=ovsRefs(nl.slice(0,i)+' '+x,H.length?H[0].b:null);const all=own.concat(H); /* rev 3: the line's verses and the heading's verses together */return all.length?{refs:all,by:own.length?'line':'head'}:null;}
 return null;}
function ovsOther2024(key,q,raws){const m=String(key||'').match(/^(\S+) (\d+):(\d+)$/);if(!m)return false;
 for(const raw of raws){const g=ovsGov(q,raw);if(!g)continue;return !g.refs.some(r=>r.b===m[1]&&r.c===m[2]);}
 return false;}
