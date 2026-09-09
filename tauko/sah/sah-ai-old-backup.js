// ==========================================
// CHESS AI ENGINE v2.0 - ADVANCED
// Profesionalni šahovski AI motor
// ==========================================

// ==========================================
// GLOBALNE STRUKTURE
// ==========================================

// Transposition Table - cache za že preiskane pozicije
const transpositionTable = new Map();
const MAX_TT_SIZE = 1000000; // 1M pozicij

// Killer moves - poteze ki so povzročile beta cutoff
const killerMoves = Array(20).fill(null).map(() => [null, null]); // 2 killer moves na globino

// History heuristic - score za poteze ki so bile dobre
const historyTable = {};

// Opening book - knjižnica otvoritev
const openingBook = {
    'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1': ['e4', 'd4', 'Nf3', 'c4'],
    'rnbqkbnr/pppppppp/8/8/4P3/8/PPPP1PPP/RNBQKBNR b KQkq e3 0 1': ['e5', 'c5', 'e6', 'c6'],
    'rnbqkbnr/pppppppp/8/8/3P4/8/PPP1PPPP/RNBQKBNR b KQkq d3 0 1': ['d5', 'Nf6', 'e6', 'c6'],
    'rnbqkbnr/pppp1ppp/8/4p3/4P3/8/PPPP1PPP/RNBQKBNR w KQkq e6 0 2': ['Nf3', 'Nc3', 'Bc4'],
    'rnbqkbnr/ppp1pppp/8/3p4/3P4/8/PPP1PPPP/RNBQKBNR w KQkq d6 0 2': ['c4', 'Nf3', 'e3'],
};

// Statistika za debugging
let nodesSearched = 0;
let ttHits = 0;
let betaCutoffs = 0;

// ==========================================
// EVALVACIJA POZICIJE - IZPOPOLNJENA
// ==========================================

/**
 * Oceni pozicijo na šahovnici (ADVANCED VERSION)
 */
