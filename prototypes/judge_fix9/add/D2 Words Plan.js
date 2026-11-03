// D2 Words Plan (judge_fix9 S4): one item per batch of verses to read from original_words (L2C.wordsUrls, planned by "C1 Extract"): every cited
// verse is read, none left off for a cap. With no plan (a run of the old shape) one item whose read returns nothing.
let P={};try{P=$('C1 Extract').first().json||{};}catch(e){P={};}const U=Array.isArray(P.l2_urls)&&P.l2_urls.length?P.l2_urls:['https://bhffmkginddovmdcpnty.supabase.co/rest/v1/original_words?select=book&id=eq.-1'];
return U.map(url=>({json:{url}}));
