console.log('Mixcloud MQTT injected');

var options = {
  mqtt_broker: '',
  mqtt_prefix: '',
  mqtt_username: '',
  mqtt_password: ''
};

chrome.storage.local.get({
  mqtt_broker: 'mqtt://localhost:1884',
  mqtt_prefix: '',
  mqtt_username: '',
  mqtt_password: ''
}, function(items) {
  options = items;

  connect();
});

var broker;

function connect() {
  if(options.mqtt_broker.length > 0)
  var mqtt_options = {};
  if(options.mqtt_username.length > 0) {
    mqtt_options.username = options.mqtt_username;
  }
  if(options.mqtt_password.length > 0) {
    mqtt_options.password = options.mqtt_password;
  }

  broker = mqtt.connect(options.mqtt_broker, mqtt_options)
  .on('connect', function() {
    console.log('Mixcloud MQTT connected to broker');

    broker.subscribe(options.mqtt_prefix + 'mixcloud/#');
  })
  .on('error', function() {
    console.log('Server error:', message);
  })
  .on('end', function() {
    console.log('closed');
  })
  .on('offline', function(err) {
    console.log('closed');
  })
  .on('message', function(topic, message, packet) {
    var msgStr = message.toString();

    //console.log(topic, msgStr);
    if(lastData.playing) {
      switch(topic) {
        case options.mqtt_prefix + 'mixcloud/playing':
          lastData.playing = message.toString() ? true : false;
          break;
      }
    }
  });
}

// Add click listener for quicker play/pause update
d3.select('.player-control').on('click', function() {
  update();
});

var lastData = {
  playing: false,
  position: 0,
  artwork: null,
  mix: {
    name: '',
    artist: '',
    duration: 1
  },
  track: {
    name: '',
    artist: ''
  }
}

function update() {
  // Check play status
  var playing = d3.select('.player-control').classed('pause-state');
  if(lastData.playing != playing) {
    lastData.playing = playing;

    broker.publish(options.mqtt_prefix + 'mixcloud/playing', playing ? true : false);
  }

  if(!playing) return;

  // Position
  var position = his2s(d3.select('.player-time').text());
  if(lastData.position != position) {
    lastData.position = position;

    broker.publish(options.mqtt_prefix + 'mixcloud/position', lastData.position);
  }
  
  // Artwork
	var artwork = d3.select('.player-cloudcast-image img').attr('src');
  if(artwork) {
    // Convert the 60x60 thumnail link to the biggest one available (600x600)
  	var artwork = artwork.replace('60x60', '600x600').replace('https', 'http');

  	if(lastData.artwork != artwork) {
      lastData.artwork = artwork;

      broker.publish(options.mqtt_prefix + 'mixcloud/artwork', artwork);
    }
  }

  // Track
  var trackname = d3.select('.current-track').text();
  var artistname = d3.select('.current-artist span').text();
  if(lastData.track.name != trackname || lastData.track.artist != artistname) {
    lastData.track.name = trackname;
    lastData.track.artist = artistname;

    var newTrack = {
      name: trackname,
      artist: artistname
    };
    if(trackname.length == 0 || artistname.length == 0) {
      newTrack = false;
    }

    broker.publish(options.mqtt_prefix + 'mixcloud/track', JSON.stringify(newTrack));
  }

  // Mix
  var mixname = d3.select('.player-cloudcast-details a').text();
  var mixartist = d3.select('.player-cloudcast-author a').text();
  var duration = lastData.position+his2s(d3.select('.player-time.end-time span').text());
  if(lastData.mix.name != mixname || lastData.mix.artist != artistname) {
    lastData.mix.name = mixname;
    lastData.mix.artist = artistname;
    lastData.mix.duration = duration;

    var newMix = {
      name: mixname,
      artist: mixartist,
      duration: duration
    };
    if(mixname.length == 0 || mixartist.length == 0) {
      newMix = false;
    }

    broker.publish(options.mqtt_prefix + 'mixcloud/mix', JSON.stringify(newMix));
  }
}

setInterval(update, 1000);

// Convert hours:minutes:seconds to seconds
function his2s(hisStr) {
  var splitted = hisStr.split(':');

  if(splitted.length == 2) {
    return parseInt(splitted[0]*60) + parseInt(splitted[1]);
  } else if(splitted.length == 3) {
    return parseInt(splitted[0]*60*60) + parseInt(splitted[1]*60) + parseInt(splitted[2]);
  } else {
    throw new Error('Invalid h:i:s');
    return 0;
  }
}