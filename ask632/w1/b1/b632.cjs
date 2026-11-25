// ASK 632 build (W1): one statement in Panel Tokens __CU, OpenRouter/other branch. Usage: node b632.cjs base_eng.json out_target.json
const fs=require('fs');const [,,BE,OUT]=process.argv;const E=JSON.parse(fs.readFileSync(BE,'utf8'));
const OLD="e.i=__N(u.prompt_tokens)-e.cr-e.w5;";
const NEW="if((e.w5>0&&e.w5===e.cr)||__N(u.prompt_tokens)-e.cr-e.w5<0){e.ov=1;e.i=Math.max(0,__N(u.prompt_tokens)-e.cr);}else e.i=__N(u.prompt_tokens)-e.cr-e.w5; /* ASK 632: OpenRouter's cache write can repeat the read (gemini-3.8-flash); then uncached input is prompt minus read, and ov marks it */";
const n=E.nodes.find(x=>x.name==='Panel Tokens');const c=n.parameters.jsCode;
if(c.split(OLD).length!==2)throw new Error('ASK 632 build: the statement is not found exactly once');
n.parameters.jsCode=c.replace(OLD,NEW); /* one statement replaced in place; the block comment closes inside the line */
fs.writeFileSync(OUT,JSON.stringify(E));console.log('ASK 632 built:',OUT);
