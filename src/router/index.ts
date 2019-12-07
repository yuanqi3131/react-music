import Home from '../views/home';
import Download from '../views/download';
import MusicPlay from '../views/musicPlay';
import PlayList from '../views/songList';

let router = [
  {
    path: '/', // 首页
    component: Home
  },
  {
    path: '/download', // 下载页
    component: Download
  },
  {
    path: '/play/:id', // 播放页
    component: MusicPlay
  },
  {
    path: '/playlist/:id', // 歌单列表页
    component: PlayList
  },
]

export default router