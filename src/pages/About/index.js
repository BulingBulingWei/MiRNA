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
        mes: "Sent successfully!",
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
              <p className="text-sky-700 font-bold leading-10 pb-3">
                System Introduction:
              </p>
              <p className="font-mono font-bold pb-3 indent-8">
                This system achieves entity recognition of miRNA and diseases in
                literature through rule-based and machine learning methods,
                obtains the entity and corresponding relationship between miRNA
                and diseases, and uses graph neural network-based link
                prediction to deeply analyze the implicit functions and
                information in miRNA and disease data, predicting the
                relationship between miRNA and diseases, I hope to assist
                researchers in finding miRNAs related to diseases in a faster
                and more economical way.
              </p>
              <p className="font-mono font-bold pb-3 indent-8">
                For this purpose, we provide the function of searching for
                relevant relationships. By accurately entering entities in the
                search box, we can see the relationship diagrams of related
                Disagrees and mirnas centered around them, as well as the
                abstract of the paper confirming the relevant relationships. In
                the relationship diagrams, we can also see the possible
                Disagrees or mirnas predicted by our system that may be related
                to them.
              </p>
              <p className="font-mono font-bold pb-3 indent-8">
                At the same time, we also provide a pure paper search function
                to help you more accurately find papers related to search
                keywords. If you want to learn more about the details of papers,
                you also need to click on the link to the original text.
              </p>
              <p className="font-mono font-bold pb-3 indent-8">
                Finally, we hope to bring you a good user experience and provide
                you with effective services. If you have any questions, please
                feel free to contact us.
              </p>
            </div>
            <p className="text-sky-700 font-bold leading-10">
              System update records:
            </p>
            {/* 以下是项目更新历史 */}
            {/* 2023-05-29 */}
            <div className="h-fit w-full m-0 p-4 pb-6 relative border-l-2 border-blue-400 ">
              {/* 小圆点 */}
              <div className="h-6 w-6 absolute top-4 -left-3 rounded-full bg-blue-300 border-4 border-gray-100"></div>
              {/* 框框内的更新时间与内容 */}
              <p className="font-bold text-sky-700 mb-1">2023-05-29</p>
              <ul className="font-mono font-bold">
                <li>
                  -Multiple visualizations of miRNA structures have been added
                </li>
                <li>-Comparison of -3p and -5p added</li>
                <li>-Added a download page for relationship data</li>
              </ul>
            </div>
            {/* 2023-04-01 */}
            <div className="h-fit w-full m-0 p-4 pb-6 relative border-l-2 border-blue-400 ">
              {/* 小圆点 */}
              <div className="h-6 w-6 absolute top-4 -left-3 rounded-full bg-blue-300 border-4 border-gray-100"></div>
              {/* 框框内的更新时间与内容 */}
              <p className="font-bold text-sky-700 mb-1">2023-04-01</p>
              <ul className="font-mono font-bold">
                <li>-Updated many background images on the website</li>
                <li>
                  -Some adjustments have been made to the sequence visualization
                  display of miRNA
                </li>
              </ul>
            </div>
            {/* 2023-03-29 */}
            <div className="h-fit w-full m-0 p-4 pb-6 relative border-l-2 border-blue-400 ">
              {/* 小圆点 */}
              <div className="h-6 w-6 absolute top-4 -left-3 rounded-full bg-blue-300 border-4 border-gray-100"></div>
              {/* 框框内的更新时间与内容 */}
              <p className="font-bold text-sky-700 mb-1">2023-03-29</p>
              <ul className="font-mono font-bold">
                <li>
                  -Relevant confirmed and predicted relationship data can be
                  downloaded now~
                </li>
                <li>
                  -The website pages on mobile devices have also become more
                  user-friendly
                </li>
              </ul>
            </div>
            {/* 2023-03-26 */}
            <div className="h-fit w-full m-0 p-4 pb-6 relative border-l-2 border-blue-400 ">
              {/* 小圆点 */}
              <div className="h-6 w-6 absolute top-4 -left-3 rounded-full bg-blue-300 border-4 border-gray-100"></div>
              {/* 框框内的更新时间与内容 */}
              <p className="font-bold text-sky-700 mb-1">2023-03-26</p>
              <ul className="font-mono font-bold">
                <li>
                  -Added the function of downloading single and multiple papers
                </li>
                <li>-Fixed some known issues</li>
              </ul>
            </div>
            {/* 2023-03-24 */}
            <div className="h-fit w-full m-0 p-4 pb-6 relative border-l-2 border-blue-400 ">
              {/* 小圆点 */}
              <div className="h-6 w-6 absolute top-4 -left-3 rounded-full bg-blue-300 border-4 border-gray-100"></div>
              {/* 框框内的更新时间与内容 */}
              <p className="font-bold text-sky-700 mb-1">2023-03-24</p>
              <ul className="font-mono font-bold">
                <li>
                  -The system has added a search function for papers. Give it a
                  try~
                </li>
                <li>-Fixed some known issues</li>
              </ul>
            </div>
            {/* 2023-03-23 */}
            <div className="h-fit w-full m-0 p-4 pb-6 relative border-l-2 border-blue-400 ">
              {/* 小圆点 */}
              <div className="h-6 w-6 absolute top-4 -left-3 rounded-full bg-blue-300 border-4 border-gray-100"></div>
              {/* 框框内的更新时间与内容 */}
              <p className="font-bold text-sky-700 mb-1">2023-03-23</p>
              <ul className="font-mono font-bold">
                <li>
                  -The system has added a search prompt function! Never be
                  afraid to forget the physical name again~
                </li>
              </ul>
            </div>
            {/* 2023-03-21 */}
            <div className="h-fit w-full m-0 p-4 pb-6 relative border-l-2 border-blue-400 ">
              {/* 小圆点 */}
              <div className="h-6 w-6 absolute top-4 -left-3 rounded-full bg-blue-300 border-4 border-gray-100"></div>
              {/* 框框内的更新时间与内容 */}
              <p className="font-bold text-sky-700 mb-1">2023-03-21</p>
              <ul className="font-mono font-bold">
                <li>
                  -The Mira Disease system has finally been introduced to
                  everyone
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </CSSTransition>
  );
}
