// ==========================================
// CHESS AI ENGINE
// Šahovski AI motor za predlaganje potez
// ==========================================

/**
 * Predlaga poteze za vse levele (1-6), callback se kliče sproti ko je level izračunan
 *
 * @param {string} p_in_stanje_FEN - Trenutno stanje šahovnice v FEN notaciji
 * @param {number} p_in_max_sekund - Maksimalni čas za VSE levele skupaj (v sekundah)
 * @param {function} p_callback - Callback(level, poteza, ocena) - kliče se sproti ko je level gotov
 * @returns {Promise<Array>} - Promise z vsemi izračunanimi predlogi [{level, poteza, ocena}, ...]
 *
 * Opombe:
 * - Če čas poteče, se izračun ustavi in vrne samo zaključene levele
 * - Nižji leveli se izračunajo hitreje (manjša globina)
 * - Višji leveli potrebujejo več časa (večja globina)
 * - Callback omogoča progresivni prikaz rezultatov
 */
async function Predlagaj_Potezo(p_in_stanje_FEN, p_in_max_sekund, p_callback) {
    // Validacija parametrov
    if (!p_in_stanje_FEN || typeof p_in_stanje_FEN !== 'string') {
        throw new Error('Neveljaven FEN string');
    }

    if (!p_in_max_sekund || p_in_max_sekund <= 0) {
        throw new Error('Maksimalni čas mora biti pozitiven');
    }

    const predlogi = [];
    const startTime = Date.now();
    const maxTime = p_in_max_sekund * 1000; // Pretvori v ms

    console.log('AI začenja analizo...', {
        FEN: p_in_stanje_FEN,
        MaxTime: p_in_max_sekund + 's'
    });

    // Izračunaj poteze za vse levele (1-6)
    for (let level = 1; level <= 6; level++) {
        // Preveri če je še čas
        const elapsedTime = Date.now() - startTime;
        if (elapsedTime >= maxTime) {
            console.log(`Čas potekel pri level ${level}. Končujem z ${predlogi.length} predlogi.`);
            break;
        }

        // Preostali čas razporedi med preostale levele
        const remainingTime = maxTime - elapsedTime;
        const remainingLevels = 7 - level; // 6, 5, 4, 3, 2, 1
        const timeForThisLevel = remainingTime / remainingLevels;

        console.log(`Level ${level}: globina=${getSearchDepth(level)}, čas=${(timeForThisLevel/1000).toFixed(2)}s`);

        // Išči najboljšo potezo za ta level
        const rezultat = await isciPotezo(p_in_stanje_FEN, level, timeForThisLevel);

        const predlog = {
            level: level,
            poteza: rezultat.poteza,
            ocena: rezultat.ocena
        };

        predlogi.push(predlog);

        // Callback TAKOJ ko je level готов
        if (p_callback && typeof p_callback === 'function') {
            p_callback(level, rezultat.poteza, rezultat.ocena);
        }

        console.log(`Level ${level} gotov: ${rezultat.poteza} (ocena: ${rezultat.ocena.toFixed(2)})`);
    }

    console.log(`Analiza končana. Izračunano ${predlogi.length}/6 levelov.`);
    return predlogi;
}


/**
 * Išče najboljšo potezo za podani level z iterative deepening
 * @param {string} fen - FEN notacija pozicije
 * @param {number} level - Nivo težavnosti (1-6)
 * @param {number} maxTime - Maksimalni čas v ms
 * @returns {Promise<{poteza: string, ocena: number}>}
 */
async function isciPotezo(fen, level, maxTime) {
    return new Promise((resolve) => {
        const startTime = Date.now();
        const maxGlobina = getSearchDepth(level);

        // Ustvari chess.js instanco za to pozicijo
        const chess = new Chess(fen);

        // Preveri če je igra že končana
        if (chess.isGameOver()) {
            const moves = chess.moves();
            if (moves.length > 0) {
                resolve({
                    poteza: moves[0],
                    ocena: 0
                });
            } else {
                resolve({
                    poteza: null,
                    ocena: 0
                });
            }
            return;
        }

        // Iterative deepening - začni z globino 1 in povečuj
        let bestMove = null;
        let bestScore = 0;
        let globina = 1;

        while (globina <= maxGlobina) {
            // Preveri časovno omejitev (95% časa, da imamo rezervo)
            if (Date.now() - startTime >= maxTime * 0.95) {
                break;
            }

            // Pozor: maksimizira = true če je na potezi beli, false če črni
            const maksimizira = chess.turn() === 'w';

            // Kliči minimax za trenutno globino
            const rezultat = minimax(chess, globina, -Infinity, Infinity, maksimizira);

            // Če smo našli potezo, posodobi najboljšo
            if (rezultat.poteza) {
                bestMove = rezultat.poteza;
                bestScore = rezultat.ocena;
            }

            globina++;
        }

        // Če iz nekega razloga ni poteze, vzemi naključno veljavno
        if (!bestMove) {
            const moves = chess.moves();
            if (moves.length > 0) {
                // Dodaj variabilnost glede na nivo
                if (shouldMakeMistake(level)) {
                    // Nižji nivoji naredijo naključno potezo
                    bestMove = moves[Math.floor(Math.random() * moves.length)];
                } else {
                    // Višji nivoji vzamejo prvo potezo (ki je že sortirana)
                    bestMove = moves[0];
                }
                bestScore = 0;
            }
        }

        // Pretvori oceno iz centipawnov v pawne (deljeno z 100)
        const scoreInPawns = bestScore / 100;

        resolve({
            poteza: bestMove,
            ocena: scoreInPawns
        });
    });
}


