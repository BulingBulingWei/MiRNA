import React, { useState, useEffect, useRef, useContext } from "react";
import { ToastContext } from "../../App";
import download from "downloadjs";
//接口
import {
  GetMirnaFuzzyName,
  GetGeneFuzzyName,
  GetMirnaGeneRelData,
  GetMirnaGeneRelDataDownload,
  GetDataSourceInfo,
  GetDLPagesGraphData,
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
} from "../../StyleComponents/DownloaddataCSS";
import PageButton from "../../Component/PageButton";
import { CancelSvg, LinkSvg, QuestionSvg } from "../../svg";
import { useDebounce } from "../../utils/tools";
import { graphType } from "../../utils/enums";
import * as echarts from "echarts/core";
import {
  TitleComponent,
  TooltipComponent,
  LegendComponent,
} from "echarts/components";
import { GraphChart } from "echarts/charts";
import { CanvasRenderer } from "echarts/renderers";

echarts.use([
  TitleComponent,
  TooltipComponent,
  LegendComponent,
  GraphChart,
  CanvasRenderer,
]);

export default function DLmirnaGeneData() {
  const toastController = useContext(ToastContext);

  // useRef
  const mirnaSearchInput = useRef(null);
  const geneSearchInput = useRef(null);
  const graphDom = useRef(null);
  const pageSizeInput = useRef(null);
  const volumnSizeInput = useRef(null);
  const scrollDom = useRef(null);
  const [pageSizeSelect, setPageSizeSelect] = useState(50);
  const [volumnSizeSelect, setVolumnSizeSelect] = useState(100);

  //list & data
  const [MirnaFuzzySearchList, setMirnaFuzzySearchList] = useState([]);
  const [GeneFuzzySearchList, setGeneFuzzySearchList] = useState([]);
  const [MirnaSelectList, setMirnaSelectList] = useState([]);
  const [GeneSelectList, setGeneSelectList] = useState([]);
  const [RelationshipData, setRelationshipData] = useState(undefined);
  const [count, setCount] = useState(0);
  const [hasGraph, setHasGraph] = useState(false);
  const [downloadSource, setDownloadSource] = useState(null);
  const [graphData, setGraphData] = useState({});

  //有关页数的state
  const [page_now, setPage_now] = useState(1);
  const [page_end, setPage_end] = useState(1);
  const [showDownloadWin, setShowDownloadWin] = useState(false);

  //一些input的 dom标识
  const [SourceSelect, setSourceSelect] = useState([]);
  const [FileTypeSelect, setFileTypeSelect] = useState("xlsx");
  const pageInput = useRef(null);

  const [fetchRelationAxiosNum, setFetchRelationAxiosNum] = useState(0);
  const [fetchRelationAxiosCnt, setFetchRelationAxiosCnt] = useState(0);

  const SOURCE_TYPE = "gene";

  const FILETYPE = {
    xlsx: 0,
    csv: 1,
    txt: 2,
    json: 3,
  };

  const WidthConfig = {
    accession: { name: "accession", width: "15%" },
    mirnaName: { name: "mirnaName", width: "20%" },
    geneName: { name: "geneName", width: "20%" },
    geneId: { name: "geneId", width: "15%" },
    Source: { name: "source", width: "15%" },
    reference: { name: "reference", width: "15%" },
  };

  useEffect(() => {
    if (!hasGraph) return;
    console.log("lll");
    let myChart;
    let graphOption = {
      title: {
        text: "Relationship diagram",
        subtext: "Circular layout",
        top: "bottom",
        left: "right",
      },
      tooltip: {},
      legend: [
        {
          data:
            !!graphData?.categories &&
            graphData?.categories.map(function (a) {
              return a.name;
            }),
        },
      ],
      animationDurationUpdate: 1500,
      animationEasingUpdate: "quinticInOut",
      series: [
        {
          name: "Relationship diagram",
          type: "graph",
          layout: "circular",
          circular: {
            rotateLabel: true,
          },
          data: graphData?.nodes,
          links: graphData?.links,
          categories: graphData?.categories,
          roam: true,
          label: {
            position: "right",
            formatter: "{b}",
          },
          lineStyle: {
            color: "source",
            curveness: 0.3,
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
  }, [graphData, hasGraph]);

  useEffect(() => {
    if (hasGraph) {
      console.log("getData");
      GetGraphDataAxios();
    }
  }, [hasGraph]);

  //获取关系图数据
  const GetGraphDataAxios = async () => {
    let options = {
      url: GetDLPagesGraphData,
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      data: {
        mirnas: MirnaSelectList,
        queryWords: GeneSelectList,
        graphType: graphType["miRNA-Gene"],
        resources: SourceSelect,
        filterRow: Number(count),
        predictModel: false,
        maxRelevance: 1, //暂时固定不变
        minRelevance: 0,
      },
    };
    let res = await axios(options);

    if (res?.data?.code === "0") {
      setGraphData(res?.data?.data);
      console.log("graphData", res?.data?.data);
    }
    //请求不成功
    else {
      toastController({
        mes: "request failure",
        timeout: 1000,
      });
    }
  };

  const elementIsInFocus = (el) => el === document.activeElement;

  useEffect(() => {
    if (!!!downloadSource) {
      GetDataSourceInfoAxios();
    }
  }, []);

  //download
  useEffect(() => {
    if (!!downloadSource) {
      setHasGraph(false);
      POSTMirnaRelationshipDataAxios();
    }
  }, [
    page_now,
    SourceSelect,
    MirnaSelectList,
    GeneSelectList,
    pageSizeSelect,
    count,
  ]);

  // 获取所有的数据来源（非预测数据来源）
  const GetDataSourceInfoAxios = async () => {
    let options = {
      url: GetDataSourceInfo,
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      params: {
        type: SOURCE_TYPE, //gene
      },
    };
    let res = await axios(options);

    if (res?.data?.code === "0") {
      let tmp_source = res.data?.data?.filter(
        (item) => item?.type === SOURCE_TYPE
      );
      setDownloadSource(tmp_source);
      let tmp_select = [];
      res.data?.data?.forEach((item) => {
        if (item?.type === SOURCE_TYPE) {
          tmp_select.push(item.id);
        }
      });
      setSourceSelect(tmp_select);
    }
    //请求不成功
    else {
      toastController({
        mes: "request failure",
        timeout: 1000,
      });
    }
  };

  // 根据筛选条件获取数据
  const POSTMirnaRelationshipDataAxios = async () => {
    setFetchRelationAxiosCnt(fetchRelationAxiosCnt + 1);
    let cnt = fetchRelationAxiosCnt;
    let options = {
      url: GetMirnaGeneRelData,
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      data: {
        geneList: GeneSelectList,
        mirnas: MirnaSelectList,
        filterRow: Number(count),
        pageNum: parseInt(page_now),
        pageSize: parseInt(pageSizeInput.current.value),
        resources: SourceSelect,
      },
    };
    let res = await axios(options);
    if (cnt < fetchRelationAxiosNum) return;
    else setFetchRelationAxiosNum(cnt);

    if (res?.data?.code === "0") {
      setRelationshipData(res?.data?.data?.geneList);
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

  const PostDownloadRelationshipDataAxios = async () => {
    let options = {
      url: GetMirnaGeneRelDataDownload,
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      responseType: "blob",
      data: {
        gene: GeneSelectList,
        mirnas: MirnaSelectList,
        downloadType: FILETYPE[FileTypeSelect],
        resources: SourceSelect,
        row: parseInt(volumnSizeInput.current.value),
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
        mes: "download failure",
        timeout: 1000,
      });
    }
  };

  const GetMirnaFuzzySearchAxios = async () => {
    let options = {
      url: GetMirnaFuzzyName,
      method: "GET",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      params: {
        rnaName: mirnaSearchInput.current.value,
      },
    };

    let res = await axios(options);
    if (res?.data?.code === "0") {
      if (elementIsInFocus(mirnaSearchInput.current))
        setMirnaFuzzySearchList(res?.data?.data);
    } else {
      toastController({
        mes: res?.data?.message,
        timeout: 1000,
      });
    }
  };

  const GetGeneFuzzySearchAxios = async () => {
    let options = {
      url: GetGeneFuzzyName,
      method: "GET",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      params: {
        geneName: geneSearchInput.current.value,
      },
    };

    let res = await axios(options);
    if (res?.data?.code === "0") {
      if (elementIsInFocus(geneSearchInput.current))
        setGeneFuzzySearchList(res?.data?.data);
    } else {
      toastController({
        mes: res?.data?.message,
        timeout: 1000,
      });
    }
  };

  const handleMirnaSearchInputChange = useDebounce(
    GetMirnaFuzzySearchAxios,
    1000
  );

  const handleGeneSearchInputChange = useDebounce(
    GetGeneFuzzySearchAxios,
    1000
  );

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
      ref={scrollDom}
      style={{ scrollBehavior: "smooth" }}
      className={`h-full w-full relative flex flex-col items-center overflow-y-scroll bg-gray-50`}
    >
      {/* 选择mirna\gene, 筛选count、是否画图 */}
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
                                MirnaSelectList.indexOf(fuzzyItem?.rnaName) !==
                                -1
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
                                fuzzyItem?.rnaName,
                              ]);
                            }}
                          >
                            {fuzzyItem?.rnaName}
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

        {/* gene */}
        <DisSelectBox style={{ zIndex: 10 }}>
          {/*left: 搜索框 & button */}
          <InputBox>
            <div className="h-6 w-full flex justify-start items-center ">
              {/* 输入框和模糊搜索选项 */}
              <div className="min-w-fit mr-2 font-bold w-20 text-right flex-shrink-0">
                gene:
              </div>
              <div className="h-full flex-grow relative">
                <input
                  type="text"
                  placeholder="select gene"
                  className="h-full w-full rounded px-2"
                  ref={geneSearchInput}
                  onFocus={handleGeneSearchInputChange}
                  onChange={handleGeneSearchInputChange}
                  onBlur={() => {
                    setTimeout(() => {
                      setGeneFuzzySearchList(null);
                    }, 500);
                  }}
                />
                {!!GeneFuzzySearchList && GeneFuzzySearchList.length > 0 && (
                  <FuzzySearchList>
                    <ul
                      className="h-fit w-full flex-shrink-0 rounded border-2 
                         text-gray-600 shadow p-0 z-30 bg-gray-50"
                    >
                      {GeneFuzzySearchList.map((gene) => {
                        return (
                          <FuzzySearchItem
                            onClick={(event) => {
                              console.log(gene);
                              event.preventDefault();

                              if (GeneSelectList.length === 10) {
                                toastController({
                                  mes: `Can only filter up to 10 items`,
                                  timeout: 2000,
                                });
                                return;
                              }
                              if (GeneSelectList.indexOf(gene) !== -1) {
                                toastController({
                                  mes: `This gene has been selected`,
                                  timeout: 2000,
                                });
                                return;
                              }
                              setPage_now(1);
                              setGeneSelectList([...GeneSelectList, gene]);
                            }}
                          >
                            {gene}
                          </FuzzySearchItem>
                        );
                      })}
                    </ul>
                  </FuzzySearchList>
                )}
              </div>
            </div>
          </InputBox>
          {/* right: 显示已选择的 gene */}
          <SelectedLabelBox>
            {GeneSelectList.map((item) => {
              return (
                <DisSelectedLabel key={item}>
                  {item}
                  <div
                    onClick={() => {
                      if (GeneSelectList.indexOf(item) !== -1) {
                        let set = new Set(GeneSelectList);
                        set.delete(item);
                        setGeneSelectList([...set]);
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
                  max={100000}
                  onChange={(e) => {
                    setCount(Number(e.value));
                  }}
                />
              </div>
            </div>
          </CountInputBox>
          <div
            className="h-full w-8 flex justify-center items-center 
          transition-all duration-300 relative z-50 cursor-pointer"
          >
            <div className={`peer`}>
              <QuestionSvg></QuestionSvg>
            </div>

            <div
              className={`peer-hover:visible invisible absolute -top-2 rotate-45 h-2 w-2
               bg-gray-50 `}
            ></div>
            <div
              className={`peer-hover:visible invisible absolute bottom-7 left-1 h-14 w-80
               bg-gray-50 rounded-sm text-xs text-sky-800 p-1`}
            >
              <p>
                The count parameter is only displayed when there are no less
                than count pieces of relationship data between the two entities
                selected above.
              </p>
            </div>
          </div>

          <Btn
            className="transition-all duration-300"
            onClick={() => {
              setMirnaSelectList([]);
              setGeneSelectList([]);
              setCount(0);
              toastController({
                mes: "has already reset.",
                timeout: 1000,
              });
            }}
          >
            Reset
          </Btn>
          {(MirnaSelectList?.length > 0 || GeneSelectList?.length > 0) && (
            <Btn
              className={`mr-2 transition-all duration-300`}
              style={{ backgroundColor: `${hasGraph ? "#0d9488" : ""}` }}
              onClick={() => {
                setHasGraph(!hasGraph);
                console.log("hasGraph", !hasGraph);
                if (!hasGraph) {
                  setTimeout(() => {
                    scrollDom.current.scrollTo(
                      0,
                      graphDom.current.scrollHeight
                    );
                  }, 100);
                }
              }}
            >
              Graph
            </Btn>
          )}
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
            {!!downloadSource &&
              downloadSource.map((item) => {
                return (
                  <ResourceBtn
                    key={item.id}
                    selected={SourceSelect.includes(item.id) ? true : false}
                    onClick={() => {
                      if (SourceSelect.includes(item.id)) {
                        if (SourceSelect.length === 1) {
                          toastController({
                            mes: `Cannot select less than one source`,
                            timeout: 2000,
                          });
                          return;
                        }
                        const tmpList = SourceSelect.filter(
                          (e) => e !== item.id
                        );
                        setSourceSelect(tmpList);
                      } else {
                        const tmpList = [...SourceSelect, item.id];
                        setSourceSelect(tmpList);
                      }
                      setPage_now(1);
                    }}
                  >
                    {item.label}
                  </ResourceBtn>
                );
              })}

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
              step={5}
              name="rangeBar"
              id="rangeBar"
              list="volumeMarks"
              className="h-8 mx-auto w-5/6"
              onChange={() => {
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
                              {data?.[WidthConfig[key]?.name] ?? "--"}
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
                                    `https://pubmed.ncbi.nlm.nih.gov/?term=${data?.rnaName}+AND+${data?.gene}&size=200`,
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
                            {data?.[WidthConfig[key]?.name] ?? "--"}
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
        <GraphBox
          id="graph"
          ref={graphDom}
          style={{
            backgroundColor: "#eff7f4",
            height: `${hasGraph ? "75vh" : "0"}`,
          }}
        ></GraphBox>
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
              {Object.keys(FILETYPE).map((item) => {
                return (
                  <FileTypeBtn
                    style={{
                      backgroundColor: `${
                        FileTypeSelect === item ? "#0d9488" : ""
                      }`,
                      outlineStyle: `${FileTypeSelect === item ? "solid" : ""}`,
                      outlineOffset: `${FileTypeSelect === item ? "2px" : "0"}`,
                      outlineWidth: `${FileTypeSelect === item ? "3px" : "0"}`,
                    }}
                    onClick={() => {
                      setFileTypeSelect(item);
                    }}
                  >
                    {item}
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
                    mes: `Downloading...`,
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
