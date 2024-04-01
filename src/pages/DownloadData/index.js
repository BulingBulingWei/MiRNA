import React, { useState, useEffect, useRef, useContext } from "react";
import { ToastContext } from "../../App";
import download from "downloadjs";
//接口
import {
  GetMirnaFuzzySearchName,
  GetDiseaseFuzzySearchName,
  POSTMirnaRelationshipData,
  PostDownloadRelationshipData,
  axiosInstance as axios,
} from "../../utils/mapPath";
//组件样式
import {
  FuzzySearchList,
  FuzzySearchItem,
  MirnaSelectBox,
  DisSelectBox,
  OtherSelectBox,
  InputBox,
  CountInputBox,
  SelectedLabelBox,
  MirnaSelectedLabel,
  DisSelectedLabel,
  Btn,
  Filter,
  Label,
  DataFrame,
  DataRow,
  DataSpace,
  ResourceBtn,
  DownloadBtn,
  DownloadWin,
  FileTypeBtn,
  Footer,
  GraphBox,
  PredictBtn,
} from "../../StyleComponents/DownloaddataCSS";
import PageButton from "../../Component/PageButton";
import { CancelSvg, LinkSvg, QuestionSvg } from "../../svg";
import { useDebounce } from "../../utils/tools";

export default function DownloadData() {
  const toastController = useContext(ToastContext);

  // useRef
  const mirnaSearchInput = useRef(null);
  const disSearchInput = useRef(null);
  const relevanceInput = useRef(null);
  const pageSizeInput = useRef(null);
  const volumnSizeInput = useRef(null);
  const [relevanceSelect, setRelevanceSelect] = useState(0.9);
  const [pageSizeSelect, setPageSizeSelect] = useState(50);
  const [volumnSizeSelect, setVolumnSizeSelect] = useState(100);

  //list & data
  const [MirnaFuzzySearchList, setMirnaFuzzySearchList] = useState([]);
  const [DisFuzzySearchList, setDisFuzzySearchList] = useState([]);
  const [MirnaSelectList, setMirnaSelectList] = useState([]);
  const [DisSelectList, setDisSelectList] = useState([]);
  const [RelationshipData, setRelationshipData] = useState(undefined);
  const [isPredict, setIsPredict] = useState(false);
  const [count, setCount] = useState(0);
  const [graphData, setGraphData] = useState(null);
  const [hasGraph, setHasGraph] = useState(false);

  //有关页数的state
  const [page_now, setPage_now] = useState(1);
  const [page_end, setPage_end] = useState(1);
  const [showDownloadWin, setShowDownloadWin] = useState(false);

  //一些input的 dom标识
  const [SourceSelect, setSourceSelect] = useState(["0"]);
  const [FileTypeSelect, setFileTypeSelect] = useState(0);
  const pageInput = useRef(null);

  const SOURCE = {
    HMDD: "0",
  };

  const DOWNLOAD_TYPE = {
    xlsx: 0,
    csv: 1,
    txt: 2,
    json: 3,
  };

  const WidthConfig = {
    MiRNA: { name: "mirnaName", width: "16%" },
    Disease: { name: "disease", width: "24%" },
    Source: { name: "resource", width: "20%" },
    Pmid: { name: "pmid", width: "15%" },
    Relevance: { name: "relevance", width: "15%" },
    "PubMed Link": { name: "PubMed", width: "10%" },
  };

  //download
  useEffect(() => {
    POSTMirnaRelationshipDataAxios();
  }, [
    page_now,
    SourceSelect,
    MirnaSelectList,
    DisSelectList,
    relevanceSelect,
    pageSizeSelect,
  ]);

  // TODO:参数修改
  const POSTMirnaRelationshipDataAxios = async () => {
    let options = {
      url: POSTMirnaRelationshipData,
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      data: {
        diseases: DisSelectList,
        mirnas: MirnaSelectList,
        resources: SourceSelect,
        filterRow: count,
        maxRelevance: 1, //暂时固定不变
        minRelevance: parseFloat(relevanceInput.current.value),
        predictModel: isPredict,
        pageNum: parseInt(page_now), //在哪一页
        pageSize: parseInt(pageSizeInput.current.value), //一页数据的条数
      },
    };
    let res = await axios(options);

    if (res?.data?.code === "0") {
      setRelationshipData(res?.data?.data?.mirnaRelationDTOList);
      if (parseInt(res?.data?.data?.total) === 0) {
        toastController({
          mes: "No data found~",
          timeout: 1000,
        });
        return;
      }
      if (
        parseInt(res?.data?.data?.total) %
          parseInt(res?.data?.data?.pageSize) !==
        0
      ) {
        setPage_end(
          parseInt(res?.data?.data?.total / res?.data?.data?.pageSize) + 1
        );
      } else
        setPage_end(
          parseInt(res?.data?.data?.total / res?.data?.data?.pageSize)
        );
    }
    //请求不成功
    else {
      toastController({
        mes: "request failure",
        timeout: 1000,
      });
    }
  };

  // TODO：参数修改
  const PostDownloadRelationshipDataAxios = async () => {
    let options = {
      url: PostDownloadRelationshipData,
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      responseType: "blob",
      data: {
        diseases: DisSelectList,
        mirnas: MirnaSelectList,
        downloadType: parseInt(FileTypeSelect),
        predictModel: isPredict,
        resources: SourceSelect,
        filterRow: count,
        row: parseInt(volumnSizeInput.current.value),
        maxRelevance: 1, //暂时固定不变
        minRelevance: parseFloat(relevanceInput.current.value),
      },
    };
    let res = await axios(options);

    if (res?.data?.code !== "555") {
      let blobData = res?.data;
      const blob = new Blob([blobData], {
        type: "application/pdf;charset=utf-8",
      });
      download(blob, `data.${FileTypeSelect}`, "application/octet-stream");
    }
    //请求不成功
    else {
      toastController({
        mes: "Download failed",
        timeout: 1000,
      });
    }
  };

  const GetMirnaFuzzySearchAxios = async () => {
    let options = {
      url: GetMirnaFuzzySearchName,
      method: "GET",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      params: {
        MirnaName: mirnaSearchInput.current.value,
      },
    };

    let res = await axios(options);
    if (res?.data?.code === "0") {
      setMirnaFuzzySearchList(res?.data?.data);
    } else {
      toastController({
        mes: res?.data?.message,
        timeout: 1000,
      });
    }
  };

  const GetDisFuzzySearchAxios = async () => {
    let options = {
      url: GetDiseaseFuzzySearchName,
      method: "GET",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      params: {
        diseaseName: disSearchInput.current.value,
      },
    };

    let res = await axios(options);
    if (res?.data?.code === "0") {
      setDisFuzzySearchList(res?.data?.data);
    } else {
      toastController({
        mes: res?.data?.message,
        timeout: 1000,
      });
    }
  };

  // 节流函数
  // function throttle(fn, timeout) {
  //   var can = true;
  //   return function (...args) {
  //     if (can === true) {
  //       can = false;
  //       setTimeout(() => {
  //         fn(...args);
  //         can = true;
  //       }, timeout);
  //     }
  //   };
  // }

  const handleMirnaSearchInputChange = useDebounce(
    GetMirnaFuzzySearchAxios,
    1000
  );

  const handleDisSearchInputChange = useDebounce(GetDisFuzzySearchAxios, 1000);

  const goToPage = (pageNum) => {
    if (typeof parseInt(pageNum) !== "number" || pageNum < 1) {
      toastController({
        mes: "Please enter the legal number of pages",
        timeout: 1500,
      });
      return;
    }
    if (pageNum > 0 && pageNum <= page_end) {
      setPage_now(parseInt(pageNum));
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

  return (
    <div
      className={`h-full w-full relative flex flex-col items-center overflow-y-scroll bg-gray-50`}
    >
      {/* 选择disease和mirna */}
      <div
        className="h-fit w-full flex flex-col justify-center items-center md:sticky top-0 z-10"
        style={{
          backgroundColor: `#9dcdc1`,
        }}
      >
        {/* 选择mirna */}
        <MirnaSelectBox style={{ zIndex: 20 }}>
          {/*left: 搜索框 & button */}
          <InputBox>
            <div className="h-6 w-full flex justify-start items-center">
              {/* 输入框和模糊搜索选项 */}
              <div className="mr-2 font-bold w-20 text-right flex-shrink-0">
                miRNA:
              </div>
              <div className="h-full  flex-grow relative">
                <input
                  type="text"
                  placeholder="select miRNA"
                  className="h-full w-full rounded px-2 z-10"
                  ref={mirnaSearchInput}
                  onFocus={handleMirnaSearchInputChange}
                  onChange={handleMirnaSearchInputChange}
                  onBlur={() => {
                    setTimeout(() => {
                      setMirnaFuzzySearchList([]);
                    }, 500);
                  }}
                />
                {!!MirnaFuzzySearchList && MirnaFuzzySearchList.length > 0 && (
                  <FuzzySearchList>
                    <ul
                      className="h-fit w-full flex-shrink-0 rounded border-2 
                        text-gray-600 shadow p-0 z-30 bg-gray-50"
                    >
                      {MirnaFuzzySearchList.map((fuzzyItem) => {
                        return (
                          <FuzzySearchItem
                            key={fuzzyItem?.id}
                            onClick={(event) => {
                              event.preventDefault();
                              // console.log(fuzzyItem?.name);
                              if (MirnaSelectList.length === 10) {
                                toastController({
                                  mes: `Can only filter up to 10 items`,
                                  timeout: 2000,
                                });
                                return;
                              }
                              if (
                                MirnaSelectList.indexOf(fuzzyItem?.name) !== -1
                              ) {
                                toastController({
                                  mes: `This miRNA has been selected`,
                                  timeout: 2000,
                                });
                                return;
                              }
                              setPage_now(1);
                              setMirnaSelectList([
                                ...MirnaSelectList,
                                fuzzyItem?.name,
                              ]);
                            }}
                          >
                            {fuzzyItem?.name}
                          </FuzzySearchItem>
                        );
                      })}
                    </ul>
                  </FuzzySearchList>
                )}
              </div>
            </div>
          </InputBox>

          {/* right: 显示已选择的 mirna */}
          <SelectedLabelBox>
            {MirnaSelectList.map((item) => {
              return (
                <MirnaSelectedLabel key={item}>
                  {item}
                  <div
                    onClick={() => {
                      if (MirnaSelectList.indexOf(item) !== -1) {
                      }
                      let set = new Set(MirnaSelectList);
                      set.delete(item);
                      setMirnaSelectList([...set]);
                    }}
                  >
                    <CancelSvg></CancelSvg>
                  </div>
                </MirnaSelectedLabel>
              );
            })}
          </SelectedLabelBox>
        </MirnaSelectBox>

        {/* 选择疾病 */}
        <DisSelectBox style={{ zIndex: 10 }}>
          {/*left: 搜索框 & button */}
          <InputBox>
            <div className="h-6 w-full flex justify-start items-center ">
              {/* 输入框和模糊搜索选项 */}
              <div className="min-w-fit mr-2 font-bold w-20 text-right flex-shrink-0">
                disease:
              </div>
              <div className="h-full flex-grow relative">
                <input
                  type="text"
                  placeholder="select disease"
                  className="h-full w-full rounded px-2"
                  ref={disSearchInput}
                  onFocus={handleDisSearchInputChange}
                  onChange={handleDisSearchInputChange}
                  onBlur={() => {
                    setTimeout(() => {
                      setDisFuzzySearchList(null);
                    }, 500);
                  }}
                />
                {!!DisFuzzySearchList && DisFuzzySearchList.length > 0 && (
                  <FuzzySearchList>
                    <ul
                      className="h-fit w-full flex-shrink-0 rounded border-2 
                         text-gray-600 shadow p-0 z-30 bg-gray-50"
                    >
                      {DisFuzzySearchList.map((fuzzyItem) => {
                        return (
                          <FuzzySearchItem
                            key={fuzzyItem?.id}
                            onClick={(event) => {
                              console.log(fuzzyItem?.name);
                              event.preventDefault();

                              if (DisSelectList.length === 10) {
                                toastController({
                                  mes: `Can only filter up to 10 items`,
                                  timeout: 2000,
                                });
                                return;
                              }
                              if (
                                DisSelectList.indexOf(fuzzyItem?.name) !== -1
                              ) {
                                toastController({
                                  mes: `This disease has been selected`,
                                  timeout: 2000,
                                });
                                return;
                              }
                              setPage_now(1);
                              setDisSelectList([
                                ...DisSelectList,
                                fuzzyItem?.name,
                              ]);
                            }}
                          >
                            {fuzzyItem?.name}
                          </FuzzySearchItem>
                        );
                      })}
                    </ul>
                  </FuzzySearchList>
                )}
              </div>
            </div>
          </InputBox>
          {/* right: 显示已选择的 disease */}
          <SelectedLabelBox>
            {DisSelectList.map((item) => {
              return (
                <DisSelectedLabel key={item}>
                  {item}
                  <div
                    onClick={() => {
                      if (DisSelectList.indexOf(item) !== -1) {
                        let set = new Set(DisSelectList);
                        set.delete(item);
                        setDisSelectList([...set]);
                      }
                    }}
                  >
                    <CancelSvg></CancelSvg>
                  </div>
                </DisSelectedLabel>
              );
            })}
          </SelectedLabelBox>
        </DisSelectBox>

        {/* 选择count、reset、graph */}
        <OtherSelectBox>
          <CountInputBox>
            <div className="h-6 w-full flex justify-start items-center">
              {/* 输入框 */}
              <div className="min-w-fit mr-2 font-bold w-20 text-right flex-shrink-0">
                count:
              </div>
              <div className="h-full flex-grow relative">
                <input
                  type="number"
                  className="h-full w-full rounded px-2"
                  value={count === 0 ? "" : count}
                  min={0}
                  max={100}
                  onChange={(e) => {
                    setCount(e.value);
                  }}
                />
              </div>
            </div>
          </CountInputBox>
          <div
            className="h-full w-8 flex justify-center items-center hover:scale-90
          transition-all duration-300"
          >
            <QuestionSvg></QuestionSvg>
          </div>

          <Btn
            className="transition-all duration-300"
            onClick={() => {
              setMirnaSelectList([]);
              setDisSelectList([]);
              setCount(0);
              toastController({
                mes: "has already reset.",
                timeout: 1000,
              });
            }}
          >
            Reset
          </Btn>
          <Btn
            className={`mr-2 transition-all duration-300`}
            style={{ backgroundColor: `${hasGraph ? "#0d9488" : ""}` }}
            onClick={() => {
              setHasGraph(!hasGraph);
            }}
          >
            Graph
          </Btn>
        </OtherSelectBox>
      </div>

      {/* 中间部分（数据过滤器以及数据表） */}
      <div className="h-fit w-full flex-grow">
        {/* 展示数据部分 */}
        <div
          className="h-fit w-full flex flex-col px-3 md:flex-row justify-center items-center
         md:items-start md:justify-between flex-grow"
        >
          {/* 过滤器 */}
          <Filter>
            <p className="font-bold text-xl text-gray-700 mx-auto">
              Data Filter
            </p>
            <Label>Source:</Label>
            {!!SOURCE &&
              Object.keys(SOURCE).map((item) => {
                return (
                  <ResourceBtn
                    selected={
                      SourceSelect.includes(SOURCE[item]) ? true : false
                    }
                    onClick={() => {
                      setIsPredict(false);
                      if (SourceSelect.includes(SOURCE[item])) {
                        if (SourceSelect.length === 1) {
                          toastController({
                            mes: `Cannot select less than one source`,
                            timeout: 2000,
                          });
                          return;
                        }
                        const tmpList = SourceSelect.filter(
                          (e) => e !== SOURCE[item]
                        );
                        setSourceSelect(tmpList);
                      } else {
                        const tmpList = [...SourceSelect, SOURCE[item]];
                        setSourceSelect(tmpList);
                      }
                      setPage_now(1);
                    }}
                  >
                    {item}
                  </ResourceBtn>
                );
              })}

            <PredictBtn
              selected={isPredict ? true : false}
              onClick={() => {
                setPage_now(1);
                setIsPredict(true);
                setSourceSelect([]);
              }}
            >
              Predict Model
            </PredictBtn>

            <div
              className={`h-fit flex flex-col ${
                isPredict ? "opacity-1 max-h-96" : "max-h-0 opacity-0"
              } transform ease-in transition-all duration-700 overflow-hidden`}
            >
              <Label>
                Relevance(lease):{" "}
                <span className="font-normal text-sky-700 pl-2">
                  {relevanceSelect}
                </span>
              </Label>
              <input
                type="range"
                ref={relevanceInput}
                defaultValue={0.9}
                max={1}
                min={0}
                step={0.1}
                name="RelevanceBar"
                id="RelevanceBar"
                list="RelevanceMarks"
                className="h-8 mx-auto w-5/6 "
                onChange={(e) => {
                  setPage_now(1);
                  setRelevanceSelect(parseFloat(relevanceInput.current.value));
                }}
              />

              <datalist
                id="RelevanceMarks"
                className="h-8 w-5/6 flex mx-auto justify-between"
              >
                <option value={0} label="0"></option>
                <option value={0.2} label="0.2"></option>
                <option value={0.4} label="0.4"></option>
                <option value={0.6} label="0.6"></option>
                <option value={0.8} label="0.8"></option>
                <option value={1} label="1"></option>
              </datalist>
            </div>

            <div>
              <Label>
                Data volume:
                <span className="font-normal text-sky-700 pl-2">
                  {pageSizeSelect}
                </span>
              </Label>
              <input
                type="range"
                ref={pageSizeInput}
                defaultValue={50}
                max={100}
                min={20}
                step={10}
                name="rangeBar"
                id="rangeBar"
                list="volumeMarks"
                className="h-8 mx-auto w-5/6"
                onChange={(e) => {
                  setPage_now(1);
                  setPageSizeSelect(parseInt(pageSizeInput.current.value));
                }}
              />

              <datalist
                id="volumeMarks"
                className="h-8 w-5/6 flex mx-auto justify-between"
              >
                <option value={20} label="20"></option>
                <option value={40} label="40"></option>
                <option value={60} label="60"></option>
                <option value={80} label="80"></option>
                <option value={100} label="100"></option>
              </datalist>
            </div>

            <DownloadBtn
              onClick={() => {
                setShowDownloadWin(true);
              }}
            >
              Download
            </DownloadBtn>
          </Filter>

          {/* 中间的数据显示 */}
          <div
            className="flex flex-col justify-between mt-4 w-full overflow-x-scroll
             md:w-3/4 xl:w-4/5 bg-slate-100 relative"
            style={{ height: "calc(100vh - 12rem)" }}
          >
            <DataFrame>
              <DataRow
                style={{
                  backgroundColor: "#cfe9ed",
                  position: "sticky",
                  top: "0rem",
                  borderTopWidth: "1px",
                  borderTopColor: "#f9fafb",
                }}
              >
                {Object.keys(WidthConfig).map((key) => {
                  return (
                    <DataSpace style={{ width: `${WidthConfig[key]?.width}` }}>
                      {key}
                    </DataSpace>
                  );
                })}
              </DataRow>
              {!!RelationshipData &&
                RelationshipData.map((data) => {
                  return (
                    <DataRow>
                      {Object.keys(WidthConfig).map((key) => {
                        if (key === "Pmid")
                          return (
                            <DataSpace
                              style={{
                                width: `${WidthConfig[key]?.width}`,
                                cursor: "pointer",
                              }}
                              onClick={() => {
                                window.open(
                                  `https://pubmed.ncbi.nlm.nih.gov/${
                                    data?.[WidthConfig[key]?.name]
                                  }/`,
                                  "_blank"
                                );
                              }}
                            >
                              {data?.[WidthConfig[key]?.name]}
                            </DataSpace>
                          );
                        else if (key === "PubMed Link")
                          return (
                            <DataSpace
                              style={{
                                width: `${WidthConfig[key]?.width}`,
                                cursor: "pointer",
                              }}
                            >
                              <div
                                className="h-full w-fit px-1 flex justify-start items-center"
                                onClick={() => {
                                  window.open(
                                    `https://pubmed.ncbi.nlm.nih.gov/?term=${data?.rnaName}+AND+${data?.disease}&size=200`,
                                    "_blank"
                                  );
                                }}
                              >
                                <LinkSvg></LinkSvg>
                              </div>
                            </DataSpace>
                          );
                        return (
                          <DataSpace
                            style={{ width: `${WidthConfig[key]?.width}` }}
                          >
                            {data?.[WidthConfig[key]?.name]}
                          </DataSpace>
                        );
                      })}
                    </DataRow>
                  );
                })}
            </DataFrame>
            <Footer>
              {page_now > 2 && (
                <PageButton
                  content={1}
                  onClick={() => {
                    // console.log("click");
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
                <p className="leading-7 text-center text-gray-600">
                  {page_now}
                </p>
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
            </Footer>
          </div>
        </div>
        <GraphBox className=" bg-red-100">123</GraphBox>
      </div>

      {/* DownloadWin 下载数据的弹窗*/}
      {showDownloadWin === true && (
        <div
          className="fixed h-screen w-screen z-50 bg-gray-600 bg-opacity-30 "
          onClick={(event) => {
            event.preventDefault();
            setShowDownloadWin(false);
          }}
        >
          <DownloadWin
            onClick={(event) => {
              event.stopPropagation();
            }}
          >
            <p className="font-bold text-gray-700 text-lg">
              Please select a file type:
            </p>
            {/* 四个按钮 */}
            <div className="h-fit w-full mt-3 mb-4 flex justify-around items-center">
              {Object.keys(DOWNLOAD_TYPE).map((type) => {
                return (
                  <FileTypeBtn
                    style={{
                      backgroundColor: `${
                        FileTypeSelect === type ? "#0d9488" : ""
                      }`,
                      outlineStyle: `${FileTypeSelect === type ? "solid" : ""}`,
                      outlineOffset: `${FileTypeSelect === type ? "2px" : "0"}`,
                      outlineWidth: `${FileTypeSelect === type ? "3px" : "0"}`,
                    }}
                    onClick={() => {
                      setFileTypeSelect(DOWNLOAD_TYPE[type]);
                    }}
                  >
                    {type}
                  </FileTypeBtn>
                );
              })}
            </div>
            {/* Download data volume */}
            <p className="font-bold text-gray-700 text-lg ">
              Download data volume:
              <span className="font-normal text-sky-700 px-2 py-1">
                {volumnSizeSelect}
              </span>
            </p>
            <input
              type="range"
              ref={volumnSizeInput}
              defaultValue={100}
              max={5000}
              min={0}
              step={100}
              name="volumeRangeBar"
              id="volumeRangeBar"
              list="volumeRangeBarMarks"
              className="h-6 mt-2 w-5/6"
              onChange={() => {
                setVolumnSizeSelect(parseInt(volumnSizeInput.current.value));
              }}
            />

            <datalist
              id="volumeRangeBarMarks"
              className="h-fit w-5/6 flex justify-between"
            >
              <option value={0} label="0"></option>
              <option value={1000} label="1000"></option>
              <option value={2000} label="2000"></option>
              <option value={3000} label="3000"></option>
              <option value={4000} label="4000"></option>
              <option value={5000} label="5000"></option>
            </datalist>

            <div className="h-fit w-full mt-4 flex justify-center">
              <DownloadBtn
                style={{
                  width: "50%",
                }}
                onClick={() => {
                  toastController({
                    mes: `download...`,
                    timeout: 2000,
                  });
                  PostDownloadRelationshipDataAxios();
                }}
              >
                Download
              </DownloadBtn>
            </div>
          </DownloadWin>
        </div>
      )}
    </div>
  );
}
