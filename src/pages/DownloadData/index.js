import React, { useState, useEffect, useRef, useContext } from "react";
import { ToastContext } from "../../App";
import download from "downloadjs";
import { useNavigate, useParams, useLocation } from "react-router-dom";
//接口
import {
  GetMirnaFuzzySearchName,
  GetDiseaseFuzzySearchName,
  POSTMirnaRelationshipData,
  PostDownloadRelationshipData,
  axiosInstance as axios,
} from "../../utils/mapPath";
import styled from "styled-components";
//组件样式
import {
  FuzzySearchList,
  FuzzySearchItem,
  MirnaSelectBox,
  DisSelectBox,
  InputBox,
  SelectedLabelBox,
  MirnaSelectedLabel,
  DisSelectedLabel,
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
} from "../../StyleComponents/DownloaddataCSS";
import PageButton from "../../Component/PageButton";
import { SearchSvg, CancelSvg, LinkSvg } from "../../svg";

export default function DownloadData() {
  // const location = useLocation();
  // const params = useParams();
  // const navigate = useNavigate();
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

  //有关页数的state
  const [page_now, setPage_now] = useState(1);
  const [page_end, setPage_end] = useState(1);
  const [showDownloadWin, setShowDownloadWin] = useState(false);

  //一些input的 dom标识
  const [ResourceSelect, setResourceSelect] = useState("HMDD");
  const [FileTypeSelect, setFileTypeSelect] = useState("xlsx");
  const pageInput = useRef(null);

  //download
  useEffect(() => {
    POSTMirnaRelationshipDataAxios();
  }, [
    page_now,
    ResourceSelect,
    MirnaSelectList,
    DisSelectList,
    relevanceSelect,
    pageSizeSelect,
  ]);

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
        maxRelevance: 1, //暂时固定不变
        minRelevance: parseFloat(relevanceInput.current.value),
        pageNum: parseInt(page_now),
        pageSize: parseInt(pageSizeInput.current.value),
        resource: ResourceSelect === "HMDD" ? 1 : 0,
      },
    };
    let res = await axios(options);

    if (res.data.code === "0") {
      setRelationshipData(res.data.data.mirnaRelationDTOList);
      if (parseInt(res.data.data.total) === 0) {
        toastController({
          mes: "没有查到数据哦~",
          timeout: 1000,
        });
        return;
      }
      if (
        parseInt(res.data.data.total) % parseInt(res.data.data.pageSize) !==
        0
      ) {
        setPage_end(parseInt(res.data.data.total / res.data.data.pageSize) + 1);
      } else
        setPage_end(parseInt(res.data.data.total / res.data.data.pageSize));
    }
    //请求不成功
    else {
      toastController({
        mes: "请求失败",
        timeout: 1000,
      });
    }
  };

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
        downloadType:
          FileTypeSelect === "xlsx"
            ? 0
            : FileTypeSelect === "csv"
            ? 1
            : FileTypeSelect === "txt"
            ? 2
            : 3,
        maxRelevance: 1, //暂时固定不变
        minRelevance: parseFloat(relevanceInput.current.value),

        resource: ResourceSelect === "HMDD" ? 1 : 0,
        row: parseInt(volumnSizeInput.current.value),
      },
    };
    let res = await axios(options);

    if (res.data.code !== "555") {
      let blobData = res.data;
      const blob = new Blob([blobData], {
        type: "application/pdf;charset=utf-8",
      });
      download(blob, `data.${FileTypeSelect}`, "application/octet-stream");
    }
    //请求不成功
    else {
      toastController({
        mes: "下载失败",
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
    if (res.data.code === "0") {
      setMirnaFuzzySearchList(res.data.data);
    } else {
      toastController({
        mes: res.data.message,
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
    if (res.data.code === "0") {
      setDisFuzzySearchList(res.data.data);
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

  const handleMirnaSearchInputChange = throttle(GetMirnaFuzzySearchAxios, 1000);

  const handleDisSearchInputChange = throttle(GetDisFuzzySearchAxios, 1000);

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
      className={`h-full w-full relative flex flex-col items-center justify-between  bg-gray-50`}
    >
      {/* 选择疾病和mirna */}
      <div
        className="h-fit w-full flex flex-col justify-center items-center lg:sticky top-0 z-10"
        style={{
          backgroundColor: `#9dcdc1`,
        }}
      >
        {/* 选择mirna */}
        <MirnaSelectBox style={{ zIndex: 20 }}>
          {/*left: 搜索框 & button */}
          <InputBox>
            <div className="h-8 w-full flex justify-start items-center">
              {/* 输入框和模糊搜索选项 */}
              <div className="mr-2 font-bold z-30">MiRNA:</div>
              <div className="h-full  flex-grow relative">
                <input
                  type="text"
                  placeholder="请选择mirna"
                  className="h-full w-full rounded px-2 z-10"
                  ref={mirnaSearchInput}
                  onFocus={handleMirnaSearchInputChange}
                  onChange={handleMirnaSearchInputChange}
                  onBlur={() => {
                    setTimeout(() => {
                      setMirnaFuzzySearchList(null);
                    }, 1500);
                  }}
                />
                {MirnaFuzzySearchList !== null &&
                  MirnaFuzzySearchList !== undefined &&
                  MirnaFuzzySearchList.length > 0 && (
                    <FuzzySearchList>
                      <ul
                        className="h-fit w-full flex-shrink-0 rounded border-2 
                        text-gray-600 shadow p-0 z-30 bg-gray-50"
                      >
                        {MirnaFuzzySearchList.map((fuzzyItem) => {
                          return (
                            <FuzzySearchItem
                              key={fuzzyItem.id}
                              onClick={(event) => {
                                event.preventDefault();
                                // console.log(fuzzyItem.name);
                                if (MirnaSelectList.length === 10) {
                                  toastController({
                                    mes: `最多只能筛选10项`,
                                    timeout: 2000,
                                  });
                                  // console.log(MirnaFuzzySearchList);
                                  return;
                                }
                                if (
                                  MirnaSelectList.indexOf(fuzzyItem.name) !== -1
                                ) {
                                  toastController({
                                    mes: `该MiRNA已选择`,
                                    timeout: 2000,
                                  });
                                  return;
                                }
                                setPage_now(1);
                                setMirnaSelectList([
                                  ...MirnaSelectList,
                                  fuzzyItem.name,
                                ]);

                                setMirnaFuzzySearchList(undefined);
                              }}
                            >
                              {fuzzyItem.name}
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
        <DisSelectBox>
          {/*left: 搜索框 & button */}
          <InputBox>
            <div className="h-8 w-full flex justify-start items-center ">
              {/* 输入框和模糊搜索选项 */}
              <div className="min-w-fit ml-1 mr-2 font-bold z-30">Disease:</div>
              <div className="h-full flex-grow relative">
                <input
                  type="text"
                  placeholder="请选择Disease"
                  className="h-full w-full rounded px-2 z-0"
                  ref={disSearchInput}
                  onFocus={handleDisSearchInputChange}
                  onChange={handleDisSearchInputChange}
                  onBlur={() => {
                    setTimeout(() => {
                      setDisFuzzySearchList(null);
                    }, 1500);
                  }}
                />
                {DisFuzzySearchList !== null &&
                  DisFuzzySearchList !== undefined &&
                  DisFuzzySearchList.length > 0 && (
                    <FuzzySearchList>
                      <ul
                        className="h-fit w-full flex-shrink-0 rounded border-2 
                         text-gray-600 shadow p-0 bg-gray-50"
                      >
                        {DisFuzzySearchList.map((fuzzyItem) => {
                          return (
                            <FuzzySearchItem
                              key={fuzzyItem.id}
                              onClick={(event) => {
                                console.log(fuzzyItem.name);
                                event.preventDefault();

                                if (DisSelectList.length === 10) {
                                  toastController({
                                    mes: `最多只能筛选10项`,
                                    timeout: 2000,
                                  });
                                  return;
                                }
                                if (
                                  DisSelectList.indexOf(fuzzyItem.name) !== -1
                                ) {
                                  toastController({
                                    mes: `该Disease已选择`,
                                    timeout: 2000,
                                  });
                                  return;
                                }
                                setPage_now(1);
                                setDisSelectList([
                                  ...DisSelectList,
                                  fuzzyItem.name,
                                ]);
                                setDisFuzzySearchList(undefined);
                              }}
                            >
                              {fuzzyItem.name}
                            </FuzzySearchItem>
                          );
                        })}
                      </ul>
                    </FuzzySearchList>
                  )}
              </div>
            </div>
          </InputBox>
          {/* right: 显示已选择的 Dis */}
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
      </div>

      <div
        className="h-fit w-full flex flex-col lg:flex-row justify-center items-center
         lg:items-start lg:justify-between lg:overflow-y-scroll flex-grow bg-gray-50"
      >
        {/* 过滤器 */}
        <Filter>
          <p className="font-bold text-xl text-gray-700 mx-auto">Data Filter</p>
          <Label>Resource:</Label>
          <ResourceBtn
            style={{
              backgroundColor: `${ResourceSelect === "HMDD" ? "#b9dfd4" : ""}`,
            }}
            onClick={() => {
              setPage_now(1);
              setResourceSelect("HMDD");
            }}
          >
            HMDD
          </ResourceBtn>
          <ResourceBtn
            style={{
              backgroundColor: `${
                ResourceSelect === "Predict Model" ? "#b9dfd4" : ""
              }`,
            }}
            onClick={() => {
              setPage_now(1);
              setResourceSelect("Predict Model");
            }}
          >
            Predict Model
          </ResourceBtn>
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
            onChange={() => {
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
            onChange={() => {
              setPage_now(1);
              setPageSizeSelect(parseInt(pageSizeInput.current.value));
            }}
          />

          <datalist
            id="volumeMarks"
            className="h-8 w-5/6 flex mx-auto justify-between"
          >
            {/* <option value={10} label="10"></option> */}
            <option value={20} label="20"></option>
            {/* <option value={30} label="30"></option> */}
            <option value={40} label="40"></option>
            {/* <option value={50} label="50"></option> */}
            <option value={60} label="60"></option>
            {/* <option value={70} label="70"></option> */}
            <option value={80} label="80"></option>
            {/* <option value={90} label="90"></option> */}
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
        <div className="h-fit w-full px-3 mt-6 mb-20 lg:w-3/4 xl:4/5">
          <DataFrame>
            <DataRow
              style={{
                backgroundColor: "#cfe9ed",
                position: "sticky",
                top: "0rem",
                borderTopWidth: "1rem",
                borderTopColor: "#f9fafb",
              }}
            >
              <DataSpace style={{ width: "16%" }}>miRNA</DataSpace>
              <DataSpace style={{ width: "24%" }}>Disease</DataSpace>
              <DataSpace style={{ width: "20%" }}>Resource</DataSpace>
              <DataSpace style={{ width: "15%" }}>Pmid</DataSpace>
              <DataSpace style={{ width: "15%" }}>Relevance</DataSpace>
              <DataSpace style={{ width: "10%" }}>PubMed Link</DataSpace>
            </DataRow>
            {RelationshipData !== null &&
              RelationshipData !== undefined &&
              RelationshipData.map((data) => {
                return (
                  <DataRow>
                    <DataSpace style={{ width: "16%" }}>
                      {data.mirnaName}
                    </DataSpace>
                    <DataSpace style={{ width: "24%" }}>
                      {data.disease}
                    </DataSpace>
                    <DataSpace style={{ width: "20%" }}>
                      {data.resource}
                    </DataSpace>
                    <DataSpace style={{ width: "15%" }}>{data.pmid}</DataSpace>
                    <DataSpace style={{ width: "15%" }}>
                      {data.relevance}
                    </DataSpace>
                    <DataSpace style={{ width: "10%" }}>
                      <div
                        className="h-full w-fit px-1 flex justify-start items-center"
                        onClick={() => {
                          window.open(
                            `https://pubmed.ncbi.nlm.nih.gov/?term=${data.mirnaName}+AND+${data.disease}&size=200`,
                            "_blank"
                          );
                        }}
                      >
                        <LinkSvg></LinkSvg>
                      </div>
                    </DataSpace>
                  </DataRow>
                );
              })}
          </DataFrame>
        </div>
      </div>

      {/* DownloadWin */}
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
              <FileTypeBtn
                style={{
                  backgroundColor: `${
                    FileTypeSelect === "csv" ? "#0d9488" : ""
                  }`,
                  outlineStyle: `${FileTypeSelect === "csv" ? "solid" : ""}`,
                  outlineOffset: `${FileTypeSelect === "csv" ? "2px" : "0"}`,
                  outlineWidth: `${FileTypeSelect === "csv" ? "3px" : "0"}`,
                }}
                onClick={() => {
                  setFileTypeSelect("csv");
                }}
              >
                csv
              </FileTypeBtn>
              <FileTypeBtn
                style={{
                  backgroundColor: `${
                    FileTypeSelect === "xlsx" ? "#0d9488" : ""
                  }`,
                  outlineStyle: `${FileTypeSelect === "xlsx" ? "solid" : ""}`,
                  outlineOffset: `${FileTypeSelect === "xlsx" ? "2px" : "0"}`,
                  outlineWidth: `${FileTypeSelect === "xlsx" ? "3px" : "0"}`,
                }}
                onClick={() => {
                  setFileTypeSelect("xlsx");
                }}
              >
                xlsx
              </FileTypeBtn>
              <FileTypeBtn
                style={{
                  backgroundColor: `${
                    FileTypeSelect === "txt" ? "#0d9488" : ""
                  }`,
                  outlineStyle: `${FileTypeSelect === "txt" ? "solid" : ""}`,
                  outlineOffset: `${FileTypeSelect === "txt" ? "2px" : "0"}`,
                  outlineWidth: `${FileTypeSelect === "txt" ? "3px" : "0"}`,
                }}
                onClick={() => {
                  setFileTypeSelect("txt");
                }}
              >
                txt
              </FileTypeBtn>
              <FileTypeBtn
                style={{
                  backgroundColor: `${
                    FileTypeSelect === "json" ? "#0d9488" : ""
                  }`,
                  outlineStyle: `${FileTypeSelect === "json" ? "solid" : ""}`,
                  outlineOffset: `${FileTypeSelect === "json" ? "2px" : "0"}`,
                  outlineWidth: `${FileTypeSelect === "json" ? "3px" : "0"}`,
                }}
                onClick={() => {
                  setFileTypeSelect("json");
                }}
              >
                json
              </FileTypeBtn>
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
                    mes: `正在下载，请耐心等待`,
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
      </Footer>
    </div>
  );
}
