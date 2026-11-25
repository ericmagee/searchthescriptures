// ASK 637 build (W4): Accept Build asks only seats that Init Seats can seat (family, same model). base -> target.
const fs=require('fs');const [,,BASE,OUT]=process.argv;
const E=JSON.parse(fs.readFileSync(BASE,'utf8'));const n=E.nodes.find(x=>x.name==='Accept Build');const s=n.parameters.jsCode;
const OLD="const seats=ORDER.filter(s=>deb.indexOf(s)<0&&s!=='qwen');";
if(s.split(OLD).length!==2)throw new Error('Accept Build: the seats line is not found exactly once');
const NEW="const __DS637={claude:'claude_synthesis',deepseek:'deepseek_debate'};const __MN637=m=>String(m||'').trim().toLowerCase().replace(/^anthropic\\//,'').replace(/\\./g,'-');"
+"const __DR637=deb.map(e=>M[__DS637[e]||e]).filter(Boolean);const __DF637=__DR637.map(x=>x.family).filter(Boolean);const __DM637=__DR637.map(x=>x.api_model).filter(Boolean).map(__MN637);"
+"const __BA637=__DF637.length===2&&__DF637.every(f=>f==='anthropic');"
+"const __BAR637=s=>{const x=M[s];if(!x)return false;if(x.family&&__DF637.indexOf(x.family)>=0&&!(x.family==='anthropic'&&__BA637))return true;return !!(x.api_model&&__DM637.indexOf(__MN637(x.api_model))>=0);};"
+"const seats=ORDER.filter(s=>deb.indexOf(s)<0&&s!=='qwen'&&!__BAR637(s)); /* ASK 637: a seat Init Seats would drop for a debater's family (unless both debaters are anthropic) or for running a debater's model (ASK 601) is not asked; the same tests on the Accept Models rows (family, api_model) at the debater's model_config seat (Init Seats ENG mc). A seat with no row, family or model is not filtered and is asked as before. */";
n.parameters.jsCode=s.replace(OLD,NEW);
fs.writeFileSync(OUT,JSON.stringify(E));console.log('Accept Build',s.length,'->',n.parameters.jsCode.length);
