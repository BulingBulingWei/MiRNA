import React from "react";
import TopNav from "../../Component/TopNav";
import { Outlet } from "react-router-dom";

export default function Home(props) {
  return (
    <div
      className="h-screen w-screen flex flex-col justify-start"
      // style={{ backgroundColor: "#475674" }}
    >
      {/* 导航栏 */}
      <nav className="w-full h-10 shrink-0 overflow-x-auto md:h-12 2xl:h-14 ">
        <TopNav setLocation={props.setLocation}></TopNav>
      </nav>
      {/* 页面 ,显示搜索框页面或者是搜索详情页面*/}
      <div
        className="w-full h-fit relative overflow-y-scroll overflow-x-hidden flex-grow 
      lg:overflow-y-hidden transition-all duration-500"
      >
        <Outlet></Outlet>
      </div>
    </div>
  );
}
