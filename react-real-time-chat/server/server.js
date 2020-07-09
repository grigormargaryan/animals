import express from 'express';
const http = require('http');
import path from 'path';
const socketio = require('socket.io');
const cors = require('cors');
import passport from 'passport';
import validator from 'express-validator';
import bodyParser from 'body-parser';


import passportConfig from './config/passport';
const { addUser, removeUser, getUser, getUsersInRoom, addMessages } = require('./users');
import online from './middlewares/onlineMiddleware';
const router = require('./router');
import adminRouter from './routes/admin/admin';
import userAuthRouter from './routes/user/auth';
import userRouter from './routes/user/user';
import { onlineCrone } from './cron/onlineCrone';


const app = express();
onlineCrone();
require('dotenv').config();
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
passportConfig(passport);
let allowCrossDomain = function(req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'OPTIONS,GET,PUT,POST,DELETE');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  next();
};

const server = http.createServer(app);
const io = socketio(server);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(allowCrossDomain);
app.use(cors());
app.use(passport.initialize());
app.use(validator());


app.use('/staff', [adminRouter]);
app.use('/auth', [userAuthRouter]);
app.use('*',online);
app.use('/users', [userRouter]);


io.on('connect', socket => {
  socket.on('join', ({ name, room, id }, callback) => {
    const { error, user } = addUser({ id: id, name, room });

    if(error) return callback(error);

    socket.join(user.room);

    io.to(user.room).emit('roomData', { room: user.room, users: getUsersInRoom(user.room)});
    callback();
  });

  socket.on('sendMessage', async (data, callback) => {
    let user = getUser(data.id);
    if(!user) {
      let add = {
        id: data.id,
        name:  data.name,
        room: data.room
      };
      addUser(add);
      user = add
    }
    io.to(user.room).emit('message', { user: user.name, text: data.message, id: data.id });
    let insertData = await addMessages(user.id,data.message,user.room,data.to_user_id);
    if (insertData.length > 0) {
      let data = {
        id: insertData[0].user_id,
        user: user.name,
        text: insertData[0].message
      };
      callback(data);
    }

  });

  socket.on('disconnect', () => {
    const user = removeUser(socket.id);
    if(user) {
      io.to(user.room).emit('message', { user: 'Admin', text: `${user.name} has left.` });
      io.to(user.room).emit('roomData', { room: user.room, users: getUsersInRoom(user.room)});
    }
  })
});


server.listen(process.env.NODE_PORT || 7000, () => console.log(`Server has started.`));