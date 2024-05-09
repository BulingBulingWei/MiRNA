import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { DropDownSvg } from "../../svg/index";
import logo from "../../bg/miRTarDis-v3.png";

// 电脑端导航栏
export default function TopNav() {
  const navigate = useNavigate();
  const location = useLocation().pathname;
  function isFocus(path, str) {
    if (path.search(str) !== -1) return true;
    return false;
  }

  const [MiRNADrop, setMiRNADrop] = useState(false);
  const [AboutDrop, setAboutDrop] = useState(false);
  const [DataDrop, setDataDrop] = useState(false);

  function beforeHandleSelect() {
    setMiRNADrop(false);
    setAboutDrop(false);
    setDataDrop(false);
  }

  return (
    <div
      className="h-full w-full min-w-full relative"
      style={{ whiteSpace: "nowrap" }}
    >
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
            beforeHandleSelect();
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
        ${isFocus(location, "Paper") ? "bg-sky-100" : ""}`}
          onClick={() => {
            beforeHandleSelect();
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
        ${MiRNADrop ? " border-sky-200" : " border-gray-50"}
        ${isFocus(location, "RNAVisualization") ? "bg-sky-100" : ""}`}
          onClick={() => {
            beforeHandleSelect();
            navigate(`/RNAVisualization`);
          }}
        >
          <div>
            <p className="text-gray-500 font-bold">miRNA</p>
          </div>
          <div
            className="h-full w-fit pl-2 flex justify-center items-center"
            onClick={(event) => {
              event.stopPropagation();
              setMiRNADrop((drop) => !drop);
            }}
          >
            <DropDownSvg></DropDownSvg>
          </div>
        </div>

        {/* miRNA-Disease-Data */}
        <div
          className={`h-full w-fit px-12  flex justify-center items-center rounded 
        transition-all hover:bg-sky-100 duration-300 cursor-pointer 
        ${DataDrop ? " border-sky-200" : " border-gray-50"}   
        ${isFocus(location, "Data") ? "bg-sky-100" : ""}`}
          onClick={(event) => {
            event.stopPropagation();
            setDataDrop((drop) => !drop);
          }}
        >
          <div>
            <p className="text-gray-500 font-bold">Data</p>
          </div>
          <div
            className="h-full w-fit pl-2 flex justify-center items-center"
            onClick={(event) => {
              event.stopPropagation();
              setDataDrop((drop) => !drop);
            }}
          >
            <DropDownSvg></DropDownSvg>
          </div>
        </div>

        {/* DownloadFiles */}
        <div
          className={`h-full w-fit px-2  flex justify-center items-center rounded 
        transition-all hover:bg-sky-100 duration-300 cursor-pointer 
        ${isFocus(location, "DownloadFiles") ? "bg-sky-100" : ""}`}
          onClick={() => {
            beforeHandleSelect();
            navigate(`/DownloadFiles`);
          }}
        >
          <div>
            <p className="text-gray-500 font-bold">Download</p>
          </div>
        </div>

        {/* About */}
        <div
          className={`h-full w-fit px-2  flex justify-center items-center rounded 
        transition-all hover:bg-sky-100 duration-300 cursor-pointer border-2
        ${AboutDrop ? " border-sky-200" : " border-gray-50"}      
          ${isFocus(location, "About") ? "bg-sky-100" : ""}`}
          onClick={() => {
            beforeHandleSelect();
            navigate(`/About`);
          }}
        >
          <div>
            <p className="text-gray-500 font-bold">About</p>
          </div>
          <div
            className="h-full w-fit pl-2 flex justify-center items-center"
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
        ${MiRNADrop ? "opacity-100" : "opacity-0 hidden"}`}
        style={{ left: "16.2rem" }}
        onMouseLeave={() => {
          setMiRNADrop(false);
        }}
      >
        {/* MirnaForm */}
        <div
          className={`h-10 w-full px-6 flex justify-center items-center rounded 
        transition-all hover:bg-sky-100 duration-300 cursor-pointer bg-gray-50
        border-2 border-gray-300`}
          style={{
            backgroundColor: `${
              isFocus(location, "MirnaStruct") ? "#e0f2fe" : "#f9fafb"
            }`,
          }}
          onClick={() => {
            beforeHandleSelect();
            navigate(`/MirnaStruct/hsa-mir-25`);
          }}
        >
          <div>
            <p className="text-gray-500 font-bold">Struct</p>
          </div>
        </div>

        {/* Drug Info */}
        <div
          className={`h-10 w-full px-6 flex justify-center items-center rounded 
        transition-all hover:bg-sky-100 duration-300 cursor-pointer bg-gray-50
        border-2 border-gray-300`}
          style={{
            backgroundColor: `${
              isFocus(location, "DrugInfo") ? "#e0f2fe" : "#f9fafb"
            }`,
          }}
          onClick={() => {
            beforeHandleSelect();
            navigate(`/DrugInfo/Gefitinib`);
          }}
        >
          <div>
            <p className="text-gray-500 font-bold">Drug</p>
          </div>
        </div>

        {/* Gene Info */}
        <div
          className={`h-10 w-full px-6 flex justify-center items-center rounded 
        transition-all hover:bg-sky-100 duration-300 cursor-pointer bg-gray-50
        border-2 border-gray-300`}
          style={{
            backgroundColor: `${
              isFocus(location, "GeneInfo") ? "#e0f2fe" : "#f9fafb"
            }`,
          }}
          onClick={() => {
            beforeHandleSelect();
            navigate(`/GeneInfo/C1D`);
          }}
        >
          <div>
            <p className="text-gray-500 font-bold">Gene</p>
          </div>
        </div>
      </div>
      {/* Data下拉的选项 */}
      <div
        className={`z-50 absolute flex flex-col transition-all duration-500
        ${DataDrop ? "opacity-100" : "opacity-0 hidden"}`}
        style={{ left: "23.5rem", width: "9.8rem" }}
        onMouseLeave={() => {
          setDataDrop(false);
        }}
      >
        {/* mirna-disease */}
        <div
          className={`h-10 w-full px-1 flex justify-center items-center rounded 
        transition-all hover:bg-sky-100 duration-300 cursor-pointer bg-gray-50
        border-2 border-gray-300 `}
          style={{
            backgroundColor: `${
              isFocus(location, "miRNA-Disease-Data") ? "#e0f2fe" : "#f9fafb"
            }`,
          }}
          onClick={() => {
            beforeHandleSelect();
            navigate(`/miRNA-Disease-Data`);
          }}
        >
          <div>
            <p className="text-gray-500 font-bold">miRNA-Disease</p>
          </div>
        </div>

        {/* mirna-drug */}
        <div
          className={`h-10 w-full px-1 flex justify-center items-center rounded 
        transition-all hover:bg-sky-100 duration-300 cursor-pointer bg-gray-50
        border-2 border-gray-300 `}
          style={{
            backgroundColor: `${
              isFocus(location, "miRNA-Drug-Data") ? "#e0f2fe" : "#f9fafb"
            }`,
          }}
          onClick={() => {
            beforeHandleSelect();
            navigate(`/miRNA-Drug-Data`);
          }}
        >
          <div>
            <p className="text-gray-500 font-bold">miRNA-Drug</p>
          </div>
        </div>

        {/* miRNA-Gene */}
        <div
          className={`h-10 w-full px-1 flex justify-center items-center rounded 
        transition-all hover:bg-sky-100 duration-300 cursor-pointer bg-gray-50
        border-2 border-gray-300`}
          style={{
            backgroundColor: `${
              isFocus(location, "miRNA-Gene-Data") ? "#e0f2fe" : "#f9fafb"
            }`,
          }}
          onClick={() => {
            beforeHandleSelect();
            navigate(`/miRNA-Gene-Data`);
          }}
        >
          <div>
            <p className="text-gray-500 font-bold">miRNA-Gene</p>
          </div>
        </div>
      </div>
      {/* About下拉的选项 */}
      <div
        className={`h-fit z-50 absolute flex flex-col transition-all duration-500
        ${AboutDrop ? " opacity-100" : " opacity-0 hidden"}`}
        style={{ left: "41.5rem", width: "5.8rem" }}
        onMouseLeave={() => {
          setAboutDrop(false);
        }}
      >
        {/* Trending */}
        <div
          className={`h-10 w-full px-2 flex justify-center items-center rounded 
        transition-all hover:bg-sky-100 duration-300 cursor-pointer bg-gray-50
        border-2 border-gray-300 `}
          style={{
            backgroundColor: `${
              isFocus(location, "Trending") ? "#e0f2fe" : "#f9fafb"
            }`,
          }}
          onClick={() => {
            beforeHandleSelect();
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
        border-2 border-gray-300`}
          style={{
            backgroundColor: `${
              isFocus(location, "Help") ? "#e0f2fe" : "#f9fafb"
            }`,
          }}
          onClick={() => {
            beforeHandleSelect();
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
