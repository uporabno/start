// ==========================================
// ŠNOPC - Game Data Structures
// Converted from uData.pas
// ==========================================

import * as C from './snopc-constants.js';

// ==========================================
// DATA STRUCTURES
// ==========================================

// Global game state
export const gameData = {
    // Rufanje (calling trump)
    rufanje_izbrana_karta: {
        barva: C.C_NULL,
        tip: C.C_NULL
    },

    izbrana_igra_igralca: C.C_NULL,

    // Cards
    karte_set: new Array(20).fill(C.C_KARTA_NULL),
    karte_set_pozicija_na_voljo: 0,
    karte_igralec: [
        new Array(20).fill(C.C_KARTA_NULL),
        new Array(20).fill(C.C_KARTA_NULL),
        new Array(20).fill(C.C_KARTA_NULL),
        new Array(20).fill(C.C_KARTA_NULL)
    ],
    karte_miza: new Array(4).fill(C.C_KARTA_NULL),
    karte_talon: new Array(4).fill(C.C_KARTA_NULL),

    // Current game state
    igra: {
        // Positions
        igralec_rufa: C.C_NULL,
        igralec_zacel_za_stih: C.C_NULL,
        igralec_na_potezi: C.C_NULL,

        // Game type
        tip_igre: C.C_NULL,
        tip_igre_predlagal: C.C_NULL,
        tip_igre_kontra: false,

        // Player information
        stevilo_igralcev: 0,
        igralec_igra: [false, false, false, false],
        igralec_vrgel_karto: [false, false, false, false],
        igralec_izbral_igro: [false, false, false, false],
        igralec_izbral_kontra: [false, false, false, false],
        igralec_je_v_skupini: [
            C.C_SKUPINA_NULL,
            C.C_SKUPINA_NULL,
            C.C_SKUPINA_NULL,
            C.C_SKUPINA_NULL
        ],

        // Game status
        status: C.C_IGRA_STATUS_ZACETEK,

        // Game info
        info_talon_zamenjan: false,
        info_adut_zunaj: false
    },

    // Tricks (stihi)
    stihi: {
        stevilo_stihov: 0,
        stih: Array(8).fill(null).map(() => ({
            karte: new Array(20).fill(C.C_KARTA_NULL),
            igralec_zacel: C.C_NULL,
            igralec_pobral: C.C_NULL,
            vrednost_stiha: C.C_NULL
        })),
        tocke_klici_igralec: [0, 0, 0, 0],
        tocke_stihov_igralec: [0, 0, 0, 0],
        tocke_skupaj_igralec: [0, 0, 0, 0]
    },

    // Tournament
    turneja: {
        ena_igra: true,
        igralec_zacel_turnejo: C.C_NULL,
        igralec_zacel_trentno_igro: C.C_NULL,
        igralec_tocke: [0, 0, 0, 0],
        igralec_na_turneji: [false, false, false, false],
        igralec_se_igra: [false, false, false, false],
        stevilo_igralcev_zacetek: 0,
        stevilo_igralcev_trenutno: 0
    },

    // Tournament points
    tocke_turneje: {
        tocke_igre: Array(101).fill(null).map(() => ({
            tocke_igralca: [0, 0, 0, 0]
        })),
        tocke_skupaj_z_igro: Array(101).fill(null).map(() => ({
            tocke_igralca: [0, 0, 0, 0]
        })),
        stevilo_iger: 0,
        max_stevilo_tock: 0
    },

    // Settings
    nastavitve: {
        log_full_log: false,
        igralec_ime: ['Ti', 'Levo', 'Nasproti', 'Desno'],
        igralec_tveganje: [
            C.C_TVEGANJE_SREDNJE,
            C.C_TVEGANJE_SREDNJE,
            C.C_TVEGANJE_SREDNJE,
            C.C_TVEGANJE_SREDNJE
        ]
    },

    predlog_meta_dan: false
};

// ==========================================
// DATA MANIPULATION FUNCTIONS
// ==========================================

export function data_Karte_Igralcev_Reset() {
    // Reset player cards
    for (let i = 0; i < 4; i++) {
        for (let k = 0; k < 20; k++) {
            gameData.karte_igralec[i][k] = C.C_KARTA_NULL;
        }
    }
    // Reset talon cards
    for (let k = 0; k < 4; k++) {
        gameData.karte_talon[k] = C.C_KARTA_NULL;
    }
}

export function data_Stihi_Igralcev_Reset() {
    for (let i = 0; i < 4; i++) {
        gameData.stihi.tocke_klici_igralec[i] = 0;
        gameData.stihi.tocke_stihov_igralec[i] = 0;
        gameData.stihi.tocke_skupaj_igralec[i] = 0;
    }
    for (let i = 0; i < 8; i++) {
        for (let k = 0; k < 20; k++) {
            gameData.stihi.stih[i].karte[k] = C.C_KARTA_NULL;
        }
        gameData.stihi.stih[i].igralec_zacel = C.C_NULL;
        gameData.stihi.stih[i].igralec_pobral = C.C_NULL;
        gameData.stihi.stih[i].vrednost_stiha = C.C_NULL;
    }
    gameData.stihi.stevilo_stihov = 0;
}

