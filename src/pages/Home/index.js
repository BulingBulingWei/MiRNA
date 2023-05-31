import React from "react";
// import TopNav from "../../Component/TopNav";
import TopNav from "../../Component/TopNav";
import PhoneNav from "../../Component/Nav";
import { Outlet } from "react-router-dom";

export default function Home() {
  return (
    <div
      className="h-screen w-screen flex flex-col justify-start"
      // style={{ backgroundColor: "#475674" }}
    >
      {/* 导航栏 */}
      <nav
        className="w-full shrink-0 relative hidden md:flex
        md:h-12 2xl:h-14 "
      >
        <TopNav></TopNav>
      </nav>
      {/* 手机导航栏 */}
      <nav
        className="w-full shrink-0 relative flex md:hidden
        md:h-12 2xl:h-14 "
      >
        <PhoneNav></PhoneNav>
      </nav>
      {/* 页面 ,显示搜索框页面或者是搜索详情页面*/}
      <div
        className="w-full h-fit relative overflow-y-scroll overflow-x-hidden flex-grow 
      lg:overflow-y-hidden transition-all duration-500 "
      >
        <Outlet></Outlet>
      </div>
    </div>
  );
}