/**
 * Oceni pozicijo na šahovnici
 * @param {Chess} chessInstance - chess.js instanca s trenutno pozicijo
 * @returns {number} - Ocena pozicije (pozitivno = prednost belih, negativno = prednost črnih)
 */
function oceniPozicijo(chessInstance) {
    // Če je mat, vrni ekstremno vrednost
    if (chessInstance.isCheckmate()) {
        return chessInstance.turn() === 'w' ? -99999 : 99999;
    }

    // Če je pat ali remi, vrni 0
    if (chessInstance.isDraw() || chessInstance.isStalemate() || chessInstance.isThreefoldRepetition()) {
        return 0;
    }

    let ocena = 0;

    // ===== MATERIAL EVALUATION =====
    const vrednostiFigur = {
        'p': 100,   // Pešec
        'n': 320,   // Konj
        'b': 330,   // Lovec
        'r': 500,   // Trdnjava
        'q': 900,   // Dama
        'k': 20000  // Kralj (simbolična vrednost)
    };

    // ===== POZICIJSKE TABELE (Piece-Square Tables) =====
    // Pozitivne vrednosti za polja kjer je figura močnejša

    // Pešci - spodbujaj napredovanje in center control
    const pstPawn = [
        [  0,  0,  0,  0,  0,  0,  0,  0],
        [ 50, 50, 50, 50, 50, 50, 50, 50],
        [ 10, 10, 20, 30, 30, 20, 10, 10],
        [  5,  5, 10, 25, 25, 10,  5,  5],
        [  0,  0,  0, 20, 20,  0,  0,  0],
        [  5, -5,-10,  0,  0,-10, -5,  5],
        [  5, 10, 10,-20,-20, 10, 10,  5],
        [  0,  0,  0,  0,  0,  0,  0,  0]
    ];

    // Konji - najboljši v centru
    const pstKnight = [
        [-50,-40,-30,-30,-30,-30,-40,-50],
        [-40,-20,  0,  0,  0,  0,-20,-40],
        [-30,  0, 10, 15, 15, 10,  0,-30],
        [-30,  5, 15, 20, 20, 15,  5,-30],
        [-30,  0, 15, 20, 20, 15,  0,-30],
        [-30,  5, 10, 15, 15, 10,  5,-30],
        [-40,-20,  0,  5,  5,  0,-20,-40],
        [-50,-40,-30,-30,-30,-30,-40,-50]
    ];

    // Lovci - diagonale in center
    const pstBishop = [
        [-20,-10,-10,-10,-10,-10,-10,-20],
        [-10,  0,  0,  0,  0,  0,  0,-10],
        [-10,  0,  5, 10, 10,  5,  0,-10],
        [-10,  5,  5, 10, 10,  5,  5,-10],
        [-10,  0, 10, 10, 10, 10,  0,-10],
        [-10, 10, 10, 10, 10, 10, 10,-10],
        [-10,  5,  0,  0,  0,  0,  5,-10],
        [-20,-10,-10,-10,-10,-10,-10,-20]
    ];

    // Trdnjave - odprte linije in 7. vrsta
    const pstRook = [
        [  0,  0,  0,  0,  0,  0,  0,  0],
        [  5, 10, 10, 10, 10, 10, 10,  5],
        [ -5,  0,  0,  0,  0,  0,  0, -5],
        [ -5,  0,  0,  0,  0,  0,  0, -5],
        [ -5,  0,  0,  0,  0,  0,  0, -5],
        [ -5,  0,  0,  0,  0,  0,  0, -5],
        [ -5,  0,  0,  0,  0,  0,  0, -5],
        [  0,  0,  0,  5,  5,  0,  0,  0]
    ];

    // Dama - centralna pozicija
    const pstQueen = [
        [-20,-10,-10, -5, -5,-10,-10,-20],
        [-10,  0,  0,  0,  0,  0,  0,-10],
        [-10,  0,  5,  5,  5,  5,  0,-10],
        [ -5,  0,  5,  5,  5,  5,  0, -5],
        [  0,  0,  5,  5,  5,  5,  0, -5],
        [-10,  5,  5,  5,  5,  5,  0,-10],
        [-10,  0,  5,  0,  0,  0,  0,-10],
        [-20,-10,-10, -5, -5,-10,-10,-20]
    ];

    // Kralj - zgodnja igra (varnost), pozna igra (aktivnost)
    const pstKingMiddlegame = [
        [-30,-40,-40,-50,-50,-40,-40,-30],
        [-30,-40,-40,-50,-50,-40,-40,-30],
        [-30,-40,-40,-50,-50,-40,-40,-30],
        [-30,-40,-40,-50,-50,-40,-40,-30],
        [-20,-30,-30,-40,-40,-30,-30,-20],
        [-10,-20,-20,-20,-20,-20,-20,-10],
        [ 20, 20,  0,  0,  0,  0, 20, 20],
        [ 20, 30, 10,  0,  0, 10, 30, 20]
    ];

    const pstKingEndgame = [
        [-50,-40,-30,-20,-20,-30,-40,-50],
        [-30,-20,-10,  0,  0,-10,-20,-30],
        [-30,-10, 20, 30, 30, 20,-10,-30],
        [-30,-10, 30, 40, 40, 30,-10,-30],
        [-30,-10, 30, 40, 40, 30,-10,-30],
        [-30,-10, 20, 30, 30, 20,-10,-30],
        [-30,-30,  0,  0,  0,  0,-30,-30],
        [-50,-30,-30,-30,-30,-30,-30,-50]
    ];

    // Preveri ali smo v endgame (manj figur na deski)
    const board = chessInstance.board();
    let totalPieces = 0;
    for (let row of board) {
        for (let square of row) {
            if (square) totalPieces++;
        }
    }
    const isEndgame = totalPieces <= 12; // Endgame če <= 12 figur

    // Evalviraj vse figure
    for (let row = 0; row < 8; row++) {
        for (let col = 0; col < 8; col++) {
            const square = board[row][col];
            if (!square) continue;

            const tip = square.type;
            const barva = square.color;
            const vrednost = vrednostiFigur[tip];

            // Material
            let vrednostFigure = vrednost;

            // Pozicijska tabela (za bele je row=0 spodaj, za črne obratno)
            let pozicijskaVrednost = 0;
            const pstRow = barva === 'w' ? 7 - row : row;

            switch (tip) {
                case 'p': pozicijskaVrednost = pstPawn[pstRow][col]; break;
                case 'n': pozicijskaVrednost = pstKnight[pstRow][col]; break;
                case 'b': pozicijskaVrednost = pstBishop[pstRow][col]; break;
                case 'r': pozicijskaVrednost = pstRook[pstRow][col]; break;
                case 'q': pozicijskaVrednost = pstQueen[pstRow][col]; break;
                case 'k':
                    pozicijskaVrednost = isEndgame ?
                        pstKingEndgame[pstRow][col] :
                        pstKingMiddlegame[pstRow][col];
                    break;
            }

            const skupnaVrednost = vrednostFigure + pozicijskaVrednost;

            // Dodaj/odvzemi glede na barvo
            ocena += barva === 'w' ? skupnaVrednost : -skupnaVrednost;
        }
    }

    // ===== DODATNI BONUSI =====

    // Mobilnost (število veljavnih potez)
    const moves = chessInstance.moves();
    const mobiliteta = moves.length * 10; // 10 centipawnov na potezo
    ocena += chessInstance.turn() === 'w' ? mobiliteta : -mobiliteta;

    // Bishop pair bonus (oba lovca)
    let whiteBishops = 0, blackBishops = 0;
    for (let row of board) {
        for (let square of row) {
            if (square && square.type === 'b') {
                if (square.color === 'w') whiteBishops++;
                else blackBishops++;
            }
        }
    }
    if (whiteBishops >= 2) ocena += 50;
    if (blackBishops >= 2) ocena -= 50;

    return ocena;
}


