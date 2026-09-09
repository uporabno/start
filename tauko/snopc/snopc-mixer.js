// ==========================================
// ŠNOPC - Card Shuffling Module
// Converted from uMixer.pas (1:1 port)
// ==========================================

import { gameData } from './snopc-data.js';

// ==========================================
// MAIN SHUFFLE FUNCTION
// ==========================================

/**
 * MixerPremesajKarte
 * Origin: uMixer.pas lines 21-91
 * Premeša karte v naključnem vrstnem redu
 *
 * @param {array} karte - Array za shranjevanje ID-jev kart (20 elementov, modificira se!)
 *
 * Funkcija:
 * 1. Inicializira tracking array za razdeljene karte
 * 2. Za vsako pozicijo (0-19) izbere naključno karto, ki še ni bila razdeljena
 * 3. Nastavi globalno pozicijo na 0 (za deljenje kart)
 *
 * OPOMBA: V Delphi verziji so zakomentirani ročni setup-i kart za testiranje.
 * Ti so koristni za debugging specifičnih scenarijev.
 */
export function MixerPremesajKarte(karte) {
    const l_karta_razdeljena = new Array(20).fill(false);

    // Premešaj karte
    for (let i = 0; i < 20; i++) {
        let l_rnd;

        // Ponavljaj dokler ne najdeš karte, ki še ni bila razdeljena
        do {
            l_rnd = Math.floor(Math.random() * 1000);
            l_rnd = l_rnd % 20;
        } while (l_karta_razdeljena[l_rnd] === true);

        l_karta_razdeljena[l_rnd] = true;
        karte[i] = l_rnd;
    }

    // Reset pozicije za deljenje kart
    gameData.karte_set_pozicija_na_voljo = 0;

    // ==========================================
    // DEBUG SETUPS (zakomentirano - kot v Delphi)
    // ==========================================

    // Naslednji setups so iz originalne Delphi kode za testiranje specifičnih scenarijev.
    // Odkomentiraj za debugging.

    /*
    // Berač player 2
    karte[0] = 0;  karte[1] = 1;   karte[2] = 3;   karte[12] = 13; karte[13] = 15;
    karte[3] = 4;  karte[4] = 2;   karte[5] = 9;   karte[14] = 6;  karte[15] = 14;
    karte[6] = 5;  karte[7] = 7;   karte[8] = 8;   karte[16] = 16; karte[17] = 17;
    karte[9] = 10; karte[10] = 11; karte[11] = 12; karte[18] = 18; karte[19] = 19;
    */

    /*
    // Klicanje
    karte[0] = 2;  karte[1] = 3;   karte[2] = 7;   karte[12] = 8;  karte[13] = 0;
    karte[3] = 4;  karte[4] = 2;   karte[5] = 1;   karte[14] = 6;  karte[15] = 10;
    karte[6] = 5;  karte[7] = 7;   karte[8] = 8;   karte[16] = 16; karte[17] = 17;
    karte[9] = 10; karte[10] = 11; karte[11] = 12; karte[18] = 18; karte[19] = 19;
    */

    /*
    // Prevzemanje
    karte[0] = 3;  karte[1] = 4;   karte[2] = 14;  karte[12] = 6;  karte[13] = 10;
    karte[3] = 11; karte[4] = 5;   karte[5] = 7;   karte[14] = 18; karte[15] = 19;
    karte[6] = 15; karte[7] = 9;   karte[8] = 1;   karte[16] = 13; karte[17] = 16;
    karte[9] = 2;  karte[10] = 0;  karte[11] = 17; karte[18] = 8;  karte[19] = 12;
    */

    /*
    // Lestvica
    karte[0] = 0;  karte[1] = 1;   karte[2] = 2;   karte[12] = 3;  karte[13] = 4;
    karte[3] = 15; karte[4] = 12;  karte[5] = 9;   karte[14] = 6;  karte[15] = 19;
    karte[6] = 14; karte[7] = 11;  karte[8] = 8;   karte[16] = 16; karte[17] = 5;
    karte[9] = 13; karte[10] = 10; karte[11] = 7;  karte[18] = 17; karte[19] = 18;
    */

    /*
    // Igralec 0 lestvica
    karte[0] = 0;  karte[1] = 1;   karte[2] = 2;   karte[12] = 3;  karte[13] = 4;
    karte[3] = 6;  karte[4] = 11;  karte[5] = 12;  karte[14] = 15; karte[15] = 5;
    karte[6] = 7;  karte[7] = 10;  karte[8] = 13;  karte[16] = 16; karte[17] = 19;
    karte[9] = 8;  karte[10] = 9;  karte[11] = 14; karte[18] = 17; karte[19] = 18;
    */

    /*
    // TODO: 1. uThink.Vrzi_Karto_Igra_9_Na_Karte: točka 7
    karte[0] = 17; karte[1] = 14;  karte[2] = 8;   karte[12] = 9;  karte[13] = 5;
    karte[3] = 3;  karte[4] = 16;  karte[5] = 10;  karte[14] = 15; karte[15] = 12;
    karte[6] = 19; karte[7] = 13;  karte[8] = 1;   karte[16] = 7;  karte[17] = 11;
    karte[9] = 18; karte[10] = 2;  karte[11] = 4;  karte[18] = 6;  karte[19] = 0;
    */

    /*
    // Deadlock - verjetno je rešeno
    // Medo začne
    karte[0] = 5;  karte[1] = 6;   karte[2] = 3;   karte[12] = 17; karte[13] = 10;
    karte[3] = 8;  karte[4] = 19;  karte[5] = 9;   karte[14] = 12; karte[15] = 15;
    karte[6] = 2;  karte[7] = 11;  karte[8] = 13;  karte[16] = 1;  karte[17] = 16;
    karte[9] = 18; karte[10] = 7;  karte[11] = 0;  karte[18] = 4;  karte[19] = 14;
    */

    /*
    // 12, če začne medo
    karte[0] = 4;  karte[1] = 2;   karte[2] = 9;   karte[12] = 6;  karte[13] = 14;
    karte[3] = 0;  karte[4] = 1;   karte[5] = 3;   karte[14] = 10; karte[15] = 15;
    karte[6] = 5;  karte[7] = 7;   karte[8] = 8;   karte[16] = 16; karte[17] = 17;
    karte[9] = 13; karte[10] = 11; karte[11] = 12; karte[18] = 18; karte[19] = 19;
    */
}
