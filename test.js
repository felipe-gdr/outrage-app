const PubNub = require('pubnub');

const pubnub = new PubNub({
  publishKey : 'pub-c-9d6ee88e-477d-4372-b81d-a87d8b81794c',
  subscribeKey : 'sub-c-815cccf0-3c67-11e7-a8ad-0619f8945a4f'
});

pubnub.history(
    {
        channel: 'hello_world',
        reverse: true, // Setting to true will traverse the time line in reverse starting with the oldest message first.
        count: 100, // how many items to fetch
        stringifiedTimeToken: true, // false is the default
        start: '0', // start time token to fetch
        end: '1496924598' // end timetoken to fetch
    },
    function (status, response) {
        console.log(status, response);
    }
);
