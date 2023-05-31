import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import logo from "../../bg/miRTarDis-v3.png";

export default function TopNav() {
  const navigate = useNavigate();
  const location = useLocation().pathname;
  function isFocus(path, str) {
    if (path.search(str) !== -1) return true;
    return false;
  }

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
        transition-all hover:bg-sky-100 duration-300 cursor-pointer 
        ${isFocus(location, "RNAVisualization") === true ? "bg-sky-100" : ""}`}
          onClick={() => {
            navigate(`/RNAVisualization`);
          }}
        >
          <div>
            <p className="text-gray-500 font-bold">MiRNA</p>
          </div>
        </div>

        {/* MirnaForm */}
        <div
          className={`h-full w-fit px-2  flex justify-center items-center rounded 
        transition-all hover:bg-sky-100 duration-300 cursor-pointer 
        ${isFocus(location, "MirnaStruct") === true ? "bg-sky-100" : ""}`}
          onClick={() => {
            navigate(`/MirnaStruct/hsa-mir-25`);
          }}
        >
          <div>
            <p className="text-gray-500 font-bold">Struct</p>
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
        transition-all hover:bg-sky-100 duration-300 cursor-pointer       
          ${isFocus(location, "About") === true ? "bg-sky-100" : ""}`}
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
          className={`h-full w-fit px-2  flex justify-center items-center rounded 
        transition-all hover:bg-sky-100 duration-300 cursor-pointer 
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
          className={`h-full w-fit px-2  flex justify-center items-center rounded 
        transition-all hover:bg-sky-100 duration-300 cursor-pointer 
            ${isFocus(location, "Help") === true ? "bg-sky-100" : ""}`}
          onClick={() => {
            navigate(`/Help`);
          }}
        >
          <div>
            <p className="text-gray-500 font-bold">Help</p>
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
    </div>
  );
}
