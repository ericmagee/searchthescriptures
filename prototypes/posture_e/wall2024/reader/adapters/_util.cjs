// Shared helpers for the old-reader adapters. An adapter exports {name, form, scope, read}.
// scope 'line': read(rawLine) -> fields object (with .form when the reader decides the form) or null.
// scope 'text': read(jtext) -> [{n, fields}], n = index in jtext.split('\n'). jtext = cureJText(raw,true) for verdicts, the stored text for replies.
const L=require('./_lib.cjs');
const pairOf=(d,c)=>String(d).toUpperCase()+' vs '+String(c).toUpperCase();
const lines=jtext=>String(jtext==null?'':jtext).split('\n'); // the driver passes jtext (already cureJText(raw,true)); live rcLines/keyChecks read that same text
const nOf=(ls,raw,from)=>{const i=ls.indexOf(raw,from||0);return i<0?ls.indexOf(raw):i;};
module.exports={L,pairOf,lines,nOf};
