import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { DropDownSvg } from "../../svg/index";
import logo from "../../bg/miRTarDis-v3.png";

export default function TopNav() {
  const navigate = useNavigate();
  const location = useLocation().pathname;
  function isFocus(path, str) {
    if (path.search(str) !== -1) return true;
    return false;
  }

  const [MiRNADrop, setMiRNADrop] = useState(false);
  const [AboutDrop, setAboutDrop] = useState(false);

  return (
    <div className="h-full w-full min-w-full relative">
      {/* overflow-x-auto */}
      <div
        className="h-full w-full min-w-full overflow-x-auto px-1
         md:px-16 md:gap-5 py-1 flex justify-start items-start bg-gray-50
      border-y border-b-2 border-gray-300 transition-all gap-1 shadow-lg"
      >
        {/* Home */}
        <div
          className={`h-full w-fit px-2  flex justify-center items-center rounded 
        transition-all hover:bg-sky-100 duration-300 cursor-pointer 
       `}
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

        {/* Paper */}
        <div
          className={`h-full w-fit px-2  flex justify-center items-center rounded 
        transition-all hover:bg-sky-100 duration-300 cursor-pointer
        ${isFocus(location, "Paper") === true ? "bg-sky-100" : ""}`}
          onClick={() => {
            navigate(`/Paper`);
          }}
        >
          <div>
            <p className="text-gray-500 font-bold">Paper</p>
          </div>
        </div>

        {/* MiRNA visualization */}
        <div
          className={`h-full w-fit px-2  flex justify-center items-center rounded 
        transition-all hover:bg-sky-100 duration-300 cursor-pointer border-2
        ${MiRNADrop === true ? " border-sky-200" : " border-gray-50"}
        ${isFocus(location, "RNAVisualization") === true ? "bg-sky-100" : ""}`}
          onClick={() => {
            navigate(`/RNAVisualization`);
          }}
        >
          <div>
            <p className="text-gray-500 font-bold">MiRNA</p>
          </div>
          <div
            className="h-full w-fit pl-2 flex justify-center items-center"
            onMouseEnter={() => {
              setMiRNADrop(true);
            }}
            onClick={(event) => {
              event.stopPropagation();
              setMiRNADrop((drop) => !drop);
            }}
          >
            <DropDownSvg></DropDownSvg>
          </div>
        </div>

        {/* DownlowData */}
        <div
          className={`h-full w-fit px-2  flex justify-center items-center rounded 
        transition-all hover:bg-sky-100 duration-300 cursor-pointer 
        ${isFocus(location, "DownloadData") === true ? "bg-sky-100" : ""}`}
          onClick={() => {
            navigate(`/DownloadData`);
          }}
        >
          <div>
            <p className="text-gray-500 font-bold">Data</p>
          </div>
        </div>

        {/* About */}
        <div
          className={`h-full w-fit px-2  flex justify-center items-center rounded 
        transition-all hover:bg-sky-100 duration-300 cursor-pointer border-2
        ${AboutDrop === true ? " border-sky-200" : " border-gray-50"}      
          ${isFocus(location, "About") === true ? "bg-sky-100" : ""}`}
          onClick={() => {
            navigate(`/About`);
          }}
        >
          <div>
            <p className="text-gray-500 font-bold">About</p>
          </div>
          <div
            className="h-full w-fit pl-2 flex justify-center items-center"
            onMouseEnter={() => {
              setAboutDrop(true);
            }}
            onClick={(event) => {
              event.stopPropagation();
              setAboutDrop((drop) => !drop);
            }}
          >
            <DropDownSvg></DropDownSvg>
          </div>
        </div>

        {/* Pubmed */}
        <div
          className="h-full w-fit px-2  flex justify-center items-center rounded 
        transition-all hover:bg-sky-100 duration-300 cursor-pointer"
          onClick={() => {
            window.open("https://pubmed.ncbi.nlm.nih.gov/", "_blank");
          }}
        >
          <p className="text-gray-500 font-bold">Pubmed</p>
        </div>
      </div>

      {/* MiRNA下拉的选项 */}
      <div
        className={` w-fit z-50 absolute flex flex-col transition-all duration-500
        ${MiRNADrop === true ? "opacity-100" : "opacity-0 hidden"}`}
        style={{ left: "16.2rem" }}
        onMouseLeave={() => {
          setMiRNADrop(false);
        }}
      >
        {/* MirnaForm */}
        <div
          className={`h-10 w-full px-6 flex justify-center items-center rounded 
        transition-all hover:bg-sky-100 duration-300 cursor-pointer bg-gray-50
        border-2 border-gray-300
        ${isFocus(location, "Paper") === true ? "bg-sky-100" : ""}`}
          onClick={() => {
            navigate(`/MirnaStruct/hsa-mir-25`);
          }}
        >
          <div>
            <p className="text-gray-500 font-bold">Struct</p>
          </div>
        </div>
      </div>

      {/* About下拉的选项 */}
      <div
        className={`h-fit w-fit z-50 absolute flex flex-col transition-all duration-500
        ${AboutDrop === true ? " opacity-100" : " opacity-0 hidden"}`}
        style={{ left: "28rem" }}
        onMouseLeave={() => {
          setAboutDrop(false);
        }}
      >
        {/* Trending */}
        <div
          className={`h-10 w-full px-2 flex justify-center items-center rounded 
        transition-all hover:bg-sky-100 duration-300 cursor-pointer bg-gray-50
        border-2 border-gray-300 
            ${isFocus(location, "Trending") === true ? "bg-sky-100" : ""}`}
          onClick={() => {
            navigate(`/Trending`);
          }}
        >
          <div>
            <p className="text-gray-500 font-bold">Trending</p>
          </div>
        </div>

        {/* Help */}
        <div
          className={`h-10 w-full px-3  flex justify-center items-center rounded 
        transition-all hover:bg-sky-100 duration-300 cursor-pointer bg-gray-50
        border-2 border-gray-300
            ${isFocus(location, "Help") === true ? "bg-sky-100" : ""}`}
          onClick={() => {
            navigate(`/Help`);
          }}
        >
          <div>
            <p className="text-gray-500 font-bold">Help</p>
          </div>
        </div>
      </div>
    </div>
  );
}