/**
 * Minimax algoritem z alpha-beta pruning
 * @param {Chess} chessInstance - chess.js instanca
 * @param {number} globina - Globina iskanja
 * @param {number} alpha - Alpha vrednost (MIN mejnik)
 * @param {number} beta - Beta vrednost (MAX mejnik)
 * @param {boolean} maksimizira - Ali maksimiziramo (true = beli, false = črni)
 * @returns {object} - {ocena, poteza}
 */
function minimax(chessInstance, globina, alpha, beta, maksimizira) {
    // Terminalni pogoji
    if (globina === 0) {
        return {
            ocena: oceniPozicijo(chessInstance),
            poteza: null
        };
    }

    // Preveri konec igre
    if (chessInstance.isGameOver()) {
        if (chessInstance.isCheckmate()) {
            // Mat: ekstremna vrednost glede na kdo je na potezi
            return {
                ocena: maksimizira ? -99999 + (6 - globina) : 99999 - (6 - globina),
                poteza: null
            };
        } else {
            // Pat/remi: 0
            return {
                ocena: 0,
                poteza: null
            };
        }
    }

    const poteze = chessInstance.moves({ verbose: true });

    // Če ni potez (ne bi se smelo zgoditi)
    if (poteze.length === 0) {
        return {
            ocena: oceniPozicijo(chessInstance),
            poteza: null
        };
    }

    // Razvrsti poteze za boljši alpha-beta pruning
    // 1. Zajemi (captures) najprej
    // 2. Nato druge poteze
    poteze.sort((a, b) => {
        const scoreA = (a.captured ? 10 : 0) + (a.promotion ? 9 : 0);
        const scoreB = (b.captured ? 10 : 0) + (b.promotion ? 9 : 0);
        return scoreB - scoreA;
    });

    let najboljsaPoteza = null;

    if (maksimizira) {
        // Maksimizacija (beli igralec)
        let maxEval = -Infinity;

        for (let poteza of poteze) {
            // Naredi potezo
            chessInstance.move(poteza);

            // Rekurzivni klic
            const evalvacija = minimax(chessInstance, globina - 1, alpha, beta, false);

            // Razveljavi potezo
            chessInstance.undo();

            // Posodobi maksimum
            if (evalvacija.ocena > maxEval) {
                maxEval = evalvacija.ocena;
                najboljsaPoteza = poteza.san;
            }

            // Alpha-beta pruning
            alpha = Math.max(alpha, evalvacija.ocena);
            if (beta <= alpha) {
                break; // Beta cut-off
            }
        }

        return {
            ocena: maxEval,
            poteza: najboljsaPoteza
        };

    } else {
        // Minimizacija (črni igralec)
        let minEval = Infinity;

        for (let poteza of poteze) {
            // Naredi potezo
            chessInstance.move(poteza);

            // Rekurzivni klic
            const evalvacija = minimax(chessInstance, globina - 1, alpha, beta, true);

            // Razveljavi potezo
            chessInstance.undo();

            // Posodobi minimum
            if (evalvacija.ocena < minEval) {
                minEval = evalvacija.ocena;
                najboljsaPoteza = poteza.san;
            }

            // Alpha-beta pruning
            beta = Math.min(beta, evalvacija.ocena);
            if (beta <= alpha) {
                break; // Alpha cut-off
            }
        }

        return {
            ocena: minEval,
            poteza: najboljsaPoteza
        };
    }
}


