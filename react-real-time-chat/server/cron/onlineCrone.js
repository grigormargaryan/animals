import cron from 'node-cron';
import knex from "../config/database";


module.exports = {
  onlineCrone:  () => {
    cron.schedule("*/10 * * * *", async () => {
      const date = new Date();
      let last = new Date(date.getTime() - (10 * 60 * 1000));
      await knex('users')
        .where('online','on')
        .andWhere('online_date','<',last.toLocaleString())
        .update('online','off')
        .then(updateData => {
        }).catch(err => {
          console.log(err)});
    });
  },
};
