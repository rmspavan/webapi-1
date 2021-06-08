var cassandra = require('cassandra-driver');
var distance = cassandra.types.distance;
const fs = require('fs');
const auth = new cassandra.auth.PlainTextAuthProvider('prasad-at-447280007044', 'v2DnlQOQXTDlHkKl9jSde8Tkpp8ovBiuOazYnQNZLPA=');
const sslOptions1 = {
  ca: [
    fs.readFileSync('.cassandra/dev.pem', 'utf-8')
  ],
  host: 'cassandra.ap-south-1.amazonaws.com',
  rejectUnauthorized: false
};
const consistencies = {
  consistency: cassandra.types.consistencies.localQuorum,
  prepared: true
};
var options = {
  contactPoints: ['cassandra.ap-south-1.amazonaws.com'],
  localDataCenter: 'ap-south-1',
  authProvider: auth,
  sslOptions: sslOptions1,
  keyspace: "ratustaging",
  protocolOptions: {
    port: 9142
  },
  pooling: {
    coreConnectionsPerHost: {
      [distance.local]: 2,
      [distance.remote]: 1
    }
  },
  encoding: {
    map: Map,
    set: Set
  },
  queryOptions: { consistency: cassandra.types.consistencies.localQuorum, prepare: true }
};
var client = new cassandra.Client(options);
var state = client.getState();

client.on('log', function (level, className, message, furtherInfo) {
  if (level != 'verbose') {
    console.log('cassandra: %s -- %s', level, message);
  }
});

module.exports.isLive = () => {
  client.execute('SELECT * FROM ratustaging.user;', function (err, result) {
    if (err) {
      console.log("Unable to connect Cassandra...\n");
    } else {
      console.log("Cassandra Database connected...\n");
    }
  })
}

var executequery = (query) =>
  new Promise((resolve, reject) =>
    client.execute(query, function (err, result) {
      if (err) {
        reject(err);
      } else {
        resolve(result);
      }
    })
  );

var post = (query, params) =>
  new Promise((resolve, reject) =>
    client.execute(query, params, function (err, result) {
      if (err) {
        reject(err);
      } else {
        resolve(result);
      }
    })
  );


// var post = (query,params)=>{
//   var data = {
// 		'error':1,
// 		'gifts':''
// 	};
//   client.execute(query,params,{ consistency: cassandra.types.consistencies.localQuorum }, function(err){
//   	console.log(err);
//   	if(!!err){
//   		data['gifts'] = 'Error Adding data';
//   	}else{
//   		data['error'] = 0;
//   		data['gifts'] = 'gift Added Successfully';
//   	}
//   	return data;
//   });
// }

module.exports.post = (query, params) => { 
  return post(query, params);
};

module.exports.query = (query) => {
  return executequery(query);
}

module.exports.close = () => {
  client.shutdown();
}