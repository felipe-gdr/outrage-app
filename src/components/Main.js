require('normalize.css/normalize.css');
require('styles/App.css');

import PubNub from 'pubnub';
import React from 'react';

const quietImage = require('../images/quiet.png');
const busyImage = require('../images/busy.png');

class AppComponent extends React.Component {
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
      <div className='index'>
        <div className={`notice ${status}`}>Banana Outrage - {status}</div>

        {
          status === 'up' &&

          <div className='text'>
            <div>Message count: {count}</div>
            {count == 0 && <div className='quiet'><img className='status' src={quietImage} />{'too quiet'}</div>}
            {count > 0 && count < 3 && <div className='few'>{'a few messages'}</div>}
            {count >= 3 && <div className='busy'><img className='status' src={busyImage} />{'busy'}</div>}
          </div>
        }

      </div>
    );
  }
}

AppComponent.defaultProps = {
};

export default AppComponent;
