"use client";

import { useEffect, useState } from "react";
import { Snowflake, Gift } from "lucide-react";

export default function CountdownCard() {
  const [timeRemaining, setTimeRemaining] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  useEffect(() => {
    const calculateTimeRemaining = () => {
      const now = new Date();

      const christmas = new Date(now.getFullYear(), 11, 25);

      if (now > christmas) {
        christmas.setFullYear(now.getFullYear() + 1);
      }

      const difference = christmas.getTime() - now.getTime();

      setTimeRemaining({
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((difference / (1000 * 60)) % 60),
        seconds: Math.floor((difference / 1000) % 60),
      });
    };

    calculateTimeRemaining();

    const interval = setInterval(calculateTimeRemaining, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative bg-emerald-600 rounded-xl shadow-lg p-4 text-white border-emerald-700 overflow-hidden">
      <div className="absolute top-2 left-3 animate-pulse">
        <Snowflake className="w-4 h-4 text-white/30" />
      </div>

      <div
        className="absolute top-2 right-3 animate-pulse"
        style={{ animationDelay: "0.5s" }}
      >
        <Snowflake className="w-3 h-3 text-white/30" />
      </div>

      <div
        className="absolute bottom-2 left-5 animate-pulse"
        style={{ animationDelay: "1s" }}
      >
        <Snowflake className="w-3 h-3 text-white/30" />
      </div>

      <div
        className="absolute bottom-2 right-5 animate-pulse"
        style={{ animationDelay: "1.5s" }}
      >
        <Snowflake className="w-4 h-4 text-white/30" />
      </div>

      <div className="relative z-10">
        <div className="flex items-center justify-center gap-2 mb-3">
          <Gift className="w-5 h-5" />
          <h2 className="text-lg font-bold">Countdown to Christmas</h2>
        </div>

        <div className="grid grid-cols-4 gap-2">
          <TimeBox label="Days" value={timeRemaining.days} />
          <TimeBox
            label="Hours"
            value={String(timeRemaining.hours).padStart(2, "0")}
          />
          <TimeBox
            label="Min"
            value={String(timeRemaining.minutes).padStart(2, "0")}
          />
          <TimeBox
            label="Sec"
            value={String(timeRemaining.seconds).padStart(2, "0")}
          />
        </div>
      </div>
    </div>
  );
}

function TimeBox({
  label,
  value,
}: {
  label: string;
  value: string | number;
}) {
  return (
    <div className="bg-white/20 backdrop-blur-sm rounded-lg p-2 text-center border border-white/30">
      <div className="text-2xl font-bold">{value}</div>
      <div className="text-xs uppercase">{label}</div>
    </div>
  );
}