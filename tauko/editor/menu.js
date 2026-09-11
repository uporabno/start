// ================================================================
// MENIJI - INFRASTRUKTURA
// ================================================================
function Menu_Preklopi(id) {
  var popup = document.getElementById('menu-' + id);
  var bil = popup && popup.classList.contains('odprt');
  Menu_ZapriVse();
  if (!bil && popup) {
    popup.classList.add('odprt');
    var gumb = popup.previousElementSibling;
    if (gumb) gumb.classList.add('odprt');
  }
}
function Menu_ZapriVse() {
  document.querySelectorAll('.menu-popup').forEach(function(p){ p.classList.remove('odprt'); });
  document.querySelectorAll('.menu-gumb.odprt').forEach(function(g){ g.classList.remove('odprt'); });
}
function Menu_PreklopiZavihek(ime) { zavihekTekst(ime); Menu_ZapriVse(); }

// ================================================================
// MENU FILE
// ================================================================

// File System Access API - file handles (Chrome/Edge)
var fileHandles = [null, null, null];
var fileNames   = ['tekst.txt', 'tekst.txt', 'tekst.txt'];

function fhDbOpen() {
  return new Promise(function(res, rej) {
    var req = indexedDB.open('EditorFH', 1);
    req.onupgradeneeded = function(e) { e.target.result.createObjectStore('handles'); };
    req.onsuccess = function(e) { res(e.target.result); };
    req.onerror = function() { rej(); };
  });
}
function fhSaveDB(idx, handle) {
  fhDbOpen().then(function(db) {
    db.transaction('handles','readwrite').objectStore('handles').put(handle, idx);
  }).catch(function(){});
}
function fhLoadDB(idx) {
  return fhDbOpen().then(function(db) {
    return new Promise(function(res) {
      var req = db.transaction('handles').objectStore('handles').get(idx);
      req.onsuccess = function() { res(req.result || null); };
      req.onerror   = function() { res(null); };
    });
  }).catch(function() { return null; });
}
function fhInit() {
  if (!window.showOpenFilePicker) return;
  [0,1,2].forEach(function(i) {
    fhLoadDB(i).then(function(h) { if (h) { fileHandles[i] = h; fileNames[i] = h.name; } });
  });
}

