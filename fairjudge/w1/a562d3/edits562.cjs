// ASK 562 draft 3 (W1): LAY reads "against" heads as block heads (draft 2 text, unchanged), and an "against" head that is a title only
// (a markdown head, a line ending in ":", or a bold head with nothing after it) with no body before the next head opens no block (new in draft 3; fixes #10 of CLASS562.md).
// Each edit is [null, old, new]; old must stand once in LIB 3499-3557.
const CP_OLD="Point\\s+\\d+\\b)/i;";
const CP_NEW="Point\\s+\\d+\\b)|^\\s*(?:#{1,6}\\s*|\\*\\*\\s*)against\\s+(?:the\\s+answer\\s+to\\s+)?[CD]\\d+\\b|^\\s*(?:D\\d+\\s+)?against\\s+[CD]\\d+\\b[^\\n.]{0,80}:\\s*$/i;";
const EB_OLD="if(RECAP.test(b.head))return;";
const EB_NEW="if(RECAP.test(b.head))return;if(/^[\\s#>*_-]*(?:D\\d+\\s+)?against\\s/i.test(b.head)&&!b.lines.slice(1).some(l=>l.trim())&&(/^\\s*#{1,6}\\s/.test(b.head)||/:[\\s*_]*$/.test(b.head)||!b.head.replace(/^[\\s>*_-]*\\*\\*[^*\\n]*\\*\\*/,'').replace(/[\\s*_.:]/g,'')))return;";
module.exports={edits:[[null,CP_OLD,CP_NEW],[null,EB_OLD,EB_NEW]]};
