// ================================================================
// MODAL DIALOG
// ================================================================
var _modalResolve = null;
function modalZapri(val) {
  document.getElementById('modal-overlay').style.display = 'none';
  if (_modalResolve) { _modalResolve(val); _modalResolve = null; }
}
function customPrompt(msg, def) {
  return new Promise(function(resolve) {
    _modalResolve = resolve;
    document.getElementById('modal-naslov-txt').textContent = 'Input';
    document.getElementById('modal-sporocilo').textContent = msg || '';
    var inp = document.getElementById('modal-input');
    inp.style.display = ''; inp.value = (def !== undefined && def !== null) ? def : '';
    var ok = document.getElementById('modal-ok');
    var cancel = document.getElementById('modal-cancel');
    cancel.style.display = '';
    ok.onclick = function() { modalZapri(inp.value); };
    cancel.onclick = function() { modalZapri(null); };
    inp.onkeydown = function(e) {
      if (e.key === 'Enter') { e.preventDefault(); modalZapri(inp.value); }
      if (e.key === 'Escape') { e.preventDefault(); modalZapri(null); }
    };
    document.getElementById('modal-overlay').style.display = 'flex';
    setTimeout(function() { inp.focus(); inp.select(); }, 30);
  });
}
function customAlert(msg) {
  return new Promise(function(resolve) {
    _modalResolve = resolve;
    document.getElementById('modal-naslov-txt').textContent = 'Obvestilo';
    document.getElementById('modal-sporocilo').textContent = msg || '';
    document.getElementById('modal-input').style.display = 'none';
    document.getElementById('modal-cancel').style.display = 'none';
    var ok = document.getElementById('modal-ok');
    ok.onclick = function() { modalZapri(undefined); };
    ok.onkeydown = function(e) { if (e.key === 'Escape' || e.key === 'Enter') modalZapri(undefined); };
    document.getElementById('modal-overlay').style.display = 'flex';
    setTimeout(function() { ok.focus(); }, 30);
  });
}
function customAbout() {
  return new Promise(function(resolve) {
    _modalResolve = resolve;
    document.getElementById('modal-naslov-txt').textContent = 'About';
    var spo = document.getElementById('modal-sporocilo');
    spo.innerHTML =
      '<div class="about-header">' +
        '<div class="about-logo-box"><img src="images/tauko.gif" alt="Tauko"></div>' +
        '<div class="about-right">' +
          '<img src="images/tauko-title.png" alt="Tauko">' +
          '<div class="about-copyright">Copyright \u00a9 2001, 2004-2026 Tauko</div>' +
          '<a href="mailto:slavko.mervar@gmail.com" class="about-email">slavko.mervar@gmail.com</a>' +
        '</div>' +
      '</div>';
    document.getElementById('modal-input').style.display = 'none';
    document.getElementById('modal-cancel').style.display = 'none';
    var ok = document.getElementById('modal-ok');
    ok.onclick = function() { spo.innerHTML = ''; modalZapri(undefined); };
    ok.onkeydown = function(e) { if (e.key === 'Escape' || e.key === 'Enter') { spo.innerHTML = ''; modalZapri(undefined); } };
    document.getElementById('modal-overlay').style.display = 'flex';
    setTimeout(function() { ok.focus(); }, 30);
  });
}
window.prompt = customPrompt;
window.alert  = customAlert;
document.addEventListener('keydown', function(e) {
  if (e.key === 'Escape' && document.getElementById('modal-overlay').style.display !== 'none') {
    e.preventDefault(); modalZapri(null);
  }
});

// ================================================================
// STANJE
// ================================================================
var aktTekst   = 0;
var aktZavihek = 'tekst0';
var undoBuf    = ['', '', ''];
var vticniki   = [];
var vtIzbranIdx = -1;
var nastavitve = {
  pisava: 'Courier New', velikost: 12, prelomVrstic: false,
  dovoliZavihke: false, pokaziVticnike: true
};

