// ==========================================
// ŠNOPC - AI Logic (Complete 1:1 port from uThink.pas)
// Original: E:\Claude\Karte\Delphi\uThink.pas (1757 lines)
// Converted: 2025-12-05
// ==========================================

import * as C from './snopc-constants.js';
import { gameData } from './snopc-data.js';
import * as utils from './snopc-utils.js';

// ==========================================
// HELPER FUNCTIONS - Card Analysis
// ==========================================

/**
 * Get_Ali_Igralec_Lahko_Klice_V_Barvi
 * Origin: uThink.pas lines 37-56
 * Preveri ali lahko igralec kliče v določeni barvi (potrebuje K in Q)
 */
function Get_Ali_Igralec_Lahko_Klice_V_Barvi(p_igralec, p_barva) {
    let l_ima_K = false;
    let l_ima_Q = false;

    for (let k = 0; k < 8; k++) {
        if ((gameData.karte_igralec[p_igralec][k] !== C.C_KARTA_NULL) &&
            (utils.get_Barva_Karte(gameData.karte_igralec[p_igralec][k]) === p_barva)) {
            if (utils.get_Tip_Karte(gameData.karte_igralec[p_igralec][k]) === C.C_TIP_K) l_ima_K = true;
            if (utils.get_Tip_Karte(gameData.karte_igralec[p_igralec][k]) === C.C_TIP_Q) l_ima_Q = true;
        }
    }

    if ((l_ima_K === true) && (l_ima_Q === true))
        return true;
    else
        return false;
}

/**
 * Get_Igralec_Min_Karta_V_Barvi
 * Origin: uThink.pas lines 60-77
 * Vrne NAJMANJŠO (najvišje vrednost) karto v določeni barvi
 * OPOMBA: Ime je misleading - funkcija vrne MAX vrednost karte (lowest rank: J > Q > K > 10 > A)
 */
function Get_Igralec_Min_Karta_V_Barvi(p_igralec, p_barva) {
    let l_min_karta = C.C_NULL;

    for (let k = 0; k < 8; k++) {
        if ((gameData.karte_igralec[p_igralec][k] !== C.C_KARTA_NULL) &&
            (utils.get_Barva_Karte(gameData.karte_igralec[p_igralec][k]) === p_barva)) {
            if ((l_min_karta === C.C_NULL) ||
                (l_min_karta < gameData.karte_igralec[p_igralec][k])) {
                l_min_karta = gameData.karte_igralec[p_igralec][k];
            }
        }
    }

    return l_min_karta;
}

/**
 * Get_Igralec_Max_Karta_V_Barvi
 * Origin: uThink.pas lines 81-98
 * Vrne NAJVEČJO (najnižja vrednost) karto v določeni barvi
 * OPOMBA: Ime je misleading - funkcija vrne MIN vrednost karte (highest rank: A < 10 < K < Q < J)
 */
function Get_Igralec_Max_Karta_V_Barvi(p_igralec, p_barva) {
    let l_max_karta = C.C_NULL;

    for (let k = 0; k < 8; k++) {
        if ((gameData.karte_igralec[p_igralec][k] !== C.C_KARTA_NULL) &&
            (utils.get_Barva_Karte(gameData.karte_igralec[p_igralec][k]) === p_barva)) {
            if ((l_max_karta === C.C_NULL) ||
                (l_max_karta > gameData.karte_igralec[p_igralec][k])) {
                l_max_karta = gameData.karte_igralec[p_igralec][k];
            }
        }
    }

    return l_max_karta;
}

/**
 * Get_Stopnja_Tveganja_Za_Barvo_Igra_9
 * Origin: uThink.pas lines 102-162
 * Izračuna stopnjo tveganja za barvo v igri 9 (0=najboljše, 5=najslabše)
 */
function Get_Stopnja_Tveganja_Za_Barvo_Igra_9(p_in_karte, p_in_barva) {
    const l_ima_tip = [false, false, false, false, false];
    let l_stevilo_kart = 0;
    let l_stevec_prvega_presledka = C.C_NULL;
    let l_stevec_prve_karte_po_presledku = C.C_NULL;

    // Preveri katere karte ima v tej barvi
    for (let k = 0; k < 20; k++) {
        if (p_in_karte[k] !== C.C_NULL) {
            if (utils.get_Barva_Karte(p_in_karte[k]) === p_in_barva) {
                l_ima_tip[utils.get_Tip_Karte(p_in_karte[k])] = true;
                l_stevilo_kart++;
            }
        }
    }

    if (l_stevilo_kart === 0) return C.C_NULL;

    // Igra 9: preverjamo od J (4) navzdol do A (0)
    for (let t = 0; t < 5; t++) {
        if ((l_ima_tip[4 - t] === false) && (l_stevec_prvega_presledka === C.C_NULL)) {
            l_stevec_prvega_presledka = t;
        }
        if ((l_ima_tip[4 - t] === true) && (l_stevec_prvega_presledka !== C.C_NULL) && (l_stevec_prve_karte_po_presledku === C.C_NULL)) {
            l_stevec_prve_karte_po_presledku = t;
        }
    }

    // Izračun stopnje tveganja
    if (l_stevec_prvega_presledka === 0) {
        return 5; // Manjka najmočnejša karta (J)
    }
    if (l_stevec_prve_karte_po_presledku === C.C_NULL) {
        return 0; // Ni presledkov
    }
    if (l_stevec_prvega_presledka >= 2) {
        return 0; // Ima dobre karte
    }

    return 5 - l_stevilo_kart - l_stevec_prvega_presledka + (l_stevec_prve_karte_po_presledku - l_stevec_prvega_presledka - 1);
}

/**
 * Get_Stopnja_Tveganja_Za_Barvo_Igra_12
 * Origin: uThink.pas lines 166-226
 * Izračuna stopnjo tveganja za barvo v igri 12 (0=najboljše, 5=najslabše)
 */
function Get_Stopnja_Tveganja_Za_Barvo_Igra_12(p_in_karte, p_in_barva) {
    const l_ima_tip = [false, false, false, false, false];
    let l_stevilo_kart = 0;
    let l_stevec_prvega_presledka = C.C_NULL;
    let l_stevec_prve_karte_po_presledku = C.C_NULL;

    // Preveri katere karte ima v tej barvi
    for (let k = 0; k < 20; k++) {
        if (p_in_karte[k] !== C.C_NULL) {
            if (utils.get_Barva_Karte(p_in_karte[k]) === p_in_barva) {
                l_ima_tip[utils.get_Tip_Karte(p_in_karte[k])] = true;
                l_stevilo_kart++;
            }
        }
    }

    if (l_stevilo_kart === 0) return C.C_NULL;

    // Igra 12: preverjamo od A (0) navzgor do J (4)
    for (let t = 0; t < 5; t++) {
        if ((l_ima_tip[t] === false) && (l_stevec_prvega_presledka === C.C_NULL)) {
            l_stevec_prvega_presledka = t;
        }
        if ((l_ima_tip[t] === true) && (l_stevec_prvega_presledka !== C.C_NULL) && (l_stevec_prve_karte_po_presledku === C.C_NULL)) {
            l_stevec_prve_karte_po_presledku = t;
        }
    }

    // Izračun stopnje tveganja
    if (l_stevec_prvega_presledka === 0) {
        return 5; // Manjka najmočnejša karta (A)
    }
    if (l_stevec_prve_karte_po_presledku === C.C_NULL) {
        return 0; // Ni presledkov
    }
    if (l_stevec_prvega_presledka >= 2) {
        return 0; // Ima dobre karte
    }

    return 5 - l_stevilo_kart - l_stevec_prvega_presledka + (l_stevec_prve_karte_po_presledku - l_stevec_prvega_presledka - 1);
}

// ==========================================
// GAME SELECTION FUNCTIONS
// ==========================================

/**
 * Izberi_Igro_Mogoce_12
 * Origin: uThink.pas lines 230-289
 * Preveri ali je igra 12 možna glede na karte in tveganje
 */
function Izberi_Igro_Mogoce_12(p_igralec) {
    let l_karte = [];
    let l_stopnja_tveganja_za_barvo = [C.C_NULL, C.C_NULL, C.C_NULL, C.C_NULL];
    let l_max_stopnja = C.C_NULL_MAX;

    // Zberi vse karte igralca
    for (let k = 0; k < 8; k++) {
        l_karte[k] = gameData.karte_igralec[p_igralec][k];
    }
    for (let k = 8; k < 20; k++) {
        l_karte[k] = C.C_NULL;
    }

    // Izračunaj stopnjo tveganja za vse barve
    for (let b = 0; b < 4; b++) {
        l_stopnja_tveganja_za_barvo[b] = Get_Stopnja_Tveganja_Za_Barvo_Igra_12(l_karte, b);
        if ((l_stopnja_tveganja_za_barvo[b] !== C.C_NULL) && (l_stopnja_tveganja_za_barvo[b] < l_max_stopnja)) {
            l_max_stopnja = l_stopnja_tveganja_za_barvo[b];
        }
    }

    // Preveri ali je kakšna barva primerna
    if (l_max_stopnja === C.C_NULL_MAX) {
        return false; // Nima nobene barve
    }

    // Preveri ali je tveganje sprejemljivo
    if (gameData.nastavitve.igralec_tveganje[p_igralec] >= l_max_stopnja) {
        return true;
    }

    return false;
}

/**
 * Izberi_Igro_Mogoce_9
 * Origin: uThink.pas lines 293-352
 * Preveri ali je igra 9 možna glede na karte in tveganje
 */
function Izberi_Igro_Mogoce_9(p_igralec) {
    let l_karte = [];
    let l_stopnja_tveganja_za_barvo = [C.C_NULL, C.C_NULL, C.C_NULL, C.C_NULL];
    let l_max_stopnja = C.C_NULL_MAX;

    // Zberi vse karte igralca
    for (let k = 0; k < 8; k++) {
        l_karte[k] = gameData.karte_igralec[p_igralec][k];
    }
    for (let k = 8; k < 20; k++) {
        l_karte[k] = C.C_NULL;
    }

    // Izračunaj stopnjo tveganja za vse barve
    for (let b = 0; b < 4; b++) {
        l_stopnja_tveganja_za_barvo[b] = Get_Stopnja_Tveganja_Za_Barvo_Igra_9(l_karte, b);
        if ((l_stopnja_tveganja_za_barvo[b] !== C.C_NULL) && (l_stopnja_tveganja_za_barvo[b] < l_max_stopnja)) {
            l_max_stopnja = l_stopnja_tveganja_za_barvo[b];
        }
    }

    // Preveri ali je kakšna barva primerna
    if (l_max_stopnja === C.C_NULL_MAX) {
        return false; // Nima nobene barve
    }

    // Preveri ali je tveganje sprejemljivo
    if (gameData.nastavitve.igralec_tveganje[p_igralec] >= l_max_stopnja) {
        return true;
    }

    return false;
}

/**
 * Izberi_Igro_Mogoce_6
 * Origin: uThink.pas lines 356-560
 * Preveri ali je igra 6 možna glede na karte (za rufanje)
 * Analizira različne kombinacije kart glede na rufano karto
 */
