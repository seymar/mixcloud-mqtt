# mixcloud-mqtt
A Chrome Extension that gets info about a currently playing Mixcloud mix and publishes this info to a MQTT broker.

| Topic           | Message        |
| ----------------|----------------|
|mixcloud/playing |false/true|
|mixcloud/position|seconds|
|mixcloud/artwork |http://urltoartwwork|
|mixcloud/mix     |{name: 'mixName', artist: 'artistName', duration: 1245}|
|mixcloud/track   |{name: 'trackName', artist: 'artistName'}|