let stockfish = null;

export const initStockfish = async () => {
  if (stockfish) return true;

  try {
    // Create a new WASM worker
    stockfish = new Worker(new URL('stockfish/src/stockfish.js', import.meta.url));
    
    // Wait for engine to be ready
    await new Promise((resolve) => {
      stockfish.onmessage = (e) => {
        if (e.data === 'uciok') resolve();
      };
      stockfish.postMessage('uci');
    });

    // Configure engine
    stockfish.postMessage('setoption name Skill Level value 20');
    stockfish.postMessage('setoption name Threads value 2');
    return true;
  } catch (error) {
    console.error('Engine init error:', error);
    stockfish = null;
    return false;
  }
};

export const getStockfishMove = (fen, callback) => {
  if (!stockfish) {
    console.error('Engine not initialized');
    return;
  }

  const handler = (e) => {
    if (e.data.startsWith('bestmove')) {
      const move = e.data.split(' ')[1];
      stockfish.removeEventListener('message', handler);
      if (move && move !== 'none') callback(move);
    }
  };

  stockfish.addEventListener('message', handler);
  stockfish.postMessage(`position fen ${fen}`);
  stockfish.postMessage('go movetime 2000');
};