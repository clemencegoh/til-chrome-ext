import React from "react";
import logo from "@assets/img/logo.svg";
import "@pages/newtab/Newtab.css";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { EntryPoint } from "./components/Entrypoint";

const queryClient = new QueryClient();

export default function Newtab(): JSX.Element {
  return (
    <QueryClientProvider client={queryClient}>
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <p>
            Edit <code>src/pages/newtab/Newtab.tsx</code> and save to reload.
          </p>
          <a
            className="App-link"
            href="https://reactjs.org"
            target="_blank"
            rel="noopener noreferrer"
          >
            Learn React!
          </a>
        </header>
        <body>
          <EntryPoint />
        </body>
      </div>
    </QueryClientProvider>
  );
}
