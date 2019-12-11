import React from 'react';
import './index.scss';
import { reqHotDetail, reqSearchSuggest, reqSearch, reqSearchMultimatch } from '../../api/interface';
import { setLocaStorage, getLocaStorage } from '../../utils/locaStorage';
import { withRouter, RouteComponentProps } from 'react-router-dom';
interface IProps extends RouteComponentProps {

}

interface IState {
  hotDetail: any,
  showClose: boolean, // 控制删除按钮的展示隐藏
  searchSuggest: any, // 搜索建议
  searchValue: string, // 搜索的值
  searchList: any, //搜索列表
  searchMultimatch: object, // 多重匹配
  status: number, // 状态用于区分不同区域的展示 0 代表原始状态 1代表出现 搜索建议 2 代表搜索列表
  searchHistory: Array<object>, // 搜索历史
  showLoading: boolean, // 展示加载loading
  limit: number,
  offset: number,
  showFee: boolean, // 展示付费
}
class Search extends React.Component<IProps, IState> {
  constructor(props: IProps) {
    super(props)
  }

  public state: IState = {
    hotDetail: [],
    showClose: false,
    searchSuggest: [],
    searchValue: '',
    searchList: [],
    searchMultimatch: {},
    status: 0,
    searchHistory: [],
    showLoading: false,
    limit: 20,
    offset: 0,
    showFee: false
  }

