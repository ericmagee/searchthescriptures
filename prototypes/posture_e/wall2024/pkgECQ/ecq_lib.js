/* pkgECQ (W3 2859, DeepSeek lane D5): a "(CONCEDED)" E-PREM push is exempt from the EPS hold only when one of its quoted spans stands, 6+ consecutive
   words, in a give-up sentence (drop, withdraw, grant, concede, accept, give up, yield) of the counted side's OWN rounds, and that run is at least as long as
   the span's longest run in the OTHER side's rounds. Double-quoted text inside the rounds is not a side's own words and is removed first. */
function ecqWords(s){return String(s||'').toLowerCase().replace(/[‘’']/g,'').replace(/[^a-z0-9Ͱ-Ͽ֐-׿]+/g,' ').trim().split(' ').filter(Boolean);}
function ecqStripQ(t){return String(t||'').replace(/"[^"\n]*"/g,' ').replace(/“[^”\n]*”/g,' ');}
function ecqSents(t){return ecqStripQ(t).split(/(?<=[.;:!?])\s+|\n+/).map(s=>s.trim()).filter(Boolean);}
function ecqRun(a,b){let best=0;const m=b.length;let prev=new Array(m+1).fill(0);for(let i=1;i<=a.length;i++){const cur=new Array(m+1).fill(0);for(let j=1;j<=m;j++)if(a[i-1]===b[j-1]){cur[j]=prev[j-1]+1;if(cur[j]>best)best=cur[j];}prev=cur;}return best;}
const ECQ_GIVE=/\b(?:drop|drops|dropped|withdraw|withdraws|withdrew|withdrawn|grant|grants|granted|concede|concedes|conceded|accept|accepts|accepted|give up|gives up|yield|yields|yielded)\b/i;
function ecqCheck(why,own,opp){const sp=[];String(why||'').replace(/"([^"\n]{8,})"|“([^”\n]{8,})”/g,(m,a,b)=>{sp.push(a||b);return m;});
 const spans=(sp.length?sp:[String(why||'')]).map(s=>ecqWords(s)).filter(w=>w.length>=6);
 const ownS=ecqSents(own).filter(s=>ECQ_GIVE.test(s)).map(ecqWords),oppS=ecqSents(opp).map(ecqWords);let bo=0,bp=0;
 for(const w of spans){let o=0,p=0;for(const s of ownS)o=Math.max(o,ecqRun(w,s));for(const s of oppS)p=Math.max(p,ecqRun(w,s));if(o>=6&&o>=p)return {ok:true,own:o,opp:p};if(o>bo||(o===bo&&p>bp)){bo=o;bp=p;}}
 return {ok:false,own:bo,opp:bp};}
