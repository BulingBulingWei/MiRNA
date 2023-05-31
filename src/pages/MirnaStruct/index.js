import React, { useState, useEffect, useRef, useContext } from "react";
import { ToastContext } from "../../App";
import styled from "styled-components";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import {
  GetMirnaLikeName as GetMirnaFuzzySearchName,
  GetMirnaAllMessage,
  axiosInstance as axios,
} from "../../utils/mapPath";
import {
  Label,
  InfoValue,
  InfoLabel,
  InfoListframe,
  InfoItem,
  Gframe,
  GItem,
  GLabel,
  CompareInfoLabel,
  CompareInfoValue,
  CompareInfoItem,
  CompareInfoframe,
} from "../../StyleComponents/MirnaStructPageCSS";

import { SearchSvg } from "../../svg";

export default function MirnaStruct() {
  const location = useLocation();
  const params = useParams();
  const searchInput = useRef(null);
  const navigate = useNavigate();
  const toastController = useContext(ToastContext);
  const [fuzzySearchList, setFuzzySearchList] = useState([]);
  const [MirnaAllMessage, setMirnaAllMessage] = useState(undefined);

  useEffect(() => {
    GetMirnaAllMessageAxios();
  }, [location]);

  const GetMirnaAllMessageAxios = async () => {
    let options = {
      url: GetMirnaAllMessage,
      method: "GET",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      params: {
        mirnaName: params.mirnaName,
      },
    };
    let res = await axios(options);
    if (res.data.code === "0") {
      setMirnaAllMessage(res.data.data);
    } else {
      toastController({
        mes: "请求失败",
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
        mirnaName: MirnaName,
      },
    };

    let res = await axios(options);
    if (res.data.code === "0") {
      console.log(res.data.data);
      setFuzzySearchList(res.data.data);
    } else {
      toastController({
        mes: res.data.message,
        timeout: 1000,
      });
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

  const handleSearchInputChange = throttle(GetMirnaFuzzy, 1000);

  const handleInputEnter = (event) => {
    if (searchInput.current.value === "") return;
    if (event.keyCode === 13) {
      navigate(`/MirnaStruct/${searchInput.current.value}`);
    }
  };

  return (
    <div className={`h-full w-full bg-gray-50 overflow-y-scroll`}>
      {/* 纵向flex布局 */}
      <div className="h-fit w-full flex flex-col items-center justify-center pb-8 ">
        {/* 标题（mirna名字）和搜索框 */}
        <div
          className="h-44 w-full flex flex-col md:flex-row justify-start items-center  "
          style={{
            backgroundColor: `#b5bfde`,
          }}
        >
          {/* 搜索框 */}
          <div className="h-1/2 w-full md:h-full md:w-1/2 pl-5 flex justify-center items-center">
            {/* 头部input */}
            <div
              className="h-14 py-2 px-2 w-2/3 flex justify-start
           items-center "
            >
              {/* 输入框和模糊搜索选项 */}
              <div className="h-full w-5/6 relative">
                <input
                  type="text"
                  placeholder={params.mirnaName}
                  className="h-full w-full rounded px-2"
                  ref={searchInput}
                  onChange={() => {
                    handleSearchInputChange(searchInput.current.value);
                  }}
                  onKeyUp={handleInputEnter}
                  onBlur={() => {
                    setTimeout(() => {
                      setFuzzySearchList(null);
                    }, 1500);
                  }}
                />
                {fuzzySearchList !== null &&
                  fuzzySearchList !== undefined &&
                  fuzzySearchList.length > 0 && (
                    <div
                      className="h-fit w-full max-h-72 absolute top-10 rounded border-2
                border-purple-300 overflow-y-scroll bg-gray-50"
                    >
                      <ul
                        className="h-fit w-full flex-shrink-0 rounded border-2 border-purple-300
                text-gray-600 shadow p-0"
                      >
                        {fuzzySearchList.map((fuzzyItem) => {
                          return (
                            <li
                              key={fuzzyItem}
                              className="h-fit w-full z-50 flex px-2 justify-start items-center hover:bg-gray-100
                               border-b-2 border-gray-300 cursor-pointer"
                              onClick={() => {
                                searchInput.current.value = fuzzyItem;
                                setFuzzySearchList(undefined);
                              }}
                            >
                              {fuzzyItem}
                            </li>
                          );
                        })}
                      </ul>
                    </div>
                  )}
              </div>
              <div
                className="h-full flex-grow ml-2 flex justify-center items-center bg-blue-800 rounded"
                onClick={() => {
                  if (searchInput.current.value === "") return;
                  navigate(`/MirnaStruct/${searchInput.current.value}`);
                }}
              >
                <SearchSvg></SearchSvg>
              </div>
            </div>
          </div>
          {/* title */}
          <div className="h-1/3 w-full md:h-full md:w-1/2 flex justify-center items-center md:justify-start ">
            <p className="text-3xl font-bold text-blue-800 ">
              {params.mirnaName}
            </p>
          </div>
        </div>

        {/* 详细信息和数据可视化图 */}
        {MirnaAllMessage !== null && MirnaAllMessage !== undefined && (
          <div className="w-full h-fit my-5 flex flex-col justify-start items-center">
            <div className="h-fit w-11/12 p-3  text-2xl font-bold text-blue-900">
              {params.mirnaName}的基本信息
            </div>
            <div
              className="h-fit w-11/12 flex flex-col md:flex-row justify-between items-start
             p-2 mx-16 border-2 border-gray-300"
            >
              <InfoListframe>
                {MirnaAllMessage.mainMirna !== null &&
                  MirnaAllMessage.mainMirna !== undefined &&
                  Object.keys(MirnaAllMessage.mainMirna).map((key, index) => {
                    if (
                      key === "url" ||
                      MirnaAllMessage.mainMirna[key] === null ||
                      MirnaAllMessage.mainMirna[key] === undefined
                    )
                      return <></>;
                    return (
                      <InfoItem key={index}>
                        <InfoLabel>{key}</InfoLabel>
                        <InfoValue>{MirnaAllMessage.mainMirna[key]}</InfoValue>
                      </InfoItem>
                    );
                  })}
              </InfoListframe>
              <Gframe>
                {MirnaAllMessage.structUrl_2D !== null && (
                  <GItem>
                    <GLabel>2D平面结构图</GLabel>
                    <div className="h-52 w-4/5 overflow-hidden">
                      <a
                        href={`${MirnaAllMessage.structUrl_2D}`}
                        title="点击查看图片详情"
                        target="_blank"
                        rel="noreferrer"
                      >
                        <img
                          src={`${MirnaAllMessage.structUrl_2D}`}
                          alt="2D"
                          className="w-110 rotate-90 object-cover object-right"
                        />
                      </a>
                    </div>
                  </GItem>
                )}

                {MirnaAllMessage.structUrl_3D !== null && (
                  <GItem>
                    <GLabel>Chord diagram</GLabel>
                    <div className="h-80 w-full flex justify-center items-center  overflow-hidden">
                      <a
                        href={`${MirnaAllMessage.structUrl_3D}`}
                        title="点击查看图片详情"
                        target="_blank"
                        rel="noreferrer"
                      >
                        <img
                          src={`${MirnaAllMessage.structUrl_3D}`}
                          alt="2D"
                          className="h-full w-full object-cover"
                        />
                      </a>
                    </div>
                  </GItem>
                )}
              </Gframe>
            </div>
          </div>
        )}

        {/* -3p  和 -5p 的对比 */}
        {MirnaAllMessage !== null &&
          MirnaAllMessage !== undefined &&
          MirnaAllMessage.mirna_3P !== null &&
          MirnaAllMessage.mirna_5P !== null && (
            <div className="w-full h-fit my-5 flex flex-col justify-start items-center">
              <div className="h-fit w-11/12 p-3 text-2xl font-bold text-blue-900">
                MiRNA的两支对比
              </div>
              <div className="h-fit w-11/12 flex justify-between items-start p-2 mx-16 border-2 border-gray-300">
                <CompareInfoframe>
                  <CompareInfoItem>
                    <CompareInfoLabel></CompareInfoLabel>
                    <CompareInfoValue>MiRNA-3p</CompareInfoValue>
                    <CompareInfoValue>MiRNA-5p</CompareInfoValue>
                  </CompareInfoItem>
                  {Object.keys(MirnaAllMessage.mirna_3P).map((key, index) => {
                    return (
                      <CompareInfoItem>
                        <CompareInfoLabel>{key}</CompareInfoLabel>
                        <CompareInfoValue>
                          {MirnaAllMessage.mirna_3P[key]}
                        </CompareInfoValue>
                        <CompareInfoValue>
                          {MirnaAllMessage.mirna_5P[key]}
                        </CompareInfoValue>
                      </CompareInfoItem>
                    );
                  })}
                </CompareInfoframe>
              </div>
            </div>
          )}
      </div>
    </div>
  );
}
