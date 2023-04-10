import axios from "axios";

export const GetDieaseSearch = "/search/ByDiseaseName";

export const GetMirnaSearch = "/search/ByMirnaName";

//根据类型获取关系图数据
export const GetDiseaseGraphData = "/relation/getDisease";

export const GetMirnaGraphData = "/relation/getMirna";

//获取模糊查询名字
export const GetDiseaseFuzzySearchName = "/disease";

export const GetMirnaFuzzySearchName = "/mirna/GetLikeName";

export const GetArticles = "/article/like";

export const GetOneArticleDownload = "/download/GetOneArticle/";

export const PostArticleListDownload = "/download/GetArticleList";

export const PostSendMessage = "/email/sendMessage";

export const GetRelationShipByMiRNA = "/download/GetRelationShipByMiRNA";

export const GetRelationShipByDisease = "/download/GetRelationShipByDisease";

export const GetCalculateByDisease = "/download/GetCalculateByDisease";

export const GetCalculateByMiRNA = "/download/GetCalculateByMiRNA";

export const GetGeneMirnaRelationship = "/GeneMirnaRelationship/GetByMirnaName";

export const GetMirnaStruct = "/mirnaStruct/GetByMirnaName";

export const GetMonthArticleDiseaseTopN = "/record/getMonthArticleDiseaseTopN/";

export const GetMonthArticleMiRNATopN = "/record/getMonthArticleMiRNATopN/";

export const GetMonthMiRNATopN = "/record/getMonthMiRNATopN/";

export const GetWeekArticleDiseaseTopN = "/record/getWeekArticleDiseaseTopN/";

export const GetWeekArticleMiRNATopN = "/record/getWeekArticleMiRNATopN/";

export const GetWeekMiRNATopN = "/record/getWeekMiRNATopN/";

export const axiosInstance = axios.create({
  // "proxy": "http://43.139.60.187:9999",
  baseURL: "/mirna-disease/",
  // baseURL: "/",
});
