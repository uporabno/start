// ==========================================
// ŠNOPC - Main Game Engine
// Converted from uBoard.pas and uBoardFunc.pas
// ==========================================

import * as C from './snopc-constants.js';
import { gameData, data_Karte_Igralcev_Reset, data_Stihi_Igralcev_Reset,
         data_Stihi_Dodaj_Igralcu_Klic, data_Stihi_Dodaj_Igralcu_Tocke_Stiha_Igralca,
         get_Igralec_Stevilo_Kart, get_Stevilo_Tock_Skupine_Igralca,
         set_Igralec_Vrgel_Karto_All_False } from './snopc-data.js';
import * as utils from './snopc-utils.js';
import * as rules from './snopc-rules.js';
import * as ai from './snopc-ai.js';
import { MixerPremesajKarte } from './snopc-mixer.js';
import { Ruf } from './snopc-ruf.js';

// ==========================================
// GAME CLASS
// ==========================================

class SnopecGame {
    constructor() {
        this.logEntries = [];
        this.selectedCards = [];
        this.selectedTalonCards = [];
        this.gameSpeed = 1000; // ms delay for AI moves

        this.init();
    }

    init() {
        // Get DOM elements
        this.statusEl = document.getElementById('status');
        this.gameTypeEl = document.getElementById('gameTypeText');
        this.trumpSuitEl = document.getElementById('trumpSuit');
        this.logContentEl = document.getElementById('logContent');

        // Modals
        this.gameTypeModal = document.getElementById('gameTypeModal');
        this.trumpModal = document.getElementById('trumpModal');
        this.kontraModal = document.getElementById('kontraModal');
        this.talonModal = document.getElementById('talonModal');
        this.aboutModal = document.getElementById('aboutModal');
        this.winModal = document.getElementById('winModal');

        // Attach event listeners
        document.getElementById('btnNovaIgra').addEventListener('click', () => this.novaIgra());
        document.getElementById('btnNovaTurneja').addEventListener('click', () => this.novaTurneja());
        document.getElementById('btnNastavitve').addEventListener('click', () => this.showNastavitve());
        document.getElementById('btnVizitka').addEventListener('click', () => this.showAbout());

        // Game type selection
        document.querySelectorAll('.btn-game-type').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const type = e.target.dataset.type;
                this.handleGameTypeSelection(type);
            });
        });

        // Trump selection
        document.querySelectorAll('.btn-suit').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const suit = parseInt(e.target.dataset.suit);
                this.handleTrumpSuitSelection(suit);
            });
        });

        // Kontra buttons
        document.getElementById('btnKontra').addEventListener('click', () => this.handleKontra(true));
        document.getElementById('btnNoKontra').addEventListener('click', () => this.handleKontra(false));

        // Talon confirmation
        document.getElementById('btnConfirmTalon').addEventListener('click', () => this.confirmTalonExchange());

        // About modal close
        document.querySelectorAll('.close').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.target.closest('.modal').classList.remove('active');
            });
        });

        // Win modal
        document.getElementById('btnNextGame').addEventListener('click', () => {
            this.winModal.classList.remove('active');
            this.novaIgra();
        });

        this.updateStatus('Klikni "Nova igra" za začetek');
    }

    // ==========================================
    // SOUND PLAYBACK
    // ==========================================

    playSound(soundId) {
        // Get selected language folder from select element
        const selectEl = document.getElementById('zvokJezik');
        const zvokJezik = selectEl ? selectEl.value : 'si';
        const folderPrefix = zvokJezik === 'si' ? 'si-' :
                           zvokJezik === 'retro' ? 'retro-' :
                           'hr-';

        // Remove 'sound' prefix from soundId (soundMesanje -> mesanje)
        const cleanId = soundId.replace(/^sound/i, '').toLowerCase();

        // Construct path: sounds/{folder}/{folderPrefix}{cleanId}.mp3
        const audioPath = `sounds/${zvokJezik}/${folderPrefix}${cleanId}.mp3`;

        try {
            const audio = new Audio(audioPath);
            audio.play().catch(e => console.log('Sound play failed:', e));
        } catch(e) {
            console.log('Sound creation failed:', e);
        }
    }

    // ==========================================
    // GAME INITIALIZATION
    // ==========================================

    novaIgra() {
        log_Add(C.C_LOG_INFO, '=== NOVA IGRA ===');

        // Reset game state
        data_Karte_Igralcev_Reset();
        data_Stihi_Igralcev_Reset();

        gameData.igra.status = C.C_IGRA_STATUS_NOVA_IGRA;
        gameData.igra.stevilo_igralcev = 4;

        for (let i = 0; i < 4; i++) {
            gameData.igra.igralec_igra[i] = true;
            gameData.igra.igralec_izbral_igro[i] = false;
            gameData.igra.igralec_izbral_kontra[i] = false;
            gameData.igra.igralec_je_v_skupini[i] = C.C_SKUPINA_NULL;
        }

        // Reset player avatar borders and trick indicators
        this.Slike_Igralcev_Refresh();
        this.Stihi_Slike_Refresh();

        gameData.igra.tip_igre = C.C_NULL;
        gameData.igra.tip_igre_kontra = false;
        gameData.igra.info_talon_zamenjan = false;
        gameData.igra.info_adut_zunaj = false;

        // Determine who starts this game
        let startingPlayer;
        if (gameData.turneja.igralec_zacel_trentno_igro === C.C_NULL) {
            // First game ever - random player
            startingPlayer = Math.floor(Math.random() * 4);
            gameData.turneja.igralec_zacel_trentno_igro = startingPlayer;
        } else {
            // Next game - rotate to next player
            startingPlayer = (gameData.turneja.igralec_zacel_trentno_igro + 1) % 4;
            gameData.turneja.igralec_zacel_trentno_igro = startingPlayer;
        }

        // Shuffle and deal cards (as in Delphi uBoard.pas:982)
        this.playSound('soundMesanje');  // Play shuffle sound
        MixerPremesajKarte(gameData.karte_set);  // 1:1 port from uMixer.pas
        this.razdeli_Karte();

        // Starting player gets first cards and chooses game type first
        gameData.igra.igralec_na_potezi = startingPlayer;
        gameData.igra.igralec_rufa = startingPlayer;

        log_Add(C.C_LOG_INFO, utils.get_Igralec_Ime(startingPlayer, C.C_VELIKA_ZACETNICA) + ' začne to igro.');

        this.updateDisplay();

        if (startingPlayer === 0) {
            this.updateStatus('Izberi tip igre');
        } else {
            this.updateStatus(utils.get_Igralec_Ime(startingPlayer, C.C_VELIKA_ZACETNICA) + ' izbira tip igre...');
        }

        // Start game type selection
        gameData.igra.status = C.C_IGRA_STATUS_IZBIRA_TIP_IGRE;
        this.askForGameType(startingPlayer);
    }

    novaTurneja() {
        gameData.turneja.ena_igra = false;
        gameData.tocke_turneje.stevilo_iger = 0;
        gameData.tocke_turneje.max_stevilo_tock = 21;

        for (let i = 0; i < 4; i++) {
            gameData.turneja.igralec_tocke[i] = 0;
            gameData.turneja.igralec_na_turneji[i] = true;
            gameData.turneja.igralec_se_igra[i] = true;
        }

        // Random player starts first game
        gameData.turneja.igralec_zacel_trentno_igro = Math.floor(Math.random() * 4);

        this.novaIgra();
    }

    razdeli_Karte() {
        let pos = 0;
        const startingPlayer = gameData.turneja.igralec_zacel_trentno_igro;

        // Deal 5 cards to each player (starting from dealer)
        for (let round = 0; round < 2; round++) {
            for (let i = 0; i < 4; i++) {
                const player = (startingPlayer + i) % 4;
                for (let card = 0; card < (round === 0 ? 3 : 2); card++) {
                    gameData.karte_igralec[player][round * 3 + card] = gameData.karte_set[pos];
                    pos++;
                }
            }
        }

        // Deal 4 cards to talon
        for (let i = 0; i < 4; i++) {
            gameData.karte_talon[i] = gameData.karte_set[pos];
            pos++;
        }

        // Deal remaining 3 cards to each player (starting from dealer)
        for (let i = 0; i < 4; i++) {
            const player = (startingPlayer + i) % 4;
            for (let card = 0; card < 3; card++) {
                gameData.karte_igralec[player][5 + card] = gameData.karte_set[pos];
                pos++;
            }
        }

        log_Add(C.C_LOG_DEBUG, 'Karte razdeljene.');
    }

    // ==========================================
    // GAME TYPE SELECTION
    // ==========================================

    askForGameType(player) {
        if (player === 0) {
            // Human player - get AI suggestion (as in Delphi uBoard.pas:1245-1252)
            const suggestedType = ai.Izberi_Igro(0);

            // Show modal
            this.gameTypeModal.classList.add('active');

            // Highlight suggested button (pre-select as in Delphi)
            document.querySelectorAll('.btn-game-type').forEach(btn => {
                btn.classList.remove('suggested');
                if (parseInt(btn.dataset.type) === suggestedType) {
                    btn.classList.add('suggested');
                }
            });
        } else {
            // AI player
            setTimeout(() => {
                const gameType = ai.Izberi_Igro(player);  // Fixed: PascalCase (1:1 Delphi)
                this.handleGameTypeSelection(gameType);
            }, this.gameSpeed);
        }
    }

    handleGameTypeSelection(type) {
        this.gameTypeModal.classList.remove('active');

        const currentPlayer = gameData.igra.igralec_na_potezi;
        gameData.igra.igralec_izbral_igro[currentPlayer] = true;

        if (type === 'pass') {
            log_Add(C.C_LOG_NORMAL, utils.get_Igralec_Ime(currentPlayer, C.C_VELIKA_ZACETNICA) + ' gre naprej.');

            // Next player
            utils.set_Na_Potezi_Naslednji_Igralec();

            // Check if all passed
            if (gameData.igra.igralec_izbral_igro.every(x => x === true)) {
                log_Add(C.C_LOG_INFO, 'Vsi igralci so šli naprej. Nova igra.');
                this.novaIgra();
                return;
            }

            this.askForGameType(gameData.igra.igralec_na_potezi);
        } else {
            const tipIgre = parseInt(type);
            gameData.igra.tip_igre = tipIgre;
            gameData.igra.tip_igre_predlagal = currentPlayer;

            // Pri Igri 9 in 12 ni rufača (ni aduta), pri Igri 3 in 6 se rufač nastavi v startTrumpSelection
            if (tipIgre === C.C_IGRA_TIP_9 || tipIgre === C.C_IGRA_TIP_12) {
                gameData.igra.igralec_rufa = C.C_NULL;
            } else {
                // Začasno nastavi, dokler ne izbere aduta (rufač lahko postane kdo drug)
                gameData.igra.igralec_rufa = currentPlayer;
            }

            // Predvajaj zvok za tip igre (dodaj vodilno ničlo za 3,6,9)
            const igraNum = tipIgre < 10 ? '0' + tipIgre : tipIgre;
            this.playSound('soundIgra' + igraNum);

            log_Add(C.C_LOG_NORMAL, utils.get_Igralec_Ime(currentPlayer, C.C_VELIKA_ZACETNICA) +
                   ' izbere ' + utils.get_Opis_Igre(tipIgre) + '.');

            this.gameTypeEl.textContent = utils.get_Opis_Igre(tipIgre);

            // Update gameTypeDisplay in info panel
            const gameTypeDisplayEl = document.getElementById('gameTypeDisplay');
            if (gameTypeDisplayEl) {
                gameTypeDisplayEl.textContent = utils.get_Opis_Igre(tipIgre);
            }

            // Go to trump selection first
            this.startTrumpSelection();
        }
    }

    // ==========================================
    // KONTRA
    // ==========================================

    startKontraSelection() {
        gameData.igra.status = C.C_IGRA_STATUS_IZBIRA_KONTRA;
        gameData.igra.igralec_na_potezi = gameData.igra.tip_igre_predlagal;
        utils.set_Na_Potezi_Naslednji_Igralec();
        this.askForKontra(gameData.igra.igralec_na_potezi);
    }

    askForKontra(player) {
        if (player === gameData.igra.tip_igre_predlagal) {
            // Back to starter - go to playing phase
            this.startPlayingPhase();
            return;
        }

        if (player === 0) {
            this.kontraModal.classList.add('active');
        } else {
            setTimeout(() => {
                const kontra = ai.izberi_Kontra(player);
                this.handleKontra(kontra);
            }, this.gameSpeed);
        }
    }

    handleKontra(kontra) {
        this.kontraModal.classList.remove('active');

        const currentPlayer = gameData.igra.igralec_na_potezi;
        gameData.igra.igralec_izbral_kontra[currentPlayer] = true;

        if (kontra) {
            gameData.igra.tip_igre_kontra = true;
            log_Add(C.C_LOG_NORMAL, utils.get_Igralec_Ime(currentPlayer, C.C_VELIKA_ZACETNICA) + ' reče KONTRA!');
        } else {
            log_Add(C.C_LOG_NORMAL, utils.get_Igralec_Ime(currentPlayer, C.C_VELIKA_ZACETNICA) + ' ne gre kontra.');
        }

        utils.set_Na_Potezi_Naslednji_Igralec();
        this.askForKontra(gameData.igra.igralec_na_potezi);
    }

    // ==========================================
    // TRUMP SELECTION (RUFANJE)
    // ==========================================

    startTrumpSelection() {
        gameData.igra.status = C.C_IGRA_STATUS_IZBIRA_ADUT_RUFANJE;
        gameData.igra.igralec_na_potezi = gameData.igra.igralec_rufa;

        if (gameData.igra.tip_igre === C.C_IGRA_TIP_3 || gameData.igra.tip_igre === C.C_IGRA_TIP_6) {
            this.askForTrump(gameData.igra.igralec_rufa);
        } else {
            // No trump for 9 and 12
            gameData.rufanje_izbrana_karta.barva = C.C_NULL;
            gameData.rufanje_izbrana_karta.tip = C.C_NULL;
            this.startTalonExchange();
        }
    }

    askForTrump(player) {
        if (player === 0) {
            this.trumpModal.classList.add('active');
        } else {
            setTimeout(() => {
                // Call Ruf() as in Delphi (1:1 port from uRuf.pas)
                const karta0 = gameData.karte_igralec[player][0];
                const karta1 = gameData.karte_igralec[player][1];
                const karta2 = gameData.karte_igralec[player][2];
                const karta3 = gameData.karte_igralec[player][3];

                const trump = Ruf(gameData.igra.stevilo_igralcev, karta0, karta1, karta2, karta3);
                this.handleTrumpSelection(trump.barva, trump.tip);
            }, this.gameSpeed);
        }
    }

    handleTrumpSuitSelection(suit) {
        // Show card type buttons for selected suit
        const cardTypeButtons = document.getElementById('cardTypeButtons');
        cardTypeButtons.innerHTML = '';

        // Only allow calling A, 10, K (not Q, J)
        [C.C_TIP_A, C.C_TIP_10, C.C_TIP_K].forEach(tip => {
            const btn = document.createElement('button');
            btn.className = 'btn btn-primary';
            btn.textContent = C.TIP_SYMBOLS[tip];
            btn.addEventListener('click', () => this.handleTrumpSelection(suit, tip));
            cardTypeButtons.appendChild(btn);
        });
    }

    handleTrumpSelection(barva, tip) {
        this.trumpModal.classList.remove('active');

        gameData.rufanje_izbrana_karta.barva = barva;
        gameData.rufanje_izbrana_karta.tip = tip;

        const rufanaKarta = utils.get_Karta_Id(barva, tip);
        log_Add(C.C_LOG_NORMAL, utils.get_Igralec_Ime(gameData.igra.igralec_rufa, C.C_VELIKA_ZACETNICA) +
               ' rufa ' + utils.get_Opis_Karte(rufanaKarta) + '.');

        this.trumpSuitEl.innerHTML = C.BARVA_SYMBOLS[barva];
        this.trumpSuitEl.style.color = C.BARVA_COLORS[barva];

        this.startTalonExchange();
    }

    // ==========================================
    // TALON EXCHANGE
    // ==========================================

    startTalonExchange() {
        gameData.igra.status = C.C_IGRA_STATUS_ZAMENJAVA_TALON;

        if (gameData.igra.tip_igre === C.C_IGRA_TIP_3 || gameData.igra.tip_igre === C.C_IGRA_TIP_6) {
            this.askForTalonExchange(gameData.igra.igralec_rufa);
        } else {
            // Skip talon for 9 and 12, go to kontra
            this.startKontraSelection();
        }
    }

    askForTalonExchange(player) {
        if (player === 0) {
            this.showTalonExchangeModal();
        } else {
            setTimeout(() => {
                const exchange = ai.zamenjaj_Talon(player);
                this.performTalonExchange(player, exchange);
            }, this.gameSpeed);
        }
    }

    showTalonExchangeModal() {
        const talonDisplay = document.getElementById('talonDisplay');
        talonDisplay.innerHTML = '';

        for (let i = 0; i < 4; i++) {
            const card = utils.createCardElement(gameData.karte_talon[i]);
            talonDisplay.appendChild(card);
        }

        this.selectedTalonCards = [];
        this.talonModal.classList.add('active');

        // Allow selecting 2 cards from hand
        this.enableCardSelection(0, 2);
    }

    confirmTalonExchange() {
        if (this.selectedCards.length !== 2) {
            alert('Izberi točno 2 karti za zamenjavo!');
            return;
        }

        this.talonModal.classList.remove('active');

        const exchange = this.selectedCards.map(idx => gameData.karte_igralec[0][idx]);
        this.performTalonExchange(0, exchange);
    }

    performTalonExchange(player, cardsToExchange) {
        if (!cardsToExchange || cardsToExchange.length === 0) {
            log_Add(C.C_LOG_NORMAL, utils.get_Igralec_Ime(player, C.C_VELIKA_ZACETNICA) + ' ne zamenja talona.');
        } else {
            // Determine opponent player (as in Delphi uTalon.pas:181-183)
            let i_nasprotnik = -1;
            if (gameData.igra.igralec_igra[3] === true) i_nasprotnik = 3;
            if (gameData.igra.igralec_igra[2] === true) i_nasprotnik = 2;
            if (gameData.igra.igralec_igra[1] === true) i_nasprotnik = 1;

            let pointsForOpponent = 0;

            // Exchange cards (as in Delphi uTalon.pas:189-211)
            for (let i = 0; i < cardsToExchange.length; i++) {
                const cardIdx = gameData.karte_igralec[player].indexOf(cardsToExchange[i]);
                if (cardIdx !== -1) {
                    const temp = gameData.karte_igralec[player][cardIdx];
                    gameData.karte_igralec[player][cardIdx] = gameData.karte_talon[i];
                    gameData.karte_talon[i] = temp;

                    // Give points to opponent for Ace or 10 in talon (Delphi uTalon.pas:206-209)
                    const tipKarte = utils.get_Tip_Karte(gameData.karte_talon[i]);
                    if (tipKarte === C.C_TIP_A || tipKarte === C.C_TIP_10) {
                        pointsForOpponent += 10;
                    }
                }
            }

            // Award points to opponent (as in Delphi uTalon.pas:208)
            if (i_nasprotnik !== -1 && pointsForOpponent > 0) {
                gameData.stihi.tocke_klici_igralec[i_nasprotnik] += pointsForOpponent;
                log_Add(C.C_LOG_NORMAL, 'Nasprotna ekipa dobi ' + pointsForOpponent + ' pik v obliki klica.');
                this.updateScoreTable();
            }

            log_Add(C.C_LOG_NORMAL, utils.get_Igralec_Ime(player, C.C_VELIKA_ZACETNICA) + ' zamenja talon.');
            gameData.igra.info_talon_zamenjan = true;
        }

        this.startKontraSelection();
    }

    // ==========================================
    // PLAYING PHASE
    // ==========================================

    startPlayingPhase() {
        // Napoved, kdo bo začel (kot v Delphiju uBoard.pas:1326-1329)
        const zacelIgralec = (gameData.igra.tip_igre === C.C_IGRA_TIP_9 || gameData.igra.tip_igre === C.C_IGRA_TIP_12)
            ? gameData.igra.tip_igre_predlagal
            : gameData.igra.igralec_rufa;
        this.playSound('soundZacel' + zacelIgralec);

        gameData.igra.status = C.C_IGRA_STATUS_IGRA;

        // Pri Igri 9 in 12 začne tip_igre_predlagal, sicer rufač (kot v Delphiju uBoard.pas:1280-1282)
        if (gameData.igra.tip_igre === C.C_IGRA_TIP_9 || gameData.igra.tip_igre === C.C_IGRA_TIP_12) {
            gameData.igra.igralec_na_potezi = gameData.igra.tip_igre_predlagal;
        } else {
            gameData.igra.igralec_na_potezi = gameData.igra.igralec_rufa;
        }
        gameData.igra.igralec_zacel_za_stih = gameData.igra.igralec_na_potezi;

        // Initialize table cards
        for (let i = 0; i < 4; i++) {
            gameData.karte_miza[i] = C.C_KARTA_NULL;
        }

        // Determine groups
        this.board_Obdelaj_Skupine();

        this.updateDisplay();
        this.updateStatus('Igra teče - vrzi karto');

        this.askForCardPlay(gameData.igra.igralec_na_potezi);
    }

    askForCardPlay(player) {
        this.updatePlayerIndicators();

        if (player === 0) {
            // Human player - enable card selection
            this.enableCardSelection(0, 1);
        } else {
            // AI player
            setTimeout(() => {
                const card = ai.Vrzi_Karto(player);  // Fixed: PascalCase (1:1 Delphi)
                this.handleCardPlay(player, card);
            }, this.gameSpeed);
        }
    }

    enableCardSelection(player, maxCards) {
        this.selectedCards = [];
        const cardsContainer = document.getElementById(`cards-player${player}`);

        cardsContainer.querySelectorAll('.card').forEach((cardEl, idx) => {
            cardEl.onclick = () => {
                const cardId = gameData.karte_igralec[player][idx];
                if (cardId === C.C_KARTA_NULL) return;

                if (maxCards === 1) {
                    // Play card immediately
                    this.handleCardPlay(player, cardId);
                } else {
                    // Toggle selection for talon exchange
                    if (this.selectedCards.includes(idx)) {
                        this.selectedCards = this.selectedCards.filter(x => x !== idx);
                        cardEl.classList.remove('selected');
                    } else if (this.selectedCards.length < maxCards) {
                        this.selectedCards.push(idx);
                        cardEl.classList.add('selected');
                    }
                }
            };
        });
    }

    handleCardPlay(player, cardId) {
        // Validate move
        if (player === 0 && !rules.met_Karte_Dovoljen(cardId)) {
            return;
        }

        // Remove card from player hand
        const cardIdx = gameData.karte_igralec[player].indexOf(cardId);
        if (cardIdx !== -1) {
            gameData.karte_igralec[player][cardIdx] = C.C_KARTA_NULL;
        }

        // Place on table
        gameData.karte_miza[player] = cardId;
        gameData.igra.igralec_vrgel_karto[player] = true;

        log_Add(C.C_LOG_NORMAL, utils.get_Igralec_Ime(player, C.C_VELIKA_ZACETNICA) +
               ' vrže ' + utils.get_Opis_Karte(cardId) + '.');

        this.updateDisplay();

        // Check if played card is the called trump (rufana karta)
        if (!gameData.igra.info_adut_zunaj &&
            utils.get_Barva_Karte(cardId) === gameData.rufanje_izbrana_karta.barva &&
            utils.get_Tip_Karte(cardId) === gameData.rufanje_izbrana_karta.tip) {
            gameData.igra.info_adut_zunaj = true;
            log_Add(C.C_LOG_INFO, 'Rufana karta je prišla ven!');
            this.board_Obdelaj_Skupine();
        }

        // Check for calls (20/40)
        this.board_Obdelaj_Klic(player, cardId);

        // Check if all players played
        const allPlayed = gameData.igra.igralec_igra.every((plays, idx) =>
            !plays || gameData.igra.igralec_vrgel_karto[idx]
        );

        if (allPlayed) {
            // Evaluate trick
            setTimeout(() => this.board_Obdelaj_Stih(), this.gameSpeed);
        } else {
            // Next player
            utils.set_Na_Potezi_Naslednji_Igralec();
            this.askForCardPlay(gameData.igra.igralec_na_potezi);
        }
    }

    // ==========================================
    // BOARD LOGIC (from uBoardFunc.pas)
    // ==========================================

    board_Obdelaj_Skupine() {
        // Determine which players are in which group
        if (gameData.igra.stevilo_igralcev !== 4 ||
            gameData.igra.info_adut_zunaj === true ||
            gameData.igra.tip_igre === C.C_IGRA_TIP_9 ||
            gameData.igra.tip_igre === C.C_IGRA_TIP_12) {

            // Clear groups
            for (let i = 0; i < 4; i++) {
                gameData.igra.igralec_je_v_skupini[i] = C.C_SKUPINA_NULL;
            }

            // Set starter group
            if (gameData.igra.stevilo_igralcev !== 4 ||
                gameData.igra.tip_igre === C.C_IGRA_TIP_9 ||
                gameData.igra.tip_igre === C.C_IGRA_TIP_12) {
                gameData.igra.igralec_je_v_skupini[gameData.igra.igralec_na_potezi] = C.C_SKUPINA_ZACEL;
            } else {
                // 4 players and game 3 or 6
                gameData.igra.igralec_je_v_skupini[gameData.igra.igralec_rufa] = C.C_SKUPINA_ZACEL;
                gameData.igra.igralec_je_v_skupini[gameData.igra.igralec_na_potezi] = C.C_SKUPINA_ZACEL;
            }

            // Set others to second group
            for (let i = 0; i < 4; i++) {
                if (gameData.igra.igralec_igra[i] === true) {
                    if (gameData.igra.igralec_je_v_skupini[i] === C.C_SKUPINA_NULL) {
                        gameData.igra.igralec_je_v_skupini[i] = C.C_SKUPINA_DRUGI;
                    }
                }
            }

            log_Add(C.C_LOG_INFO, 'Skupine določene.');
        }

        // Refresh player avatar borders
        this.Slike_Igralcev_Refresh();
    }

    board_Obdelaj_Klic(player, cardId) {
        // Check for 20/40 calls (K+Q pair)
        if (gameData.igra.igralec_zacel_za_stih !== player) return;
        if (gameData.igra.tip_igre !== C.C_IGRA_TIP_3 && gameData.igra.tip_igre !== C.C_IGRA_TIP_6) return;

        const tip = utils.get_Tip_Karte(cardId);
        const barva = utils.get_Barva_Karte(cardId);

        let hasPair = false;

        if (tip === C.C_TIP_K) {
            // Check for Queen
            for (let k = 0; k < 8; k++) {
                const karta = gameData.karte_igralec[player][k];
                if (karta !== C.C_NULL) {
                    if (utils.get_Tip_Karte(karta) === C.C_TIP_Q &&
                        utils.get_Barva_Karte(karta) === barva) {
                        hasPair = true;
                    }
                }
            }
        } else if (tip === C.C_TIP_Q) {
            // Check for King
            for (let k = 0; k < 8; k++) {
                const karta = gameData.karte_igralec[player][k];
                if (karta !== C.C_NULL) {
                    if (utils.get_Tip_Karte(karta) === C.C_TIP_K &&
                        utils.get_Barva_Karte(karta) === barva) {
                        hasPair = true;
                    }
                }
            }
        }

        if (hasPair) {
            if (barva === gameData.rufanje_izbrana_karta.barva) {
                // 40 in trump
                data_Stihi_Dodaj_Igralcu_Klic(player, C.C_KLIC_40);
                log_Add(C.C_LOG_NORMAL, utils.get_Igralec_Ime(player, C.C_VELIKA_ZACETNICA) + ' kliče 40!');
                this.showCallIndicator(40);
            } else {
                // 20 in other suit
                data_Stihi_Dodaj_Igralcu_Klic(player, C.C_KLIC_20);
                log_Add(C.C_LOG_NORMAL, utils.get_Igralec_Ime(player, C.C_VELIKA_ZACETNICA) + ' kliče 20!');
                this.showCallIndicator(20);
            }

            this.updateScoreTable();

            // Check if already won
            if (get_Stevilo_Tock_Skupine_Igralca(player) >= 66) {
                gameData.igra.igralec_na_potezi = player;
                gameData.igra.status = C.C_IGRA_STATUS_KLIC_ZAPRTI;
            }
        }
    }

    board_Obdelaj_Stih() {
        // Determine who wins the trick
        const winner = utils.get_Stih_Kdo_Pobere();

        // Check for Igra 9 (Beraš) and Igra 12 (Druhmaraš) early exit
        // If winner is not the player who started the trick, game ends immediately
        if ((gameData.igra.tip_igre === C.C_IGRA_TIP_9) ||
            (gameData.igra.tip_igre === C.C_IGRA_TIP_12)) {
            if (winner !== gameData.igra.igralec_zacel_za_stih) {
                // Game ends - rufač failed
                gameData.igra.igralec_na_potezi = winner;

                log_Add(C.C_LOG_INFO, utils.get_Igralec_Ime(winner, C.C_VELIKA_ZACETNICA) +
                       ' pobere štih - igra ni uspešno končana.');

                // Show arrow and indicator
                this.showPuscica(winner);
                this.showPlayerIndicator(winner);

                setTimeout(() => {
                    this.hidePlayerIndicator(winner);
                    this.hidePuscice();
                    this.board_Obdelaj_Igro();
                }, this.gameSpeed * 2);
                return;
            }
        }

        // Calculate trick value
        let trickValue = 0;
        for (let i = 0; i < 4; i++) {
            if (gameData.karte_miza[i] !== C.C_KARTA_NULL) {
                trickValue += utils.get_Vrednost_Karte(gameData.karte_miza[i]);
            }
        }

        // Store trick
        const stihIdx = gameData.stihi.stevilo_stihov;
        gameData.stihi.stih[stihIdx].igralec_zacel = gameData.igra.igralec_zacel_za_stih;
        gameData.stihi.stih[stihIdx].igralec_pobral = winner;
        gameData.stihi.stih[stihIdx].vrednost_stiha = trickValue;

        for (let i = 0; i < 4; i++) {
            gameData.stihi.stih[stihIdx].karte[i] = gameData.karte_miza[i];
            gameData.karte_miza[i] = C.C_KARTA_NULL;
        }

        gameData.stihi.stevilo_stihov++;

        // Add points
        data_Stihi_Dodaj_Igralcu_Tocke_Stiha_Igralca(winner, trickValue);

        log_Add(C.C_LOG_NORMAL, utils.get_Igralec_Ime(winner, C.C_VELIKA_ZACETNICA) +
               ' pobere štih (' + trickValue + ' točk).');

        this.updateScoreTable();
        this.updateDisplay();
        this.Stihi_Slike_Refresh();

        // Show arrow pointing to winner
        this.showPuscica(winner);

        // Show winner indicator
        this.showPlayerIndicator(winner);

        setTimeout(() => {
            this.hidePlayerIndicator(winner);
            this.hidePuscice();

            gameData.igra.igralec_na_potezi = winner;
            gameData.igra.igralec_zacel_za_stih = winner;
            set_Igralec_Vrgel_Karto_All_False();

            // Check if game is won
            const points = get_Stevilo_Tock_Skupine_Igralca(winner);
            const noMoreCards = get_Igralec_Stevilo_Kart(winner) === 0;

            if (points >= 66 || noMoreCards) {
                this.board_Obdelaj_Igro();
            } else {
                this.askForCardPlay(gameData.igra.igralec_na_potezi);
            }
        }, this.gameSpeed * 2);
    }

    board_Obdelaj_Igro() {
        if (gameData.igra.status === C.C_IGRA_STATUS_IGRA_KONCANA) {
            log_Add(C.C_LOG_ERROR, 'Igra je že končana!');
            return;
        }

        gameData.igra.status = C.C_IGRA_STATUS_IGRA_KONCANA;

        const winner = gameData.igra.igralec_na_potezi;
        const winnerGroup = gameData.igra.igralec_je_v_skupini[winner];

        // Count winners
        let numWinners = 0;
        let winners = [];

        if (winnerGroup === C.C_SKUPINA_NULL) {
            numWinners = 1;
            winners = [winner];
        } else {
            for (let i = 0; i < 4; i++) {
                if (gameData.igra.igralec_je_v_skupini[i] === winnerGroup) {
                    numWinners++;
                    winners.push(i);
                }
            }
        }

        // Calculate points
        let points = gameData.igra.tip_igre;

        if (gameData.igra.tip_igre === C.C_IGRA_TIP_3) {
            // Calculate based on opponent points
            let opponentPoints = 0;
            for (let i = 0; i < 4; i++) {
                if (gameData.igra.igralec_je_v_skupini[i] !== winnerGroup) {
                    opponentPoints += gameData.stihi.tocke_stihov_igralec[i];
                }
            }

            if (opponentPoints >= 33) {
                points = 1;
            } else if (opponentPoints > 0) {
                points = 2;
            } else {
                points = 3;
            }
        }

        if (gameData.igra.tip_igre_kontra) {
            points *= 2;
        }

        log_Add(C.C_LOG_INFO, 'Igra končana! Točke: ' + points);

        // Show win modal
        let winMessage = '';
        if (numWinners === 1) {
            winMessage = 'Zmagovalec: ' + gameData.nastavitve.igralec_ime[winners[0]];
        } else {
            winMessage = 'Zmagovalci: ' + winners.map(w => gameData.nastavitve.igralec_ime[w]).join(', ');
        }

        document.getElementById('winMessage').textContent = winMessage;
        document.getElementById('winPoints').textContent = 'Osvojene točke: ' + points;

        this.winModal.classList.add('active');
    }

    // ==========================================
    // UI UPDATES
    // ==========================================

    updateDisplay() {
        // Update all player cards
        for (let player = 0; player < 4; player++) {
            this.updatePlayerCards(player);
        }

        // Update table cards
        this.updateTableCards();

        // Update talon
        this.updateTalon();
    }

    updatePlayerCards(player) {
        const container = document.getElementById(`cards-player${player}`);
        container.innerHTML = '';

        for (let i = 0; i < 8; i++) {
            const cardId = gameData.karte_igralec[player][i];

            if (cardId !== C.C_KARTA_NULL) {
                let cardEl;
                if (player === 0) {
                    // Show player 0 cards
                    cardEl = utils.createCardElement(cardId);
                } else {
                    // Show card backs for AI players
                    cardEl = utils.createCardBack();
                }
                container.appendChild(cardEl);
            }
        }
    }

    updateTableCards() {
        for (let player = 0; player < 4; player++) {
            const cardEl = document.getElementById(`table-card${player}`);
            cardEl.innerHTML = '';

            if (gameData.karte_miza[player] !== C.C_KARTA_NULL) {
                const card = utils.createCardElement(gameData.karte_miza[player]);
                cardEl.appendChild(card);
            }
        }
    }

    updateTalon() {
        for (let i = 0; i < 4; i++) {
            const talonEl = document.getElementById(`talon${i}`);
            if (talonEl) {
                if (gameData.karte_talon[i] !== C.C_KARTA_NULL && !gameData.igra.info_talon_zamenjan) {
                    talonEl.style.display = 'block';
                } else {
                    talonEl.style.display = 'none';
                }
            }
        }
    }

    updateScoreTable() {
        for (let player = 0; player < 4; player++) {
            document.getElementById(`score${player}-klic`).textContent =
                gameData.stihi.tocke_klici_igralec[player];
            document.getElementById(`score${player}-stihi`).textContent =
                gameData.stihi.tocke_stihov_igralec[player];
            document.getElementById(`score${player}-skupaj`).textContent =
                gameData.stihi.tocke_skupaj_igralec[player];
        }
    }

    Slike_Igralcev_Refresh() {
        // Update team borders on player avatars
        for (let p = 0; p < 4; p++) {
            const avatarElement = document.getElementById(`avatar-info-${p}`);
            if (avatarElement) {
                const skupina = gameData.igra.igralec_je_v_skupini[p];

                // Remove all group classes
                avatarElement.classList.remove('skupina-zacel', 'skupina-drugi');

                // Add appropriate group class
                if (skupina === C.C_SKUPINA_ZACEL) {
                    avatarElement.classList.add('skupina-zacel');
                } else if (skupina === C.C_SKUPINA_DRUGI) {
                    avatarElement.classList.add('skupina-drugi');
                }
            }
        }
    }

    Stihi_Slike_Refresh() {
        // Show/hide trick indicators based on who has won tricks
        for (let p = 0; p < 4; p++) {
            const stihElement = document.getElementById(`stih-indicator-${p}`);
            if (stihElement) {
                let hasWonTricks = false;

                // Check all tricks to see if this player has won any
                for (let s = 0; s < gameData.stihi.stevilo_stihov; s++) {
                    if (gameData.stihi.stih[s].igralec_pobral === p) {
                        hasWonTricks = true;
                        break;
                    }
                }

                if (hasWonTricks) {
                    stihElement.classList.add('visible');
                } else {
                    stihElement.classList.remove('visible');
                }
            }
        }
    }

    updatePlayerIndicators() {
        for (let i = 0; i < 4; i++) {
            const indicator = document.getElementById(`indicator-player${i}`);
            if (i === gameData.igra.igralec_na_potezi) {
                indicator.classList.add('active');
            } else {
                indicator.classList.remove('active');
            }
        }
    }

    showPlayerIndicator(player) {
        document.getElementById(`indicator-player${player}`).classList.add('active');
    }

    hidePlayerIndicator(player) {
        document.getElementById(`indicator-player${player}`).classList.remove('active');
    }

    showCallIndicator(value) {
        const el = document.getElementById(`call${value}`);
        el.classList.add('active');
        setTimeout(() => el.classList.remove('active'), 2000);
    }

    showPuscica(player) {
        // Hide all arrows first
        this.hidePuscice();
        // Show arrow for this player
        const puscica = document.getElementById(`puscica-${player}`);
        if (puscica) {
            puscica.classList.add('visible');
        }
    }

    hidePuscice() {
        // Hide all arrows
        for (let i = 0; i < 4; i++) {
            const puscica = document.getElementById(`puscica-${i}`);
            if (puscica) {
                puscica.classList.remove('visible');
            }
        }
    }

    updateStatus(message) {
        this.statusEl.textContent = message;
    }

    showAbout() {
        this.aboutModal.classList.add('active');
    }

    showNastavitve() {
        alert('Nastavitve - TODO');
    }

    // ==========================================
    // LOGGING
    // ==========================================
}

// Global log function
export function log_Add(level, message) {
    const logEl = document.getElementById('logContent');
    if (!logEl) return;

    const entry = document.createElement('div');
    entry.className = 'log-entry';

    if (level === C.C_LOG_ERROR) entry.classList.add('log-error');
    else if (level === C.C_LOG_WARNING) entry.classList.add('log-warning');
    else if (level === C.C_LOG_NORMAL) entry.classList.add('log-normal');
    else if (level === C.C_LOG_INFO) entry.classList.add('log-info');
    else if (level === C.C_LOG_DEBUG) entry.classList.add('log-debug');

    const time = new Date().toLocaleTimeString();
    entry.textContent = `[${time}] ${message}`;

    logEl.appendChild(entry);
    logEl.scrollTop = logEl.scrollHeight;
}

// Initialize game when page loads
document.addEventListener('DOMContentLoaded', () => {
    window.game = new SnopecGame();
});
