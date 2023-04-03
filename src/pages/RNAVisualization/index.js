import React, { useState, useEffect, useRef, useContext } from "react";
import { ToastContext } from "../../App";
import { useNavigate, useParams, useLocation, Outlet } from "react-router-dom";
import download from "downloadjs";
import axios from "axios";
import {
  GetGeneMirnaRelationship,
  GetMirnaFuzzySearchName,
  GetMirnaStruct,
} from "../../utils/mapPath";
import bgimg from "../../img/img13.jpg";
import { SearchSvg, DownloadSvg } from "../../svg";
import mirnaName from "../../data/mirnaName";
import * as echarts from "echarts/core";
import {
  TooltipComponent,
  LegendComponent,
  DataZoomComponent,
  GridComponent,
} from "echarts/components";
import { GraphChart } from "echarts/charts";
import { LabelLayout } from "echarts/features";
import { CanvasRenderer } from "echarts/renderers";
echarts.use([
  TooltipComponent,
  LegendComponent,
  GraphChart,
  CanvasRenderer,
  LabelLayout,
  DataZoomComponent,
  GridComponent,
]);

export default function RNAVisualization() {
  const navigate = useNavigate();
  const params = useParams();
  const location = useLocation();
  const searchInput = useRef(null);
  const scrollBox = useRef(null);
  const mirnaGeneGraphDom = useRef(null);

  const toastController = useContext(ToastContext);
  const [fuzzySearchList, setFuzzySearchList] = useState([]);
  const [mirnaSelectList, setMirnaSelectList] = useState(mirnaName());
  const [rnaSequenceData, setRnaSequenceData] = useState(null);
  const [mirnaGeneData, setMirnaGeneData] = useState(null);

  useEffect(() => {
    // setMirnaGeneData(null);
    GetMirnaStructAxios();
    GetGeneMirnaRelationshipAxios();
  }, [location]);

  useEffect(() => {
    if (mirnaGeneData === null) return;
    let myChart;
    let graphOption = {
      tooltip: {},
      animationDuration: 1000,
      animationEasingUpdate: "quinticInOut",
      legend: [
        {
          data:
            mirnaGeneData.categories !== undefined &&
            mirnaGeneData.categories.map(function (a) {
              return a.name;
            }),
          z: 100,
          show: true,
          orient: "vertical",
          left: "left",
          top: 10,
          width: 300,
          align: "auto",
          borderRadius: 5,
          backgroundColor: "rgba(217, 237, 247, 0.5)",
          borderColor: "#ccc",
          padding: 2,
          itemGap: 5,
          itemWidth: 16,
          itemHeight: 10,
          symbolRotate: "inherit",
          symbolKeepAspect: true,
          inactiveColor: "#ccc",
          inactiveBorderColor: "#ccc",
          inactiveBorderWidth: "auto",
        },
      ],

      series: [
        {
          name: "Relationship",
          type: "graph",
          layout: "force",
          large: true,
          zoom: 1,
          data: mirnaGeneData.geneNodes,
          edges: mirnaGeneData.links,
          categories: mirnaGeneData.categories,
          animationThreshold: 200,
          animationDuration: 1000,
          animationDurationUpdate: 300,
          //可以旋转也可以缩放
          roam: true,
          draggable: false,
          label: {
            show: true,
            position: "right",
            formatter: "{b}",
          },
          labelLayout: {
            hideOverlap: true,
          },
          scaleLimit: {
            min: 0.1,
            max: 4,
          },
          lineStyle: {
            color: "source",
            curveness: 0.1,
          },
          emphasis: {
            focus: "adjacency",
            lineStyle: {
              width: 10,
            },
          },
          force: {
            repulsion: 300,
            edgeLength: [20, 50],
            //可以旋转也可以缩放
            // roam: true,
            layoutAnimation: false,
          },
        },
      ],
    };
    myChart = echarts.init(mirnaGeneGraphDom.current);
    myChart.showLoading("default", {
      text: "loading",
      color: "#c23531",
      textColor: "#000",
      maskColor: "rgba(255, 255, 255, 0.8)",
      zlevel: 0,
      fontSize: 12,
      showSpinner: true,
      spinnerRadius: 10,
      lineWidth: 5,
      fontWeight: "normal",
      fontStyle: "normal",
      fontFamily: "sans-serif",
    });
    myChart.clear();
    myChart.setOption(graphOption, true);
    myChart.hideLoading();
    window.onresize = () => myChart.resize();
    window.addEventListener("resize", () => myChart.resize());
    return () => {
      myChart.dispose();
      myChart.clear();
      graphOption = null;
    };
  }, [mirnaGeneData, location]);

  // 请求
  //根据mi-rna获取mirna 和 gene 关系图数据
  const GetGeneMirnaRelationshipAxios = async () => {
    let options = {
      url: GetGeneMirnaRelationship,
      method: "GET",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      params: {
        mirnaName: params.mirnaName, //"hsa-mir-15a",
      },
    };

    let res = await axios(options);

    if (res.data.code === "0") {
      setMirnaGeneData(res.data.data);
    } else {
      toastController({
        mes: res.data.message,
        timeout: 1000,
      });
    }
  };

  const GetMirnaStructAxios = async () => {
    let options = {
      url: GetMirnaStruct,
      method: "GET",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      params: {
        mirnaName: params.mirnaName, //"hsa-mir-15a",
      },
    };

    let res = await axios(options);

    if (res.data.code === "0") {
      setRnaSequenceData(res.data.data);
    } else {
      setRnaSequenceData(null);
      toastController({
        mes: res.data.message,
        timeout: 3000,
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
      navigate(`/RNAVisualization/${searchInput.current.value}`);
    }
  };

  const paintSequence = (seq) => {
    let len = seq.length;
    let list = [];
    for (let i = 0; i < len; ++i) {
      if (seq[i] === " ") {
        list.push(
          <div className=" w-5 h-5 xl:w-5 xl:h-5 2xl:w-8 2xl:h-8 "></div>
        );
      } else {
        let color = "";
        if (seq[i] === "a" || seq[i] === "A")
          color = "bg-red-100 border-red-300";
        else if (seq[i] === "u" || seq[i] === "U")
          color = "bg-yellow-200 border-yellow-300";
        else if (seq[i] === "c" || seq[i] === "C")
          color = "bg-blue-100 border-blue-400";
        else if (seq[i] === "g" || seq[i] === "G")
          color = "bg-lime-200 border-lime-400";
        else color = "bg-orange-200 border-orange-400";

        if (seq[i] === "|") {
          list.push(
            <div className={`h-10 lg:h-12 xl:h-14 2xl:18 w-5 xl:w-5 2xl:w-8`}>
              <div className="h-full w-1 mx-auto bg-slate-600 rounded-full"></div>
            </div>
          );
        } else {
          list.push(
            <div
              className={` w-5 h-5 xl:w-5 xl:h-5 2xl:w-8 2xl:h-8 ${color} rounded-full 
              text-center border-2 flex justify-center items-center
             text-sm lg:text-base 2xl:text-xl font-bold  2xl:leading-7`}
            >
              {seq[i]}
            </div>
          );
        }
      }
    }
    return list;
  };

  return (
    <div
      className="h-full min-h-fit w-full flex flex-col justify-start items-center "
      style={{
        backgroundImage: `url(${bgimg})`,
        backgroundRepeat: "none",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      {/* （上方）基因序列可视化 */}
      <div
        className={`${
          rnaSequenceData !== null && rnaSequenceData !== undefined
            ? "h-1/2 min-h-fit md:h-1/3"
            : "h-0"
        } w-full flex justify-center items-center cursor-default 
          select-none bg-gray-50 
          border-b-4 border-red-100`}
      >
        {rnaSequenceData !== null && rnaSequenceData !== undefined && (
          <div
            className="h-full min-w-full w-fit px-2 py-6 md:px-10 bg-orange-50
              flex flex-col justify-center items-start overflow-x-scroll overflow-y-hidden"
            ref={scrollBox}
            onWheel={(event) => {
              scrollBox.current.scrollLeft += event.deltaY;
            }}
          >
            <div className="h-fit w-fit py-1 flex gap-1 justify-start items-center bg-blue-5">
              {paintSequence(rnaSequenceData.first)}
            </div>
            <div className="h-fit w-fit py-1 flex gap-1 justify-start items-center bg-blue-5">
              {paintSequence(rnaSequenceData.second)}
            </div>
            <div className="h-fit w-fit py-1 flex gap-1 justify-start items-center bg-blue-5">
              {paintSequence(rnaSequenceData.third)}
            </div>
            <div className="h-fit w-fit py-1 flex gap-1 justify-start items-center bg-blue-5">
              {paintSequence(rnaSequenceData.fourth)}
            </div>
            <div className="h-fit w-fit py-1 flex gap-1 justify-start items-center bg-blue-5">
              {paintSequence(rnaSequenceData.fifth)}
            </div>
          </div>
        )}
      </div>

      {/* （下方）的 mirna和基因可视化图和搜索框 */}
      <div className="md:h-3/5 flex-grow w-full flex flex-col md:flex-row justify-center items-center overflow-y-scroll ">
        {/* (下左方)搜索框以及选择列表 */}
        <div
          className="h-full w-full md:w-1/3 md:px-5 xl:px-10 2xl:px-20 overflow-y-scroll order-2 md:order-1
         border-r-4 border-red-700 bg-gray-50 bg-opacity-40 cursor-default"
        >
          {/* 头部input红色条 */}
          <div
            className="h-12 py-2 px-2 w-full sticky top-0 flex justify-start
           items-center bg-red-200"
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
                    className="h-fit w-full max-h-72 absolute top-8 rounded border-2 
                border-blue-200 overflow-y-scroll bg-gray-50"
                  >
                    <ul
                      className="h-fit w-full flex-shrink-0 rounded border-2 border-blue-200
                text-gray-600 shadow p-0"
                    >
                      {fuzzySearchList.map((fuzzyItem) => {
                        return (
                          <li
                            key={fuzzyItem.name}
                            className="h-fit w-full z-50 flex px-2 justify-start items-center hover:bg-gray-100
                   border-b-2 border-gray-300 cursor-pointer"
                            onClick={() => {
                              searchInput.current.value = fuzzyItem.name;
                              setFuzzySearchList(undefined);
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
            <div
              className="h-full flex-grow ml-2 flex justify-center items-center bg-gray-50 rounded"
              onClick={() => {
                if (searchInput.current.value === "") return;
                navigate(`/RNAVisualization/${searchInput.current.value}`);
              }}
            >
              <SearchSvg></SearchSvg>
            </div>
          </div>
          {mirnaSelectList !== null &&
            mirnaSelectList !== undefined &&
            mirnaSelectList.map((item) => {
              return (
                <div
                  key={item.id}
                  className="h-8 w-full px-5  bg-gray-50 bg-opacity-90 text-gray-700 hover:bg-gray-100"
                  onClick={() => {
                    if (item.name === params.mirnaName) return;
                    navigate(`/RNAVisualization/${item.name}`);
                  }}
                >
                  {item.name}
                </div>
              );
            })}
        </div>

        {/* （下右方） Mi-RNA和基因可视化图 */}
        <div
          className="h-full w-full md:w-2/3 order-1 md:order-2
         flex flex-col justify-center items-center bg-blue-50 bg-opacity-95"
        >
          {/* mirnaName */}
          <div className="h-fit w-full px-3 md:px-5 lg:px-6 py-1 md:py-2 font-bold text-gray-800">
            {params.mirnaName}
          </div>
          {/* mirna & gene graph */}
          <div
            className="min-h-fit w-full px-2 flex-grow flex justify-center items-center bg-gray-50"
            ref={mirnaGeneGraphDom}
          ></div>
        </div>
      </div>
    </div>
  );
}
