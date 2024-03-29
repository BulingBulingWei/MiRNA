import React, { useState, useEffect, useRef, useContext } from "react";
import { ToastContext } from "../../App";
import { useForm } from "react-hook-form";
import bgimg from "../../img/img16.jpg";
import { PostSendMessage, axiosInstance as axios } from "../../utils/mapPath";
import { CSSTransition } from "react-transition-group";

export default function About() {
  const [showAntimation, setShowAntimation] = useState(false);
  const nodeRef = useRef(null);
  useEffect(() => {
    setShowAntimation(true);
  }, []);

  const toastController = useContext(ToastContext);
  const [successMessage, setSuccessMessage] = useState("");
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = (data) => {
    // console.log(data);
    setSuccessMessage("Thank you for contacting us!");
    PostSendMessageAxios(data);
  };

  const PostSendMessageAxios = async (data) => {
    let options = {
      url: PostSendMessage,
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      data: {
        name: data.name,
        email: data.email,
        message: data.message,
      },
    };

    let res = await axios(options);
    if (res.data.code === "0") {
      toastController({
        mes: "发送成功！",
        timeout: 1000,
      });
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
        className="h-full w-full "
        style={{
          backgroundImage: `url(${bgimg})`,
          backgroundRepeat: "repeat-y",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        {/* 中间的绿色背景容器 */}

        <div
          ref={nodeRef}
          className="h-full w-full overflow-y-scroll mx-auto px-2 pt-1 bg-opacity-60
     sm:w-5/6 md:w-4/5 lg:w-2/3 2xl:w-1/2 sm:px-14 md:px-20 lg:px-28 xl:px-32 bg-green-50"
        >
          {/* (上方)联系我们的表单框 */}
          <div className=" mx-auto mt-8 mb-20 w-5/6 ">
            <h2 className="text-2xl font-bold mb-6">Contact Us</h2>
            {successMessage && (
              <div className="bg-teal-50 font-bold text-green-700 border border-green-500 py-2 px-4 rounded mb-6">
                {successMessage}
              </div>
            )}
            <form onSubmit={handleSubmit(onSubmit)}>
              <div className="mb-1 md:mb-4">
                <label
                  htmlFor="name"
                  className="block text-gray-800 font-bold mb-2"
                >
                  Name
                </label>
                <input
                  type="text"
                  id="name"
                  {...register("name", { required: true })}
                  className={`w-full px-3 py-2 border ${
                    errors.name ? "border-red-500" : "border-gray-300"
                  } rounded`}
                />
                {errors.name && (
                  <p className="text-red-500 text-sm mt-1">Name is required</p>
                )}
              </div>
              <div className="mb-1 md:mb-4">
                <label
                  htmlFor="email"
                  className="block text-gray-800 font-bold mb-2"
                >
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  {...register("email", { required: true })}
                  className={`w-full px-3 py-2 border ${
                    errors.email ? "border-red-500" : "border-gray-300"
                  } rounded`}
                />
                {errors.email && (
                  <p className="text-red-500 text-sm mt-1">Email is required</p>
                )}
              </div>
              <div className="mb-1 md:mb-4">
                <label
                  htmlFor="message"
                  className="block text-gray-800 font-bold mb-2"
                >
                  Message
                </label>
                <textarea
                  id="message"
                  {...register("message", { required: true })}
                  className={`w-full h-28 px-3 py-2 border ${
                    errors.message ? "border-red-500" : "border-gray-300"
                  } rounded`}
                />
                {errors.message && (
                  <p className="text-red-500 text-sm mt-1">
                    Message is required
                  </p>
                )}
              </div>
              <div className="flex items-center justify-center">
                <button
                  type="submit"
                  className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                >
                  Submit
                </button>
              </div>
            </form>
          </div>
          {/* (下方)系统简介以及版本更新信息 */}
          <div
            className="min-h-fit h-fit mx-auto mb-10 flex flex-col justify-start items-center
         py-8 pl-8 pr-4 bg-gray-100 rounded-md bg-opacity-70 text-gray-600 "
          >
            {/* 项目简介 */}
            <div className="h-fit w-full  pb-8">
              <p className="text-sky-700 font-bold leading-10">系统简介：</p>
              <p className="font-mono font-bold">
                <span className="px-4"></span>
                本系统通过基于规则并结合机器学习的方式实现miRNA与疾病在文献中的实体识别，
                得出miRNA与疾病的实体与对应关系，并使用基于图神经网络的链路预测，
                深层次分析miRNA与疾病数据中隐含的功能与信息，预测miRNA与疾病之间的联系，
                希望能够辅助科研工作者以更快更经济的方式找出与疾病相关的miRNA。
              </p>
              <p className="font-mono font-bold">
                <span className="px-4"></span>
                为此，我们提供了搜索相关关系的功能，搜索框准确输入实体，就可以看见以此为中心的
                相关Disease以及Mirna的关系图以及证实相关关系的论文摘要，并且在关系图中能
                看到经我们系统预测的可能与之有关的Disease或者Mirna。
              </p>
              <p className="font-mono font-bold">
                <span className="px-4"></span>
                同时，我们也提供了纯论文搜索功能，帮助大家更精准地找到与搜索关键词有关的论文，
                如果想要了解论文的详情，还需点击前往原文链接。
              </p>
              <p className="font-mono font-bold">
                <span className="px-4"></span>
                最后，希望我们可以给您带来良好的使用体验，为您提供有效的服务，
                如有任何问题，欢迎您与我们联系。
              </p>
            </div>
            <p className="text-sky-700 font-bold leading-10">系统更新记录：</p>
            {/* 以下是项目更新历史 */}
            {/* 2023-05-29 */}
            <div className="h-fit w-full m-0 p-4 pb-6 relative border-l-2 border-blue-400 ">
              {/* 小圆点 */}
              <div className="h-6 w-6 absolute top-4 -left-3 rounded-full bg-blue-300 border-4 border-gray-100"></div>
              {/* 框框内的更新时间与内容 */}
              <p className="font-bold text-sky-700 mb-1">2023-05-29</p>
              <ul className="font-mono font-bold">
                <li>- 新增了mirna结构的多种可视化图</li>
                <li>- 新增了-3p和-5p两支的对比</li>
                <li>- 新增了关系数据的下载页面</li>
              </ul>
            </div>
            {/* 2023-04-01 */}
            <div className="h-fit w-full m-0 p-4 pb-6 relative border-l-2 border-blue-400 ">
              {/* 小圆点 */}
              <div className="h-6 w-6 absolute top-4 -left-3 rounded-full bg-blue-300 border-4 border-gray-100"></div>
              {/* 框框内的更新时间与内容 */}
              <p className="font-bold text-sky-700 mb-1">2023-04-01</p>
              <ul className="font-mono font-bold">
                <li>- 更新了网站内的很多背景图片</li>
                <li>- 对 Mi-RNA 的序列可视化展示做了一些调整</li>
              </ul>
            </div>
            {/* 2023-03-29 */}
            <div className="h-fit w-full m-0 p-4 pb-6 relative border-l-2 border-blue-400 ">
              {/* 小圆点 */}
              <div className="h-6 w-6 absolute top-4 -left-3 rounded-full bg-blue-300 border-4 border-gray-100"></div>
              {/* 框框内的更新时间与内容 */}
              <p className="font-bold text-sky-700 mb-1">2023-03-29</p>
              <ul className="font-mono font-bold">
                <li>- 相关已证实和预测的关系数据可以下载啦~</li>
                <li>- 手机端的网站页面也更加友好了</li>
              </ul>
            </div>
            {/* 2023-03-26 */}
            <div className="h-fit w-full m-0 p-4 pb-6 relative border-l-2 border-blue-400 ">
              {/* 小圆点 */}
              <div className="h-6 w-6 absolute top-4 -left-3 rounded-full bg-blue-300 border-4 border-gray-100"></div>
              {/* 框框内的更新时间与内容 */}
              <p className="font-bold text-sky-700 mb-1">2023-03-26</p>
              <ul className="font-mono font-bold">
                <li>- 增加了单篇论文与多篇论文下载的功能</li>
                <li>- 修复了一些已知问题</li>
              </ul>
            </div>
            {/* 2023-03-24 */}
            <div className="h-fit w-full m-0 p-4 pb-6 relative border-l-2 border-blue-400 ">
              {/* 小圆点 */}
              <div className="h-6 w-6 absolute top-4 -left-3 rounded-full bg-blue-300 border-4 border-gray-100"></div>
              {/* 框框内的更新时间与内容 */}
              <p className="font-bold text-sky-700 mb-1">2023-03-24</p>
              <ul className="font-mono font-bold">
                <li>- 系统新增搜索论文功能，快去试试吧~</li>
                <li>- 修复了一些已知问题</li>
              </ul>
            </div>
            {/* 2023-03-23 */}
            <div className="h-fit w-full m-0 p-4 pb-6 relative border-l-2 border-blue-400 ">
              {/* 小圆点 */}
              <div className="h-6 w-6 absolute top-4 -left-3 rounded-full bg-blue-300 border-4 border-gray-100"></div>
              {/* 框框内的更新时间与内容 */}
              <p className="font-bold text-sky-700 mb-1">2023-03-23</p>
              <ul className="font-mono font-bold">
                <li>- 系统新增搜索提示功能啦！再也不怕忘记实体名字~</li>
              </ul>
            </div>
            {/* 2023-03-21 */}
            <div className="h-fit w-full m-0 p-4 pb-6 relative border-l-2 border-blue-400 ">
              {/* 小圆点 */}
              <div className="h-6 w-6 absolute top-4 -left-3 rounded-full bg-blue-300 border-4 border-gray-100"></div>
              {/* 框框内的更新时间与内容 */}
              <p className="font-bold text-sky-700 mb-1">2023-03-21</p>
              <ul className="font-mono font-bold">
                <li>- Mirna-Disease 系统终于与大家见面了。</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </CSSTransition>
  );
}
