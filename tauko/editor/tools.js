// ================================================================
// KONSTANTE
// ================================================================
var SQL_KW = ['SELECT','FROM','WHERE','AND','OR','NOT','IN','IS','NULL','INSERT','UPDATE',
  'DELETE','CREATE','DROP','ALTER','TABLE','VIEW','INDEX','DATABASE','INTO','VALUES','SET',
  'JOIN','LEFT','RIGHT','INNER','OUTER','FULL','CROSS','ON','AS','DISTINCT','ORDER','BY',
  'GROUP','HAVING','LIMIT','OFFSET','UNION','ALL','EXISTS','BETWEEN','LIKE','CASE','WHEN',
  'THEN','ELSE','END','BEGIN','COMMIT','ROLLBACK','TRANSACTION','PRIMARY','KEY','FOREIGN',
  'REFERENCES','CONSTRAINT','DEFAULT','CHECK','UNIQUE','COUNT','SUM','MAX','MIN','AVG',
  'COALESCE','CAST','CONVERT','SUBSTRING','TRIM','UPPER','LOWER','LENGTH','CONCAT',
  'NOW','GETDATE','ISNULL','DECODE','ROWNUM','TOP','FETCH','NEXT','ROWS','ONLY','WITH',
  'PROCEDURE','FUNCTION','TRIGGER','DECLARE','EXEC','EXECUTE','REPLACE','IF','WHILE'];

// ================================================================
// POMOŽNE FUNKCIJE
// ================================================================
function h_KonvCrke(tip, v) {
  function besede(s) {
    return s.replace(/([a-z])([A-Z])/g, '$1 $2')
             .replace(/([A-Z]+)([A-Z][a-z])/g, '$1 $2')
             .replace(/[-_]+/g, ' ')
             .trim().split(/\s+/).filter(function(w) { return w.length > 0; });
  }
  var titleMali = {a:1,an:1,the:1,and:1,but:1,or:1,for:1,nor:1,on:1,at:1,to:1,by:1,in:1,of:1,up:1,as:1,is:1,it:1};

  if (tip === 'male')    return v.toLocaleLowerCase();
  if (tip === 'velike')  return v.toLocaleUpperCase();
  if (tip === 'stavek')  return v.charAt(0).toUpperCase() + v.slice(1).toLowerCase();
  if (tip === 'kapital') return v.replace(/\b\w/g, function(c) { return c.toUpperCase(); });
  if (tip === 'title') {
    var ws = v.split(/\b/); var idx = 0;
    return ws.map(function(seg) {
      if (!/\w/.test(seg)) return seg;
      var w = seg.toLowerCase();
      var res = (idx === 0 || !titleMali[w]) ? w.charAt(0).toUpperCase() + w.slice(1) : w;
      idx++; return res;
    }).join('');
  }
  if (tip === 'camel') {
    var bs = besede(v);
    return bs.map(function(w, i) { return i === 0 ? w.toLowerCase() : w.charAt(0).toUpperCase() + w.slice(1).toLowerCase(); }).join('');
  }
  if (tip === 'pascal') return besede(v).map(function(w) { return w.charAt(0).toUpperCase() + w.slice(1).toLowerCase(); }).join('');
  if (tip === 'snake')  return besede(v).map(function(w) { return w.toLowerCase(); }).join('_');
  if (tip === 'scream') return besede(v).map(function(w) { return w.toUpperCase(); }).join('_');
  if (tip === 'kebab')  return besede(v).map(function(w) { return w.toLowerCase(); }).join('-');
  if (tip === 'train')  return besede(v).map(function(w) { return w.charAt(0).toUpperCase() + w.slice(1).toLowerCase(); }).join('-');
  if (tip === 'random') return v.split('').map(function(c) { return Math.random() < 0.5 ? c.toUpperCase() : c.toLowerCase(); }).join('');
  if (tip === 'sql') {
    var r = v;
    SQL_KW.forEach(function(kw) {
      r = r.replace(new RegExp('(^|[^a-zA-Z0-9_])(' + kw + ')(?=[^a-zA-Z0-9_]|$)', 'gi'),
        function(m, pre) { return pre + kw; });
    });
    return r;
  }
  if (tip === 'invert') return v.split('').map(function(c) { return c === c.toUpperCase() ? c.toLowerCase() : c.toUpperCase(); }).join('');
  return v;
}

