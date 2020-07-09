import knex from "../config/database";
import express from 'express';
const router = express.Router();
import passport from 'passport';



const online = router.all('*',passport.authenticate('jwt', {session: false}), async (req, res, next) => {
  const date = new Date();
  await knex('users')
    .where('id',req.user.id)
    .update({'online_date':date.toLocaleString(),'online':'on'})
    .then(updateData => {
      next();
    }).catch(err => {
    console.log(err)});
});

export default online;