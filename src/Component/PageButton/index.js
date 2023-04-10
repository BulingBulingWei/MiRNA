import React from "react";

//props: 1.string:显示内容  2.string:背景色

export default function PageButton(props) {
  return (
    <>
      <div
        className="h-7 w-fit relative rounded bg-gray-50 shadow-md
      px-1 mx-1 xl:px-2 2xl:px-3 2xl:mx-2 "
        onClick={props.onClick}
      >
        <p className="leading-7 text-center text-gray-600">{props.content}</p>
      </div>
    </>
  );
}
