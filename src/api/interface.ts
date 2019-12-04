import { get, post } from './http';

interface IRank {
  idx: number
}
interface ISearch {
  keywords: string
}
export const reqPersonalized = (obj: object) => get('/personalized', obj); // 请求推荐歌单
export const reqNewSong = () => get('/personalized/newsong'); // 请求推荐最新音乐
export const reqHotSong = (obj: IRank) => get('/top/list', obj); // 请求排行榜 
export const reqHotDetail = () => get('/search/hot/detail'); // 请求热搜列表
export const reqSearchSuggest = (obj: ISearch) => get('/search/suggest', obj); // 请求搜索建议
export const reqSearch = (obj: ISearch) => get('/search', obj); // 请求搜索
export const reqSearchMultimatch = (obj: ISearch) => get('/search/multimatch', obj); // 搜索多重匹配