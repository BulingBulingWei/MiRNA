import React, { useState, useEffect, useRef, useContext } from "react";
import { useNavigate, Outlet, useLocation } from "react-router-dom";
import { GraphContext } from "../../App";
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
        <div>
          <p className="text-gray-500 font-bold">Home</p>
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

      {/* Contact */}
      {/* <div
        className="h-full w-fit px-2  flex justify-center items-center rounded 
        transition-all hover:bg-gray-200 duration-300 cursor-pointer"
        onClick={() => {
          navigate(`/`);
        }}
      >
        <div>
          <p className="text-gray-500 font-bold">Contact</p>
        </div>
      </div> */}

      {/* 显示图选择器 */}
      <div className="h-full w-fit flex px-2 justify-start items-center  ">
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
    </div>
  );
}
