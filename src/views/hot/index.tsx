import React from 'react';
import './index.scss';
import { reqHotSong } from '../../api/interface';
interface IProps {
}

interface IState {
  hotList: object,
}
class Hot extends React.Component<IProps, IState> {
  constructor(props: IProps) {
    super(props)
  }
  public state = {
    hotList: {}, //热歌榜列表啊
  }
  componentWillMount() {
    this.getHotList()
  }
  public async getHotList() {
    let data = await reqHotSong({ idx: 1 })
    this.setState({
      hotList: data['playlist'],
    })
  }
  public handlerDate(date?: number) {
    // 处理时间
    if (!date) return
    let time = new Date(date)
    let month = time.getMonth() + 1
    let days = time.getDate()
    return month + '月' + days + '日'
  }
  public render() {
    let { hotList } = this.state
    return (
      <div className='hot'>
        <header className='hot-header'>
          <div className='header-items'>
            <div className='header-img'></div>
            <div className='header-time'>更新时间：{this.handlerDate(hotList['updateTime'])}</div>
          </div>
        </header>
        <section>
          <div className='new-items'>
            {
              Object.keys(hotList).length > 0 ?
                hotList["tracks"].splice(0, 20).map((item: object, index: number) => {
                  return (
                    <div key={item['id']} className='new-item'>
                      <div className='new-index' style={{ color: index <= 2 ? '#df3436' : '#999' }}>{index < 9 ? '0' + (index + 1) : index + 1}</div>
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
        <footer className='hot-footer'>
          查看完整榜单 >
        </footer>
      </div>
    )
  }
}

export default Hot;