function data_Stihi_Osvezi_Skupne_Tocke_Igralca(p_igralec) {
    const l_stihi_skupine = [0, 0, 0];

    // Calculate group totals
    for (let i = 0; i < 4; i++) {
        const skupina = gameData.igra.igralec_je_v_skupini[i];
        if (skupina !== C.C_SKUPINA_NULL) {
            l_stihi_skupine[skupina] += gameData.stihi.tocke_stihov_igralec[i];
        }
    }

    // Update totals for all players
    for (let i = 0; i < 4; i++) {
        if (gameData.igra.igralec_je_v_skupini[i] === C.C_SKUPINA_NULL) {
            if (gameData.stihi.tocke_stihov_igralec[i] === 0) {
                gameData.stihi.tocke_skupaj_igralec[i] = 0;
            } else {
                gameData.stihi.tocke_skupaj_igralec[i] =
                    gameData.stihi.tocke_klici_igralec[i] +
                    gameData.stihi.tocke_stihov_igralec[i];
            }
        } else {
            const skupina = gameData.igra.igralec_je_v_skupini[i];
            if (l_stihi_skupine[skupina] === 0) {
                gameData.stihi.tocke_skupaj_igralec[i] = 0;
            } else {
                gameData.stihi.tocke_skupaj_igralec[i] =
                    gameData.stihi.tocke_klici_igralec[i] +
                    gameData.stihi.tocke_stihov_igralec[i];
            }
        }
    }
}

export function data_Stihi_Dodaj_Igralcu_Klic(p_igralec, p_vrednost) {
    gameData.stihi.tocke_klici_igralec[p_igralec] += p_vrednost;
    data_Stihi_Osvezi_Skupne_Tocke_Igralca(p_igralec);
}

export function data_Stihi_Dodaj_Igralcu_Tocke_Stiha_Igralca(p_igralec, p_vrednost) {
    gameData.stihi.tocke_stihov_igralec[p_igralec] += p_vrednost;
    data_Stihi_Osvezi_Skupne_Tocke_Igralca(p_igralec);
}

export function get_Igralec_Stevilo_Kart(p_igralec) {
    let l_stevilo_kart = 0;
    for (let k = 0; k < 8; k++) {
        if (gameData.karte_igralec[p_igralec][k] !== C.C_KARTA_NULL) {
            l_stevilo_kart++;
        }
    }
    return l_stevilo_kart;
}

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

export function get_Igralec_Ima_Karto(p_igralec, p_karta) {
    let l_ima = false;
    if (p_karta !== C.C_NULL) {
        for (let k = 0; k < 8; k++) {
            if (gameData.karte_igralec[p_igralec][k] === p_karta) {
                l_ima = true;
            }
        }
    }
    return l_ima;
}

export function get_Stevilo_Tock_Skupine_Igralca(p_igralec) {
    let l_skupne_tocke = 0;

    if (gameData.igra.igralec_je_v_skupini[p_igralec] === C.C_SKUPINA_NULL) {
        l_skupne_tocke = gameData.stihi.tocke_skupaj_igralec[p_igralec];
    } else {
        for (let i = 0; i < 4; i++) {
            if (gameData.igra.igralec_je_v_skupini[p_igralec] ===
                gameData.igra.igralec_je_v_skupini[i]) {
                l_skupne_tocke += gameData.stihi.tocke_skupaj_igralec[i];
            }
        }
    }
    return l_skupne_tocke;
}

export function get_Stevilo_Tock_Skupine_Igralca_Teoreticno(p_igralec) {
    let l_skupne_tocke = 0;

    if (gameData.igra.igralec_je_v_skupini[p_igralec] === C.C_SKUPINA_NULL) {
        l_skupne_tocke = gameData.stihi.tocke_klici_igralec[p_igralec] +
                        gameData.stihi.tocke_stihov_igralec[p_igralec];
    } else {
        for (let i = 0; i < 4; i++) {
            if (gameData.igra.igralec_je_v_skupini[p_igralec] ===
                gameData.igra.igralec_je_v_skupini[i]) {
                l_skupne_tocke += gameData.stihi.tocke_klici_igralec[i] +
                                 gameData.stihi.tocke_stihov_igralec[i];
            }
        }
    }
    return l_skupne_tocke;
}

export function set_Igralec_Vrgel_Karto_All_False() {
    for (let i = 0; i < 4; i++) {
        gameData.igra.igralec_vrgel_karto[i] = false;
    }
}
