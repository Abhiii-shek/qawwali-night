import React, { useState, useEffect } from "react";

export const Clock: React.FC = () => {
  const [timeStr, setTimeStr] = useState<string>("");

  useEffect(() => {
    const updateTime = () => {
      try {
        const now = new Date();
        const formatted = new Intl.DateTimeFormat("en-IN", {
          timeZone: "Asia/Kolkata",
          hour: "2-digit",
          minute: "2-digit",
          hour12: true,
        }).format(now);
        setTimeStr(formatted);
      } catch (e) {
        setTimeStr("01:47 AM");
      }
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  if (!timeStr) {
    return (
      <div className="flex flex-col items-start font-mono text-xs tracking-wider text-[#F4DFC0]/80">
        <span className="text-[#D6A85C] font-semibold">01:47 AM</span>
        <span className="text-[9px] uppercase tracking-widest text-[#F4DFC0]/50">MUMBAI • IST</span>
      </div>
    );
  }

  // Split time into parts to animate blinking colon
  const parts = timeStr.split(":");
  const hour = parts[0] || "01";
  const rest = parts[1] || "47 AM";
  const [minute, ampm] = rest.split(" ");

  return (
    <div className="flex flex-col items-start font-mono text-xs tracking-wider select-none">
      <div className="flex items-center text-[#D6A85C] font-semibold drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)] text-sm sm:text-base">
        <span>{hour}</span>
        <span className="animate-blink mx-[1px] text-[#C98238] font-bold">:</span>
        <span>{minute}</span>
        {ampm && <span className="ml-1 text-[11px] font-sans font-medium text-[#F4DFC0]/80">{ampm}</span>}
      </div>
      <div className="flex items-center gap-1 text-[9.5px] uppercase tracking-[0.22em] text-[#F4DFC0]/60 font-sans">
        <span className="inline-block w-1.5 h-1.5 rounded-full bg-[#C98238]/80 animate-pulse"></span>
        <span>MUMBAI • MEHFIL IST</span>
      </div>
    </div>
  );
};
