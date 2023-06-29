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

// {/* 手机端的论文详情 */}
// {paperList !== undefined &&
//     paperList !== null &&
//     paperSelectedId !== undefined &&
//     paperList.map((item) => {
//       if (item.pmid === paperSelectedId) {
//         return (
//           // 手机端论文详情
//           <div
//             id="dragBox"
//             className={`h-64 w-full z-50 sticky bottom-12 md:hidden`}
//           >
//             {/* 论文内容上的拖动条 */}
//             <div
//               id="dragLine"
//               onTouchStart={handleMouseDown}
//               className="h-5 w-full p-0 flex justify-center items-center bg-gray-200"
//             >
//               <div className="h-1 w-12 rounded-full m-0 bg-gray-400 "></div>
//             </div>
//             {/* 手机端论文内容滚动面板 container */}
//             <div className="h-full w-full px-1 pb-3 cursor-default overflow-y-scroll text-justify text-sm bg-green-50">
//               <h1 className="text-lg font-bold block  mb-1">
//                 {item.title}
//               </h1>
//               {/* {item.authors !== undefined &&
//                 item.authors !== null &&
//                 item.authors.map((aut) => {
//                   return (
//                     <p className="text-gray-600 inline pr-1">{aut}</p>
//                   );
//                 })} */}
//               <p className="text-gray-600 inline pr-1">
//                 {item.authors}
//               </p>
//               <div className="h-2"></div>
//               <p className=" text-gray-600">{item.date}</p>
//               <div className="h-2"></div>
//               <div className="inline-block h-5 w-fit mr-2">
//                 Open in:
//               </div>
//               {item.pmid !== undefined && (
//                 <div className="h-7 w-7 mx-2 rounded-full text-white bg-gray-500 inline-block">
//                   <div
//                     className=" h-fit w-fit text-xs leading-7 mx-auto cursor-pointer"
//                     onClick={() => {
//                       window.open(
//                         `https://pubmed.ncbi.nlm.nih.gov/${item.pmid}`,
//                         "_blank"
//                       );
//                     }}
//                   >
//                     pmid
//                   </div>
//                 </div>
//               )}
//               {item.doi !== undefined && (
//                 <div
//                   className="h-7 w-7 mx-2 rounded-full text-white bg-gray-500 inline-block cursor-pointer"
//                   onClick={() => {
//                     window.open(`${item.url}`, "_blank");
//                   }}
//                 >
//                   <div className=" h-fit w-fit leading-6 mx-auto">
//                     doi
//                   </div>
//                 </div>
//               )}
//               {/* 下载一篇文章的pdf */}
//               <div className="h-fit w-full pt-2">
//                 <span className="font-bold text-sky-700">
//                   download this article:{" "}
//                 </span>
//                 <div
//                   className="inline-block h-full w-fit "
//                   onClick={() => {
//                     handleDownloadOneArticle(item.pmid);
//                   }}
//                 >
//                   <DownloadSvg></DownloadSvg>
//                 </div>
//               </div>
//               {/* 下载几篇论文 excel */}
//               <div className="h-fit w-full pt-2">
//                 <span className="font-bold text-red-600">
//                   download ALL articles:{" "}
//                 </span>
//                 <div
//                   className="inline-block h-full w-fit "
//                   onClick={() => {
//                     PostArticleListDownloadAxios();
//                   }}
//                 >
//                   <DownloadSvg></DownloadSvg>
//                 </div>
//               </div>
//               <div className="h-1 w-full"></div>
//               <p className="text-sky-800 font-bold">Abstract:</p>
//               <p dangerouslySetInnerHTML={{ __html: item.abs }} />
//             </div>
//           </div>
//         );
//       }
//       return <></>;
//     })}

//开场动画
// import { CSSTransition } from "react-transition-group";
// import React, { useState, useRef, useContext, useEffect } from "react";
// // const [showAntimation, setShowAntimation] = useState(false);
// //   const nodeRef = useRef(null);
// //   useEffect(() => {
// //     setShowAntimation(true);
// //   }, []);

// // ref={nodeRef}

// {
//   /* <CSSTransition
//       in={showAntimation}
//       timeout={300}
//       nodeRef={nodeRef}
//       classNames="page"
//       unmountOnExit
//     ></CSSTransition> */
// }

// //背景图片
// // style={{
// //   backgroundImage: `url(${bgimg})`,
// //   backgroundRepeat: "none",
// //   backgroundSize: "cover",
// //   backgroundPosition: "center",
// // }}

// {/* -3p 和 -5p 的基因集合 */}
// <div className="w-full h-fit my-5 flex flex-col justify-start items-center">
// <div className="h-fit w-11/12 p-3 text-2xl font-bold text-blue-900">
//   -3p 和 -5p 的基因集合
// </div>
// <div className="relative h-fit w-11/12 p-2 mx-16 pb-60 border-2 border-gray-300">
//   {/* 1 */}
//   <div className=" h-40 w-64 relative p-2 ml-10 mt-10 flex justify-between items-center rounded-lg bg-blue-200">
//     {/* left -3p */}
//     <div className="relative h-full w-32 p-10 bg-green-50">
//       {gene3p.map((gene) => {
//         return <p className="h-fit w-fit">{gene}</p>;
//       })}
//     </div>
//     {/* right */}
//     <div className="relative h-full w-32 p-10 bg-green-50">
//       {/* 2 */}
//       <div
//         className="h-44 w-60 absolute left-0 top-10 p-1 flex justify-between items-center rounded-lg
//           border-4 border-amber-300"
//         style={{ top: "25%" }}
//       >
//         {/* union gene */}
//         <div className=" h-full w-1/2 flex flex-col justify-between items-center bg-red-200 bg-opacity-60">
//           <div
//             className="w-full bg-sky-100 p-2"
//             style={{ height: "62%" }}
//           >
//             {unionGene.map((gene) => {
//               return <p className="h-fit w-fit">{gene}</p>;
//             })}
//           </div>
//         </div>
//         {/* -5p */}
//         <div className="h-full w-1/2 p-2 pl-6 bg-red-200 bg-opacity-60">
//           {gene5p.map((gene) => {
//             return <p className="h-fit w-fit">{gene}</p>;
//           })}
//         </div>
//       </div>
//     </div>
//   </div>
// </div>
// </div>
