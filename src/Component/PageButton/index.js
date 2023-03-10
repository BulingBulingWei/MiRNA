import React, { useEffect } from "react";
import { ToastContext, GraphContext } from "../../App";
import Toast from "../toast";

//props: 1.string:显示内容  2.string:背景色

export default function PageButton(props) {
  return (
    <>
      <div className="h-7 w-fit relative px-3 mx-2 rounded bg-gray-50 shadow-md">
        <p className="leading-7 text-center text-gray-600">
          {props.content.toString()}
        </p>
      </div>
    </>
  );
}
