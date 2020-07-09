import * as bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import config from './config';


module.exports = {
  generatePassword: function (password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
  },

  validPassword: function (password, hashedPassword) {
    return bcrypt.compareSync(password, hashedPassword)
  },

  generateToken: function (user, expireIn) {
    // return jwt.sign(payload, jwtSecret);
    return jwt.sign(
      {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
      }, config.refreshTokenSecret, { expiresIn: config.refreshTokenLife})
  },

  generateJwt: function (user, expireIn) {
    return jwt.sign(
      {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
      }
      , config.secret, { expiresIn: config.tokenLife});
    // return jwt.sign({
    //   id: user.id,
    //   email: user.email,
    //   firstName: user.firstName,
    //   lastName: user.lastName,
    //   expireIn: expireIn,
    // },jwtSecret);
  },
};