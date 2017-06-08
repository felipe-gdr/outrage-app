import React, { Component } from 'react';
import PubNub from 'pubnub';

import './App.css';

import logo from './images/banana.png';
import quietImage from './images/quiet.png';
import busyImage from './images/busy.png';

class App extends Component {
  constructor() {
    super();
    this.state = {
      count: 0,
      status: 'unknown'
    }
  }

  componentDidMount() {
    const pubnub = new PubNub({
      publishKey : 'pub-c-9d6ee88e-477d-4372-b81d-a87d8b81794c',
      subscribeKey : 'sub-c-815cccf0-3c67-11e7-a8ad-0619f8945a4f',
      restore: true
    });

    const self = this;

    pubnub.addListener({
        message: function(message) {
          console.log(message);
          self.setState({count: JSON.parse(message.message).body.count});
        },
        status: function(s) {
          const upCategories = ['PNConnectedCategory', 'PNNetworkUpCategory'];
          const downCategories = ['PNNetworkDownCategory'];

          const status = upCategories.indexOf(s.category) > -1 ? 'up' :
                         downCategories.indexOf(s.category) > -1 ? 'down' :
                         'unknown';

          self.setState({ status });
        }
    })

    pubnub.subscribe({
        channels: ['hello_world']
    });
  }

  render() {
    const { count, status } = this.state;

    return (
      <div className="App">
        <div className={`App-header ${status}`}>
          <img src={logo} className="App-logo" alt="logo" />
          <h2>Banana Outrage - {status}</h2>
        </div>
        <p className="App-intro">

        </p>

        {
          status === 'up' &&

          <div className='text'>
            <div>Message count: {count}</div>
            {count == 0 && <div className='quiet'><img className='status' src={quietImage} /></div>}
            {count > 0 && count < 3 && <div className='few'>{'a few messages'}</div>}
            {count >= 3 && <div className='busy'><img className='status' src={busyImage} /></div>}
          </div>
        }
      </div>
    );
  }
}

export default App;
