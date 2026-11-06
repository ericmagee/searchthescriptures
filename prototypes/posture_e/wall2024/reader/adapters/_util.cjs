// Shared helpers for the old-reader adapters. An adapter exports {name, form, scope, read}.
// scope 'line': read(rawLine) -> fields object (with .form when the reader decides the form) or null.
// scope 'text': read(rawStoredText) -> [{n, fields}], n = index in the judge text split on '\n' (the live split: cureJText(raw,true)).
const L=require('./_lib.cjs');
const pairOf=(d,c)=>String(d).toUpperCase()+' vs '+String(c).toUpperCase();
const lines=raw=>L.cureJText(raw,true).split('\n');
const nOf=(ls,raw,from)=>{const i=ls.indexOf(raw,from||0);return i<0?ls.indexOf(raw):i;};
module.exports={L,pairOf,lines,nOf};
