import React, { useState, useEffect, useRef, useContext } from "react";
import { ToastContext, GraphContext } from "../../App";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import axios from "axios";
import { Svg1 } from "../../svg";
import * as echarts from "echarts/core";
import { TooltipComponent, LegendComponent } from "echarts/components";
import { GraphChart } from "echarts/charts";
import { LabelLayout } from "echarts/features";
import { CanvasRenderer } from "echarts/renderers";
import PageButton from "../../Component/PageButton";
import gData from "../../data/graphData";

echarts.use([
  TooltipComponent,
  LegendComponent,
  GraphChart,
  CanvasRenderer,
  LabelLayout,
]);

const PaperBox = styled.div`
  height: fit-content;
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

export default function SearchDetail() {
  // type：0为疾病 ， 1为mirna
  const navigate = useNavigate();
  //一些useContext
  const toastController = useContext(ToastContext);
  const { showGraph, setShowGraph } = useContext(GraphContext);

  //一些input的 dom标识
  const searchInput = useRef(null);
  const pageInput = useRef(null);

  //有关搜索参数（类型，时间，是否显示图）的state
  const [searchType, setSearchType] = useState("mi-RNA");
  const [graph, setGraph] = useState("");
  const [startYear, setStartYear] = useState("1900");
  const [endYear, setEndYear] = useState("2023");

  //有关页数的state
  const [page_now, setPage_now] = useState(3);
  const [page_end, setPage_end] = useState(25);

  //有关页面控制的state，如是否显示左右边的列表以及论文摘要
  const [showLeft, setShowLeft] = useState(true);
  const [showRight, setShowRight] = useState(true);
  const [paperSelectedId, setPaperSelectedId] = useState(3);

  //一些用到的数据
  const [paperList, setPaperList] = useState([
    {
      id: 1,
      doi: ["10.1038/420732a [doi]", "420732a [pii]"],
      pmcid: "12490907",
      title: "Small RNAs: the genome's guiding hand?",
      abstract: null,
      author: ["Dennis Carina"],
      time: "2002 Dec 19-26",
    },
    {
      id: 2,
      doi: [
        "S0168-9525(02)00005-7 [pii]",
        "10.1016/s0168-9525(02)00005-7 [doi]",
      ],
      pmcid: "12493242",
      title: "Mammalian RNAi for the masses.",
      abstract:
        "Just a couple of years ago only biologists working with plants or Caenorhabditis elegans could use RNA-mediated interference (RNAi) technology to gain insight into gene function. However the recent groundbreaking discovery that in vitro synthesized 21- to 23-nucleotide double-stranded RNAs can act as small interfering RNAs (siRNAs) to elicit gene-specific inhibition in mammalian cells has made RNAi possible in mammalian systems too. Reported only a year ago mammalian RNAi is already changing our way of studying gene function in higher eukaryotes. And a recent exciting advance allows delivery of siRNAs into mammalian cells by a DNA vector. In addition to providing a low-cost alternative to the chemically synthesized siRNAs this DNA-vector-based strategy is capable of mediating stable target gene inhibition thus allowing gene function analysis over an extended period of time.",
      author: ["Shi Yang"],
      time: "2003 Jan",
    },
    {
      id: 3,
      doi: [
        "S0168-9525(02)00011-2 [pii]",
        "10.1016/s0168-9525(02)00011-2 [doi]",
      ],
      pmcid: "12493243",
      title: "Macro effects of microRNAs in plants.",
      abstract:
        "MicroRNAs (miRNAs) are 20- to 22-nucleotide fragments that regulate expression of mRNAs that have complementary sequences. They are numerous and widespread among eukaryotes being conserved throughout evolution. The few miRNAs that have been fully characterized were found in Caenorhabditis elegans and are required for development. Recently a study of miRNAs isolated from Arabidopsis showed that here also developmental genes are putative regulatory targets. A role for miRNAs have in plant development is supported by the developmental phenotypes of mutations in the genes required for miRNA processing.",
      author: ["Kidner Catherine A", "Martienssen Robert A"],
      time: "2003 Jan",
    },
    {
      id: 4,
      doi: [
        "S0168-9525(02)00005-7 [pii]",
        "10.1016/s0168-9525(02)00005-7 [doi]",
      ],
      pmcid: "12493242",
      title: "Mammalian RNAi for the masses.",
      abstract:
        "Just a couple of years ago only biologists working with plants or Caenorhabditis elegans could use RNA-mediated interference (RNAi) technology to gain insight into gene function. However the recent groundbreaking discovery that in vitro synthesized 21- to 23-nucleotide double-stranded RNAs can act as small interfering RNAs (siRNAs) to elicit gene-specific inhibition in mammalian cells has made RNAi possible in mammalian systems too. Reported only a year ago mammalian RNAi is already changing our way of studying gene function in higher eukaryotes. And a recent exciting advance allows delivery of siRNAs into mammalian cells by a DNA vector. In addition to providing a low-cost alternative to the chemically synthesized siRNAs this DNA-vector-based strategy is capable of mediating stable target gene inhibition thus allowing gene function analysis over an extended period of time.",
      author: ["Shi Yang"],
      time: "2003 Jan",
    },
    {
      id: 5,
      doi: [
        "S0168-9525(02)00011-2 [pii]",
        "10.1016/s0168-9525(02)00011-2 [doi]",
      ],
      pmcid: "12493243",
      title: "Macro effects of microRNAs in plants.",
      abstract:
        "MicroRNAs (miRNAs) are 20- to 22-nucleotide fragments that regulate expression of mRNAs that have complementary sequences. They are numerous and widespread among eukaryotes being conserved throughout evolution. The few miRNAs that have been fully characterized were found in Caenorhabditis elegans and are required for development. Recently a study of miRNAs isolated from Arabidopsis showed that here also developmental genes are putative regulatory targets. A role for miRNAs have in plant development is supported by the developmental phenotypes of mutations in the genes required for miRNA processing.",
      author: ["Kidner Catherine A", "Martienssen Robert A"],
      time: "2003 Jan",
    },
    {
      id: 6,
      doi: [
        "S0168-9525(02)00005-7 [pii]",
        "10.1016/s0168-9525(02)00005-7 [doi]",
      ],
      pmcid: "12493242",
      title: "Mammalian RNAi for the masses.",
      abstract:
        "Just a couple of years ago only biologists working with plants or Caenorhabditis elegans could use RNA-mediated interference (RNAi) technology to gain insight into gene function. However the recent groundbreaking discovery that in vitro synthesized 21- to 23-nucleotide double-stranded RNAs can act as small interfering RNAs (siRNAs) to elicit gene-specific inhibition in mammalian cells has made RNAi possible in mammalian systems too. Reported only a year ago mammalian RNAi is already changing our way of studying gene function in higher eukaryotes. And a recent exciting advance allows delivery of siRNAs into mammalian cells by a DNA vector. In addition to providing a low-cost alternative to the chemically synthesized siRNAs this DNA-vector-based strategy is capable of mediating stable target gene inhibition thus allowing gene function analysis over an extended period of time.",
      author: ["Shi Yang"],
      time: "2003 Jan",
    },
    {
      id: 7,
      doi: [
        "S0168-9525(02)00011-2 [pii]",
        "10.1016/s0168-9525(02)00011-2 [doi]",
      ],
      pmcid: "12493243",
      title: "Macro effects of microRNAs in plants.",
      abstract:
        "MicroRNAs (miRNAs) are 20- to 22-nucleotide fragments that regulate expression of mRNAs that have complementary sequences. They are numerous and widespread among eukaryotes being conserved throughout evolution. The few miRNAs that have been fully characterized were found in Caenorhabditis elegans and are required for development. Recently a study of miRNAs isolated from Arabidopsis showed that here also developmental genes are putative regulatory targets. A role for miRNAs have in plant development is supported by the developmental phenotypes of mutations in the genes required for miRNA processing.",
      author: ["Kidner Catherine A", "Martienssen Robert A"],
      time: "2003 Jan",
    },
    {
      id: 8,
      doi: [
        "S0168-9525(02)00005-7 [pii]",
        "10.1016/s0168-9525(02)00005-7 [doi]",
      ],
      pmcid: "12493242",
      title: "Mammalian RNAi for the masses.",
      abstract:
        "Just a couple of years ago only biologists working with plants or Caenorhabditis elegans could use RNA-mediated interference (RNAi) technology to gain insight into gene function. However the recent groundbreaking discovery that in vitro synthesized 21- to 23-nucleotide double-stranded RNAs can act as small interfering RNAs (siRNAs) to elicit gene-specific inhibition in mammalian cells has made RNAi possible in mammalian systems too. Reported only a year ago mammalian RNAi is already changing our way of studying gene function in higher eukaryotes. And a recent exciting advance allows delivery of siRNAs into mammalian cells by a DNA vector. In addition to providing a low-cost alternative to the chemically synthesized siRNAs this DNA-vector-based strategy is capable of mediating stable target gene inhibition thus allowing gene function analysis over an extended period of time.",
      author: ["Shi Yang"],
      time: "2003 Jan",
    },
    {
      id: 9,
      doi: [
        "S0168-9525(02)00011-2 [pii]",
        "10.1016/s0168-9525(02)00011-2 [doi]",
      ],
      pmcid: "12493243",
      title: "Macro effects of microRNAs in plants.",
      abstract:
        "MicroRNAs (miRNAs) are 20- to 22-nucleotide fragments that regulate expression of mRNAs that have complementary sequences. They are numerous and widespread among eukaryotes being conserved throughout evolution. The few miRNAs that have been fully characterized were found in Caenorhabditis elegans and are required for development. Recently a study of miRNAs isolated from Arabidopsis showed that here also developmental genes are putative regulatory targets. A role for miRNAs have in plant development is supported by the developmental phenotypes of mutations in the genes required for miRNA processing.",
      author: ["Kidner Catherine A", "Martienssen Robert A"],
      time: "2003 Jan",
    },
    {
      id: 10,
      doi: [
        "S0168-9525(02)00005-7 [pii]",
        "10.1016/s0168-9525(02)00005-7 [doi]",
      ],
      pmcid: "12493242",
      title: "Mammalian RNAi for the masses.",
      abstract:
        "Just a couple of years ago only biologists working with plants or Caenorhabditis elegans could use RNA-mediated interference (RNAi) technology to gain insight into gene function. However the recent groundbreaking discovery that in vitro synthesized 21- to 23-nucleotide double-stranded RNAs can act as small interfering RNAs (siRNAs) to elicit gene-specific inhibition in mammalian cells has made RNAi possible in mammalian systems too. Reported only a year ago mammalian RNAi is already changing our way of studying gene function in higher eukaryotes. And a recent exciting advance allows delivery of siRNAs into mammalian cells by a DNA vector. In addition to providing a low-cost alternative to the chemically synthesized siRNAs this DNA-vector-based strategy is capable of mediating stable target gene inhibition thus allowing gene function analysis over an extended period of time.",
      author: ["Shi Yang"],
      time: "2003 Jan",
    },
  ]);

  const [graphData, setGraphData] = useState(gData);

  const graphOption = {
    tooltip: {},
    animationDuration: 1500,
    animationEasingUpdate: "quinticInOut",
    series: [
      {
        name: "Les Miserables",
        type: "graph",
        layout: "none",
        data: graphData.nodes,
        links: graphData.links,
        categories: graphData.categories,
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
          min: 0.4,
          max: 2,
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
          repulsion: 700,
          edgeLength: [30, 40],
          layoutAnimation: false,
        },
      },
    ],
  };

  const yearSelectOption = [
    "1900",
    "1901",
    "1902",
    "1903",
    "1904",
    "1905",
    "1906",
    "1907",
    "1908",
    "1909",
    "1910",
    "1911",
    "1912",
    "1913",
    "1914",
    "1915",
    "1916",
    "1917",
    "1918",
    "1919",
    "1920",
    "1921",
    "1922",
    "1923",
    "1924",
    "1925",
    "1926",
    "1927",
    "1928",
    "1929",
    "1930",
    "1931",
    "1932",
    "1933",
    "1934",
    "1935",
    "1936",
    "1937",
    "1938",
    "1939",
    "1940",
    "1941",
    "1942",
    "1943",
    "1944",
    "1945",
    "1946",
    "1947",
    "1948",
    "1949",
    "1950",
    "1951",
    "1952",
    "1953",
    "1954",
    "1955",
    "1956",
    "1957",
    "1958",
    "1959",
    "1960",
    "1961",
    "1962",
    "1963",
    "1964",
    "1965",
    "1966",
    "1967",
    "1968",
    "1969",
    "1970",
    "1971",
    "1972",
    "1973",
    "1974",
    "1975",
    "1976",
    "1977",
    "1978",
    "1979",
    "1980",
    "1981",
    "1982",
    "1983",
    "1984",
    "1985",
    "1986",
    "1987",
    "1988",
    "1989",
    "1990",
    "1991",
    "1992",
    "1993",
    "1994",
    "1995",
    "1996",
    "1997",
    "1998",
    "1999",
    "2000",
    "2001",
    "2002",
    "2003",
    "2004",
    "2005",
    "2006",
    "2007",
    "2008",
    "2009",
    "2010",
    "2011",
    "2012",
    "2013",
    "2014",
    "2015",
    "2016",
    "2017",
    "2018",
    "2019",
    "2020",
    "2021",
    "2022",
    "2023",
  ];

  useEffect(() => {
    var node = document.getElementById("graph");
    setGraph(node);
  }, [graph]);

  if (graph !== "") {
    var myChart = echarts.init(document.getElementById("graph"));
    myChart.setOption(graphOption);
  }

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
        navigate(`SearchDetail`);
      } else {
        toastController({
          mes: res.data.message,
          timeout: 1000,
        });
      }
    };
    navigate(`SearchDetail`);
    // fetchData();
  };

  const enterKeyUp = (e) => {
    if (e.keyCode === 13) {
      // handleSearch();
    }
  };

  const gotopage = (e) => {
    let tmp = parseInt(e.target.value);
    if (tmp > 0 && tmp <= page_end) {
      toastController({
        mes: `go to page ${e.target.value}`,
        timeout: 1000,
      });
      setPage_now(tmp);
    } else {
      toastController({
        mes: `error page`,
        timeout: 1000,
      });
    }
  };

  // div可修改的最小高度
  const minHeight = 90;
  // 是否开启尺寸修改
  let reSizeable = false;
  let lastClientY;
  let dragBox = document.getElementById("dragBox");
  document.addEventListener("mousemove", handleMouseMove);
  document.addEventListener("mouseup", handleMouseUp);

  function handleMouseDown(event) {
    // 禁止用户选择网页中文字
    document.onselectstart = () => false;
    // 禁止用户拖动元素
    document.ondragstart = () => false;
    reSizeable = true;
    lastClientY = event.clientY;
  }

  function handleMouseMove(event) {
    document.getElementById("dragLine").style.cursor = "grabbing";
    if (reSizeable) {
      dragBox.style.height =
        Math.max(
          minHeight,
          dragBox.offsetHeight + (lastClientY - event.clientY)
        ) + "px";
      // offsetHeight 是鼠标所点击的位置与对应元素（dragBox）的垂直距离
      // lastClientY - event.clientY 计算出变动的垂直距离
      lastClientY = event.clientY;
    }
  }

  function handleMouseUp() {
    reSizeable = false;
  }

  return (
    <div
      className={`h-fit w-full bg-blue-5 relative md:h-full ${
        showGraph === false ? "md:flex md:justify-center" : ""
      }`}
    >
      {/* (关系图)搜索框+关系图+图例 */}
      <div
        id="graph"
        className={`h-96 w-full flex justify-center items-center bg-blue-50 shadow-inner
        md:h-full ${showGraph === true ? "" : "hidden"}`}
      ></div>

      {/* 相关论文选项列表 */}
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
          className="h-full w-full bg-gray-50 flex flex-col justify-start items-center 
          md:overflow-y-scroll shadow-lg"
        >
          {/* 论文顶部的搜索框以及时间选择器 */}
          <div
            className="sticky top-0 z-10 py-1 h-fit w-full bg-blue-100 
           flex flex-col justify-center items-center"
          >
            {/* 搜索框 */}
            <div className="h-8 w-11/12 rounded flex justify-between items-center">
              <input
                className="h-8 w-11/12 px-2 rounded border-2 border-solid border-blue-200 text-gray-600"
                placeholder="Search"
                ref={searchInput}
                onKeyUp={enterKeyUp}
              ></input>
              <div className="h-fit w-fit p-1" onClick={enterKeyUp}>
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

            {/* 两个选择时间器 */}
            <div className="min-h-0 h-9 w-full px-2 flex justify-around items-center">
              <select
                className="h-auto w-1/4"
                onChange={(e) => {
                  setSearchType(e.target.value);
                }}
              >
                <option value="mi-RNA">mi-RNA</option>
                <option value="Disease">Disease</option>
              </select>
              {/* start-year */}
              <select
                className="h-auto w-1/4"
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
            paperList.map((item) => {
              return (
                <PaperBox
                  selected={`${item.id === paperSelectedId ? "true" : "false"}`}
                  onClick={() => {
                    setPaperSelectedId(item.id);
                  }}
                >
                  <p
                    className={`inline-block w-full text-gray-600
                   font-semibold truncate`}
                  >
                    {item.title}
                  </p>
                  {item.abstract !== undefined && item.abstract !== null && (
                    <AbsBox time={item.time}>
                      <span className="text-sky-700 font-bold">Abstract: </span>
                      {item.abstract}
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
              if (item.id === paperSelectedId) {
                return (
                  // 手机端论文详情
                  <div
                    id="dragBox"
                    onMouseDown={handleMouseDown}
                    className={`h-52 w-full sticky bottom-10 md:hidden`}
                  >
                    {/* 论文内容上的拖动条 */}
                    <div
                      id="dragLine"
                      className="h-3 w-full p-0 flex justify-center items-center bg-gray-200"
                    >
                      <div className="h-1 w-12 rounded-full m-0 bg-gray-400 "></div>
                    </div>
                    {/* 手机端论文内容滚动面板 container */}
                    <div className="h-full w-full px-1 pb-3 cursor-default overflow-y-scroll text-justify bg-green-50">
                      <h1 className="text-lg font-bold block mb-1">
                        {item.title}
                      </h1>
                      {item.author !== undefined &&
                        item.author !== null &&
                        item.author.map((aut) => {
                          return (
                            <p className="text-gray-600 inline pr-1">{aut}</p>
                          );
                        })}
                      <p className=" text-gray-600">{item.time}</p>
                      <div className="inline-block h-5 w-fit mr-2">
                        Open in:
                      </div>
                      <div className="h-6 w-6 rounded-full text-white bg-gray-500 inline-block">
                        <div className="h-fit w-fit mx-auto">doi</div>
                      </div>
                      <div className="h-1 w-full"></div>
                      <p className="text-sky-800 font-bold">Abstract:</p>
                      <p>{item.abstract}</p>
                    </div>
                  </div>
                );
              }
              return <></>;
            })}

          {/* 底部的选择页面按钮 */}
          <div
            className="sticky bottom-0 w-full h-10 shrink-0 flex justify-center items-center
           bg-blue-100"
          >
            {page_now > 2 && <PageButton content={1}></PageButton>}
            {page_now > 2 && " < < "}
            {page_now > 1 && <PageButton content={page_now - 1}></PageButton>}
            {/* 当前页的按钮以及输入框 */}
            <div className="h-7 w-fit relative px-3 mx-2 rounded bg-gray-50 shadow-md ring-2 ring-blue-300">
              <p className="leading-7 text-center text-gray-600">{page_now}</p>
              <input
                type="number"
                ref={pageInput}
                onChange={gotopage}
                placeholder={page_now}
                className="absolute top-0 left-0 h-7 w-10 rounded text-center outline-none
                opacity-0 focus:opacity-100 ring-2 ring-blue-300"
              />
            </div>
            {page_now < page_end && (
              <PageButton content={page_now + 1}></PageButton>
            )}
            {page_now < page_end - 1 && " > > "}
            {page_now < page_end - 1 && (
              <PageButton content={page_end}></PageButton>
            )}
          </div>
        </div>
      </div>

      {/* 论文题目和摘要（详情） */}
      {paperList !== undefined &&
        paperList !== null &&
        paperSelectedId !== undefined &&
        paperList.map((item) => {
          if (item.id === paperSelectedId) {
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
                      "md:w-60 lg:w-80 xl:w-85 2xl:w-100 md:absolute md:top-0 md:right-0 md:h-full md:min-h-0"
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
                  <h1 className="text-xl font-bold block mb-2">{item.title}</h1>
                  {item.author !== undefined &&
                    item.author !== null &&
                    item.author.map((aut) => {
                      return <p className="text-gray-600 inline pr-2">{aut}</p>;
                    })}
                  <p className="pt-1 text-gray-600">{item.time}</p>
                  <div className="h-4 w-full"></div>
                  <div className="inline-block h-6 w-fit mr-3">Open in:</div>
                  <div className="h-6 w-6 rounded-full text-white bg-gray-500 inline-block">
                    <div className=" h-fit w-fit mx-auto">doi</div>
                  </div>
                  <div className="h-4 w-full"></div>
                  <p className="text-sky-800 font-bold">Abstract:</p>
                  <p>{item.abstract}</p>
                </div>
              </div>
            );
          }
          return <></>;
        })}
    </div>
  );
}
