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
  const toastController = useContext(ToastContext);
  const { showGraph, setShowGraph } = useContext(GraphContext);
  const searchInput = useRef(null);
  const [searchType, setSearchType] = useState("mi-RNA");

  const [graph, setGraph] = useState("");
  const [startYear, setStartYear] = useState("1900");
  const [endYear, setEndYear] = useState("2023");

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
  const [graphData, setGraphData] = useState({
    nodes: [
      {
        id: "0",
        name: "Myriel",
        symbolSize: 19.12381,
        x: -266.82776,
        y: 299.6904,
        value: 28.685715,
        category: 0,
      },
      {
        id: "1",
        name: "Napoleon",
        symbolSize: 2.6666666666666665,
        x: -418.08344,
        y: 446.8853,
        value: 4,
        category: 0,
      },
      {
        id: "2",
        name: "MlleBaptistine",
        symbolSize: 6.323809333333333,
        x: -212.76357,
        y: 245.29176,
        value: 9.485714,
        category: 1,
      },
      {
        id: "3",
        name: "MmeMagloire",
        symbolSize: 6.323809333333333,
        x: -242.82404,
        y: 235.26283,
        value: 9.485714,
        category: 1,
      },
      {
        id: "4",
        name: "CountessDeLo",
        symbolSize: 2.6666666666666665,
        x: -379.30386,
        y: 429.06424,
        value: 4,
        category: 0,
      },
      {
        id: "5",
        name: "Geborand",
        symbolSize: 2.6666666666666665,
        x: -417.26337,
        y: 406.03506,
        value: 4,
        category: 0,
      },
      {
        id: "6",
        name: "Champtercier",
        symbolSize: 2.6666666666666665,
        x: -332.6012,
        y: 485.16974,
        value: 4,
        category: 0,
      },
      {
        id: "7",
        name: "Cravatte",
        symbolSize: 2.6666666666666665,
        x: -382.69568,
        y: 475.09113,
        value: 4,
        category: 0,
      },
      {
        id: "8",
        name: "Count",
        symbolSize: 2.6666666666666665,
        x: -320.384,
        y: 387.17325,
        value: 4,
        category: 0,
      },
      {
        id: "9",
        name: "OldMan",
        symbolSize: 2.6666666666666665,
        x: -344.39832,
        y: 451.16772,
        value: 4,
        category: 0,
      },
      {
        id: "10",
        name: "Labarre",
        symbolSize: 2.6666666666666665,
        x: -89.34107,
        y: 234.56128,
        value: 4,
        category: 1,
      },
      {
        id: "11",
        name: "Valjean",
        symbolSize: 66.66666666666667,
        x: -87.93029,
        y: -6.8120565,
        value: 100,
        category: 1,
      },
      {
        id: "12",
        name: "Marguerite",
        symbolSize: 4.495239333333333,
        x: -339.77908,
        y: -184.69139,
        value: 6.742859,
        category: 1,
      },
      {
        id: "13",
        name: "MmeDeR",
        symbolSize: 2.6666666666666665,
        x: -194.31313,
        y: 178.55301,
        value: 4,
        category: 1,
      },
      {
        id: "14",
        name: "Isabeau",
        symbolSize: 2.6666666666666665,
        x: -158.05168,
        y: 201.99768,
        value: 4,
        category: 1,
      },
      {
        id: "15",
        name: "Gervais",
        symbolSize: 2.6666666666666665,
        x: -127.701546,
        y: 242.55057,
        value: 4,
        category: 1,
      },
      {
        id: "16",
        name: "Tholomyes",
        symbolSize: 17.295237333333333,
        x: -385.2226,
        y: -393.5572,
        value: 25.942856,
        category: 2,
      },
      {
        id: "17",
        name: "Listolier",
        symbolSize: 13.638097333333334,
        x: -516.55884,
        y: -393.98975,
        value: 20.457146,
        category: 2,
      },
      {
        id: "18",
        name: "Fameuil",
        symbolSize: 13.638097333333334,
        x: -464.79382,
        y: -493.57944,
        value: 20.457146,
        category: 2,
      },
      {
        id: "19",
        name: "Blacheville",
        symbolSize: 13.638097333333334,
        x: -515.1624,
        y: -456.9891,
        value: 20.457146,
        category: 2,
      },
      {
        id: "20",
        name: "Favourite",
        symbolSize: 13.638097333333334,
        x: -408.12122,
        y: -464.5048,
        value: 20.457146,
        category: 2,
      },
      {
        id: "21",
        name: "Dahlia",
        symbolSize: 13.638097333333334,
        x: -456.44113,
        y: -425.13303,
        value: 20.457146,
        category: 2,
      },
      {
        id: "22",
        name: "Zephine",
        symbolSize: 13.638097333333334,
        x: -459.1107,
        y: -362.5133,
        value: 20.457146,
        category: 2,
      },
      {
        id: "23",
        name: "Fantine",
        symbolSize: 28.266666666666666,
        x: -313.42786,
        y: -289.44803,
        value: 42.4,
        category: 2,
      },
      {
        id: "24",
        name: "MmeThenardier",
        symbolSize: 20.95238266666667,
        x: 4.6313396,
        y: -273.8517,
        value: 31.428574,
        category: 7,
      },
      {
        id: "25",
        name: "Thenardier",
        symbolSize: 30.095235333333335,
        x: 82.80825,
        y: -203.1144,
        value: 45.142853,
        category: 7,
      },
      {
        id: "26",
        name: "Cosette",
        symbolSize: 20.95238266666667,
        x: 78.64646,
        y: -31.512747,
        value: 31.428574,
        category: 6,
      },
      {
        id: "27",
        name: "Javert",
        symbolSize: 31.923806666666668,
        x: -81.46074,
        y: -204.20204,
        value: 47.88571,
        category: 7,
      },
      {
        id: "28",
        name: "Fauchelevent",
        symbolSize: 8.152382000000001,
        x: -225.73984,
        y: 82.41631,
        value: 12.228573,
        category: 4,
      },
      {
        id: "29",
        name: "Bamatabois",
        symbolSize: 15.466666666666667,
        x: -385.6842,
        y: -20.206686,
        value: 23.2,
        category: 3,
      },
      {
        id: "30",
        name: "Perpetue",
        symbolSize: 4.495239333333333,
        x: -403.92447,
        y: -197.69823,
        value: 6.742859,
        category: 2,
      },
      {
        id: "31",
        name: "Simplice",
        symbolSize: 8.152382000000001,
        x: -281.4253,
        y: -158.45137,
        value: 12.228573,
        category: 2,
      },
      {
        id: "32",
        name: "Scaufflaire",
        symbolSize: 2.6666666666666665,
        x: -122.41348,
        y: 210.37503,
        value: 4,
        category: 1,
      },
      {
        id: "33",
        name: "Woman1",
        symbolSize: 4.495239333333333,
        x: -234.6001,
        y: -113.15067,
        value: 6.742859,
        category: 1,
      },
      {
        id: "34",
        name: "Judge",
        symbolSize: 11.809524666666666,
        x: -387.84915,
        y: 58.7059,
        value: 17.714287,
        category: 3,
      },
      {
        id: "35",
        name: "Champmathieu",
        symbolSize: 11.809524666666666,
        x: -338.2307,
        y: 87.48405,
        value: 17.714287,
        category: 3,
      },
      {
        id: "36",
        name: "Brevet",
        symbolSize: 11.809524666666666,
        x: -453.26874,
        y: 58.94648,
        value: 17.714287,
        category: 3,
      },
      {
        id: "37",
        name: "Chenildieu",
        symbolSize: 11.809524666666666,
        x: -386.44904,
        y: 140.05937,
        value: 17.714287,
        category: 3,
      },
      {
        id: "38",
        name: "Cochepaille",
        symbolSize: 11.809524666666666,
        x: -446.7876,
        y: 123.38005,
        value: 17.714287,
        category: 3,
      },
      {
        id: "39",
        name: "Pontmercy",
        symbolSize: 6.323809333333333,
        x: 336.49738,
        y: -269.55914,
        value: 9.485714,
        category: 6,
      },
      {
        id: "40",
        name: "Boulatruelle",
        symbolSize: 2.6666666666666665,
        x: 29.187843,
        y: -460.13132,
        value: 4,
        category: 7,
      },
      {
        id: "41",
        name: "Eponine",
        symbolSize: 20.95238266666667,
        x: 238.36697,
        y: -210.00926,
        value: 31.428574,
        category: 7,
      },
      {
        id: "42",
        name: "Anzelma",
        symbolSize: 6.323809333333333,
        x: 189.69513,
        y: -346.50662,
        value: 9.485714,
        category: 7,
      },
      {
        id: "43",
        name: "Woman2",
        symbolSize: 6.323809333333333,
        x: -187.00418,
        y: -145.02663,
        value: 9.485714,
        category: 6,
      },
      {
        id: "44",
        name: "MotherInnocent",
        symbolSize: 4.495239333333333,
        x: -252.99521,
        y: 129.87549,
        value: 6.742859,
        category: 4,
      },
      {
        id: "45",
        name: "Gribier",
        symbolSize: 2.6666666666666665,
        x: -296.07935,
        y: 163.11964,
        value: 4,
        category: 4,
      },
      {
        id: "46",
        name: "Jondrette",
        symbolSize: 2.6666666666666665,
        x: 550.3201,
        y: 522.4031,
        value: 4,
        category: 5,
      },
      {
        id: "47",
        name: "MmeBurgon",
        symbolSize: 4.495239333333333,
        x: 488.13535,
        y: 356.8573,
        value: 6.742859,
        category: 5,
      },
      {
        id: "48",
        name: "Gavroche",
        symbolSize: 41.06667066666667,
        x: 387.89572,
        y: 110.462326,
        value: 61.600006,
        category: 8,
      },
      {
        id: "49",
        name: "Gillenormand",
        symbolSize: 13.638097333333334,
        x: 126.4831,
        y: 68.10622,
        value: 20.457146,
        category: 6,
      },
      {
        id: "50",
        name: "Magnon",
        symbolSize: 4.495239333333333,
        x: 127.07365,
        y: -113.05923,
        value: 6.742859,
        category: 6,
      },
      {
        id: "51",
        name: "MlleGillenormand",
        symbolSize: 13.638097333333334,
        x: 162.63559,
        y: 117.6565,
        value: 20.457146,
        category: 6,
      },
      {
        id: "52",
        name: "MmePontmercy",
        symbolSize: 4.495239333333333,
        x: 353.66415,
        y: -205.89165,
        value: 6.742859,
        category: 6,
      },
      {
        id: "53",
        name: "MlleVaubois",
        symbolSize: 2.6666666666666665,
        x: 165.43939,
        y: 339.7736,
        value: 4,
        category: 6,
      },
      {
        id: "54",
        name: "LtGillenormand",
        symbolSize: 8.152382000000001,
        x: 137.69348,
        y: 196.1069,
        value: 12.228573,
        category: 6,
      },
      {
        id: "55",
        name: "Marius",
        symbolSize: 35.58095333333333,
        x: 206.44687,
        y: -13.805411,
        value: 53.37143,
        category: 6,
      },
      {
        id: "56",
        name: "BaronessT",
        symbolSize: 4.495239333333333,
        x: 194.82993,
        y: 224.78036,
        value: 6.742859,
        category: 6,
      },
      {
        id: "57",
        name: "Mabeuf",
        symbolSize: 20.95238266666667,
        x: 597.6618,
        y: 135.18481,
        value: 31.428574,
        category: 8,
      },
      {
        id: "58",
        name: "Enjolras",
        symbolSize: 28.266666666666666,
        x: 355.78366,
        y: -74.882454,
        value: 42.4,
        category: 8,
      },
      {
        id: "59",
        name: "Combeferre",
        symbolSize: 20.95238266666667,
        x: 515.2961,
        y: -46.167564,
        value: 31.428574,
        category: 8,
      },
      {
        id: "60",
        name: "Prouvaire",
        symbolSize: 17.295237333333333,
        x: 614.29285,
        y: -69.3104,
        value: 25.942856,
        category: 8,
      },
      {
        id: "61",
        name: "Feuilly",
        symbolSize: 20.95238266666667,
        x: 550.1917,
        y: -128.17537,
        value: 31.428574,
        category: 8,
      },
      {
        id: "62",
        name: "Courfeyrac",
        symbolSize: 24.609526666666667,
        x: 436.17184,
        y: -12.7286825,
        value: 36.91429,
        category: 8,
      },
      {
        id: "63",
        name: "Bahorel",
        symbolSize: 22.780953333333333,
        x: 602.55225,
        y: 16.421427,
        value: 34.17143,
        category: 8,
      },
      {
        id: "64",
        name: "Bossuet",
        symbolSize: 24.609526666666667,
        x: 455.81955,
        y: -115.45826,
        value: 36.91429,
        category: 8,
      },
      {
        id: "65",
        name: "Joly",
        symbolSize: 22.780953333333333,
        x: 516.40784,
        y: 47.242233,
        value: 34.17143,
        category: 8,
      },
      {
        id: "66",
        name: "Grantaire",
        symbolSize: 19.12381,
        x: 646.4313,
        y: -151.06331,
        value: 28.685715,
        category: 8,
      },
      {
        id: "67",
        name: "MotherPlutarch",
        symbolSize: 2.6666666666666665,
        x: 668.9568,
        y: 204.65488,
        value: 4,
        category: 8,
      },
      {
        id: "68",
        name: "Gueulemer",
        symbolSize: 19.12381,
        x: 78.4799,
        y: -347.15146,
        value: 28.685715,
        category: 7,
      },
      {
        id: "69",
        name: "Babet",
        symbolSize: 19.12381,
        x: 150.35959,
        y: -298.50797,
        value: 28.685715,
        category: 7,
      },
      {
        id: "70",
        name: "Claquesous",
        symbolSize: 19.12381,
        x: 137.3717,
        y: -410.2809,
        value: 28.685715,
        category: 7,
      },
      {
        id: "71",
        name: "Montparnasse",
        symbolSize: 17.295237333333333,
        x: 234.87747,
        y: -400.85983,
        value: 25.942856,
        category: 7,
      },
      {
        id: "72",
        name: "Toussaint",
        symbolSize: 6.323809333333333,
        x: 40.942253,
        y: 113.78272,
        value: 9.485714,
        category: 1,
      },
      {
        id: "73",
        name: "Child1",
        symbolSize: 4.495239333333333,
        x: 437.939,
        y: 291.58234,
        value: 6.742859,
        category: 8,
      },
      {
        id: "74",
        name: "Child2",
        symbolSize: 4.495239333333333,
        x: 466.04922,
        y: 283.3606,
        value: 6.742859,
        category: 8,
      },
      {
        id: "75",
        name: "Brujon",
        symbolSize: 13.638097333333334,
        x: 238.79364,
        y: -314.06345,
        value: 20.457146,
        category: 7,
      },
      {
        id: "76",
        name: "MmeHucheloup",
        symbolSize: 13.638097333333334,
        x: 712.18353,
        y: 4.8131495,
        value: 20.457146,
        category: 8,
      },
    ],
    links: [
      {
        source: "1",
        target: "0",
      },
      {
        source: "2",
        target: "0",
      },
      {
        source: "3",
        target: "0",
      },
      {
        source: "3",
        target: "2",
      },
      {
        source: "4",
        target: "0",
      },
      {
        source: "5",
        target: "0",
      },
      {
        source: "6",
        target: "0",
      },
      {
        source: "7",
        target: "0",
      },
      {
        source: "8",
        target: "0",
      },
      {
        source: "9",
        target: "0",
      },
      {
        source: "11",
        target: "0",
      },
      {
        source: "11",
        target: "2",
      },
      {
        source: "11",
        target: "3",
      },
      {
        source: "11",
        target: "10",
      },
      {
        source: "12",
        target: "11",
      },
      {
        source: "13",
        target: "11",
      },
      {
        source: "14",
        target: "11",
      },
      {
        source: "15",
        target: "11",
      },
      {
        source: "17",
        target: "16",
      },
      {
        source: "18",
        target: "16",
      },
      {
        source: "18",
        target: "17",
      },
      {
        source: "19",
        target: "16",
      },
      {
        source: "19",
        target: "17",
      },
      {
        source: "19",
        target: "18",
      },
      {
        source: "20",
        target: "16",
      },
      {
        source: "20",
        target: "17",
      },
      {
        source: "20",
        target: "18",
      },
      {
        source: "20",
        target: "19",
      },
      {
        source: "21",
        target: "16",
      },
      {
        source: "21",
        target: "17",
      },
      {
        source: "21",
        target: "18",
      },
      {
        source: "21",
        target: "19",
      },
      {
        source: "21",
        target: "20",
      },
      {
        source: "22",
        target: "16",
      },
      {
        source: "22",
        target: "17",
      },
      {
        source: "22",
        target: "18",
      },
      {
        source: "22",
        target: "19",
      },
      {
        source: "22",
        target: "20",
      },
      {
        source: "22",
        target: "21",
      },
      {
        source: "23",
        target: "11",
      },
      {
        source: "23",
        target: "12",
      },
      {
        source: "23",
        target: "16",
      },
      {
        source: "23",
        target: "17",
      },
      {
        source: "23",
        target: "18",
      },
      {
        source: "23",
        target: "19",
      },
      {
        source: "23",
        target: "20",
      },
      {
        source: "23",
        target: "21",
      },
      {
        source: "23",
        target: "22",
      },
      {
        source: "24",
        target: "11",
      },
      {
        source: "24",
        target: "23",
      },
      {
        source: "25",
        target: "11",
      },
      {
        source: "25",
        target: "23",
      },
      {
        source: "25",
        target: "24",
      },
      {
        source: "26",
        target: "11",
      },
      {
        source: "26",
        target: "16",
      },
      {
        source: "26",
        target: "24",
      },
      {
        source: "26",
        target: "25",
      },
      {
        source: "27",
        target: "11",
      },
      {
        source: "27",
        target: "23",
      },
      {
        source: "27",
        target: "24",
      },
      {
        source: "27",
        target: "25",
      },
      {
        source: "27",
        target: "26",
      },
      {
        source: "28",
        target: "11",
      },
      {
        source: "28",
        target: "27",
      },
      {
        source: "29",
        target: "11",
      },
      {
        source: "29",
        target: "23",
      },
      {
        source: "29",
        target: "27",
      },
      {
        source: "30",
        target: "23",
      },
      {
        source: "31",
        target: "11",
      },
      {
        source: "31",
        target: "23",
      },
      {
        source: "31",
        target: "27",
      },
      {
        source: "31",
        target: "30",
      },
      {
        source: "32",
        target: "11",
      },
      {
        source: "33",
        target: "11",
      },
      {
        source: "33",
        target: "27",
      },
      {
        source: "34",
        target: "11",
      },
      {
        source: "34",
        target: "29",
      },
      {
        source: "35",
        target: "11",
      },
      {
        source: "35",
        target: "29",
      },
      {
        source: "35",
        target: "34",
      },
      {
        source: "36",
        target: "11",
      },
      {
        source: "36",
        target: "29",
      },
      {
        source: "36",
        target: "34",
      },
      {
        source: "36",
        target: "35",
      },
      {
        source: "37",
        target: "11",
      },
      {
        source: "37",
        target: "29",
      },
      {
        source: "37",
        target: "34",
      },
      {
        source: "37",
        target: "35",
      },
      {
        source: "37",
        target: "36",
      },
      {
        source: "38",
        target: "11",
      },
      {
        source: "38",
        target: "29",
      },
      {
        source: "38",
        target: "34",
      },
      {
        source: "38",
        target: "35",
      },
      {
        source: "38",
        target: "36",
      },
      {
        source: "38",
        target: "37",
      },
      {
        source: "39",
        target: "25",
      },
      {
        source: "40",
        target: "25",
      },
      {
        source: "41",
        target: "24",
      },
      {
        source: "41",
        target: "25",
      },
      {
        source: "42",
        target: "24",
      },
      {
        source: "42",
        target: "25",
      },
      {
        source: "42",
        target: "41",
      },
      {
        source: "43",
        target: "11",
      },
      {
        source: "43",
        target: "26",
      },
      {
        source: "43",
        target: "27",
      },
      {
        source: "44",
        target: "11",
      },
      {
        source: "44",
        target: "28",
      },
      {
        source: "45",
        target: "28",
      },
      {
        source: "47",
        target: "46",
      },
      {
        source: "48",
        target: "11",
      },
      {
        source: "48",
        target: "25",
      },
      {
        source: "48",
        target: "27",
      },
      {
        source: "48",
        target: "47",
      },
      {
        source: "49",
        target: "11",
      },
      {
        source: "49",
        target: "26",
      },
      {
        source: "50",
        target: "24",
      },
      {
        source: "50",
        target: "49",
      },
      {
        source: "51",
        target: "11",
      },
      {
        source: "51",
        target: "26",
      },
      {
        source: "51",
        target: "49",
      },
      {
        source: "52",
        target: "39",
      },
      {
        source: "52",
        target: "51",
      },
      {
        source: "53",
        target: "51",
      },
      {
        source: "54",
        target: "26",
      },
      {
        source: "54",
        target: "49",
      },
      {
        source: "54",
        target: "51",
      },
      {
        source: "55",
        target: "11",
      },
      {
        source: "55",
        target: "16",
      },
      {
        source: "55",
        target: "25",
      },
      {
        source: "55",
        target: "26",
      },
      {
        source: "55",
        target: "39",
      },
      {
        source: "55",
        target: "41",
      },
      {
        source: "55",
        target: "48",
      },
      {
        source: "55",
        target: "49",
      },
      {
        source: "55",
        target: "51",
      },
      {
        source: "55",
        target: "54",
      },
      {
        source: "56",
        target: "49",
      },
      {
        source: "56",
        target: "55",
      },
      {
        source: "57",
        target: "41",
      },
      {
        source: "57",
        target: "48",
      },
      {
        source: "57",
        target: "55",
      },
      {
        source: "58",
        target: "11",
      },
      {
        source: "58",
        target: "27",
      },
      {
        source: "58",
        target: "48",
      },
      {
        source: "58",
        target: "55",
      },
      {
        source: "58",
        target: "57",
      },
      {
        source: "59",
        target: "48",
      },
      {
        source: "59",
        target: "55",
      },
      {
        source: "59",
        target: "57",
      },
      {
        source: "59",
        target: "58",
      },
      {
        source: "60",
        target: "48",
      },
      {
        source: "60",
        target: "58",
      },
      {
        source: "60",
        target: "59",
      },
      {
        source: "61",
        target: "48",
      },
      {
        source: "61",
        target: "55",
      },
      {
        source: "61",
        target: "57",
      },
      {
        source: "61",
        target: "58",
      },
      {
        source: "61",
        target: "59",
      },
      {
        source: "61",
        target: "60",
      },
      {
        source: "62",
        target: "41",
      },
      {
        source: "62",
        target: "48",
      },
      {
        source: "62",
        target: "55",
      },
      {
        source: "62",
        target: "57",
      },
      {
        source: "62",
        target: "58",
      },
      {
        source: "62",
        target: "59",
      },
      {
        source: "62",
        target: "60",
      },
      {
        source: "62",
        target: "61",
      },
      {
        source: "63",
        target: "48",
      },
      {
        source: "63",
        target: "55",
      },
      {
        source: "63",
        target: "57",
      },
      {
        source: "63",
        target: "58",
      },
      {
        source: "63",
        target: "59",
      },
      {
        source: "63",
        target: "60",
      },
      {
        source: "63",
        target: "61",
      },
      {
        source: "63",
        target: "62",
      },
      {
        source: "64",
        target: "11",
      },
      {
        source: "64",
        target: "48",
      },
      {
        source: "64",
        target: "55",
      },
      {
        source: "64",
        target: "57",
      },
      {
        source: "64",
        target: "58",
      },
      {
        source: "64",
        target: "59",
      },
      {
        source: "64",
        target: "60",
      },
      {
        source: "64",
        target: "61",
      },
      {
        source: "64",
        target: "62",
      },
      {
        source: "64",
        target: "63",
      },
      {
        source: "65",
        target: "48",
      },
      {
        source: "65",
        target: "55",
      },
      {
        source: "65",
        target: "57",
      },
      {
        source: "65",
        target: "58",
      },
      {
        source: "65",
        target: "59",
      },
      {
        source: "65",
        target: "60",
      },
      {
        source: "65",
        target: "61",
      },
      {
        source: "65",
        target: "62",
      },
      {
        source: "65",
        target: "63",
      },
      {
        source: "65",
        target: "64",
      },
      {
        source: "66",
        target: "48",
      },
      {
        source: "66",
        target: "58",
      },
      {
        source: "66",
        target: "59",
      },
      {
        source: "66",
        target: "60",
      },
      {
        source: "66",
        target: "61",
      },
      {
        source: "66",
        target: "62",
      },
      {
        source: "66",
        target: "63",
      },
      {
        source: "66",
        target: "64",
      },
      {
        source: "66",
        target: "65",
      },
      {
        source: "67",
        target: "57",
      },
      {
        source: "68",
        target: "11",
      },
      {
        source: "68",
        target: "24",
      },
      {
        source: "68",
        target: "25",
      },
      {
        source: "68",
        target: "27",
      },
      {
        source: "68",
        target: "41",
      },
      {
        source: "68",
        target: "48",
      },
      {
        source: "69",
        target: "11",
      },
      {
        source: "69",
        target: "24",
      },
      {
        source: "69",
        target: "25",
      },
      {
        source: "69",
        target: "27",
      },
      {
        source: "69",
        target: "41",
      },
      {
        source: "69",
        target: "48",
      },
      {
        source: "69",
        target: "68",
      },
      {
        source: "70",
        target: "11",
      },
      {
        source: "70",
        target: "24",
      },
      {
        source: "70",
        target: "25",
      },
      {
        source: "70",
        target: "27",
      },
      {
        source: "70",
        target: "41",
      },
      {
        source: "70",
        target: "58",
      },
      {
        source: "70",
        target: "68",
      },
      {
        source: "70",
        target: "69",
      },
      {
        source: "71",
        target: "11",
      },
      {
        source: "71",
        target: "25",
      },
      {
        source: "71",
        target: "27",
      },
      {
        source: "71",
        target: "41",
      },
      {
        source: "71",
        target: "48",
      },
      {
        source: "71",
        target: "68",
      },
      {
        source: "71",
        target: "69",
      },
      {
        source: "71",
        target: "70",
      },
      {
        source: "72",
        target: "11",
      },
      {
        source: "72",
        target: "26",
      },
      {
        source: "72",
        target: "27",
      },
      {
        source: "73",
        target: "48",
      },
      {
        source: "74",
        target: "48",
      },
      {
        source: "74",
        target: "73",
      },
      {
        source: "75",
        target: "25",
      },
      {
        source: "75",
        target: "41",
      },
      {
        source: "75",
        target: "48",
      },
      {
        source: "75",
        target: "68",
      },
      {
        source: "75",
        target: "69",
      },
      {
        source: "75",
        target: "70",
      },
      {
        source: "75",
        target: "71",
      },
      {
        source: "76",
        target: "48",
      },
      {
        source: "76",
        target: "58",
      },
      {
        source: "76",
        target: "62",
      },
      {
        source: "76",
        target: "63",
      },
      {
        source: "76",
        target: "64",
      },
      {
        source: "76",
        target: "65",
      },
      {
        source: "76",
        target: "66",
      },
    ],
    categories: [
      {
        name: "A",
      },
      {
        name: "B",
      },
      {
        name: "C",
      },
      {
        name: "D",
      },
      {
        name: "E",
      },
      {
        name: "F",
      },
      {
        name: "G",
      },
      {
        name: "H",
      },
      {
        name: "I",
      },
    ],
  });

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

      {/* 论文详情 */}
      {paperList !== undefined &&
        paperList !== null &&
        paperSelectedId !== undefined &&
        paperList.map((item) => {
          if (item.id === paperSelectedId) {
            return (
              // 论文详情
              <div
                className={`h-fit w-full 
                transition-all duration-1000 
                ${
                  showGraph === false
                    ? // 无图
                      "md:h-full md:order-2 md:w-7/12 "
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

      {/* 相关论文选项列表 */}
      <div
        className={`h-fit w-full select-none 
        transition-all duration-1000 shadow-2xl  
        ${
          showGraph === false
            ? // 无图
              " md:order-1 md:mr-1 md:h-full md:w-3/12"
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
          className="h-full w-full bg-gray-50 flex flex-col justify-start items-center pb-1
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
        </div>
      </div>
    </div>
  );
}

// md:w-72 lg:w-80 xl:w-85 2xl:w-96
