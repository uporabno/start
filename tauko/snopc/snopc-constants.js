// ==========================================
// ŠNOPC - Game Constants
// Converted from uConst.pas
// ==========================================

// NULL constants
export const C_NULL = -1;
export const C_KARTA_NULL = -1;
export const C_NULL_MAX = 99;
export const C_BARVA_NULL = -1;

// Player constants
export const C_IGRALEC_JE_TI = 0;
export const C_IGRALEC_LEVO = 1;
export const C_IGRALEC_NASPROTI = 2;
export const C_IGRALEC_DESNO = 3;

// Card colors/suits (BARVA)
export const C_BARVA_S = 0;  // Srce (Hearts)
export const C_BARVA_P = 1;  // Pike (Spades)
export const C_BARVA_K = 2;  // Kare (Diamonds)
export const C_BARVA_X = 3;  // Križ (Clubs)

// Card types (TIP)
export const C_TIP_NULL = -1;
export const C_TIP_A = 0;   // Ace
export const C_TIP_10 = 1;  // 10
export const C_TIP_K = 2;   // King
export const C_TIP_Q = 3;   // Queen
export const C_TIP_J = 4;   // Jack

// Card value points
export const C_VREDNOST_A = 11;
export const C_VREDNOST_10 = 10;
export const C_VREDNOST_K = 4;
export const C_VREDNOST_Q = 3;
export const C_VREDNOST_J = 2;

// Game types
export const C_IGRA_TIP_NULL = -1;
export const C_IGRA_TIP_3 = 3;
export const C_IGRA_TIP_6 = 6;
export const C_IGRA_TIP_9 = 9;
export const C_IGRA_TIP_12 = 12;

// Groups (SKUPINA)
export const C_SKUPINA_NULL = -1;
export const C_SKUPINA_ZACEL = 1;
export const C_SKUPINA_DRUGI = 2;

// Calls (KLIC)
export const C_KLIC_20 = 20;
export const C_KLIC_40 = 40;

// Game status constants (from uConst.pas - original Delphi values)
export const C_IGRA_STATUS_START = 10;
export const C_IGRA_STATUS_KARTE_PREMESANE = 20;
export const C_IGRA_STATUS_KATRE_PRED_DELITVIJO = 25;
export const C_IGRA_STATUS_KARTE_RAZDELJENE_DEL_1 = 30;
export const C_IGRA_STATUS_ADUT_CAKAMO_IZBIRO = 40;
export const C_IGRA_STATUS_ADUT_IZBRAN = 50;
export const C_IGRA_STATUS_IZBIRANJE_IGRE = 60;
export const C_IGRA_STATUS_IZBIRANJE_IGRE_CAKAMO = 65;
export const C_IGRA_STATUS_IZBIRANJE_KONTRA = 70;
export const C_IGRA_STATUS_IZBIRANJE_KONTRA_CAKAMO = 70; // Note: Same as IZBIRANJE_KONTRA in Delphi
export const C_IGRA_STATUS_IGRA_SE_LAHKO_ZACNE = 170;
export const C_IGRA_STATUS_IGRA = 180;
export const C_IGRA_STATUS_POBERI_STIH = 290;
export const C_IGRA_STATUS_KLIC_ZAPRTI = 3000;
export const C_IGRA_STATUS_KLIC_ZAPRTI_WAIT2 = 3001;
export const C_IGRA_STATUS_VSE_KARTE_ODVEZENE = 3100;
export const C_IGRA_STATUS_IGRA_KONCANA = 3200;
export const C_IGRA_STATUS_IGRA_KONCANA_WAIT1 = 3300;
export const C_IGRA_STATUS_IGRA_KONCANA_WAIT2 = 3303;
export const C_IGRA_STATUS_TURNEJA_KONCANA = 3400;

// HTML5 version uses simplified status constants (kept for compatibility)
export const C_IGRA_STATUS_ZACETEK = 10;
export const C_IGRA_STATUS_NOVA_IGRA = 20;
export const C_IGRA_STATUS_IZBIRA_TIP_IGRE = 30;
export const C_IGRA_STATUS_IZBIRA_TIP_IGRE_NAPREJ = 35;
export const C_IGRA_STATUS_IZBIRA_KONTRA = 40;
export const C_IGRA_STATUS_IZBIRA_KONTRA_NAPREJ = 45;
export const C_IGRA_STATUS_IZBIRA_ADUT_RUFANJE = 50;
export const C_IGRA_STATUS_ZAMENJAVA_TALON = 60;
export const C_IGRA_STATUS_ZAMENJAVA_TALON_ZAKLJUCEK = 65;
export const C_IGRA_STATUS_STIH_ODSTEJ = 110;
export const C_IGRA_STATUS_ODSTEJ = 120;

// Log levels (MUST match uConst.pas values!)
export const C_LOG_NORMAL = 10;
export const C_LOG_INFO = 20;
export const C_LOG_WARNING = 30;
export const C_LOG_ERROR = 40;
export const C_LOG_DEBUG = 90;

// Text case
export const C_MALA_ZACETNICA = 0;
export const C_VELIKA_ZACETNICA = 1;

// Card dimensions
export const C_KARTA_WIDTH = 71;
export const C_KARTA_HEIGHT = 96;
export const C_KARTA_SMALL_WIDTH = 48;
export const C_KARTA_SMALL_HEIGHT = 64;

// Card position layout (for player 0 - bottom)
export const C_KARTA_LEFT_POSITION = [
    202, 247, 292, 337, 382, 427, 472, 517
];
export const C_KARTA_TOP_POSITION = 510;

// Risk levels for AI
export const C_TVEGANJE_NIZKO = 1;
export const C_TVEGANJE_SREDNJE = 2;
export const C_TVEGANJE_VISOKO = 3;

// Sound constants (will be used later)
export const C_SOUND_KLIC_20 = 'klic20';
export const C_SOUND_KLIC_40 = 'klic40';
export const C_SOUND_ZMAGA = 'zmaga';
export const C_SOUND_NEUSPEH = 'neuspeh';
export const C_SOUND_KARTA = 'karta';

// Card suit names (Slovenian)
export const BARVA_IMENA = ['Srce', 'Pik', 'Karo', 'Križ'];
export const BARVA_SYMBOLS = ['♥', '♠', '♦', '♣'];
export const BARVA_COLORS = ['#e74c3c', '#2c3e50', '#e74c3c', '#2c3e50']; // red, black, red, black

// Card type names (Slovenian)
export const TIP_IMENA = ['As', 'Deset', 'Kralj', 'Kraljica', 'Fant'];
export const TIP_SYMBOLS = ['A', '10', 'K', 'Q', 'J'];

// Default player names
export const DEFAULT_PLAYER_NAMES = ['Ti', 'Levo', 'Nasproti', 'Desno'];