// Padding: stran='L' ali 'R'
function h_Pad(stran) {
  var ta = preberiTA(); if (!ta) return;
  var znak  = document.getElementById('padZnak').value || ' ';
  var dolzS = document.getElementById('padDolz').value;
  if (!dolzS) { obv('Vnesi dolžino (Len).', 'opoz'); return; }
  var dolz = parseInt(dolzS);
  if (isNaN(dolz) || dolz <= 0) { obv('Dolžina mora biti > 0.', 'opoz'); return; }
  var rezi = document.getElementById('padRezanje').checked;
  var v = vrstice(ta);
  var out = [];
  var firstTooLong = -1;
  for (var i = 0; i < v.length; i++) {
    var s = v[i];
    if (s.length > dolz) {
      if (rezi) {
        out.push(s.substring(0, dolz));   // D7: Copy(s,1,len) — odreži od desne
      } else {
        if (firstTooLong < 0) firstTooLong = i;
        out.push(s);
      }
    } else {
      if (stran === 'L') { while (s.length < dolz) s = znak + s; }
      else               { while (s.length < dolz) s = s + znak; }
      out.push(s);
    }
  }
  postaviTA(ta, out);
  if (firstTooLong >= 0) obv('Vrstica ' + (firstTooLong + 1) + ' je predolga.', 'opoz');
  else obv('Padding (' + stran + ') izvedeno.', 'ok');
}

// Trim: stran='L' ali 'R' — odreže podniz (multi-char) z leve ali desne
function h_Trim(stran) {
  var ta = preberiTA(); if (!ta) return;
  var znak = document.getElementById('trimZnak').value;
  if (!znak) { obv('Vnesi niz (What).', 'opoz'); return; }
  var n = znak.length;
  var out = vrstice(ta).map(function(v) {
    if (stran === 'L') {
      while (v.length >= n && v.substring(0, n) === znak) v = v.substring(n);
    } else {
      while (v.length >= n && v.substring(v.length - n) === znak) v = v.substring(0, v.length - n);
    }
    return v;
  });
  postaviTA(ta, out); obv('Trim' + stran + ' izvedeno.', 'ok');
}

// Spoji: aktivni tekst = text[a] + text[b] (vsaka vrstica)
function h_Spoji(a, b) {
  var ta = preberiTA(); if (!ta) return;
  var vA = vrstice(taProxies[a]);
  var vB = vrstice(taProxies[b]);
  var dolz = Math.max(vA.length, vB.length);
  var out = [];
  for (var i = 0; i < dolz; i++)
    out.push((i < vA.length ? vA[i] : '') + (i < vB.length ? vB[i] : ''));
  postaviTA(ta, out); obv('Text' + a + ' + Text' + b + ' → aktivni.', 'ok');
}

// Premakni: smer < 0 = levo (odreži 2 presledka), smer > 0 = desno (dodaj 2)
function h_Premakni(smer) {
  var ta = preberiTA(); if (!ta) return;
  var out = vrstice(ta).map(function(v) {
    if (smer < 0) {
      // D7: preveri 1. in 2. znak posebej (odreže max 2 presledka)
      if (v.substring(0, 2) === '  ') return v.substring(2);
      if (v.substring(0, 1) === ' ')  return v.substring(1);
      return v;
    }
    return '  ' + v;   // D7: doda točno 2 presledka
  });
  postaviTA(ta, out); obv('Premaknjeno ' + (smer < 0 ? 'levo' : 'desno') + '.', 'ok');
}

// Razvrsti: narasca = true/false
function h_Razvrsti(narasca) {
  var ta = preberiTA(); if (!ta) return;
  var v = vrstice(ta); v.sort();
  if (!narasca) v.reverse();
  postaviTA(ta, v); obv(narasca ? 'Razvrsceno ↑' : 'Razvrsceno ↓', 'ok');
}

