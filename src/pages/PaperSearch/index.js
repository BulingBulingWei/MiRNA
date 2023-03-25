import React, { useState, useEffect, useRef, useContext } from "react";
import { ToastContext } from "../../App";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import {
  GetDiseaseFuzzySearchName,
  GetMirnaFuzzySearchName,
} from "../../utils/mapPath";
import bgimg from "../../img/img2.jpg";

export default function PaperSearch() {
  // type：0为疾病 ， 1为mirna
  const navigate = useNavigate();
  const toastController = useContext(ToastContext);
  const [DiseaseFuzzyList, setDiseaseFuzzyList] = useState([]);
  const [MirnaFuzzyList, setMirnaFuzzyList] = useState([]);

  const searchInput = useRef(null);

  const GetDiseaseFuzzy = async (diseaseName) => {
    let options = {
      url: GetDiseaseFuzzySearchName,
      method: "GET",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      params: {
        diseaseName: diseaseName,
      },
    };

    let res = await axios(options);
    if (res.data.code === "0") {
      setDiseaseFuzzyList(res.data.data);
    } else {
      toastController({
        mes: res.data.message,
        timeout: 1000,
      });
    }
  };

  const GetMirnaFuzzy = async (MirnaName) => {
    let options = {
      url: GetMirnaFuzzySearchName,
      method: "GET",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      params: {
        MirnaName: MirnaName,
      },
    };

    let res = await axios(options);
    if (res.data.code === "0") {
      setMirnaFuzzyList(res.data.data);
    } else {
      toastController({
        mes: res.data.message,
        timeout: 1000,
      });
    }
  };

  //点击搜索
  const handleSearch = () => {
    setDiseaseFuzzyList([]);
    setMirnaFuzzyList([]);
    let searchName = searchInput.current.value;
    if (searchName === undefined || searchName === "") {
      toastController({
        mes: "请输入搜索内容",
        timeout: 2000,
      });
      return;
    }
    searchName.replaceAll(" ", "+");
    navigate(`/Paper/` + searchName + `/1`);
  };

  const enterKeyUp = (e) => {
    if (e.keyCode === 13) {
      handleSearch();
    }
  };

  function throttle(fn, timeout) {
    var can = true;
    return function (...args) {
      if (can === true) {
        can = false;
        setTimeout(() => {
          fn(...args);
          can = true;
        }, timeout);
      }
    };
  }

  const fuzzySearch = () => {
    let searchName = searchInput.current.value;
    GetDiseaseFuzzy(searchName);
    GetMirnaFuzzy(searchName);
  };

  const handleSearchInputChange = throttle(fuzzySearch, 1000);

  return (
    <div
      className="h-full w-full transition-all duration-500"
      style={{
        backgroundImage: `url(${bgimg})`,
        backgroundRepeat: "none",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      {/* 背景蒙层 */}
      <div
        className="h-full w-full flex flex-col justify-start items-center"
        style={{
          background: "rgba(39, 39, 39,0.35)",
        }}
      >
        {/* 上方 */}
        <div
          className="w-full h-44 flex shrink-0 justify-center items-center 
          sm:h-52 lg:h-64 xl:h-72 2xl:h-85 bg-gray-100 bg-opacity-40 "
        >
          {/* 搜索框 */}
          <div
            className="w-11/12 h-9 flex justify-between items-center bg-white rounded
             sm:w-7/12 md:h-10 xl:h-12 xl:w-1/2 s24:h-14"
          >
            <div
              className="h-fit w-11/12 relative flex-grow flex flex-col justify-start items-center
            overflow-y-scrolls rounded md:w-7/12 md:h-10 xl:h-12 xl:w-1/2 s24:h-14"
            >
              <input
                className="h-full w-full px-3 rounded outline-none text-xl text-gray-600"
                placeholder="Search"
                ref={searchInput}
                onBlur={() => {
                  setTimeout(() => {
                    setDiseaseFuzzyList([]);
                    setMirnaFuzzyList([]);
                  }, 100);
                }}
                onChange={handleSearchInputChange}
                onKeyUp={enterKeyUp}
              ></input>
              {/* 模糊搜索选项*/}
              {((MirnaFuzzyList !== null &&
                MirnaFuzzyList !== undefined &&
                MirnaFuzzyList.length > 0) ||
                (DiseaseFuzzyList !== null &&
                  DiseaseFuzzyList !== undefined &&
                  DiseaseFuzzyList.length > 0)) && (
                <div
                  className="h-fit w-full max-h-80 absolute top-9 rounded
                md:top-10 xl:top-12 s24:top-14 z-20 border-2 border-blue-200
                 overflow-y-scroll bg-gray-100 "
                >
                  <ul
                    className="h-fit w-full flex-shrink-0 rounded 
                text-gray-600 shadow p-0"
                  >
                    {DiseaseFuzzyList.map((fuzzyItem) => {
                      return (
                        <li
                          className="h-fit w-full z-50 flex px-2 justify-start items-center
                            hover:bg-gray-200 border-b-2 border-gray-300 cursor-pointer"
                          onClick={() => {
                            searchInput.current.value = fuzzyItem.name;
                            setDiseaseFuzzyList(undefined);
                            handleSearch();
                          }}
                        >
                          {fuzzyItem.name}
                        </li>
                      );
                    })}
                    {MirnaFuzzyList.map((fuzzyItem) => {
                      return (
                        <li
                          className="h-fit w-full z-50 flex px-2 justify-start items-center
                            hover:bg-gray-200 border-b-2 border-gray-300 cursor-pointer"
                          onClick={() => {
                            searchInput.current.value = fuzzyItem.name;
                            setMirnaFuzzyList(undefined);
                            handleSearch();
                          }}
                        >
                          {fuzzyItem.name}
                        </li>
                      );
                    })}
                  </ul>
                </div>
              )}
            </div>
            {/* 搜索按钮 */}
            <div
              className="h-full w-1/12 rounded flex justify-center items-center bg-blue-50"
              onClick={handleSearch}
            >
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
        {/* 下方 */}
        <div
          className="min-h-fit flex-grow w-full py-8 px-5 flex flex-col justify-start items-center
         font-bold text-white tracking-widest"
        >
          <p className="font-bold align-bottom">
            <span className="text-2xl pr-2 md:text-4xl md:pr-4 xl:text-5xl xl:pr-8">
              一切
            </span>
            <span className="text-4xl md:text-6xl xl:text-8xl ">如你所</span>
            <span className="italic text-4xl md:text-6xl xl:text-8xl ">
              {" "}
              搜____
            </span>
          </p>
          <p className="align-top leading-1 text-purple-300 pr-16 md:pr-60 xl:pr-80 text-4xl md:text-6xl xl:text-8xl">
            The theses
          </p>
          <p className=" text-white text-4xl xl:ml-10 md:text-6xl xl:text-7xl">
            are{" "}
            <span className=" text-red-200 italic text-4xl md:text-6xl xl:text-7xl ">
              AS
            </span>{" "}
            You
          </p>
          <p className="italic text-white text-5xl md:text-7xl xl:text-9x ml-24 md:ml-60 xl:ml-96">
            Search
          </p>
        </div>
      </div>
    </div>
  );
}
