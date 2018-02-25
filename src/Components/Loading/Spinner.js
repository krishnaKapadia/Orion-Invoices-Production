import React, { Component } from 'react';
import bars from './bar.svg';

class Spinner extends Component {

  render() {
    return (
      <div>
        <img src={bars} />
      </div>
    );
  }

}

export default Spinner;
