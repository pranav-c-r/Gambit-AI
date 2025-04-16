import React, { useState, useEffect } from "react";
import { Chess } from "chess.js";
import { Chessboard } from "react-chessboard";
import { initStockfish, getStockfishMove } from "./botAI";

const ChessGame = () => {
  const [game, setGame] = useState(new Chess());
  const [status, setStatus] = useState("Loading chess engine...");
  const [engineReady, setEngineReady] = useState(false);
  const [boardSize, setBoardSize] = useState(400);

  // Initialize engine and set up responsive sizing
  useEffect(() => {
    // Initialize Stockfish engine
    const initializeEngine = async () => {
      try {
        setStatus("Initializing AI engine...");
        const success = await initStockfish();
        if (success) {
          setEngineReady(true);
          setStatus("Your turn (White)");
        } else {
          setStatus("Failed to load engine. Please refresh.");
        }
      } catch (error) {
        console.error("Engine initialization error:", error);
        setStatus("Engine error. Please refresh.");
      }
    };

    // Calculate initial board size
    const calculateBoardSize = () => {
      const size = Math.min(
        window.innerWidth * 0.9,
        window.innerHeight * 0.7,
        500
      );
      setBoardSize(size);
    };

    initializeEngine();
    calculateBoardSize();

    // Set up resize listener
    const handleResize = () => {
      calculateBoardSize();
    };

    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  // Handle piece movement
  const onDrop = (sourceSquare, targetSquare) => {
    if (!engineReady) return false;

    const gameCopy = new Chess(game.fen());
    const move = gameCopy.move({
      from: sourceSquare,
      to: targetSquare,
      promotion: "q",
    });

    if (!move) return false;

    setGame(gameCopy);
    setStatus("AI thinking...");

    getStockfishMove(gameCopy.fen(), (bestMove) => {
      const newGame = new Chess(gameCopy.fen());
      newGame.move({
        from: bestMove.substring(0, 2),
        to: bestMove.substring(2, 4),
      });
      setGame(newGame);
      setStatus(`Your turn (${newGame.turn() === "w" ? "White" : "Black"})`);

      // Check for game end
      if (newGame.isGameOver()) {
        if (newGame.isCheckmate()) {
          setStatus(`Checkmate! ${newGame.turn() === "w" ? "Black" : "White"} wins`);
        } else if (newGame.isDraw()) {
          setStatus("Game ended in draw");
        }
      }
    });

    return true;
  };

  // Reset game
  const resetGame = () => {
    setGame(new Chess());
    setStatus("Your turn (White)");
  };

  return (
    <div style={{
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      minHeight: "100vh",
      padding: "20px",
      backgroundColor: "#1a1a1a",
      color: "white",
      boxSizing: "border-box"
    }}>
      <h1 style={{ 
        marginBottom: "20px",
        fontSize: "clamp(1.5rem, 4vw, 2rem)",
        textAlign: "center"
      }}>
        Chess with AI
      </h1>
      
      <div style={{
        margin: "10px 0",
        padding: "10px 15px",
        backgroundColor: engineReady ? "#4CAF50" : "#F44336",
        borderRadius: "4px",
        fontWeight: "bold",
        textAlign: "center",
        minWidth: "200px"
      }}>
        {status}
      </div>

      <div style={{ 
        width: boardSize,
        height: boardSize,
        margin: "20px auto"
      }}>
        <Chessboard
          position={game.fen()}
          onPieceDrop={onDrop}
          boardOrientation="white"
          boardWidth={boardSize}
          customBoardStyle={{
            borderRadius: "8px",
            boxShadow: "0 5px 15px rgba(0, 0, 0, 0.5)"
          }}
          customDarkSquareStyle={{ backgroundColor: "#779556" }}
          customLightSquareStyle={{ backgroundColor: "#ebecd0" }}
        />
      </div>

      <button
        onClick={resetGame}
        disabled={!engineReady}
        style={{
          padding: "10px 20px",
          backgroundColor: engineReady ? "#2196F3" : "#9E9E9E",
          color: "white",
          border: "none",
          borderRadius: "4px",
          fontSize: "1rem",
          fontWeight: "bold",
          cursor: engineReady ? "pointer" : "not-allowed",
          marginTop: "20px",
          transition: "background-color 0.3s"
        }}
      >
        New Game
      </button>
    </div>
  );
};

export default ChessGame;