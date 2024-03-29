import { useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";

function App() {
  const [count, setCount] = useState("");

  function onClick() {
    console.log(import.meta.env.VITE_API_URL);
    fetch(import.meta.env.VITE_API_URL, {
      method: "POST",
    })
      .then((response) => response.text())
      .then(setCount);
  }

  return (
    <>
      <div>
        <a href="https://vitejs.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>Vite + React</h1>
      <div className="card">
        <button onClick={onClick}>count is {count ? count : "unknown"}</button>
        <p>
          Edit <code>src/App.tsx</code> and save to test HMR
        </p>
        <p>
      Aysha Cheema hehe 
    </p>
      </div>
      <p className="read-the-docs">
        My name is Maryam Taraif 
      </p>
    </>
  );
}

export default App;
