import React, { useState, useEffect, useRef, useContext } from "react";
import { ToastContext, GraphContext } from "../../App";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import styled from "styled-components";
import axios from "axios";
import bgimg from "../../img/img2.jpg";
import { Svg1, LeftSvg, DownloadSvg, SearchSvg } from "../../svg";
import * as echarts from "echarts/core";
import download from "downloadjs";
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
  GetOneArticleDownload,
  PostArticleListDownload,
  GetRelationShipByDisease,
  GetRelationShipByMiRNA,
  GetCalculateByDisease,
  GetCalculateByMiRNA,
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
      : "rgba(255, 255, 255, 1)"};
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
export default function GraphSearchDetail() {
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
  const [phoneShowRight, setPhoneShowRight] = useState(false); //手机端是否显示论文详情
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
      animationDuration: 1000,
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
          orient: "vertical",
          left: "center",
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
          name: "Les Miserables",
          type: "graph",
          layout: "force",
          data: graphData.nodes,
          links: graphData.links,
          categories: graphData.categories,
          //可以旋转也可以缩放
          roam: true,
          draggable: true,
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
            curveness: 0.2,
          },
          emphasis: {
            focus: "adjacency",
            lineStyle: {
              width: 10,
            },
          },
          force: {
            repulsion: 130,
            edgeLength: [20, 50],
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

  const GetOneArticleDownloadAxios = async (pmid) => {
    let options = {
      url: GetOneArticleDownload + pmid,
      method: "GET",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      params: {
        pmid: pmid,
      },
      // 注意要确保传输的数据格式
      responseType: "blob",
    };

    let res = await axios(options);
    if (res.data.code !== "555") {
      let blobData = res.data;
      const blob = new Blob([blobData], {
        type: "application/pdf;charset=utf-8",
      });
      download(blob, `${pmid}.pdf`, "application/pdf;charset=utf-8");

      // const href = "http://172.16.103.216:9999" + GetOneArticleDownload + pmid;
      // const downloadOneArticleElement = document.createElement("a");
      // downloadOneArticleElement.href = href;
      // downloadOneArticleElement.target = "downloadFile";
      // downloadOneArticleElement.click();
      // document.body.removeChild(downloadOneArticleElement);
      // window.URL.revokeObjectURL(href);
    } else {
      toastController({
        mes: res.data.code,
        timeout: 1000,
      });
    }
  };

  const PostArticleListDownloadAxios = async () => {
    let options = {
      url: PostArticleListDownload,
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      data: paperList,
      // 注意要确保传输的数据格式
      responseType: "blob",
    };

    let res = await axios(options);
    if (res.data.code !== "555") {
      let blobData = res.data;
      const blob = new Blob([blobData], {
        type: "application/pdf;charset=utf-8",
      });
      download(blob, `${params.searchName}.xlsx`, "application/octet-stream");
    } else {
      toastController({
        mes: res.data.message,
        timeout: 1000,
      });
    }
  };

  const GetRelationShipByDiseaseAxios = async () => {
    let options = {
      url: GetRelationShipByDisease,
      method: "GET",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      params: {
        diseaseName: params.searchName,
      },
      // 注意要确保传输的数据格式
      responseType: "blob",
    };
    let res = await axios(options);

    if (res.data.code !== "555") {
      let blobData = res.data;
      const blob = new Blob([blobData], {
        type: "application/pdf;charset=utf-8",
      });
      download(
        blob,
        `${params.searchName}RelationShipData.xlsx`,
        "application/octet-stream"
      );
    } else {
      toastController({
        mes: res.data.message,
        timeout: 1000,
      });
    }
  };

  const GetRelationShipByMiRNAAxios = async () => {
    let options = {
      url: GetRelationShipByMiRNA,
      method: "GET",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      params: {
        mirnaName: params.searchName,
      },
      // 注意要确保传输的数据格式
      responseType: "blob",
    };
    let res = await axios(options);

    if (res.data.code !== "555") {
      let blobData = res.data;
      const blob = new Blob([blobData], {
        type: "application/pdf;charset=utf-8",
      });
      download(
        blob,
        `${params.searchName}RelationShipData.xlsx`,
        "application/octet-stream"
      );
    } else {
      toastController({
        mes: res.data.message,
        timeout: 1000,
      });
    }
  };

  const GetCalculateByDiseaseAxios = async () => {
    let options = {
      url: GetCalculateByDisease,
      method: "GET",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      params: {
        diseaseName: params.searchName,
      },
      // 注意要确保传输的数据格式
      responseType: "blob",
    };
    let res = await axios(options);

    if (res.data.code !== "555") {
      let blobData = res.data;
      const blob = new Blob([blobData], {
        type: "application/pdf;charset=utf-8",
      });
      download(
        blob,
        `${params.searchName}ForecastData.xlsx`,
        "application/octet-stream"
      );
    } else {
      toastController({
        mes: res.data.message,
        timeout: 1000,
      });
    }
  };

  const GetCalculateByMiRNAAxios = async () => {
    let options = {
      url: GetCalculateByMiRNA,
      method: "GET",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      params: {
        mirnaName: params.searchName,
      },
      // 注意要确保传输的数据格式
      responseType: "blob",
    };
    let res = await axios(options);

    if (res.data.code !== "555") {
      let blobData = res.data;
      const blob = new Blob([blobData], {
        type: "application/pdf;charset=utf-8",
      });
      download(
        blob,
        `${params.searchName}ForecastData.xlsx`,
        "application/octet-stream"
      );
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

  const handleDownloadOneArticle = (pmid) => {
    GetOneArticleDownloadAxios(pmid);
  };

  const handleDownloadRelationship = () => {
    if (params.type === "Disease") {
      GetRelationShipByDiseaseAxios();
    } else {
      GetRelationShipByMiRNAAxios();
    }
  };

  const handleDownloadCalculate = () => {
    if (params.type === "Disease") {
      GetCalculateByDiseaseAxios();
    } else {
      GetCalculateByMiRNAAxios();
    }
  };

  // 优化函数
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

  const handleSearchInputChange = throttle(fuzzySearch, 1000);

  //--------------------------------------------------
  //页面效果函数

  // div可修改的最小高度
  // const minHeight = 90;
  // 是否开启尺寸修改
  // let reSizeable = false;
  // let lastClientY;
  // let dragBox, dragLine;

  // function handleMouseDown(event) {
  //   // 禁止用户选择网页中文字
  //   document.onselectstart = () => false;
  //   // 禁止用户拖动元素
  //   document.ondragstart = () => false;

  //   dragBox = document.getElementById("dragBox");
  //   dragLine = document.getElementById("dragLine");
  //   document.addEventListener("touchmove", handleMouseMove);
  //   document.addEventListener("touchend", handleMouseUp);
  //   dragLine.style.backgroundColor = "#818a92";

  //   reSizeable = true;
  //   lastClientY = event.changedTouches[0].clientY;
  // }

  // function handleMouseMove(event) {
  //   if (reSizeable) {
  //     dragBox.style.height =
  //       Math.max(
  //         minHeight,
  //         dragBox.offsetHeight + (lastClientY - event.changedTouches[0].clientY)
  //       ) + "px";
  //     // offsetHeight 是鼠标所点击的位置与对应元素（dragBox）的垂直距离
  //     // lastClientY - event.clientY 计算出变动的垂直距离
  //     lastClientY = event.changedTouches[0].clientY;
  //   }
  // }

  // function handleMouseUp() {
  //   dragLine.style.backgroundColor = "#e5e7eb";
  //   reSizeable = false;
  // }

  //---------------------------------------------------
  return (
    <div
      className={`h-fit w-full bg-blue-5 relative md:h-full ${
        showGraph === false ? "md:flex md:justify-center" : ""
      }`}
      style={{
        backgroundImage: `url(${bgimg})`,
        backgroundRepeat: "repeat-y",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      {/* (中间关系图)关系图+图例 */}
      <div
        id="graph"
        ref={graphDom}
        className={`h-107 w-full flex justify-center items-center bg-blue-50 shadow-inner
        md:h-full ${showGraph === true ? "" : "hidden"}`}
      ></div>

      {/* (左边)相关论文选项列表 + 搜索框 + 时间/类型选择器*/}
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
          {/* 论文顶部的搜索框、时间选择器 、数据下载接口*/}
          <div
            className="sticky top-0 z-50 py-1 h-fit w-full bg-blue-100 
           flex flex-col justify-center items-center shadow"
          >
            {/* 搜索框 */}
            <div className="h-8 w-11/12 rounded flex justify-between items-center">
              <div className="h-full w-11/12 relative flex flex-col justify-start items-center rounded bg-green-100">
                <input
                  className="h-8 w-full px-2 rounded border-2 select-all border-solid border-blue-200 text-gray-700"
                  placeholder={searchContext}
                  ref={searchInput}
                  onBlur={() => {
                    setTimeout(() => {
                      setFuzzySearchList([]);
                    }, 500);
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
                <SearchSvg></SearchSvg>
              </div>
            </div>

            {/* 时间以及类型选择器 */}
            <div className="min-h-0 h-8 w-full px-2 flex justify-around items-center">
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

            {/* 实体已证实关系数据下载 */}
            <div className="h-6 w-11/12 px-1 flex justify-items-start items-center">
              <span className="text-sky-700 font-bold text-sm">
                RelationShip data:
              </span>
              <div
                className="h-6 w-8 inline-block mx-1 p-2"
                onClick={handleDownloadRelationship}
              >
                <DownloadSvg></DownloadSvg>
              </div>
            </div>

            {/* 实体预测关系数据下载 */}
            <div className="h-6 w-11/12 px-1 flex justify-items-start items-center">
              <span className="text-sky-700 font-bold text-sm">
                Forecast data:
              </span>
              <div
                className="h-6 w-8 inline-block mx-1 p-2"
                onClick={handleDownloadCalculate}
              >
                <DownloadSvg></DownloadSvg>
              </div>
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
                    setPhoneShowRight(true);
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

          {/* 底部的选择页面按钮 */}
          <div
            className="sticky z-40 bottom-0 w-full h-10 shrink-0 flex justify-center items-center
           bg-blue-100"
          >
            {page_now > 2 && (
              <PageButton
                content={1}
                onClick={() => {
                  goToPage(1);
                }}
              ></PageButton>
            )}
            {page_now > 2 && " < < "}
            {page_now > 1 && (
              <PageButton
                content={page_now - 1}
                onClick={() => {
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
                  goToPage(parseInt(page_end));
                }}
              ></PageButton>
            )}
          </div>
        </div>
      </div>

      {/* （右边）平板电脑版的论文题目和摘要（详情） */}
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
                      return (
                        <p className="text-gray-600 inline pr-2">
                          {aut}{" "}
                          <span className="font-bold text-red-600">|</span>
                        </p>
                      );
                    })}
                  {/* <p className="text-gray-600 inline pr-2">{item.authors}</p>; */}
                  <p className="pt-1 text-gray-600">{item.date}</p>
                  <div className="h-4 w-full"></div>
                  <div className="inline-block font-bold h-6 w-fit mr-3">
                    Open in:
                  </div>
                  {item.pmid !== undefined && (
                    <div className="h-7 w-7 mx-2 rounded-full text-white bg-gray-500 inline-block">
                      <div
                        className=" h-fit w-fit text-xs leading-7 mx-auto cursor-pointer"
                        onClick={() => {
                          window.open(
                            `https://pubmed.ncbi.nlm.nih.gov/${item.pmid}`,
                            "_blank"
                          );
                        }}
                      >
                        pmid
                      </div>
                    </div>
                  )}
                  {item.doi !== undefined && (
                    <div
                      className="h-7 w-7 mx-2 rounded-full text-white bg-gray-500 inline-block cursor-pointer"
                      onClick={() => {
                        window.open(`${item.url}`, "_blank");
                      }}
                    >
                      <div className=" h-fit w-fit leading-6 mx-auto">doi</div>
                    </div>
                  )}
                  <div className="h-3"></div>
                  <p className="text-sky-700">
                    <span className="font-bold">pmid: </span>
                    {item.pmid}
                  </p>
                  <p className="text-sky-700">
                    <span className="font-bold">doi: </span>
                    {item.doi}
                  </p>
                  <p className="text-sky-700">
                    <span className="font-bold">Library: </span>
                    {item.library}
                  </p>
                  {/* 下载一篇文章的pdf */}
                  <div className="h-fit w-full pt-2">
                    <span className="font-bold text-sky-700">
                      download this article:{" "}
                    </span>
                    <div
                      className="inline-block h-full w-fit "
                      onClick={() => {
                        handleDownloadOneArticle(item.pmid);
                      }}
                    >
                      <DownloadSvg></DownloadSvg>
                    </div>
                  </div>
                  {/* 下载几篇论文 excel */}
                  <div className="h-fit w-full pt-2">
                    <span className="font-bold text-red-600">
                      download ALL articles:{" "}
                    </span>
                    <div
                      className="inline-block h-full w-fit "
                      onClick={() => {
                        PostArticleListDownloadAxios();
                      }}
                    >
                      <DownloadSvg></DownloadSvg>
                    </div>
                  </div>
                  <div className="h-4 w-full"></div>
                  <p className="text-sky-800 font-bold">Abstract: </p>
                  <p>
                    <span className="px-4"> </span>

                    <p dangerouslySetInnerHTML={{ __html: item.abs }} />
                  </p>

                  <div className="h-4 w-full"></div>
                  {item.keywords !== null && (
                    <>
                      <p className="text-sky-800 font-bold">Keywords:</p>
                      <p>
                        <span className="px-4"> </span>
                        {item.keywords}
                      </p>
                    </>
                  )}
                </div>
              </div>
            );
          }
          return <></>;
        })}

      {/* （手机版右边）手机版的论文题目和摘要（详情） */}
      {paperList !== undefined &&
        paperList !== null &&
        paperSelectedId !== undefined &&
        paperList.map((item) => {
          if (item.pmid === paperSelectedId) {
            return (
              // 论文详情
              <div
                className={`h-full min-h-screen block z-50 md:hidden bg-gray-50
                transition-all duration-1000 fixed overflow-y-scroll top-0 right-0
                ${phoneShowRight === true ? "w-full" : "w-0 "}
                `}
              >
                {/* 返回按钮 */}
                <div
                  className={`fixed h-7 w-7 top-2 left-2 rounded-full flex justify-center items-center
                 bg-blue-200 bg-opacity-80 ${
                   phoneShowRight === false && "hidden"
                 }`}
                  onClick={() => {
                    setPhoneShowRight(false);
                  }}
                >
                  <LeftSvg></LeftSvg>
                </div>
                {/* 论文内容滚动面板 container */}
                <div className="h-full w-full bg-gray-50 pl-3 py-9 ">
                  <h1 className="text-lg font-bold block text-sky-700 mb-2">
                    <span dangerouslySetInnerHTML={{ __html: item.title }} />
                  </h1>
                  {item.authors !== undefined &&
                    item.authors !== null &&
                    item.authors.map((aut) => {
                      return (
                        <p className="text-gray-600 inline pr-2">
                          {aut}{" "}
                          <span className="font-bold text-red-600">|</span>
                        </p>
                      );
                    })}
                  {/* <p className="text-gray-600 inline pr-2">{item.authors}</p>; */}
                  <p className="pt-1 text-gray-600">{item.date}</p>
                  <div className="h-4 w-full"></div>
                  <div className="inline-block font-bold h-6 w-fit mr-3">
                    Open in:
                  </div>
                  {item.pmid !== undefined && (
                    <div className="h-7 w-7 mx-2 rounded-full text-white bg-gray-500 inline-block">
                      <div
                        className=" h-fit w-fit text-xs leading-7 mx-auto cursor-pointer"
                        onClick={() => {
                          window.open(
                            `https://pubmed.ncbi.nlm.nih.gov/${item.pmid}`,
                            "_blank"
                          );
                        }}
                      >
                        pmid
                      </div>
                    </div>
                  )}
                  {item.doi !== undefined && (
                    <div
                      className="h-7 w-7 mx-2 rounded-full text-white bg-gray-500 inline-block cursor-pointer"
                      onClick={() => {
                        window.open(`${item.url}`, "_blank");
                      }}
                    >
                      <div className=" h-fit w-fit leading-6 mx-auto">doi</div>
                    </div>
                  )}
                  <div className="h-3"></div>
                  <p className="text-sky-700">
                    <span className="font-bold">pmid: </span>
                    {item.pmid}
                  </p>
                  <p className="text-sky-700">
                    <span className="font-bold">doi: </span>
                    {item.doi}
                  </p>
                  <p className="text-sky-700">
                    <span className="font-bold">Library: </span>
                    {item.library}
                  </p>
                  {/* 下载一篇文章的pdf */}
                  <div className="h-fit w-full pt-2">
                    <span className="font-bold text-sky-700">
                      download this article:{" "}
                    </span>
                    <div
                      className="inline-block h-full w-fit "
                      onClick={() => {
                        handleDownloadOneArticle(item.pmid);
                      }}
                    >
                      <DownloadSvg></DownloadSvg>
                    </div>
                  </div>
                  {/* 下载几篇论文 excel */}
                  <div className="h-fit w-full pt-2">
                    <span className="font-bold text-red-600">
                      download ALL articles:{" "}
                    </span>
                    <div
                      className="inline-block h-full w-fit "
                      onClick={() => {
                        PostArticleListDownloadAxios();
                      }}
                    >
                      <DownloadSvg></DownloadSvg>
                    </div>
                  </div>
                  <div className="h-4 w-full"></div>
                  <p className="text-sky-800 font-bold">Abstract: </p>
                  <p>
                    <span className="px-4"> </span>

                    <p dangerouslySetInnerHTML={{ __html: item.abs }} />
                  </p>

                  <div className="h-4 w-full"></div>
                  {item.keywords !== null && (
                    <>
                      <p className="text-sky-800 font-bold">Keywords:</p>
                      <p>
                        <span className="px-4"> </span>
                        {item.keywords}
                      </p>
                    </>
                  )}
                </div>
              </div>
            );
          }
          return <></>;
        })}
    </div>
  );
}