function Menu_File_New() {
  var ta = aktTA(); if (!ta) return;
  if (ta.value && !confirm('Izbrišeš vsebino zavihka?')) return;
  shraniUndo(ta); ta.value = '';
  var i = parseInt(ta.id.replace('tekst',''));
  fileHandles[i] = null; fileNames[i] = 'tekst.txt';
  stNapolni(i); statusPosodobi(ta);
  Menu_ZapriVse();
}
async function Menu_File_Open() {
  Menu_ZapriVse();
  if (window.showOpenFilePicker) {
    try {
      var [handle] = await showOpenFilePicker({
        types: [{ description: 'Text files', accept: { 'text/*': ['.txt','.js','.html','.css','.md','.csv','.json','.xml','.log','.ini','.bat','.py'] } }],
        multiple: false
      });
      var file = await handle.getFile();
      var text = await file.text();
      var ta = aktTA(); if (!ta) return;
      shraniUndo(ta); ta.value = text;
      var i = parseInt(ta.id.replace('tekst',''));
      fileHandles[i] = handle; fileNames[i] = handle.name;
      fhSaveDB(i, handle);
      stNapolni(i); statusPosodobi(ta); shrambaNapisi();
      obv('Odprto: ' + handle.name, 'ok');
    } catch(e) { if (e.name !== 'AbortError') obv('Napaka pri odpiranju.', 'err'); }
  } else {
    document.getElementById('datVhod').click();
  }
}
function Menu_File_DatOdpri(vhod) {
  var f = vhod.files[0]; if (!f) return;
  var ta = aktTA(); if (!ta) return;
  var br = new FileReader();
  br.onload = function(e) {
    shraniUndo(ta); ta.value = e.target.result;
    var i = parseInt(ta.id.replace('tekst',''));
    fileNames[i] = f.name;
    stNapolni(i); statusPosodobi(ta); shrambaNapisi();
    obv('Odprto: ' + f.name, 'ok');
  };
  br.readAsText(f, 'UTF-8'); vhod.value = '';
}
async function Menu_File_Save() {
  Menu_ZapriVse();
  var ta = aktTA(); if (!ta) return;
  var i = parseInt(ta.id.replace('tekst',''));
  if (window.showSaveFilePicker) {
    var h = fileHandles[i];
    if (!h) { await Menu_File_SaveAs(); return; }
    try {
      var perm = await h.queryPermission({ mode: 'readwrite' });
      if (perm !== 'granted') perm = await h.requestPermission({ mode: 'readwrite' });
      if (perm !== 'granted') { obv('Ni dovoljenja za pisanje.', 'err'); return; }
      var w = await h.createWritable();
      await w.write(ta.value);
      await w.close();
      obv('Shranjeno: ' + h.name, 'ok');
    } catch(e) { obv('Napaka pri shranjevanju.', 'err'); }
  } else {
    fhDownload(ta.value, fileNames[i] || 'tekst.txt');
  }
}
async function Menu_File_SaveAs() {
  Menu_ZapriVse();
  var ta = aktTA(); if (!ta) return;
  var i = parseInt(ta.id.replace('tekst',''));
  if (window.showSaveFilePicker) {
    try {
      var h = await showSaveFilePicker({
        suggestedName: fileNames[i] || 'tekst.txt',
        types: [{ description: 'Text files', accept: { 'text/plain': ['.txt','.js','.html','.css','.md','.csv','.json','.xml','.log','.ini','.bat','.py'] } }]
      });
      var w = await h.createWritable();
      await w.write(ta.value);
      await w.close();
      fileHandles[i] = h; fileNames[i] = h.name;
      fhSaveDB(i, h);
      obv('Shranjeno: ' + h.name, 'ok');
    } catch(e) { if (e.name !== 'AbortError') obv('Napaka pri shranjevanju.', 'err'); }
  } else {
    fhDownload(ta.value, fileNames[i] || 'tekst.txt');
  }
}
function fhDownload(text, name) {
  var b = new Blob([text], {type: 'text/plain;charset=utf-8'});
  var a = document.createElement('a'); a.href = URL.createObjectURL(b); a.download = name;
  document.body.appendChild(a); a.click(); document.body.removeChild(a);
  setTimeout(function() { URL.revokeObjectURL(a.href); obv('Shranjeno: ' + name, 'ok'); }, 800);
}
function Menu_File_Undo() {
  Menu_ZapriVse();
  var ta = aktTA(); if (!ta) return;
  var i = parseInt(ta.id.replace('tekst',''));
  ta.value = undoBuf[i]; stNapolni(i); statusPosodobi(ta); obv('Razveljavljeno.', 'ok');
}
function Menu_File_Exit() {
  Menu_ZapriVse();
  if (confirm('Zapri editor?')) window.close();
}

// ================================================================
// MENU EDIT
// ================================================================
function Menu_Edit_Find() {
  Menu_ZapriVse();
  var q = prompt('Najdi:', ''); if (!q) return;
  var ta = aktTA(); if (!ta) return;
  var pos = ta.value.indexOf(q, ta.selectionEnd || 0);
  if (pos < 0) pos = ta.value.indexOf(q, 0);
  if (pos >= 0) { ta.setSelectionRange(pos, pos + q.length); ta.focus(); obv('Najdeno.', 'ok'); }
  else obv('Ni najdeno: ' + q, 'opoz');
  document.getElementById('datVhod').dataset.iskanje = q;
}
function Menu_Edit_FindNext() {
  Menu_ZapriVse();
  var ta = aktTA(); if (!ta) return;
  var q = document.getElementById('datVhod').dataset.iskanje; if (!q) return Menu_Edit_Find();
  var pos = ta.value.indexOf(q, (ta.selectionEnd || 0) + 1);
  if (pos < 0) pos = ta.value.indexOf(q, 0);
  if (pos >= 0) { ta.setSelectionRange(pos, pos + q.length); ta.focus(); }
  else obv('Konec - ni več zadetkov.', 'opoz');
}
function Menu_Edit_SelectAll() {
  Menu_ZapriVse();
  var ta = aktTA(); if (!ta) return;
  ta.select(); ta.focus();
}

