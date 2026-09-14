# Pravilo razvrščanja besed: pogoste vs. redke

Izvorna datoteka `besede5.txt` (12864 petčrkovnih nizov) je razdeljena na dve datoteki:

- **`besede5-pogoste.txt`** — 2911 besed
- **`besede5-redke.txt`** — 9953 besed
- **Skupaj: 12864 besed** (2911 + 9953 = 12864, ujema se z izvirnikom)

## Kriterij

**Strogo knjižno/slovarsko merilo.** Beseda šteje za "pogosto" samo, če je prepoznavna, splošno rabljena beseda standardnega knjižnega slovenskega jezika (kakršno bi našel v SSKJ ali podobnem knjižnem slovarju) — vključno z njenimi rednimi oblikami (sklon, spregatev, končnica ipd.).

Vse ostalo šteje za "redko", konkretno:

- narečne, pogovorne, žargonske besede
- tehnične/strokovne/redke izraze (kemija, biologija, geologija ipd.)
- tujke/izposojenke, še posebej z za slovenščino nenavadnimi črkami (q, w, x, y)
- arhaizme
- medmete in onomatopoije (npr. "bzzzz", "grrrr", "aaajs")
- okrajšave (npr. "akad.", "biol." — s piko na koncu)
- nedokončane fragmente (npr. "bi...", "do...")
- lastna imena (velika začetnica: "Bosna", "Janez")
- popolnoma nesmiselne/izmišljene nize brez pomena

**Pravilo v dvomu:** raje uvrsti besedo med "redke" (strožje merilo, manj besed pristane med "pogostimi").

## Postopek

Klasifikacijo je izvedlo 8 vzporednih agentov, vsak za svoj del seznama (~1600 besed), z lastno jezikovno presojo za vsako besedo posebej — ne mehanski regex postopek. Rezultati so bili združeni in preverjeni proti izvirniku (0 razlik, brez izgub ali podvajanj, razen ene podvojitve "dušen", ki izvira že iz izvorne datoteke).
