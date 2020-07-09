import express from 'express';
import passport from 'passport';
import jwt from 'jsonwebtoken';
const router = express.Router();
import {generateJwt, generateToken} from '../../utils/user';


router.post('/auth/sign-in', (req, res, next) => {
  passport.authenticate('admin', (err, user, info) => {
    if (err) {
      return res.status(404).json(err);
    }
    if (user) {
      let access_token = generateJwt(user);
      let refresh_token = generateToken(user);
      res.status(200).json({
        access_token: access_token,
        refresh_token: refresh_token,
        user: {
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
        }
      });
    } else {
      res.status(400).json(info);
    }
  })(req, res);
});

router.post('/auth/refresh-token/', (req, res) => {
  let token = req.body.refresh;
  if (token) {
    // verifies secret and checks exp
    jwt.verify(token, config.refreshTokenSecret,(err, decoded) => {
      if (err) {
        return res.status(401).json({"error": true, "message": 'Unauthorized access.' });
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
    // if there is no token
    // return an error
    return res.status(403).send({
      "error": true,
      "message": 'No token provided.'
    });
  }
});



module.exports = router;
