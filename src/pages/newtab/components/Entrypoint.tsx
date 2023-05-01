import React from "react";
import {
  useAllData,
  useClock,
  useDatabaseMigration,
  useLocalStorage,
  useRandomEntry,
} from "@src/utils/hooks";
import NightCityBG from "./night_city.jpg";
import { Clock } from "./Clock";

export function EntryPoint() {
  const item = useRandomEntry();
  const [envConfig] = useLocalStorage("envConfig", {});

  console.log(item);

  useDatabaseMigration(envConfig);
  return (
    <div
      className="bg-cover bg-center h-screen flex items-center justify-center"
      style={{
        backgroundImage: `url(${NightCityBG})`,
      }}
    >
      <Clock />
      <section id="reminders"></section>
    </div>
  );
}
