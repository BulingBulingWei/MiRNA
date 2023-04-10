import React, { useState, Suspense, lazy } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Toast from "./Component/toast";

const Home = lazy(() => import("./pages/Home"));
const PaperSearch = lazy(() => import("./pages/PaperSearch"));
const GraphSeach = lazy(() => import("./pages/GraphSeach"));
const GraphSearchDetail = lazy(() => import("./pages/GraphSearchDetail"));
const PaperSearhDetail = lazy(() => import("./pages/PaperSearhDetail"));
const About = lazy(() => import("./pages/About"));
const Loading = lazy(() => import("./pages/Loading"));
const GoWrong404 = lazy(() => import("./pages/GoWrong404"));
const RNAVisualization = lazy(() => import("./pages/RNAVisualization"));
const RNASearch = lazy(() => import("./pages/RNASearch"));
const Trending = lazy(() => import("./pages/Trending"));
const Help = lazy(() => import("./pages/Help"));
// const Help = lazy(() => import("./optimize/index"));

function App() {
  const [toastConfig, setToastConfig] = useState({});
  const [showGraph, setShowGraph] = useState(true);
  const [showLeft, setShowLeft] = useState(true);
  const [showRight, setShowRight] = useState(true);
  /**
   * 用于控制toast展示的函数，这个控制函数通过context向下传递到每一个组件里
   * 在控制函数内部实现了组件定时关闭的能力
   * @param {object} toastConfig 传入{show、timeout、mes}
   */
  const handleToastConfig = (toastConfig) => {
    let configTemp = { show: true, ...toastConfig };
    if (configTemp.timeout === undefined) configTemp.timeout = 1000;
    setToastConfig(configTemp);
    setTimeout(() => {
      configTemp.show = false;
      setToastConfig({ ...configTemp });
    }, toastConfig.timeout);
  };

  return (
    <>
      <Toast config={toastConfig} />
      <ToastContext.Provider value={handleToastConfig}>
        <GraphContext.Provider value={{ showGraph, setShowGraph }}>
          <ShowLeftContext.Provider value={{ showLeft, setShowLeft }}>
            <ShowRightContext.Provider value={{ showRight, setShowRight }}>
              <Suspense fallback={<Loading />}>
                <BrowserRouter>
                  <Routes>
                    {/* Home页面（整体框架） */}
                    <Route path="/" element={<Home />}>
                      <Route path="/" element={<GraphSeach />}></Route>
                      <Route
                        path="/SearchDetail/:type/:searchName"
                        element={<GraphSearchDetail />}
                      ></Route>
                      <Route path="/Paper" element={<PaperSearch />}></Route>
                      <Route
                        path="/Paper/:searchName/:pageNum"
                        element={<PaperSearhDetail />}
                      ></Route>
                      <Route path="/About" element={<About />}></Route>
                      <Route
                        path="/RNAVisualization"
                        element={<RNASearch />}
                      ></Route>
                      <Route
                        path="/RNAVisualization/:mirnaName"
                        element={<RNAVisualization />}
                      ></Route>
                      <Route path="/Help" element={<Help />}></Route>
                      <Route path="/Trending" element={<Trending />}></Route>
                    </Route>
                    <Route path="*" element={<GoWrong404 />}></Route>
                  </Routes>
                </BrowserRouter>
              </Suspense>
            </ShowRightContext.Provider>
          </ShowLeftContext.Provider>
        </GraphContext.Provider>
      </ToastContext.Provider>
    </>
  );
}
export const ToastContext = React.createContext();
export const GraphContext = React.createContext();
export const ShowLeftContext = React.createContext();
export const ShowRightContext = React.createContext();
export default App;
