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
                Home page：
              </p>
              <p>
                <span className="px-4"></span>
                Firstly, select the type of keyword to search for (Disease or Mi
                RNA), enter the keyword, and click search (or press Enter) to
                search for the relevant Disease and Mi RNA. This will allow you
                to view the relevant relationship graphs and papers related to
                these relationships.
                <br />
                <br />
                <span className="px-4"></span>
                The four images below the page are recent hot searches. If you
                are interested, you can click to view them directly.
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
                Disease & Mi-RNA Relationship Details Page：
              </p>
              <p>
                <span className="px-4"></span>
                The left column contains options for verifying and searching for
                entity relationships in papers, while the right column contains
                detailed information about the selected paper.
                <br />
                <span className="px-4"></span>
                In the middle is a relationship graph centered on the search
                entity (including validated and predicted relationships).
                <br />
                <br />
                <span className="px-4"></span>
                You can adjust and hide a certain part of the page according to
                your preferences to achieve the desired visual effect.
                <br />
                <br />
                <span className="px-4"></span>
                You can also choose to download data according to your own
                needs.
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
                Search paper page:
              </p>
              <p>
                <span className="px-4"></span>
                Simply enter the keyword into the search box, press Enter or
                click on the search chart with the mouse to view papers related
                to that keyword.
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
                Search for paper details page:
              </p>
              <p>
                <span className="px-4"></span>
                On the left are the search options for the paper, and on the
                right are the corresponding paper information.
                <br />
                <br />
                <span className="px-4"></span>
                You can download data as needed.
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
                Mi RNA search page:
              </p>
              <p>
                <span className="px-4"></span>
                There are three ways to search for miRNA:
                <br /> 1. Enter the miRNA keyword to be queried in the search
                box, click search (or press Enter)
                <br />
                2. You can search directly by clicking on the left selection
                search bar
                <br />
                3. The image shows recent hot searches, which can be viewed
                directly by clicking on the image
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
                Display of miRNA sequences and their relationship with genes:
              </p>
              <p>
                <span className="px-4"></span>
                To search for miRNA related information:
                <br />
                First, enter the name of miRNA in the bottom left column,
                <br />
                Then click on search (or press Enter); Or scroll down and select
                miRNA and click search directly.
                <br />
                After searching, a miRNA sequence diagram will appear in the
                upper column and a miRNA gene relationship diagram will be
                displayed in the lower right column,
                <br />
                You can click on the tag to selectively display a certain type
                of gene.
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
              <p className="text-lg text-gray-700 font-bold pb-2">
                Regarding us:
              </p>
              <p>
                <span className="px-4"></span>
                If you have any suggestions or dissatisfaction with our system,
                please feel free to contact us at any time, You can leave your
                name, email, and comments on this page. Finally, click the
                submit button to leave us a message.
                <br />
                <br />
                <span className="px-4"></span>
                Below this page is a detailed introduction and updated
                information of our system.
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
                Data statistics page:
              </p>
              <p>
                <span className="px-4"></span>
                The page displays a display of monthly and weekly search data
                for miRNA & disease, For each bar chart: <br />
                1. Scalable view
                <br />
                2. Adjustable Y-axis to view specific data
                <br />
                3. Click on the first icon in the upper right corner of the
                chart to view the chart data
                <br />
                4. Click on the second icon in the upper right corner of the
                chart to update the plot
                <br />
                5. Click on the third icon in the upper right corner of the
                chart to download the image
              </p>
            </div>
          </div>
        </div>
      </div>
    </CSSTransition>
  );
}