// ================================================================
// INIT
// ================================================================
document.addEventListener('DOMContentLoaded', function() {
  Menu_NastavitveNalozi();
  cmInit();
  // Demo (nastavi pred shramba, da localStorage prepiše z resničnimi podatki)
  if (cms[0]) cms[0].setValue('Vrstica 1 - primer besedila\nVrstica 2 - primer besedila\nVrstica 3 - primer besedila', -1);
  if (cms[1]) cms[1].setValue('apple\nbanana\ncherry\ndate\nelderberry\nfig\ngrape', -1);
  if (cms[2]) cms[2].setValue('1024\n2048\n4096\n8192\n16384\n32768\n65536', -1);
  vtNalozi();
  shrambaNalozi();
  fhInit();
  zavihekTekst('tekst1');
  Menu_Settings_PisavaPosodobi();
  // Zapri menije ob kliku drugje
  document.addEventListener('click', function(e) {
    if (!e.target.closest('.menu-element')) Menu_ZapriVse();
  });
  // Bljuznice
  document.addEventListener('keydown', kbdHandler);
  // Dvojni klik na repKaj (What) → vstavi znak tabulatorja
  var repKajEl = document.getElementById('repKaj');
  if (repKajEl) repKajEl.addEventListener('dblclick', function(e) {
    e.preventDefault();
    var s = this.selectionStart, end = this.selectionEnd;
    this.value = this.value.substring(0, s) + '\t' + this.value.substring(end);
    this.selectionStart = this.selectionEnd = s + 1;
  });
});

// ================================================================
// ORODJA ZAVIHKI
// ================================================================
function orodjeZavihek(idx) {
  for (var i = 0; i < 3; i++) {
    document.getElementById('ozt' + i).classList.toggle('aktiven', i === idx);
    document.getElementById('otab' + i).classList.toggle('aktiven', i === idx);
  }
}

// ================================================================
// TEKST ZAVIHKI
// ================================================================
var T_BARVE = {0: '#aa8800', 1: '#0055cc', 2: '#cc0000'};
var prejsnjiZavihek = 'tekst1';

function aktOsvezi(idx) {
  var el = document.getElementById('stAkt12Val');
  if (idx === null || isNaN(idx)) {
    el.textContent = '';
    el.style.color = '';
    document.getElementById('stVrs').textContent  = '';
    document.getElementById('stStol').textContent = '';
    document.getElementById('stSkup').textContent = '';
  } else {
    el.textContent = 'Text ' + idx;
    el.style.color = T_BARVE[idx] || '';
  }
}

function zavihekTekst(ime) {
  document.querySelectorAll('.zavihek').forEach(function(z) { z.classList.remove('aktiven'); });
  document.querySelectorAll('.zavihek-vsebina').forEach(function(v) { v.classList.remove('aktiven'); });
  document.getElementById('ztab-' + ime).classList.add('aktiven');
  document.getElementById('zvsb-' + ime).classList.add('aktiven');

  if (ime !== 'tekst12') prejsnjiZavihek = aktZavihek;
  aktZavihek = ime;

  if (ime === 'undo') {
    aktOsvezi(null);
  } else if (ime === 'tekst12') {
    if (cms12[1]) cms12[1].setValue(cms[1] ? cms[1].getValue() : '', -1);
    if (cms12[2]) cms12[2].setValue(cms[2] ? cms[2].getValue() : '', -1);
    // če prihajamo iz tekst2, nastavi aktiven 2, sicer 1
    var def = (prejsnjiZavihek === 'tekst2') ? 2 : 1;
    aktTekst = def;
    t12OzadjeOsvezi(def);
    aktOsvezi(def);
    statusPosodobi(taProxies[def]);
    if (cms12[def]) setTimeout(function() { cms12[def].focus(); }, 50);
  } else {
    // pri odhodu iz tekst12: eksplicitno sinhroniziraj cms12 → cms
    if (prejsnjiZavihek === 'tekst12') {
      [1, 2].forEach(function(i) {
        if (cms12[i] && cms[i]) { var v = cms12[i].getValue(); if (cms[i].getValue() !== v) cms[i].setValue(v, -1); }
      });
    }
    aktTekst = parseInt(ime.replace('tekst', ''));
    statusPosodobi(taProxies[aktTekst]);
    aktOsvezi(aktTekst);
    if (cms[aktTekst]) setTimeout(function() { cms[aktTekst].resize(); }, 0);
  }
}

