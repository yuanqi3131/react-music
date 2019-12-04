import React from 'react';
import './index.scss'

class Download extends React.Component {
  constructor(props) {
    super(props)
  }

  public render() {
    return (
      <div className='download'>
        <div className='download-header'>
          <span>若您已安装了网易云音乐，</span>
          <span>↑↑ 请下拉并点击“打开”按钮 ↑↑</span>
        </div>
        <div className='download-open'>
          (若无打开按钮，则<a href="#"> 点此打开</a>)
        </div>
        <div className='download-content'>
          <img className='download-logo' src={require('../../assets/images/logo_white.jpg')} alt="" />
          <div className='download-text'>立即下载</div>
        </div>
      </div>
    )
  }
}


export default Download;