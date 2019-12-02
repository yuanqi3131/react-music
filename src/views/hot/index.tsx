import React from 'react';
import './index.scss';
interface IProps {

}

interface IState { }
class Hot extends React.Component<IProps, IState> {
  public render() {
    return (
      <div className='hot'>Hot</div>
    )
  }
}

export default Hot;