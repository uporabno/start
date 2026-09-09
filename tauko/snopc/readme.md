# 🃏 Šnop'c - Slovenska Kartaška Igra

HTML5/JavaScript konverzija originalne Delphi igre iz 2008-2011.

## 📋 O igri

**Šnop'c** je slovenska varianta Belota, priljubljena kartaška igra za 4 igralce.

### Pravila igre:

#### Osnovno
- **Igralci:** 4 (ti + 3 AI nasprotniki)
- **Karte:** 20 kart (As, 10, K, Q, J v 4 barvah: ♥ Srce, ♠ Pike, ♦ Kare, ♣ Križ)
- **Cilj:** Zbrati 66 točk ali več

#### Vrednosti kart:
- **As:** 11 točk
- **10:** 10 točk
- **Kralj (K):** 4 točke
- **Kraljica (Q):** 3 točke
- **Fant (J):** 2 točki

#### Tipi iger:

1. **Igra 3 (Navadna igra)**
   - Osnovni tip igre
   - Rufa se adut (barva in karta)
   - Igralec lahko zamenja 2 karti s talonom
   - Cilj: zbrati 66 točk
   - Točkovanje glede na nasprotnike:
     - 3 točke: nasprotniki 0 točk
     - 2 točki: nasprotniki 1-32 točk
     - 1 točka: nasprotniki 33+ točk