// ================================================================
// ACE EDITOR
// ================================================================
var cms   = [null, null, null];
var cms12 = [null, null, null];

function cmInit() {
  [0, 1, 2].forEach(function(i) {
    var wrap = document.getElementById('ace-wrap' + i);
    if (!wrap) return;
    cms[i] = ace.edit(wrap);
    cms[i].setOptions({
      mode: 'ace/mode/text',
      theme: 'ace/theme/textmate',
      showLineNumbers: true,
      showGutter: true,
      wrap: false,
      useSoftTabs: true,
      tabSize: 4,
      fontSize: nastavitve.velikost + 'px',
      fontFamily: "'Courier New', Courier, monospace",
      showPrintMargin: false,
      highlightActiveLine: true,
      highlightSelectedWord: false
    });
    cms[i].setValue('', -1);
    cms[i].on('change', function() { shrambaNapisi(); });
    cms[i].on('changeSelection', (function(idx) { return function() {
      if (aktTekst === idx && aktZavihek !== 'undo') cmStatusOsvezi(idx);
    }; })(i));
    cms[i].on('focus', (function(idx) { return function() {
      if (aktZavihek !== 'tekst12') { aktTekst = idx; aktOsvezi(idx); }
      cmStatusOsvezi(idx);
    }; })(i));
  });
  taProxies = [0, 1, 2].map(function(i) { return makeTaProxy(i); });
  // 1&2 tab Ace editorji
  [1, 2].forEach(function(i) {
    var wrap = document.getElementById('ace12-wrap' + i);
    if (!wrap) return;
    cms12[i] = ace.edit(wrap);
    cms12[i].setOptions({
      mode: 'ace/mode/text',
      theme: 'ace/theme/textmate',
      showLineNumbers: true,
      showGutter: true,
      wrap: false,
      useSoftTabs: true,
      tabSize: 4,
      fontSize: nastavitve.velikost + 'px',
      fontFamily: "'Courier New', Courier, monospace",
      showPrintMargin: false,
      highlightActiveLine: true,
      highlightSelectedWord: false
    });
    cms12[i].setValue('', -1);
    cms12[i].on('change', (function(idx) { return function() {
      var v = cms12[idx].getValue();
      if (cms[idx] && cms[idx].getValue() !== v) cms[idx].setValue(v, -1);
      shrambaNapisi();
    }; })(i));
    cms12[i].on('changeSelection', (function(idx) { return function() {
      if (aktZavihek === 'tekst12' && aktTekst === idx) {
        var cur = cms12[idx].getCursorPosition();
        document.getElementById('stVrs').textContent  = cur.row + 1;
        document.getElementById('stStol').textContent = cur.column + 1;
        document.getElementById('stSkup').textContent = cms12[idx].session.getLength();
      }
    }; })(i));
    cms12[i].on('focus', (function(idx) { return function() { t12Fokus(idx); }; })(i));
  });
  // Bljuznice Ctrl+U (upper) in Ctrl+L (lower) v vseh Ace editorjih
  function cmAddCaseCmds(ed) {
    ed.commands.addCommand({
      name: 'toUpperCase',
      bindKey: {win: 'Ctrl-U', mac: 'Ctrl-U'},
      exec: function(e) {
        var r = e.selection.getRange();
        var sel = e.getSelectedText();
        if (sel) { e.session.replace(r, sel.toLocaleUpperCase()); e.selection.setRange(r); }
      }
    });
    ed.commands.addCommand({
      name: 'toLowerCase',
      bindKey: {win: 'Ctrl-L', mac: 'Ctrl-L'},
      exec: function(e) {
        var r = e.selection.getRange();
        var sel = e.getSelectedText();
        if (sel) { e.session.replace(r, sel.toLocaleLowerCase()); e.selection.setRange(r); }
      }
    });
  }
  [0, 1, 2].forEach(function(i) { if (cms[i])   cmAddCaseCmds(cms[i]); });
  [1, 2].forEach(function(i)    { if (cms12[i]) cmAddCaseCmds(cms12[i]); });
}

