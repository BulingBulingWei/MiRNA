import React, { useState, useEffect, useRef, useContext } from "react";
import { ToastContext, GraphContext } from "../../App";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import styled from "styled-components";
import axios from "axios";
// import throttle from "../../optimize/index";
import { Svg1 } from "../../svg";
import * as echarts from "echarts/core";
import { TooltipComponent, LegendComponent } from "echarts/components";
import { GraphChart } from "echarts/charts";
import { LabelLayout } from "echarts/features";
import { CanvasRenderer } from "echarts/renderers";
import PageButton from "../../Component/PageButton";
import yearSelectOptions from "../../data/yearData";
import {
  GetDieaseSearch,
  GetMirnaSearch,
  GetDiseaseGraphData,
  GetMirnaGraphData,
  GetDiseaseFuzzySearchName,
  GetMirnaFuzzySearchName,
} from "../../utils/mapPath";

echarts.use([
  TooltipComponent,
  LegendComponent,
  GraphChart,
  CanvasRenderer,
  LabelLayout,
]);

const PaperBox = styled.div`
  height: fit-content;
  z-index: 10;
  width: 98%;
  margin-left: 0.1rem;
  flex-shrink: 0;
  background-color: ${(props) =>
    props.selected === "true"
      ? "rgba(229, 245, 251, 1)"
      : "rgba(255, 255, 255, 0.9)"};
  padding: 0.4rem 0.3rem;
  font-weight: 400;
  transition: all 0.4s;
  border-bottom-width: 0.1rem;
`;

const AbsBox = styled.div`
  position: relative;
  width: 100%;
  height: 3rem;
  overflow: hidden;
  color: rgb(75 85 99);
  &::after {
    content: " ...   ${(props) => props.time}";
    font-weight: 600;
    color: rgb(156 163 175);
    position: absolute;
    bottom: 0;
    right: 0;
    padding: 0 6px;
    background-color: #fff;
  }
`;

