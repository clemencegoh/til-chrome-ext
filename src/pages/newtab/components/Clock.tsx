import { useClock } from "@src/utils/hooks";
import React from "react";

export function Clock() {
  const clockTime = useClock();
  return (
    <div className="bg-gray-900 bg-opacity-30 rounded-2xl text-white text-8xl">
      <h1>
        {clockTime
          .toLocaleTimeString("en-GB", {
            hour: "numeric",
            minute: "numeric",
            hour12: false,
          })
          .toUpperCase()}
      </h1>
    </div>
  );
}
