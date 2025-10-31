import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { makeServer } from "./mirageServer";


makeServer();

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
