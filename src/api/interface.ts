import { get, post } from './http';

export const reqPersonalized = (obj: object) => get('/personalized', obj); // 请求推荐歌单
export const reqNewSong = () => get('/personalized/newsong'); // 请求推荐最新音乐