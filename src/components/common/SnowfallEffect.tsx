"use client";
import { useEffect, useState } from "react";
import Snowfall from "react-snowfall";

export function SnowfallEffect() {
  const [inSeason, setInSeason] = useState(false);

  useEffect(() => {
    const month = new Date().getMonth(); // 0 = January, 11 = December
    setInSeason(month >= 10 || month <= 1); // November–February
  }, []);

  if (!inSeason) return null;
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
      <Snowfall
        color="#c8e8ff"
        snowflakeCount={180}
        speed={[0.5, 1.5]}
        wind={[-0.4, 0.4]}
        radius={[0.10, 2.4]}
        style={{ width: "100%", height: "100%" }}
      />
    </div>
  );
}
