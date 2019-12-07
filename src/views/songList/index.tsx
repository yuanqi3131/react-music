import React from 'react';
import './index.scss';
import { reqListDetail } from '../../api/interface';
interface IProps {

}

interface IState {
  detail: object, // 歌单详情
}
class SongList extends React.Component<IProps, IState> {
  constructor(props: IProps) {
    super(props)
  }

  public state: IState = {
    detail: {}
  }

  componentWillMount() {
    let id = this.props['match'].params.id;
    this.getListDetail(id)
  }
  public async getListDetail(id: number) {
    // 获得歌单详情
    let result = await reqListDetail({ id })
    this.setState({
      detail: result['playlist']
    })
  }
  public render() {
    let { detail } = this.state
    return (
      <div className='list'>
        <header className='list-header' style={{ backgroundImage: `url(${detail['coverImgUrl']})` }}>
          <div className='header-left'>
            <img className='left-img' src={detail['coverImgUrl']} alt="" />
          </div>
          <div className='header-right'>
            <span>{detail['name']}</span>
            <div className='right-userInfo'>
              <img src={detail['creator'] ? detail['creator']['avatarUrl'] : ''} alt="" />
              <span>{detail['creator'] ? detail['creator']['nickname'] : ''}</span>
            </div>
          </div>
        </header>
        <section className='list-section'>
          <div className='section-tags'>标签：{new Array().concat(detail['tags']).map((item: string, index: number) => {
            return (<span className='section-tag' key={index}>{item}</span>)
          })}</div>
          <div className='section-desc'>简介：{detail['description']}
            <img className='section-arrow' src={require('../../assets/images/arrow_bottom.png')} alt="" />
          </div>
        </section>
        <footer></footer>
      </div>
    )
  }
}

export default SongList;