// const navigate = useNavigate();
//   const toastController = useContext(ToastContext);
//   const {showGraph, setShowGraph} = useContext(GraphContext);
// import { ToastContext, GraphContext } from "../../App";
// import React, { useState, useEffect, useRef, useContext } from "react";

// let pageNum = 1;
//     let startTimeIdx = startTimeSelect.current.selectedIndex;
//     let startTime =
//       startTimeIdx === undefined
//         ? "2000"
//         : startTimeSelect.current.options[startTimeIdx].value;
//     let endTimeIdx = endTimeSelect.current.selectedIndex;
//     let endTime =
//       endTimeIdx === undefined
//         ? "2020"
//         : endTimeSelect.current.options[endTimeIdx].value;

//     let idx = searchTypeSelect.current.selectedIndex;
//     let v =
//       idx === undefined ? "" : searchTypeSelect.current.options[idx].value;
//     if (v === "Disease") {
//       getDiseaseArticles({ searchName, startTime, endTime, pageNum });
//       GetDiseaseGraphDataFun(searchName);
//     } else if (v === "mi-RNA") {
//       getMirnaArticles({ searchName, startTime, endTime, pageNum });
//       GetMirnaGraphDataFun(searchName);
//     }

// const gotopage = (pageNum) => {
//     if (typeof parseInt(pageNum) !== "number" || pageNum < 1) {
//       toastController({
//         mes: "请输入合法页数",
//         timeout: 1500,
//       });
//       return;
//     }
//     if (pageNum > 0 && pageNum <= page_end) {
//       setPage_now(parseInt(pageNum));
//       if (searchType === "Disease") {
//         getDiseaseArticles({
//           searchName: searchContext,
//           startTime: startYear,
//           endTime: endYear,
//           pageNum: pageNum,
//         });
//       } else if (searchType === "mi-RNA") {
//         getMirnaArticles({
//           searchName: searchContext,
//           startTime: startYear,
//           endTime: endYear,
//           pageNum: pageNum,
//         });
//       }
//     } else {
//       toastController({
//         mes: `error page`,
//         timeout: 1000,
//       });
//     }
//   };

// `/SearchDetail/${searchType}/${params.searchName}/` +
//             params.startTime +
//             `/` +
//             params.endTime +
//             `/${pageNum}`

// if (pageNum > 0 && pageNum <= page_end) {
//     if (searchType === "Disease") {
//       navigate(`/SearchDetail/${searchType}/${params.searchName}/${pageNum}`);
//     } else if (searchType === "mi-RNA") {
//       navigate(`/SearchDetail/${searchType}/${params.searchName}/${pageNum}`);
//     } else {
//       toastController({
//         mes: `goToPage error`,
//         timeout: 1000,
//       });
//     }
//   } else {
//     toastController({
//       mes: `error page`,
//       timeout: 1000,
//     });
//   }

// const {showLeft, setShowLeft} = useContext(ShowLeftContext);
//   const {showRight, setShowRight} = useContext(ShowRightContext)