// ================================================================
// MENU SETTINGS
// ================================================================
function Menu_Settings_Font(ime) {
  nastavitve.pisava = ime;
  var dejanska = (ime === 'Default') ? "'Courier New', Courier, monospace" : ime;
  document.querySelectorAll('.tekst-polje').forEach(function(t) { t.style.fontFamily = dejanska; });
  Menu_Settings_PisavaPosodobi();
  Menu_ZapriVse(); Menu_NastavitveShrani();
}
function Menu_Settings_Size(vel) {
  nastavitve.velikost = vel; Menu_Settings_PisavaPosodobi();
  Menu_ZapriVse(); Menu_NastavitveShrani();
}
function Menu_Settings_PisavaPosodobi() {
  var lineH = Math.round(nastavitve.velikost * 1.4) + 'px';
  var dejanska = (nastavitve.pisava === 'Default') ? "'Courier New', Courier, monospace" : nastavitve.pisava;
  document.documentElement.style.setProperty('--vel-tekst', nastavitve.velikost + 'px');
  document.documentElement.style.setProperty('--visina-vrstice', lineH);
  [0, 1, 2].forEach(function(i) {
    if (!cms[i]) return;
    cms[i].setFontSize(nastavitve.velikost + 'px');
    cms[i].container.style.fontFamily = dejanska;
  });
  [1, 2].forEach(function(i) {
    if (!cms12[i]) return;
    cms12[i].setFontSize(nastavitve.velikost + 'px');
    cms12[i].container.style.fontFamily = dejanska;
  });
  document.querySelectorAll('.tekst-polje').forEach(function(t) {
    t.style.fontFamily = dejanska;
    t.style.fontSize   = nastavitve.velikost + 'px';
    t.style.lineHeight = lineH;
  });
  var pkMap = {'Default': 'pkDF', 'Courier New': 'pkCN', 'Fixedsys': 'pkFS', 'Terminal': 'pkTR'};
  ['pkDF', 'pkCN', 'pkFS', 'pkTR'].forEach(function(id) { var e = document.getElementById(id); if (e) e.textContent = ''; });
  var pk = pkMap[nastavitve.pisava]; var pke = pk ? document.getElementById(pk) : null;
  if (pke) pke.textContent = '•';
  [8, 9, 10, 11, 12, 14, 20].forEach(function(v) { var e = document.getElementById('pv' + v); if (e) e.textContent = (v === nastavitve.velikost ? '•' : ''); });
}
function Menu_Settings_WordWrap() {
  nastavitve.prelomVrstic = !nastavitve.prelomVrstic;
  document.getElementById('mkPrelopVrstic').textContent = nastavitve.prelomVrstic ? '✓' : '';
  [0, 1, 2].forEach(function(i) { if (cms[i]) cms[i].session.setUseWrapMode(nastavitve.prelomVrstic); });
  [1, 2].forEach(function(i) { if (cms12[i]) cms12[i].session.setUseWrapMode(nastavitve.prelomVrstic); });
  Menu_ZapriVse(); Menu_NastavitveShrani();
}
function Menu_Settings_AllowTabs() {
  nastavitve.dovoliZavihke = !nastavitve.dovoliZavihke;
  document.getElementById('mkDovoliZavihke').textContent = nastavitve.dovoliZavihke ? '✓' : '';
  Menu_ZapriVse(); Menu_NastavitveShrani();
}
function Menu_Settings_ShowPlugins() {
  nastavitve.pokaziVticnike = !nastavitve.pokaziVticnike;
  document.getElementById('mkPokaziVt').textContent = nastavitve.pokaziVticnike ? '✓' : '';
  document.getElementById('srednjiPanel').classList.toggle('skrit', !nastavitve.pokaziVticnike);
  Menu_ZapriVse(); Menu_NastavitveShrani();
}

// ================================================================
// MENU HELP
// ================================================================
function Menu_Help_About() {
  Menu_ZapriVse();
  customAbout();
}

// ================================================================
// NASTAVITVE SHRAMBA
// ================================================================
function Menu_NastavitveShrani() {
  try { localStorage.setItem('editor_nas', JSON.stringify(nastavitve)); } catch(e) {}
}
function Menu_NastavitveNalozi() {
  try {
    var s = localStorage.getItem('editor_nas');
    if (s) { var n = JSON.parse(s); for (var k in n) if (n.hasOwnProperty(k)) nastavitve[k] = n[k]; }
  } catch(e) {}
  document.getElementById('mkPokaziVt').textContent     = nastavitve.pokaziVticnike ? '✓' : '';
  document.getElementById('mkPrelopVrstic').textContent = nastavitve.prelomVrstic   ? '✓' : '';
  document.getElementById('mkDovoliZavihke').textContent = nastavitve.dovoliZavihke ? '✓' : '';
  document.getElementById('srednjiPanel').classList.toggle('skrit', !nastavitve.pokaziVticnike);
}
