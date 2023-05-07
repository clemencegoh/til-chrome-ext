import React from "react";
import {
  useDatabaseMigration,
  useLocalStorage,
  useRandomEntry,
} from "@src/utils/hooks";
import NightCityBG from "./night_city.jpg";
import { Clock } from "./Clock";
import { TILCard } from "./TILCard";

export function EntryPoint() {
  const item = useRandomEntry();
  const [envConfig] = useLocalStorage("envConfig", {});
  useDatabaseMigration(envConfig);

  return (
    <div
      className="bg-cover bg-center h-screen flex items-center justify-center flex-col gap-8"
      style={{
        backgroundImage: `url(${NightCityBG})`,
      }}
    >
      <section className="">
        <Clock />
      </section>

      <section id="reminders" className="min-w-[20rem]">
        {item && (
          <TILCard
            title={item.title}
            externalLink={item.link}
            tags={item.tags}
            imageURL={item.snippetImg}
            content={item.snippetText}
          />
        )}
      </section>
    </div>
  );
}
