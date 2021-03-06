import React from 'react';
import { withRouter, RouteComponentProps } from 'react-router-dom';
import './index.scss';

interface IProps extends RouteComponentProps {
  list: Array<Object>
}
interface IState {

}

class List extends React.Component<IProps, IState> {
  public render() {
    return (
      <div className='new-items'>
        {
          this.props.list.map(item => {
            return (
              <div key={item['id']} className='new-item' onClick={() => { this.props.history.push(`/play/${item['id']}`) }}>
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
      </div>
    )
  }
}
export default withRouter(List)