function oceniPozicijo(chessInstance) {
    // Če je mat, vrni ekstremno vrednost
    if (chessInstance.in_checkmate()) {
        return chessInstance.turn() === 'w' ? -999999 : 999999;
    }

    // Če je pat ali remi, vrni 0
    if (chessInstance.in_draw() || chessInstance.in_stalemate() || chessInstance.in_threefold_repetition()) {
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
        'k': 20000  // Kralj
    };

    // ===== PIECE-SQUARE TABLES (IZBOLJŠANE) =====

    // Pešci - spodbujaj napredovanje, center control, in passed pawns
    const pstPawn = [
        [  0,  0,  0,  0,  0,  0,  0,  0],
        [ 50, 50, 50, 50, 50, 50, 50, 50],
        [ 10, 10, 20, 30, 30, 20, 10, 10],
        [  5,  5, 10, 27, 27, 10,  5,  5],
        [  0,  0,  0, 25, 25,  0,  0,  0],
        [  5, -5,-10,  0,  0,-10, -5,  5],
        [  5, 10, 10,-25,-25, 10, 10,  5],
        [  0,  0,  0,  0,  0,  0,  0,  0]
    ];

    const pstKnight = [
        [-50,-40,-30,-30,-30,-30,-40,-50],
        [-40,-20,  0,  5,  5,  0,-20,-40],
        [-30,  5, 10, 15, 15, 10,  5,-30],
        [-30,  0, 15, 20, 20, 15,  0,-30],
        [-30,  5, 15, 20, 20, 15,  5,-30],
        [-30,  0, 10, 15, 15, 10,  0,-30],
        [-40,-20,  0,  0,  0,  0,-20,-40],
        [-50,-40,-20,-30,-30,-20,-40,-50]
    ];

    const pstBishop = [
        [-20,-10,-10,-10,-10,-10,-10,-20],
        [-10,  5,  0,  0,  0,  0,  5,-10],
        [-10, 10,  5, 10, 10,  5, 10,-10],
        [-10,  0, 10, 10, 10, 10,  0,-10],
        [-10,  5,  5, 10, 10,  5,  5,-10],
        [-10,  0,  5, 10, 10,  5,  0,-10],
        [-10,  0,  0,  0,  0,  0,  0,-10],
        [-20,-10,-40,-10,-10,-40,-10,-20]
    ];

    const pstRook = [
        [  0,  0,  0,  5,  5,  0,  0,  0],
        [ -5,  0,  0,  0,  0,  0,  0, -5],
        [ -5,  0,  0,  0,  0,  0,  0, -5],
        [ -5,  0,  0,  0,  0,  0,  0, -5],
        [ -5,  0,  0,  0,  0,  0,  0, -5],
        [ -5,  0,  0,  0,  0,  0,  0, -5],
        [  5, 10, 10, 10, 10, 10, 10,  5],
        [  0,  0,  0,  0,  0,  0,  0,  0]
    ];

    const pstQueen = [
        [-20,-10,-10, -5, -5,-10,-10,-20],
        [-10,  0,  5,  0,  0,  0,  0,-10],
        [-10,  5,  5,  5,  5,  5,  0,-10],
        [  0,  0,  5,  5,  5,  5,  0, -5],
        [ -5,  0,  5,  5,  5,  5,  0, -5],
        [-10,  0,  5,  5,  5,  5,  0,-10],
        [-10,  0,  0,  0,  0,  0,  0,-10],
        [-20,-10,-10, -5, -5,-10,-10,-20]
    ];

    const pstKingMiddlegame = [
        [ 20, 30, 10,  0,  0, 10, 30, 20],
        [ 20, 20,  0,  0,  0,  0, 20, 20],
        [-10,-20,-20,-20,-20,-20,-20,-10],
        [-20,-30,-30,-40,-40,-30,-30,-20],
        [-30,-40,-40,-50,-50,-40,-40,-30],
        [-30,-40,-40,-50,-50,-40,-40,-30],
        [-30,-40,-40,-50,-50,-40,-40,-30],
        [-30,-40,-40,-50,-50,-40,-40,-30]
    ];

    const pstKingEndgame = [
        [-50,-30,-30,-30,-30,-30,-30,-50],
        [-30,-30,  0,  0,  0,  0,-30,-30],
        [-30,-10, 20, 30, 30, 20,-10,-30],
        [-30,-10, 30, 40, 40, 30,-10,-30],
        [-30,-10, 30, 40, 40, 30,-10,-30],
        [-30,-10, 20, 30, 30, 20,-10,-30],
        [-30,-20,-10,  0,  0,-10,-20,-30],
        [-50,-40,-30,-20,-20,-30,-40,-50]
    ];

    // Preveri faza igre
    const board = chessInstance.board();
    let totalPieces = 0;
    let whiteQueens = 0, blackQueens = 0;

    for (let row of board) {
        for (let square of row) {
            if (square) {
                totalPieces++;
                if (square.type === 'q') {
                    if (square.color === 'w') whiteQueens++;
                    else blackQueens++;
                }
            }
        }
    }

    const isEndgame = totalPieces <= 12 || (whiteQueens === 0 && blackQueens === 0);

    // Evalviraj material in pozicijo
    for (let row = 0; row < 8; row++) {
        for (let col = 0; col < 8; col++) {
            const square = board[row][col];
            if (!square) continue;

            const tip = square.type;
            const barva = square.color;
            const vrednost = vrednostiFigur[tip];

            let vrednostFigure = vrednost;
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
            ocena += barva === 'w' ? skupnaVrednost : -skupnaVrednost;
        }
    }

    // ===== DODATNI BONUSI =====

    // Mobilnost (število veljavnih potez)
    const moves = chessInstance.moves();
    const mobiliteta = moves.length * 10;
    ocena += chessInstance.turn() === 'w' ? mobiliteta : -mobiliteta;

    // Bishop pair bonus
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

    // Doubled pawns penalty
    const whitePawnCols = Array(8).fill(0);
    const blackPawnCols = Array(8).fill(0);

    for (let row = 0; row < 8; row++) {
        for (let col = 0; col < 8; col++) {
            const square = board[row][col];
            if (square && square.type === 'p') {
                if (square.color === 'w') whitePawnCols[col]++;
                else blackPawnCols[col]++;
            }
        }
    }

    for (let col = 0; col < 8; col++) {
        if (whitePawnCols[col] > 1) ocena -= (whitePawnCols[col] - 1) * 15;
        if (blackPawnCols[col] > 1) ocena += (blackPawnCols[col] - 1) * 15;
    }

    // King safety - penalty če je kralj izpostavljen
    if (!isEndgame) {
        if (chessInstance.in_check()) {
            ocena += chessInstance.turn() === 'w' ? -50 : 50;
        }
    }

    return ocena;
}

// ==========================================
// QUIESCENCE SEARCH - Preišči captures do mirne pozicije
// ==========================================

