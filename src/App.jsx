import React from "react";
import ChessGame from "./components/ChessGame";
import "./App.css"; // Regular CSS file

const App = () => {
  return (
    <div className="app-container">
      <h1 className="app-title">Gambit AI - React Chess Bot</h1>
      <ChessGame />
    </div>
  );
};

export default App;