/**
 * Dobi globino iskanja glede na nivo težavnosti
 * @param {number} level - Nivo (1-6)
 * @returns {number} - Globina iskanja
 *
 * Približne ELO ocene:
 * Level 1 (globina 2): ~800 ELO  - Začetnik
 * Level 2 (globina 3): ~1000 ELO - Rekreativec
 * Level 3 (globina 4): ~1200 ELO - Klub igralec
 * Level 4 (globina 5): ~1400 ELO - Srednji klub igralec
 * Level 5 (globina 6): ~1700 ELO - Močan klub igralec
 * Level 6 (globina 7): ~2000+ ELO - Expert/Master
 */
function getSearchDepth(level) {
    const depths = {
        1: 2,  // Začetnik - zelo plitvo
        2: 3,  // Rekreativec
        3: 4,  // Klub igralec
        4: 5,  // Srednji
        5: 6,  // Močan
        6: 7   // Mojster/Expert
    };

    return depths[level] || 4; // Default srednji nivo
}


/**
 * Simulira "razmišljanje" - dodaja naključno napako pri nižjih nivojih
 * @param {number} level - Nivo težavnosti
 * @returns {boolean} - Ali naj AI naredi napako
 */
function shouldMakeMistake(level) {
    const errorRates = {
        1: 0.30,  // 30% napak za začetnike
        2: 0.20,  // 20% napak
        3: 0.10,  // 10% napak
        4: 0.05,  // 5% napak
        5: 0.02,  // 2% napak
        6: 0.00   // Brez napak za mojstre
    };

    const errorRate = errorRates[level] || 0.10;
    return Math.random() < errorRate;
}


// Export za uporabo v glavnem modulu
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        Predlagaj_Potezo,
        oceniPozicijo,
        minimax,
        getSearchDepth,
        shouldMakeMistake
    };
}