function Izberi_Igro_Mogoce_6(p_igralec) {
    let l_stopnja_tveganja = C.C_NULL_MAX;
    let l_kombinacija = '';
    const l_tip_aduta = gameData.rufanje_izbrana_karta.tip;
    const l_barva_aduta = gameData.rufanje_izbrana_karta.barva;

    // Določi barve neadutov
    let l_barva_neaduta1 = 0;
    let l_barva_neaduta2 = 1;
    let l_barva_neaduta3 = 2;
    if (l_barva_aduta === l_barva_neaduta1) l_barva_neaduta1 = 3;
    if (l_barva_aduta === l_barva_neaduta2) l_barva_neaduta2 = 3;
    if (l_barva_aduta === l_barva_neaduta3) l_barva_neaduta3 = 3;

    if (gameData.igra.stevilo_igralcev === 4) {
        //
        // 4 igralci (3 štihi)
        //

        // A 10 K Q
        if ((utils.get_Igralec_Ima_Karto(p_igralec, utils.get_Karta_Id(l_barva_aduta, C.C_TIP_A)) === true) &&
            (utils.get_Igralec_Ima_Karto(p_igralec, utils.get_Karta_Id(l_barva_aduta, C.C_TIP_10)) === true) &&
            (utils.get_Igralec_Ima_Karto(p_igralec, utils.get_Karta_Id(l_barva_aduta, C.C_TIP_K)) === true) &&
            (utils.get_Igralec_Ima_Karto(p_igralec, utils.get_Karta_Id(l_barva_aduta, C.C_TIP_Q)) === true)
        ) {
            l_stopnja_tveganja = 0;
            l_kombinacija = '4-010';
        }

        // A K Q J
        else if ((utils.get_Igralec_Ima_Karto(p_igralec, utils.get_Karta_Id(l_barva_aduta, C.C_TIP_A)) === true) &&
            (utils.get_Igralec_Ima_Karto(p_igralec, utils.get_Karta_Id(l_barva_aduta, C.C_TIP_K)) === true) &&
            (utils.get_Igralec_Ima_Karto(p_igralec, utils.get_Karta_Id(l_barva_aduta, C.C_TIP_Q)) === true) &&
            (utils.get_Igralec_Ima_Karto(p_igralec, utils.get_Karta_Id(l_barva_aduta, C.C_TIP_J)) === true)
        ) {
            l_stopnja_tveganja = 0;
            l_kombinacija = '4-020';
        }

        // A K Q + adut je 10
        else if ((utils.get_Igralec_Ima_Karto(p_igralec, utils.get_Karta_Id(l_barva_aduta, C.C_TIP_A)) === true) &&
            (utils.get_Igralec_Ima_Karto(p_igralec, utils.get_Karta_Id(l_barva_aduta, C.C_TIP_K)) === true) &&
            (utils.get_Igralec_Ima_Karto(p_igralec, utils.get_Karta_Id(l_barva_aduta, C.C_TIP_Q)) === true) &&
            (l_tip_aduta === C.C_TIP_10)
        ) {
            l_stopnja_tveganja = 0;
            l_kombinacija = '4-030';
        }

        // A 10 K + klic 20
        else if ((utils.get_Igralec_Ima_Karto(p_igralec, utils.get_Karta_Id(l_barva_aduta, C.C_TIP_A)) === true) &&
            (utils.get_Igralec_Ima_Karto(p_igralec, utils.get_Karta_Id(l_barva_aduta, C.C_TIP_10)) === true) &&
            (utils.get_Igralec_Ima_Karto(p_igralec, utils.get_Karta_Id(l_barva_aduta, C.C_TIP_K)) === true) &&
            (((utils.get_Igralec_Ima_Karto(p_igralec, utils.get_Karta_Id(l_barva_neaduta1, C.C_TIP_K)) === true) &&
              (utils.get_Igralec_Ima_Karto(p_igralec, utils.get_Karta_Id(l_barva_neaduta1, C.C_TIP_Q)) === true)) ||
             ((utils.get_Igralec_Ima_Karto(p_igralec, utils.get_Karta_Id(l_barva_neaduta2, C.C_TIP_K)) === true) &&
              (utils.get_Igralec_Ima_Karto(p_igralec, utils.get_Karta_Id(l_barva_neaduta2, C.C_TIP_Q)) === true)) ||
             ((utils.get_Igralec_Ima_Karto(p_igralec, utils.get_Karta_Id(l_barva_neaduta3, C.C_TIP_K)) === true) &&
              (utils.get_Igralec_Ima_Karto(p_igralec, utils.get_Karta_Id(l_barva_neaduta3, C.C_TIP_Q)) === true)))
        ) {
            l_stopnja_tveganja = 2;
            l_kombinacija = '4-210';
        }

        // 10 K Q + adut je A
        else if ((utils.get_Igralec_Ima_Karto(p_igralec, utils.get_Karta_Id(l_barva_aduta, C.C_TIP_10)) === true) &&
            (utils.get_Igralec_Ima_Karto(p_igralec, utils.get_Karta_Id(l_barva_aduta, C.C_TIP_K)) === true) &&
            (utils.get_Igralec_Ima_Karto(p_igralec, utils.get_Karta_Id(l_barva_aduta, C.C_TIP_Q)) === true) &&
            (l_tip_aduta === C.C_TIP_A)
        ) {
            l_stopnja_tveganja = 2;
            l_kombinacija = '4-220';
        }

        // A K Q
        else if ((utils.get_Igralec_Ima_Karto(p_igralec, utils.get_Karta_Id(l_barva_aduta, C.C_TIP_A)) === true) &&
            (utils.get_Igralec_Ima_Karto(p_igralec, utils.get_Karta_Id(l_barva_aduta, C.C_TIP_K)) === true) &&
            (utils.get_Igralec_Ima_Karto(p_igralec, utils.get_Karta_Id(l_barva_aduta, C.C_TIP_Q)) === true)
        ) {
            l_stopnja_tveganja = 3;
            l_kombinacija = '4-310';
        }

        // A 10 (K or Q or J) + A
        else if ((utils.get_Igralec_Ima_Karto(p_igralec, utils.get_Karta_Id(l_barva_aduta, C.C_TIP_A)) === true) &&
            (utils.get_Igralec_Ima_Karto(p_igralec, utils.get_Karta_Id(l_barva_aduta, C.C_TIP_10)) === true) &&
            ((utils.get_Igralec_Ima_Karto(p_igralec, utils.get_Karta_Id(l_barva_aduta, C.C_TIP_K)) === true) ||
             (utils.get_Igralec_Ima_Karto(p_igralec, utils.get_Karta_Id(l_barva_aduta, C.C_TIP_Q)) === true) ||
             (utils.get_Igralec_Ima_Karto(p_igralec, utils.get_Karta_Id(l_barva_aduta, C.C_TIP_J)) === true)) &&
            ((utils.get_Igralec_Ima_Karto(p_igralec, utils.get_Karta_Id(l_barva_neaduta1, C.C_TIP_A)) === true) ||
             (utils.get_Igralec_Ima_Karto(p_igralec, utils.get_Karta_Id(l_barva_neaduta2, C.C_TIP_A)) === true) ||
             (utils.get_Igralec_Ima_Karto(p_igralec, utils.get_Karta_Id(l_barva_neaduta3, C.C_TIP_A)) === true))
        ) {
            l_stopnja_tveganja = 3;
            l_kombinacija = '4-320';
        }

    } else {
        //
        // 3 igralci ali 2 igralca (4 štihi)
        //

        // A 10 K Q
        if ((utils.get_Igralec_Ima_Karto(p_igralec, utils.get_Karta_Id(l_barva_aduta, C.C_TIP_A)) === true) &&
            (utils.get_Igralec_Ima_Karto(p_igralec, utils.get_Karta_Id(l_barva_aduta, C.C_TIP_10)) === true) &&
            (utils.get_Igralec_Ima_Karto(p_igralec, utils.get_Karta_Id(l_barva_aduta, C.C_TIP_K)) === true) &&
            (utils.get_Igralec_Ima_Karto(p_igralec, utils.get_Karta_Id(l_barva_aduta, C.C_TIP_Q)) === true)
        ) {
            l_stopnja_tveganja = 0;
            l_kombinacija = '3-010';
        }

        // A K Q J
        else if ((utils.get_Igralec_Ima_Karto(p_igralec, utils.get_Karta_Id(l_barva_aduta, C.C_TIP_A)) === true) &&
            (utils.get_Igralec_Ima_Karto(p_igralec, utils.get_Karta_Id(l_barva_aduta, C.C_TIP_K)) === true) &&
            (utils.get_Igralec_Ima_Karto(p_igralec, utils.get_Karta_Id(l_barva_aduta, C.C_TIP_Q)) === true) &&
            (utils.get_Igralec_Ima_Karto(p_igralec, utils.get_Karta_Id(l_barva_aduta, C.C_TIP_J)) === true)
        ) {
            l_stopnja_tveganja = 0;
            l_kombinacija = '3-020';
        }

        // A 10 + A + 20
        else if ((utils.get_Igralec_Ima_Karto(p_igralec, utils.get_Karta_Id(l_barva_aduta, C.C_TIP_A)) === true) &&
            (utils.get_Igralec_Ima_Karto(p_igralec, utils.get_Karta_Id(l_barva_aduta, C.C_TIP_10)) === true) &&
            ((utils.get_Igralec_Ima_Karto(p_igralec, utils.get_Karta_Id(l_barva_neaduta1, C.C_TIP_A)) === true) ||
             (utils.get_Igralec_Ima_Karto(p_igralec, utils.get_Karta_Id(l_barva_neaduta2, C.C_TIP_A)) === true) ||
             (utils.get_Igralec_Ima_Karto(p_igralec, utils.get_Karta_Id(l_barva_neaduta3, C.C_TIP_A)) === true)) &&
            (((utils.get_Igralec_Ima_Karto(p_igralec, utils.get_Karta_Id(l_barva_neaduta1, C.C_TIP_K)) === true) &&
              (utils.get_Igralec_Ima_Karto(p_igralec, utils.get_Karta_Id(l_barva_neaduta1, C.C_TIP_Q)) === true)) ||
             ((utils.get_Igralec_Ima_Karto(p_igralec, utils.get_Karta_Id(l_barva_neaduta2, C.C_TIP_K)) === true) &&
              (utils.get_Igralec_Ima_Karto(p_igralec, utils.get_Karta_Id(l_barva_neaduta2, C.C_TIP_Q)) === true)) ||
             ((utils.get_Igralec_Ima_Karto(p_igralec, utils.get_Karta_Id(l_barva_neaduta3, C.C_TIP_K)) === true) &&
              (utils.get_Igralec_Ima_Karto(p_igralec, utils.get_Karta_Id(l_barva_neaduta3, C.C_TIP_Q)) === true)))
        ) {
            l_stopnja_tveganja = 0;
            l_kombinacija = '3-310';
        }

        // A K Q J (drugi pogoj za 3 igralce)
        else if ((utils.get_Igralec_Ima_Karto(p_igralec, utils.get_Karta_Id(l_barva_aduta, C.C_TIP_A)) === true) &&
            (utils.get_Igralec_Ima_Karto(p_igralec, utils.get_Karta_Id(l_barva_aduta, C.C_TIP_K)) === true) &&
            (utils.get_Igralec_Ima_Karto(p_igralec, utils.get_Karta_Id(l_barva_aduta, C.C_TIP_Q)) === true) &&
            (utils.get_Igralec_Ima_Karto(p_igralec, utils.get_Karta_Id(l_barva_aduta, C.C_TIP_J)) === true)
        ) {
            l_stopnja_tveganja = 5;
            l_kombinacija = '3-510';
        }
    }

    // Log
    if (gameData.nastavitve.log_full_log) {
        if (l_stopnja_tveganja !== C.C_NULL_MAX) {
            utils.log_Add(C.C_LOG_DEBUG,
                `Igralec ${p_igralec} analizira karte za igro 6: ` +
                `skupna ocena tveganja je ${l_stopnja_tveganja} (kombinacija ${l_kombinacija}), ` +
                `max nastavljeno tveganje ima ${gameData.nastavitve.igralec_tveganje[p_igralec]}.`);
        } else {
            utils.log_Add(C.C_LOG_DEBUG,
                `Igralec ${p_igralec} analizira karte za igro 6: ocena tveganja je prevelika.`);
        }
    }

    // Rezultat
    if (gameData.nastavitve.igralec_tveganje[p_igralec] >= l_stopnja_tveganja) {
        return true;
    } else {
        return false;
    }
}

