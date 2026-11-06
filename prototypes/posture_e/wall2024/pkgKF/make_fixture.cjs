// Build a gate replay fixture from saved n8n execution files. Usage: node pkgKF/make_fixture.cjs <run> <main exec file> [<alt exec file>] > out.json
// Main file: Gate Record + Panel Build. Alt file: Alt Gate Record. Same shape as pkgGD/probe_33020/fixture_33020.json.
const fs=require('fs');const [run,fm,fa]=process.argv.slice(2);const J=f=>JSON.parse(fs.readFileSync(f,'utf8')).data.resultData.runData;
const node=(rd,n)=>rd[n]&&rd[n][0].data.main[0][0]&&rd[n][0].data.main[0][0].json;
const bodiesOf=B=>(B||[]).map(s=>{try{const p=(JSON.parse(s).payload)||{};return {seat:p.judge_seat,verdict_raw:p.verdict_raw,fields:{verdict_tag:p.verdict_tag,defense_standing:p.defense_standing,conceded_links:p.conceded_links,challenge_standing:p.challenge_standing,challenger_conceded_links:p.challenger_conceded_links}};}catch(e){return null;}}).filter(Boolean);
const repl=g=>{const o={};for(const r of (g&&g.replies)||[]){if(r&&r.seat)o[r.seat]=r.text||r.reply||r.content;}return o;};
const rd=J(fm);const G=node(rd,'Gate Record');const PB=node(rd,'Panel Build');
const out={source:'n8n execution '+run+': Gate Record, Panel Build'+(fa?', Alt Gate Record':''),run_token:G.run_token,PB:{judges:PB.judges},bodies:bodiesOf(G.bodies),sb_items:G.sb_items||[],gate_report:(G.gate&&G.gate.report)||[],gate_replies:repl(G.gate),gate_live:G.gate_rows||[],gate_keys:Object.keys(G.gate||{})};
if(fa){const ra=J(fa);const A=node(ra,'Alt Gate Record');out.alt={PB:{judges:A.judges},bodies:bodiesOf(A.bodies),sb_items:A.sb_items||[],gate_report:(A.gate&&A.gate.report)||[],gate_replies:repl(A.gate),gate_live:A.gate_rows||[]};}
process.stdout.write(JSON.stringify(out));
