import React, { useState, useEffect, useRef, useContext } from "react";
import { ToastContext, GraphContext } from "../../App";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import styled from "styled-components";
import axios from "axios";
import {
  GetDieaseSearch,
  GetMirnaSearch,
  GetDiseaseGraphData,
  GetMirnaGraphData,
  GetDiseaseFuzzySearchName,
  GetMirnaFuzzySearchName,
} from "../../utils/mapPath";
//只搜索论文的页面
export default function Paper() {
  return (
    <div className="h-full w-full flex justify-center items-center bg-green-200">
      <div className="h-full w-full flex flex-col justify-center items-center md:flex-row">
        {/* 论文列表选项 */}
        <div className=""></div>
        {/* 简介以及论文详情 */}
        <div className=""></div>
      </div>
    </div>
  );
}