// ==========================================
// GAME SELECTION - Main Function
// ==========================================

/**
 * Izberi_Igro
 * Origin: uThink.pas lines 564-574
 * Glavna funkcija za izbiro igre (AI)
 * OPOMBA: Vedno vrne vsaj C_IGRA_TIP_3 (ni možnosti za "pass")
 */
export function Izberi_Igro(p_igralec) {
    // Origin: uThink.pas lines 564-574
    if (Izberi_Igro_Mogoce_12(p_igralec)) return C.C_IGRA_TIP_12;
    else if (Izberi_Igro_Mogoce_9(p_igralec)) return C.C_IGRA_TIP_9;
    else if (Izberi_Igro_Mogoce_6(p_igralec)) return C.C_IGRA_TIP_6;
    else return C.C_IGRA_TIP_3; // Vedno vrne vsaj igro 3 (ni "pass")
}

// ==========================================
// CARD PLAY FUNCTIONS - Igra 3
// ==========================================

/**
 * Vrzi_Karto_Igra_3_Vrze_Prvi_3P
 * Origin: uThink.pas lines 580-677
 * AI vrže prvo karto v stihu (3 igralci)
 */
function Vrzi_Karto_Igra_3_Vrze_Prvi_3P(p_igralec) {
    let l_izbrana_karta = C.C_NULL;
    let l_stevec_tmp = 0;

    // 01 - Če gre za prvi met, naj vrže aduta A
    if (gameData.stihi.stevilo_stihov === 0) {
        if (utils.get_Igralec_Ima_Karto(p_igralec, utils.get_Karta_Id(gameData.rufanje_izbrana_karta.barva, C.C_TIP_A))) {
            l_izbrana_karta = utils.get_Karta_Id(gameData.rufanje_izbrana_karta.barva, C.C_TIP_A);
        }
        if (l_izbrana_karta !== C.C_NULL) {
            console.log('[DEBUG]', `Igralec ${p_igralec} bo vrgel A v barvi aduta.`);
        }
    }

    // 02 - Karto, s katero bo klical 40
    if (l_izbrana_karta === C.C_NULL) {
        if (Get_Ali_Igralec_Lahko_Klice_V_Barvi(p_igralec, gameData.rufanje_izbrana_karta.barva)) {
            l_izbrana_karta = utils.get_Karta_Id(gameData.rufanje_izbrana_karta.barva, C.C_TIP_K);
        }
        if (l_izbrana_karta !== C.C_NULL) {
            console.log('[DEBUG]', `Igralec ${p_igralec} bo klical 40.`);
        }
    }

    // 11 - Vrže max aduta, če skupini manjka manj kot 20 točk
    if (l_izbrana_karta === C.C_NULL) {
        if (utils.get_Stevilo_Tock_Skupine_Igralca_Teoreticno(p_igralec) + 20 >= 66) {
            l_izbrana_karta = Get_Igralec_Max_Karta_V_Barvi(p_igralec, gameData.rufanje_izbrana_karta.barva);
        }
        if (l_izbrana_karta !== C.C_NULL) {
            console.log('[DEBUG]', `Igralec ${p_igralec} bo vrgel max aduta, ker rabijo manj kot 20.`);
        }
    }

    // 21 - Karto, s katero bo klical 20
    if (l_izbrana_karta === C.C_NULL) {
        for (let b = 0; b < 4; b++) {
            if ((l_izbrana_karta === C.C_NULL) && Get_Ali_Igralec_Lahko_Klice_V_Barvi(p_igralec, b)) {
                l_izbrana_karta = utils.get_Karta_Id(b, C.C_TIP_K);
            }
        }
        if (l_izbrana_karta !== C.C_NULL) {
            console.log('[DEBUG]', `Igralec ${p_igralec} bo klical 20.`);
        }
    }

    // 31 - A, v barvi, kjer je ven letelo minimalno kart
    if (l_izbrana_karta === C.C_NULL) {
        for (let b = 0; b < 4; b++) {
            if (utils.get_Igralec_Ima_Karto(p_igralec, utils.get_Karta_Id(b, C.C_TIP_A))) {
                if (l_izbrana_karta === C.C_NULL) {
                    l_izbrana_karta = utils.get_Karta_Id(b, C.C_TIP_A);
                    l_stevec_tmp = utils.stihi_Zunaj_Stevilo_Karte_V_Barvi(b) + utils.get_Igralec_Stevilo_Kart_V_Barvi(p_igralec, b);
                } else {
                    if (l_stevec_tmp > utils.stihi_Zunaj_Stevilo_Karte_V_Barvi(b) + utils.get_Igralec_Stevilo_Kart_V_Barvi(p_igralec, b)) {
                        l_izbrana_karta = utils.get_Karta_Id(b, C.C_TIP_A);
                        l_stevec_tmp = utils.stihi_Zunaj_Stevilo_Karte_V_Barvi(b) + utils.get_Igralec_Stevilo_Kart_V_Barvi(p_igralec, b);
                    }
                }
            }
        }
        if (l_izbrana_karta !== C.C_NULL) {
            console.log('[DEBUG]', `Igralec ${p_igralec} bo vrgel A, v najbolj primerni barvi (malo zunaj).`);
        }
    }

    // 90 - Minimalno karto, v barvi, kjer je ven letelo maximalno kart
    if (l_izbrana_karta === C.C_NULL) {
        for (let k = 0; k < 8; k++) {
            if (gameData.karte_igralec[p_igralec][k] !== C.C_KARTA_NULL) {
                if (utils.get_Barva_Karte(gameData.karte_igralec[p_igralec][k]) !== gameData.rufanje_izbrana_karta.barva) {
                    if (l_izbrana_karta === C.C_KARTA_NULL) {
                        l_izbrana_karta = gameData.karte_igralec[p_igralec][k];
                        l_stevec_tmp = utils.stihi_Zunaj_Stevilo_Karte_V_Barvi(utils.get_Barva_Karte(gameData.karte_igralec[p_igralec][k])) +
                                      utils.get_Igralec_Stevilo_Kart_V_Barvi(p_igralec, utils.get_Barva_Karte(gameData.karte_igralec[p_igralec][k]));
                    } else {
                        if (utils.get_Tip_Karte(gameData.karte_igralec[p_igralec][k]) > utils.get_Tip_Karte(l_izbrana_karta)) {
                            l_izbrana_karta = gameData.karte_igralec[p_igralec][k];
                            l_stevec_tmp = utils.stihi_Zunaj_Stevilo_Karte_V_Barvi(utils.get_Barva_Karte(gameData.karte_igralec[p_igralec][k])) +
                                          utils.get_Igralec_Stevilo_Kart_V_Barvi(p_igralec, utils.get_Barva_Karte(gameData.karte_igralec[p_igralec][k]));
                        } else if (utils.get_Tip_Karte(gameData.karte_igralec[p_igralec][k]) === utils.get_Tip_Karte(l_izbrana_karta)) {
                            const tmp_stevec = utils.stihi_Zunaj_Stevilo_Karte_V_Barvi(utils.get_Barva_Karte(gameData.karte_igralec[p_igralec][k])) +
                                              utils.get_Igralec_Stevilo_Kart_V_Barvi(p_igralec, utils.get_Barva_Karte(gameData.karte_igralec[p_igralec][k]));
                            if (l_stevec_tmp > tmp_stevec) {
                                l_izbrana_karta = gameData.karte_igralec[p_igralec][k];
                                l_stevec_tmp = tmp_stevec;
                            }
                        }
                    }
                }
            }
        }
        if (l_izbrana_karta !== C.C_NULL) {
            console.log('[DEBUG]', `Igralec ${p_igralec} bo vrgel minimalno karto, v najbolj primerni barvi (veliko že zunaj).`);
        }
    }

    // Vrni index izbrane karte
    return utils.get_Igralec_Index_Karte(p_igralec, l_izbrana_karta);
}

/**
 * Vrzi_Karto_Igra_3_Vrze_Prvi_4P
 * Origin: uThink.pas lines 681-809
 * AI vrže prvo karto v stihu (4 igralci)
 */
