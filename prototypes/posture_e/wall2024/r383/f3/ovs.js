const OVS_N=s=>String(s||'').toLowerCase().replace(/[“”"’‘'*_`\[\]]/g,'').replace(/[^a-z0-9:\s]/g,' ').replace(/\s+/g,' ').trim();
const OVS_R=/\b((?:[1-3] ?)?[a-z]+) (\d{1,3}):(\d{1,3})/g;
const ovsRefs=t=>[...String(t||'').matchAll(OVS_R)].map(m=>({b:m[1].replace(/\s/g,'').slice(0,3),c:m[2],v:+m[3]}));
const ovsHead=/ANSWER:\s*\**\s*((?:[1-3]\s?)?[A-Z][a-z]+)\.?\s+(\d{1,3}):(\d{1,3})/;
function ovsGov(q,raw){const x=OVS_N(q);if(x.split(' ').length<3)return null;const parts=String(q).split(/\.\.\.|…/).map(OVS_N).filter(p=>p.split(' ').length>=3);const p0=parts[0]||x;
 const L=String(raw||'').split('\n');let hd=null;
 for(const l of L){if(ovsHead.test(l))hd=ovsRefs(OVS_N(l));else if(/^\s*#|^\s*\*\*[^*].*\*\*\s*:?\s*$/.test(l))hd=null; /* rev 2 (W2 6615): every verse on the heading; a non-ANSWER heading ends its reach */const nl=OVS_N(l);const i=nl.indexOf(p0);if(i<0)continue;
  const own=ovsRefs(nl.slice(0,i)+' '+x);if(own.length)return {refs:own,by:'line'};return hd&&hd.length?{refs:hd,by:'head'}:null;}
 return null;}
function ovsOther2024(key,q,raws){const m=String(key||'').match(/^(\S+) (\d+):(\d+)$/);if(!m)return false;
 for(const raw of raws){const g=ovsGov(q,raw);if(!g)continue;return !g.refs.some(r=>r.b===m[1]&&r.c===m[2]);}
 return false;}
