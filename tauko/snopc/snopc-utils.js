// ==========================================
// ŠNOPC - Utility Functions
// Converted from uUtil.pas and uMixer.pas
// ==========================================

import * as C from './snopc-constants.js';
import { gameData } from './snopc-data.js';

// ==========================================
// CARD UTILITIES
// ==========================================

// Get card ID from color and type
export function get_Karta_Id(p_barva, p_tip) {
    return p_barva * 5 + p_tip;
}

// Get card color/suit
export function get_Barva_Karte(p_karta) {
    if (p_karta === C.C_KARTA_NULL) {
        return C.C_NULL;
    }
    return Math.floor(p_karta / 5);
}

// Get card type
export function get_Tip_Karte(p_karta) {
    return p_karta % 5;
}

// Get card point value
export function get_Vrednost_Karte(p_karta) {
    const l_tip = get_Tip_Karte(p_karta);

    if (l_tip === C.C_TIP_A) return 11;
    if (l_tip === C.C_TIP_10) return 10;
    if (l_tip === C.C_TIP_K) return 4;
    if (l_tip === C.C_TIP_Q) return 3;
    if (l_tip === C.C_TIP_J) return 2;

    return 0;
}

// Get card description
export function get_Opis_Karte_Barva(p_barva) {
    return C.BARVA_IMENA[p_barva] || '';
}

export function get_Opis_Karte_Tip(p_tip) {
    return C.TIP_IMENA[p_tip] || '';
}

export function get_Opis_Karte(p_karta) {
    const barva = get_Opis_Karte_Barva(get_Barva_Karte(p_karta));
    const tip = get_Opis_Karte_Tip(get_Tip_Karte(p_karta));
    return barva + ' ' + tip;
}

// Get game type description
export function get_Opis_Igre(p_igra) {
    if (p_igra === C.C_IGRA_TIP_3) return 'Navadna igra';
    if (p_igra === C.C_IGRA_TIP_6) return 'Šnopc';
    if (p_igra === C.C_IGRA_TIP_9) return 'Beraš';
    if (p_igra === C.C_IGRA_TIP_12) return 'Druhmaraš';
    return p_igra.toString();
}

// ==========================================
// PLAYER UTILITIES
// ==========================================

// Get player name
export function get_Igralec_Ime(p_igralec, p_velika_zacetnica) {
    if (p_velika_zacetnica) {
        return 'Igralec ' + p_igralec + ' (' + gameData.nastavitve.igralec_ime[p_igralec] + ')';
    } else {
        return 'igralec ' + p_igralec + ' (' + gameData.nastavitve.igralec_ime[p_igralec] + ')';
    }
}

// Set next player on turn
export function set_Na_Potezi_Naslednji_Igralec() {
    gameData.igra.igralec_na_potezi = (gameData.igra.igralec_na_potezi + 1) % 4;
    if (gameData.igra.igralec_igra[gameData.igra.igralec_na_potezi] === false) {
        set_Na_Potezi_Naslednji_Igralec();
    }
}

// Get number of cards in specific suit for player
export function get_Igralec_Stevilo_Kart_V_Barvi(p_igralec, p_barva) {
    let l_stevilo_kart = 0;
    for (let k = 0; k < 8; k++) {
        if (gameData.karte_igralec[p_igralec][k] !== C.C_KARTA_NULL) {
            if (get_Barva_Karte(gameData.karte_igralec[p_igralec][k]) === p_barva) {
                l_stevilo_kart++;
            }
        }
    }
    return l_stevilo_kart;
}

// Get index of specific card in player's hand
export function get_Igralec_Index_Karte(p_igralec, p_karta) {
    let l_index = C.C_NULL;
    if (p_karta !== C.C_NULL) {
        for (let k = 0; k < 8; k++) {
            if (gameData.karte_igralec[p_igralec][k] === p_karta) {
                l_index = k;
            }
        }
    }
    return l_index;
}

// Check if player has specific card
export function get_Igralec_Ima_Karto(p_igralec, p_karta) {
    for (let k = 0; k < 8; k++) {
        if (gameData.karte_igralec[p_igralec][k] === p_karta) {
            return true;
        }
    }
    return false;
}

// ==========================================
// TRICK EVALUATION
// ==========================================