function Vrzi_Karto_Igra_3_Vrze_Prvi_4P(p_igralec) {
    let l_izbrana_karta = C.C_NULL;
    let l_stevec_tmp = 0;

    // 01 - Če gre za prvi met, naj vrže aduta A
    if (gameData.stihi.stevilo_stihov === 0) {
        if (utils.get_Igralec_Ima_Karto(p_igralec, utils.get_Karta_Id(gameData.rufanje_izbrana_karta.barva, C.C_TIP_A))) {
            l_izbrana_karta = utils.get_Karta_Id(gameData.rufanje_izbrana_karta.barva, C.C_TIP_A);
        }
        if (l_izbrana_karta !== C.C_NULL) {
            console.log('[DEBUG]', `Igralec ${p_igralec} bo vrgel A v barvi aduta.`);
        }
    }

    // 02 - Če gre za drugi met in je v prvem metu vrgel aduta A, naj vrže aduta 10
    if (gameData.stihi.stevilo_stihov === 1) {
        if (utils.get_Igralec_Ima_Karto(p_igralec, utils.get_Karta_Id(gameData.rufanje_izbrana_karta.barva, C.C_TIP_10))) {
            if ((gameData.stihi.stih[0].igralec_pobral === p_igralec && gameData.stihi.stih[0].igralec_zacel === p_igralec) ||
                (gameData.igra.tip_igre === C.C_IGRA_TIP_6)) {
                for (let k = 0; k < 4; k++) {
                    if (gameData.stihi.stih[0].karte[k] !== C.C_KARTA_NULL) {
                        if (utils.get_Barva_Karte(gameData.stihi.stih[0].karte[k]) === gameData.rufanje_izbrana_karta.barva &&
                            utils.get_Tip_Karte(gameData.stihi.stih[0].karte[k]) === C.C_TIP_A) {
                            l_izbrana_karta = utils.get_Karta_Id(gameData.rufanje_izbrana_karta.barva, C.C_TIP_10);
                        }
                    }
                }
            }
        }
        if (l_izbrana_karta !== C.C_NULL) {
            console.log('[DEBUG]', `Igralec ${p_igralec} bo vrgel 10 v barvi aduta, ker je v prvem metu že vrgel A.`);
        }
    }

    // 06 - Karto, s katero bo klical 40
    if (l_izbrana_karta === C.C_NULL) {
        if (Get_Ali_Igralec_Lahko_Klice_V_Barvi(p_igralec, gameData.rufanje_izbrana_karta.barva)) {
            l_izbrana_karta = utils.get_Karta_Id(gameData.rufanje_izbrana_karta.barva, C.C_TIP_K);
        }
        if (l_izbrana_karta !== C.C_NULL) {
            console.log('[DEBUG]', `Igralec ${p_igralec} bo klical 40.`);
        }
    }

    // 07 - Če gre za prvi met, in ni rufal samega sebe, naj vrže min aduta
    if (l_izbrana_karta === C.C_NULL) {
        if (gameData.stihi.stevilo_stihov === 0 &&
            !utils.get_Igralec_Ima_Karto(p_igralec, utils.get_Karta_Id(gameData.rufanje_izbrana_karta.barva, gameData.rufanje_izbrana_karta.tip))) {
            l_izbrana_karta = Get_Igralec_Min_Karta_V_Barvi(p_igralec, gameData.rufanje_izbrana_karta.barva);
        }
        if (l_izbrana_karta !== C.C_NULL) {
            console.log('[DEBUG]', `Igralec ${p_igralec} vrže minimalno karto aduta, da bo prevzel njegov soigralec.`);
        }
    }

    // 11 - Vrže max aduta, če skupini manjka manj kot 20 točk
    if (l_izbrana_karta === C.C_NULL) {
        if (utils.get_Stevilo_Tock_Skupine_Igralca_Teoreticno(p_igralec) + 20 >= 66) {
            l_izbrana_karta = Get_Igralec_Max_Karta_V_Barvi(p_igralec, gameData.rufanje_izbrana_karta.barva);
        }
        if (l_izbrana_karta !== C.C_NULL) {
            console.log('[DEBUG]', `Igralec ${p_igralec} bo vrgel max aduta, ker rabijo manj kot 20.`);
        }
    }

    // 21 - Karto, s katero bo klical 20
    if (l_izbrana_karta === C.C_NULL) {
        for (let b = 0; b < 4; b++) {
            if ((l_izbrana_karta === C.C_NULL) && Get_Ali_Igralec_Lahko_Klice_V_Barvi(p_igralec, b)) {
                l_izbrana_karta = utils.get_Karta_Id(b, C.C_TIP_K);
            }
        }
        if (l_izbrana_karta !== C.C_NULL) {
            console.log('[DEBUG]', `Igralec ${p_igralec} bo klical 20.`);
        }
    }

    // 31 - A, v barvi, kjer je ven letelo minimalno kart
    if (l_izbrana_karta === C.C_NULL) {
        for (let b = 0; b < 4; b++) {
            if (utils.get_Igralec_Ima_Karto(p_igralec, utils.get_Karta_Id(b, C.C_TIP_A))) {
                if (l_izbrana_karta === C.C_NULL) {
                    l_izbrana_karta = utils.get_Karta_Id(b, C.C_TIP_A);
                    l_stevec_tmp = utils.stihi_Zunaj_Stevilo_Karte_V_Barvi(b) + utils.get_Igralec_Stevilo_Kart_V_Barvi(p_igralec, b);
                } else {
                    if (l_stevec_tmp > utils.stihi_Zunaj_Stevilo_Karte_V_Barvi(b) + utils.get_Igralec_Stevilo_Kart_V_Barvi(p_igralec, b)) {
                        l_izbrana_karta = utils.get_Karta_Id(b, C.C_TIP_A);
                        l_stevec_tmp = utils.stihi_Zunaj_Stevilo_Karte_V_Barvi(b) + utils.get_Igralec_Stevilo_Kart_V_Barvi(p_igralec, b);
                    }
                }
            }
        }
        if (l_izbrana_karta !== C.C_NULL) {
            console.log('[DEBUG]', `Igralec ${p_igralec} bo vrgel A, v najbolj primerni barvi (malo zunaj).`);
        }
    }

    // 90 - Minimalno karto, v barvi, kjer je ven letelo maximalno kart
    if (l_izbrana_karta === C.C_NULL) {
        for (let k = 0; k < 8; k++) {
            if (gameData.karte_igralec[p_igralec][k] !== C.C_KARTA_NULL) {
                if (utils.get_Barva_Karte(gameData.karte_igralec[p_igralec][k]) !== gameData.rufanje_izbrana_karta.barva) {
                    if (l_izbrana_karta === C.C_KARTA_NULL) {
                        l_izbrana_karta = gameData.karte_igralec[p_igralec][k];
                        l_stevec_tmp = utils.stihi_Zunaj_Stevilo_Karte_V_Barvi(utils.get_Barva_Karte(gameData.karte_igralec[p_igralec][k])) +
                                      utils.get_Igralec_Stevilo_Kart_V_Barvi(p_igralec, utils.get_Barva_Karte(gameData.karte_igralec[p_igralec][k]));
                    } else {
                        if (utils.get_Tip_Karte(gameData.karte_igralec[p_igralec][k]) > utils.get_Tip_Karte(l_izbrana_karta)) {
                            l_izbrana_karta = gameData.karte_igralec[p_igralec][k];
                            l_stevec_tmp = utils.stihi_Zunaj_Stevilo_Karte_V_Barvi(utils.get_Barva_Karte(gameData.karte_igralec[p_igralec][k])) +
                                          utils.get_Igralec_Stevilo_Kart_V_Barvi(p_igralec, utils.get_Barva_Karte(gameData.karte_igralec[p_igralec][k]));
                        } else if (utils.get_Tip_Karte(gameData.karte_igralec[p_igralec][k]) === utils.get_Tip_Karte(l_izbrana_karta)) {
                            const tmp_stevec = utils.stihi_Zunaj_Stevilo_Karte_V_Barvi(utils.get_Barva_Karte(gameData.karte_igralec[p_igralec][k])) +
                                              utils.get_Igralec_Stevilo_Kart_V_Barvi(p_igralec, utils.get_Barva_Karte(gameData.karte_igralec[p_igralec][k]));
                            if (l_stevec_tmp > tmp_stevec) {
                                l_izbrana_karta = gameData.karte_igralec[p_igralec][k];
                                l_stevec_tmp = tmp_stevec;
                            }
                        }
                    }
                }
            }
        }
        if (l_izbrana_karta !== C.C_NULL) {
            console.log('[DEBUG]', `Igralec ${p_igralec} bo vrgel minimalno karto, v najbolj primerni barvi (veliko že zunaj).`);
        }
    }

    // Vrni index izbrane karte
    return utils.get_Igralec_Index_Karte(p_igralec, l_izbrana_karta);
}

/**
 * Vrzi_Karto_Igra_6_Vrze_Prvi
 * Origin: uThink.pas lines 815-898
 * AI vrže prvo karto v stihu (igra 6 - rufanje)
 */
function Vrzi_Karto_Igra_6_Vrze_Prvi(p_igralec) {
    // TODO: izboljšava je še možna
    let l_izbrana_karta = C.C_NULL;

    // 01 - Naj vrže aduta A
    if (utils.get_Igralec_Ima_Karto(p_igralec, utils.get_Karta_Id(gameData.rufanje_izbrana_karta.barva, C.C_TIP_A)) === true) {
        l_izbrana_karta = utils.get_Karta_Id(gameData.rufanje_izbrana_karta.barva, C.C_TIP_A);
    }
    if (l_izbrana_karta !== C.C_NULL) {
        utils.log_Add(C.C_LOG_DEBUG, `Igralec ${p_igralec} bo vrgel A v barvi aduta.`);
    }

    // 02 - Naj vrže aduta 10, če je imel tudi aduta A
    if (l_izbrana_karta === C.C_NULL) {
        if (gameData.stihi.stevilo_stihov === 1) { // predpostavimo, da gre za drugi štih
            if (utils.get_Igralec_Ima_Karto(p_igralec, utils.get_Karta_Id(gameData.rufanje_izbrana_karta.barva, C.C_TIP_10)) === true) {
                l_izbrana_karta = utils.get_Karta_Id(gameData.rufanje_izbrana_karta.barva, C.C_TIP_10);
            }
        }
        if (l_izbrana_karta !== C.C_NULL) {
            utils.log_Add(C.C_LOG_DEBUG, `Igralec ${p_igralec} bo vrgel 10 v barvi aduta.`);
        }
    }

    // 03 - Karto, s katero bo klical 40
    if (l_izbrana_karta === C.C_NULL) {
        if (Get_Ali_Igralec_Lahko_Klice_V_Barvi(p_igralec, gameData.rufanje_izbrana_karta.barva) === true) {
            l_izbrana_karta = utils.get_Karta_Id(gameData.rufanje_izbrana_karta.barva, C.C_TIP_K);
        }
        if (l_izbrana_karta !== C.C_NULL) {
            utils.log_Add(C.C_LOG_DEBUG, `Igralec ${p_igralec} bo klical 40.`);
        }
    }

    // 04 - Klic 20, če skupini manjka manj kot 20 točk
    if (l_izbrana_karta === C.C_NULL) {
        if (utils.get_Stevilo_Tock_Skupine_Igralca_Teoreticno(p_igralec) + 20 >= 66) {
            for (let b = 0; b < 4; b++) {
                if ((l_izbrana_karta === C.C_NULL) &&
                    (Get_Ali_Igralec_Lahko_Klice_V_Barvi(p_igralec, b) === true)) {
                    l_izbrana_karta = utils.get_Karta_Id(b, C.C_TIP_K);
                }
            }
        }
        if (l_izbrana_karta !== C.C_NULL) {
            utils.log_Add(C.C_LOG_DEBUG, `Igralec ${p_igralec} bo klical 20.`);
        }
    }

    // 05 - Če gre za 3P ali 2P, naj vrže max aduta
    if (l_izbrana_karta === C.C_NULL) {
        if (gameData.igra.stevilo_igralcev <= 3) {
            l_izbrana_karta = Get_Igralec_Max_Karta_V_Barvi(p_igralec, gameData.rufanje_izbrana_karta.barva);
        }
        if (l_izbrana_karta !== C.C_NULL) {
            utils.log_Add(C.C_LOG_DEBUG, `Igralec ${p_igralec} bo vrgel max karto v barvi aduta.`);
        }
    }

    // 06 - Naj vrže A
    if (l_izbrana_karta === C.C_NULL) {
        for (let k = 0; k < 8; k++) {
            if (gameData.karte_igralec[p_igralec][k] !== C.C_KARTA_NULL) {
                if (utils.get_Tip_Karte(gameData.karte_igralec[p_igralec][k]) === C.C_TIP_A) {
                    l_izbrana_karta = gameData.karte_igralec[p_igralec][k];
                }
            }
        }
        if (l_izbrana_karta !== C.C_NULL) {
            utils.log_Add(C.C_LOG_DEBUG, `Igralec ${p_igralec} bo vrgel A.`);
        }
    }

    // 07 - 10 v barvi, kjer je imel A - TODO: trenutno kar vzamemo prvo 10
    if (l_izbrana_karta === C.C_NULL) {
        for (let k = 0; k < 8; k++) {
            if (gameData.karte_igralec[p_igralec][k] !== C.C_KARTA_NULL) {
                if (utils.get_Tip_Karte(gameData.karte_igralec[p_igralec][k]) === C.C_TIP_10) {
                    l_izbrana_karta = gameData.karte_igralec[p_igralec][k];
                }
            }
        }
        if (l_izbrana_karta !== C.C_NULL) {
            utils.log_Add(C.C_LOG_DEBUG, `Igralec ${p_igralec} bo vrgel 10.`);
        }
    }

    // Vrni index izbrane karte
    return utils.get_Igralec_Index_Karte(p_igralec, l_izbrana_karta);
}

/**
 * Vrzi_Karto_Igra_9_Vrze_Prvi
 * Origin: uThink.pas lines 904-997
 * AI vrže prvo karto v stihu (igra 9)
 */
