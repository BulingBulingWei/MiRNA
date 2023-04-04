import React, { useState, useEffect, useRef } from "react";
import help_About from "../../img/help_About.png";
import help_GraphSearchDetail from "../../img/help_GraphSearchDetail.png";
import help_Home from "../../img/help_Home.png";
import help_Paper from "../../img/help_Paper.png";
import help_mirnaSearch from "../../img/help_mirnaSearch.png";
import help_PaperSearchDetail from "../../img/help_PaperSearchDetail.png";
import help_mirnaGraph from "../../img/help_mirnaGraph.png";
import help_Trending from "../../img/help_Trending.png";

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
        className="h-full w-full transition-all duration-500 bg-blue-100"
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
            background: "rgba(100, 100, 100, 0.2)",
          }}
        >
          {/* help_Home */}
          <div
            className="h-fit w-full flex flex-col xl:flex-row justify-center items-center
          border-4 border-gray-300"
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
                <br />
                <br />
                <span className="px-4"></span>
                页面下方的四张图片是近期的热搜，如果您感兴趣的话可以直接点击查看。
              </p>
            </div>
          </div>

          {/* help_GraphSearchDetail */}
          <div
            className="h-fit w-full flex flex-col xl:flex-row justify-center items-center
          border-4 border-gray-300"
          >
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
                左边栏是验证与搜索实体关系的论文选项，右边则是选中的论文的详细信息。
                <br />
                中间是以搜索实体为中心的关系图（包括已验证和经预测的关系）。
                <br />
                <br />
                <span className="px-4"></span>
                您可以根据自己的喜好调节将页面中的某个部分隐藏，以达到自己想要的视觉效果。
                <br />
                <br />
                <span className="px-4"></span>
                您也可以根据自己的需要选择下载数据。
              </p>
            </div>
          </div>

          {/* help_Paper */}
          <div
            className="h-fit w-full flex flex-col xl:flex-row justify-center items-center
          border-4 border-gray-300"
          >
            <img
              src={`${help_Paper}`}
              alt="IMG"
              className="w-full xl:w-3/5 h-fit border-2 border-gray-300"
            />
            {/* 文字教程 */}
            <div className="w-full h-fit p-5 xl:2/5 xl:h-full bg-gray-50">
              <p className="text-lg text-gray-700 font-bold pb-2">
                搜索论文页面：
              </p>
              <p>
                <span className="px-4"></span>
                直接往搜索框里面输入关键词，按 Enter
                键或者鼠标点击搜索图表，就可以查看与该关键词相关的论文了。
              </p>
            </div>
          </div>
          {/* help_PaperSearchDetail */}
          <div
            className="h-fit w-full flex flex-col xl:flex-row justify-center items-center
          border-4 border-gray-300"
          >
            <img
              src={`${help_PaperSearchDetail}`}
              alt="IMG"
              className="w-full xl:w-3/5 h-fit border-2 border-gray-300"
            />
            {/* 文字教程 */}
            <div className="w-full h-fit p-5 xl:2/5 xl:h-full bg-gray-50">
              <p className="text-lg text-gray-700 font-bold pb-2">
                搜索论文详情页面：
              </p>
              <p>
                <span className="px-4"></span>
                左边是搜索出的论文选项，右边是相应的论文信息。
                <br />
                <br />
                <span className="px-4"></span>
                您可以根据需要下载数据。
              </p>
            </div>
          </div>
          {/* help_mirnaSearch */}
          <div
            className="h-fit w-full flex flex-col xl:flex-row justify-center items-center
          border-4 border-gray-300"
          >
            <img
              src={`${help_mirnaSearch}`}
              alt="IMG"
              className="w-full xl:w-3/5 h-fit border-2 border-gray-300"
            />
            {/* 文字教程 */}
            <div className="w-full h-fit p-5 xl:2/5 xl:h-full bg-gray-50">
              <p className="text-lg text-gray-700 font-bold pb-2">
                Mi-RNA搜索页面：
              </p>
              <p>
                <span className="px-4"></span>
                搜索Mi-RNA的三种途径：
                <br /> 1.在搜索框内输入要查询的Mi-RNA关键词，
                点击搜索（或按Enter）
                <br />
                2.可通过直接点击左边的选择搜索栏直接搜索
                <br />
                3.图片显示的是近期的热搜，可直接点击图片查看
              </p>
            </div>
          </div>
          {/* help_mirnaGraph */}
          <div
            className="h-fit w-full flex flex-col xl:flex-row justify-center items-center
          border-4 border-gray-300"
          >
            <img
              src={`${help_mirnaGraph}`}
              alt="IMG"
              className="w-full xl:w-3/5 h-fit border-2 border-gray-300"
            />
            {/* 文字教程 */}
            <div className="w-full h-fit p-5 xl:2/5 xl:h-full bg-gray-50">
              <p className="text-lg text-gray-700 font-bold pb-2">
                Mi-RNA序列以及与基因关系展示：
              </p>
              <p>
                <span className="px-4"></span>
                要搜索Mi-RNA的相关信息：
                <br />
                首先在左下栏输入Mi-RNA的名称，
                <br />
                然后点击搜索（或按Enter）；或下划选择Mi-RNA直接点击搜索。
                <br />
                搜索后，会在上方栏出现Mi-RNA序列图，右下栏显示Mi-RNA与基因关系图，
                <br />
                可以点击标签选择性显示某种种类的基因。
              </p>
            </div>
          </div>
          {/* help_About */}
          <div
            className="h-fit w-full flex flex-col xl:flex-row justify-center items-center
          border-4 border-gray-300"
          >
            <img
              src={`${help_About}`}
              alt="IMG"
              className="w-full xl:w-3/5 h-fit border-2 border-gray-300"
            />
            {/* 文字教程 */}
            <div className="w-full h-fit p-5 xl:2/5 xl:h-full bg-gray-50">
              <p className="text-lg text-gray-700 font-bold pb-2">关于我们：</p>
              <p>
                <span className="px-4"></span>
                如果您对我们的系统有任何的建议或者不满，欢迎您随时像我们联系，
                您可以在此页中留下您的姓名（Name），邮箱（Email），以及意见（Message），
                最后点击提交按钮给我们留言。
                <br />
                <br />
                <span className="px-4"></span>
                此页下面显示的是我们系统的详细介绍以及更新信息。
              </p>
            </div>
          </div>

          {/* help_Trending */}
          <div
            className="h-fit w-full flex flex-col xl:flex-row justify-center items-center
          border-4 border-gray-300"
          >
            <img
              src={`${help_Trending}`}
              alt="IMG"
              className="w-full xl:w-3/5 h-fit border-2 border-gray-300"
            />
            {/* 文字教程 */}
            <div className="w-full h-fit p-5 xl:2/5 xl:h-full bg-gray-50">
              <p className="text-lg text-gray-700 font-bold pb-2">
                数据统计页面：
              </p>
              <p>
                <span className="px-4"></span>
                页面显示Mi-RNA&Disease月度以及每周的搜索数据展示图，
                对于每张柱状图： <br />
                1.可缩放查看
                <br />
                2.可调节Y轴查看特定数据
                <br />
                3.点击图表右上角第一个图标查看图表数据
                <br />
                4.点击图表右上角第二个图标更新绘图
                <br />
                5.点击图表右上角第三个图标下载图片
              </p>
            </div>
          </div>
        </div>
      </div>
    </CSSTransition>
  );
}
