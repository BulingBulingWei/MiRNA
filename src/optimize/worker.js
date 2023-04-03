// 初始化关系图数据
const relationData = [];

// 监听主线程发过来的消息
// eslint-disable-next-line no-restricted-globals
self.onmessage = ({ data }) => {
  if (data.type === "relationData") {
    // 将数据返回给主线程
    // eslint-disable-next-line no-restricted-globals
    self.postMessage({
      type: "relationData",
      relationData,
    });
  }
};
