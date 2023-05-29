import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { GraphContext } from "../../App";
import logo from "../../bg/miRTarDis-v3.png";

export default function TopNav() {
  const navigate = useNavigate();
  const { showGraph, setShowGraph } = useContext(GraphContext);
  return (
    <div
      className="h-full w-full px-1 md:px-20 md:gap-5 py-1 flex justify-start items-center bg-gray-50
      border-y border-b-2 border-gray-300 transition-all gap-2 z-50 shadow-2xl"
    >
      {/* Home */}
      <div
        className="h-full w-fit px-2  flex justify-center items-center rounded 
        transition-all hover:bg-gray-200 duration-300 cursor-pointer"
        onClick={() => {
          navigate(`/`);
        }}
      >
        <div
          className="h-full w-20"
          style={{
            backgroundImage: `url(${logo})`,
            backgroundRepeat: "repeat-y",
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        ></div>
      </div>

      {/* 显示图选择器 */}
      <div className="h-full w-fit flex pr-2 justify-start items-center  ">
        {/* 背景 */}
        <div
          className={`h-6 w-9 relative rounded-full transform transition-all duration-500 cursor-pointer mr-2
         ${showGraph === true ? "bg-blue-200" : "bg-gray-200"}`}
          onClick={() => {
            setShowGraph(!showGraph);
          }}
        >
          {/* 选择小球 */}
          <div
            className={`h-6 w-6 absolute rounded-full transform transition-all duration-500 cursor-pointer
            ${
              showGraph === true ? "bg-blue-400 right-0" : "bg-gray-400 left-0"
            }`}
          ></div>
        </div>
        <span
          className={` font-semibold ${
            showGraph === true ? "text-blue-500" : "text-gray-500"
          }`}
        >
          Grapg?
        </span>
      </div>

      {/* RNA visualization */}
      <div
        className="h-full w-fit px-2 shrink-0 flex justify-center items-center rounded 
        transition-all hover:bg-gray-200 duration-300 cursor-pointer"
        onClick={() => {
          navigate(`/RNAVisualization`);
        }}
      >
        <div>
          <p className="text-gray-500 font-bold">Mi-RNA</p>
        </div>
      </div>

      {/* Paper */}
      <div
        className="h-full w-fit px-2  flex justify-center items-center rounded 
        transition-all hover:bg-gray-200 duration-300 cursor-pointer"
        onClick={() => {
          navigate(`/Paper`);
        }}
      >
        <div>
          <p className="text-gray-500 font-bold">Paper</p>
        </div>
      </div>

      {/* MirnaForm */}
      <div
        className="h-full w-fit px-2  flex justify-center items-center rounded 
        transition-all hover:bg-gray-200 duration-300 cursor-pointer"
        onClick={() => {
          navigate(`/MirnaForm/hsa-mir-25`);
        }}
      >
        <div>
          <p className="text-gray-500 font-bold">New</p>
        </div>
      </div>

      {/* About */}
      <div
        className="h-full w-fit px-2  flex justify-center items-center rounded 
        transition-all hover:bg-gray-200 duration-300 cursor-pointer"
        onClick={() => {
          navigate(`/About`);
        }}
      >
        <div>
          <p className="text-gray-500 font-bold">About</p>
        </div>
      </div>

      {/* Trending */}
      <div
        className="h-full w-fit px-2  flex justify-center items-center rounded 
        transition-all hover:bg-gray-200 duration-300 cursor-pointer"
        onClick={() => {
          navigate(`/Trending`);
        }}
      >
        <div>
          <p className="text-gray-500 font-bold">Trending</p>
        </div>
      </div>

      {/* Pubmed */}
      <div
        className="h-full w-fit px-2  flex justify-center items-center rounded 
        transition-all hover:bg-gray-200 duration-300 cursor-pointer"
        onClick={() => {
          window.open("https://pubmed.ncbi.nlm.nih.gov/", "_blank");
        }}
      >
        <p className="text-gray-500 font-bold">Pubmed</p>
      </div>

      {/* Help */}
      <div
        className="h-full w-fit px-2  flex justify-center items-center rounded 
        transition-all hover:bg-gray-200 duration-300 cursor-pointer"
        onClick={() => {
          navigate(`/Help`);
        }}
      >
        <div>
          <p className="text-gray-500 font-bold">Help</p>
        </div>
      </div>
    </div>
  );
}