function Vrzi_Karto_Igra_9_Vrze_Prvi(p_igralec) {
    let l_izbrana_karta = C.C_NULL;

    // 01 - Vrže J (najmočnejšo karto)
    if (l_izbrana_karta === C.C_NULL) {
        for (let b = 0; b < 4; b++) {
            if ((l_izbrana_karta === C.C_NULL) && utils.get_Igralec_Ima_Karto(p_igralec, utils.get_Karta_Id(b, C.C_TIP_J))) {
                l_izbrana_karta = utils.get_Karta_Id(b, C.C_TIP_J);
            }
        }
        if (l_izbrana_karta !== C.C_NULL) {
            console.log('[DEBUG]', `Igralec ${p_igralec} bo vrgel J.`);
        }
    }

    // 02 - Vrže Q
    if (l_izbrana_karta === C.C_NULL) {
        for (let b = 0; b < 4; b++) {
            if ((l_izbrana_karta === C.C_NULL) && utils.get_Igralec_Ima_Karto(p_igralec, utils.get_Karta_Id(b, C.C_TIP_Q))) {
                l_izbrana_karta = utils.get_Karta_Id(b, C.C_TIP_Q);
            }
        }
        if (l_izbrana_karta !== C.C_NULL) {
            console.log('[DEBUG]', `Igralec ${p_igralec} bo vrgel Q.`);
        }
    }

    // 03 - Vrže K
    if (l_izbrana_karta === C.C_NULL) {
        for (let b = 0; b < 4; b++) {
            if ((l_izbrana_karta === C.C_NULL) && utils.get_Igralec_Ima_Karto(p_igralec, utils.get_Karta_Id(b, C.C_TIP_K))) {
                l_izbrana_karta = utils.get_Karta_Id(b, C.C_TIP_K);
            }
        }
        if (l_izbrana_karta !== C.C_NULL) {
            console.log('[DEBUG]', `Igralec ${p_igralec} bo vrgel K.`);
        }
    }

    // 04 - Vrže 10
    if (l_izbrana_karta === C.C_NULL) {
        for (let b = 0; b < 4; b++) {
            if ((l_izbrana_karta === C.C_NULL) && utils.get_Igralec_Ima_Karto(p_igralec, utils.get_Karta_Id(b, C.C_TIP_10))) {
                l_izbrana_karta = utils.get_Karta_Id(b, C.C_TIP_10);
            }
        }
        if (l_izbrana_karta !== C.C_NULL) {
            console.log('[DEBUG]', `Igralec ${p_igralec} bo vrgel 10.`);
        }
    }

    // 05 - Vrže A (najšibkejšo karto)
    if (l_izbrana_karta === C.C_NULL) {
        for (let b = 0; b < 4; b++) {
            if ((l_izbrana_karta === C.C_NULL) && utils.get_Igralec_Ima_Karto(p_igralec, utils.get_Karta_Id(b, C.C_TIP_A))) {
                l_izbrana_karta = utils.get_Karta_Id(b, C.C_TIP_A);
            }
        }
        if (l_izbrana_karta !== C.C_NULL) {
            console.log('[DEBUG]', `Igralec ${p_igralec} bo vrgel A.`);
        }
    }

    // Vrni index izbrane karte
    return utils.get_Igralec_Index_Karte(p_igralec, l_izbrana_karta);
}

/**
 * Vrzi_Karto_Igra_12_Vrze_Prvi
 * Origin: uThink.pas lines 1001-1094
 * AI vrže prvo karto v stihu (igra 12)
 */
function Vrzi_Karto_Igra_12_Vrze_Prvi(p_igralec) {
    let l_izbrana_karta = C.C_NULL;

    // 01 - Vrže A (najmočnejšo karto)
    if (l_izbrana_karta === C.C_NULL) {
        for (let b = 0; b < 4; b++) {
            if ((l_izbrana_karta === C.C_NULL) && utils.get_Igralec_Ima_Karto(p_igralec, utils.get_Karta_Id(b, C.C_TIP_A))) {
                l_izbrana_karta = utils.get_Karta_Id(b, C.C_TIP_A);
            }
        }
        if (l_izbrana_karta !== C.C_NULL) {
            console.log('[DEBUG]', `Igralec ${p_igralec} bo vrgel A.`);
        }
    }

    // 02 - Vrže 10
    if (l_izbrana_karta === C.C_NULL) {
        for (let b = 0; b < 4; b++) {
            if ((l_izbrana_karta === C.C_NULL) && utils.get_Igralec_Ima_Karto(p_igralec, utils.get_Karta_Id(b, C.C_TIP_10))) {
                l_izbrana_karta = utils.get_Karta_Id(b, C.C_TIP_10);
            }
        }
        if (l_izbrana_karta !== C.C_NULL) {
            console.log('[DEBUG]', `Igralec ${p_igralec} bo vrgel 10.`);
        }
    }

    // 03 - Vrže K
    if (l_izbrana_karta === C.C_NULL) {
        for (let b = 0; b < 4; b++) {
            if ((l_izbrana_karta === C.C_NULL) && utils.get_Igralec_Ima_Karto(p_igralec, utils.get_Karta_Id(b, C.C_TIP_K))) {
                l_izbrana_karta = utils.get_Karta_Id(b, C.C_TIP_K);
            }
        }
        if (l_izbrana_karta !== C.C_NULL) {
            console.log('[DEBUG]', `Igralec ${p_igralec} bo vrgel K.`);
        }
    }

    // 04 - Vrže Q
    if (l_izbrana_karta === C.C_NULL) {
        for (let b = 0; b < 4; b++) {
            if ((l_izbrana_karta === C.C_NULL) && utils.get_Igralec_Ima_Karto(p_igralec, utils.get_Karta_Id(b, C.C_TIP_Q))) {
                l_izbrana_karta = utils.get_Karta_Id(b, C.C_TIP_Q);
            }
        }
        if (l_izbrana_karta !== C.C_NULL) {
            console.log('[DEBUG]', `Igralec ${p_igralec} bo vrgel Q.`);
        }
    }

    // 05 - Vrže J (najšibkejšo karto)
    if (l_izbrana_karta === C.C_NULL) {
        for (let b = 0; b < 4; b++) {
            if ((l_izbrana_karta === C.C_NULL) && utils.get_Igralec_Ima_Karto(p_igralec, utils.get_Karta_Id(b, C.C_TIP_J))) {
                l_izbrana_karta = utils.get_Karta_Id(b, C.C_TIP_J);
            }
        }
        if (l_izbrana_karta !== C.C_NULL) {
            console.log('[DEBUG]', `Igralec ${p_igralec} bo vrgel J.`);
        }
    }

    // Vrni index izbrane karte
    return utils.get_Igralec_Index_Karte(p_igralec, l_izbrana_karta);
}

// ==========================================
// CARD PLAY FUNCTIONS - Na Karte (Response)
// ==========================================

/**
 * Vrzi_Karto_Igra_3_Na_Karte
 * Origin: uThink.pas lines 1098-1183
 * AI odgovori na že položene karte (igra 3 in 6)
 */
function Vrzi_Karto_Igra_3_Na_Karte(p_igralec) {
    let l_izbrana_karta = C.C_NULL;
    let l_prva_karta_na_mizi;
    let k;

    // l_prva_karta_na_mizi
    l_prva_karta_na_mizi = gameData.karte_miza[gameData.igra.igralec_zacel_za_stih];

    // 1 - max karta v barvi
    l_izbrana_karta = Get_Igralec_Max_Karta_V_Barvi(p_igralec, utils.get_Barva_Karte(l_prva_karta_na_mizi));
    if (l_izbrana_karta !== C.C_NULL) {
        console.log('[DEBUG]', `Igralec ${p_igralec} bo vrgel max karto v zahtevani barvi.`);
    }
    // todo - če ne pobere njegova skupina, naj vrže min, kar lahko

    // 2 - max karta v barvi aduta
    if (l_izbrana_karta === C.C_NULL) {
        l_izbrana_karta = Get_Igralec_Max_Karta_V_Barvi(p_igralec, gameData.rufanje_izbrana_karta.barva);
        if (l_izbrana_karta !== C.C_NULL) {
            console.log('[DEBUG]', `Igralec ${p_igralec} bo vrgel max karto v barvi aduta.`);
        }
    }
    // todo - če ne pobere njegova skupina, naj vrže min, kar lahko

    // 3 - če je na vrsti zadnji in pobere njegova skupina, potem naj vrne max karto
    //todo

    // 4 - vrne naj minimalno karto do vključno K (brez parov za klicanje)
    if (l_izbrana_karta === C.C_NULL) {
        for (k = 0; k < 8; k++) {
            if ((gameData.karte_igralec[p_igralec][k] !== C.C_KARTA_NULL) &&
                (utils.get_Vrednost_Karte(gameData.karte_igralec[p_igralec][k]) <= 4)) {
                if (Get_Ali_Igralec_Lahko_Klice_V_Barvi(p_igralec, utils.get_Barva_Karte(gameData.karte_igralec[p_igralec][k])) === true) {
                    if (l_izbrana_karta === C.C_KARTA_NULL) {
                        l_izbrana_karta = gameData.karte_igralec[p_igralec][k];
                    }
                    else {
                        if (utils.get_Vrednost_Karte(l_izbrana_karta) > utils.get_Vrednost_Karte(gameData.karte_igralec[p_igralec][k])) {
                            l_izbrana_karta = gameData.karte_igralec[p_igralec][k];
                        }
                    }
                }
            }
        }
        if (l_izbrana_karta !== C.C_NULL) {
            console.log('[DEBUG]', `Igralec ${p_igralec} bo vrgel minimalno karto do K (morebitno klicanje prišpara).`);
        }
    }

    // 5 - vrne naj minimalno karto do vključno K (s pari za klicanje)
    if (l_izbrana_karta === C.C_NULL) {
        for (k = 0; k < 8; k++) {
            if ((gameData.karte_igralec[p_igralec][k] !== C.C_KARTA_NULL) &&
                (utils.get_Vrednost_Karte(gameData.karte_igralec[p_igralec][k]) <= 4)) {
                if (l_izbrana_karta === C.C_KARTA_NULL) {
                    l_izbrana_karta = gameData.karte_igralec[p_igralec][k];
                }
                else {
                    if (utils.get_Vrednost_Karte(l_izbrana_karta) > utils.get_Vrednost_Karte(gameData.karte_igralec[p_igralec][k])) {
                        l_izbrana_karta = gameData.karte_igralec[p_igralec][k];
                    }
                }
            }
        }
        if (l_izbrana_karta !== C.C_NULL) {
            console.log('[DEBUG]', `Igralec ${p_igralec} bo vrgel minimalno karto do K.`);
        }
    }

    // 6 - vrne naj minimalno karto
    if (l_izbrana_karta === C.C_NULL) {
        for (k = 0; k < 8; k++) {
            if (gameData.karte_igralec[p_igralec][k] !== C.C_KARTA_NULL) {
                if (l_izbrana_karta === C.C_KARTA_NULL) {
                    l_izbrana_karta = gameData.karte_igralec[p_igralec][k];
                }
                else {
                    if (utils.get_Vrednost_Karte(l_izbrana_karta) > utils.get_Vrednost_Karte(gameData.karte_igralec[p_igralec][k])) {
                        l_izbrana_karta = gameData.karte_igralec[p_igralec][k];
                    }
                }
            }
        }
        if (l_izbrana_karta !== C.C_NULL) {
            console.log('[DEBUG]', `Igralec ${p_igralec} bo vrgel minimalno karto.`);
        }
    }

    //
    return utils.get_Igralec_Index_Karte(p_igralec, l_izbrana_karta);
}

/**
 * Vrzi_Karto_Igra_9_Na_Karte
 * Origin: uThink.pas lines 1187-1440
 * AI odgovori na že položene karte (igra 9) - KOMPLEKSNA LOGIKA (10 strategij)
 */
