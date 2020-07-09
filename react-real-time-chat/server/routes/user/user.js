import express from 'express';
import passport from 'passport';
const router = express.Router();
import cryptoRandomString from 'crypto-random-string';

import knex from '../../config/database';


router.get('/user-list', passport.authenticate('jwt', {session: false}), (req, res, next) => {
  let authuser = req.user;
  knex('users')
    .select('id', 'email', 'firstName', 'lastName', 'profilePicURL')
    .whereNot('id', authuser.id)
    .where('confirmUser', '1')
    .andWhere('status', 'active')
    .then(result => {
      return res.status(200).json({
        users: result
      })
    })
    .catch(err => {
      return res.status(401).json({
        errors: 'Database Error'
      })
    })
});

router.get('/chat/:user', passport.authenticate('jwt', {session: false}), (req, res, next) => {
  knex.select('*')
    .from('chat_rooms')
    .where('status', 'active')
    .where(function () {
      this.where('user_1', req.user.id).where('user_2', req.params.user)
    })
    .orWhere(function () {
      this.where('user_2', req.user.id).where('user_1', req.params.user)
    })
    .first()
    .then(result => {
      if (result) {
        knex.select('message.message as text',
          'message.created_at as date',
          'message.user_id as id',
          'message.chat_rooms_name as room',
          'users.firstName as user')
          .from('message')
          .leftJoin('users', 'message.user_id', 'users.id')
          .where('message.chat_rooms_name', result.name)
          // .where(function() {
          //   this.where('message.user_id', req.user.id).where('to_user_id', req.params.user)
          // })
          // .orWhere(function() {
          //   this.where('message.to_user_id', req.user.id).where('message.user_id', req.params.user)
          // })
          .orderBy('message.created_at', 'asc')
          .then(messages => {
            if (messages) {
              knex('users')
                .select('profilePicURL')
                .where('id', req.params.user)
                .first()
                .then(profile => {
                  if (profile) {
                    knex('message')
                      .where('chat_rooms_name', result.name)
                      .andWhere('to_user_id', req.user.id)
                      .andWhere('read', '0')
                      .update('read', '1')
                      .then(update => {
                        return res.status(200).json({
                          room: result.name,
                          messages: messages,
                          profilePicURL: profile.profilePicURL
                        })
                      }).catch(err => console.log(err))
                  }

                });
            } else {
              knex('users')
                .select('profilePicURL')
                .where('id', req.params.user)
                .first()
                .then(profile => {
                  return res.status(200).json({
                    room: result.name,
                    messages: [],
                    profilePicURL: profile.profilePicURL
                  })
                });
            }
          })
      } else {
        knex('chat_rooms').insert({
          name: cryptoRandomString({length: 25}),
          user_1: req.user.id,
          user_2: req.params.user
        }).returning('*').then(addRoom => {
          if (addRoom) {
            knex('users')
              .select('profilePicURL')
              .where('id', req.params.user)
              .first()
              .then(profile => {
                return res.status(200).json({
                  room: addRoom[0].name,
                  messages: [],
                  profilePicURL: profile.profilePicURL
                })
              });
          }
        }).catch(err => console.log(err))
      }
    });
});

router.get('/unread-messages/:id', passport.authenticate('jwt', {session: true}), async (req, res, next) => {
  let unreadMessage = await knex('message')
    .select('message.message as message',
      'message.created_at as date',
      'users.firstName as firstName',
      'users.profilePicURL as profilePicURL',
      'users.id as id'
    )
    .where('read', '0')
    .andWhere('to_user_id', req.params.id)
    .leftJoin('users', 'message.user_id', 'users.id')
    .orderBy('message.id', 'desc');
  return res.status(200).json({
    unreadMessage: unreadMessage,
  });
});



module.exports = router;