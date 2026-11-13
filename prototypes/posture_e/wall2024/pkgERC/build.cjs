// pkgERC: a retry half that comes back cut at the DeepSeek token cap (finish_reason length) or with empty content is sent once more,
// as a half with no reply already is (pkgERS). Built on live s184 (1bf4bb8d). Fault: run 36677, Alt Judge Enforcer Retry Call k=0 hit
// the 64,000 cap (call_costs o=64000) and its 11 items (hydrogen) were left NO VERDICT; the resend tested only for "no choices".
// Change: the resend test in the 4 Resend Build nodes (Enforcer, Judge Enforcer, Alt, R2 Alt). Nothing else: the Resend Call and the
// Record already take one resent reply per half by index (Record line "RR[s.ers_k]=SR[j]"), so no library or wiring change.
// usage: node build.cjs <live json> <target json>
const fs = require('fs'), crypto = require('crypto');
const [, , fin, fout] = process.argv;
const raw = JSON.parse(fs.readFileSync(fin, 'utf8')); const W = (raw.data || raw).workflow || (raw.data || raw);
if (W.id !== 'moMxiV4Irg1uRBZN') throw new Error('wrong workflow ' + W.id);
const OLD_C = "/* pkgERS: a retry half with no reply (no choices) is sent once more */";
const NEW_C = "/* pkgERS: a retry half with no reply (no choices) is sent once more; pkgERC: so is one cut at the token cap (finish_reason length) or with empty content */";
const OLD_T = "if(h&&h.esr_retry===true&&h.body&&!(r&&Array.isArray(r.choices)&&r.choices.length))out.push({json:{ers_resend:true,ers_k:k,body:h.body,model:h.model,run_token:h.run_token}});";
const NEW_T = "const c=r&&Array.isArray(r.choices)&&r.choices[0];const w=!c?'no choices':c.finish_reason==='length'?'finish_reason length':!String((c.message&&c.message.content)||'').trim()?'empty content':null;if(h&&h.esr_retry===true&&h.body&&w)out.push({json:{ers_resend:true,ers_k:k,ers_why:w,body:h.body,model:h.model,run_token:h.run_token}});";
const names = ['Enforcer Resend Build', 'Judge Enforcer Resend Build', 'Alt Judge Enforcer Resend Build', 'R2 Alt Judge Enforcer Resend Build'];
const sizes = [];
for (const nm of names) {
  const ns = W.nodes.filter(n => n.name === nm); if (ns.length !== 1) throw new Error(nm + ' count ' + ns.length);
  const c0 = ns[0].parameters.jsCode;
  for (const a of [OLD_C, OLD_T]) if (c0.split(a).length !== 2) throw new Error(nm + ' anchor ' + a.slice(0, 40));
  ns[0].parameters.jsCode = c0.replace(OLD_C, () => NEW_C).replace(OLD_T, () => NEW_T);
  sizes.push(nm + ' ' + c0.length + ' -> ' + ns[0].parameters.jsCode.length + ' (+' + (ns[0].parameters.jsCode.length - c0.length) + ')');
}
const s = JSON.stringify(raw); fs.writeFileSync(fout, s);
console.log(sizes.join('\n'));
console.log('nodes', W.nodes.length, '| target sha256', crypto.createHash('sha256').update(s).digest('hex').slice(0, 16));
