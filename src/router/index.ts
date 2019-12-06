import Home from '../views/home';
import Download from '../views/download';
import MusicPlay from '../views/musicPlay';

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
]

export default router