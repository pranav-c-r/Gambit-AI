import React from "react";
import ChessGame from "./components/ChessGame";
import "./app.css"; // App-specific styles

const App = () => {
  return (
    <div className="app">
      <h1>Gambit AI - React Chess Bot</h1>
      <ChessGame />
    </div>
  );
};

export default App;
