import React from 'react';
import './index.scss';
import { reqListDetail, reqListComment, reqAlbum } from '../../api/interface';
import { withRouter, RouteComponentProps } from 'react-router-dom';
import { handlerPlayNume } from '../../utils/handlerData';
interface IProps extends RouteComponentProps {

}

interface IState {
  detail: object, // 歌单详情
  comment: object, // 评论
  showMore: boolean, // 展示更多简介
}
class SongList extends React.Component<IProps, IState> {
  constructor(props: IProps) {
    super(props)
  }

  public state: IState = {
    detail: {},
    comment: {},
    showMore: false
  }

  componentWillMount() {
    let id = this.props['match']['params']['id'];
    this.getListDetail(id)
    this.getListComment(id)
  }
  public async getListDetail(id: number) {
    // 获得歌单详情
    let result = await reqListDetail({ id })
    this.setState({
      detail: result['playlist']
    })
  }
  public async getListComment(id: number) {
    // 获得歌单详情
    let result = await reqListComment({ id })
    this.setState({
      comment: result
    })
  }
  public showIntro() {
    // 展示更多简介或者隐藏简介
    let showMore = this.state.showMore
    this.setState({
      showMore: !showMore
    })
  }
  public render() {
    let { detail, comment, showMore } = this.state
    return (
      <div className='list'>
        <div>
          <div className='list-header'>
            <div className='header-bk' style={detail['coverImgUrl'] ? { backgroundImage: `url(${detail['coverImgUrl']})` } : {}}>
            </div>
            <div className='header-content'>
              <div className='header-left'>
                <img className='left-img' src={detail['coverImgUrl']} alt="" />
                <div className='left-imgs'>
                  <img className='left-ear' src={require('../../assets/svg/ear.svg')} alt="" />
                  <div className='left-num'>{handlerPlayNume(detail['playCount'])}</div>
                </div>
              </div>
              <div className='header-right'>
                <span>{detail['name']}</span>
                <div className='right-userInfo'>
                  <img src={detail['creator'] ? detail['creator']['avatarUrl'] : ''} alt="" />
                  <span>{detail['creator'] ? detail['creator']['nickname'] : ''}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        <section className='list-section'>
          <div className='section-tags'>标签：{new Array().concat(detail['tags']).map((item: string, index: number) => {
            return (<span className='section-tag' key={index}>{item}</span>)
          })}</div>
          <div onClick={() => { this.showIntro() }}>
            <div className={showMore ? 'section-desc' : 'section-desc section-desc-clapm'}>简介：{detail['description']}
            </div>
            {
              !showMore ?
                <img className='section-arrow' src={require('../../assets/images/arrow_bottom.png')} alt="" /> :
                <img className='section-arrow' src={require('../../assets/images/arrow_top.png')} alt="" />
            }
          </div>
        </section>
        <section className='list-section1'>
          <div className='list-title'>
            歌曲列表
          </div>
          <div className='new-items'>
            {
              Object.keys(detail).length > 0 ?
                detail["tracks"].map((item: object, index: number) => {
                  return (
                    <div key={item['id']} className='new-item' onClick={() => { this.props.history.push(`/play/${item['id']}`) }}>
                      <div className='new-index' style={{ color: '#999' }}>{index + 1}</div>
                      <div className='new-left'>
                        <div className='new-title'>
                          {item['name']}
                          <span>
                            {new Array().concat(item['alia'])
                              .reduce((total: any, current: string) => {
                                return total = '(' + total + current + ')'
                              }, '')
                            }
                          </span>
                        </div>
                        <div className='new-secTitle'>
                          {
                            new Array().concat(item['ar']).reduce((total: any, current: object) => {
                              return total = total + current['name'] + ' / '
                            }, '').replace(/\s+\/\s+$/g, '') + '-' + item['al']['name']
                          }
                        </div>
                      </div>
                      <div className='new-right'>
                        <span></span>
                      </div>
                    </div>
                  )
                }) : null
            }
          </div>
        </section>
        <section className='comment-section'>
          <div className='list-title'>
            最新评论({comment['total']})
          </div>
          {
            new Array().concat(comment['hotComments']).map((item, index) => {
              return (
                !item ? null :
                  <div className='comment-item' key={index}>
                    <div className='item-left'>
                      <img src={item['user']['avatarUrl']} alt="" />
                    </div>
                    <div className='item-right'>
                      <div className='right-top'>
                        <div className='top-top'>
                          <div>{item['user']['nickname']}</div>
                          <div>{item['time']}</div>
                        </div>
                        <div className='top-bottom' onClick={() => this.props.history.push({ pathname: '/download' })}>
                          <span>{item['likedCount']}</span>
                          <img src={require('../../assets/images/like.png')} alt="" />
                        </div>
                      </div>
                      <div className='right-bottom'>{item['content']}</div>
                    </div>
                  </div>
              )
            })
          }
        </section>
        <div className='view-all' onClick={() => this.props.history.push({ pathname: '/download' })}>查看全部{comment['total']}条评论 ></div>
        <div className='footer-mask'></div>
        <footer className='list-footer' onClick={() => this.props.history.push({ pathname: '/download' })}>
          <div className='footer-item'>
            <img src={require('../../assets/images/logo.png')} alt="" />
            <span>收藏歌单</span>
          </div>
        </footer>
      </div>
    )
  }
}

export default withRouter(SongList);