// Kopiraj tekst med tabami
function h_Kolumna(smer) {
  var deli = smer.split('to');
  var izT = taProxies[parseInt(deli[0])];
  var doT = taProxies[parseInt(deli[1])];
  if (!izT || !doT) return;
  shraniUndo(doT);
  doT.value = izT.value;
  var idx = parseInt(deli[1]);
  stNapolni(idx); statusPosodobi(doT); shrambaNapisi();
  obv('Text ' + deli[0] + ' → Text ' + deli[1] + '.', 'ok');
}

// ================================================================
// TAB 1 - CHANGE CASE
// ================================================================
function Tools_ChangeCase_Convert() {
  var ta = preberiTA(); if (!ta) return;
  var tip = document.querySelector('input[name="crke"]:checked').value;
  var samoIzbor = document.getElementById('crkSamoIzbor').checked;
  if (samoIzbor && ta.selectionStart !== ta.selectionEnd) {
    var s = ta.selectionStart, e = ta.selectionEnd;
    shraniUndo(ta);
    ta.value = ta.value.substring(0, s) + h_KonvCrke(tip, ta.value.substring(s, e)) + ta.value.substring(e);
    ta.selectionStart = s; ta.selectionEnd = e;
    var i = parseInt(ta.id.replace('tekst', ''));
    stNapolni(i); statusPosodobi(ta); shrambaNapisi();
  } else {
    var out = vrstice(ta).map(function(v) { return h_KonvCrke(tip, v); });
    postaviTA(ta, out);
  }
  obv('Convert case izvedeno.', 'ok');
}

// ================================================================
// TAB 1 - REPLACE
// ================================================================
function Tools_Replace_Replace() {
  var ta = preberiTA(); if (!ta) return;
  var kaj = document.getElementById('repKaj').value;
  if (!kaj) { obv('Polje What je prazno.', 'opoz'); return; }
  var z  = document.getElementById('repZ').value;
  var re = new RegExp(kaj.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'gi');
  var out = vrstice(ta).map(function(v) { return v.replace(re, z); });
  postaviTA(ta, out); obv('Replace izvedeno.', 'ok');
}

// ================================================================
// TAB 1 - ADD TEXT
// ================================================================
function Tools_AddText_Add() {
  var ta = preberiTA(); if (!ta) return;
  var zac = document.getElementById('dodajZac').value;
  var kon = document.getElementById('dodajKon').value;
  var out = vrstice(ta).map(function(v) { return zac + v + kon; });
  postaviTA(ta, out); obv('Add text izvedeno.', 'ok');
}

// ================================================================
// TAB 1 - PADDING
// ================================================================
function Tools_Padding_LPad() { h_Pad('L'); }
function Tools_Padding_RPad() { h_Pad('R'); }

// ================================================================
// TAB 1 - OTHERS
// ================================================================
function Tools_Others_Text1Text2() { h_Spoji(0, 1); }
function Tools_Others_Text2Text1() { h_Spoji(1, 0); }
function Tools_Others_Copy0to1()   { h_Kolumna('0to1'); }
function Tools_Others_Copy0to2()   { h_Kolumna('0to2'); }
function Tools_Others_Copy1to0()   { h_Kolumna('1to0'); }
function Tools_Others_Copy2to0()   { h_Kolumna('2to0'); }
function Tools_Others_Sort()       { h_Razvrsti(document.getElementById('sortAsc').checked); }
function Tools_Others_MoveLeft()   { h_Premakni(-1); }
function Tools_Others_MoveRight()  { h_Premakni(1); }

function Tools_Others_Reverse() {
  var ta = preberiTA(); if (!ta) return;
  var v = vrstice(ta); v.reverse();
  postaviTA(ta, v); obv('Vrstice obrnjene.', 'ok');
}
function Tools_Others_Random() {
  var ta = preberiTA(); if (!ta) return;
  var v = vrstice(ta);
  for (var i = v.length - 1; i > 0; i--) {
    var j = Math.floor(Math.random() * (i + 1));
    var t = v[i]; v[i] = v[j]; v[j] = t;
  }
  postaviTA(ta, v); obv('Random order izvedeno.', 'ok');
}
function Tools_Others_Clear() {
  var ids = ['repKaj','repZ','dodajZac','dodajKon','padZnak','padDolz',
             'rezLevo','rezDesno','rezZnak','trimZnak',
             'concatN','concatMaxDolz','breakMaxDolz','breakZnak',
             'addVrStart','addVrKorak','addVrVrstica',
             'brisKorak','brisZacni','brisNiz','brisPozicija',
             'stevilkeStart','stevilkeKorak','stevilkeCifre','stevilkeZa','stevilkeVrstice'];
  ids.forEach(function(id) { var el = document.getElementById(id); if (el) el.value = ''; });
  var checks = ['padRezanje','brisInvert','brisPrazne','breakCelebesede','breakTrim','stevilkeVse'];
  checks.forEach(function(id) { var el = document.getElementById(id); if (el) el.checked = false; });
  obv('Polja ociscena.', 'ok');
}