// Determine who wins the trick
export function get_Stih_Kdo_Pobere() {
    const l_barva_adut = gameData.rufanje_izbrana_karta.barva;

    let l_pobere = gameData.igra.igralec_zacel_za_stih;
    let l_barva_pobere = get_Barva_Karte(gameData.karte_miza[gameData.igra.igralec_zacel_za_stih]);
    let l_tip_pobere = get_Tip_Karte(gameData.karte_miza[gameData.igra.igralec_zacel_za_stih]);

    for (let i_special = gameData.igra.igralec_na_potezi;
         i_special < gameData.igra.igralec_na_potezi + 4;
         i_special++) {
        const i = i_special % 4;

        if (gameData.igra.igralec_igra[i]) {
            const l_barva_i = get_Barva_Karte(gameData.karte_miza[i]);
            const l_tip_i = get_Tip_Karte(gameData.karte_miza[i]);
            let l_ali_trenutni_pobere = false;

            // Game 3 and 6 - Ace wins (lower type number)
            if (gameData.igra.tip_igre === C.C_IGRA_TIP_3 ||
                gameData.igra.tip_igre === C.C_IGRA_TIP_6) {

                if (l_barva_i === l_barva_pobere) {
                    // Same suit - lower type wins (Ace = 0)
                    if (l_tip_i < l_tip_pobere) {
                        l_ali_trenutni_pobere = true;
                    }
                } else if (l_barva_i === l_barva_adut) {
                    // Trump played
                    if (l_barva_pobere !== l_barva_adut) {
                        // Trump beats non-trump
                        l_ali_trenutni_pobere = true;
                    } else if (l_tip_i < l_tip_pobere) {
                        // Higher trump
                        l_ali_trenutni_pobere = true;
                    }
                }

                if (l_ali_trenutni_pobere) {
                    l_barva_pobere = l_barva_i;
                    l_tip_pobere = l_tip_i;
                    l_pobere = i;
                }
            }
            // Game 9 - Jack wins (higher type number)
            else if (gameData.igra.tip_igre === C.C_IGRA_TIP_9) {
                if (l_barva_i === l_barva_pobere && l_tip_i > l_tip_pobere) {
                    l_barva_pobere = l_barva_i;
                    l_tip_pobere = l_tip_i;
                    l_pobere = i;
                }
            }
            // Game 12 - Ace wins (lower type number)
            else if (gameData.igra.tip_igre === C.C_IGRA_TIP_12) {
                if (l_barva_i === l_barva_pobere && l_tip_i < l_tip_pobere) {
                    l_barva_pobere = l_barva_i;
                    l_tip_pobere = l_tip_i;
                    l_pobere = i;
                }
            }
        }
    }

    return l_pobere;
}

// Count cards in suit that have been played
export function stihi_Zunaj_Stevilo_Karte_V_Barvi(p_barva) {
    let l_stevilo_kart = 0;

    for (let s = 0; s < gameData.stihi.stevilo_stihov; s++) {
        for (let k = 0; k < 4; k++) {
            if (gameData.stihi.stih[s].karte[k] !== C.C_KARTA_NULL) {
                if (get_Barva_Karte(gameData.stihi.stih[s].karte[k]) === p_barva) {
                    l_stevilo_kart++;
                }
            }
        }
    }

    return l_stevilo_kart;
}

// ==========================================
// CARD SHUFFLING (from uMixer.pas)
// ==========================================

/**
 * mixer_Premesaj_Karte
 * ZASTARELA - uporablja se MixerPremesajKarte() iz snopc-mixer.js
 *
 * Če potrebuješ mešanje kart, uporabi:
 * import { MixerPremesajKarte } from './snopc-mixer.js';
 * MixerPremesajKarte(gameData.karte_set);
 *
 * OPOMBA: Ta funkcija je wrapper za kompatibilnost.
 * Originalna Delphi logika je v snopc-mixer.js!
 */
export function mixer_Premesaj_Karte(karte) {
    console.warn('mixer_Premesaj_Karte() je zastarela - uporabi MixerPremesajKarte() iz snopc-mixer.js!');

    // Wrapper - uporablja poenostavljeno logiko
    // Za pravi 1:1 port, uporabi snopc-mixer.js
    const l_karta_razdeljena = new Array(20).fill(false);

    for (let i = 0; i < 20; i++) {
        let l_rnd;
        do {
            l_rnd = Math.floor(Math.random() * 20);
        } while (l_karta_razdeljena[l_rnd] === true);

        l_karta_razdeljena[l_rnd] = true;
        karte[i] = l_rnd;
    }

    gameData.karte_set_pozicija_na_voljo = 0;
    return karte;
}

// ==========================================
// CARD DISPLAY HELPERS
// ==========================================

export function createCardElement(cardId) {
    const div = document.createElement('div');
    div.className = 'card';

    if (cardId === C.C_KARTA_NULL) {
        return div;
    }

    const barva = get_Barva_Karte(cardId);
    const tip = get_Tip_Karte(cardId);
    const color = (barva === C.C_BARVA_S || barva === C.C_BARVA_K) ? 'card-red' : 'card-black';

    div.innerHTML = `
        <div class="card-suit ${color}">${C.BARVA_SYMBOLS[barva]}</div>
        <div class="card-value ${color}">${C.TIP_SYMBOLS[tip]}</div>
    `;

    div.dataset.cardId = cardId;

    return div;
}

export function createCardBack() {
    const div = document.createElement('div');
    div.className = 'card';
    div.innerHTML = '<div class="card-back">?</div>';
    return div;
}

// ==========================================
// ARRAY UTILITIES
// ==========================================

/**
 * Sort_Array
 * Origin: uArray.pas (bubble sort - ascending)
 * Sortira array po vrednostih (ascending)
 *
 * @param {array} p_in_out_a - Array za sortiranje (modificira se!)
 * @param {number} p_in_count - Število elementov za sortiranje
 */
export function Sort_Array(p_in_out_a, p_in_count) {
    for (let i = 0; i < p_in_count - 1; i++) {
        for (let j = i + 1; j < p_in_count; j++) {
            if (p_in_out_a[j] < p_in_out_a[i]) {
                // Swap
                const temp = p_in_out_a[i];
                p_in_out_a[i] = p_in_out_a[j];
                p_in_out_a[j] = temp;
            }
        }
    }
}