function makeTaProxy(idx) {
  function _posToIdx(pos) {
    if (!cms[idx]) return 0;
    return cms[idx].session.getDocument().positionToIndex(pos);
  }
  function _idxToPos(n) {
    if (!cms[idx]) return {row: 0, column: 0};
    return cms[idx].session.getDocument().indexToPosition(n);
  }
  return {
    id: 'tekst' + idx,
    get value() { return cms[idx] ? cms[idx].getValue() : ''; },
    set value(v) { if (cms[idx]) cms[idx].setValue(v, -1); },
    get selectionStart() {
      if (!cms[idx]) return 0;
      return _posToIdx(cms[idx].selection.getRange().start);
    },
    get selectionEnd() {
      if (!cms[idx]) return 0;
      return _posToIdx(cms[idx].selection.getRange().end);
    },
    setSelectionRange: function(s, e) {
      if (!cms[idx]) return;
      cms[idx].selection.setRange({ start: _idxToPos(s), end: _idxToPos(e) });
      cms[idx].focus();
    },
    select: function() { if (cms[idx]) cms[idx].selectAll(); },
    focus: function() { if (cms[idx]) cms[idx].focus(); }
  };
}
var taProxies = [null, null, null];

function cmStatusOsvezi(idx) {
  if (!cms[idx]) return;
  var cur = cms[idx].getCursorPosition();
  document.getElementById('stVrs').textContent  = cur.row + 1;
  document.getElementById('stStol').textContent = cur.column + 1;
  document.getElementById('stSkup').textContent = cms[idx].session.getLength();
}

function stNapolni(idx) { cmStatusOsvezi(idx); }

function t12OzadjeOsvezi(idx) {
  document.getElementById('t12blok1').classList.toggle('tekst12-neaktiven', idx !== 1);
  document.getElementById('t12blok2').classList.toggle('tekst12-neaktiven', idx !== 2);
  [1, 2].forEach(function(i) {
    if (!cms12[i]) return;
    var neakt = (i !== idx);
    var bg    = neakt ? '#e0e0e0' : '';
    var bgGut = neakt ? '#d0d0d0' : '';
    var el  = cms12[i].container.querySelector('.ace_editor');  if (el)  el.style.backgroundColor = bg;
    var gut = cms12[i].container.querySelector('.ace_gutter');  if (gut) gut.style.backgroundColor = bgGut;
    var scr = cms12[i].container.querySelector('.ace_scroller'); if (scr) scr.style.backgroundColor = bg;
  });
}
function t12Fokus(idx) {
  aktTekst = idx;
  t12OzadjeOsvezi(idx);
  aktOsvezi(idx);
  statusPosodobi(taProxies[idx]);
}

// ================================================================
// STATUS
// ================================================================
function statusPosodobi(ta) {
  if (!ta) return;
  var idx = parseInt(ta.id.replace('tekst', ''));
  if (!isNaN(idx)) cmStatusOsvezi(idx);
}

// ================================================================
// POMOŽNE
// ================================================================
function aktTA() {
  if (aktZavihek === 'undo') return null;
  return taProxies[aktTekst];
}
function preberiTA() {
  var ta = aktTA();
  if (!ta) { obv('Izberi zavihek Text 0, 1 ali 2.', 'napaka'); return null; }
  return ta;
}
function shraniUndo(ta) {
  var idx = parseInt(ta.id.replace('tekst', ''));
  undoBuf[idx] = ta.value;
  var u = document.getElementById('undo' + idx);
  if (u) u.value = undoBuf[idx];
}
function postaviTA(ta, vOut) {
  shraniUndo(ta);
  ta.value = vOut.join('\n');
  statusPosodobi(ta); shrambaNapisi();
}
function vrstice(ta) { return ta.value.replace(/\r/g, '').split('\n'); }

