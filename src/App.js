import React, { Component } from 'react';
import PubNub from 'pubnub';
import moment from 'moment';

import { Line } from 'rc-progress';

import './App.css';

import logo from './images/banana.png';
import quietImage from './images/quiet.png';
import fewImage from './images/few.png';
import busyImage from './images/busy.png';


const CHANNEL = 'hello_world';

class App extends Component {
  constructor() {
    super();
    this.state = {
      count: 3,
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

          if(status === 'up') {
            pubnub.history(
                {
                    channel: CHANNEL,
                    reverse: false, // Setting to true will traverse the time line in reverse starting with the oldest message first.
                    count: 1, // how many items to fetch
                    stringifiedTimeToken: true, // false is the default
                    start: '0', // start time token to fetch
                    end: moment().add(1, 'minutes').unix() * 10000000
                },
                function (status, response) {
                  // self.setState({count: JSON.parse(response.messages[0].entry).body.count});
                }
            );
          }
        }
    })

    pubnub.subscribe({
        channels: [CHANNEL]
    });
  }

  render() {
    const { count, status } = this.state;

    const percent = (count / 10) * 100;

    return (
      <div className="App">
        <div className={`App-header ${status}`}>
          <img src={logo} className="App-logo" alt="logo" />
          <h2>Banana Outrage</h2>
        </div>
        <p className="App-intro">

        </p>

        {
          status === 'up' &&

          <div className='content'>
            {count < 2 &&
              <div className='quiet'>
                <div>
                  <Line percent={`${percent}`} strokeWidth="4" strokeColor="#FFA500" />
                </div>
                <div>
                  <img className='status' src={quietImage} />
                </div>
              </div>
            }
            {count > 2 && count < 9 &&
              <div className='few'>
                <Line percent={`${percent}`} strokeWidth="4" strokeColor="#FFA500" />
                <div>
                  <img className='status' src={fewImage} />
                </div>
              </div>
            }
            {count >= 9 &&
              <div className='busy'>
                <div>
                  <Line percent={`${percent}`} strokeWidth="4" strokeColor="#FFA500" />
                </div>
                <div>
                  <img className='status' src={busyImage} />
                </div>
              </div>
            }
            {/* <div>Message count: {count}</div> */}
          </div>
        }
      </div>
    );
  }
}

export default App;
