const d=require('./ecol.json');const rp=l=>/^\s*FORCED\b/i.test(l);
const RE=/\bwithout\s+(?:any\s+|its\s+|the\s+)?footing\b|\bfooting\b[^.;]{0,80}?\b(?:borrow\w*|missing|unshown|not\s+(?:shown|exhibited|given))\b|\bborrow\w*\s+(?:its\s+|their\s+|the\s+)?(?:footing\s+from\s+)?(?:its\s+own\s+|their\s+own\s+|the\s+)?contested\s+links?\b/i;
let n=0,h=[];for(const x of d){if(rp(x.l))continue;n++;const head=String(x.l).split(/\bGROUND\s*:/i)[0];const m=head.match(RE);if(m)h.push(x.id+' | '+m[0]+' | '+head.slice(0,260));}
console.log('LINK BROKEN lines',n,'footing hits',h.length);h.forEach(x=>console.log(x));