2. **Igra 6 (Šnop'c)**
   - Rufa se adut
   - Cilj: pobrati vse štihe (do določenega števila)
   - 6 točk za uspeh

3. **Igra 9 (Beraš)**
   - Brez aduta
   - Cilj: NE pobrati nobenega štiha
   - Fant je najmočnejši, As najšibkejši
   - 9 točk za uspeh

4. **Igra 12 (Druhmaraš)**
   - Brez aduta
   - Cilj: pobrati vse štihe
   - As je najmočnejši, Fant najšibkejši
   - 12 točk za uspeh

#### Klicanje (20/40):
- Če imaš Kralja in Kraljico iste barve, lahko "kličeš"
- **20:** K+Q v neadutni barvi
- **40:** K+Q v adutni barvi
- Kličeš tako, da prvič vržeš K ali Q tega para

#### Kontra:
- Nasprotniki lahko podvojijo vrednost igre z "kontra"
- Vse točke se pomnožijo z 2

## 🚀 Kako zagnati

### Standalone verzija
1. Odpri `snopc-standalone.html` v browserju
2. Vse (HTML, CSS, JavaScript) je v eni datoteki
3. Klikni "Nova igra" in uživaj!
4. **Ne potrebuješ lokalnega strežnika** - datoteka deluje direktno

## 📂 Struktura datotek

```
Html/
├── snopc-standalone.html   # Samostojna verzija (VSE v 1 datoteki) - PRIPOROČENO
├── snopc-nve vzdržuj.html  # Alternativna verzija (v vzdrževanju)
├── snopc.css               # Styling in animacije
├── snopc-game.js           # Glavna igralna logika (ES6 module)
├── snopc-constants.js      # Konstante (iz uConst.pas)
├── snopc-data.js           # Podatkovne strukture (iz uData.pas)
├── snopc-utils.js          # Pomožne funkcije (iz uUtil.pas, uMixer.pas)
├── snopc-rules.js          # Pravila igre (iz uRules.pas)
├── snopc-ruf.js            # Rufanje logika (1:1 port iz uRuf.pas)
├── snopc-ai.js             # AI logika (poenostavljena iz uThink.pas)
├── convert_icon.py         # Python skripta za konverzijo ikon
├── extract_icon.py         # Python skripta za ekstrakcijo ikon
├── images/
│   ├── icon/               # Ikona igre (snopc.ico, snopc.png)
│   ├── players/            # Avatarji igralcev (4x .png: bober, pingu, opica, medo)
│   ├── karte/              # Slike kart (21x .png: karta-00 do karta-19 + hrbtna)
│   └── razno/              # Dodatne slike (miza.png, presortiraj.png, puscica*.png, window-*.png)
├── images-bmp/             # BMP verzije slik (za legacy support)
├── sounds/                 # Seznam zvočnih efektov (seznam.txt)
├── __attic___sounds/       # Arhiv: WAV datoteke (16x zvočni efekti)
└── readme.md               # Ta datoteka
```

## 🎮 Kako igrati

### Potek igre:

1. **Nova igra**
   - Klikni "Nova igra"
   - Karte se avtomatsko premešajo in razdelijo
   - Vseh 5 kart se razdeli takoj vsem igralcem

2. **Izbira tipa igre**
   - Vsak igralec po vrsti izbere tip igre (3, 6, 9, 12) ali gre naprej
   - Prvi, ki izbere igro, postane "rufač"
   - AI igralci počakajo na tvojo izbiro

3. **Rufanje aduta** (samo za igre 3 in 6)
   - Rufač izbere adutno barvo in tip karte
   - Primer: "Rufi Srce As" pomeni, da je Srce adut
   - Izbira se izvede v dveh korakih: barva, potem tip karte

4. **Igranje**
   - Igralec na vrsti vrže karto
   - Ostali morajo slediti barvi, če imajo
   - Če nimajo barve, morajo dati adut (samo igre 3/6)
   - Najmočnejša karta pobere štih
   - Klicanje 20/40 se sproži avtomatsko

5. **Konec igre**
   - Igra se konča, ko ena stran doseže 66 točk
   - Ali ko zmanjka kart
   - Prikaže se zmagovalec in osvojene točke

### Pravila za igranje kart:

#### Igre 3 in 6:
- **Moraš slediti barvi** prve karte, če imaš
- Če nimaš barve, **moraš dati adut**, če imaš
- Moraš "prevzeti" (dati močnejšo karto), če lahko
- As je najmočnejši, Fant najšibkejši

#### Igra 9 (Beraš):
- Moraš slediti barvi
- Cilj je NE pobrati nobenega štiha
- Fant je najmočnejši (slaba karta tukaj!)

#### Igra 12 (Druhmaraš):
- Moraš slediti barvi
- Cilj je pobrati VSE štihe
- As je najmočnejši (dobra karta tukaj!)

## 🤖 AI nasprotniki

Igra ima 3 AI igralce z različnimi nivoji tveganja:

- **Nizko tveganje (1):** Konzervativno igra, izogiba se težkim igram
- **Srednje tveganje (2):** Uravnoteženo igra (privzeto)
- **Visoko tveganje (3):** Agresivno igra, pogosto izbere težje igre

AI uporablja naslednje strategije:
- Analiza kart za izbiro tipa igre
- Rufanje aduta glede na najdaljšo barvo in močne karte
- Zamenjava talona za izboljšanje roke
- Igranje kart z upoštevanjem pravil in strategije

## 🔧 Tehnične podrobnosti

### Iz Delphi v HTML5/JavaScript

| Delphi komponenta | HTML/JS ekvivalent |
|-------------------|-------------------|
| `uConst.pas` | `snopc-constants.js` |
| `uData.pas` | `snopc-data.js` |
| `uUtil.pas` | `snopc-utils.js` |
| `uMixer.pas` | `snopc-utils.js` (shuffling) |
| `uRules.pas` | `snopc-rules.js` |
| `uRuf.pas` | `snopc-ruf.js` (1:1 port) |
| `uBoard.pas` | `snopc-game.js` (board logic) |
| `uBoardFunc.pas` | `snopc-game.js` (functions) |
| `uThink.pas` | `snopc-ai.js` (poenostavljeno) |
| `uTalon.pas` | `snopc-game.js` (talon točkovanje) |
| TForm | `SnopecGame` class |
| TTimer | `setTimeout()` / `setInterval()` |
| TImage | `<div class="card">` |

### Glavne funkcije:

**uData.pas → snopc-data.js**
- `Data_Karte_Igralcev_Reset` → `data_Karte_Igralcev_Reset()`
- `Data_Stihi_Igralcev_Reset` → `data_Stihi_Igralcev_Reset()`
- `Get_Igralec_Stevilo_Kart` → `get_Igralec_Stevilo_Kart()`

**uUtil.pas → snopc-utils.js**
- `Get_Barva_Karte` → `get_Barva_Karte()`
- `Get_Tip_Karte` → `get_Tip_Karte()`
- `Get_Vrednost_Karte` → `get_Vrednost_Karte()`
- `Get_Stih_Kdo_Pobere` → `get_Stih_Kdo_Pobere()`

**uMixer.pas → snopc-utils.js**
- `MixerPremesajKarte` → `mixer_Premesaj_Karte()`

**uRules.pas → snopc-rules.js**
- `Met_Karte_Dovoljen` → `met_Karte_Dovoljen()`

**uBoard.pas → snopc-game.js**
- `FormCreate` → `init()` + `novaIgra()`
- `Card_Click` → `handleCardPlay()`

**uBoardFunc.pas → snopc-game.js**
- `Board_Obdelaj_Skupine` → `board_Obdelaj_Skupine()`
- `Board_Obdelaj_Klic` → `board_Obdelaj_Klic()`
- `Board_Obdelaj_Stih` → `board_Obdelaj_Stih()`
- `Board_Obdelaj_Igro` → `board_Obdelaj_Igro()`

**uThink.pas → snopc-ai.js**
- `Izberi_Igro` → `Izberi_Igro()`
- `Vrzi_Karto` → `Vrzi_Karto()`
- `izberi_Kontra` → `izberi_Kontra()` (nova funkcionalnost)
- `zamenjaj_Talon` → `zamenjaj_Talon()` (nova funkcionalnost)

**uRuf.pas → snopc-ruf.js**
- `Ruf` → `Ruf()` (1:1 port)

**uTalon.pas → snopc-game.js**
- `BitBtnIgraZamenjajTalonClick` → `performTalonExchange()` (z točkovanjem A/10)

## 🎯 Features

✅ Identična logika kot original
✅ 4 igralci (1 človek + 3 AI)
✅ Vsi 4 tipi iger (3, 6, 9, 12)
✅ Rufanje aduta
✅ Zamenjava talona (z točkovanjem nasprotne ekipe za A/10)
✅ Klicanje 20/40 (vključno s KLIC_ZAPRTI)
✅ Kontra
✅ Pravilna validacija potez
✅ AI nasprotniki
✅ Brojač točk in štihov
✅ Dnevnik igre (log) z welcome sporočilom
✅ Animirani indikatorji
✅ Prilagodljiv zaslon (gumbi za normalno velikost / prilagajanje)
✅ ES6 moduli
✅ Zvočni efekti (16 WAV datotek v arhivu)
✅ Standalone verzija (vse v 1 datoteki - **PRIPOROČENO**)
✅ Vizitka & Pomoč modali
✅ Prikaz imen igralcev nad avatarji
✅ Dinamični win modal z obrazi zmagovalcev

## 🐛 Znane omejitve

- AI je poenostavljena verzija originala (79KB uThink.pas → krajša logika)
- Ni multiplayer moda preko mreže
- Ni točkovanja turnirja (lahko se doda)

## 📊 Primerjava z originalom

### Implementirano:
- ✅ Vsa pravila igre
- ✅ Vse 4 tipe iger
- ✅ Rufanje, talon, klicanje
- ✅ AI nasprotniki (poenostavljeno)
- ✅ Validacija potez
- ✅ Točkovanje
- ✅ Zvočni efekti

### Poenostavljeno:
- ⚠️ AI logika (osnovna strategija namesto kompleksne analize)
- ⚠️ Brez turnirskega načina

### Ni implementirano:
- ❌ Multiplayer preko mreže
- ❌ Shranjevanje statistike
- ❌ Različni AI profili

## 🎨 Prilagajanje

### Sprememba AI težavnosti:

V `snopc-data.js` spremeni:

```javascript
igralec_tveganje: [
    C.C_TVEGANJE_SREDNJE,  // Igralec 0 (ti)
    C.C_TVEGANJE_NIZKO,    // Igralec 1 (levo) - enostavnejši
    C.C_TVEGANJE_SREDNJE,  // Igralec 2 (nasproti)
    C.C_TVEGANJE_VISOKO    // Igralec 3 (desno) - težji
]
```

### Sprememba imen igralcev:

```javascript
igralec_ime: ['Bober', 'Pingu', 'Opica', 'Medo']  // Privzeto
// Lahko spremeniš v:
igralec_ime: ['Jaz', 'Ana', 'Marko', 'Luka']
```

### Sprememba hitrosti AI:

V `snopc-game.js` konstruktorju:

```javascript
this.gameSpeed = 1000; // ms - počasneje: 2000, hitreje: 500
```

## 🐍 Python skripte za pripravo grafike

### extract_icon.py
Ekstrahira ikone iz Delphi .dfm datotek (Glyph.Data hex format) in jih pretvori v slike:
1. Prebere hex podatke iz Delphi forme
2. Pretvori v BMP format
3. Pretvori v PNG s prozornostjo (magenta #FF00FF → transparent)

```bash
python extract_icon.py
# Output: images/icon/presortiraj.bmp, images/icon/presortiraj.png
```

### convert_icon.py
Pretvori BMP slike v PNG s prozornostjo:
- Uporabi PIL/Pillow za konverzijo
- Magenta (#FF00FF) se pretvori v prozorno barvo

```bash
pip install Pillow
python convert_icon.py
# Output: images/icon/presortiraj.png
```

**Namen:** Ti skripti so bili uporabljeni za ekstrakcijo grafičnih elementov iz originalne Delphi aplikacije (`.dfm` datoteke) in konverzijo v PNG format za uporabo v HTML5 verziji.

## 💻 Browser kompatibilnost

- ✅ Chrome/Edge 90+
- ✅ Firefox 88+
- ✅ Safari 14+
- ✅ Opera 76+

**Zahteve:**
- ES6 modules support
- CSS Grid and Flexbox
- Modern JavaScript (class, arrow functions, etc.)

## 📝 Changelog

### v1.4 (2025-12-06)
- ✅ **KLIC_ZAPRTI handling:** Dodana manjkajoča funkcionalnost iz Delphi - točkovanje nasprotne ekipe za A/10 v talonu
- ✅ **Talon točkovanje:** Pri zamenjavi talona nasprotna ekipa dobi +10 točk za vsak As ali 10 v talonu
- ✅ **Popravljena struktura modalov:** Win overlay pravilno ločen od končaj igro modala
- ✅ **Slike igralcev:** Popravljene poti do avatarjev (images/players/)
- ✅ **Dinamični zmagovalci:** Pravilna slovnica - "Zmagovalec:", "Zmagovalca:", "Zmagovalci:"
- ✅ **Vizualne spremembe:**
  - Miza.png namesto rjavega kroga (okrogla oblika)
  - Copyright text v controls-desno: "Copyright © 2008-2025 Tauko"
  - Gumbi za normalno velikost in prilagajanje ekranu
  - Imena igralcev prikazana nad slikami (temno vijolična barva)
  - Igralec 0 preimenovan iz "Krtko" v "Bober"
- ✅ **Welcome message:** Dodan uvodni pozdrav v log (naslov, copyright, email, "Igra s kartami")
- ✅ **Privzete nastavitve:** Hitrost 1.0s, zvok SI
- ✅ **Win panel:** Izboljšan prikaz zmagovalcev s slikami in imeni
- ✅ **Odstranjena neuporabljena funkcija:** izberi_Adut() (zamenjana z Ruf())

### v1.3 (2025-12-05)
- ✅ **Fixed layout:** Game board in vsi elementi obdržijo fiksno velikost
- ✅ Če je okno manjše od minimalne širine (1330px za standalone, 920px za osnovno verzijo), se prikaže scroll
- ✅ Odstranjeni responsive media queries (ne more več do scaling-a)
- ✅ Posodobljeno: `snopc.css`, `snopc-standalone.html`, `snopc-nve vzdržuj.html`

### v1.2 (2025-11-29)
- ✅ Poenostavljena struktura: odstranjena modularna verzija (`snopc.html`)
- ✅ Dodana alternativna verzija (`snopc-nve vzdržuj.html`)
- ✅ Reorganizacija zvočnih efektov (WAV datoteke v arhiv `__attic___sounds/`)
- ✅ Dodani Python skripti za konverzijo grafike (`extract_icon.py`, `convert_icon.py`)
- ✅ Dodana mapa `images/razno/` za dodatne grafične elemente
- ✅ Posodobljena dokumentacija (README.md)
- ✅ Dodana mapa `images-bmp/` za BMP verzije slik

### v1.1 (2025-11-16)
- ✅ Dodani zvočni efekti (16 WAV datotek)
- ✅ Standalone verzija (snopc-standalone.html)
- ✅ Organizirana struktura folderjev (images/, sounds/)
- ✅ Vizitka & Pomoč modali
- ✅ Popravljena sekvenca igre (vse karte se razdelijo takoj)
- ✅ Izboljšan UI (gumbi, barve, animacije)
- ✅ Debug log sistem

### v1.0 (2025-11-15)
- ✅ Popolna HTML5/JavaScript konverzija
- ✅ Vsa pravila implementirana
- ✅ AI nasprotniki
- ✅ Moderna UI/UX
- ✅ Responsive design
- ✅ ES6 modularni sistem

## 👨‍💻 Avtor

**Originalna Delphi verzija:** 2008-2025 Tauko
**HTML5/JavaScript Port:** 2025
**Tehnologije:** HTML5, CSS3, JavaScript ES6 (Vanilla)
**Kontakt:** slavko.mervar@gmail.com

## 📜 License

Free to use and modify.

---

**Srečno pri igri!** 🎉

## 🆘 Pomoč in nasveti

### Če igra ne deluje:
1. Preveri, da uporabljaš sodoben browser
2. Odpri Developer Console (F12) za napake
3. **Priporočeno:** Uporabi standalone verzijo (`snopc-standalone.html`) - ne potrebuje lokalnega strežnika
4. Preveri, da je JavaScript omogočen

### Če AI ne igra:
- Preveri console za napake
- AI uporablja `setTimeout()` za delay - počakaj ~1 sekundo med potezami

### Zvočni efekti:
- **Opomba:** Zvočni efekti (WAV datoteke) so zaenkrat v arhivu (`__attic___sounds/`)
- Seznam vseh 16 zvočnih efektov je na voljo v `sounds/seznam.txt`
- Datoteke vključujejo: mešanje kart, met karte, klicanje 20/40, izbira igre, zmaga/neuspeh, itd.

### Če ne razumeš pravil:
- Klikni "Pomoč" v igri za podrobna pravila
- Klikni "Vizitka" za informacije o igri
- Dnevnik igre (log) prikazuje vse poteze
- Označi "Debug" za dodatne informacije

## 🔮 Prihodnje izboljšave

Možne razširitve:
- [ ] Animacije kart
- [ ] Turnirski način
- [ ] Statistika iger
- [ ] Shranjevanje napredka
- [ ] Multiplayer preko WebSocket
- [ ] Izboljšan AI (kompleksnejša strategija)
- [ ] Mobile aplikacija (PWA)
- [ ] Različne teme kart

---

**Uživajte v Šnop'cu!** 🃏
