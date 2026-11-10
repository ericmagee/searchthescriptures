const {RD,out}=require('./x.cjs');
// alternate
for(const n of ['Alternate Build','Alternate Call openrouter','Alternate Merge Seat','Alt Seated','Alt Send Back Record','Alt Gate Record','Alternate Merge 1','Second Alternate?','Alternate Merge']){const o=out(n);if(!o){console.log(n,'MISSING');continue}
 console.log('=====',n,o.length);o.forEach(it=>{const j=it.json;console.log(Object.keys(j).join(','));for(const k of ['substitution','alt_needed','panel_effective','summary','alt','alt_seat','second_alt','decision','why','seated']){if(j[k]!==undefined)console.log(' ',k,JSON.stringify(j[k]).slice(0,3000))}})}
