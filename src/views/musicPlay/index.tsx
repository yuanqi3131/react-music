import React from 'react';
import { reqSongDetail, reqSongUrl, reqLyric, reqSimi, reqSimiSong } from '../../api/interface';
import './index.scss'
interface IProps {
}

interface IState {
  detail: object,
  url: string,
  lyric: string, // 歌词
  lyricList: Array<object>, // 歌词数组
  currentTime: any, // audio当前播放时间
  currentLyc: number, // 当前歌词
  lycStyle: object, // 歌词滚动样式
  showPlay: boolean,// 控制播放按钮的展示与隐藏
  playState: string, // running 播放动画 paused暂停动画
  simiList: Array<object>, // 相似歌单
  simiSong: Array<object>
}

class MusicPlay extends React.Component<IProps, IState> {
  constructor(props: IProps) {
    super(props)
  }
  componentWillMount() {
    let id = this.props['match'].params.id
    this.getSongDetail(id)
    this.getSongUrl(id)
    this.getLyric(id)
    this.getSimi(id)
  }
  public state: IState = {
    detail: {},
    url: '',
    lyric: '',
    lyricList: [],
    currentTime: '',
    currentLyc: 0,
    lycStyle: {},
    showPlay: true,
    playState: 'paused',
    simiList: [],
    simiSong: []
  }
  public async getSongDetail(id: number) { // 获得歌曲详情
    let result = await reqSongDetail({ ids: id })
    this.setState({
      detail: result['songs'][0]
    })
  }
  public async getSongUrl(id: number) { // 获得mp3
    let result = await reqSongUrl({ id })
    this.setState({
      url: result.data[0]['url']
    })
  }
  public async getLyric(id: number) { // 获得歌词
    let result = await reqLyric({ id })
    let lyricList = this.state.lyricList
    result['lrc']['lyric'].split(/[\n]/)
      .forEach(item => {
        let temp: Array<string> = item.split(/\[(.+?)\]/)
        lyricList.push(
          {
            time: temp[1],
            lyc: temp[2]
          })
      })
    lyricList = lyricList.filter(v => v['lyc'])
    this.setState({
      lyric: result['lrc']['lyric'],
      lyricList
    })
  }
  public async getSimi(id: number) {
    let result = await reqSimi({ id })
    this.setState({
      simiList: result['playlists']
    })
  }
  public async getSimiSong(id: number) {
    let result = await reqSimiSong({ id })
    // this.setState({
    //   simiSongs: result['playlists']
    // })
  }
  public alreadyPlay(e: any) { // 准备播放触发
    this.setState({
      showPlay: false,
      playState: "running"
    })
  }
  public endPlay(e: any) { // 播放完成触发
    this.setState({
      currentLyc: 0,
      showPlay: true,
      playState: 'paused',
      lycStyle: {
        transform: 'translateY(0px)'
      }
    })
  }
  public timeUpdate(e: any) { // 播放位置发生时改变触发
    let currentTime = this.format(document.getElementsByTagName('audio')[0]['currentTime']);
    let { currentLyc, lyricList } = this.state
    var total = 0;
    for (let i: number = currentLyc; i < lyricList.length; i++) {
      if ((lyricList[i + 1] && currentTime > lyricList[i]['time'] && currentTime < lyricList[i + 1]['time'])
        || (i === lyricList.length - 1 && currentTime > lyricList[i]['time'])) {
        let clientHeight = document.getElementsByClassName('play-wrap-lyc')[0]['childNodes'][i]['clientHeight']
        let height
        if (clientHeight <= 35) {
          height = 0.546 * i + total
        } else {
          let temp = clientHeight / parseFloat(document.documentElement.style.fontSize.slice(0, -2))
          console.log('temp:' + temp)
          height = 0.546 * i + total + temp
          total = total + temp
        }
        console.log("total:" + total)
        this.setState({
          currentLyc: i,
          lycStyle: {
            transform: `translateY(-${height}rem)`
          }
        })
      }
    }
  }
  public pausePlay() {
    // 暂停播放以及播放 rotate-img
    let showPlay = this.state.showPlay
    let audio = document.getElementsByTagName('audio')[0]
    if (showPlay) {
      audio.play()
      this.setState({
        playState: 'running'
      })
    } else {
      audio.pause()
      this.setState({
        playState: 'paused'
      })
    }
    this.setState({
      showPlay: !showPlay
    })
  }
  public format(value: number) { // 时间转换
    if (!value) return ''
    let interval = Math.floor(value)
    let minute = (Math.floor(interval / 60)).toString().padStart(2, '0')
    let second = (interval % 60).toString().padStart(2, '0')
    return `${minute}:${second}`
  }
  public handlerPlayNume(num: number) {
    // 处理播放数量
    if (num > 99999 && num <= 99999999) {
      return (num / 10000).toFixed(1) + '万'
    } else if (num > 99999999) {
      return (num / 100000000).toFixed(1) + '亿'
    } else {
      return num
    }
  }
  public render() {
    let { detail, url, lyricList, lycStyle, currentLyc, showPlay, playState, simiList } = this.state
    var background = {
      backgroundImage: detail['al'] ? `url(${detail['al']['picUrl']})` : ''
    }
    return (
      <div className='play'>
        <div className='play-scroll'>
          <div className='play-wrap' onClick={() => { this.pausePlay() }}>
            <div className='play-header'>
              <div className='header-bk' style={background}></div>
              <div className='header-wrap'>
                <div className='header-disc'>
                  <div className='header-content rotate-img' style={{ animationPlayState: playState }}>
                    <img src={detail['al'] ? detail['al']['picUrl'] : ''} alt="" />
                    <audio
                      autoPlay={true}
                      controls={true}
                      onPlayCapture={(e) => { this.alreadyPlay(e) }}
                      onEnded={(e) => { this.endPlay(e) }}
                      onTimeUpdate={(e) => { this.timeUpdate(e) }}
                      src={url}></audio>
                  </div>
                  <div className='header-play' style={!showPlay ? { display: 'none' } : {}}>
                    <img src={require('../../assets/images/play_btn_3x.png')} alt="" />
                  </div>
                </div>
              </div>
              <div className='play-content'>
                <div className='content-title'>{detail['name']} -&nbsp;
              {
                    new Array().concat(detail['ar']).map(item => {
                      if (item) {
                        return (<span key={item['id']}>{item['name']}</span>)
                      }
                    })
                  }
                </div>
                <div className='play-lyc'>
                  <div className='play-wrap-lyc' style={lycStyle}>
                    {
                      lyricList.map((item, index) => {
                        return (
                          <p style={currentLyc === index ? { color: '#fff' } : {}} key={index}>{item['lyc']}</p>
                        )
                      })
                    }
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className='view-all'>
            <div className='all-desc'>查看完整歌词></div>
            <div className='all-img'></div>
          </div>
          <div className='simi-content'>
            <h2>包含这首歌的歌单</h2>
            <div className='simi-items'>
              {
                simiList.map(item => {
                  return (
                    <div className='simi-item' key={item['id']}>
                      <div className='simi-imgs'>
                        <img className='simi-ear' src={require('../../assets/svg/ear.svg')} alt="" />
                        <div className='simi-num'>{this.handlerPlayNume(item['playCount'])}</div>
                      </div>
                      <img className='simi-img' src={item['coverImgUrl']} alt="" />
                      <span className='simi-desc'>{item['name']}</span>
                      <span className='simi-sec'>by {item['creator']['nickname']}</span>
                    </div>
                  )
                })
              }
            </div>
          </div>
        </div>
        <footer className='play-footer'>
          <span>打开</span>
          <span>下载</span>
        </footer>
      </div>
    )
  }
}

export default MusicPlay