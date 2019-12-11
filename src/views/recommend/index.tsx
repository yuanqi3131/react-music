import React from 'react';
import './index.scss';
import { reqPersonalized, reqNewSong } from '../../api/interface';
import MusicList from '../../components/musicList';
import { RouteComponentProps, withRouter } from 'react-router-dom';
import { handlerPlayNume } from '../../utils/handlerData';
interface IProps extends RouteComponentProps {
}

interface IState {
  commendList: any,
  newSong: any,
}

class Recommend extends React.Component<IProps, IState> {
  constructor(props: IProps) {
    super(props)
  }
  public state = {
    commendList: [],
    newSong: [],
  }
  componentDidMount() {
    this.getRecommendList()
    this.getNewSong()
  }
  async getRecommendList() {
    // 获得推荐歌单
    let data = await reqPersonalized({ limit: 6 });
    this.setState({
      commendList: data['result']
    })
  }
  async getNewSong() {
    // 获得推荐歌单
    let data = await reqNewSong();
    this.setState({
      newSong: data['result'],
    })
  }
  // public handlerPlayNume(num: number) {
  //   // 处理播放数量
  //   if (num > 99999 && num <= 99999999) {
  //     return (num / 10000).toFixed(1) + '万'
  //   } else if (num > 99999999) {
  //     return (num / 100000000).toFixed(1) + '亿'
  //   } else {
  //     return num
  //   }
  // }
  public render() {
    let { commendList, newSong } = this.state
    return (
      <div className='recommend'>
        <section>
          <div className='header-tilte'>推荐歌单</div>
          <div className='recommend-items'>
            {
              commendList.map(item => {
                return (
                  <div className='recommend-item' onClick={() => { this.props.history.push(`/playlist/${item['id']}`) }} key={item['id']}>
                    <div className='recommend-imgs'>
                      <img className='recommend-ear' src={require('../../assets/svg/ear.svg')} alt="" />
                      <div className='recommend-num'>{handlerPlayNume(item['playCount'])}</div>
                    </div>
                    <img className='recommend-img' src={item['picUrl']} alt="" />
                    <span className='recommend-desc'>{item['name']}</span>
                  </div>
                )
              })
            }
          </div>
        </section>
        <section>
          <div className='header-tilte'>最新音乐</div>
          <MusicList list={newSong}></MusicList>
        </section>
        <footer className='recommend-footer'>
          <div className='wrap-footer' onClick={() => this.props.history.push({ pathname: 'download' })}>
            <div className='footer-logo'>
              <img src={require('../../assets/images/logo_red.png')} alt="" />
              网易云音乐</div>
            <div className='footer-app'>打开APP，发现更多好音乐 ></div>
            <div className='footer-right'>网易公司版权所有©1997-2019   杭州乐读科技有限公司运营</div>
          </div>
        </footer>
      </div>
    )
  }
}

export default withRouter(Recommend);