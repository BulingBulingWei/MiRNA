import React, { useState, useRef, useContext, useEffect } from "react";
import { ToastContext } from "../../App";
import {
  GetMonthArticleDiseaseTopN,
  GetMonthArticleMiRNATopN,
  GetMonthMiRNATopN,
  GetWeekArticleDiseaseTopN,
  GetWeekArticleMiRNATopN,
  GetWeekMiRNATopN,
  axiosInstance as axios,
} from "../../utils/mapPath";
import { CSSTransition } from "react-transition-group";
import * as echarts from "echarts/core";
import {
  GridComponent,
  TooltipComponent,
  ToolboxComponent,
  LegendComponent,
  DataZoomComponent,
} from "echarts/components";
import { BarChart } from "echarts/charts";
import { CanvasRenderer } from "echarts/renderers";

echarts.use([
  ToolboxComponent,
  TooltipComponent,
  GridComponent,
  LegendComponent,
  DataZoomComponent,
  BarChart,
  CanvasRenderer,
]);

export default function Trending() {
  const toastController = useContext(ToastContext);
  const [showAntimation, setShowAntimation] = useState(false);
  const MDSTDGraph = useRef(null);
  const MMSTDGraph = useRef(null);
  const MMSSTDGraph = useRef(null);
  const WDSTDGraph = useRef(null);
  const WMSTDGraph = useRef(null);
  const WMSSTDGraph = useRef(null);

  const [MonthArticleDiseaseTopN, setMonthArticleDiseaseTopN] = useState(null);
  const [MonthArticleMiRNATopN, setMonthArticleMiRNATopN] = useState(null);
  const [MonthMiRNATopN, setMonthMiRNATopN] = useState(null);
  const [WeekArticleDiseaseTopN, setWeekArticleDiseaseTopN] = useState(null);
  const [WeekArticleMiRNATopN, setWeekArticleMiRNATopN] = useState(null);
  const [WeekMiRNATopN, setWeekMiRNATopN] = useState(null);

  const nodeRef = useRef(null);
  useEffect(() => {
    setShowAntimation(true);
  }, []);

  useEffect(() => {
    GetMonthArticleDiseaseTopNAxios();
    GetMonthArticleMiRNATopNAxios();
    GetMonthMiRNATopNAxios();

    GetWeekArticleDiseaseTopNAxios();
    GetWeekArticleMiRNATopNAxios();
    GetWeekMiRNATopNAxios();
  }, []);

  useEffect(() => {
    if (!MDSTDGraph.current) return;
    if (MonthArticleDiseaseTopN === null) return;
    let option = {
      tooltip: {
        trigger: "axis",
        axisPointer: {
          type: "shadow",
        },
      },
      toolbox: {
        show: true,
        top: "2%",
        right: "8%",
        feature: {
          dataView: { show: true, readOnly: false },
          restore: { show: true },
          saveAsImage: { show: true },
        },
      },
      calculable: true,
      grid: {
        top: "15%",
        left: "4%",
        right: "10%",
        bottom: "5%",
        containLabel: true,
      },
      xAxis: [
        {
          type: "category",
          data: MonthArticleDiseaseTopN.searchName,
          axisLabel: {
            show: true,
            interval: 0,
            rotate: 15,
          },

          axisTick: {
            alignWithLabel: true,
          },
        },
      ],
      yAxis: [
        {
          type: "value",
        },
      ],
      dataZoom: [
        {
          type: "inside",
          start: 10,
          end: 100,
        },
        {
          show: true,
          yAxisIndex: 0,
          filterMode: "empty",
          width: 30,
          height: "80%",
          showDataShadow: false,
          left: "93%",
        },
      ],
      series: [
        {
          name: "Direct",
          type: "bar",
          barWidth: "60%",
          data: MonthArticleDiseaseTopN.times,
        },
      ],
    };
    let Chart = echarts.init(MDSTDGraph.current);
    Chart.clear();
    Chart.setOption(option, true);
    window.onresize = () => Chart.resize();
    window.addEventListener("resize", () => Chart.resize());
    return () => {
      Chart.dispose();
      Chart.clear();
      option = null;
    };
  }, [MDSTDGraph, MonthArticleDiseaseTopN]);

  useEffect(() => {
    if (!MMSTDGraph.current) return;
    if (MonthArticleMiRNATopN === null) return;
    let option = {
      tooltip: {
        trigger: "axis",
        axisPointer: {
          type: "shadow",
        },
      },
      toolbox: {
        show: true,
        top: "2%",
        right: "8%",
        feature: {
          dataView: { show: true, readOnly: false },
          restore: { show: true },
          saveAsImage: { show: true },
        },
      },
      calculable: true,
      grid: {
        top: "15%",
        left: "4%",
        right: "10%",
        bottom: "5%",
        containLabel: true,
      },
      xAxis: [
        {
          type: "category",
          data: MonthArticleMiRNATopN.searchName,
          axisLabel: {
            show: true,
            interval: 0,
            rotate: 15,
          },

          axisTick: {
            alignWithLabel: true,
          },
        },
      ],
      yAxis: [
        {
          type: "value",
        },
      ],
      dataZoom: [
        {
          type: "inside",
          start: 10,
          end: 100,
        },
        {
          show: true,
          yAxisIndex: 0,
          filterMode: "empty",
          width: 30,
          height: "80%",
          showDataShadow: false,
          left: "93%",
        },
      ],
      series: [
        {
          name: "Direct",
          type: "bar",
          barWidth: "60%",
          data: MonthArticleMiRNATopN.times,
        },
      ],
    };
    let Chart = echarts.init(MMSTDGraph.current);
    Chart.clear();
    Chart.setOption(option, true);
    window.onresize = () => Chart.resize();
    window.addEventListener("resize", () => Chart.resize());
    return () => {
      Chart.dispose();
      Chart.clear();
      option = null;
    };
  }, [MMSTDGraph, MonthArticleMiRNATopN]);

  useEffect(() => {
    if (!MMSSTDGraph.current) return;
    if (MonthMiRNATopN === null) return;
    let option = {
      tooltip: {
        trigger: "axis",
        axisPointer: {
          type: "shadow",
        },
      },
      toolbox: {
        show: true,
        top: "2%",
        right: "8%",
        feature: {
          dataView: { show: true, readOnly: false },
          restore: { show: true },
          saveAsImage: { show: true },
        },
      },
      calculable: true,
      grid: {
        top: "15%",
        left: "4%",
        right: "10%",
        bottom: "5%",
        containLabel: true,
      },
      xAxis: [
        {
          type: "category",
          data: MonthMiRNATopN.searchName,
          axisLabel: {
            show: true,
            interval: 0,
            rotate: 15,
          },

          axisTick: {
            alignWithLabel: true,
          },
        },
      ],
      yAxis: [
        {
          type: "value",
        },
      ],
      dataZoom: [
        {
          type: "inside",
          start: 10,
          end: 100,
        },
        {
          show: true,
          yAxisIndex: 0,
          filterMode: "empty",
          width: 30,
          height: "80%",
          showDataShadow: false,
          left: "93%",
        },
      ],
      series: [
        {
          name: "Direct",
          type: "bar",
          barWidth: "60%",
          data: MonthMiRNATopN.times,
        },
      ],
    };
    let Chart = echarts.init(MMSSTDGraph.current);
    Chart.clear();
    Chart.setOption(option, true);
    window.onresize = () => Chart.resize();
    window.addEventListener("resize", () => Chart.resize());
    return () => {
      Chart.clear();
      Chart.dispose();
      option = null;
    };
  }, [MMSSTDGraph, MonthMiRNATopN]);

  useEffect(() => {
    if (!WDSTDGraph.current) return;
    if (WeekArticleDiseaseTopN === null) return;
    let option = {
      tooltip: {
        trigger: "axis",
        axisPointer: {
          type: "shadow",
        },
      },
      toolbox: {
        show: true,
        top: "2%",
        right: "8%",
        feature: {
          dataView: { show: true, readOnly: false },
          restore: { show: true },
          saveAsImage: { show: true },
        },
      },
      calculable: true,
      grid: {
        top: "15%",
        left: "4%",
        right: "10%",
        bottom: "5%",
        containLabel: true,
      },
      xAxis: [
        {
          type: "category",
          data: WeekArticleDiseaseTopN.searchName,
          axisLabel: {
            show: true,
            interval: 0,
            rotate: 15,
          },

          axisTick: {
            alignWithLabel: true,
          },
        },
      ],
      yAxis: [
        {
          type: "value",
        },
      ],
      dataZoom: [
        {
          type: "inside",
          start: 10,
          end: 100,
        },
        {
          show: true,
          yAxisIndex: 0,
          filterMode: "empty",
          width: 30,
          height: "80%",
          showDataShadow: false,
          left: "93%",
        },
      ],
      series: [
        {
          name: "Direct",
          type: "bar",
          barWidth: "60%",
          data: WeekArticleDiseaseTopN.times,
        },
      ],
    };
    let Chart = echarts.init(WDSTDGraph.current);
    Chart.clear();
    Chart.setOption(option, true);
    window.onresize = () => Chart.resize();
    window.addEventListener("resize", () => Chart.resize());
    return () => {
      Chart.clear();
      Chart.dispose();
      option = null;
    };
  }, [WDSTDGraph, WeekArticleDiseaseTopN]);

  useEffect(() => {
    if (!MMSTDGraph.current) return;
    if (WeekArticleMiRNATopN === null) return;
    let option = {
      tooltip: {
        trigger: "axis",
        axisPointer: {
          type: "shadow",
        },
      },
      toolbox: {
        show: true,
        top: "2%",
        right: "8%",
        feature: {
          dataView: { show: true, readOnly: false },
          restore: { show: true },
          saveAsImage: { show: true },
        },
      },
      calculable: true,
      grid: {
        top: "15%",
        left: "4%",
        right: "10%",
        bottom: "5%",
        containLabel: true,
      },
      xAxis: [
        {
          type: "category",
          data: WeekArticleMiRNATopN.searchName,
          axisLabel: {
            show: true,
            interval: 0,
            rotate: 15,
          },

          axisTick: {
            alignWithLabel: true,
          },
        },
      ],
      yAxis: [
        {
          type: "value",
        },
      ],
      dataZoom: [
        {
          type: "inside",
          start: 10,
          end: 100,
        },
        {
          show: true,
          yAxisIndex: 0,
          filterMode: "empty",
          width: 30,
          height: "80%",
          showDataShadow: false,
          left: "93%",
        },
      ],
      series: [
        {
          name: "Direct",
          type: "bar",
          barWidth: "60%",
          data: WeekArticleMiRNATopN.times,
        },
      ],
    };
    let Chart = echarts.init(WMSTDGraph.current);
    Chart.clear();
    Chart.setOption(option, true);
    window.onresize = () => Chart.resize();
    window.addEventListener("resize", () => Chart.resize());
    return () => {
      Chart.clear();
      Chart.dispose();
      option = null;
    };
  }, [WMSTDGraph, WeekArticleMiRNATopN]);

  useEffect(() => {
    if (!WMSSTDGraph.current) return;
    if (WeekMiRNATopN === null) return;
    let option = {
      tooltip: {
        trigger: "axis",
        axisPointer: {
          type: "shadow",
        },
      },
      toolbox: {
        show: true,
        top: "2%",
        right: "8%",
        feature: {
          dataView: { show: true, readOnly: false },
          restore: { show: true },
          saveAsImage: { show: true },
        },
      },
      calculable: true,
      grid: {
        top: "15%",
        left: "4%",
        right: "10%",
        bottom: "5%",
        containLabel: true,
      },
      xAxis: [
        {
          type: "category",
          data: WeekMiRNATopN.searchName,
          axisLabel: {
            show: true,
            interval: 0,
            rotate: 15,
          },

          axisTick: {
            alignWithLabel: true,
          },
        },
      ],
      yAxis: [
        {
          type: "value",
        },
      ],
      dataZoom: [
        {
          type: "inside",
          start: 10,
          end: 100,
        },
        {
          show: true,
          yAxisIndex: 0,
          filterMode: "empty",
          width: 30,
          height: "80%",
          showDataShadow: false,
          left: "93%",
        },
      ],
      series: [
        {
          name: "Direct",
          type: "bar",
          barWidth: "60%",
          data: WeekMiRNATopN.times,
        },
      ],
    };
    let Chart = echarts.init(WMSSTDGraph.current);
    Chart.clear();
    Chart.setOption(option, true);
    window.onresize = () => Chart.resize();
    window.addEventListener("resize", () => Chart.resize());
    return () => {
      Chart.dispose();
      Chart.clear();
      option = null;
    };
  }, [WMSSTDGraph, WeekMiRNATopN]);

  const GetMonthArticleDiseaseTopNAxios = async () => {
    let options = {
      url: GetMonthArticleDiseaseTopN + "10",
      method: "GET",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      params: {
        n: 10,
      },
    };

    let res = await axios(options);
    if (res.data.code === "0") {
      //   console.log(res.data.data);
      setMonthArticleDiseaseTopN(res.data.data);
    } else {
      toastController({
        mes: res.data.message,
        timeout: 1000,
      });
    }
  };

  const GetMonthArticleMiRNATopNAxios = async () => {
    let options = {
      url: GetMonthArticleMiRNATopN + "10",
      method: "GET",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      params: {
        n: 10,
      },
    };

    let res = await axios(options);
    if (res.data.code === "0") {
      setMonthArticleMiRNATopN(res.data.data);
    } else {
      toastController({
        mes: res.data.message,
        timeout: 1000,
      });
    }
  };

  const GetMonthMiRNATopNAxios = async () => {
    let options = {
      url: GetMonthMiRNATopN + "10",
      method: "GET",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      params: {
        n: 10,
      },
    };

    let res = await axios(options);
    if (res.data.code === "0") {
      setMonthMiRNATopN(res.data.data);
    } else {
      toastController({
        mes: res.data.message,
        timeout: 1000,
      });
    }
  };

  const GetWeekArticleDiseaseTopNAxios = async () => {
    let options = {
      url: GetWeekArticleDiseaseTopN + "10",
      method: "GET",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      params: {
        n: 10,
      },
    };

    let res = await axios(options);
    if (res.data.code === "0") {
      setWeekArticleDiseaseTopN(res.data.data);
    } else {
      toastController({
        mes: res.data.message,
        timeout: 1000,
      });
    }
  };

  const GetWeekArticleMiRNATopNAxios = async () => {
    let options = {
      url: GetWeekArticleMiRNATopN + "10",
      method: "GET",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      params: {
        n: 10,
      },
    };

    let res = await axios(options);
    if (res.data.code === "0") {
      setWeekArticleMiRNATopN(res.data.data);
    } else {
      toastController({
        mes: res.data.message,
        timeout: 1000,
      });
    }
  };

  const GetWeekMiRNATopNAxios = async () => {
    let options = {
      url: GetWeekMiRNATopN + "10",
      method: "GET",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      params: {
        n: 10,
      },
    };

    let res = await axios(options);
    if (res.data.code === "0") {
      setWeekMiRNATopN(res.data.data);
    } else {
      toastController({
        mes: res.data.message,
        timeout: 1000,
      });
    }
  };

  return (
    <CSSTransition
      in={showAntimation}
      timeout={300}
      nodeRef={nodeRef}
      classNames="page"
      unmountOnExit
    >
      <div
        className="h-fit lg:h-full w-full overflow-y-scroll  transition-all duration-500
         bg-gray-100 px-4 md:px-8 lg:px-14 pb-8 md:pb-10 lg:pb-14"
      >
        {/* 月度数据 */}
        <div
          ref={nodeRef}
          className="h-fit w-full text-gray-600 text-3xl font-bold
         py-2 px-5 pt-8 lg:py-3 lg:pt-12 lg:px-10 xl:px-14  mb-3 lg:mb-8 xl:mb-12"
        >
          <h1>
            miRNA & Disease Monthly Trending Data{" "}
            <span className="text-xl text-sky-700">(this month)</span>
          </h1>
        </div>
        {/* grid */}
        <div
          className="h-fit w-full grid grid-flow-row grid-cols-1 lg:grid-cols-2
        justify-around items-center gap-5 lg:gap-10 xl:gap-20"
        >
          {/* 月度疾病搜索数据图 */}
          <div
            className="h-80 lg:h-96 w-full p-1 rounded bg-blue-800 flex flex-col
          justify-between items-center"
          >
            {/* 图表标题 */}
            <div className="h-12 w-full shrink-0 rounded-t bg-gray-50 px-3 py-2">
              <p className="text-lg text-gray-600 font-bold">
                Disease Search Trending Data
              </p>
            </div>
            {/* 图表 */}
            <div
              ref={MDSTDGraph}
              className="h-fit min-h-0 flex-grow w-full bg-blue-50"
            ></div>
          </div>

          {/* 月度mirna搜索数据图 */}
          <div
            className="h-80 lg:h-96 w-full p-1 rounded bg-blue-800 flex flex-col
          justify-between items-center"
          >
            {/* 图表标题 */}
            <div className="h-12 w-full shrink-0 rounded-t bg-gray-50 px-3 py-2">
              <p className="text-lg text-gray-600 font-bold">
                miRNA Search Trending Data
              </p>
            </div>
            {/* 图表 */}
            <div
              ref={MMSTDGraph}
              className="h-fit min-h-0 flex-grow w-full bg-blue-50"
            ></div>
          </div>

          {/* 月度mirna结构搜索数据图 */}
          <div
            className="h-80 lg:h-96 w-full p-1 rounded bg-blue-800 flex flex-col
          justify-between items-center"
          >
            {/* 图表标题 */}
            <div className="h-12 w-full shrink-0 rounded-t bg-gray-50 px-3 py-2">
              <p className="text-lg text-gray-600 font-bold">
                miRNA Struct Search Trending Data
              </p>
            </div>
            {/* 图表 */}
            <div
              ref={MMSSTDGraph}
              className="h-fit min-h-0 flex-grow w-full bg-blue-50"
            ></div>
          </div>
        </div>

        {/* 本周数据----------------------------- */}
        <div
          className="h-fit w-full text-gray-600 text-3xl font-bold
         py-2 px-5 pt-8 lg:py-3 lg:pt-12 lg:px-10 xl:px-14  mb-3 lg:mb-8 xl:mb-12"
        >
          <h1>
            miRNA & Disease Weekly Trending Data{" "}
            <span className="text-xl text-sky-700">(this week)</span>
          </h1>
        </div>
        {/* grid */}
        <div
          className="h-fit w-full grid grid-flow-row grid-cols-1 lg:grid-cols-2
        justify-around items-center gap-5 lg:gap-10 xl:gap-20"
        >
          {/* 本周疾病搜索数据图 */}
          <div
            className="h-80 lg:h-96 w-full p-1 rounded bg-amber-700 flex flex-col
          justify-between items-center"
          >
            {/* 图表标题 */}
            <div className="h-12 w-full shrink-0 rounded-t bg-gray-50 px-3 py-2">
              <p className="text-lg text-gray-600 font-bold">
                Disease Search Trending Data
              </p>
            </div>
            {/* 图表 */}
            <div
              ref={WDSTDGraph}
              className="h-fit min-h-0 flex-grow w-full bg-orange-50"
            ></div>
          </div>

          {/* 本周mirna搜索数据图 */}
          <div
            className="h-80 lg:h-96 w-full p-1 rounded bg-amber-700 flex flex-col
          justify-between items-center"
          >
            {/* 图表标题 */}
            <div className="h-12 w-full shrink-0 rounded-t bg-gray-50 px-3 py-2">
              <p className="text-lg text-gray-600 font-bold">
                miRNA Search Trending Data
              </p>
            </div>
            {/* 图表 */}
            <div
              ref={WMSTDGraph}
              className="h-fit min-h-0 flex-grow w-full bg-orange-50"
            ></div>
          </div>

          {/* 本周mirna结构搜索数据图 */}
          <div
            className="h-80 lg:h-96 w-full p-1 rounded bg-amber-700 flex flex-col
          justify-between items-center"
          >
            {/* 图表标题 */}
            <div className="h-12 w-full shrink-0 rounded-t bg-gray-50 px-3 py-2">
              <p className="text-lg text-gray-600 font-bold">
                miRNA Struct Search Trending Data
              </p>
            </div>
            {/* 图表 */}
            <div
              ref={WMSSTDGraph}
              className="h-fit min-h-0 flex-grow w-full bg-orange-50"
            ></div>
          </div>
        </div>
      </div>
    </CSSTransition>
  );
}
