import React, { useState, useEffect, useRef, useContext } from "react";
import { ToastContext } from "../../App";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import axios from "axios";
import { Svg1 } from "../../svg";

const PaperBox = styled.div`
  height: fit-content;
  width: 98%;
  margin-left: 0.1rem;
  flex-shrink: 0;
  background-color: rgba(255, 255, 255, 0.9);
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
  const toastController = useContext(ToastContext);
  const [showLeft, setShowLeft] = useState(true);
  const [showRight, setShowRight] = useState(true);
  const [paperSelectedId, setPaperSelectedId] = useState(3);
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
  ]);

  return (
    <div className="h-fit w-full bg-blue-5 relative md:h-full ">
      {/* 搜索框+关系图+图例 */}
      <div
        className="h-96 w-full flex justify-center items-center bg-blue-50 shadow-inner
        md:h-full"
      >
        Graph
      </div>

      {/* 相关论文选项列表 */}
      <div
        className={`h-fit w-full
        transition-all duration-1000 shadow-2xl
        ${showLeft === true ? "md:w-60 lg:w-72 xl:w-80 2xl:w-96 " : "md:w-0"}
        md:absolute md:top-0 md:left-0 md:h-full md:min-h-0`}
      >
        {/* 点击向左回缩按钮 */}
        <div
          className="h-0 w-5 bg-gray-100 flex justify-center items-center
         md:h-12 md:absolute md:top-20 md:-right-5 md:rounded-r  shadow-lg"
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
        {/* 论文方块滚动面板 container */}
        <div
          className="h-full w-full bg-gray-50 flex flex-col justify-start items-center py-2
          md:overflow-y-scroll shadow-lg"
        >
          {paperList !== undefined &&
            paperList.map((item) => {
              return (
                <PaperBox>
                  <p
                    className="inline-block w-full text-gray-600 
                   font-semibold truncate"
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
        </div>
      </div>

      {/* 论文详情 */}
      {paperList !== undefined &&
        paperList !== null &&
        paperSelectedId !== undefined &&
        paperList.map((item) => {
          if (item.id === paperSelectedId) {
            return (
              <div
                className={`h-0 w-full 
                transition-all duration-1000 
                ${
                  showRight === true
                    ? "md:w-60 lg:w-80 xl:w-85 2xl:w-100 "
                    : "md:w-0"
                }
                md:absolute md:top-0 md:right-0 md:h-full md:min-h-0`}
              >
                {/* 点击向右回缩按钮 */}
                <div
                  className="h-0 w-5 bg-gray-100 flex justify-center items-center shadow-lg
                md:h-12 md:absolute md:top-40 md:-left-5 md:rounded-l"
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
                  className="h-full w-full bg-gray-50  pl-3 py-3  shadow-lg
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
