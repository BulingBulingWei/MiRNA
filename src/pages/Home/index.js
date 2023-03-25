// import React from "react";
import TopNav from "../../Component/TopNav";
import Search from "../PaperSearch";
import { useNavigate, Outlet, useLocation } from "react-router-dom";

export default function Home() {
  return (
    <div
      className="h-screen w-screen flex flex-col justify-start"
      // style={{ backgroundColor: "#475674" }}
    >
      {/* 导航栏 */}
      <nav className="w-full h-10 shrink-0 overflow-x-auto md:h-12 2xl:h-14 ">
        <TopNav></TopNav>
      </nav>
      {/* 页面 ,显示搜索框页面或者是搜索详情页面*/}
      <div
        className="w-full h-fit relative overflow-y-scroll overflow-x-scroll flex-grow 
      lg:overflow-y-hidden"
      >
        <Outlet></Outlet>
      </div>
    </div>
  );
}
