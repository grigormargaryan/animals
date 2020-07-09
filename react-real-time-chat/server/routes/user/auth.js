import express from 'express';
import passport from 'passport';
import jwt from 'jsonwebtoken';
const router = express.Router();

import knex from '../../config/database';
import sendEmail from '../../config/sendEmail';
import {generateJwt, generateToken, generatePassword} from '../../utils/user';


router.post('/sign-in', (req, res, next) => {
  passport.authenticate('user', (err, user, info) => {
    if (err) {
      return res.status(404).json(err);
    }
    if (user) {
      let access_token = generateJwt(user);
      let refresh_token = generateToken(user);
      return res.status(200).json({
        access_token: access_token,
        refresh_token: refresh_token,
        user: {
          id:user.id,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          profilePicURL: user.profilePicURL
        }
      });
    } else {
      res.status(400).json(info);
    }
  })(req, res);
});

router.post('/sign-up', (req, res, next) => {
  const data = req.body;
  data.password = generatePassword(data.password);
  let query = knex('users')
    .where('email', data.email);
  query.first().then(result => {
    if(result) {
      if(result.status === 'deleted') {
        return res.status(200).json({
          msg:"User exists but is in deletion mode!\n" +
          "If you want to restore just sign in your account!"
        });
      } else if(result.confirmUser === null || result.confirmUser === 0) {
        data.password = generatePassword(data.password);
        data.confirmCode = Math.ceil(Math.random() * 100000) + data.firstName;
        query.update(data).returning('*').then(updateData => {
          if(updateData.length > 0) {
            sendEmail(data.email,data.confirmCode,'confirm')
              .then(succesSendMessage => {
                if(succesSendMessage) {
                  return res.status(200).json({
                    msg:"Please confirm your email"
                  });
                }
              })
              .catch(console.error);
          }
        })
      }
      else if (result.password === '' || result.password === null) {
        query
          .update(data)
          .returning('*')
          .then(update => {
            if (update) {
              return res.status(200).json({
                access_token: generateJwt(update),
                refresh_token: generateToken(update),
                user: {
                  email: result.email,
                  firstName: result.firstName,
                  lastName: result.lastName,
                  profilePicURL: result.profilePicURL
                }
              });
            }
          })
      }else {
        return res.status(200).json({
         msg:"User already exists"
        });
      }
    } else {
      data.password = generatePassword(data.password);
      data.confirmCode = Math.ceil(Math.random() * 1000000) + data.firstName;
      query.insert(data).returning('*').then(insertData => {
        if(insertData.length > 0) {
          sendEmail(data.email,data.confirmCode,'confirm')
            .then(succesSendMessage => {
              if(succesSendMessage) {
                return res.status(200).json({
                  msg:"Please confirm your email"
                });
              }
            })
            .catch(console.error);
        }
      })
    }
  })
});

router.post('/social-connect', (req, res, next) => {
  const data = req.body;
  let query = knex('users')
    .where('email', data.email);
  query
    .first()
    .then(result => {
      if(result) {
        query
          .update({'status': 'active','confirmUser':'1','confirmCode':null})
          .returning(['id', 'email', 'firstName', 'lastName', 'profilePicURL'])
          .then(updateDate => {
            return res.status(200).json({
              access_token: generateJwt(updateDate[0]),
              refresh_token: generateToken(updateDate[0]),
              user: updateDate[0]
            });
          });
      } else {
        data.confirmUser = '1';
        knex('users').insert(data).returning(['id', 'email', 'firstName', 'lastName', 'profilePicURL'])
          .then(suc => {
            if (suc) {
              return res.status(200).json({
                access_token: generateJwt(suc[0]),
                refresh_token: generateToken(suc[0]),
                user: suc[0]
              });
            }
          }).catch(err => console.log(err))
      }
    }).catch(err => console.log(err))
});

router.post('/confirm-email', (req, res, next) => {
  const data = req.body;
  let query = knex('users')
    .where('confirmCode', data.confirmCode);
  query.first().then(result => {
    if(result) {
      query
        .update({'confirmCode':null,'confirmUser':'1'})
        .returning(['id', 'email', 'firstName', 'lastName', 'profilePicURL'])
        .then(updateData => {
        return res.status(200).json({
          access_token: generateJwt(updateData[0]),
          refresh_token: generateToken(updateData[0]),
          user: updateData[0]
        });
      });
    }else {
      return res.status(400).json({
        'error': 'Incorrect email confirmation'
      });
    }
  })
});

router.post('/forgot-password', (req, res, next) => {
  const data = req.body;
  let query = knex('users').where('email',data.email);
  query
    .first()
    .then(result => {
      if(!result) {
        res.status(401).json({
          error: 'User not found'
        })
      }else if(result.confirmUser === '0') {
        res.status(401).json({
          error: 'You have not verified your email address!'
        })
      }else {
        let resetPasswordCode = Math.ceil(Math.random() * 1000000) + result.firstName;
        query.update('resetPasswordCode',resetPasswordCode).returning('*').then( updateData => {
          if(updateData.length > 0) {
            sendEmail(data.email,resetPasswordCode,'forgot')
              .then(succesSendMessage => {
                if(succesSendMessage) {
                  return res.status(200).json({
                    msg:"Please confirm your email"
                  });
                }
              })
              .catch(console.error);
          } else {
            res.status(401).json({
              error: 'Database error!'
            })
          }
        })
      }
    }).catch(err => console.log(err));

});

router.post('/reset-password', (req, res, next) => {
  const data = req.body;
  let query = knex('users')
    .where('resetPasswordCode', data.resetPasswordCode);
  query.first().then(result => {
    if(result) {
      query
        .update({'resetPasswordCode':'','status':'active', 'password': generatePassword(data.password)})
        .returning(['id', 'email', 'firstName', 'lastName', 'profilePicURL'])
        .then(updateData => {
          return res.status(200).json({
            access_token: generateJwt(updateData[0]),
            refresh_token: generateToken(updateData[0]),
            user: updateData[0]
          });
        });
    }else {
      return res.status(400).json({
        'error': 'Incorrect URL address'
      });
    }
  })
});

router.post('/refresh-token', (req, res) => {
  let token = req.body.refresh;
  if (token) {
    jwt.verify(token, config.refreshTokenSecret, (err, decoded) => {
      if (err) {
        return res.status(401).json({"error": true, "message": 'Unauthorized access.'});
      }
      let response_data = {
        access_token: generateJwt(decoded),
        refresh_token: generateToken(decoded),
        email: decoded.email,
        firstName: decoded.firstName,
        lastName: decoded.lastName
      };
      return res.status(200).json(response_data);
    });
  } else {
    return res.status(403).send({
      "error": true,
      "message": 'No token provided.'
    });
  }
});


module.exports = router;
