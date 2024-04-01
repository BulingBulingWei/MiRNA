import { useContext } from "react";
import axios from "axios";
import { ToastContext } from "../App";

export const imageBedBaseUrl =
  "https://gitee.com/jackfs/PictureStore/raw/master/";

export const axiosInstance = axios.create({
  // baseURL: `/mirna-disease/`,
  baseURL: `/`,
  headers: {
    token: `MirTarDis`,
  },
});

axios.interceptors.response.use(
  function (response) {
    // 对响应数据做点什么
    const data = response.data;
    console.log("success");
    return response;
  },
  function (error) {
    console.log("error");
    // 对响应错误做点什么
    // 1. http 状态码非2开头（没有额外定义 validateStatus）的都会进来这里，如 404, 500 等，error 的数据结构如下：error-400、error-500
    // 2. 取消请求也会进入这里，可以用 axios.isCancel(error) 来判断是否是取消请求，error 的数据结构如下：cancel-error
    // 3. 请求运行有异常也会进入这里，如故意将 headers 写错：axios.defaults.headers = '123'
    // 4. 断网，error 的数据结构如下：network-error
    const toastController = useContext(ToastContext);
    if (error && error.response) {
      switch (error.response.status) {
        case 400:
          error.message = "请求错误(400)";
          break;
        case 401:
          error.message = "未授权，请重新登录(401)";
          break;
        case 403:
          error.message = "拒绝访问(403)";
          break;
        case 404:
          error.message = "请求出错(404)";
          break;
        case 408:
          error.message = "请求超时(408)";
          break;
        case 500:
          error.message = "服务器错误(500)";
          break;
        case 501:
          error.message = "服务未实现(501)";
          break;
        case 502:
          error.message = "网络错误(502)";
          break;
        case 503:
          error.message = "服务不可用(503)";
          break;
        case 504:
          error.message = "网络超时(504)";
          break;
        case 505:
          error.message = "HTTP版本不受支持(505)";
          break;
        default:
          error.message = `连接出错(${error.response.status})!`;
      }
    } else {
      error.message = "连接服务器失败!";
    }

    toastController({
      mes: error.message,
      timeout: 1000,
    });

    return Promise.resolve(error);
  }
);

export const GetDieaseSearch = `/search/ByDiseaseName`;

export const GetMirnaSearch = `/search/ByMirnaName`;

//根据类型获取关系图数据
export const GetDiseaseGraphData = `/relation/getDisease`;

export const GetMirnaGraphData = `/relation/getMirna`;

//获取模糊查询名字
export const GetDiseaseFuzzySearchName = `/disease`;

export const GetMirnaFuzzySearchName = `/mirna/GetLikeName`;

// 根据message 来检索所有有关message的论文
export const GetArticles = `/article/like`;

//获取单篇论文（下载）
export const GetOneArticleDownload = `/download/GetOneArticle/`;

//获取本页所有论文（下载）
export const PostArticleListDownload = `/download/GetArticleList`;

//联系我们（发送邮件）
export const PostSendMessage = `/email/sendMessage`;

//获取mirna的已证实数据（下载）
export const GetRelationShipByMiRNA = `/download/GetRelationShipByMiRNA`;

//获取疾病的已证实数据（下载）
export const GetRelationShipByDisease = `/download/GetRelationShipByDisease`;

//获取疾病的预测数据（下载）
export const GetCalculateByDisease = `/download/GetCalculateByDisease`;

//获取mirna的预测数据（下载）
export const GetCalculateByMiRNA = `/download/GetCalculateByMiRNA`;

//获取基因和mirna关系的画图数据
export const GetGeneMirnaRelationship = `/GeneMirnaRelationship/GetByMirnaName`;

//根据mirna名字获取5行描述结构的字符串
export const GetMirnaStruct = `/mirnaStruct/GetByMirnaName`;

//本月疾病相关论文查询量榜单
export const GetMonthArticleDiseaseTopN = `/record/getMonthArticleDiseaseTopN/`;

//本月mirna相关论文查询量榜单
export const GetMonthArticleMiRNATopN = `/record/getMonthArticleMiRNATopN/`;

//本月mirna查询量榜单
export const GetMonthMiRNATopN = `/record/getMonthMiRNATopN/`;

//本周疾病相关论文查询量榜单
export const GetWeekArticleDiseaseTopN = `/record/getWeekArticleDiseaseTopN/`;

//本周mirna相关论文查询量榜单
export const GetWeekArticleMiRNATopN = `/record/getWeekArticleMiRNATopN/`;

//本周mirna查询量榜单
export const GetWeekMiRNATopN = `/record/getWeekMiRNATopN/`;

//查看mirna结构可视化页面的所有信息
export const GetMirnaAllMessage = `/mirnaStruct/getAllMessage`;

//查看mirna结构可视化页面特用的模糊查询接口
export const GetMirnaLikeName = `/mirnaStruct/getMirnaLike`;

//根据多种条件下载数据集
export const POSTMirnaRelationshipData = `/relation/getMirnaRelationshipData`;

export const PostDownloadRelationshipData = `/download/getMirnaRelationship`;

//下载指定文件（download页面）
export const GetDownloadStaticData = (fileName) => `/staticData/${fileName}`;

// 模糊查询mirna-drug数据下载页面的mirna
export const GetMirnaFuzzyName = `/rna/medicine/search/byRnaName`;

// 模糊查询mirna-drug数据下载页面的drug
export const GetDrugFuzzyName = `/rna/medicine/search/byDrug`;

// 根据参数获取rna和药物关联关系接口
export const GetMirnaDrugRelData = `/rna/medicine/info`;

// 下载rna和药物关联数据api
export const GetMirnaDrugRelDataDownload = `/download/rna/medicine/relationship`;

// 模糊查询基因名字
export const GetGeneFuzzyName = `/gene/search/byGene`;

//根据基因名字获取详细信息
export const GetGeneInfo = `/gene/name`;

//根据药物名字获取详细信息
export const GetDrugInfo = `/rna/medicine/detail/byName`;
