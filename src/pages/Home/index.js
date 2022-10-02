// import React from "react";
import Nav from "../../Component/TopNav";
import Search from "../Search";
import { useNavigate, Outlet, useLocation } from "react-router-dom";

export default function Home() {
  return (
    <div className="h-screen w-screen overflow-y-scroll overflow-x-hidden">
      {/* 导航栏 */}
      <div className="w-full h-10 z-10 sticky top-0 overflow-x-scroll md:h-12 2xl:h-14">
        <Nav></Nav>
      </div>
      {/* 页面 */}
      <div className="w-full h-fit ">
        <Outlet></Outlet>
      </div>
    </div>
  );
}
