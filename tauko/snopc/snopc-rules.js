// ==========================================
// ŠNOPC - Game Rules Engine
// Converted from uRules.pas
// ==========================================

import * as C from './snopc-constants.js';
import { gameData } from './snopc-data.js';
import * as utils from './snopc-utils.js';
import { log_Add } from './snopc-game.js';
import { Get_Igralec_Max_Karta_V_Barvi, Get_Igralec_Min_Karta_V_Barvi } from './snopc-ai.js';

// ==========================================
// CARD PLAY VALIDATION
// ==========================================

// Check if card play is allowed according to game rules
// This is the main rule validation function
export function met_Karte_Dovoljen(p_karta) {
    let l_met_karte_dovoljen = true;

    // Only check if player is not starting the trick
    if (gameData.igra.igralec_zacel_za_stih !== 0) {

        if (gameData.igra.tip_igre === C.C_IGRA_TIP_3 ||
            gameData.igra.tip_igre === C.C_IGRA_TIP_6) {

            // Check suit and "taking over" rules
            const l_prva_karta_na_mizi = gameData.karte_miza[gameData.igra.igralec_zacel_za_stih];

            // Find strongest card on table
            let l_najmocnejsa_karta_na_mizi = gameData.karte_miza[gameData.igra.igralec_zacel_za_stih];

            for (let i_special = gameData.igra.igralec_zacel_za_stih + 1;
                 i_special < gameData.igra.igralec_zacel_za_stih + 4;
                 i_special++) {
                const i = i_special % 4;

                if (gameData.karte_miza[i] !== C.C_NULL) {
                    const barva_najm = utils.get_Barva_Karte(l_najmocnejsa_karta_na_mizi);
                    const barva_i = utils.get_Barva_Karte(gameData.karte_miza[i]);
                    const tip_najm = utils.get_Tip_Karte(l_najmocnejsa_karta_na_mizi);
                    const tip_i = utils.get_Tip_Karte(gameData.karte_miza[i]);

                    // Same suit
                    if (barva_najm === barva_i) {
                        if (tip_najm > tip_i) { // Lower type number is stronger (Ace = 0)
                            l_najmocnejsa_karta_na_mizi = gameData.karte_miza[i];
                        }
                    }
                    // Card i is trump
                    else if (barva_i === gameData.rufanje_izbrana_karta.barva) {
                        l_najmocnejsa_karta_na_mizi = gameData.karte_miza[i];
                    }
                }
            }

            const barva_karta = utils.get_Barva_Karte(p_karta);
            const tip_karta = utils.get_Tip_Karte(p_karta);
            const barva_prva = utils.get_Barva_Karte(l_prva_karta_na_mizi);
            const tip_prva = utils.get_Tip_Karte(l_prva_karta_na_mizi);
            const barva_najm = utils.get_Barva_Karte(l_najmocnejsa_karta_na_mizi);
            const tip_najm = utils.get_Tip_Karte(l_najmocnejsa_karta_na_mizi);

            if (barva_karta === barva_prva) {
                // Played card in starting suit
                if (barva_prva === barva_najm) {
                    // Trump hasn't been played yet, check if card is high enough
                    const max_karta = Get_Igralec_Max_Karta_V_Barvi(0, barva_karta);
                    if (max_karta !== C.C_NULL) {
                        const tip_max = utils.get_Tip_Karte(max_karta);
                        if (tip_karta > tip_najm && tip_max < tip_najm) {
                            l_met_karte_dovoljen = false;
                            if (log_Add) {
                                log_Add(C.C_LOG_WARNING, 'Met karte ni dovoljen, ker karta ni dovolj visoka.');
                            }
                        }
                    }
                }
            } else {
                // Didn't play starting suit
                // Check if has card in starting suit
                if (Get_Igralec_Max_Karta_V_Barvi(0, barva_prva) !== C.C_NULL) {
                    l_met_karte_dovoljen = false;
                    if (log_Add) {
                        log_Add(C.C_LOG_WARNING, 'Met karte ni dovoljen, ker barva ni enaka barvi prve karte.');
                    }
                } else {
                    // Doesn't have starting suit
                    if (barva_karta === gameData.rufanje_izbrana_karta.barva) {
                        // Played trump
                        if (barva_karta === barva_najm) {
                            // Trump has already been played, must go over
                            const max_karta = Get_Igralec_Max_Karta_V_Barvi(0, barva_karta);
                            if (max_karta !== C.C_NULL) {
                                const tip_max = utils.get_Tip_Karte(max_karta);
                                if (tip_karta > tip_najm && tip_max < tip_najm) {
                                    l_met_karte_dovoljen = false;
                                    if (log_Add) {
                                        log_Add(C.C_LOG_WARNING, 'Met karte ni dovoljen, ker karta v barvi aduta ni dovolj visoka.');
                                    }
                                }
                            }
                        }
                    } else {
                        // Didn't play trump
                        // Check if has trump
                        if (Get_Igralec_Max_Karta_V_Barvi(0, gameData.rufanje_izbrana_karta.barva) !== C.C_NULL) {
                            l_met_karte_dovoljen = false;
                            if (log_Add) {
                                log_Add(C.C_LOG_WARNING, 'Met karte ni dovoljen, ker barva ni enaka barvi prve karte ali barvi aduta.');
                            }
                        }
                    }
                }
            }
        }
        // Game 9 or 12 - Just check suit
        else if (gameData.igra.tip_igre === C.C_IGRA_TIP_9 ||
                 gameData.igra.tip_igre === C.C_IGRA_TIP_12) {

            const l_prva_karta_na_mizi = gameData.karte_miza[gameData.igra.igralec_zacel_za_stih];
            const barva_prva = utils.get_Barva_Karte(l_prva_karta_na_mizi);
            const barva_karta = utils.get_Barva_Karte(p_karta);

            if (barva_prva !== barva_karta) {
                if (Get_Igralec_Min_Karta_V_Barvi(0, barva_prva) !== C.C_NULL) {
                    l_met_karte_dovoljen = false;
                    if (log_Add) {
                        log_Add(C.C_LOG_WARNING, 'Met karte ni dovoljen, ker barva ni ustrezna.');
                    }
                }
            }
        }
    }

    return l_met_karte_dovoljen;
}

// ==========================================
// HELPER FUNCTIONS - NOW IMPORTED FROM snopc-ai.js
// ==========================================

// REMOVED: Local definitions of get_Igralec_Max_Karta_V_Barvi and get_Igralec_Min_Karta_V_Barvi
// These functions are now imported from snopc-ai.js (uThink.pas equivalent)
// This matches Delphi architecture where uRules.pas calls uThink functions

// In Delphi:
//   uRules.pas → uses uThink → calls uThink.Get_Igralec_Max_Karta_V_Barvi()
// In JavaScript:
//   snopc-rules.js → imports snopc-ai.js → calls Get_Igralec_Max_Karta_V_Barvi()
