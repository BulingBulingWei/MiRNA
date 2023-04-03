import React, { useState, useEffect, useRef, useContext } from "react";
import { ToastContext, GraphContext } from "../../App";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import styled from "styled-components";
import axios from "axios";
import download from "downloadjs";
import PageButton from "../../Component/PageButton";
import bgimg from "../../img/img1.jpg";
import { DownloadSvg } from "../../svg/index";
import {
  GetArticles,
  GetDiseaseFuzzySearchName,
  GetMirnaFuzzySearchName,
  GetOneArticleDownload,
  PostArticleListDownload,
} from "../../utils/mapPath";

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

//只搜索论文的页面
export default function PaperSearhDetail() {
  const navigate = useNavigate();
  const location = useLocation();
  const params = useParams();

  const maxSize = 20;
  //一些useContext
  const toastController = useContext(ToastContext);

  //有关页数的state
  const [page_now, setPage_now] = useState(parseInt(params.pageNum));
  const [page_end, setPage_end] = useState(parseInt(params.pageNum));

  //一些input的 dom标识
  const searchInput = useRef(null);
  const pageInput = useRef(null);

  //有关搜索参数（类型，时间，是否显示图）的state
  const [searchContext, setSearchContext] = useState("");
  const [paperSelectedId, setPaperSelectedId] = useState("0");
  // 手机端控制是否显示论文详情
  const [showDetail, setShowDetail] = useState(false);

  //一些用到的数据
  const [paperList, setPaperList] = useState([]);
  const [DiseaseFuzzyList, setDiseaseFuzzyList] = useState([]);
  const [MirnaFuzzyList, setMirnaFuzzyList] = useState([]);

  const GetArticlesAxios = async ({ message, pageNum }) => {
    let options = {
      url: GetArticles,
      method: "GET",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      params: {
        message: message,
        pageNum: parseInt(pageNum),
        pageSize: maxSize,
      },
    };
    let res = await axios(options);

    if (res.data.code === "0") {
      setSearchContext(message);
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
        console.log(res.data.data.articles);
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
      toastController({
        mes: "chenggong",
        timeout: 1000,
      });
    } else {
      toastController({
        mes: res.data.message,
        timeout: 1000,
      });
    }
  };

  useEffect(() => {
    let name = params.searchName.replaceAll("+", " ");
    setSearchContext(name);
    GetArticlesAxios({ message: name, pageNum: params.pageNum });
  }, [location]);

  const handleSearch = () => {
    setDiseaseFuzzyList(undefined);
    setMirnaFuzzyList(undefined);
    let message = searchInput.current.value;
    if (message === undefined || message === "") {
      toastController({
        mes: "请输入搜索内容",
        timeout: 2000,
      });
      return;
    }
    message = message.trim();
    message.replaceAll(" ", "+");
    navigate(`/Paper/` + message + `/1`);
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
      navigate(`/Paper/` + params.searchName + `/` + pageNum);
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
    <div className="h-full w-full flex justify-center items-center bg-green-200">
      <div
        className="h-full w-full lg:flex lg:justify-center lg:items-center "
        style={{
          backgroundImage: `url(${bgimg})`,
          backgroundRepeat: "repeat-y",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        {/* 左边：论文列表选项 , 以及搜索框*/}
        <div
          className="h-fit max-h-full w-full min-h-full flex flex-col justify-between items-center
         overflow-y-scroll lg:w-1/4 bg-gray-100 bg-opacity-90 cursor-pointer"
        >
          {/* 论文顶部的搜索框 */}
          <div
            className="sticky top-0 z-50 py-2 h-fit w-full bg-blue-100 
           flex flex-col justify-center items-center"
          >
            {/* 搜索框 以及 搜索按钮*/}
            <div className="h-8 w-11/12 rounded flex justify-between items-center">
              {/* 搜索框 以及 模糊搜索框 */}
              <div className="h-full w-11/12 relative flex flex-col justify-start items-center rounded ">
                <input
                  className="h-8 w-full px-2 rounded border-2 select-all border-solid border-blue-200 text-gray-700"
                  placeholder={searchContext}
                  ref={searchInput}
                  onBlur={() => {
                    setTimeout(() => {
                      setDiseaseFuzzyList([]);
                      setMirnaFuzzyList([]);
                    }, 200);
                  }}
                  onKeyUp={searchEnterKeyUp}
                  onChange={handleSearchInputChange}
                ></input>
                {/* 模糊搜索选项 */}

                {((MirnaFuzzyList !== null &&
                  MirnaFuzzyList !== undefined &&
                  MirnaFuzzyList.length > 0) ||
                  (DiseaseFuzzyList !== null &&
                    DiseaseFuzzyList !== undefined &&
                    DiseaseFuzzyList.length > 0)) && (
                  <div
                    className="h-fit w-full max-h-80 absolute top-8 rounded
                 z-20 border-2 border-blue-200 overflow-y-scroll bg-gray-100 "
                  >
                    <ul
                      className="h-fit w-full flex-shrink-0 rounded 
                text-gray-600 shadow p-0"
                    >
                      {DiseaseFuzzyList.map((fuzzyItem) => {
                        return (
                          <li
                            key={fuzzyItem.name}
                            className="h-fit w-full z-50 flex px-2 justify-start items-center
                            hover:bg-gray-200 border-b-2 border-gray-300 cursor-pointer"
                            onClick={() => {
                              searchInput.current.value = fuzzyItem.name;
                              setDiseaseFuzzyList([]);
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
                            key={fuzzyItem.name}
                            className="h-fit w-full z-50 flex px-2 justify-start items-center
                            hover:bg-gray-200 border-b-2 border-gray-300 cursor-pointer"
                            onClick={() => {
                              searchInput.current.value = fuzzyItem.name;
                              setMirnaFuzzyList([]);
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
          </div>

          {/* 可选择的论文列表 */}
          {paperList !== undefined &&
          paperList !== null &&
          paperList.length > 0 ? (
            paperList.map((item) => {
              return (
                <PaperBox
                  key={item.pmid}
                  selected={`${
                    item.pmid === paperSelectedId ? "true" : "false"
                  }`}
                  onClick={() => {
                    setPaperSelectedId(item.pmid);
                    setShowDetail(true);
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
            })
          ) : (
            <div
              className="h-96 w-full flex justify-center items-center md:text-3xl 
          text-gray-300 font-bold"
            >
              居然什么都没有
            </div>
          )}

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

        {/* 右边：论文详情，以及手机端的回退按钮栏 */}
        <div
          className={`h-full w-full absolute top-0 right-0 bg-opacity-100 z-50
          ${showDetail === true ? "" : "w-0"}
          lg:relative lg:w-2/3 lg:min-h-fit transition-all duration-300
          bg-sky-50 lg:bg-opacity-60 overflow-y-scroll`}
        >
          {/* 回退按钮栏 */}
          <div
            className="h-8 px-2 leading-7 sticky top-0 text-2xl bg-blue-100 lg:hidden"
            onClick={() => {
              setShowDetail(false);
            }}
          >
            <div className="h-full w-fit bg-blue-200 px-4 rounded-full">
              {"<"}
            </div>
          </div>
          {/* 论文详情面板 */}
          {paperList !== undefined &&
            paperList !== null &&
            paperSelectedId !== "0" &&
            paperList.map((item) => {
              if (item.pmid === paperSelectedId) {
                return (
                  // 论文详情

                  <div
                    key={item.pmid}
                    className="h-fit w-full bg-gray-50 pl-3 pt-5 pb-16 shadow-lg 
                     lg:px-12 lg:py-12"
                  >
                    <h1 className="text-lg lg:text-xl font-bold block text-sky-700 mb-2">
                      <span dangerouslySetInnerHTML={{ __html: item.title }} />
                    </h1>
                    {item.authors !== undefined &&
                      item.authors !== null &&
                      item.authors.map((aut) => {
                        return (
                          <p key={aut} className="text-gray-600 inline pr-2">
                            {aut}{" "}
                            <span className="font-bold text-red-500">|</span>{" "}
                          </p>
                        );
                      })}
                    {/* <p className="text-xs lg:text-base text-gray-600 inline pr-2">
                      {item.authors}
                    </p> */}

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
                        <div className=" h-fit w-fit leading-6 mx-auto">
                          doi
                        </div>
                      </div>
                    )}
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
                    <div className="h-4 w-full"></div>
                    <p className="text-sky-800 font-bold leading-10">
                      Abstract:
                    </p>
                    <p>
                      <p dangerouslySetInnerHTML={{ __html: item.abs }} />
                    </p>

                    <div className="h-4 w-full"></div>
                    {item.keywords !== null && (
                      <>
                        <p className="text-sky-800 font-bold">Keywords:</p>
                        <p>
                          <span className="px-4"></span>
                          {item.keywords}
                        </p>
                      </>
                    )}
                  </div>
                );
              }
              return <></>;
            })}
        </div>
      </div>
    </div>
  );
}
