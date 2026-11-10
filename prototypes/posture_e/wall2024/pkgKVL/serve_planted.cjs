// Preload for re-running W1's and W3's rev 1 plants on rev 2: the run's Cited Verses (33798) also serves the two verses those plants plant
// (1 Samuel 1:20 and Luke 2:1, KJV text from kjv_verses with its bracketed notes taken off), as the record would if a round cited them.
// node -r ./pkgKVL/serve_planted.cjs <plant script>
const fs=require('fs');const orig=fs.readFileSync;const ADD=[
 {book:'1 Samuel',chapter:1,verse:20,text:'Wherefore it came to pass, when the time was come about after Hannah had conceived, that she bare a son, and called his name Samuel, saying, Because I have asked him of the LORD.'},
 {book:'Luke',chapter:2,verse:1,text:'And it came to pass in those days, that there went out a decree from Caesar Augustus, that all the world should be taxed.'}];
fs.readFileSync=function(p,...a){const r=orig.call(fs,p,...a);if(typeof p==='string'&&/\/33798_Cited_Verses\.json$/.test(p)){const j=JSON.parse(String(r));const m=j[j.length-1].data.main[0];for(const v of ADD)m.push({json:v});return JSON.stringify(j);}return r;};
