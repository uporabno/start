// Web Worker za AI analizo - teče v ločeni niti!
// Ne blokira UI thread

// Import Chess.js in AI engine (različica za Worker - brez omejitev)
importScripts('chess.js');

// CUSTOM Predlagaj_Potezo za Worker - BREZ omejitve maxLevel
// (kopija iz sah-ai.js, ampak omogoča L1-L6)
importScripts('sah-ai-worker-engine.js');

// Listen za messages iz main thread
self.addEventListener('message', async function(e) {
    const { type, fen, maxTime, analysisId } = e.data;

    if (type === 'ANALYZE_LEVEL') {
        try {
            // V Worker-ju omogočimo VSE LEVELE 1-6
            // Main thread ne blokira!
            console.log('🔧 Worker: Analiza L1-L6 v ozadju...');

            const predlogi = await Predlagaj_Potezo_Worker(fen, maxTime, (level, poteza, ocena, cas_ms) => {
                // Callback - pošlji rezultat nazaj v main thread
                self.postMessage({
                    type: 'LEVEL_RESULT',
                    analysisId: analysisId,
                    level: level,
                    poteza: poteza,
                    ocena: ocena,
                    cas_ms: cas_ms
                });
            });

            // Pošlji da je končano
            self.postMessage({
                type: 'ANALYSIS_COMPLETE',
                analysisId: analysisId,
                predlogi: predlogi
            });

        } catch (error) {
            self.postMessage({
                type: 'ERROR',
                analysisId: analysisId,
                error: error.message
            });
        }
    }
});
