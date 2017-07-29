# mixcloud-mqtt
A Chrome Extension that gets info about a current Mixcloud mix playing and publishes this info to a MQTT broker.

| Topic           | Message        |
| ----------------|----------------|
|mixcloud/playing |false/true|
|mixcloud/position|seconds|
|mixcloud/artwork |http://urltoartwork|
|mixcloud/mix     |{name: 'mixName', artist: 'artistName', duration: 1}|
|mixcloucd/track  |{name: 'trackName', artist: 'artistName'}|