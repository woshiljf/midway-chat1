const Socketframework = require('@midwayjs/socketio').Framework;
const { Bootstrap } = require('@midwayjs/bootstrap');
const websocket = new Socketframework().configure({});
Bootstrap.load(websocket).run();
