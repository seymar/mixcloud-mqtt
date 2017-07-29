var options = {
  mqtt_broker: '',
  mqtt_username: '',
  mqtt_password: '',
  mqtt_prefix: ''
};

document.addEventListener('DOMContentLoaded', function() {

  // Load saved options
  chrome.storage.local.get({
    mqtt_broker: 'mqtt://localhost:1884',
    mqtt_username: '',
    mqtt_password: '',
    mqtt_prefix: ''
  }, function(items) {
    options = items;
    document.getElementById('mqtt_broker').value = items.mqtt_broker;
    document.getElementById('mqtt_prefix').value = items.mqtt_prefix;
    document.getElementById('mqtt_username').value = items.mqtt_username;
    document.getElementById('mqtt_password').value = items.mqtt_password;

    test_mqtt();
  });
});

document.getElementById('save').addEventListener('click', save_options);
document.getElementById('mqtt_broker').addEventListener('input', function() {
  options.mqtt_broker = this.value;
  test_mqtt();
});
document.getElementById('mqtt_username').addEventListener('input', function() {
  options.mqtt_username = this.value;
  test_mqtt();
});
document.getElementById('mqtt_password').addEventListener('input', function() {
  options.mqtt_password = this.value;
  test_mqtt();
});

function save_options() {
  options.mqtt_broker = document.getElementById('mqtt_broker').value;
  options.mqtt_username = document.getElementById('mqtt_username').value;
  options.mqtt_password = document.getElementById('mqtt_password').value;
  options.mqtt_prefix = document.getElementById('mqtt_prefix').value;
  
  chrome.storage.local.set(options, function() {
    var status = document.getElementById('status');
    status.textContent = 'Saved';
    setTimeout(function() {
      status.textContent = '';
    }, 750);
  });

  test_mqtt();
}

/**
 * MQTT
 */
function test_mqtt() {
  if(options.mqtt_broker.length > 0)
  var mqtt_options = {};
  if(options.mqtt_username.length > 0) {
    mqtt_options.username = options.mqtt_username;
  }
  if(options.mqtt_password.length > 0) {
    mqtt_options.password = options.mqtt_password;
  }
  
  var client = mqtt.connect(options.mqtt_broker, mqtt_options)
  .on('connect', function() {
    set_mqtt_status('Connected', 'green');
    client.end()
  })
  .on('error', function() {
    console.log('Server error');
    set_mqtt_status('Error', 'red');
    client.end()
  })
  .on('end', function() {
    console.log('ended');
    set_mqtt_status('Not connected', 'red');
    client.end()
  })
  .on('offline', function(err) {
    set_mqtt_status('Not connected', 'red');
    client.end()
  })
}

function set_mqtt_status(msg, color) {
  document.getElementById('mqtt_status').innerHTML = msg;
  document.getElementById('mqtt_status').style.color = color;
}