import React from 'react';
import { reqSongDetail, reqSongUrl, reqLyric } from '../../api/interface';
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
  }
  public state: IState = {
    detail: {},
    url: '',
    lyric: '',
    lyricList: [],
    currentTime: '',
    currentLyc: 0,
    lycStyle: {}
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
    console.log(result['lrc']['lyric'])
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
  public alreadyPlay(e: any) { // 准备播放触发
  }
  public endPlay(e: any) { // 播放完成触发
  }
  public timeUpdate(e: any) { // 播放位置发生时改变触发
    let currentTime = this.format(document.getElementsByTagName('audio')[0]['currentTime']);
    let { currentLyc, lyricList } = this.state
    for (let i: number = currentLyc; i < lyricList.length; i++) {
      if (lyricList[i + 1] && currentTime < lyricList[i + 1]['time'] && currentTime > lyricList[i]['time']) {
        this.setState({
          currentLyc: i,
          lycStyle: {
            transform: `translateY(-${0.545 * i}rem)`
          }
        })
      }
    }
  }
  public format(value: number) { // 时间转换
    if (!value) return ''
    let interval = Math.floor(value)
    let minute = (Math.floor(interval / 60)).toString().padStart(2, '0')
    let second = (interval % 60).toString().padStart(2, '0')
    return `${minute}:${second}`
  }
  public render() {
    let { detail, url, lyricList, lycStyle, currentLyc } = this.state
    var background = {
      backgroundImage: detail['al'] ? `url(${detail['al']['picUrl']})` : ''
    }
    return (
      <div className='play'>
        <div className='play-header'>
          <div className='header-bk' style={background}></div>
          <div className='header-wrap'>
            <div className='header-disc'>
              <div className='header-content rotate-img'>
                <img src={detail['al'] ? detail['al']['picUrl'] : ''} alt="" />
                <audio
                  autoPlay={true}
                  controls={true}
                  onPlayCapture={(e) => { this.alreadyPlay(e) }}
                  onEnded={(e) => { this.endPlay(e) }}
                  onTimeUpdate={(e) => { this.timeUpdate(e) }}
                  src={url}></audio>
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
        <footer className='play-footer'>
          <span>打开</span>
          <span>下载</span>
        </footer>
      </div>
    )
  }
}

export default MusicPlay