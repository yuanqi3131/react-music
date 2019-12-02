import React from 'react';
import './index.scss';
interface IProps {

}

interface IState { }
class Search extends React.Component<IProps, IState> {
  public render() {
    return (
      <div className='search'>Search</div>
    )
  }
}

export default Search;