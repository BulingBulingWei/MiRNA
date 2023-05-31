import axios from "axios";

export const GetDieaseSearch = "/search/ByDiseaseName";

export const GetMirnaSearch = "/search/ByMirnaName";

//根据类型获取关系图数据
export const GetDiseaseGraphData = "/relation/getDisease";

export const GetMirnaGraphData = "/relation/getMirna";

//获取模糊查询名字
export const GetDiseaseFuzzySearchName = "/disease";

export const GetMirnaFuzzySearchName = "/mirna/GetLikeName";

// 根据message 来检索所有有关message的论文
export const GetArticles = "/article/like";

//获取单篇论文（下载）
export const GetOneArticleDownload = "/download/GetOneArticle/";

//获取本页所有论文（下载）
export const PostArticleListDownload = "/download/GetArticleList";

//联系我们（发送邮件）
export const PostSendMessage = "/email/sendMessage";

//获取mirna的已证实数据（下载）
export const GetRelationShipByMiRNA = "/download/GetRelationShipByMiRNA";

//获取疾病的已证实数据（下载）
export const GetRelationShipByDisease = "/download/GetRelationShipByDisease";

//获取疾病的预测数据（下载）
export const GetCalculateByDisease = "/download/GetCalculateByDisease";

//获取mirna的预测数据（下载）
export const GetCalculateByMiRNA = "/download/GetCalculateByMiRNA";

//获取基因和mirna关系的画图数据
export const GetGeneMirnaRelationship = "/GeneMirnaRelationship/GetByMirnaName";

//根据mirna名字获取5行描述结构的字符串
export const GetMirnaStruct = "/mirnaStruct/GetByMirnaName";

//本月疾病相关论文查询量榜单
export const GetMonthArticleDiseaseTopN = "/record/getMonthArticleDiseaseTopN/";

//本月mirna相关论文查询量榜单
export const GetMonthArticleMiRNATopN = "/record/getMonthArticleMiRNATopN/";

//本月mirna查询量榜单
export const GetMonthMiRNATopN = "/record/getMonthMiRNATopN/";

//本周疾病相关论文查询量榜单
export const GetWeekArticleDiseaseTopN = "/record/getWeekArticleDiseaseTopN/";

//本周mirna相关论文查询量榜单
export const GetWeekArticleMiRNATopN = "/record/getWeekArticleMiRNATopN/";

//本周mirna查询量榜单
export const GetWeekMiRNATopN = "/record/getWeekMiRNATopN/";

//查看mirna结构可视化页面的所有信息
export const GetMirnaAllMessage = "/mirnaStruct/getAllMessage";

//查看mirna结构可视化页面特用的模糊查询接口
export const GetMirnaLikeName = "/mirnaStruct/getMirnaLike";

//根据多种条件下载数据集
export const POSTMirnaRelationshipData = "/relation/getMirnaRelationshipData";

export const PostDownloadRelationshipData = "/download/getMirnaRelationship";
//
export const axiosInstance = axios.create({
  // "proxy": "http://43.139.60.187:9999",
  // http://172.16.103.216:9999
  // baseURL: "/mirna-disease/",
  baseURL: "/",
});