// ================================================================
// TAB 2 - CUT
// ================================================================
function Tools_Cut_CutXChars() {
  var ta = preberiTA(); if (!ta) return;
  var lStr = document.getElementById('rezLevo').value.trim();
  var rStr = document.getElementById('rezDesno').value.trim();
  if (lStr === '' && rStr === '') { obv('Vnesi Left ali Right (ali oboje).', 'opoz'); return; }
  var l = lStr !== '' ? parseInt(lStr) : 0;
  var r = rStr !== '' ? parseInt(rStr) : 0;
  var out = vrstice(ta).map(function(v) {
    if (lStr !== '' && l > 0) v = v.substring(l);                     // D7: Copy(s, 1+left, length-left)
    if (rStr !== '') {
      var newLen = v.length - r;
      v = newLen > 0 ? v.substring(0, newLen) : '';                   // D7: Copy(s, 1, length-right)
    }
    return v;
  });
  postaviTA(ta, out); obv('Cut izvedeno.', 'ok');
}

function Tools_Cut_CutByChar() {
  var ta = preberiTA(); if (!ta) return;
  var znak = document.getElementById('rezZnak').value;
  if (!znak) { obv('Vnesi znak (Char).', 'opoz'); return; }
  var ohraniL = document.querySelector('input[name="rezCut"]:checked').value === 'L';
  var out = vrstice(ta).map(function(v) {
    var pos = v.indexOf(znak);
    if (pos < 0) return v;
    return ohraniL ? v.substring(0, pos) : v.substring(pos + znak.length);
  });
  postaviTA(ta, out); obv('Cut by char izvedeno.', 'ok');
}

// ================================================================
// TAB 2 - TRIM
// ================================================================
function Tools_Trim_TrimL() { h_Trim('L'); }
function Tools_Trim_TrimR() { h_Trim('R'); }

// ================================================================
// TAB 2 - OTHERS 2
// ================================================================
function Tools_Others2_AddNumbers() {
  var ta = preberiTA(); if (!ta) return;
  var startS  = document.getElementById('stevilkeStart').value.trim();
  var korakS  = document.getElementById('stevilkeKorak').value.trim();
  var cifreS  = document.getElementById('stevilkeCifre').value.trim();
  var za      = document.getElementById('stevilkeZa').value;
  var vse     = document.getElementById('stevilkeVse').checked;
  var vrsticeS = document.getElementById('stevilkeVrstice').value.trim();
  if (!startS || !korakS || !cifreS || (!vse && !vrsticeS)) {
    obv('Izpolni vsa obvezna polja.', 'opoz'); return;
  }
  var start  = parseInt(startS);
  var korak  = parseInt(korakS);
  var cifre  = parseInt(cifreS);
  var v      = vrstice(ta);
  var maxV   = vse ? v.length : parseInt(vrsticeS);
  var n      = start;
  var out    = [];
  for (var i = 0; i < Math.max(v.length, maxV); i++) {
    if (i < maxV) {
      var s = String(n);
      while (s.length < cifre) s = '0' + s;
      out.push(s + za + (i < v.length ? v[i] : ''));
      n += korak;
    } else {
      out.push(v[i]);
    }
  }
  postaviTA(ta, out); obv('Stevilke dodane.', 'ok');
}

