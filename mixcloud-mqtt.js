console.log('Mixcloud MQTT injected');

/**
 * MQTT Communication
 */
var client = mqtt.connect(config.mqtt.handle)
.on('connect', function() {
  console.log('Mixcloud MQTT connected to broker');

  client.subscribe(config.mqtt.domain + '/mixcloud');
  client.publish(config.mqtt.domain + '/mixcloud', 'test');
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
  
  /*if(topic == config.mqtt.domain + '/mixcloud/play') {
    var msg = JSON.parse(msgStr);
    //console.log(msg);
    data.spotify.position = parseFloat(msg.position*1000);
    data.spotify.playing = msg.state == 'playing' ? true : false;
  } else if(topic == config.mqtt.domain + '/spotify/track') {
    var msg = JSON.parse(msgStr);
    //console.log(msg);
    data.spotify.duration = parseFloat(msg.duration);
    data.spotify.trackname = msg.name + ' - ' + msg.artist;

    if(data.spotify.artwork_url != msg.artwork_url) {
      data.spotify.artwork_url = msg.artwork_url;
      data.spotify.artwork_image = loadImage(msg.artwork_url);
    }
  }*/
});

setInterval(function() {
	var artworkUrl = d3.select('.player-cloudcast-image img').attr('src');
	if(!artworkUrl) return;

	//var matched = artworkUrl.match(/\/([0-9a-z-]+)\.jpg/)[1];

	var large = artworkUrl.replace('60x60', '600x600').replace('https', 'http');

	if(large) {
		client.publish(config.mqtt.domain + '/mixcloud/artwork', JSON.stringify({
			url: large
		}), {retain: true})
	}
	//console.log(artworkUrl, large);
}, 1000);

/*
Eventual topics:
mixcloud/playing
mixcloud/position
mixcloud/duration
mixcloud/artwork
mixcloud/trackname
mixcloud/artistname
mixcloud/mixname
mixcloud/mixartist
*/
