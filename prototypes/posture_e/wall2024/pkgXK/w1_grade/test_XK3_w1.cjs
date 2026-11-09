// W1 grade of pkgXK rev 3: xkJson2024 + xkSalvage2024 from strip_XKB Cure_Check on cut-off and malformed replies. Run from wall2024/.
const fs=require('fs');const src=fs.readFileSync('pkgLIB/strip_XKB/patched/Cure_Check.js','utf8');
const a=src.indexOf('function xkSalvage2024'),e=src.indexOf(".join('\\n');}",src.indexOf('function xkJson2024'))+".join('\\n');}".length;
const f=new Function(src.slice(a,e)+';return {J:xkJson2024};')();
const E=(k,i,t)=>JSON.stringify({kind:k,item:i,text:t});const e3=E('OTHER','','RESTATED: D1 vs C1 -- LINK BROKEN');
const full='{"cure_lines":['+[E('RESPONSE','K-W #1','NOT HELD -- "I grant {x}" ok'),E('STATEMENT','K-S3 #2','has } brace and \\" quote'),e3].join(',')+']}';
const C={full,cut_in_3rd:full.slice(0,full.length-20),cut_in_string_with_brace:full.slice(0,full.indexOf('has } brace')+5),cut_after_2nd_entry:full.slice(0,full.indexOf(e3)-1),
 cut_before_any:'{"cure_lines":[{"kind":"RESP',no_array:'{"cure_lines": ',trailing_prose:full+'\n\nNote: done.',fenced_cut:'```json\n'+full.slice(0,full.length-20),
 bad_entry_type_then_cut:'{"cure_lines":[{"kind":1,"item":"a","text":"b"},{"kind":',good_then_bad_type_cut:'{"cure_lines":['+E('RESPONSE','a','b')+',{"kind":1,"item":"a","text":"b"},{"ki',
 plain_lines:'RESPONSE: K-W #1 | NOT HELD',ends_brace_but_cut:full.slice(0,full.indexOf(','+e3))+'}',other_key_first_cut:'{"note":"x","cure_lines":['+E('RESPONSE','a','b')+',{'};
for(const [k,v] of Object.entries(C)){const r=f.J(v);console.log(k.padEnd(26)+' => '+(r===v?'[unchanged text]':JSON.stringify(r)));}
