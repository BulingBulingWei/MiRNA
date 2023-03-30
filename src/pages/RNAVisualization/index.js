import React, { useState, useEffect, useRef, useContext } from "react";
import { ToastContext } from "../../App";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import axios from "axios";
import * as echarts from "echarts/core";
import download from "downloadjs";
import bgimg from "../../img/img13.jpg";
import { SearchSvg, DownloadSvg } from "../../svg";
import {
  GetMirnaFuzzySearchName,
  GetRelationShipByMiRNA,
  GetCalculateByMiRNA,
} from "../../utils/mapPath";
import mirnaName from "../../data/mirnaName";
import { TooltipComponent, LegendComponent } from "echarts/components";
import { GraphChart } from "echarts/charts";
import { LabelLayout } from "echarts/features";
import { CanvasRenderer } from "echarts/renderers";
echarts.use([
  TooltipComponent,
  LegendComponent,
  GraphChart,
  CanvasRenderer,
  LabelLayout,
]);

export default function RNAVisualization() {
  const navigate = useNavigate();
  const params = useParams();
  const location = useLocation();
  const mirnaSelectList = mirnaName();

  const searchInput = useRef(null);
  const scrollBox = useRef(null);
  const graphDom = useRef(null);
  const toastController = useContext(ToastContext);
  const [fuzzySearchList, setFuzzySearchList] = useState([]);

  const itd = {
    name: "hsa-mir-24-1",
    sequence: "AUCCUGACUAAUGCAUCAGCAAUCUUAUCGAUGCUAGCUAUAGCGGCUA",
  };
  const [introduction, setIntroduction] = useState(itd);

  const data = {
    seq1: "-  uaa    -       ag        uc  u      -u     u      --     cg",
    seq2: " gc   agcu gcgucgu  gugaguaa  ag uguggg  ggcuu ucgaag  ucuca  ",
    seq3: " ||   |||| |||||||  ||||||||  || ||||||  ||||| ||||||  |||||  ",
    seq4: " cg   uuga ugcggcg  CACUUCUU  UC AVAVUC  ccgaa ggcuuc  agagu  ",
    seq5: "g  ---    g       GA        UC  U      Uc     a      ag     -c",
  };
  const [rnaSequenceData, setRnaSequenceData] = useState(data);

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

  const paintSequence = (seq) => {
    let len = seq.length;
    let list = [];
    for (let i = 0; i < len; ++i) {
      if (seq[i] === " ") {
        list.push(
          <div className=" w-5 h-5 xl:w-6 xl:h-6 2xl:w-8 2xl:h-8 "></div>
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
            <div className={`h-10 lg:h-14 xl:h-18 2xl:20 w-5 xl:w-6 2xl:w-8`}>
              <div className="h-full w-1 mx-auto bg-slate-600 rounded-full"></div>
            </div>
          );
        } else {
          list.push(
            <div
              className={` w-5 h-5 xl:w-6 xl:h-6 2xl:w-8 2xl:h-8 ${color} rounded-full 
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
        className="h-96 w-full md:h-2/5  flex justify-center items-center cursor-default 
      select-none bg-gray-100"
      >
        {rnaSequenceData !== null ? (
          // mirna序列可视化
          <div
            className="h-full min-w-full w-fit px-2 py-6 md:px-10 
          flex flex-col justify-around items-start overflow-x-scroll overflow-y-hidden"
            ref={scrollBox}
            onWheel={(event) => {
              event.preventDefault();
              scrollBox.current.scrollLeft += event.deltaY;
            }}
          >
            <div className="h-fit w-fit flex gap-1 justify-start items-center bg-blue-5">
              {paintSequence(rnaSequenceData.seq1)}
            </div>
            <div className="h-fit w-fit flex gap-1 justify-start items-center bg-blue-5">
              {paintSequence(rnaSequenceData.seq2)}
            </div>
            <div className="h-fit w-fit flex gap-1 justify-start items-center bg-blue-5">
              {paintSequence(rnaSequenceData.seq3)}
            </div>
            <div className="h-fit w-fit flex gap-1 justify-start items-center bg-blue-5">
              {paintSequence(rnaSequenceData.seq4)}
            </div>
            <div className="h-fit w-fit flex gap-1 justify-start items-center bg-blue-5">
              {paintSequence(rnaSequenceData.seq5)}
            </div>
          </div>
        ) : (
          <p className="text-2xl font-bold text-gray-300">
            {"搜索查看 Mi-RNA 序列可视化图表"}
          </p>
        )}
      </div>
      {/* （下方）的 mirna和基因可视化图和搜索框 */}
      <div className="md:h-3/5 flex-grow w-full flex flex-col lg:flex-row justify-center items-center overflow-y-scroll ">
        {/* (下左方)搜索框以及选择列表 */}
        <div className="h-full w-full lg:w-1/5 overflow-y-scroll border-r-4 border-red-700 bg-gray-50 bg-opacity-50">
          {/* input */}
          <div
            className="h-12 py-2 px-2 w-full sticky top-0 flex justify-start
           items-center bg-red-200"
          >
            <div className="h-full w-5/6">
              <input
                type="text"
                className="h-full w-full rounded px-2"
                ref={searchInput}
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
            <div className="h-full flex-grow ml-2 flex justify-center items-center bg-gray-50 rounded">
              <SearchSvg></SearchSvg>
            </div>
          </div>
          {mirnaSelectList !== null &&
            mirnaSelectList !== undefined &&
            mirnaSelectList.map((item) => {
              return (
                <div className="h-7 w-full px-2  bg-gray-50 bg-opacity-90 text-gray-700 hover:bg-gray-100">
                  {item.mirnaName}
                </div>
              );
            })}
        </div>

        {/* （下右方） Mi-RNA和基因可视化图 */}
        <div className="h-full w-full lg:w-4/5 flex flex-col justify-center items-center bg-blue-50 bg-opacity-95">
          <div className="h-fit w-full px-3 md:px-5 lg:px-6  py-2 font-bold text-gray-800">
            {"hsa-mir-24-1"}
          </div>
          <div className="min-h-fit w-full flex-grow flex justify-center items-center bg-red-50"></div>
        </div>
      </div>
    </div>
  );
}
