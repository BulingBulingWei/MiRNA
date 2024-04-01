import React, { useState, useEffect, useRef, useContext } from "react";
import { ToastContext } from "../../App";
import {
  axiosInstance as axios,
  GetDownloadStaticData,
} from "../../utils/mapPath";
import { CSSTransition } from "react-transition-group";
import download from "downloadjs";

function DownloadFiles() {
  const [showAntimation, setShowAntimation] = useState(false);
  const nodeRef = useRef(null);
  const toastController = useContext(ToastContext);
  useEffect(() => {
    setShowAntimation(true);
  }, []);

  function Dot() {
    return (
      <div className="h-2 w-2 mr-3 bg-black rounded-full inline-block"></div>
    );
  }

  const filesList = [
    {
      name: "ner-disease.csv",
      desc: "Diseases identified based on entity recognition",
    },
    {
      name: "ner-miRNA.csv",
      desc: "miRNA identified based on entity recognition",
    },
    { name: "mature.fa", desc: "Mature miRNA in Fasta format sequences" },
    { name: "hairpin.fa", desc: "miRNA hairpin in Fasta format sequences" },
    {
      name: "ncDR_data.csv",
      desc: "miRNA and drug relationship data from ncdr",
    },
    {
      name: "SM2miR3.csv",
      desc: "miRNA and drug relationship data from SM2miR3",
    },
    {
      name: "RNAlnter.csv",
      desc: "miRNA and drug relationship data from RNAlnter",
    },
    {
      name: "similarity.zip",
      desc: "Similarity of miRNA miRNA and similarity of disease disease",
    },
  ];

  const GetDownloadStaticDataAxios = async (fileName) => {
    let options = {
      url: GetDownloadStaticData(fileName),
      method: "GET",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      // 注意要确保传输的数据格式
      responseType: "blob",
    };
    try {
      const res = await axios(options);
      toastController({
        mes: "Download...",
        timeout: 1000,
      });
      let blobData = res.data;
      const blob = new Blob([blobData], {
        type: "application/octet-stream",
      });
      download(blob, `${fileName}`, "application/octet-stream");
    } catch (error) {
      console.log(error);
    }
  };

  const handleClick = (e) => {
    GetDownloadStaticDataAxios(e.target.innerHTML);
  };

  return (
    <CSSTransition
      in={showAntimation}
      timeout={300}
      nodeRef={nodeRef}
      classNames="page"
      unmountOnExit
    >
      <div className="h-full w-full">
        <div className="h-28 w-full bg-blue-800 relative">
          {/* 標題 */}
          <p className="text-3xl font-bold text-gray-50 absolute bottom-3 left-10 lg:left-20">
            Downloads
          </p>
        </div>
        <div
          className="h-fit w-full pt-2 p-10 lg:p-20 lg:pt-5 text-sm md:text-lg"
          onClick={handleClick}
        >
          {/* 下載文件的鏈接 */}
          {filesList.map((file) => {
            return (
              <div className="flex items-center text-sm md:text-lg my-2">
                <Dot></Dot>
                <div className="text-blue-700 text-lg cursor-pointer">
                  {file.name}
                </div>
                <span> - {file.desc}</span>
              </div>
            );
          })}
        </div>
      </div>
    </CSSTransition>
  );
}

export default DownloadFiles;
