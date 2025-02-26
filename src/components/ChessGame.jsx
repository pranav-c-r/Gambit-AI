import React, { useState, useEffect } from "react";
import { Chess } from "chess.js";
import { Chessboard } from "react-chessboard";
import { getStockfishMove, initStockfish } from "./BotAI";

const ChessGame = () => {
  const [game, setGame] = useState(new Chess());

  useEffect(() => {
    initStockfish(); // Initialize Stockfish when the component loads
  }, []);

  const onDrop = (sourceSquare, targetSquare) => {
    const newGame = new Chess(game.fen());
    const move = newGame.move({
      from: sourceSquare,
      to: targetSquare,
      promotion: "q", // Always promote to queen
    });

    if (move) {
      setGame(newGame);
      setTimeout(() => makeBotMove(newGame), 500);
    }
  };

  const makeBotMove = (newGame) => {
    getStockfishMove(newGame.fen(), (bestMove) => {
      if (bestMove) {
        newGame.move({ from: bestMove.substring(0, 2), to: bestMove.substring(2, 4) });
        setGame(new Chess(newGame.fen()));
      }
    });
  };

  return (
    <div className="game-container">
      <Chessboard position={game.fen()} onPieceDrop={onDrop} />
    </div>
  );
};

export default ChessGame;
