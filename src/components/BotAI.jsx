let stockfish;

export const initStockfish = () => {
  stockfish = new Worker(new URL("stockfish/src/stockfish.js", import.meta.url));
};

export const getStockfishMove = (fen, callback) => {
  if (!stockfish) initStockfish();

  stockfish.postMessage(`position fen ${fen}`);
  stockfish.postMessage("go depth 15");

  stockfish.onmessage = (event) => {
    if (event.data.startsWith("bestmove")) {
      const move = event.data.split(" ")[1];
      callback(move);
    }
  };
};
