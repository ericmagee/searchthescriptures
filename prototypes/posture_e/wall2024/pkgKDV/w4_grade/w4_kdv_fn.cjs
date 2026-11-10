const re=/\b(?:is|are|was|were|be|been)\s+answered\s+(?:(?:above|below)\s+)?(?:under|with|in|at|by|as\s+in|as\s+under|together\s+with)\s+(?:[1-3]\s*)?[A-Z][a-z]+\.?\s+\d+:\d+(?:\s*[-–]\s*\d+)?\s*[.;:]?\s*(?:\*\*|["”’)\]])*\s*$/;
const T=[['Matthew 17:5 is answered under Luke 9:34.',1],['It is answered with Isaiah 7:14.',1],['**Isaiah 8:3** is answered with **Isaiah 7:14**.',1],['That is answered as under 1 John 4:2.',1],
['It is answered with Isaiah 7:14 and Matthew 1:23.',1],['It is answered by Luke 1:35 (KJV).',1],
['It is answered by Luke 1:35, which names the Holy Ghost as the power.',0],['Luke 1:34 is answered in Luke 1:35: the Holy Ghost shall come upon thee.',0],['The verse is answered by its own words.',0],['It was answered in CR3 at length.',0]];
let ok=0;for(const [t,e] of T){const g=re.test(t)?1:0;console.log((g===e?'OK  ':'MISS')+' '+(g?'deferral':'not    ')+' '+t);if(g===e)ok++;}console.log(ok+'/'+T.length);
