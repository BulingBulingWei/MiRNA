import React from "react";
class index extends React.Component {
  render() {
    return (
      <div className="flex flex-col justify-center items-center w-screen h-screen">
        <p className="text-3xl text-gray-600 font-kaiti xl:text-8xl">
          404 Error!
        </p>
        <div className="h-12 w-full"></div>
        <p className="text-xl text-gray-600 font-kaiti xl:text-4xl">
          Can't find this page...
        </p>
      </div>
    );
  }
}
export default index;
