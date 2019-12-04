import React from 'react';
import './index.scss';
import { reqPersonalized, reqNewSong } from '../../api/interface';
import MusicList from '../../components/musicList'

interface IProps {

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
    // artists: []
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
    // let result = new Array().concat(data)
    // result = result.map(v => {
    //   let artists = v.song.artists
    //   if (artists.length > 1) {
    //     let name = artists.reduce((total: string, current: any) => {
    //       return total + current['name'] + '/'
    //     }, '')
    //     return name.substring(0, name.length - 1)
    //   } else {
    //     return artists[0].name
    //   }
    // })
    this.setState({
      newSong: data['result'],
      // artists: data
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
      <div className='recommend'>
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
          <MusicList list={newSong}></MusicList>
          {/* <div className='new-items'>
            {
              newSong.map(item => {
                return (
                  <div key={item['id']} className='new-item'>
                    <div className='new-left'>
                      <div className='new-title'>
                        {item['name']}
                        <span>
                          {new Array().concat(item['song']['alias'])
                            .reduce((total: any, current: string) => {
                              return total = '(' + total + current + ')'
                            }, '')
                          }
                        </span>
                      </div>
                      <div className='new-secTitle'>
                        {
                          new Array().concat(item['song']['artists']).reduce((total: any, current: object) => {
                            return total = total + current['name'] + ' / '
                          }, '').replace(/\s+\/\s+$/g, '') + '-' + item['song']['album']['name']
                        }
                      </div>
                    </div>
                    <div className='new-right'>
                      <span></span>
                    </div>
                  </div>
                )
              })
            }
          </div> */}
        </section>
        <footer className='recommend-footer'>
          <div className='wrap-footer'>
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

export default Recommend;