// ================================================================
// TAB 3 - CONCATENATE LINES
// ================================================================
function Tools_ConcatLines_Concatenate() {
  var ta = preberiTA(); if (!ta) return;
  var nStr    = document.getElementById('concatN').value.trim();
  var maxDStr = document.getElementById('concatMaxDolz').value.trim();
  if (!nStr && !maxDStr) { obv('Izpolni vsaj eno polje (N ali Max dolžina).', 'opoz'); return; }
  var n    = nStr    ? parseInt(nStr)    : 0;
  var maxD = maxDStr ? parseInt(maxDStr) : 0;
  if (nStr    && n    === 0) { obv('N mora biti > 0.',          'opoz'); return; }
  if (maxDStr && maxD === 0) { obv('Max dolžina mora biti > 0.','opoz'); return; }
  //
  var v    = vrstice(ta);
  var out  = [];
  var curr = '';
  var cnt  = 0;
  for (var i = 0; i < v.length; i++) {
    var line = v[i];
    if (!nStr) {
      // samo po dolžini
      if (curr.length + line.length > maxD) {
        out.push(curr); curr = line;
      } else {
        curr = curr + line;
      }
    } else if (!maxDStr) {
      // samo po številu vrstic
      if (cnt >= n) {
        out.push(curr); curr = line; cnt = 1;
      } else {
        curr = curr + line; cnt++;
      }
    } else {
      // oba pogoja
      if (curr.length + line.length > maxD) {
        out.push(curr); curr = line; cnt = 1;
      } else if (cnt >= n) {
        out.push(curr); curr = line; cnt = 1;
      } else {
        curr = curr + line; cnt++;
      }
    }
  }
  if (curr !== '') out.push(curr);
  postaviTA(ta, out); obv('Concat izvedeno.', 'ok');
}

// ================================================================
// TAB 3 - BREAK LINES
// ================================================================
function Tools_BreakLines_BreakByLength() {
  var ta = preberiTA(); if (!ta) return;
  var maxDStr = document.getElementById('breakMaxDolz').value.trim();
  if (!maxDStr) { obv('Vnesi dolžino (Max length).', 'opoz'); return; }
  var maxD  = parseInt(maxDStr);
  if (isNaN(maxD) || maxD <= 0) { obv('Max dolžina mora biti > 0.', 'opoz'); return; }
  var celeB = document.getElementById('breakCelebesede').checked;
  var v = vrstice(ta); var out = [];
  v.forEach(function(vr) {
    while (vr.length > maxD) {
      var pos = maxD;
      if (celeB) {
        while (pos > 0 && vr[pos] !== ' ') pos--;
        if (pos === 0) pos = maxD;
      }
      out.push(vr.substring(0, pos));
      vr = vr.substring(pos);
      if (celeB) vr = vr.replace(/^ +/, '');   // TrimLeft za whole-words
    }
    out.push(vr);
  });
  postaviTA(ta, out); obv('Break by length izvedeno.', 'ok');
}

function Tools_BreakLines_BreakByChar() {
  var ta = preberiTA(); if (!ta) return;
  var znak = document.getElementById('breakZnak').value;
  if (!znak) { obv('Vnesi znak (Char).', 'opoz'); return; }
  var trim = document.getElementById('breakTrim').checked;
  var out  = [];
  vrstice(ta).forEach(function(vr) {
    var pos;
    // D7: zanka Pos() → dodaj levo stran, nadaljuj z desno stranjo
    while ((pos = vr.indexOf(znak)) >= 0) {
      var part = vr.substring(0, pos);
      out.push(trim ? part.replace(/^\s+/, '') : part);   // D7 TrimLeft
      vr = vr.substring(pos + znak.length);
    }
    if (vr !== '') out.push(trim ? vr.replace(/^\s+/, '') : vr);   // D7: samo ne-prazno
  });
  postaviTA(ta, out); obv('Break by char izvedeno.', 'ok');
}

