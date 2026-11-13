-- pkgG8S rev 2 (W3 grade 03:08 CST): Sight 266's served passage anchor loses the removed frame (operator 02:44, 02:59). Removal only, -43 characters.
UPDATE kb_sights SET primary_passage = 'Matt 1:18-20'
 WHERE sight_number = 266 AND primary_passage = 'Matt 1:18-20; Deut 19:15; Deut 22:23-24; Deut 24:1';
-- expect: UPDATE 1
