import React from "react";
import "@pages/newtab/Newtab.css";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { EntryPoint } from "./components/Entrypoint";
import "@assets/styles/tailwind.css";

const queryClient = new QueryClient();

export default function Newtab(): JSX.Element {
  return (
    <QueryClientProvider client={queryClient}>
      <EntryPoint />
    </QueryClientProvider>
  );
}
