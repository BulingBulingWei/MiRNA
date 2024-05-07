import React, { useState, useEffect, useRef, useContext } from "react";
import { ToastContext } from "../../App";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import {
  imageBedBaseUrl,
  GetGeneFuzzyName,
  GetGeneInfo,
  axiosInstance as axios,
} from "../../utils/mapPath";
import {
  InfoValue,
  InfoLabel,
  InfoListframe,
  InfoItem,
} from "../../StyleComponents/MirnaStructPageCSS";
import { useDebounce } from "../../utils/tools";
import { SearchSvg } from "../../svg";

export default function GeneInfo() {
  const location = useLocation();
  const params = useParams();
  const searchInput = useRef(null);
  const navigate = useNavigate();
  const toastController = useContext(ToastContext);
  const [fuzzySearchList, setFuzzySearchList] = useState([]);
  const [geneAllMessage, setGeneAllMessage] = useState(undefined);

  useEffect(() => {
    GetGeneAllMessageAxios();
  }, [location]);

  const GetGeneAllMessageAxios = async () => {
    let options = {
      url: GetGeneInfo,
      method: "GET",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      params: {
        geneName: params.geneName,
      },
    };
    let res = await axios(options);
    if (res?.data?.code === "0") {
      console.log("GetGeneInfo", res?.data?.data);
      setGeneAllMessage(res?.data?.data?.geneInfo);
    } else {
      toastController({
        mes: "request failure",
        timeout: 1000,
      });
    }
  };

  const GetGeneFuzzy = async (geneName) => {
    let options = {
      url: GetGeneFuzzyName,
      method: "GET",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      params: {
        geneName: geneName,
      },
    };

    let res = await axios(options);
    if (res.data.code === "0") {
      console.log("GetGeneFuzzyName", res.data.data);
      setFuzzySearchList(res.data.data);
    } else {
      toastController({
        mes: res.data.message,
        timeout: 1000,
      });
    }
  };

  const handleSearchInputChange = useDebounce(GetGeneFuzzy, 1000);

  const handleInputEnter = (event) => {
    if (searchInput.current.value === "") return;
    if (event.keyCode === 13) {
      navigate(`/GeneInfo/${searchInput.current.value}`);
    }
  };

  return (
    <div className={`h-full w-full bg-gray-50 overflow-y-scroll`}>
      {/* 纵向flex布局 */}
      <div className="h-fit w-full flex flex-col items-center justify-center pb-8 ">
        {/* 标题（gene名字）和搜索框 */}
        <div
          className="h-44 w-full flex flex-col md:flex-row justify-start items-center  "
          style={{
            backgroundColor: `#b5bfde`,
          }}
        >
          {/* 搜索框 */}
          <div className="h-1/2 w-full md:h-full md:w-1/2 pl-5 flex justify-center items-center">
            {/* 头部input */}
            <div
              className="h-14 py-2 px-2 w-2/3 flex justify-start
           items-center "
            >
              {/* 输入框和模糊搜索选项 */}
              <div className="h-full w-5/6 relative">
                <input
                  type="text"
                  placeholder={params.geneName}
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
                {!!fuzzySearchList && fuzzySearchList.length > 0 && (
                  <div
                    className="h-fit w-full max-h-72 absolute top-10 rounded border-2
                border-purple-300 overflow-y-scroll bg-gray-50"
                  >
                    <ul
                      className="h-fit w-full flex-shrink-0 rounded border-2 border-purple-300
                text-gray-600 shadow p-0"
                    >
                      {fuzzySearchList.map((fuzzyItem) => {
                        return (
                          <li
                            key={fuzzyItem}
                            className="h-fit w-full z-50 flex px-2 justify-start items-center hover:bg-gray-100
                               border-b-2 border-gray-300 cursor-pointer"
                            onClick={() => {
                              searchInput.current.value = fuzzyItem;
                              setFuzzySearchList(undefined);
                            }}
                          >
                            {fuzzyItem}
                          </li>
                        );
                      })}
                    </ul>
                  </div>
                )}
              </div>
              <div
                className="h-full flex-grow ml-2 flex justify-center items-center bg-blue-800 rounded"
                onClick={() => {
                  if (searchInput.current.value === "") return;
                  navigate(`/GeneInfo/${searchInput.current.value}`);
                }}
              >
                <SearchSvg></SearchSvg>
              </div>
            </div>
          </div>
          {/* title */}
          <div className="h-1/3 w-full md:h-full md:w-1/2 flex justify-center items-center md:justify-start ">
            <p className="text-3xl font-bold text-blue-800 ">
              {params.geneName}
            </p>
          </div>
        </div>

        {/* 详细信息和数据可视化图 */}
        {!!geneAllMessage ? (
          <div className="w-full h-fit my-5 flex flex-col justify-start items-center">
            <div className="h-fit w-11/12 p-3  text-2xl font-bold text-blue-900">
              Basic information of {params.drugName}
            </div>
            <div
              className="h-fit w-11/12 flex flex-col md:flex-row justify-between items-start
             p-2 mx-16 border-2 border-gray-300"
            >
              <InfoListframe>
                {!!geneAllMessage?.imgUrl && (
                  <InfoItem>
                    <InfoLabel width="30%">image</InfoLabel>
                    <InfoValue width="70%">
                      <div className="h-fit w-fit">
                        <a
                          href={`${imageBedBaseUrl}/drug/${geneAllMessage?.imgUrl}`}
                          title="Click to view image details"
                          target="_blank"
                          rel="noreferrer"
                        >
                          <img
                            src={`${imageBedBaseUrl}/drug/${geneAllMessage?.imgUrl}`}
                            alt="img"
                            className="w-60 h-fit "
                          />
                        </a>
                      </div>
                    </InfoValue>
                  </InfoItem>
                )}
                {!!geneAllMessage &&
                  Object.keys(geneAllMessage).map((key, index) => {
                    if (key === "imgUrl") return <></>;
                    return (
                      <InfoItem key={index}>
                        <InfoLabel width="30%">{key}</InfoLabel>
                        <InfoValue width="70%">{geneAllMessage[key]}</InfoValue>
                      </InfoItem>
                    );
                  })}
              </InfoListframe>
            </div>
          </div>
        ) : (
          <div className="w-full h-fit my-5 flex flex-col items-center">
            <div className="h-fit w-11/12 p-3 text-2xl font-bold text-blue-900">
              Basic information
            </div>
            <div
              className="h-fit w-11/12 py-20 flex justify-center items-center border-2 border-gray-300
            text-5xl font-bold text-gray-500"
            >
              No data found
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
