import knex from './database';
const LocalStrategy   = require('passport-local').Strategy;
const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
import {validPassword}from '../utils/user';
import  config  from '../utils/config';



module.exports = function(passport) {
  passport.serializeUser((user, done) => {
    done(null, user.id);
  });

  passport.deserializeUser((id, done) =>  {
    knex.select('*').from('users')
      .where('id', id)
      .andWhere('status', 'active')
      .first()
      .then( (user) => {
        if(user) {
          return done(null, user);
        } else {
          return done(null, false);
        }

      }).catch((error) => {
      return done(error);
    })
  });

  const opts = {};
  opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
  opts.secretOrKey = config.secret;

  passport.use('admin',new LocalStrategy({
      usernameField : 'email',
      passwordField : 'password'
    },
    (email, password, done) =>{
      knex.select('*').from('users').where('email', email).first().then((user) => {
        if (!user || user.role !== 'admin') {
          return done(null, false, {message: 'User Not Found'});
        }
        if (!validPassword(password, user.password)) {
          return done(null, false, {message: 'User Not Found'});
        }
        if(user.confirmuser === 'No'){
          return done(null, false, {message: 'User has not confirmed email.'});
        }
        else {
          return done(null, user);
        }
      }).catch(error => {
        return done(error);
      })
    })
  );

  passport.use('user',new LocalStrategy({
      usernameField : 'email',
      passwordField : 'password'
    },
    (email, password, done) =>{
      knex.select('*').from('users').where('email', email).first().then((user) => {
        if (!user || user.role !== 'user') {
          return done(null, false, {errors: 'User not found'});
        }
        if(user && !user.password) {
          return done(null, false, {errors: 'Invalid credentials'});
        }
        if (!validPassword(password, user.password)) {
          return done(null, false, {errors: 'User not found'});
        }
        if(user.confirmUser === '0' || user.confirmUser === null){
          return done(null, false, {errors: 'Your account has not been activated'});
        }
        else {
          return done(null, user);
        }
      }).catch(error => {
        return done(error);
      })
    })
  );

  passport.use(new JwtStrategy(opts, (jwt_payload, done) => {
    knex.select('*').from('users').where('id', jwt_payload.id).first().then((user) => {
      if (user) {
        return done(null, user);
      } else {
        return done(null, false);
      }
    }).catch(error => {
      return done(error, false);
    })
  }));


};