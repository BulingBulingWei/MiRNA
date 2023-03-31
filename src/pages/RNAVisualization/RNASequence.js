import React, { useState, useEffect, useRef, useContext } from "react";
import { ToastContext } from "../../App";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";

export default function RNASequence() {
  const scrollBox = useRef(null);
  const data = {
    seq1: "-  uaa    -       ag        uc  u      -u     u      --     cg",
    seq2: " gc   agcu gcgucgu  gugaguaa  ag uguggg  ggcuu ucgaag  ucuca  ",
    seq3: " ||   |||| |||||||  ||||||||  || ||||||  ||||| ||||||  |||||  ",
    seq4: " cg   uuga ugcggcg  CACUUCUU  UC AVAVUC  ccgaa ggcuuc  agagu  ",
    seq5: "g  ---    g       GA        UC  U      Uc     a      ag     -c",
  };
  const [rnaSequenceData, setRnaSequenceData] = useState(data);
  const [showSeqGraph, setShowSeqGraph] = useState(true);
  const graphDom = useRef(null);

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
      className={`${
        rnaSequenceData !== null && rnaSequenceData !== undefined
          ? "h-96 md:h-2/5"
          : "h-0"
      } w-full flex justify-center items-center cursor-default 
                select-none bg-gray-50 transition-all duration-300`}
      //   style={{ animationIterationCount: "0" }}
    >
      {/*  mirna序列可视化 */}
      {rnaSequenceData !== null && rnaSequenceData !== undefined && (
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
      )}
    </div>
  );
}