function quiescenceSearch(chessInstance, alpha, beta, maksimizira) {
    nodesSearched++;

    const standPat = oceniPozicijo(chessInstance);

    if (maksimizira) {
        if (standPat >= beta) return beta;
        if (alpha < standPat) alpha = standPat;
    } else {
        if (standPat <= alpha) return alpha;
        if (beta > standPat) beta = standPat;
    }

    // Samo captures (zajemi)
    const captures = chessInstance.moves({ verbose: true }).filter(m => m.captured);

    // MVV-LVA ordering (Most Valuable Victim - Least Valuable Attacker)
    const pieceValues = { 'p': 1, 'n': 3, 'b': 3, 'r': 5, 'q': 9, 'k': 100 };
    captures.sort((a, b) => {
        const scoreA = pieceValues[a.captured] * 10 - pieceValues[a.piece];
        const scoreB = pieceValues[b.captured] * 10 - pieceValues[b.piece];
        return scoreB - scoreA;
    });

    for (let move of captures) {
        chessInstance.move(move);
        const score = quiescenceSearch(chessInstance, alpha, beta, !maksimizira);
        chessInstance.undo();

        if (maksimizira) {
            if (score >= beta) return beta;
            if (score > alpha) alpha = score;
        } else {
            if (score <= alpha) return alpha;
            if (score < beta) beta = score;
        }
    }

    return maksimizira ? alpha : beta;
}

// ==========================================
// MOVE ORDERING - Razvrsti poteze za boljši pruning
// ==========================================

function orderMoves(moves, killerMoves, globina) {
    const pieceValues = { 'p': 1, 'n': 3, 'b': 3, 'r': 5, 'q': 9, 'k': 100 };

    return moves.map(move => {
        let score = 0;

        // MVV-LVA za captures
        if (move.captured) {
            score += pieceValues[move.captured] * 100 - pieceValues[move.piece];
        }

        // Promocija
        if (move.promotion) {
            score += pieceValues[move.promotion] * 80;
        }

        // Killer moves
        if (killerMoves[globina] && killerMoves[globina].includes(move.san)) {
            score += 900;
        }

        // History heuristic
        const historyKey = `${move.from}-${move.to}`;
        if (historyTable[historyKey]) {
            score += historyTable[historyKey];
        }

        return { move, score };
    })
    .sort((a, b) => b.score - a.score)
    .map(item => item.move);
}

// ==========================================
// MINIMAX Z ALPHA-BETA PRUNING - ADVANCED
// ==========================================