function Vrzi_Karto_Igra_9_Na_Karte(p_igralec) {
    const l_zahtevana_barva = utils.get_Barva_Karte(gameData.karte_miza[gameData.igra.igralec_zacel_za_stih]);
    let l_izbrana_karta = C.C_NULL;
    const l_stevilo_kart_v_barvi = [0, 0, 0, 0];
    const l_samo_ena_v_barvi = [C.C_NULL, C.C_NULL, C.C_NULL, C.C_NULL];
    let l_temp_barva;
    let l_karta_zunaj;

    // 1 - ima zahtevano barvo - min karta v barvi, če premaga izzivalca
    l_izbrana_karta = Get_Igralec_Min_Karta_V_Barvi(p_igralec, l_zahtevana_barva);
    if ((l_izbrana_karta !== C.C_NULL) &&
        (utils.get_Vrednost_Karte(l_izbrana_karta) < utils.get_Vrednost_Karte(gameData.karte_miza[gameData.igra.igralec_zacel_za_stih]))) {
        console.log('[DEBUG]', `Igralec ${p_igralec} vrže min karto v zahtevani barvi. Karta je manjša od nasprotnikove. Vrže karto: ${l_izbrana_karta}.`);
    } else {
        l_izbrana_karta = C.C_NULL;
    }

    // 2 - ima zahtevano barvo - max karta v barvi
    if (l_izbrana_karta === C.C_NULL) {
        l_izbrana_karta = Get_Igralec_Max_Karta_V_Barvi(p_igralec, l_zahtevana_barva);
        if (l_izbrana_karta !== C.C_KARTA_NULL) {
            console.log('[DEBUG]', `Igralec ${p_igralec} vrže max karto v zahtevani barvi: ${l_izbrana_karta}.`);
        }
    }

    // 3 - nima zahtevane barve - vrzi A, če je edini v tej barvi ali ima v tej barvi edino še 10
    if (l_izbrana_karta === C.C_NULL) {
        for (let k = 0; k < 8; k++) {
            if (gameData.karte_igralec[p_igralec][k] !== C.C_NULL) {
                if (utils.get_Tip_Karte(gameData.karte_igralec[p_igralec][k]) === C.C_TIP_A) {
                    if (l_izbrana_karta === C.C_NULL) {
                        l_izbrana_karta = gameData.karte_igralec[p_igralec][k];
                        for (let k2 = 0; k2 < 8; k2++) {
                            if (gameData.karte_igralec[p_igralec][k2] !== C.C_NULL) {
                                if (k2 !== k) {
                                    if (utils.get_Tip_Karte(gameData.karte_igralec[p_igralec][k2]) !== C.C_TIP_10) {
                                        if (utils.get_Barva_Karte(gameData.karte_igralec[p_igralec][k2]) === utils.get_Barva_Karte(gameData.karte_igralec[p_igralec][k])) {
                                            l_izbrana_karta = C.C_NULL;
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
        if (l_izbrana_karta !== C.C_NULL) {
            console.log('[DEBUG]', `Igralec ${p_igralec} vrže A, ker je edini v tej barvi ali pa ima v tej barvi edino še 10. Vrže karto: ${l_izbrana_karta}.`);
        }
    }

    // 4 - nima zahtevane barve - vrzi 10, če je edini v tej barvi, in je A že zunaj
    if (l_izbrana_karta === C.C_NULL) {
        for (let k = 0; k < 8; k++) {
            if (gameData.karte_igralec[p_igralec][k] !== C.C_NULL) {
                if (utils.get_Tip_Karte(gameData.karte_igralec[p_igralec][k]) === C.C_TIP_10) {
                    if (l_izbrana_karta === C.C_NULL) {
                        l_izbrana_karta = gameData.karte_igralec[p_igralec][k];
                        for (let k2 = 0; k2 < 8; k2++) {
                            if (gameData.karte_igralec[p_igralec][k2] !== C.C_NULL) {
                                if (k2 !== k) {
                                    if (utils.get_Barva_Karte(gameData.karte_igralec[p_igralec][k2]) === utils.get_Barva_Karte(gameData.karte_igralec[p_igralec][k])) {
                                        l_izbrana_karta = C.C_NULL;
                                    }
                                }
                            }
                        }
                        if (l_izbrana_karta !== C.C_NULL) {
                            // preveri, da je A že zunaj
                            l_karta_zunaj = false;
                            if (gameData.stihi.stevilo_stihov > 0) {
                                for (let s = 0; s < gameData.stihi.stevilo_stihov; s++) {
                                    for (let k2 = 0; k2 < 4; k2++) {
                                        if ((utils.get_Barva_Karte(gameData.stihi.stih[s].karte[k2]) === utils.get_Barva_Karte(l_izbrana_karta)) &&
                                            (utils.get_Tip_Karte(gameData.stihi.stih[s].karte[k2]) === C.C_TIP_A)) {
                                            l_karta_zunaj = true;
                                        }
                                    }
                                }
                            }
                            if (l_karta_zunaj === false) {
                                l_izbrana_karta = C.C_NULL;
                            }
                        }
                    }
                }
            }
        }
        if (l_izbrana_karta !== C.C_NULL) {
            console.log('[DEBUG]', `Igralec ${p_igralec} vrže 10, ker je edini v tej barvi, A pa je že zunaj. Vrže karto: ${l_izbrana_karta}.`);
        }
    }

    // 5 - nima zahtevane barve - če ima 3 karte ali več v enaki barvi, potem vrzi maximalno
    if (l_izbrana_karta === C.C_NULL) {
        l_stevilo_kart_v_barvi[0] = 0;
        l_stevilo_kart_v_barvi[1] = 0;
        l_stevilo_kart_v_barvi[2] = 0;
        l_stevilo_kart_v_barvi[3] = 0;
        for (let k = 0; k < 8; k++) {
            if (gameData.karte_igralec[p_igralec][k] !== C.C_NULL) {
                l_temp_barva = utils.get_Barva_Karte(gameData.karte_igralec[p_igralec][k]);
                l_stevilo_kart_v_barvi[l_temp_barva] = l_stevilo_kart_v_barvi[l_temp_barva] + 1;
            }
        }
        for (let b = 0; b < 4; b++) {
            if (l_stevilo_kart_v_barvi[b] >= 3) {
                if (l_izbrana_karta === C.C_NULL) {
                    l_izbrana_karta = Get_Igralec_Max_Karta_V_Barvi(p_igralec, b);
                    console.log('[DEBUG]', `Igralec ${p_igralec} vrže max karto v barvi, v kateri ima 3 ali več kart: ${l_izbrana_karta}.`);
                }
            }
        }
    }

    // 6 - nima zahtevane barve - če ima 2 karte v isti barvi in ena izmed njih je J, potem vrzi max
    if (l_izbrana_karta === C.C_NULL) {
        l_stevilo_kart_v_barvi[0] = 0;
        l_stevilo_kart_v_barvi[1] = 0;
        l_stevilo_kart_v_barvi[2] = 0;
        l_stevilo_kart_v_barvi[3] = 0;
        for (let k = 0; k < 8; k++) {
            if (gameData.karte_igralec[p_igralec][k] !== C.C_NULL) {
                l_temp_barva = utils.get_Barva_Karte(gameData.karte_igralec[p_igralec][k]);
                l_stevilo_kart_v_barvi[l_temp_barva] = l_stevilo_kart_v_barvi[l_temp_barva] + 1;
            }
        }
        for (let b = 0; b < 4; b++) {
            if (l_stevilo_kart_v_barvi[b] === 2) {
                if (l_izbrana_karta === C.C_NULL) {
                    for (let k = 0; k < 8; k++) {
                        if (gameData.karte_igralec[p_igralec][k] !== C.C_NULL) {
                            if ((utils.get_Barva_Karte(gameData.karte_igralec[p_igralec][k]) === b) &&
                                (utils.get_Tip_Karte(gameData.karte_igralec[p_igralec][k]) === C.C_TIP_J)) {
                                l_izbrana_karta = Get_Igralec_Max_Karta_V_Barvi(p_igralec, b);
                                console.log('[DEBUG]', `Igralec ${p_igralec} vrže max karto v barvi, v kateri ima tudi J. Vrže karto: ${l_izbrana_karta}.`);
                            }
                        }
                    }
                }
            }
        }
    }

    // 7 - nima zahtevane barve - ima vse karte v različnih barvah
    //     potem vrzi tisto, kjer so že vse manjše karte zunaj
    // OPOMBA: V originalu je commented out (TODO) - preskočimo

    // 8 - nima zahtevane barve - če nič od tega, vrzi karto, ki je edino imel v tisti barvi
    //     (gleda naj tudi kaj je že vrgel) - če jih je več, potem vrzi max
    if (l_izbrana_karta === C.C_NULL) {
        l_samo_ena_v_barvi[0] = C.C_NULL;
        l_samo_ena_v_barvi[1] = C.C_NULL;
        l_samo_ena_v_barvi[2] = C.C_NULL;
        l_samo_ena_v_barvi[3] = C.C_NULL;
        for (let k = 0; k < 8; k++) {
            if (gameData.karte_igralec[p_igralec][k] !== C.C_NULL) {
                l_temp_barva = utils.get_Barva_Karte(gameData.karte_igralec[p_igralec][k]);
                if (l_samo_ena_v_barvi[l_temp_barva] === C.C_NULL) {
                    l_samo_ena_v_barvi[l_temp_barva] = gameData.karte_igralec[p_igralec][k];
                } else {
                    l_samo_ena_v_barvi[l_temp_barva] = C.C_NULL_MAX;
                }
            }
        }
        if (gameData.stihi.stevilo_stihov > 0) {
            for (let k = 0; k < gameData.stihi.stevilo_stihov; k++) {
                if (gameData.stihi.stih[k].karte[p_igralec] !== C.C_NULL) {
                    l_temp_barva = utils.get_Barva_Karte(gameData.stihi.stih[k].karte[p_igralec]);
                    if (l_samo_ena_v_barvi[l_temp_barva] === C.C_NULL) {
                        l_samo_ena_v_barvi[l_temp_barva] = gameData.stihi.stih[k].karte[p_igralec];
                    } else {
                        l_samo_ena_v_barvi[l_temp_barva] = C.C_NULL_MAX;
                    }
                }
            }
        }
        for (let b = 0; b < 4; b++) {
            if (l_samo_ena_v_barvi[b] === C.C_NULL_MAX) l_samo_ena_v_barvi[b] = C.C_NULL;
            if (l_samo_ena_v_barvi[b] !== C.C_NULL) {
                if (utils.get_Igralec_Index_Karte(p_igralec, l_samo_ena_v_barvi[b]) !== C.C_NULL) {
                    if (l_izbrana_karta === C.C_NULL) {
                        l_izbrana_karta = l_samo_ena_v_barvi[b];
                    } else {
                        if (utils.get_Tip_Karte(l_izbrana_karta) > utils.get_Tip_Karte(l_samo_ena_v_barvi[b])) {
                            l_izbrana_karta = l_samo_ena_v_barvi[b];
                        }
                    }
                }
            }
        }
        if (l_izbrana_karta !== C.C_NULL) {
            console.log('[DEBUG]', `Igralec ${p_igralec} vrže max karto, ki je bila na začetku edina v takšni barvi: ${l_izbrana_karta}.`);
        }
    }

    // 9 - nima zahtevane barve, potem naj ne vrže tiste, katere ima dve enaki v barvah; vrže pa naj max
    if (l_izbrana_karta === C.C_NULL) {
        l_stevilo_kart_v_barvi[0] = 0;
        l_stevilo_kart_v_barvi[1] = 0;
        l_stevilo_kart_v_barvi[2] = 0;
        l_stevilo_kart_v_barvi[3] = 0;
        for (let k = 0; k < 8; k++) {
            if (gameData.karte_igralec[p_igralec][k] !== C.C_NULL) {
                l_temp_barva = utils.get_Barva_Karte(gameData.karte_igralec[p_igralec][k]);
                l_stevilo_kart_v_barvi[l_temp_barva] = l_stevilo_kart_v_barvi[l_temp_barva] + 1;
            }
        }
        l_temp_barva = C.C_BARVA_NULL;
        for (let b = 0; b < 4; b++) {
            if (l_stevilo_kart_v_barvi[b] === 2) {
                if (l_temp_barva === C.C_BARVA_NULL) {
                    l_temp_barva = b;
                }
            }
        }
        if (l_temp_barva !== C.C_BARVA_NULL) {
            for (let k = 0; k < 8; k++) {
                if (gameData.karte_igralec[p_igralec][k] !== C.C_NULL) {
                    if (utils.get_Barva_Karte(gameData.karte_igralec[p_igralec][k]) !== l_temp_barva) {
                        if (l_izbrana_karta === C.C_NULL) {
                            l_izbrana_karta = gameData.karte_igralec[p_igralec][k];
                        } else {
                            if (utils.get_Vrednost_Karte(l_izbrana_karta) < utils.get_Vrednost_Karte(gameData.karte_igralec[p_igralec][k])) {
                                l_izbrana_karta = gameData.karte_igralec[p_igralec][k];
                            }
                        }
                    }
                }
            }
            console.log('[DEBUG]', `Igralec ${p_igralec} vrže max karto, ki je različne barve: ${l_izbrana_karta} (ignorira barvo, v kateri ima 2 karti).`);
        }
    }

    // 10 - nima zahtevane barve - če nič od tega, vrzi max
    if (l_izbrana_karta === C.C_NULL) {
        for (let k = 0; k < 8; k++) {
            if (gameData.karte_igralec[p_igralec][k] !== C.C_NULL) {
                if (l_izbrana_karta === C.C_NULL) {
                    l_izbrana_karta = gameData.karte_igralec[p_igralec][k];
                } else {
                    if (utils.get_Vrednost_Karte(l_izbrana_karta) < utils.get_Vrednost_Karte(gameData.karte_igralec[p_igralec][k])) {
                        l_izbrana_karta = gameData.karte_igralec[p_igralec][k];
                    }
                }
            }
        }
        console.log('[DEBUG]', `Igralec ${p_igralec} vrže max karto, ki je različne barve: ${l_izbrana_karta}.`);
    }

    // Vrni index izbrane karte
    return utils.get_Igralec_Index_Karte(p_igralec, l_izbrana_karta);
}

/**
 * Vrzi_Karto_Igra_12_Na_Karte
 * Origin: uThink.pas lines 1444-1697
 * AI odgovori na že položene karte (igra 12)
 */
function Vrzi_Karto_Igra_12_Na_Karte(p_igralec) {
    const l_zahtevana_barva = utils.get_Barva_Karte(gameData.karte_miza[gameData.igra.igralec_zacel_za_stih]);
    let l_izbrana_karta = C.C_NULL;
    let l_stevilo_kart_v_barvi = [0, 0, 0, 0];
    let l_samo_ena_v_barvi = [C.C_NULL, C.C_NULL, C.C_NULL, C.C_NULL];
    let k, k2, b, s;
    let l_temp_barva;
    let l_karta_zunaj;

    // 1 - ima zahtevano barvo - max karta v barvi, če premaga izzivalca
    l_izbrana_karta = Get_Igralec_Max_Karta_V_Barvi(p_igralec, l_zahtevana_barva);
    if ((l_izbrana_karta !== C.C_NULL) &&
        (utils.get_Vrednost_Karte(l_izbrana_karta) > utils.get_Vrednost_Karte(gameData.karte_miza[gameData.igra.igralec_zacel_za_stih]))) {
        console.log('[DEBUG]', `Igralec ${p_igralec} vrže max karto v zahtevani barvi. Karta je večja od nasprotnikove. Vrže karto: ${l_izbrana_karta}.`);
    } else {
        l_izbrana_karta = C.C_NULL;
    }

    // 2 - ima zahtevano barvo - min karta v barvi
    if (l_izbrana_karta === C.C_NULL) {
        l_izbrana_karta = Get_Igralec_Min_Karta_V_Barvi(p_igralec, l_zahtevana_barva);
        if (l_izbrana_karta !== C.C_KARTA_NULL) {
            console.log('[DEBUG]', `Igralec ${p_igralec} vrže min karto v zahtevani barvi: ${l_izbrana_karta}.`);
        }
    }

    // 3 - nima zahtevane barve - vrzi J, če je edini v tej barvi ali ima v tej barvi edino še Q
    if (l_izbrana_karta === C.C_NULL) {
        for (k = 0; k < 8; k++) {
            if (gameData.karte_igralec[p_igralec][k] !== C.C_NULL) {
                if (utils.get_Tip_Karte(gameData.karte_igralec[p_igralec][k]) === C.C_TIP_J) {
                    if (l_izbrana_karta === C.C_NULL) {
                        l_izbrana_karta = gameData.karte_igralec[p_igralec][k];
                        for (k2 = 0; k2 < 8; k2++) {
                            if (gameData.karte_igralec[p_igralec][k2] !== C.C_NULL) {
                                if (k2 !== k) {
                                    if (utils.get_Tip_Karte(gameData.karte_igralec[p_igralec][k2]) !== C.C_TIP_Q) {
                                        if (utils.get_Barva_Karte(gameData.karte_igralec[p_igralec][k2]) === utils.get_Barva_Karte(gameData.karte_igralec[p_igralec][k])) {
                                            l_izbrana_karta = C.C_NULL;
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
        if (l_izbrana_karta !== C.C_NULL) {
            console.log('[DEBUG]', `Igralec ${p_igralec} vrže J, ker je edini v tej barvi ali pa ima v tej barvi edino še Q. Vrže karto: ${l_izbrana_karta}.`);
        }
    }

    // 4 - nima zahtevane barve - vrzi Q, če je edini v tej barvi, in je J že zunaj
    if (l_izbrana_karta === C.C_NULL) {
        for (k = 0; k < 8; k++) {
            if (gameData.karte_igralec[p_igralec][k] !== C.C_NULL) {
                if (utils.get_Tip_Karte(gameData.karte_igralec[p_igralec][k]) === C.C_TIP_Q) {
                    if (l_izbrana_karta === C.C_NULL) {
                        l_izbrana_karta = gameData.karte_igralec[p_igralec][k];
                        for (k2 = 0; k2 < 8; k2++) {
                            if (gameData.karte_igralec[p_igralec][k2] !== C.C_NULL) {
                                if (k2 !== k) {
                                    if (utils.get_Barva_Karte(gameData.karte_igralec[p_igralec][k2]) === utils.get_Barva_Karte(gameData.karte_igralec[p_igralec][k])) {
                                        l_izbrana_karta = C.C_NULL;
                                    }
                                }
                            }
                        }
                        if (l_izbrana_karta !== C.C_NULL) {
                            // preveri, da je J že zunaj
                            l_karta_zunaj = false;
                            if (gameData.stihi.stevilo_stihov > 0) {
                                for (s = 0; s < gameData.stihi.stevilo_stihov; s++) {
                                    for (k2 = 0; k2 < 4; k2++) {
                                        if ((utils.get_Barva_Karte(gameData.stihi.stih[s].karte[k2]) === utils.get_Barva_Karte(l_izbrana_karta)) &&
                                            (utils.get_Tip_Karte(gameData.stihi.stih[s].karte[k2]) === C.C_TIP_J)) {
                                            l_karta_zunaj = true;
                                        }
                                    }
                                }
                            }
                            if (l_karta_zunaj === false) {
                                l_izbrana_karta = C.C_NULL;
                            }
                        }
                    }
                }
            }
        }
        if (l_izbrana_karta !== C.C_NULL) {
            console.log('[DEBUG]', `Igralec ${p_igralec} vrže Q, ker je edini v tej barvi, J pa je že zunaj. Vrže karto: ${l_izbrana_karta}.`);
        }
    }

    // 5 - nima zahtevane barve - če ima 3 karte ali več v enaki barvi, potem vrzi minimalno
    if (l_izbrana_karta === C.C_NULL) {
        l_stevilo_kart_v_barvi = [0, 0, 0, 0];
        for (k = 0; k < 8; k++) {
            if (gameData.karte_igralec[p_igralec][k] !== C.C_NULL) {
                l_temp_barva = utils.get_Barva_Karte(gameData.karte_igralec[p_igralec][k]);
                l_stevilo_kart_v_barvi[l_temp_barva] = l_stevilo_kart_v_barvi[l_temp_barva] + 1;
            }
        }
        for (b = 0; b < 4; b++) {
            if (l_stevilo_kart_v_barvi[b] >= 3) {
                if (l_izbrana_karta === C.C_NULL) {
                    l_izbrana_karta = Get_Igralec_Min_Karta_V_Barvi(p_igralec, b);
                    console.log('[DEBUG]', `Igralec ${p_igralec} vrže karto min karto v barvi, v kateri ima 3 ali več kart: ${l_izbrana_karta}.`);
                }
            }
        }
    }

    // 6 - nima zahtevane barve - če ima 2 karte v isti barvi in ena izmed njih je A, potem vrzi min
    if (l_izbrana_karta === C.C_NULL) {
        l_stevilo_kart_v_barvi = [0, 0, 0, 0];
        for (k = 0; k < 8; k++) {
            if (gameData.karte_igralec[p_igralec][k] !== C.C_NULL) {
                l_temp_barva = utils.get_Barva_Karte(gameData.karte_igralec[p_igralec][k]);
                l_stevilo_kart_v_barvi[l_temp_barva] = l_stevilo_kart_v_barvi[l_temp_barva] + 1;
            }
        }
        for (b = 0; b < 4; b++) {
            if (l_stevilo_kart_v_barvi[b] === 2) {
                if (l_izbrana_karta === C.C_NULL) {
                    for (k = 0; k < 8; k++) {
                        if (gameData.karte_igralec[p_igralec][k] !== C.C_NULL) {
                            if ((utils.get_Barva_Karte(gameData.karte_igralec[p_igralec][k]) === b) &&
                                (utils.get_Tip_Karte(gameData.karte_igralec[p_igralec][k]) === C.C_TIP_A)) {
                                l_izbrana_karta = Get_Igralec_Min_Karta_V_Barvi(p_igralec, b);
                                console.log('[DEBUG]', `Igralec ${p_igralec} vrže karto min karto v barvi, v kateri ima tudi A. Vrže karto: ${l_izbrana_karta}.`);
                            }
                        }
                    }
                }
            }
        }
    }

    // 7 - nima zahtevane barve - ima vse karte v različnih barvah
    //     potem vrzi tisto, kjer so že vse večje karte zunaj
    /*
    if (l_izbrana_karta === C.C_NULL) {
        l_stevilo_kart_v_barvi = [0, 0, 0, 0];
        for (k = 0; k < 8; k++) {
            if (gameData.karte_igralec[p_igralec][k] !== C.C_NULL) {
                l_temp_barva = utils.get_Barva_Karte(gameData.karte_igralec[p_igralec][k]);
                l_stevilo_kart_v_barvi[l_temp_barva] = l_stevilo_kart_v_barvi[l_temp_barva] + 1;
            }
        }
        if ((l_stevilo_kart_v_barvi[0] <= 1) &&
            (l_stevilo_kart_v_barvi[0] <= 1) &&
            (l_stevilo_kart_v_barvi[0] <= 1) &&
            (l_stevilo_kart_v_barvi[0] <= 1)) {
            // ali so že vse večje zunaj
            // TODO
            // karte z 9:
            //    karte[00] = 17; karte[01] = 14; karte[02] = 8; karte[12] = 9; karte[13] = 5;
            //    karte[03] = 3; karte[04] = 16; karte[05] = 10; karte[14] = 15; karte[15] = 12;
            //    karte[06] = 19; karte[07] = 13; karte[08] = 1; karte[16] = 7; karte[17] = 11;
            //    karte[09] = 18; karte[10] = 2; karte[11] = 4; karte[18] = 6; karte[19] = 0;
        }
    }
    */

    // 8 - nima zahtevane barve - če nima takše karte
    //     potem vrži karto, ki je edino imel v tisti barvi (gleda naj tudi kaj je že vrgel)
    //     če jih je več, potem vrzi min
    if (l_izbrana_karta === C.C_NULL) {
        l_samo_ena_v_barvi = [C.C_NULL, C.C_NULL, C.C_NULL, C.C_NULL];
        for (k = 0; k < 8; k++) {
            if (gameData.karte_igralec[p_igralec][k] !== C.C_NULL) {
                l_temp_barva = utils.get_Barva_Karte(gameData.karte_igralec[p_igralec][k]);
                if (l_samo_ena_v_barvi[l_temp_barva] === C.C_NULL) {
                    l_samo_ena_v_barvi[l_temp_barva] = gameData.karte_igralec[p_igralec][k];
                } else {
                    l_samo_ena_v_barvi[l_temp_barva] = C.C_NULL_MAX;
                }
            }
        }
        if (gameData.stihi.stevilo_stihov > 0) {
            for (k = 0; k < gameData.stihi.stevilo_stihov; k++) {
                if (gameData.stihi.stih[k].karte[p_igralec] !== C.C_NULL) {
                    l_temp_barva = utils.get_Barva_Karte(gameData.stihi.stih[k].karte[p_igralec]);
                    if (l_samo_ena_v_barvi[l_temp_barva] === C.C_NULL) {
                        l_samo_ena_v_barvi[l_temp_barva] = gameData.stihi.stih[k].karte[p_igralec];
                    } else {
                        l_samo_ena_v_barvi[l_temp_barva] = C.C_NULL_MAX;
                    }
                }
            }
        }
        for (b = 0; b < 4; b++) {
            if (l_samo_ena_v_barvi[b] === C.C_NULL_MAX) l_samo_ena_v_barvi[b] = C.C_NULL;
            if (l_samo_ena_v_barvi[b] !== C.C_NULL) {
                if (utils.get_Igralec_Index_Karte(p_igralec, l_samo_ena_v_barvi[b]) !== C.C_NULL) {
                    if (l_izbrana_karta === C.C_NULL) {
                        l_izbrana_karta = l_samo_ena_v_barvi[b];
                    } else {
                        if (utils.get_Tip_Karte(l_izbrana_karta) < utils.get_Tip_Karte(l_samo_ena_v_barvi[b])) {
                            l_izbrana_karta = l_samo_ena_v_barvi[b];
                        }
                    }
                }
            }
        }
        if (l_izbrana_karta !== C.C_NULL) {
            console.log('[DEBUG]', `Igralec ${p_igralec} vrže min karto, ki je bila na začetku edina v takšni barvi barvi: ${l_izbrana_karta}.`);
        }
    }

    // 9 - nima zahtevane barve, potem naj ne vrže tiste, katere ima dve enaki v barvah; vrže pa naj min
    if (l_izbrana_karta === C.C_NULL) {
        l_stevilo_kart_v_barvi = [0, 0, 0, 0];
        for (k = 0; k < 8; k++) {
            if (gameData.karte_igralec[p_igralec][k] !== C.C_NULL) {
                l_temp_barva = utils.get_Barva_Karte(gameData.karte_igralec[p_igralec][k]);
                l_stevilo_kart_v_barvi[l_temp_barva] = l_stevilo_kart_v_barvi[l_temp_barva] + 1;
            }
        }
        l_temp_barva = C.C_BARVA_NULL;
        for (b = 0; b < 4; b++) {
            if (l_stevilo_kart_v_barvi[b] === 2) {
                if (l_temp_barva === C.C_BARVA_NULL) {
                    l_temp_barva = b;
                }
            }
        }
        if (l_temp_barva !== C.C_BARVA_NULL) {
            for (k = 0; k < 8; k++) {
                if (gameData.karte_igralec[p_igralec][k] !== C.C_NULL) {
                    if (utils.get_Barva_Karte(gameData.karte_igralec[p_igralec][k]) !== l_temp_barva) {
                        if (l_izbrana_karta === C.C_NULL) {
                            l_izbrana_karta = gameData.karte_igralec[p_igralec][k];
                        } else {
                            if (utils.get_Vrednost_Karte(l_izbrana_karta) > utils.get_Vrednost_Karte(gameData.karte_igralec[p_igralec][k])) {
                                l_izbrana_karta = gameData.karte_igralec[p_igralec][k];
                            }
                        }
                    }
                }
            }
            console.log('[DEBUG]', `Igralec ${p_igralec} vrže min karto, ki je različne barve: ${l_izbrana_karta} (ignorira barvo, v kateri ima 2 karti).`);
        }
    }

    // 10 - nima zahtevane barve - če nič od tega, vrzi min
    if (l_izbrana_karta === C.C_NULL) {
        for (k = 0; k < 8; k++) {
            if (gameData.karte_igralec[p_igralec][k] !== C.C_NULL) {
                if (l_izbrana_karta === C.C_NULL) {
                    l_izbrana_karta = gameData.karte_igralec[p_igralec][k];
                } else {
                    if (utils.get_Vrednost_Karte(l_izbrana_karta) > utils.get_Vrednost_Karte(gameData.karte_igralec[p_igralec][k])) {
                        l_izbrana_karta = gameData.karte_igralec[p_igralec][k];
                    }
                }
            }
        }
        console.log('[DEBUG]', `Igralec ${p_igralec} vrže min karto, ki je različne barve: ${l_izbrana_karta}.`);
    }

    //
    return utils.get_Igralec_Index_Karte(p_igralec, l_izbrana_karta);
}

// ==========================================
// MAIN AI FUNCTIONS - Exported
// ==========================================

/**
 * Vrzi_Karto
 * Origin: uThink.pas lines 1701-1753
 * Glavna funkcija za AI izbiro karte
 */
export function Vrzi_Karto(p_igralec) {
    let l_index_izbrane = C.C_NULL;

    if (gameData.igra.igralec_zacel_za_stih === p_igralec) {
        // Igralec bo prvi začel
        if (gameData.igra.tip_igre === C.C_IGRA_TIP_3) {
            if (gameData.igra.stevilo_igralcev === 2) l_index_izbrane = Vrzi_Karto_Igra_3_Vrze_Prvi_3P(p_igralec);
            if (gameData.igra.stevilo_igralcev === 3) l_index_izbrane = Vrzi_Karto_Igra_3_Vrze_Prvi_3P(p_igralec);
            if (gameData.igra.stevilo_igralcev === 4) l_index_izbrane = Vrzi_Karto_Igra_3_Vrze_Prvi_4P(p_igralec);
        } else if (gameData.igra.tip_igre === C.C_IGRA_TIP_6) {
            l_index_izbrane = Vrzi_Karto_Igra_6_Vrze_Prvi(p_igralec);
        } else if (gameData.igra.tip_igre === C.C_IGRA_TIP_9) {
            l_index_izbrane = Vrzi_Karto_Igra_9_Vrze_Prvi(p_igralec);
        } else if (gameData.igra.tip_igre === C.C_IGRA_TIP_12) {
            l_index_izbrane = Vrzi_Karto_Igra_12_Vrze_Prvi(p_igralec);
        } else {
            console.log('[ERROR]', 'Vrzi_Karto: Neznana igra.');
        }
    } else {
        // Igralec ni prvi začel
        if (gameData.igra.tip_igre === C.C_IGRA_TIP_3) {
            l_index_izbrane = Vrzi_Karto_Igra_3_Na_Karte(p_igralec);
        } else if (gameData.igra.tip_igre === C.C_IGRA_TIP_6) {
            l_index_izbrane = Vrzi_Karto_Igra_3_Na_Karte(p_igralec); // Isto kot igra 3!
        } else if (gameData.igra.tip_igre === C.C_IGRA_TIP_9) {
            l_index_izbrane = Vrzi_Karto_Igra_9_Na_Karte(p_igralec);
        } else if (gameData.igra.tip_igre === C.C_IGRA_TIP_12) {
            l_index_izbrane = Vrzi_Karto_Igra_12_Na_Karte(p_igralec);
        } else {
            console.log('[ERROR]', 'Vrzi_Karto: Neznana igra.');
        }
    }

    // Fallback - če ni izbral nobene karte
    if (l_index_izbrane === C.C_NULL) {
        console.log('[ERROR]', `Igralec ${p_igralec}: Vrzi_Karto: l_index_izbrane je null, bom kar prvo vrgel...`);
        for (let k = 0; k <= 7; k++) {
            if (gameData.karte_igralec[p_igralec][k] !== C.C_KARTA_NULL) {
                l_index_izbrane = k;
                break;
            }
        }
    }

    return l_index_izbrane;
}

/**
 * izberi_Kontra
 * Poenostavljena verzija - AI odloči ali kontrirati
 */
export function izberi_Kontra(p_igralec) {
    // Enostavna logika - kontra če ima dobre karte
    const tveganje = gameData.nastavitve.igralec_tveganje[p_igralec];

    // Preštej visoke karte
    let highCards = 0;
    for (let k = 0; k < 8; k++) {
        const karta = gameData.karte_igralec[p_igralec][k];
        if (karta !== C.C_KARTA_NULL) {
            const tip = utils.get_Tip_Karte(karta);
            if (tip === C.C_TIP_A || tip === C.C_TIP_10 || tip === C.C_TIP_K) {
                highCards++;
            }
        }
    }

    // Kontra če visoko tveganje in dobre karte
    return tveganje >= C.C_TVEGANJE_VISOKO && highCards >= 5;
}

// ==========================================
// REMOVED FUNCTION: izberi_Adut()
// ==========================================
//
// REASON FOR REMOVAL:
// - Not present in Delphi uThink.pas
// - Not used anywhere in the codebase (replaced by Ruf())
// - Was a simplified version, replaced by proper 1:1 port
//
// REPLACEMENT:
// Use Ruf() from snopc-ruf.js instead:
//   import { Ruf } from './snopc-ruf.js';
//   const result = Ruf(stevilo_igralcev, karta0, karta1, karta2, karta3);
//
// DATE REMOVED: 2025-12-06
// ==========================================

/**
 * zamenjaj_Talon
 * Poenostavljena verzija - AI zamenja talon
 */
export function zamenjaj_Talon(p_igralec) {
    // Enostavna strategija: zamenjaj najšibkejše karte
    const playerCards = [];

    for (let k = 0; k < 8; k++) {
        if (gameData.karte_igralec[p_igralec][k] !== C.C_KARTA_NULL) {
            playerCards.push({
                card: gameData.karte_igralec[p_igralec][k],
                value: utils.get_Vrednost_Karte(gameData.karte_igralec[p_igralec][k])
            });
        }
    }

    // Sortiraj po vrednosti (naraščajoče)
    playerCards.sort((a, b) => a.value - b.value);

    // Vzemi 2 najšibkejši karti
    if (playerCards.length >= 2) {
        return [playerCards[0].card, playerCards[1].card];
    }

    return [];
}

// ==========================================
// EXPORTS FOR EXTERNAL USE (e.g., snopc-rules.js)
// ==========================================

// Export helper functions used by uRules.pas
// In Delphi: uRules.pas calls uThink.Get_Igralec_Max_Karta_V_Barvi()
// In JavaScript: snopc-rules.js should call AI.Get_Igralec_Max_Karta_V_Barvi()
export { Get_Igralec_Min_Karta_V_Barvi, Get_Igralec_Max_Karta_V_Barvi };

// ==========================================
// END OF FILE
// ==========================================
