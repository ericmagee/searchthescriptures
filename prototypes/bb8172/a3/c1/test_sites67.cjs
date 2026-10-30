// BB-8172 step 4: the last two single sites. Site 6: a bare reference after prose that denies the quote is not citation form (rqBP).
// Site 7: the fallback range is fetched whole (url_cited carries verse.lte.63 for "Luke 1:13, 62-63").
const fs=require('fs'),path=require('path');const dir=process.argv[2]||'new';
const cs=R=>{const $=n=>{if(n==='Regrade Load')return {isExecuted:false};return {first:()=>({json:R})};};return new Function('$',fs.readFileSync(path.join(dir,'Citation_Scan.js'),'utf8'))($)[0].json;};
const z={gr1:'',cr2:'',gr2:'',cr3:'',dr3:''};
const a=cs({cr1:'Matthew 1:2 is the first line of the list given there by the writer.\nAgain, "Judas begat Phares and Zara" is not said of David (1:3).',...z}).items.map(i=>[i.ref,i.order||'',i.cite_form]);
const b=decodeURIComponent(cs({cr1:'Luke 1:13, 62-63 and "they made signs to his father, how he would have him called" (Numbers 1:2) are the naming rows.',...z}).url_cited);
console.log(JSON.stringify({site6:a,site7_fallback_range_fetched:/book\.eq\."Luke",chapter\.eq\.1,verse\.gte\.13,verse\.lte\.63/.test(b)}));
