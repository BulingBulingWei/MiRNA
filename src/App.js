import React, { useState, Suspense, lazy } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Toast from "./Component/toast";

const Home = lazy(() => import("./pages/Home"));
const Loading = lazy(() => import("./pages/Loading"));
const Search = lazy(() => import("./pages/Search"));
const GoWrong404 = lazy(() => import("./pages/GoWrong404"));
// const  = lazy(() => import(""));
// const  = lazy(() => import(""));
// const  = lazy(() => import(""));
// const  = lazy(() => import(""));
// const  = lazy(() => import(""));
// const  = lazy(() => import(""));
// const  = lazy(() => import(""));
// const  = lazy(() => import(""));

function App() {
  const [toastConfig, setToastConfig] = useState({});
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
        <Suspense fallback={<Loading />}>
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Home />}>
                <Route path="/" element={<Search />}></Route>
              </Route>
              <Route path="*" element={<GoWrong404 />}></Route>
            </Routes>
          </BrowserRouter>
        </Suspense>
      </ToastContext.Provider>
    </>
  );
}
export const ToastContext = React.createContext();
export default App;