// ================================================================
// TAB 3 - ADD LINES
// ================================================================
function Tools_AddLines_AddLines() {
  var ta = preberiTA(); if (!ta) return;
  var startS = document.getElementById('addVrStart').value.trim();
  var korakS = document.getElementById('addVrKorak').value.trim();
  if (!startS || !korakS) { obv('Izpolni obe polji (Start in Step).', 'opoz'); return; }
  var start   = parseInt(startS);
  var korak   = parseInt(korakS);
  var vrstica = document.getElementById('addVrVrstica').value;
  var v = vrstice(ta);
  if (start === 0 || start > v.length || korak < 2) { obv('Napačni podatki.', 'opoz'); return; }
  var out = [];
  for (var i = 0; i < v.length; i++) {
    if (i >= start - 1 && (i + 1 - start) % (korak - 1) === 0) out.push(vrstica);
    out.push(v[i]);
  }
  postaviTA(ta, out); obv('Add lines izvedeno.', 'ok');
}

// ================================================================
// TAB 3 - DELETE LINES
// ================================================================
function Tools_DeleteLines_DeleteNth() {
  var ta = preberiTA(); if (!ta) return;
  var startS = document.getElementById('brisZacni').value.trim();
  var korakS = document.getElementById('brisKorak').value.trim();
  if (!startS || !korakS) { obv('Izpolni obe polji (Start in Step).', 'opoz'); return; }
  var zacni = parseInt(startS);
  var korak = parseInt(korakS);
  var v = vrstice(ta);
  if (zacni === 0 || zacni > v.length || korak < 2) { obv('Napačni podatki.', 'opoz'); return; }
  var out = [];
  for (var i = 0; i < v.length; i++) {
    var n = i + 1;
    if (n >= zacni && (n - zacni) % korak === 0) continue;   // D7: (i+1-start) mod step = 0
    out.push(v[i]);
  }
  postaviTA(ta, out); obv('Delete nth izvedeno.', 'ok');
}

function Tools_DeleteLines_DeleteByPos() {
  var ta = preberiTA(); if (!ta) return;
  var niz    = document.getElementById('brisNiz').value;
  var pozS   = document.getElementById('brisPozicija').value.trim();
  var invert = document.getElementById('brisInvert').checked;
  var prazne = document.getElementById('brisPrazne').checked;
  if (!niz || !pozS) { obv('Izpolni obe polji (String in Position).', 'opoz'); return; }
  var poz = parseInt(pozS);
  if (poz < 1) { obv('Pozicija mora biti ≥ 1.', 'opoz'); return; }
  var out = vrstice(ta).filter(function(vr) {
    if (prazne && vr.trim() === '') return false;
    var slice = vr.substring(poz - 1, poz - 1 + niz.length);
    var ujema = (slice === niz);
    return invert ? ujema : !ujema;
  });
  postaviTA(ta, out); obv('Delete at pos izvedeno.', 'ok');
}

function Tools_DeleteLines_DeleteEmpty() {
  // D7: ohrani vrstice aktivnega teksta, kjer je ustrezna vrstica v Text1 ne-prazna
  var ta = preberiTA(); if (!ta) return;
  var t1 = taProxies[1];
  if (!t1) { obv('Text 1 ni na voljo.', 'napaka'); return; }
  var vT1 = vrstice(t1);
  var out = vrstice(ta).filter(function(vr, i) {
    return i < vT1.length && vT1[i].trim() !== '';
  });
  postaviTA(ta, out); obv('Delete by T1 izvedeno.', 'ok');
}

// ================================================================
// TAB 3 - MULTIPLY LINES
// ================================================================
function Tools_MultiplyLines_Multiply() {
  // Format vrstice: "N###besedilo" → ponovi besedilo N-krat
  // Vrstice brez "###" → kopiraj kot je
  var ta     = preberiTA(); if (!ta) return;
  var ohrani = document.getElementById('multOhrani').checked;
  var v      = vrstice(ta);
  var out    = [];
  v.forEach(function(vr) {
    var pos = vr.indexOf('###');
    if (pos > 0) {
      var multi = parseInt(vr.substring(0, pos));
      if (!isNaN(multi) && multi > 0) {
        var besedilo = vr.substring(pos + 3);
        if (ohrani) {
          for (var j = 0; j < multi; j++) out.push(vr);     // ohrani "N###tekst"
        } else {
          for (var j = 0; j < multi; j++) out.push(besedilo);
        }
        return;
      }
    }
    out.push(vr);
  });
  postaviTA(ta, out); obv('Multiply izvedeno.', 'ok');
}
