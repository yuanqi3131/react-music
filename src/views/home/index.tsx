import React from 'react';
import './index.scss';
import Logo from '../../assets/images/logo.png';
import Recommend from '../recommend';
interface IProps {

}

interface IState {

}
class Home extends React.Component<IProps, IState> {
  render() {
    return (
      <div>
        <header className='header'>
          <img src={Logo} />
          <div className='header-middle'>网易云音乐</div>
          <div className='header-right'>下载APP</div>
        </header>
        <section className='navHeader'>
          <div className='navHeader-item'><span className='is_active'>推荐音乐</span></div>
          <div className='navHeader-item'><span>热歌榜</span></div>
          <div className='navHeader-item'><span>搜索</span></div>
        </section>
        <Recommend></Recommend>
      </div>
    )
  }
}

export default Home;