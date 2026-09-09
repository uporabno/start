// ==========================================
// ŠNOPC - Rufanje (Trump Selection) Module
// Converted from uRuf.pas (1:1 port)
// ==========================================

import * as C from './snopc-constants.js';
import * as utils from './snopc-utils.js';

// ==========================================
// HELPER FUNCTIONS
// ==========================================

/**
 * Get_Tip_MinKiGaNimaVBarvi
 * Origin: uRuf.pas lines 31-54
 * 4 igralci, 2 karti enake, tretja različna:
 * Vrne minimalni tip, ki ga nima v podani barvi
 */
function Get_Tip_MinKiGaNimaVBarvi(p_karte, p_st_kart, p_barva) {
    let l_tip = C.C_TIP_NULL;

    for (let t = 0; t <= 4; t++) {
        let l_ima_tip = false;

        for (let i = 0; i < p_st_kart; i++) {
            if ((utils.get_Barva_Karte(p_karte[i]) === p_barva) &&
                (utils.get_Tip_Karte(p_karte[i]) === t)) {
                l_ima_tip = true;
            }
        }

        if (l_ima_tip === false) {
            l_tip = t;
            break;
        }
    }

    return l_tip;
}

/**
 * Get_Tip_MinKiNiAs
 * Origin: uRuf.pas lines 61-88
 * 4 igralci, vse 3 karte različne:
 * Vrne min tip in barvo, za barvo, ki ima min tip in ta tip ni as
 */
function Get_Tip_MinKiNiAs(p_karte, p_st_kart) {
    let l_min_poz = -1;
    let l_min_tip = C.C_NULL_MAX; // 99

    for (let i = 0; i < p_st_kart; i++) {
        if (utils.get_Tip_Karte(p_karte[i]) !== C.C_TIP_A) {
            if (utils.get_Tip_Karte(p_karte[i]) < l_min_tip) {
                l_min_poz = i;
                l_min_tip = utils.get_Tip_Karte(p_karte[i]);
            }
        }
    }

    let p_out_barva, p_out_tip;

    if (l_min_poz === -1) {
        p_out_barva = utils.get_Barva_Karte(p_karte[0]);
        p_out_tip = C.C_TIP_10;
    } else {
        p_out_barva = utils.get_Barva_Karte(p_karte[l_min_poz]);
        p_out_tip = C.C_TIP_A;
    }

    return { barva: p_out_barva, tip: p_out_tip };
}

/**
 * Get_Barva_MinKarte
 * Origin: uRuf.pas lines 96-111
 * 3 igralci, vse karte različne: vrne barvo minimalne karte
 * 2 igralca, vse karte različne: vrne barvo minimalne karte
 */
function Get_Barva_MinKarte(p_karte, p_st_kart) {
    let l_min_tip = C.C_NULL_MAX;
    let l_barva = C.C_BARVA_NULL;

    for (let i = 0; i < p_st_kart; i++) {
        if (utils.get_Tip_Karte(p_karte[i]) < l_min_tip) {
            l_min_tip = utils.get_Tip_Karte(p_karte[i]);
            l_barva = utils.get_Barva_Karte(p_karte[i]);
        }
    }

    return l_barva;
}

/**
 * Get_Barva_2Enaki2Enaki
 * Origin: uRuf.pas lines 118-137
 * 2 igralca: 2enaki + 2enaki:
 * Vrne barvo če obstaja K+Q v isti barvi, sicer min barvo
 */
function Get_Barva_2Enaki2Enaki(p_karte, p_st_kart) {
    // Preveri K+Q pare
    if ((utils.get_Tip_Karte(p_karte[0]) === C.C_TIP_K) &&
        (utils.get_Tip_Karte(p_karte[1]) === C.C_TIP_Q)) {
        return utils.get_Barva_Karte(p_karte[0]);
    } else if ((utils.get_Tip_Karte(p_karte[2]) === C.C_TIP_K) &&
               (utils.get_Tip_Karte(p_karte[3]) === C.C_TIP_Q)) {
        return utils.get_Barva_Karte(p_karte[2]);
    } else {
        // Primerjaj minimalne tipe
        if (utils.get_Tip_Karte(p_karte[0]) < utils.get_Tip_Karte(p_karte[2])) {
            return utils.get_Barva_Karte(p_karte[0]);
        } else if (utils.get_Tip_Karte(p_karte[0]) > utils.get_Tip_Karte(p_karte[2])) {
            return utils.get_Barva_Karte(p_karte[2]);
        } else {
            // Prvi par je enak, primerjaj drugi
            if (utils.get_Tip_Karte(p_karte[1]) < utils.get_Tip_Karte(p_karte[3])) {
                return utils.get_Barva_Karte(p_karte[1]);
            } else {
                return utils.get_Barva_Karte(p_karte[3]);
            }
        }
    }
}

// ==========================================
// MAIN RUF FUNCTION
// ==========================================

/**
 * Ruf
 * Origin: uRuf.pas lines 144-249
 * Glavna funkcija za izbiro aduta (trump)
 *
 * @param {number} p_st_igralcev - Število igralcev (2, 3, ali 4)
 * @param {number} p_karta0 - ID prve karte
 * @param {number} p_karta1 - ID druge karte
 * @param {number} p_karta2 - ID tretje karte
 * @param {number} p_karta3 - ID četrte karte
 * @returns {object} {barva: integer, tip: integer}
 */
