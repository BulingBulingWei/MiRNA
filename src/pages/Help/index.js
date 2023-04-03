import React, { useState, useEffect, useRef, useContext } from "react";
import bgimg from "../../img/img17.jpg";
import help_About from "../../img/help_About.png";
import help_GraphSearchDetail from "../../img/help_GraphSearchDetail.png";
import help_Home from "../../img/help_Home.png";
import help_Paper from "../../img/help_Paper.png";
import help_mirnaSearch from "../../img/help_mirnaSearch.png";
import help_topNav from "../../img/help_topNav.png";
import img8 from "../../img/img17.jpg";
import img9 from "../../img/img17.jpg";
import img10 from "../../img/img17.jpg";

import { CSSTransition } from "react-transition-group";

export default function Help() {
  const [showAntimation, setShowAntimation] = useState(false);
  const nodeRef = useRef(null);
  useEffect(() => {
    setShowAntimation(true);
  }, []);
  return (
    <CSSTransition
      in={showAntimation}
      timeout={300}
      nodeRef={nodeRef}
      classNames="page"
      unmountOnExit
    >
      <div
        ref={nodeRef}
        className="h-full w-full transition-all duration-500 bg-gray-50"
        style={{
          // backgroundImage: `url(${bgimg})`,
          backgroundRepeat: "none",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        {/*  */}
        <div
          className="h-full w-full flex flex-col py-5 px-3 md:py-10 md:px-12 xl:px-16 xl:py-14
           justify-start items-center overflow-y-scroll gap-5 md:gap-7 xl:gap-10"
          style={{
            background: "rgba(100, 100, 100, 0.05)",
          }}
        >
          <div
            className="h-fit w-full flex flex-col xl:flex-row justify-center items-center
          "
          >
            <img
              src={`${help_Home}`}
              alt="IMG"
              className="w-full xl:w-3/5 h-fit border-2 border-gray-300"
            />
            {/* 文字教程 */}
            <div className="w-full h-fit p-5 xl:2/5 xl:h-full bg-gray-50">
              <p className="text-lg text-gray-700 font-bold pb-2">
                Home 首页：
              </p>
              <p>
                <span className="px-4"></span>
                首先选择要搜索的关键词的类型（Disease or
                Mi-RNA），输入关键词后点击搜索（或按Enter） 搜索与之相关的
                Disease and Mi-RNA
                ，就可以查看相关的关系图以及与这些关系相关的论文。
              </p>
            </div>
          </div>

          <div className="h-fit w-full flex flex-col xl:flex-row justify-center items-center">
            <img
              src={`${help_GraphSearchDetail}`}
              alt="IMG"
              className="w-full xl:w-3/5 h-fit border-2 border-gray-300"
            />
            {/* 文字教程 */}
            <div className="w-full h-fit p-5 xl:2/5 xl:h-full bg-gray-50">
              <p className="text-lg text-gray-700 font-bold pb-2">
                Disease & Mi-RNA 关系详情页：
              </p>
              <p>
                <span className="px-4"></span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </CSSTransition>
  );
}
