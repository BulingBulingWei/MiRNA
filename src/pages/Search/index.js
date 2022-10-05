import React, { useState, useEffect, useRef, useContext } from "react";
import { ToastContext } from "../../App";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import bgimg from "../../img/img1.jpg";
import img1 from "../../img/cap.jpg";
import img2 from "../../img/img1.jpg";
import img3 from "../../img/img2.jpg";
import img4 from "../../img/img8.jpg";

export default function Search() {
  // type：0为疾病 ， 1为mirna
  const navigate = useNavigate();
  const toastController = useContext(ToastContext);
  const [type, setType] = useState(0);

  const searchInput = useRef(null);

  //点击搜索
  const handleSearch = () => {
    const fetchData = async () => {
      const options = {
        url: "",
        method: "GET",
        headers: {
          "content-type": "",
        },
        data: {},
      };
      const res = await axios(options);

      if (res.data.code === 200) {
        navigate(``);
      } else {
        toastController({
          mes: res.data.message,
          timeout: 1000,
        });
      }
    };
    fetchData();
  };

  const enterKeyUp = (e) => {
    if (e.keyCode === 13) {
      // handleSearch();
      navigate(`SearchDetail`);
    }
  };

  return (
    <div
      className="h-fit w-full transition-all duration-500"
      style={{
        backgroundImage: `url(${bgimg})`,
        backgroundRepeat: "no-repeat",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      {/* 背景蒙层 */}
      <div
        className="h-full w-full flex flex-col justify-between items-center flex-grow "
        style={{
          background: "rgba(39, 39, 39,0.55)",
        }}
      >
        {/* 上方 */}
        <div
          className="w-full h-36 flex flex-col shrink-0 justify-center items-center gap-3 
          sm:h-52
          md:flex-row md:h-52 lg:pb-16 lg:h-96 xl:gap-10 2xl:h-100"
        >
          {/* 搜索类型 */}
          <div
            className={`h-8 xl:h-10 w-40 flex justify-between items-center
         rounded-sm bg-yellow-200  cursor-pointer`}
          >
            {/* Disease */}
            <div
              className={`${
                type === 0 ? "w-9/12 bg-yellow-300" : "w-3/12 text-xs"
              } h-full flex justify-center items-center rounded-sm text-gray-600 text-center text-2xl`}
              onClick={(event) => {
                event.stopPropagation();
                setType(0);
              }}
            >
              {type === 0 ? "Disease" : "D"}
            </div>
            {/* 分割线 */}
            <div className="h-full w-0 border-l-2 border-gray-500"></div>
            {/* mirna */}
            <div
              className={`${
                type === 1 ? "w-9/12 bg-yellow-300 " : "w-3/12"
              } h-full flex justify-center items-center rounded-sm text-gray-600 text-center text-2xl`}
              onClick={(event) => {
                event.stopPropagation();
                setType(1);
              }}
            >
              {type === 1 ? "miRNA" : "M"}
            </div>
          </div>

          {/* 搜索框 */}
          <div
            className="w-11/12 h-9 flex justify-between items-center bg-white rounded-sm
             md:w-7/12 md:h-10 xl:h-12 xl:w-1/2 2xl:h-14"
          >
            <input
              className="h-full w-11/12 px-2 rounded-sm outline-none text-xl text-gray-600"
              placeholder="Search"
              ref={searchInput}
              onKeyUp={enterKeyUp}
            ></input>
            <div className="h-full w-1/12 flex justify-center items-center">
              <svg
                t="1657012954779"
                viewBox="0 0 1024 1024"
                version="1.1"
                xmlns="http://www.w3.org/2000/svg"
                p-id="1911"
                width="32"
                height="32"
              >
                <path
                  d="M947.942255 886.008182 720.970894 659.243529c48.977481-62.368466 78.178547-140.907217 
                  78.178547-226.249931 0-202.907293-165.033707-367.395578-368.613312-367.395578-203.580628 
                  0-368.616382 164.489308-368.616382 367.395578 0 202.90627 165.035754 367.395578 368.616382 
                  367.395578 85.758176 0 164.673503-29.192879 227.295749-78.146824l226.938616 226.728838c12.769838
                   12.727882 33.475416 12.727882 46.246277 0l16.925485-16.870226C960.713117 919.374104 960.713117
                    898.736065 947.942255 886.008182zM430.536129 711.482287c-154.315598 
                    0-279.414781-124.682697-279.414781-278.487665 0-153.805992 125.099183-278.488689 
                    279.414781-278.488689 154.315598 0 279.410688 124.68372 279.410688 278.488689C709.946816 
                    586.79959 584.851727 711.482287 430.536129 711.482287z"
                  p-id="1912"
                  fill="#8a8a8a"
                ></path>
              </svg>
            </div>
          </div>
        </div>

        {/* 下方热点推荐 */}
        <div
          className="w-full h-fit grid grid-cols-1 py-2 gap-2 px-2 
        sm:grid-cols-2 sm:pb-10 sm:pt-20 md:pb-10 md:gap-4
        lg:pb-20 xl:grid-cols-4 xl:gap-4 2xl:gap-10 2xl:pt-20 2xl:pb-24"
        >
          <div
            className="h-32 w-11/12 mx-auto rounded transiti on-all 
          transform hover:scale-105 duration-500 border-4 border-gray-300 
          sm:h-40 md:border-8 md:h-48 xl:h-52 2xl:h-72"
            style={{
              backgroundImage: `url(${img1})`,
              backgroundRepeat: "repeat-y",
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          ></div>

          <div
            className="h-32 w-11/12 mx-auto rounded transiti on-all 
          transform hover:scale-105 duration-500 border-4 border-gray-300 
          md:border-8 md:h-48 sm:h-40 xl:h-52 2xl:h-72"
            style={{
              backgroundImage: `url(${img2})`,
              backgroundRepeat: "no-repeat",
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          ></div>

          <div
            className="h-32 w-11/12 mx-auto rounded transiti on-all 
          transform hover:scale-105 duration-500 border-4 border-gray-300 
          md:border-8 md:h-48 sm:h-40 xl:h-52 2xl:h-72"
            style={{
              backgroundImage: `url(${img3})`,
              backgroundRepeat: "no-repeat",
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          ></div>

          <div
            className="h-32 w-11/12 mx-auto rounded transiti on-all 
          transform hover:scale-105 duration-500 border-4 border-gray-300 
          md:border-8 md:h-48 sm:h-40 xl:h-52 2xl:h-72"
            style={{
              backgroundImage: `url(${img4})`,
              backgroundRepeat: "no-repeat",
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          ></div>
        </div>
      </div>
    </div>
  );
}