export function Ruf(p_st_igralcev, p_karta0, p_karta1, p_karta2, p_karta3) {
    // Resetiraj out parametre
    let p_out_barva = C.C_BARVA_NULL;
    let p_out_tip = C.C_TIP_NULL;

    // Set l_karte in sort
    const l_karte = [p_karta0, p_karta1, p_karta2, p_karta3];

    if (p_st_igralcev === 2) {
        utils.Sort_Array(l_karte, 4);
    } else {
        utils.Sort_Array(l_karte, 3);
    }

    // Obdelava
    if (p_st_igralcev === 4) {
        //--
        //-- 4 igralci
        //--

        // Vse 3 enake barve
        if ((utils.get_Barva_Karte(l_karte[0]) === utils.get_Barva_Karte(l_karte[1])) &&
            (utils.get_Barva_Karte(l_karte[1]) === utils.get_Barva_Karte(l_karte[2]))) {
            p_out_barva = utils.get_Barva_Karte(l_karte[0]);
            p_out_tip = Get_Tip_MinKiGaNimaVBarvi(l_karte, 3, p_out_barva);
        }
        // 2 enaki barvi
        else if ((utils.get_Barva_Karte(l_karte[0]) === utils.get_Barva_Karte(l_karte[1])) ||
                 (utils.get_Barva_Karte(l_karte[1]) === utils.get_Barva_Karte(l_karte[2]))) {
            p_out_barva = utils.get_Barva_Karte(l_karte[1]);
            p_out_tip = Get_Tip_MinKiGaNimaVBarvi(l_karte, 3, p_out_barva);
        }
        // Vse 3 različne barve
        else {
            const result = Get_Tip_MinKiNiAs(l_karte, 3);
            p_out_barva = result.barva;
            p_out_tip = result.tip;
        }

    } else if (p_st_igralcev === 3) {
        //
        // 3 igralci
        //

        // Vse 3 enake barve
        if ((utils.get_Barva_Karte(l_karte[0]) === utils.get_Barva_Karte(l_karte[1])) &&
            (utils.get_Barva_Karte(l_karte[1]) === utils.get_Barva_Karte(l_karte[2]))) {
            p_out_barva = utils.get_Barva_Karte(l_karte[0]);
        }
        // 2 enaki barvi
        else if ((utils.get_Barva_Karte(l_karte[0]) === utils.get_Barva_Karte(l_karte[1])) ||
                 (utils.get_Barva_Karte(l_karte[1]) === utils.get_Barva_Karte(l_karte[2]))) {
            p_out_barva = utils.get_Barva_Karte(l_karte[1]); // barva srednje
        }
        // Vse 3 različne barve
        else {
            p_out_barva = Get_Barva_MinKarte(l_karte, 3);
        }

    } else if (p_st_igralcev === 2) {
        //
        // 2 igralca
        //

        // Vse 4 enake barve
        if ((utils.get_Barva_Karte(l_karte[0]) === utils.get_Barva_Karte(l_karte[1])) &&
            (utils.get_Barva_Karte(l_karte[1]) === utils.get_Barva_Karte(l_karte[2])) &&
            (utils.get_Barva_Karte(l_karte[2]) === utils.get_Barva_Karte(l_karte[3]))) {
            p_out_barva = utils.get_Barva_Karte(l_karte[0]);
        }
        // 3 enake barve
        else if (((utils.get_Barva_Karte(l_karte[0]) === utils.get_Barva_Karte(l_karte[1])) &&
                  (utils.get_Barva_Karte(l_karte[1]) === utils.get_Barva_Karte(l_karte[2]))) ||
                 ((utils.get_Barva_Karte(l_karte[1]) === utils.get_Barva_Karte(l_karte[2])) &&
                  (utils.get_Barva_Karte(l_karte[2]) === utils.get_Barva_Karte(l_karte[3])))) {
            p_out_barva = utils.get_Barva_Karte(l_karte[1]); // barva druge
        }
        // 2 enaki barvi + 2 enaki barvi
        else if ((utils.get_Barva_Karte(l_karte[0]) === utils.get_Barva_Karte(l_karte[1])) &&
                 (utils.get_Barva_Karte(l_karte[2]) === utils.get_Barva_Karte(l_karte[3]))) {
            p_out_barva = Get_Barva_2Enaki2Enaki(l_karte, 4);
        }
        // 2 enaki barvi
        else if (utils.get_Barva_Karte(l_karte[0]) === utils.get_Barva_Karte(l_karte[1])) {
            p_out_barva = utils.get_Barva_Karte(l_karte[0]);
        } else if (utils.get_Barva_Karte(l_karte[1]) === utils.get_Barva_Karte(l_karte[2])) {
            p_out_barva = utils.get_Barva_Karte(l_karte[1]);
        } else if (utils.get_Barva_Karte(l_karte[2]) === utils.get_Barva_Karte(l_karte[3])) {
            p_out_barva = utils.get_Barva_Karte(l_karte[2]);
        }
        // Vse 4 različne barve
        else {
            p_out_barva = Get_Barva_MinKarte(l_karte, 4);
        }

    } else {
        console.error('uRuf.Ruf: Napačno parameter p_st_igralcev:', p_st_igralcev);
    }

    return { barva: p_out_barva, tip: p_out_tip };
}
