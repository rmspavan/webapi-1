var toobusy = require('node-toobusy');
var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var hbs = require('express-handlebars');
var logger = require('morgan');
var loggerutil = require('./utilities/logger');
var datalogger = require('./utilities/datalogger');
var fs = require('fs');
var rfs = require('rotating-file-stream');
var helmet = require('helmet');
var compression = require('compression');
var db = require('./dbconfig');
const {OpenVidu} = require('openvidu-node-client');
const createError = require("http-errors");
//DEFINING FOR SOCKET
var http = require('http').createServer(app);
var io = require('socket.io')(http);

io.on('connection', (socket) => {
  console.log('a user connected to the socket');


  //    Viewer Listener and emitter


  socket.on('sending_message', (data) => {
    console.log(data);
    const {roomId, userName, message} = data;       //destructuring the data
    io.emit("sending_message", {userName, message});
  }),

    socket.on('say_hii', (data) => {
      console.log("Say HIiii");
      console.log(data);
      const {roomId, userName, message} = data;       //destructuring the data
      io.emit("say_hii", {userName, message})
    })

  socket.on('send_hearts', (roomId) => {
    console.log("called heart event n server")
    socket.broadcast.emit("send_hearts");
  })


  socket.on('send_gift', (data) => {
    console.log("send_gift", data);
    const {roomId, userName, imgName, count} = data;
    io.emit("send_gift", {userName, imgName, count});
  })


  socket.on('leave_room', (data) => {
    console.log("leave_room", data)
    const {roomId, userName} = data;
    const broadCastMessage = userName + " " + "left the Room";
    socket.broadcast.emit('leave_room', broadCastMessage) // Send message to everyone BUT sender
  })


  socket.on('join_room', (data) => {
    console.log(data);
    console.log("Join room called on server")
    const {roomId, userName} = data;
    const broadCastMessage = userName + " " + "joined the Room";
    socket.broadcast.emit('join_room', broadCastMessage);
  })


  // Streamer listener and emitter


  socket.on('preparing_streamer', (data) => {
    let roomId = generateRoomId();
    console.log(roomId);
    console.log('Prepare live stream', data);
    const {userName, roomName} = data;
    if (!userName || !roomName) return;
    return Room.findOneAndUpdate(
      {userName, roomName},
      {liveStatus: LiveStatus.PREPARE, createdAt: Utils.getCurrentDateTime()},
      {new: true, useFindAndModify: false}
    ).exec((error, foundRoom) => {
      if (error) return;
      if (foundRoom) return emitListLiveStreamInfo();
      const condition = {
        userName,
        roomName,
        liveStatus: LiveStatus.PREPARE,
      };
      return Room.create(condition).then((createdData) => {
        emitListLiveStreamInfo();
      });
    });
  })


  socket.on('go_live', (data) => {

    console.log('Begin live stream', data);
    const {userName, roomName} = data;
    if (!userName || !roomName) return;
    return Room.findOneAndUpdate(
      {userName, roomName},
      {liveStatus: LiveStatus.ON_LIVE, beginAt: Utils.getCurrentDateTime()},
      {new: true, useFindAndModify: false}
    ).exec((error, foundRoom) => {
      if (error) return;
      if (foundRoom) {
        io.in(roomName).emit('begin-live-stream', foundRoom);
        return emitListLiveStreamInfo();
      }
      const condition = {
        userName,
        roomName,
        liveStatus: LiveStatus.ON_LIVE,
      };
      return Room.create(condition).then((createdData) => {
        io.in(roomName).emit('begin-live-stream', createdData);
        emitListLiveStreamInfo();
      });
    });
  })


  socket.on('close_stream', (data) => {
    console.log('Finish live stream');
    const {userName, roomName} = data;
    const filePath = Utils.getMp4FilePath();
    if (!userName || !roomName) return;
    return Room.findOneAndUpdate(
      {userName, roomName},
      {liveStatus: LiveStatus.FINISH, filePath},
      {new: true, useFindAndModify: false}
    ).exec((error, updatedData) => {
      if (error) return;
      io.in(roomName).emit('finish-live-stream', updatedData);
      socket.leave(roomName);
      return emitListLiveStreamInfo();
    });
  })


});

