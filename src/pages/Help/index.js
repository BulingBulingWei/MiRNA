import React from "react";
import bgimg from "../../img/img17.jpg";

export default function Help() {
  return (
    <div
      className="h-full w-full transition-all duration-500"
      style={{
        backgroundImage: `url(${bgimg})`,
        backgroundRepeat: "none",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div
        className="h-full w-full flex flex-col justify-start items-center"
        style={{
          background: "rgba(39, 39, 39,0.35)",
        }}
      ></div>
    </div>
  );
}
