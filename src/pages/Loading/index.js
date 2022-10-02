import React from "react";
import { LoadingSvg as Svg } from "../../svg";

export default function index() {
  return (
    <div
      className="fixed flex justify-center items-center w-screen h-screen bg-opacity-90 gap-2"
      style={{ backgroundColor: "#d8e9fd" }}
    >
      <p className="text-2xl text-gray-500 font-bold md:text-5xl xl:text-7xl">
        Loading
      </p>
      <div className="h-10 w-10 md:h-20 md:w-20 xl:h-44 xl:w-44 flex justify-center items-center">
        <Svg className="animate-spin-slow " size={180}></Svg>
      </div>
    </div>
  );
}