// ================================================================
// VTIČNIKI
// ================================================================
function vtNalozi() {
  if (typeof pluginList !== 'undefined') vticniki = pluginList;
  vtNapolni(vticniki);
}
function vtNapolni(seznam) {
  var sel = document.getElementById('vtSeznam');
  sel.innerHTML = '';
  vtIzbranIdx = -1;
  var zebra = 0;
  seznam.forEach(function(v) {
    var div = document.createElement('div');
    if (v.separator) {
      zebra = 0;
      div.className = 'vt-sep';
      div.textContent = v.ime || '─────────────────';
    } else {
      div.className = 'vt-item' + (zebra++ % 2 ? ' vt-item-alt' : '');
      div.dataset.idx = vticniki.indexOf(v);
      var ikonaEl = document.createElement('span');
      ikonaEl.className = 'vt-ikona';
      ikonaEl.textContent = v.ikona || '';
      var imeEl = document.createElement('span');
      imeEl.textContent = v.ime;
      div.appendChild(ikonaEl);
      div.appendChild(imeEl);
      div.addEventListener('click', function() { vtIzbiraj(this); });
      div.addEventListener('dblclick', function() { vtZazeni(); });
    }
    sel.appendChild(div);
  });
}
function vtIzbiraj(divEl) {
  var sel = document.getElementById('vtSeznam');
  sel.querySelectorAll('.vt-item.aktiven').forEach(function(d) { d.classList.remove('aktiven'); });
  divEl.classList.add('aktiven');
  vtIzbranIdx = parseInt(divEl.dataset.idx);
  var v = vticniki[vtIzbranIdx];
  var prev = document.getElementById('vtPredogled');
  if (v && !v.separator) {
    var naslov = (v.ikona ? v.ikona + ' ' : '') + v.ime;
    var opis = (v.opis || '') + (v.opisDolg ? '\n\n' + v.opisDolg : '');
    prev.innerHTML = '<span class="vt-predogled-naslov">' + naslov + '</span>' + (opis ? '\n' + opis : '');
  } else prev.innerHTML = '';
  sel.focus();
}
function vtFiltruj(q) {
  if (!q.trim()) { vtNapolni(vticniki); return; }
  var filt = vticniki.filter(function(v) { return !v.separator && v.ime.toLowerCase().indexOf(q.toLowerCase()) >= 0; });
  vtNapolni(filt);
}
document.addEventListener('DOMContentLoaded', function() {
  var sel = document.getElementById('vtSeznam');
  sel.addEventListener('keydown', function(e) {
    var items = Array.from(sel.querySelectorAll('.vt-item'));
    if (!items.length) return;
    if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
      e.preventDefault();
      var ci = items.findIndex(function(d) { return d.classList.contains('aktiven'); });
      var ni = e.key === 'ArrowDown' ? Math.min(ci + 1, items.length - 1) : Math.max(ci - 1, 0);
      if (ci < 0) ni = 0;
      vtIzbiraj(items[ni]);
      items[ni].scrollIntoView({ block: 'nearest' });
    } else if (e.key === 'Enter') {
      vtZazeni();
    } else if (e.key === 'Tab') {
      e.preventDefault();
      document.getElementById('vtFilter').focus();
    }
  });
});
async function vtZazeni() {
  var ta = preberiTA(); if (!ta) return;
  var idx = vtIzbranIdx;
  if (idx < 0 || isNaN(idx)) { obv('Izberi vtičnik.', 'opoz'); return; }
  var v = vticniki[idx];
  if (!v || v.separator || !v.zazeni) { obv('Izberi vtičnik.', 'opoz'); return; }
  try {
    document.body.style.cursor = 'progress';
    var undo = document.getElementById('undo' + aktTekst);
    var rez = await v.zazeni(ta, undo);
    if (undo) undoBuf[aktTekst] = undo.value;
    document.body.style.cursor = '';
    if (rez === false) obv(v.ime + ' - preklicano.', 'opoz');
    else { stNapolni(aktTekst); statusPosodobi(ta); shrambaNapisi(); obv(v.ime, 'ok'); }
  } catch(e) {
    document.body.style.cursor = '';
    obv('Napaka vtičnika: ' + e.message, 'napaka');
  }
}
function vtInfo() {
  var idx = vtIzbranIdx;
  if (idx < 0 || isNaN(idx)) { obv('Izberi vtičnik.', 'opoz'); return; }
  var v = vticniki[idx];
  if (!v || v.separator) return;
  var msg = (v.ikona ? v.ikona + ' ' : '') + v.ime;
  if (v.opis) msg += '\n\n' + v.opis;
  if (v.opisDolg) msg += '\n\n' + v.opisDolg;
  alert(msg);
}