  componentWillMount() {
    this.getHotDetail()
    this.setState({
      searchHistory: this.getSearchHistory()
    })
  }
  componentDidMount() {
    document.addEventListener('keydown', this.search.bind(this)) // 添加回车事件
    document.addEventListener('scroll', this.scroll.bind(this))
  }
  componentWillUnmount() {
    document.removeEventListener('keydown', this.search.bind(this)) // 页面销毁 移除事件
    document.removeEventListener('scroll', this.scroll.bind(this))
  }
  public getSearchHistory() {
    let history = getLocaStorage('search_history')
    return history
  }
  public search(e?: any) {
    if (e['keyCode'] === 13 || e === 'click') {
      let searchValue = this.state.searchValue
      if (!searchValue) return;
      this.setState({
        status: 2,
        searchList: []
      })
      let history = this.getSearchHistory()
      for (let i = 0; i < history.length; i++) { // 去除相同的搜索
        if (history[i].searchValue === searchValue) {
          history.splice(i, 1)
          i--;
        }
      }
      history.splice(0, 0, { searchValue })
      setLocaStorage('search_history', history)
      this.getSearchList()
      this.getSearchMultimatch(searchValue)
    }
  }
  public scroll() { // 监听滚动
    let ele = document.documentElement; // 获得html
    let scrollTop = ele.scrollTop; // 向上滚动的高度
    let scrollHeight = ele.scrollHeight; // 滚动内容区域总高度
    let clientHeight = ele.clientHeight; // 可见高度
    let { showClose, offset } = this.state
    if (showClose && clientHeight + scrollTop >= scrollHeight) {
      this.setState({
        offset: ++offset
      }, () => {
        this.getSearchList()
      })
    }
  }
  public async getHotDetail() {
    // 获取热门搜索列表
    let data = await reqHotDetail();
    this.setState({
      hotDetail: data['data']
    })
  }
  public async inputChange(event: any) {
    let value = event.target.value
    this.setState({
      searchValue: value
    })
    if (value) {
      this.setState({
        showClose: true,
        status: 1
      })
    } else {
      this.setState({
        showClose: false,
        searchSuggest: [],
        status: 0,
        searchHistory: this.getSearchHistory()
      })
      return
    }
    this.getSearchSuggest(value)
  }
  public async getSearchSuggest(value: string) { // 获得搜索建议
    let result = await reqSearchSuggest({ keywords: value })
    this.setState({
      searchSuggest: result['result']['songs']
    })
  }
  public async getSearchList() {
    // 获得搜索列表
    let { limit, offset, searchList, searchValue } = this.state
    let result = await reqSearch({ keywords: searchValue, limit, offset })
    this.setState({
      searchList: searchList.concat(result['result']['songs'])
    })
  }
  public async getSearchMultimatch(value: string) { // 获得多重匹配列表
    let result = await reqSearchMultimatch({ keywords: value })
    this.setState({
      searchMultimatch: result['result'],
      searchSuggest: []
    })
  }
  public setHighLight(value: string) {
    // 设置高亮标签
    if (!value) return value;
    let searchValue = this.state.searchValue
    let reg = new RegExp(searchValue, 'gi')
    return value.replace(reg, `<span class="highlight">${searchValue.toUpperCase()}</span>`)
  }
  public clearSearch() {
    this.setState({
      searchValue: '',
      showClose: false,
      status: 0,
      searchHistory: this.getSearchHistory(),
      searchList: []
    })
    this.getHotDetail()
  }
  public clickSearch(keyword: string) {
    this.setState({
      searchValue: keyword,
      showClose: true
    }, () => {
      this.search('click')
    })
  }
  public goToPlay(item) {
    if (item['fee'] === 4 || item['fee'] === 1) {
      // 收费
      this.setState({
        showFee: true
      })
      return
    }
    this.props.history.push(`/play/${item['id']}`)
  }
  public closeFee(e) {
    // 关闭收费框
    this.setState({
      showFee: false
    })
  }
  public render() {
    let { hotDetail, showClose, searchSuggest, searchValue, status,
      searchList, searchMultimatch, searchHistory, showLoading, showFee } = this.state
    return (
      <div className='search'>
        <header className='search-header'>
          <div className='wrap-header'>
            <img className='header-icon' src={require('../../assets/svg/search.svg')} alt="" />
            <input className='header-input' value={searchValue} onChange={(e) => { this.inputChange(e) }} type="text" placeholder='搜索歌曲、歌手、专辑' />
            {
              showClose ?
                <img className='header-close' onClick={() => { this.clearSearch() }} src={require('../../assets/svg/close.svg')} alt="" />
                : null
            }
          </div>
        </header>
        <main>
          {
            status === 0 ?
              <div>
                <div className='hot'>
                  <div className='hot-title'>热门搜索</div>
                  <div className='hot-items'>
                    {
                      hotDetail.map((item, index) => {
                        return (
                          <div className='hot-item' onClick={() => this.clickSearch(item['searchWord'])} key={index}>
                            {item['searchWord']}
                          </div>
                        )
                      })
                    }
                  </div>
                </div>
                <div className='history-items'>
                  {
                    searchHistory.map((item: object, index: number) => {
                      return (
                        <div className='history-item' onClick={() => this.clickSearch(item['searchValue'])} key={index}>
                          <div className='history-left'>
                            <img src={require('../../assets/svg/history.svg')} alt="" />
                          </div>
                          <div className='history-desc'>{item['searchValue']}</div>
                          <div className='history-right'>
                            <img src={require('../../assets/svg/close1.svg')} alt="" />
                          </div>
                        </div>
                      )
                    })
                  }
                </div>
              </div>
              : null
          }
          {
            status === 1 ?
              <div className='search-suggest'>
                <div onClick={() => { this.search('click') }} className='suggest-current'>搜索“{searchValue}”</div>
                <div className='suggest-items'>
                  {
                    searchSuggest.map(item => {
                      return (<div key={item['id']} className='suggest-item'>
                        <img src={require('../../assets/svg/search.svg')} alt="" />
                        {item['name']}
                      </div>)
                    })
                  }
                </div>
              </div>
              : null
          }
          {
            status === 2 ?
              <div className='search-area'>
                <div className='search-title'>最佳匹配</div>
                <div className='search-top2'>
                  {
                    searchMultimatch['mv'] ? searchMultimatch['mv'].map(item => {
                      return (
                        <div className='top2-items' key={item['id']}>
                          <div className='items-left'>
                            <img src={item['cover']} alt="" />
                            <img className='items-play' src={require('../../assets/svg/play.svg')} alt="" />
                          </div>
                          <div className='items-content'>
                            <div>MV：<span dangerouslySetInnerHTML={{ __html: this.setHighLight(item['name']) }}></span></div>
                            <div dangerouslySetInnerHTML={{ __html: this.setHighLight(item['artistName']) }} className='content-songer'></div>
                          </div>
                          <div className='items-right'>
                            <img src={require('../../assets/svg/arrow.svg')} alt="" />
                          </div>
                        </div>
                      )
                    }) : null
                  }
                </div>
                <div className='search-top1'>
                  {
                    searchMultimatch['album'] ? searchMultimatch['album'].map(item => {
                      return (
                        <div className='top1-items' key={item['id']}>
                          <div className='items-left'>
                            <img src={item['picUrl']} alt="" />
                          </div>
                          <div className='items-content'>
                            <div>专辑：<span dangerouslySetInnerHTML={{ __html: this.setHighLight(item['name']) }}></span> {item['alias'].map((item: string, index: number) => { return (<span key={index} dangerouslySetInnerHTML={{ __html: this.setHighLight(item) }}></span>) })}</div>
                            <div dangerouslySetInnerHTML={{ __html: this.setHighLight(item['artist']['name']) }} className='content-songer'></div>
                          </div>
                          <div className='items-right'>
                            <img src={require('../../assets/svg/arrow.svg')} alt="" />
                          </div>
                        </div>
                      )
                    }) : null
                  }
                </div>
                <div className='search-top1'>
                  {
                    searchMultimatch['artist'] ? searchMultimatch['artist'].map(item => {
                      return (
                        <div className='top1-items' key={item['id']}>
                          <div className='items-left'>
                            <img src={item['img1v1Url']} alt="" />
                          </div>
                          <div className='items-content'>
                            <div>歌手：<span dangerouslySetInnerHTML={{ __html: this.setHighLight(item['name']) }}></span> {item['alias'].map((item: string, index: number) => { return (<span key={index} dangerouslySetInnerHTML={{ __html: this.setHighLight(item) }}></span>) })}</div>
                          </div>
                          <div className='items-right'>
                            <img src={require('../../assets/svg/arrow.svg')} alt="" />
                          </div>
                        </div>
                      )
                    }) : null
                  }
                </div>
                <div className='new-items'>
                  {
                    searchList.map((item: object, index: number) => {
                      return (
                        <div key={index} className='new-item' onClick={() => { this.goToPlay(item) }}>
                          <div className='new-left'>
                            <div className='new-title'>
                              <span dangerouslySetInnerHTML={{ __html: this.setHighLight(item['name']) }}></span>
                              <span className='title-sec'>
                                {new Array().concat(item['alias'])
                                  .reduce((total: any, current: string) => {
                                    return total = '(' + total + current + ')'
                                  }, '')
                                }
                              </span>
                            </div>
                            <div className='new-secTitle'>
                              <span dangerouslySetInnerHTML={{
                                __html: this.setHighLight(item['artists'].reduce((total: any, current: object) => {
                                  return total = total + current['name'] + ' / '
                                }, '').replace(/\s+\/\s+$/g, '') + '-' + item['album']['name'])
                              }}>

                              </span>
                            </div>
                          </div>
                          <div className='new-right'>
                            <span></span>
                          </div>
                        </div>
                      )
                    })
                  }
                </div>
                {
                  showLoading ?
                    <div className='loading'>
                      <img src={require('../../assets/images/loading.gif')} alt="" />
                      <span>正在加载...</span>
                    </div>
                    : null
                }
              </div>
              : null
          }
        </main>
        {
          showFee ?
            <div>
              <div className='mask' onClick={(e) => { this.closeFee(e) }}>
              </div>
              <div className='mask-content'>
                <div className='content-header'>
                  <img className='content-bk' src={require('../../assets/images/fee.png')} alt="" />
                  <img onClick={(e) => { this.closeFee(e) }} className='content-close' src={require('../../assets/svg/close.svg')} alt="" />
                </div>
                <div className='content-content'>
                  <div>唱片公司要求该歌曲须付费，开通音乐包后即可畅听~</div>
                  <div className='content-button' onClick={() => this.props.history.push({ pathname: '/download' })}>立即开通</div>
                </div>
              </div>
            </div>
            : null
        }
      </div>
    )
  }
}

export default withRouter(Search);