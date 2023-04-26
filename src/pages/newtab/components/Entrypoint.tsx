import React from "react";
import {
  useAllData,
  useDatabaseMigration,
  useLocalStorage,
} from "@src/utils/hooks";

export function EntryPoint() {
  // const items = useAllData();
  const [envConfig] = useLocalStorage("envConfig", {});
  useDatabaseMigration(envConfig);
  return <div></div>;
}