//props:
export default function SearchDetail(props) {
  const navigate = useNavigate();
  const params = useParams();
  const location = useLocation();

  const maxSize = 20;
  //一些useContext
  const toastController = useContext(ToastContext);
  const { showGraph } = useContext(GraphContext);

  //一些input的 dom标识
  const searchInput = useRef(null);
  const pageInput = useRef(null);
  const graphDom = useRef(null);
  const searchTypeSelect = useRef(null);
  const startTimeSelect = useRef(null);
  const endTimeSelect = useRef(null);

  //有关搜索参数（类型，时间，是否显示图）的state
  const [searchType, setSearchType] = useState(params.type);
  const [startYear, setStartYear] = useState("2000");
  const [endYear, setEndYear] = useState("2020");
  const [searchContext, setSearchContext] = useState(params.searchName);

  //有关页数的state
  const [page_now, setPage_now] = useState(1);
  const [page_end, setPage_end] = useState(1);

  //有关页面控制的state，如是否显示左右边的列表以及论文摘要
  const [showLeft, setShowLeft] = useState(true);
  const [showRight, setShowRight] = useState(true);
  const [paperSelectedId, setPaperSelectedId] = useState(undefined);

  //一些用到的数据
  const [paperList, setPaperList] = useState([]);
  const [fuzzySearchList, setFuzzySearchList] = useState([]);
  const [graphData, setGraphData] = useState({});

  const yearSelectOption = yearSelectOptions();
  // const StringDom = "";

  //请求函数---------------------

  useEffect(() => {
    let myChart;
    let graphOption = {
      tooltip: {},
      animationDuration: 1500,
      animationEasingUpdate: "quinticInOut",
      legend: [
        {
          data:
            graphData.categories !== undefined &&
            graphData.categories.map(function (a) {
              return a.name;
            }),
          z: 100,
          show: true,
          orient: "horizontal",
          left: "center",
          top: 10,
          width: 300,
          align: "auto",
          borderRadius: 5,
          backgroundColor: "rgba(217, 237, 247, 0.5)",
          borderColor: "#ccc",
          padding: 5,
          itemGap: 10,
          itemWidth: 20,
          itemHeight: 14,
          symbolRotate: "inherit",
          symbolKeepAspect: true,
          inactiveColor: "#ccc",
          inactiveBorderColor: "#ccc",
          inactiveBorderWidth: "auto",
        },
      ],
      series: [
        {
          name: "Les Miserables",
          type: "graph",
          layout: "force",
          data: graphData.nodes,
          links: graphData.links,
          categories: graphData.categories,
          //可以旋转也可以缩放
          roam: true,

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
            max: 10,
          },
          lineStyle: {
            color: "source",
            curveness: 0.2,
          },
          emphasis: {
            focus: "adjacency",
            lineStyle: {
              width: 10,
            },
          },
          force: {
            repulsion: 500,
            edgeLength: [30, 40],
            //可以旋转也可以缩放
            roam: true,
            layoutAnimation: true,
          },
        },
      ],
    };

    myChart = echarts.init(graphDom.current);
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
    myChart.setOption(graphOption, true);
    myChart.hideLoading();
    window.onresize = () => myChart.resize();
    window.addEventListener("resize", () => myChart.resize());
    return () => {
      console.log("xiao shi");
      myChart.dispose();
      graphOption = null;
    };
  }, [graphData, showGraph, location]);

  useEffect(() => {
    let name = params.searchName.replaceAll("+", " ");
    searchInput.current.value = name;

    //判断搜索类型
    if (params.type === "Disease") {
      searchTypeSelect.current.selectedIndex = 1;
      getDiseaseArticles({
        searchName: name,
        startTime: "2000",
        endTime: "2020",
        pageNum: 1,
      });
      GetDiseaseGraphDataFun(name);
    } else if (params.type === "mi-RNA") {
      searchTypeSelect.current.selectedIndex = 0;
      getMirnaArticles({
        searchName: name,
        startTime: "2000",
        endTime: "2020",
        pageNum: 1,
      });
      GetMirnaGraphDataFun(name);
    }
  }, [location]);

  //根据疾病获取论文
  const getDiseaseArticles = async ({
    searchName,
    startTime,
    endTime,
    pageNum,
  }) => {
    let options = {
      url: GetDieaseSearch,
      method: "GET",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      params: {
        diseaseName: searchName,
        startTime: startTime,
        pageNum: pageNum,
        pageSize: maxSize,
        endTime: endTime,
      },
    };
    let res = await axios(options);

    if (res.data.code === "0") {
      setSearchContext(searchName);
      setStartYear(startTime);
      setEndYear(endTime);
      if (res.data.data.count === 0) {
        setPaperList([]);
        setPage_end(1);
        setPage_now(1);
        toastController({
          mes: "没有查询到相关论文",
          timeout: 1000,
        });
      } else {
        //向上取整
        setPaperList(res.data.data.articles);
        let pe = Math.ceil(res.data.data.count / maxSize);
        setPage_end(parseInt(pe));
        setPage_now(parseInt(pageNum));
        setPaperSelectedId(res.data.data.articles[0].pmid);
      }
    }
    //请求不成功
    else {
      toastController({
        mes: res.data.message,
        timeout: 1000,
      });
    }
  };

  //根据mi-rna获取论文
  const getMirnaArticles = async ({
    searchName,
    startTime,
    endTime,
    pageNum,
  }) => {
    // console.log("props:");
    // console.log(pageNum);
    // console.log(searchName);
    // console.log(startTime);
    // console.log(endTime);
    let options = {
      url: GetMirnaSearch,
      method: "GET",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      params: {
        mirnaName: searchName,
        startTime: startTime,
        pageNum: pageNum,
        pageSize: maxSize,
        endTime: endTime,
      },
    };
    let res = await axios(options);

    if (res.data.code === "0") {
      // console.log(res.data.data.articles);
      setSearchContext(searchName);
      setStartYear(startTime);
      setEndYear(endTime);
      if (res.data.data.count === 0) {
        setPaperList([]);
        setPage_end(1);
        setPage_now(1);
        toastController({
          mes: "没有查询到相关论文",
          timeout: 1000,
        });
      } else {
        //向上取整
        setPaperList(res.data.data.articles);
        let pe = Math.ceil(res.data.data.count / maxSize);
        setPage_end(parseInt(pe));
        setPage_now(parseInt(pageNum));
        setPaperSelectedId(res.data.data.articles[0].pmid);
      }
    }
    //请求不成功
    else {
      toastController({
        mes: res.data.message,
        timeout: 1000,
      });
    }
  };
  //根据疾病获取关系图数据
  const GetDiseaseGraphDataFun = async (searchName) => {
    // let searchName = searchInput.current.value;
    let options = {
      url: GetDiseaseGraphData,
      method: "GET",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      params: {
        diseaseName: searchName, //"Lung Neoplasms",
      },
    };

    let res = await axios(options);

    if (res.data.code === "0") {
      setGraphData(res.data.data);
    } else {
      toastController({
        mes: res.data.message,
        timeout: 1000,
      });
    }
  };
  //根据mi-rna获取关系图数据
  const GetMirnaGraphDataFun = async (searchName) => {
    // let searchName = searchInput.current.value;
    let options = {
      url: GetMirnaGraphData,
      method: "GET",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      params: {
        mirnaName: searchName, //"hsa-mir-15a",
      },
    };

    let res = await axios(options);

    if (res.data.code === "0") {
      setGraphData(res.data.data);
    } else {
      toastController({
        mes: res.data.message,
        timeout: 1000,
      });
    }
  };

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
      setFuzzySearchList(res.data.data);
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
      setFuzzySearchList(res.data.data);
    } else {
      toastController({
        mes: res.data.message,
        timeout: 1000,
      });
    }
  };

  //事件函数

  //点击搜索
  //"Lung Neoplasms"
  //"hsa-mir-106",
  const handleSearch = () => {
    // console.log("search");
    setFuzzySearchList(undefined);
    let searchName = searchInput.current.value;
    let idx = searchTypeSelect.current.selectedIndex;
    let t =
      idx === undefined ? "" : searchTypeSelect.current.options[idx].value;

    let startTimeIdx = startTimeSelect.current.selectedIndex;
    let startTime =
      startTimeIdx === undefined
        ? "2000"
        : startTimeSelect.current.options[startTimeIdx].value;
    let endTimeIdx = endTimeSelect.current.selectedIndex;
    let endTime =
      endTimeIdx === undefined
        ? "2020"
        : endTimeSelect.current.options[endTimeIdx].value;
    if (searchName === undefined || searchName === "") {
      toastController({
        mes: "请输入搜索内容",
        timeout: 2000,
      });
      return;
    }
    if (startTime > endTime) {
      toastController({
        mes: "请选择正确年份",
        timeout: 2000,
      });
      return;
    }
    if (searchName === params.searchName && t === params.type) {
      if (params.type === "Disease") {
        getDiseaseArticles({
          searchName: searchContext,
          startTime: startTime,
          endTime: endTime,
          pageNum: page_now,
        });
      } else if (params.type === "mi-RNA") {
        getMirnaArticles({
          searchName: searchContext,
          startTime: startTime,
          endTime: endTime,
          pageNum: page_now,
        });
      }
      return;
    } else {
      searchName = searchName.trim();
      searchName.replaceAll(" ", "+");
      console.log(`SearchDetail/${t}/${searchName}`);
      navigate(`/SearchDetail/${t}/${searchName}`);
    }
  };

  const searchEnterKeyUp = (e) => {
    if (e.keyCode === 13) {
      handleSearch();
    }
  };

  const goToPage = (pageNum) => {
    if (typeof parseInt(pageNum) !== "number" || pageNum < 1) {
      toastController({
        mes: "请输入合法页数",
        timeout: 1500,
      });
      return;
    }
    if (pageNum > 0 && pageNum <= page_end) {
      setPage_now(parseInt(pageNum));
      if (searchType === "Disease") {
        getDiseaseArticles({
          searchName: searchContext,
          startTime: startYear,
          endTime: endYear,
          pageNum: pageNum,
        });
      } else if (searchType === "mi-RNA") {
        getMirnaArticles({
          searchName: searchContext,
          startTime: startYear,
          endTime: endYear,
          pageNum: pageNum,
        });
      }
    } else {
      toastController({
        mes: `error page`,
        timeout: 1000,
      });
    }
  };

  const pageEnterKeyUp = (e) => {
    if (e.keyCode === 13) {
      goToPage(pageInput.current.value);
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
    if (!searchName || searchName === "") return;
    let idx = searchTypeSelect.current.selectedIndex;
    let type =
      idx === undefined ? "" : searchTypeSelect.current.options[idx].value;
    if (type === "Disease") {
      GetDiseaseFuzzy(searchName);
    } else {
      GetMirnaFuzzy(searchName);
    }
  };

  const handleSearchInputChange = throttle(fuzzySearch, 1000);

  //--------------------------------------------------
  //页面效果函数

  // div可修改的最小高度
  const minHeight = 90;
  // 是否开启尺寸修改
  let reSizeable = false;
  let lastClientY;
  let dragBox, dragLine;

  function handleMouseDown(event) {
    // 禁止用户选择网页中文字
    document.onselectstart = () => false;
    // 禁止用户拖动元素
    document.ondragstart = () => false;

    dragBox = document.getElementById("dragBox");
    dragLine = document.getElementById("dragLine");
    document.addEventListener("touchmove", handleMouseMove);
    document.addEventListener("touchend", handleMouseUp);
    dragLine.style.backgroundColor = "#818a92";

    reSizeable = true;
    lastClientY = event.changedTouches[0].clientY;
  }

  function handleMouseMove(event) {
    if (reSizeable) {
      dragBox.style.height =
        Math.max(
          minHeight,
          dragBox.offsetHeight + (lastClientY - event.changedTouches[0].clientY)
        ) + "px";
      // offsetHeight 是鼠标所点击的位置与对应元素（dragBox）的垂直距离
      // lastClientY - event.clientY 计算出变动的垂直距离
      lastClientY = event.changedTouches[0].clientY;
    }
  }

  function handleMouseUp() {
    dragLine.style.backgroundColor = "#e5e7eb";
    reSizeable = false;
  }

  //---------------------------------------------------
  return (
    <div
      className={`h-fit w-full bg-blue-5 relative md:h-full ${
        showGraph === false ? "md:flex md:justify-center" : ""
      }`}
    >
      {/* (关系图)关系图+图例 */}
      <div
        id="graph"
        ref={graphDom}
        className={`h-96 w-full flex justify-center items-center bg-blue-50 shadow-inner
        md:h-full ${showGraph === true ? "" : "hidden"}`}
      ></div>

      {/* 相关论文选项列表 + 搜索框 + 时间/类型选择器*/}
      <div
        className={`h-fit w-full select-none 
        transition-all duration-1000 shadow-2xl  
        ${
          showGraph === false
            ? // 无图
              " md:mr-1 md:h-full md:w-3/12"
            : // 有图
            showLeft === true
            ? "md:w-60 lg:w-72 xl:w-80 2xl:w-96 md:absolute md:top-0 md:left-0 md:h-full md:min-h-0"
            : "md:w-0 md:absolute md:top-0 md:left-0 md:h-full md:min-h-0"
        }    
        `}
      >
        {/* 点击向左回缩按钮 */}
        <div
          className={`h-0 w-5 bg-gray-100 flex justify-center items-center
         md:h-12 md:absolute md:top-20 md:-right-5 md:rounded-r shadow-lg
         ${showGraph === true ? "" : "hidden"}`}
          onClick={() => {
            setShowLeft(!showLeft);
          }}
        >
          <Svg1
            className={`hidden transform duration-700 md:block ${
              showLeft === true ? "rotate-180" : ""
            }`}
          ></Svg1>
        </div>
        {/* 论文选择方块滚动面板 container */}
        <div
          id="selectContainer"
          className="h-full w-full bg-gray-50 flex flex-col justify-start items-center 
          md:overflow-y-scroll shadow-lg"
        >
          {/* 论文顶部的搜索框以及时间选择器 */}
          <div
            className="sticky top-0 z-50 py-1 h-fit w-full bg-blue-100 
           flex flex-col justify-center items-center"
          >
            {/* 搜索框 */}
            <div className="h-8 w-11/12 rounded flex justify-between items-center">
              <div className="h-full w-11/12 relative flex flex-col justify-start items-center rounded bg-green-100">
                <input
                  className="h-8 w-full px-2 rounded border-2 select-all border-solid border-blue-200 text-gray-700"
                  placeholder={searchContext}
                  ref={searchInput}
                  onBlur={() => {
                    setFuzzySearchList([]);
                  }}
                  onKeyUp={searchEnterKeyUp}
                  onChange={handleSearchInputChange}
                ></input>
                {/* 模糊搜索选项 */}

                {fuzzySearchList !== null &&
                  fuzzySearchList !== undefined &&
                  fuzzySearchList.length > 0 && (
                    <div
                      className="h-fit w-full max-h-96 absolute top-8 rounded border-2 
                border-blue-200 overflow-y-scroll bg-gray-50"
                    >
                      <ul
                        className="h-fit w-full flex-shrink-0 rounded border-2 border-blue-200
                text-gray-600 shadow p-0"
                      >
                        {fuzzySearchList.map((fuzzyItem) => {
                          return (
                            <li
                              className="h-fit w-full z-50 flex px-2 justify-start items-center hover:bg-gray-100
                   border-b-2 border-gray-300 cursor-pointer"
                              onClick={() => {
                                searchInput.current.value = fuzzyItem.name;
                                setFuzzySearchList(undefined);
                                setSearchContext(fuzzyItem.name);
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

              <div className="h-fit w-fit p-2" onClick={handleSearch}>
                <svg
                  t="1657012954779"
                  viewBox="0 0 1024 1024"
                  version="1.1"
                  xmlns="http://www.w3.org/2000/svg"
                  p-id="1911"
                  width="22"
                  height="22"
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

            {/* 时间以及类型选择器 */}
            <div className="min-h-0 h-9 w-full px-2 flex justify-around items-center">
              <select
                className="h-auto w-1/4"
                ref={searchTypeSelect}
                // onChange={(e) => {
                //   setSearchType(e.target.value);
                // }}
              >
                <option value="mi-RNA">mi-RNA</option>
                <option value="Disease">Disease</option>
              </select>
              {/* start-year */}
              <select
                className="h-auto w-1/4"
                ref={startTimeSelect}
                onChange={(e) => {
                  setStartYear(e.target.value);
                }}
              >
                {yearSelectOption !== undefined &&
                  yearSelectOption.map((item) => {
                    if (startYear === item)
                      return (
                        <option value={item} selected>
                          {item}
                        </option>
                      );
                    else return <option value={item}>{item}</option>;
                  })}
              </select>
              <span className="text-sm text-gray-700">至</span>
              {/* end-year */}
              <select
                className="h-auto w-1/4"
                ref={endTimeSelect}
                onChange={(e) => {
                  setEndYear(e.target.value);
                }}
              >
                {yearSelectOption !== undefined &&
                  yearSelectOption.map((item) => {
                    if (endYear === item)
                      return (
                        <option value={item} selected>
                          {item}
                        </option>
                      );
                    else return <option value={item}>{item}</option>;
                  })}
              </select>
            </div>
          </div>

          {/* 非sticky的选项列表 */}
          {paperList !== undefined &&
            paperList !== null &&
            paperList.map((item) => {
              return (
                <PaperBox
                  selected={`${
                    item.pmid === paperSelectedId ? "true" : "false"
                  }`}
                  onClick={() => {
                    setPaperSelectedId(item.pmid);
                  }}
                >
                  <p
                    className={`inline-block w-full text-gray-600
                   font-semibold truncate`}
                  >
                    <span dangerouslySetInnerHTML={{ __html: item.title }} />
                  </p>
                  {item.abs !== undefined && item.abs !== null && (
                    <AbsBox time={item.date}>
                      <span className="text-sky-700 font-bold">Abstract: </span>
                      <span dangerouslySetInnerHTML={{ __html: item.abs }} />
                    </AbsBox>
                  )}
                </PaperBox>
              );
            })}
          {/* 手机端的论文详情 */}
          {paperList !== undefined &&
            paperList !== null &&
            paperSelectedId !== undefined &&
            paperList.map((item) => {
              if (item.pmid === paperSelectedId) {
                return (
                  // 手机端论文详情
                  <div
                    id="dragBox"
                    // onTouchStart={handleMouseDown}
                    className={`h-64 w-full z-50 sticky bottom-12 md:hidden`}
                  >
                    {/* 论文内容上的拖动条 */}
                    <div
                      id="dragLine"
                      onTouchStart={handleMouseDown}
                      className="h-5 w-full p-0 flex justify-center items-center bg-gray-200"
                    >
                      <div className="h-1 w-12 rounded-full m-0 bg-gray-400 "></div>
                    </div>
                    {/* 手机端论文内容滚动面板 container */}
                    <div className="h-full w-full px-1 pb-3 cursor-default overflow-y-scroll text-justify text-sm bg-green-50">
                      <h1 className="text-lg font-bold block  mb-1">
                        {item.title}
                      </h1>
                      {/* {item.authors !== undefined &&
                        item.authors !== null &&
                        item.authors.map((aut) => {
                          return (
                            <p className="text-gray-600 inline pr-1">{aut}</p>
                          );
                        })} */}
                      <p className="text-gray-600 inline pr-1">
                        {item.authors}
                      </p>
                      <div className="h-2"></div>
                      <p className=" text-gray-600">{item.date}</p>
                      <div className="h-2"></div>
                      <div className="inline-block h-5 w-fit mr-2">
                        Open in:
                      </div>
                      {item.pmid !== undefined && (
                        <div className="h-7 w-7 mx-2 rounded-full text-white bg-gray-500 inline-block">
                          <a
                            href={`https://pubmed.ncbi.nlm.nih.gov/${item.pmid}`}
                          >
                            <div className=" h-fit w-fit text-xs leading-7 mx-auto">
                              pmid
                            </div>
                          </a>
                        </div>
                      )}
                      {item.doi !== undefined && (
                        <div className="h-7 w-7 mx-2 rounded-full text-white bg-gray-500 inline-block">
                          <a href={item.url}>
                            <div className=" h-fit w-fit leading-6 mx-auto">
                              doi
                            </div>
                          </a>
                        </div>
                      )}
                      <div className="h-1 w-full"></div>
                      <p className="text-sky-800 font-bold">Abstract:</p>
                      <p dangerouslySetInnerHTML={{ __html: item.abs }} />
                    </div>
                  </div>
                );
              }
              return <></>;
            })}

          {/* 底部的选择页面按钮 */}
          <div
            className="sticky z-40 bottom-0 w-full h-10 shrink-0 flex justify-center items-center
           bg-blue-100"
          >
            {page_now > 2 && (
              <PageButton
                content={1}
                onClick={() => {
                  console.log("click");
                  goToPage(1);
                }}
              ></PageButton>
            )}
            {page_now > 2 && " < < "}
            {page_now > 1 && (
              <PageButton
                content={page_now - 1}
                onClick={() => {
                  console.log("click");
                  goToPage(parseInt(page_now - 1));
                }}
              ></PageButton>
            )}
            {/* 当前页的按钮以及输入框 */}
            <div className="h-7 w-fit relative px-3 mx-2 rounded bg-gray-50 shadow-md ring-2 ring-blue-300">
              <p className="leading-7 text-center text-gray-600">{page_now}</p>
              <input
                type="number"
                ref={pageInput}
                onKeyUp={pageEnterKeyUp}
                placeholder={page_now}
                className="absolute top-0 left-0 h-7 w-10 rounded text-center outline-none
                opacity-0 focus:opacity-100 ring-2 ring-blue-300"
              />
            </div>
            {page_now < page_end && (
              <PageButton
                content={page_now + 1}
                onClick={() => {
                  goToPage(parseInt(page_now + 1));
                }}
              ></PageButton>
            )}
            {page_now < page_end - 1 && " > > "}
            {page_now < page_end - 1 && (
              <PageButton
                content={page_end}
                onClick={() => {
                  console.log("click");
                  goToPage(parseInt(page_end));
                }}
              ></PageButton>
            )}
          </div>
        </div>
      </div>

      {/* 论文题目和摘要（详情） */}
      {paperList !== undefined &&
        paperList !== null &&
        paperSelectedId !== undefined &&
        paperList.map((item) => {
          if (item.pmid === paperSelectedId) {
            return (
              // 论文详情
              <div
                className={`h-fit w-full hidden md:block
                transition-all duration-1000 
                ${
                  showGraph === false
                    ? // 无图
                      " md:h-full md:w-7/12 "
                    : showRight === true
                    ? // 有图且显示论文详情
                      "md:w-60 lg:w-80 xl:w-98 2xl:w-107 md:absolute md:top-0 md:right-0 md:h-full md:min-h-0"
                    : // 不显示右边的论文详情
                      "md:w-0 md:absolute md:top-0 md:right-0 md:h-full md:min-h-0"
                }
                `}
              >
                {/* 点击向右回缩按钮 */}
                <div
                  className={`h-0 w-5 bg-gray-100 flex justify-center items-center shadow-lg
                md:h-12 md:absolute md:top-40 md:-left-5 md:rounded-l ${
                  showGraph === true ? "" : "hidden"
                }`}
                  onClick={() => {
                    setShowRight(!showRight);
                  }}
                >
                  <Svg1
                    className={`hidden transform duration-700 md:block ${
                      showRight === true ? "" : "rotate-180"
                    }`}
                  ></Svg1>
                </div>
                {/* 论文内容滚动面板 container */}
                <div
                  className="h-full w-full bg-gray-50 pl-3 py-3 shadow-lg 
                    md:overflow-y-scroll"
                >
                  <h1 className="text-xl font-bold block text-sky-700 mb-2">
                    <span dangerouslySetInnerHTML={{ __html: item.title }} />
                  </h1>
                  {item.authors !== undefined &&
                    item.authors !== null &&
                    item.authors.map((aut) => {
                      return <p className="text-gray-600 inline pr-2">{aut}</p>;
                    })}
                  {/* <p className="text-gray-600 inline pr-2">{item.authors}</p>; */}
                  <p className="pt-1 text-gray-600">{item.date}</p>
                  <div className="h-4 w-full"></div>
                  <div className="inline-block font-bold h-6 w-fit mr-3">
                    Open in:
                  </div>
                  {item.pmid !== undefined && (
                    <div className="h-7 w-7 mx-2 rounded-full text-white bg-gray-500 inline-block">
                      <a href={`https://pubmed.ncbi.nlm.nih.gov/${item.pmid}`}>
                        <div className=" h-fit w-fit text-xs leading-7 mx-auto">
                          pmid
                        </div>
                      </a>
                    </div>
                  )}
                  {item.doi !== undefined && (
                    <div className="h-7 w-7 mx-2 rounded-full text-white bg-gray-500 inline-block">
                      <a href={item.url}>
                        <div className=" h-fit w-fit leading-6 mx-auto">
                          doi
                        </div>
                      </a>
                    </div>
                  )}
                  <div className="h-3"></div>
                  <p className="text-sky-700">
                    <span className="font-bold">pmid:</span>
                    {item.pmid}
                  </p>
                  <p className="text-sky-700">
                    <span className="font-bold">doi:</span>
                    {item.doi}
                  </p>
                  <p className="text-sky-700">
                    <span className="font-bold">Library:</span>
                    {item.library}
                  </p>
                  <div className="h-4 w-full"></div>
                  <p className="text-sky-800 font-bold">Abstract:</p>
                  <p>
                    <span className="px-4"> </span>

                    <p dangerouslySetInnerHTML={{ __html: item.abs }} />
                  </p>

                  <div className="h-4 w-full"></div>
                  <p className="text-sky-800 font-bold">Keywords:</p>
                  <p>
                    <span className="px-4"> </span>
                    {item.Keywords}
                  </p>
                </div>
              </div>
            );
          }
          return <></>;
        })}
    </div>
  );
}
