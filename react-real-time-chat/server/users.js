import knex from './config/database';

const users = [];

const addUser = ({id,name,room}) => {
  const existingUser = users.find((user) => user.room === room && user.name === name);
  const user = {id,name,room};
  if(!existingUser){
    users.push(user);
  }
  return {user}
};

const removeUser = (id) => {
  const index = users.findIndex((user) => user.id === id);
  if(index !== -1) {
    return users.splice(index,1)[0];
  }
};

const getUser = (id) => users.find((user) => user.id === id);

const getUsersInRoom = (room) => users.filter((user) => user.room === room);

const addMessages = (id,message,room,to_user_id) => {
  return  knex('message').insert({
    user_id: id,
    to_user_id:to_user_id,
    message: message,
    chat_rooms_name: room
  })
    .returning('*')
    .then( insertData => {
      return insertData
  }).catch(err => console.log(err))
};


module.exports = {addUser, removeUser,getUser,getUsersInRoom, addMessages};