import React from 'react';
import './index.scss';
import { reqPersonalized, reqNewSong } from '../../api/interface';

interface IProps {

}

interface IState {
  commendList: any,
  newSong: any
}
interface ISonger {
  artists: Array<Object>
}
class Recommend extends React.Component<IProps, IState> {
  constructor(props: IProps) {
    super(props)
  }
  public state = {
    commendList: [],
    newSong: []
  }
  componentDidMount() {
    this.getRecommendList()
    this.getNewSong()
  }
  async getRecommendList() {
    // 获得推荐歌单
    let data = await reqPersonalized({ limit: 6 });
    this.setState({
      commendList: data
    })
  }
  async getNewSong() {
    // 获得推荐歌单
    let data = await reqNewSong();
    this.setState({
      newSong: data
    })
  }
  public handlerPlayNume(num: number) {
    // 处理播放数量
    if (num > 99999 && num <= 99999999) {
      return (num / 10000).toFixed(1) + '万'
    } else if (num > 99999999) {
      return (num / 100000000).toFixed(1) + '亿'
    }
  }
  public render() {
    let { commendList, newSong } = this.state
    return (
      <div>
        <section>
          <div className='header-tilte'>推荐歌单</div>
          <div className='recommend-items'>
            {
              commendList.map(item => {
                return (
                  <div className='recommend-item' key={item['id']}>
                    <div className='recommend-num'>{this.handlerPlayNume(item['playCount'])}</div>
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
          <div>
            {
              newSong.map(item => {
                return (
                  <div key={item['id']}>
                    <div>
                      <div>{item['name']}</div>
                      {
                        1
                        // item['song']['artists']:ISonger.map()
                      }
                    </div>
                    <div></div>
                  </div>
                )
              })
            }
          </div>
        </section>
        <footer>3</footer>
      </div>
    )
  }
}

export default Recommend;