http.listen(4000, () => {
  console.log('listening socket on *:4000');
});


// Defining routes
var routes = require('./routes');

// Generating an express app
var app = express();

// Express Status Monitor for monitoring server status
app.use(require('express-status-monitor')({
  title: 'Server Status',
  path: '/status',
  // websocket: existingSocketIoInstance,
  spans: [{
    interval: 1,
    retention: 60
  }, {
    interval: 5,
    retention: 60
  }, {
    interval: 15,
    retention: 60
  }],
  chartVisibility: {
    cpu: true,
    mem: true,
    load: true,
    responseTime: true,
    rps: true,
    statusCodes: true
  },
  healthChecks: [{
    protocol: 'http',
    host: 'localhost',
    path: '/',
    port: '3000'
  }]
}));

// compress all responses
app.use(compression());

// middleware which blocks requests when server is too busy
app.use(function (req, res, next) {
  if (toobusy()) {
    res.status(503);
    res.send("Server is busy right now, sorry.");
  } else {
    next();
  }
});

// Linking log folder and ensure directory exists
var logDirectory = path.join(__dirname, 'log');
fs.existsSync(logDirectory) || fs.mkdirSync(logDirectory);
fs.appendFile('./log/ServerData.log', '', function (err) {
  if (err) throw err;
});

// view engine setup - Express-Handlebars
app.engine('hbs', hbs({
  extname: 'hbs',
  defaultLayout: 'layout',
  layoutsDir: __dirname + '/views/'
}));
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

// Create a rotating write stream
var accessLogStream = rfs.createStream('Server.log', {
  size: "10M", // rotate every 10 MegaBytes written
  interval: '1d', // rotate daily
  compress: "gzip", // compress rotated files
  path: logDirectory
});

// Generating date and time for logger
logger.token('datetime', function displayTime() {
  return new Date().toString();
});

// Allowing access headers and requests
app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "HEAD, OPTIONS, GET, POST, PUT, PATCH, DELETE, CONNECT");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
  next();
});

// defining mode of logging
app.use(logger('dev'));
app.use(logger(':remote-addr :remote-user :datetime :req[header] :method :url HTTP/:http-version :status :res[content-length] :res[header] :response-time[digits] :referrer :user-agent', {
  stream: accessLogStream
}));

// uncomment to redirect global console object to log file
// datalogger.logfile();

// Helmet helps for securing Express apps by setting various HTTP headers
app.use(helmet());

app.use(bodyParser.json({limit: '5mb'}));
app.use(bodyParser.urlencoded({extended: true}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(favicon(path.join(__dirname, 'public', 'ficon.ico')));

function openVidu() {
  const ov = new OpenVidu(
    // process.env.OPENVIDU_URL ?? 'https://demos.openvidu.io',
    // process.env.OPENVIDU_URL ?? 'https://node.ratulive.com',
    // process.env.OPENVIDU_SECRET ?? 'MY_SECRET',
    // process.env.OPENVIDU_URL ?? 'https://ssl.ratulive.com/',
    process.env.OPENVIDU_URL ?? 'https://ms.ratulive.com/',
    process.env.OPENVIDU_SECRET ?? 'RATU_2021',
  )
  process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';

  return async (req, res, next) => {
    if (!req.ov) {
      req.ov = ov;
    }

    next();
  }
}

app.use(openVidu());

// Linking routes
app.use('/', routes);

// error handler
app.use(function (err, req, res, next) {
  if (createError.isHttpError(err)) {
    res.status(err.statusCode).json({
      statusCode: err.statusCode,
      message: err.message
    });
  } else {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};
    res.status(err.status || 500);
    res.send({"message": "404 Page Not Found..!"});
  }
});

// globally catching unhandled promise rejections
process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at promise ' + promise + ' reason ', reason);
  console.log('Server is still running...\n');
});

// globally catching unhandled exceptions
process.on('uncaughtException', (error) => {
  console.error('Uncaught Exception is thrown with ', error + '\n');
  process.exit();
});

db.isLive();

module.exports = app;
