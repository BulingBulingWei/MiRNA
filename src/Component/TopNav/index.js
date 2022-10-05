// import React from "react";
import { useNavigate, Outlet, useLocation } from "react-router-dom";
export default function TopNav() {
  const navigate = useNavigate();
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

      {/* Pubmed */}
      <div
        className="h-full w-fit px-2  flex justify-center items-center rounded 
        transition-all hover:bg-gray-200 duration-300 cursor-pointer"
      >
        <a href="https://pubmed.ncbi.nlm.nih.gov/">
          <p className="text-gray-500 font-bold">Pubmed</p>
        </a>
      </div>

      {/* About */}
      <div
        className="h-full w-fit px-2  flex justify-center items-center rounded 
        transition-all hover:bg-gray-200 duration-300 cursor-pointer"
        onClick={() => {
          navigate(`/`);
        }}
      >
        <div>
          <p className="text-gray-500 font-bold">About</p>
        </div>
      </div>

      {/* Contact */}
      <div
        className="h-full w-fit px-2  flex justify-center items-center rounded 
        transition-all hover:bg-gray-200 duration-300 cursor-pointer"
        onClick={() => {
          navigate(`/`);
        }}
      >
        <div>
          <p className="text-gray-500 font-bold">Contact</p>
        </div>
      </div>
    </div>
  );
}
