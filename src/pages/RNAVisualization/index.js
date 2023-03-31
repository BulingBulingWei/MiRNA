import React, { useState, useEffect, useRef, useContext } from "react";
import { ToastContext } from "../../App";
import { useNavigate, useParams, useLocation, Outlet } from "react-router-dom";
import download from "downloadjs";

import axios from "axios";
import {
  GetGeneMirnaRelationship,
  GetMirnaFuzzySearchName,
  GetRelationShipByMiRNA,
  GetCalculateByMiRNA,
} from "../../utils/mapPath";

import bgimg from "../../img/img13.jpg";
import { SearchSvg, DownloadSvg } from "../../svg";
import mirnaName from "../../data/mirnaName";

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

export default function RNAVisualization() {
  const navigate = useNavigate();
  const params = useParams();
  const location = useLocation();
  // const mirnaSelectList = ;

  const searchInput = useRef(null);
  const scrollBox = useRef(null);
  const mirnaGeneGraphDom = useRef(null);

  const toastController = useContext(ToastContext);
  const [fuzzySearchList, setFuzzySearchList] = useState([]);
  const [mirnaSelectList, setMirnaSelectList] = useState(mirnaName());

  const data = {
    seq1: "-  uaa    -       ag        uc  u      -u     u      --     cg",
    seq2: " gc   agcu gcgucgu  gugaguaa  ag uguggg  ggcuu ucgaag  ucuca  ",
    seq3: " ||   |||| |||||||  ||||||||  || ||||||  ||||| ||||||  |||||  ",
    seq4: " cg   uuga ugcggcg  CACUUCUU  UC AVAVUC  ccgaa ggcuuc  agagu  ",
    seq5: "g  ---    g       GA        UC  U      Uc     a      ag     -c",
  };
  const [rnaSequenceData, setRnaSequenceData] = useState(data);
  const [mirnaGeneData, setMirnaGeneData] = useState({
    geneNodes: [
      {
        id: "0",
        name: "hsa-mir-1231",
        symbolSize: 15,
        category: 0,
        value: 1,
        geneMirnaRelationship: null,
      },
      {
        id: "1",
        name: "GNAI2",
        symbolSize: 15,
        category: 1,
        value: 1,
        geneMirnaRelationship: {
          id: 89405,
          gene: "GNAI2",
          mirnaName: "hsa-miR-1231",
          publication: "Balakrishnan I  et al. 2014",
          methods: "IP",
          tissue: "Bone Marrow",
          cellLine: "HS5",
        },
      },
      {
        id: "2",
        name: "GNAI2",
        symbolSize: 15,
        category: 2,
        value: 1,
        geneMirnaRelationship: {
          id: 89406,
          gene: "GNAI2",
          mirnaName: "hsa-miR-1231",
          publication: "Balakrishnan I  et al. 2014",
          methods: "IP",
          tissue: "Bone Marrow",
          cellLine: "HS27A",
        },
      },
      {
        id: "3",
        name: "PTPN13",
        symbolSize: 15,
        category: 1,
        value: 1,
        geneMirnaRelationship: {
          id: 89407,
          gene: "PTPN13",
          mirnaName: "hsa-miR-1231",
          publication: "Balakrishnan I  et al. 2014",
          methods: "IP",
          tissue: "Bone Marrow",
          cellLine: "HS5",
        },
      },
      {
        id: "4",
        name: "MAPKAPK2",
        symbolSize: 15,
        category: 1,
        value: 1,
        geneMirnaRelationship: {
          id: 89408,
          gene: "MAPKAPK2",
          mirnaName: "hsa-miR-1231",
          publication: "Balakrishnan I  et al. 2014",
          methods: "IP",
          tissue: "Bone Marrow",
          cellLine: "HS5",
        },
      },
      {
        id: "5",
        name: "TRIO",
        symbolSize: 15,
        category: 1,
        value: 1,
        geneMirnaRelationship: {
          id: 89409,
          gene: "TRIO",
          mirnaName: "hsa-miR-1231",
          publication: "Balakrishnan I  et al. 2014",
          methods: "IP",
          tissue: "Bone Marrow",
          cellLine: "HS5",
        },
      },
      {
        id: "6",
        name: "CTNNA1",
        symbolSize: 15,
        category: 1,
        value: 1,
        geneMirnaRelationship: {
          id: 89410,
          gene: "CTNNA1",
          mirnaName: "hsa-miR-1231",
          publication: "Balakrishnan I  et al. 2014",
          methods: "IP",
          tissue: "Bone Marrow",
          cellLine: "HS5",
        },
      },
      {
        id: "7",
        name: "FAM120A",
        symbolSize: 15,
        category: 1,
        value: 1,
        geneMirnaRelationship: {
          id: 89411,
          gene: "FAM120A",
          mirnaName: "hsa-miR-1231",
          publication: "Balakrishnan I  et al. 2014",
          methods: "IP",
          tissue: "Bone Marrow",
          cellLine: "HS5",
        },
      },
      {
        id: "8",
        name: "TMEM131",
        symbolSize: 15,
        category: 1,
        value: 1,
        geneMirnaRelationship: {
          id: 89412,
          gene: "TMEM131",
          mirnaName: "hsa-miR-1231",
          publication: "Balakrishnan I  et al. 2014",
          methods: "IP",
          tissue: "Bone Marrow",
          cellLine: "HS5",
        },
      },
      {
        id: "9",
        name: "ZAK",
        symbolSize: 15,
        category: 1,
        value: 1,
        geneMirnaRelationship: {
          id: 89413,
          gene: "ZAK",
          mirnaName: "hsa-miR-1231",
          publication: "Balakrishnan I  et al. 2014",
          methods: "IP",
          tissue: "Bone Marrow",
          cellLine: "HS5",
        },
      },
      {
        id: "10",
        name: "MYH9",
        symbolSize: 15,
        category: 2,
        value: 1,
        geneMirnaRelationship: {
          id: 89414,
          gene: "MYH9",
          mirnaName: "hsa-miR-1231",
          publication: "Balakrishnan I  et al. 2014",
          methods: "IP",
          tissue: "Bone Marrow",
          cellLine: "HS27A",
        },
      },
      {
        id: "11",
        name: "CCP110",
        symbolSize: 15,
        category: 1,
        value: 1,
        geneMirnaRelationship: {
          id: 89415,
          gene: "CCP110",
          mirnaName: "hsa-miR-1231",
          publication: "Balakrishnan I  et al. 2014",
          methods: "IP",
          tissue: "Bone Marrow",
          cellLine: "HS5",
        },
      },
      {
        id: "12",
        name: "AES",
        symbolSize: 15,
        category: 1,
        value: 1,
        geneMirnaRelationship: {
          id: 89416,
          gene: "AES",
          mirnaName: "hsa-miR-1231",
          publication: "Balakrishnan I  et al. 2014",
          methods: "IP",
          tissue: "Bone Marrow",
          cellLine: "HS5",
        },
      },
      {
        id: "13",
        name: "SLC35F5",
        symbolSize: 15,
        category: 1,
        value: 1,
        geneMirnaRelationship: {
          id: 89417,
          gene: "SLC35F5",
          mirnaName: "hsa-miR-1231",
          publication: "Balakrishnan I  et al. 2014",
          methods: "IP",
          tissue: "Bone Marrow",
          cellLine: "HS5",
        },
      },
      {
        id: "14",
        name: "USP34",
        symbolSize: 15,
        category: 1,
        value: 1,
        geneMirnaRelationship: {
          id: 89418,
          gene: "USP34",
          mirnaName: "hsa-miR-1231",
          publication: "Balakrishnan I  et al. 2014",
          methods: "IP",
          tissue: "Bone Marrow",
          cellLine: "HS5",
        },
      },
      {
        id: "15",
        name: "AMPD2",
        symbolSize: 15,
        category: 1,
        value: 1,
        geneMirnaRelationship: {
          id: 89419,
          gene: "AMPD2",
          mirnaName: "hsa-miR-1231",
          publication: "Balakrishnan I  et al. 2014",
          methods: "IP",
          tissue: "Bone Marrow",
          cellLine: "HS5",
        },
      },
      {
        id: "16",
        name: "UAP1",
        symbolSize: 15,
        category: 2,
        value: 1,
        geneMirnaRelationship: {
          id: 89420,
          gene: "UAP1",
          mirnaName: "hsa-miR-1231",
          publication: "Balakrishnan I  et al. 2014",
          methods: "IP",
          tissue: "Bone Marrow",
          cellLine: "HS27A",
        },
      },
      {
        id: "17",
        name: "PHF3",
        symbolSize: 15,
        category: 1,
        value: 1,
        geneMirnaRelationship: {
          id: 89421,
          gene: "PHF3",
          mirnaName: "hsa-miR-1231",
          publication: "Balakrishnan I  et al. 2014",
          methods: "IP",
          tissue: "Bone Marrow",
          cellLine: "HS5",
        },
      },
      {
        id: "18",
        name: "CTGF",
        symbolSize: 15,
        category: 2,
        value: 1,
        geneMirnaRelationship: {
          id: 89422,
          gene: "CTGF",
          mirnaName: "hsa-miR-1231",
          publication: "Balakrishnan I  et al. 2014",
          methods: "IP",
          tissue: "Bone Marrow",
          cellLine: "HS27A",
        },
      },
      {
        id: "19",
        name: "TRIM25",
        symbolSize: 15,
        category: 1,
        value: 1,
        geneMirnaRelationship: {
          id: 89423,
          gene: "TRIM25",
          mirnaName: "hsa-miR-1231",
          publication: "Balakrishnan I  et al. 2014",
          methods: "IP",
          tissue: "Bone Marrow",
          cellLine: "HS5",
        },
      },
      {
        id: "20",
        name: "ACO1",
        symbolSize: 15,
        category: 1,
        value: 1,
        geneMirnaRelationship: {
          id: 89424,
          gene: "ACO1",
          mirnaName: "hsa-miR-1231",
          publication: "Balakrishnan I  et al. 2014",
          methods: "IP",
          tissue: "Bone Marrow",
          cellLine: "HS5",
        },
      },
      {
        id: "21",
        name: "LIF",
        symbolSize: 15,
        category: 1,
        value: 1,
        geneMirnaRelationship: {
          id: 89425,
          gene: "LIF",
          mirnaName: "hsa-miR-1231",
          publication: "Balakrishnan I  et al. 2014",
          methods: "IP",
          tissue: "Bone Marrow",
          cellLine: "HS5",
        },
      },
      {
        id: "22",
        name: "TRIM28",
        symbolSize: 15,
        category: 1,
        value: 1,
        geneMirnaRelationship: {
          id: 89426,
          gene: "TRIM28",
          mirnaName: "hsa-miR-1231",
          publication: "Balakrishnan I  et al. 2014",
          methods: "IP",
          tissue: "Bone Marrow",
          cellLine: "HS5",
        },
      },
      {
        id: "23",
        name: "TRIM5",
        symbolSize: 15,
        category: 1,
        value: 1,
        geneMirnaRelationship: {
          id: 89427,
          gene: "TRIM5",
          mirnaName: "hsa-miR-1231",
          publication: "Balakrishnan I  et al. 2014",
          methods: "IP",
          tissue: "Bone Marrow",
          cellLine: "HS5",
        },
      },
      {
        id: "24",
        name: "IL6ST",
        symbolSize: 15,
        category: 1,
        value: 1,
        geneMirnaRelationship: {
          id: 89428,
          gene: "IL6ST",
          mirnaName: "hsa-miR-1231",
          publication: "Balakrishnan I  et al. 2014",
          methods: "IP",
          tissue: "Bone Marrow",
          cellLine: "HS5",
        },
      },
      {
        id: "25",
        name: "ETS1",
        symbolSize: 15,
        category: 1,
        value: 1,
        geneMirnaRelationship: {
          id: 89429,
          gene: "ETS1",
          mirnaName: "hsa-miR-1231",
          publication: "Balakrishnan I  et al. 2014",
          methods: "IP",
          tissue: "Bone Marrow",
          cellLine: "HS5",
        },
      },
      {
        id: "26",
        name: "G3BP1",
        symbolSize: 15,
        category: 1,
        value: 1,
        geneMirnaRelationship: {
          id: 89430,
          gene: "G3BP1",
          mirnaName: "hsa-miR-1231",
          publication: "Balakrishnan I  et al. 2014",
          methods: "IP",
          tissue: "Bone Marrow",
          cellLine: "HS5",
        },
      },
      {
        id: "27",
        name: "MKI67",
        symbolSize: 15,
        category: 1,
        value: 1,
        geneMirnaRelationship: {
          id: 89431,
          gene: "MKI67",
          mirnaName: "hsa-miR-1231",
          publication: "Balakrishnan I  et al. 2014",
          methods: "IP",
          tissue: "Bone Marrow",
          cellLine: "HS5",
        },
      },
      {
        id: "28",
        name: "ADM",
        symbolSize: 15,
        category: 1,
        value: 1,
        geneMirnaRelationship: {
          id: 89432,
          gene: "ADM",
          mirnaName: "hsa-miR-1231",
          publication: "Balakrishnan I  et al. 2014",
          methods: "IP",
          tissue: "Bone Marrow",
          cellLine: "HS5",
        },
      },
      {
        id: "29",
        name: "MBNL1",
        symbolSize: 15,
        category: 1,
        value: 1,
        geneMirnaRelationship: {
          id: 89433,
          gene: "MBNL1",
          mirnaName: "hsa-miR-1231",
          publication: "Balakrishnan I  et al. 2014",
          methods: "IP",
          tissue: "Bone Marrow",
          cellLine: "HS5",
        },
      },
      {
        id: "30",
        name: "DDAH1",
        symbolSize: 15,
        category: 2,
        value: 1,
        geneMirnaRelationship: {
          id: 89434,
          gene: "DDAH1",
          mirnaName: "hsa-miR-1231",
          publication: "Balakrishnan I  et al. 2014",
          methods: "IP",
          tissue: "Bone Marrow",
          cellLine: "HS27A",
        },
      },
      {
        id: "31",
        name: "AZIN1",
        symbolSize: 15,
        category: 1,
        value: 1,
        geneMirnaRelationship: {
          id: 89435,
          gene: "AZIN1",
          mirnaName: "hsa-miR-1231",
          publication: "Balakrishnan I  et al. 2014",
          methods: "IP",
          tissue: "Bone Marrow",
          cellLine: "HS5",
        },
      },
      {
        id: "32",
        name: "ELMSAN1",
        symbolSize: 15,
        category: 1,
        value: 1,
        geneMirnaRelationship: {
          id: 89436,
          gene: "ELMSAN1",
          mirnaName: "hsa-miR-1231",
          publication: "Balakrishnan I  et al. 2014",
          methods: "IP",
          tissue: "Bone Marrow",
          cellLine: "HS5",
        },
      },
      {
        id: "33",
        name: "LY6K",
        symbolSize: 15,
        category: 1,
        value: 1,
        geneMirnaRelationship: {
          id: 89437,
          gene: "LY6K",
          mirnaName: "hsa-miR-1231",
          publication: "Balakrishnan I  et al. 2014",
          methods: "IP",
          tissue: "Bone Marrow",
          cellLine: "HS5",
        },
      },
      {
        id: "34",
        name: "FAM208A",
        symbolSize: 15,
        category: 1,
        value: 1,
        geneMirnaRelationship: {
          id: 89438,
          gene: "FAM208A",
          mirnaName: "hsa-miR-1231",
          publication: "Balakrishnan I  et al. 2014",
          methods: "IP",
          tissue: "Bone Marrow",
          cellLine: "HS5",
        },
      },
      {
        id: "35",
        name: "COL1A2",
        symbolSize: 15,
        category: 2,
        value: 1,
        geneMirnaRelationship: {
          id: 89439,
          gene: "COL1A2",
          mirnaName: "hsa-miR-1231",
          publication: "Balakrishnan I  et al. 2014",
          methods: "IP",
          tissue: "Bone Marrow",
          cellLine: "HS27A",
        },
      },
      {
        id: "36",
        name: "TSC1",
        symbolSize: 15,
        category: 1,
        value: 1,
        geneMirnaRelationship: {
          id: 89440,
          gene: "TSC1",
          mirnaName: "hsa-miR-1231",
          publication: "Balakrishnan I  et al. 2014",
          methods: "IP",
          tissue: "Bone Marrow",
          cellLine: "HS5",
        },
      },
      {
        id: "37",
        name: "AXL",
        symbolSize: 15,
        category: 1,
        value: 1,
        geneMirnaRelationship: {
          id: 89441,
          gene: "AXL",
          mirnaName: "hsa-miR-1231",
          publication: "Balakrishnan I  et al. 2014",
          methods: "IP",
          tissue: "Bone Marrow",
          cellLine: "HS5",
        },
      },
      {
        id: "38",
        name: "CALR",
        symbolSize: 15,
        category: 1,
        value: 1,
        geneMirnaRelationship: {
          id: 89442,
          gene: "CALR",
          mirnaName: "hsa-miR-1231",
          publication: "Balakrishnan I  et al. 2014",
          methods: "IP",
          tissue: "Bone Marrow",
          cellLine: "HS5",
        },
      },
      {
        id: "39",
        name: "TUBB4B",
        symbolSize: 15,
        category: 1,
        value: 1,
        geneMirnaRelationship: {
          id: 89443,
          gene: "TUBB4B",
          mirnaName: "hsa-miR-1231",
          publication: "Balakrishnan I  et al. 2014",
          methods: "IP",
          tissue: "Bone Marrow",
          cellLine: "HS5",
        },
      },
      {
        id: "40",
        name: "DAPK1",
        symbolSize: 15,
        category: 2,
        value: 1,
        geneMirnaRelationship: {
          id: 89444,
          gene: "DAPK1",
          mirnaName: "hsa-miR-1231",
          publication: "Balakrishnan I  et al. 2014",
          methods: "IP",
          tissue: "Bone Marrow",
          cellLine: "HS27A",
        },
      },
      {
        id: "41",
        name: "MGEA5",
        symbolSize: 15,
        category: 1,
        value: 1,
        geneMirnaRelationship: {
          id: 89445,
          gene: "MGEA5",
          mirnaName: "hsa-miR-1231",
          publication: "Balakrishnan I  et al. 2014",
          methods: "IP",
          tissue: "Bone Marrow",
          cellLine: "HS5",
        },
      },
      {
        id: "42",
        name: "CHAMP1",
        symbolSize: 15,
        category: 1,
        value: 1,
        geneMirnaRelationship: {
          id: 89446,
          gene: "CHAMP1",
          mirnaName: "hsa-miR-1231",
          publication: "Balakrishnan I  et al. 2014",
          methods: "IP",
          tissue: "Bone Marrow",
          cellLine: "HS5",
        },
      },
      {
        id: "43",
        name: "FAM127B",
        symbolSize: 15,
        category: 1,
        value: 1,
        geneMirnaRelationship: {
          id: 89447,
          gene: "FAM127B",
          mirnaName: "hsa-miR-1231",
          publication: "Balakrishnan I  et al. 2014",
          methods: "IP",
          tissue: "Bone Marrow",
          cellLine: "HS5",
        },
      },
      {
        id: "44",
        name: "RNF103",
        symbolSize: 15,
        category: 1,
        value: 1,
        geneMirnaRelationship: {
          id: 89448,
          gene: "RNF103",
          mirnaName: "hsa-miR-1231",
          publication: "Balakrishnan I  et al. 2014",
          methods: "IP",
          tissue: "Bone Marrow",
          cellLine: "HS5",
        },
      },
      {
        id: "45",
        name: "EIF6",
        symbolSize: 15,
        category: 2,
        value: 1,
        geneMirnaRelationship: {
          id: 89449,
          gene: "EIF6",
          mirnaName: "hsa-miR-1231",
          publication: "Balakrishnan I  et al. 2014",
          methods: "IP",
          tissue: "Bone Marrow",
          cellLine: "HS27A",
        },
      },
      {
        id: "46",
        name: "HIST1H2BO",
        symbolSize: 15,
        category: 2,
        value: 1,
        geneMirnaRelationship: {
          id: 89450,
          gene: "HIST1H2BO",
          mirnaName: "hsa-miR-1231",
          publication: "Balakrishnan I  et al. 2014",
          methods: "IP",
          tissue: "Bone Marrow",
          cellLine: "HS27A",
        },
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
        source: "10",
        target: "0",
      },
      {
        source: "11",
        target: "0",
      },
      {
        source: "12",
        target: "0",
      },
      {
        source: "13",
        target: "0",
      },
      {
        source: "14",
        target: "0",
      },
      {
        source: "15",
        target: "0",
      },
      {
        source: "16",
        target: "0",
      },
      {
        source: "17",
        target: "0",
      },
      {
        source: "18",
        target: "0",
      },
      {
        source: "19",
        target: "0",
      },
      {
        source: "20",
        target: "0",
      },
      {
        source: "21",
        target: "0",
      },
      {
        source: "22",
        target: "0",
      },
      {
        source: "23",
        target: "0",
      },
      {
        source: "24",
        target: "0",
      },
      {
        source: "25",
        target: "0",
      },
      {
        source: "26",
        target: "0",
      },
      {
        source: "27",
        target: "0",
      },
      {
        source: "28",
        target: "0",
      },
      {
        source: "29",
        target: "0",
      },
      {
        source: "30",
        target: "0",
      },
      {
        source: "31",
        target: "0",
      },
      {
        source: "32",
        target: "0",
      },
      {
        source: "33",
        target: "0",
      },
      {
        source: "34",
        target: "0",
      },
      {
        source: "35",
        target: "0",
      },
      {
        source: "36",
        target: "0",
      },
      {
        source: "37",
        target: "0",
      },
      {
        source: "38",
        target: "0",
      },
      {
        source: "39",
        target: "0",
      },
      {
        source: "40",
        target: "0",
      },
      {
        source: "41",
        target: "0",
      },
      {
        source: "42",
        target: "0",
      },
      {
        source: "43",
        target: "0",
      },
      {
        source: "44",
        target: "0",
      },
      {
        source: "45",
        target: "0",
      },
      {
        source: "46",
        target: "0",
      },
    ],
    categories: [
      {
        name: "MiRNA: hsa-mir-1231",
      },
      {
        name: "HS5",
      },
      {
        name: "HS27A",
      },
    ],
  });

  useEffect(() => {
    let myChart;
    let graphOption = {
      tooltip: {},
      animationDuration: 2000,
      animationEasingUpdate: "quinticInOut",
      legend: [
        {
          data:
            mirnaGeneData.categories !== undefined &&
            mirnaGeneData.categories.map(function (a) {
              return a.name;
            }),
          z: 100,
          show: true,
          orient: "vertical",
          left: "left",
          top: 10,
          width: 300,
          align: "auto",
          borderRadius: 5,
          backgroundColor: "rgba(217, 237, 247, 0.5)",
          borderColor: "#ccc",
          padding: 2,
          itemGap: 5,
          itemWidth: 16,
          itemHeight: 10,
          symbolRotate: "inherit",
          symbolKeepAspect: true,
          inactiveColor: "#ccc",
          inactiveBorderColor: "#ccc",
          inactiveBorderWidth: "auto",
        },
      ],
      series: [
        {
          name: mirnaGeneData.geneNodes.geneMirnaRelationship,
          type: "graph",
          layout: "force",
          data: mirnaGeneData.geneNodes,
          links: mirnaGeneData.links,
          categories: mirnaGeneData.categories,
          //可以旋转也可以缩放
          roam: true,
          draggable: true,
          label: {
            show: true,
            position: "right",
            formatter: "{b}",
          },
          labelLayout: {
            hideOverlap: true,
          },
          scaleLimit: {
            min: 0.1,
            max: 4,
          },
          lineStyle: {
            color: "source",
            curveness: 0.1,
          },
          emphasis: {
            focus: "adjacency",
            lineStyle: {
              width: 10,
            },
          },
          force: {
            repulsion: 180,
            edgeLength: [20, 50],
            //可以旋转也可以缩放
            roam: true,
            layoutAnimation: false,
          },
        },
      ],
    };

    myChart = echarts.init(mirnaGeneGraphDom.current);
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
    myChart.setOption(graphOption, true);
    myChart.hideLoading();
    window.onresize = () => myChart.resize();
    window.addEventListener("resize", () => myChart.resize());
    return () => {
      myChart.dispose();
      graphOption = null;
    };
  }, [mirnaGeneData, location]);

  // 请求
  //根据mi-rna获取mirna 和 gene 关系图数据
  const GetMirnaGraphDataFun = async (searchName) => {
    let options = {
      url: GetGeneMirnaRelationship,
      method: "GET",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      params: {
        mirnaName: searchName, //"hsa-mir-15a",
      },
    };

    let res = await axios(options);

    if (res.data.code === "0") {
      setMirnaGeneData(res.data.data);
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
      {rnaSequenceData !== null && rnaSequenceData !== undefined && (
        <div
          className={`h-1/2 md:h-2/5 w-full flex justify-center items-center cursor-default 
                select-none bg-gray-50 transition-all duration-300`}
        >
          <div
            className="h-full min-w-full w-fit px-2 py-6 md:px-10 bg-orange-50
              flex flex-col justify-around items-start overflow-x-scroll overflow-y-hidden"
            ref={scrollBox}
            onWheel={(event) => {
              // event.preventDefault();
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
        </div>
      )}

      {/* （下方）的 mirna和基因可视化图和搜索框 */}
      <div className="md:h-3/5 flex-grow w-full flex flex-col lg:flex-row justify-center items-center overflow-y-scroll ">
        {/* (下左方)搜索框以及选择列表 */}
        <div
          className="h-full w-full px-6 lg:w-1/3 overflow-y-scroll order-2 md:order-1
         border-r-4 border-red-700 bg-gray-50 bg-opacity-50"
        >
          {/* 头部input红色条 */}
          <div
            className="h-12 py-2 px-2 w-full sticky top-0 flex justify-start
           items-center bg-red-200"
          >
            {/* 输入框和模糊搜索选项 */}
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
                <div
                  className="h-8 w-full px-5  bg-gray-50 bg-opacity-90 text-gray-700 hover:bg-gray-100"
                  onClick={() => {
                    navigate(`/RNAVisualization/${item.mirnaName}`);
                  }}
                >
                  {item.mirnaName}
                </div>
              );
            })}
        </div>

        {/* （下右方） Mi-RNA和基因可视化图 */}
        <div
          className="h-full w-full lg:w-2/3 order-1 md:order-2
         flex flex-col justify-center items-center bg-blue-50 bg-opacity-95"
        >
          {/* mirnaName */}
          <div className="h-fit w-full px-3 md:px-5 lg:px-6 py-1 md:py-2 font-bold text-gray-800">
            {params.mirnaName}
          </div>
          {/* mirna & gene graph */}
          <div
            className="min-h-fit w-full px-2 flex-grow flex justify-center items-center bg-gray-50"
            ref={mirnaGeneGraphDom}
          ></div>
        </div>
      </div>
    </div>
  );
}
