import React from 'react';
import './index.scss';
import Logo from '../../assets/images/logo.png';
import Recommend from '../recommend';
import Hot from '../hot';
import Search from '../search';
interface IProps {

}

interface IState {
  currentChoose: number
}
class Home extends React.Component<IProps, IState> {
  constructor(props: IProps) {
    super(props)
  }
  public state = {
    currentChoose: 1 // 当前选择 0 代表推荐音乐 1代表热歌榜 1 代表搜索
  }
  public changeNav(index: number) {
    let currentChoose = this.state.currentChoose
    if (currentChoose === index) return;
    this.setState({
      currentChoose: index
    })
    switch (index) {
      case 0:
        break;
      case 1:
        break;
      case 2:
        break;
    }
  }
  render() {
    let { currentChoose } = this.state
    return (
      <div>
        <header className='header'>
          <div className='wrap-header'>
            <img src={Logo} />
            <div className='header-middle'>网易云音乐</div>
            <div className='header-right'>下载APP</div>
          </div>
        </header>
        <nav className='navHeader'>
          <div onClick={() => { this.changeNav(0) }} className='navHeader-item'><span className={currentChoose === 0 ? 'is_active' : ''}>推荐音乐</span></div>
          <div onClick={() => { this.changeNav(1) }} className='navHeader-item'><span className={currentChoose === 1 ? 'is_active' : ''}>热歌榜</span></div>
          <div onClick={() => { this.changeNav(2) }} className='navHeader-item'><span className={currentChoose === 2 ? 'is_active' : ''}>搜索</span></div>
        </nav>
        {currentChoose === 0 ? (
          <Recommend></Recommend>
        ) : null}
        {currentChoose === 1 ? (
          <Hot></Hot>
        ) : null}
        {currentChoose === 2 ? (
          <Search></Search>
        ) : null}
      </div>
    )
  }
}

export default Home;