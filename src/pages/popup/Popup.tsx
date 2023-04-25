import React, { useEffect, useState } from "react";
import { SnippetForm } from "./components/SnippetForm";
import { ConfigForm } from "./components/ConfigForm";
import { useLocalStorage } from "@src/utils/hooks";

export default function Popup(): JSX.Element {
  const [envConfig, setEnvConfig] = useLocalStorage("envConfig", {
    notionToken: "",
    databaseId: "",
  });

  const isMissingDetails = Object.values(envConfig).includes("");

  return (
    <div className="absolute top-0 left-0 right-0 bottom-0 h-full p-3 dark:bg-gray-900">
      <header className="flex flex-col">
        {isMissingDetails ? (
          <>
            <h1 className="block text-lg text-center font-bold text-gray-900 dark:text-white">
              API Configs missing!
            </h1>
            <h3 className="block text-md text-center font-semibold text-gray-900 dark:text-white">
              Enter configs below to get started:
            </h3>
            <ConfigForm />
          </>
        ) : (
          <SnippetForm />
        )}
      </header>
    </div>
  );
}