function minimax(chessInstance, globina, alpha, beta, maksimizira, ply = 0) {
    nodesSearched++;

    // Preveri Transposition Table
    const fen = chessInstance.fen();
    const ttKey = `${fen}-${globina}`;

    if (transpositionTable.has(ttKey)) {
        const ttEntry = transpositionTable.get(ttKey);
        ttHits++;

        if (ttEntry.depth >= globina) {
            if (ttEntry.flag === 'EXACT') {
                return { ocena: ttEntry.score, poteza: ttEntry.bestMove };
            } else if (ttEntry.flag === 'LOWERBOUND') {
                alpha = Math.max(alpha, ttEntry.score);
            } else if (ttEntry.flag === 'UPPERBOUND') {
                beta = Math.min(beta, ttEntry.score);
            }

            if (alpha >= beta) {
                return { ocena: ttEntry.score, poteza: ttEntry.bestMove };
            }
        }
    }

    // Terminalni pogoji
    if (globina === 0) {
        // Quiescence search namesto statične evalvacije
        const qScore = quiescenceSearch(chessInstance, alpha, beta, maksimizira);
        return { ocena: qScore, poteza: null };
    }

    // Preveri konec igre
    if (chessInstance.game_over()) {
        if (chessInstance.in_checkmate()) {
            const mateScore = maksimizira ? -999999 + ply : 999999 - ply;
            return { ocena: mateScore, poteza: null };
        } else {
            return { ocena: 0, poteza: null };
        }
    }

    const poteze = chessInstance.moves({ verbose: true });
    if (poteze.length === 0) {
        return { ocena: oceniPozicijo(chessInstance), poteza: null };
    }

    // Move ordering
    const orderedMoves = orderMoves(poteze, killerMoves, ply);

    let najboljsaPoteza = null;
    let flag = 'UPPERBOUND';

    if (maksimizira) {
        let maxEval = -Infinity;

        for (let i = 0; i < orderedMoves.length; i++) {
            const poteza = orderedMoves[i];
            chessInstance.move(poteza);
            const evalvacija = minimax(chessInstance, globina - 1, alpha, beta, false, ply + 1);
            chessInstance.undo();

            if (evalvacija.ocena > maxEval) {
                maxEval = evalvacija.ocena;
                najboljsaPoteza = poteza.san;
            }

            alpha = Math.max(alpha, evalvacija.ocena);

            if (beta <= alpha) {
                betaCutoffs++;

                // Shrani killer move
                if (!poteza.captured && !killerMoves[ply].includes(poteza.san)) {
                    killerMoves[ply][1] = killerMoves[ply][0];
                    killerMoves[ply][0] = poteza.san;
                }

                // Posodobi history table
                const historyKey = `${poteza.from}-${poteza.to}`;
                historyTable[historyKey] = (historyTable[historyKey] || 0) + globina * globina;

                flag = 'LOWERBOUND';
                break;
            }
        }

        if (maxEval > alpha) flag = 'EXACT';

        // Shrani v Transposition Table
        if (transpositionTable.size < MAX_TT_SIZE) {
            transpositionTable.set(ttKey, {
                score: maxEval,
                depth: globina,
                flag: flag,
                bestMove: najboljsaPoteza
            });
        }

        return { ocena: maxEval, poteza: najboljsaPoteza };

    } else {
        let minEval = Infinity;

        for (let i = 0; i < orderedMoves.length; i++) {
            const poteza = orderedMoves[i];
            chessInstance.move(poteza);
            const evalvacija = minimax(chessInstance, globina - 1, alpha, beta, true, ply + 1);
            chessInstance.undo();

            if (evalvacija.ocena < minEval) {
                minEval = evalvacija.ocena;
                najboljsaPoteza = poteza.san;
            }

            beta = Math.min(beta, evalvacija.ocena);

            if (beta <= alpha) {
                betaCutoffs++;

                if (!poteza.captured && !killerMoves[ply].includes(poteza.san)) {
                    killerMoves[ply][1] = killerMoves[ply][0];
                    killerMoves[ply][0] = poteza.san;
                }

                const historyKey = `${poteza.from}-${poteza.to}`;
                historyTable[historyKey] = (historyTable[historyKey] || 0) + globina * globina;

                flag = 'UPPERBOUND';
                break;
            }
        }

        if (minEval < beta) flag = 'EXACT';

        if (transpositionTable.size < MAX_TT_SIZE) {
            transpositionTable.set(ttKey, {
                score: minEval,
                depth: globina,
                flag: flag,
                bestMove: najboljsaPoteza
            });
        }

        return { ocena: minEval, poteza: najboljsaPoteza };
    }
}

// ==========================================
// ISKANJE POTEZE Z ITERATIVE DEEPENING
// ==========================================

async function isciPotezo(fen, maxDepth, maxTime, progressCallback) {
    return new Promise((resolve) => {
        const startTime = Date.now();

        // Reset statistike
        nodesSearched = 0;
        ttHits = 0;
        betaCutoffs = 0;

        const chess = new Chess(fen);

        // Preveri opening book
        if (openingBook[fen]) {
            const bookMoves = openingBook[fen];
            const randomMove = bookMoves[Math.floor(Math.random() * bookMoves.length)];
            console.log(`Opening book hit: ${randomMove}`);

            // Pošlji opening book move za vse depth-e
            if (progressCallback) {
                for (let d = 1; d <= maxDepth; d++) {
                    progressCallback(d, randomMove, 0.15, 0);  // cas_ms = 0
                }
            }

            setTimeout(() => {
                resolve({
                    poteza: randomMove,
                    ocena: 0.15,
                    cas_ms: 0
                });
            }, 0);
            return;
        }

        if (chess.game_over()) {
            const moves = chess.moves();
            const fallbackMove = moves.length > 0 ? moves[0] : null;

            if (progressCallback && fallbackMove) {
                for (let d = 1; d <= maxDepth; d++) {
                    progressCallback(d, fallbackMove, 0, 0);  // cas_ms = 0
                }
            }

            setTimeout(() => {
                resolve({
                    poteza: fallbackMove,
                    ocena: 0,
                    cas_ms: 0
                });
            }, 0);
            return;
        }

        let bestMove = null;
        let bestScore = 0;
        let globina = 1;

        // Iterative deepening - z yieldom za UI
        const searchNextDepth = () => {
            if (globina > maxDepth || Date.now() - startTime >= maxTime * 0.95) {
                // Končano - vrni rezultat
                finishSearch();
                return;
            }

            const maksimizira = chess.turn() === 'w';
            const rezultat = minimax(chess, globina, -Infinity, Infinity, maksimizira, 0);

            if (rezultat.poteza) {
                bestMove = rezultat.poteza;
                bestScore = rezultat.ocena;

                console.log(`Depth ${globina}: ${bestMove} (${(bestScore/100).toFixed(2)}) - Nodes: ${nodesSearched}, TT hits: ${ttHits}, Cutoffs: ${betaCutoffs}`);

                // ✅ KLIČI CALLBACK ZA TA DEPTH!
                if (progressCallback) {
                    const scoreInPawns = bestScore / 100;
                    const elapsedMs = Date.now() - startTime;
                    progressCallback(globina, bestMove, scoreInPawns, elapsedMs);
                }
            }

            globina++;

            // Yield UI thread - pusti da se UI posodobi
            // 10ms delay da CPU ni preveč obremenjen
            setTimeout(searchNextDepth, 10);
        };

        const finishSearch = () => {
            // Fallback če ni poteze
            if (!bestMove) {
                const moves = chess.moves();
                if (moves.length > 0) {
                    bestMove = moves[0];
                    bestScore = 0;
                }
            }

            const scoreInPawns = bestScore / 100;
            const elapsedMs = Date.now() - startTime;
            const elapsedTime = (elapsedMs / 1000).toFixed(2);

            console.log(`Search complete: ${bestMove} (${scoreInPawns.toFixed(2)}) in ${elapsedTime}s`);

            resolve({
                poteza: bestMove,
                ocena: scoreInPawns,
                cas_ms: elapsedMs
            });
        };

        // Začni iterative deepening
        searchNextDepth();
    });
}