// ================================================================
// BLJUZNICE
// ================================================================
function kbdHandler(e) {
  if (e.ctrlKey) {
    if (e.key === 'z' || e.key === 'Z') { e.preventDefault(); Menu_File_Undo(); }
    if (e.key === 's' || e.key === 'S') { e.preventDefault(); Menu_File_Save(); }
    if (e.key === 'o' || e.key === 'O') { e.preventDefault(); Menu_File_Open(); }
    if (e.key === 'n' || e.key === 'N') { e.preventDefault(); Menu_File_New(); }
    if (e.key === 'f' || e.key === 'F') { e.preventDefault(); Menu_Edit_Find(); }
    if (e.key === '0') { e.preventDefault(); zavihekTekst('tekst0'); }
    if (e.key === '1') { e.preventDefault(); zavihekTekst('tekst1'); }
    if (e.key === '2') { e.preventDefault(); zavihekTekst('tekst2'); }
  }
  if (e.key === 'F3') { e.preventDefault(); Menu_Edit_FindNext(); }
  if (e.key === 'F8') { e.preventDefault(); vtZazeni(); }
  // Zavihki v textarea
  if (e.key === 'Tab' && e.target.classList.contains('tekst-polje') && nastavitve.dovoliZavihke) {
    e.preventDefault();
    var s = e.target.selectionStart;
    e.target.value = e.target.value.substring(0, s) + '\t' + e.target.value.substring(e.target.selectionEnd);
    e.target.selectionStart = e.target.selectionEnd = s + 1;
  }
}

// ================================================================
// LOKALNO SHRANJEVANJE
// ================================================================
function shrambaNapisi() {
  try {
    localStorage.setItem('editor_t0', cms[0] ? cms[0].getValue() : '');
    localStorage.setItem('editor_t1', cms[1] ? cms[1].getValue() : '');
    localStorage.setItem('editor_t2', cms[2] ? cms[2].getValue() : '');
  } catch(e) {}
}
var SHRAMBA_VER = '3';
function shrambaNalozi() {
  try {
    if (localStorage.getItem('editor_ver') !== SHRAMBA_VER) {
      localStorage.removeItem('editor_t0');
      localStorage.removeItem('editor_t1');
      localStorage.removeItem('editor_t2');
      localStorage.setItem('editor_ver', SHRAMBA_VER);
      return;
    }
    var t0 = localStorage.getItem('editor_t0'), t1 = localStorage.getItem('editor_t1'), t2 = localStorage.getItem('editor_t2');
    if (t0 && cms[0]) cms[0].setValue(t0, -1);
    if (t1 && cms[1]) cms[1].setValue(t1, -1);
    if (t2 && cms[2]) cms[2].setValue(t2, -1);
  } catch(e) {}
}

// ================================================================
// OBVESTILA
// ================================================================
function obv(spo, tip) {
  var el = document.createElement('div');
  el.className = 'obv obv-' + (tip || 'ok');
  el.textContent = spo;
  document.getElementById('obvestila').appendChild(el);
  setTimeout(function() { el.style.opacity = '0'; setTimeout(function() { el.remove(); }, 400); }, 2500);
}
