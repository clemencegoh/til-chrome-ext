import React, { useContext, createContext } from "react";
import { TEnvConfig, defaultEnvConfig } from "./constants";

export const EnvironmentContext = createContext({
  envConfig: defaultEnvConfig,
  setEnvConfig: (config: TEnvConfig) => {
    return;
  },
});