// ==========================================
// GLOBINA ISKANJA PO NIVOJIH
// ==========================================

function getSearchDepth(level) {
    // 1:1 mapping - Level = Depth
    // Level 1 = Depth 1, Level 2 = Depth 2, ..., Level 6 = Depth 6
    return level;
}

// ==========================================
// NAPAKE ZA NIŽJE NIVOJE
// ==========================================

function shouldMakeMistake(level) {
    const errorRates = {
        1: 0.25,  // 25% napak
        2: 0.15,  // 15% napak
        3: 0.08,  // 8% napak
        4: 0.04,  // 4% napak
        5: 0.01,  // 1% napak
        6: 0.00   // Brez napak
    };
    return Math.random() < (errorRates[level] || 0.10);
}

// ==========================================
// GLAVNI API - PREDLAGAJ POTEZO
// ==========================================

async function Predlagaj_Potezo(p_in_stanje_FEN, p_in_max_sekund, p_callback) {
    if (!p_in_stanje_FEN || typeof p_in_stanje_FEN !== 'string') {
        throw new Error('Neveljaven FEN string');
    }

    if (!p_in_max_sekund || p_in_max_sekund <= 0) {
        throw new Error('Maksimalni čas mora biti pozitiven');
    }

    // Počisti stare TT vnose če je tabela prevelika
    if (transpositionTable.size > MAX_TT_SIZE * 0.9) {
        transpositionTable.clear();
        console.log('Transposition table cleared');
    }

    const predlogi = [];
    const maxTime = p_in_max_sekund * 1000;

    console.log('🧠 AI Advanced Analysis...', {
        FEN: p_in_stanje_FEN,
        MaxTime: p_in_max_sekund + 's'
    });

    // NOVA LOGIKA: Kliči isciPotezo samo ENKRAT za max depth
    // isciPotezo interno uporablja iterative deepening in bo poklical callback
    // za vsak depth (1, 2, 3, 4) sproti!
    const maxDepth = 4;  // Max level - zmanjšano za manj CPU obremenitve!

    const rezultat = await isciPotezo(p_in_stanje_FEN, maxDepth, maxTime, (depth, poteza, ocena, cas_ms) => {
        // Callback za vsak depth sproti!
        const predlog = {
            level: depth,
            poteza: poteza,
            ocena: ocena,
            cas_ms: cas_ms
        };
        predlogi.push(predlog);

        // Kliči user callback
        if (p_callback && typeof p_callback === 'function') {
            p_callback(depth, poteza, ocena, cas_ms);
        }
    });

    console.log(`✅ Analysis complete: ${predlogi.length}/6 levels`);
    return predlogi;
}

// ==========================================
// EXPORTS
// ==========================================

if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        Predlagaj_Potezo,
        oceniPozicijo,
        minimax,
        getSearchDepth,
        shouldMakeMistake
    };
}
