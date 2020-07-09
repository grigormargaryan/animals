exports.up = function(knex, Promise) {
  return knex.schema.createTable('users', function (table) {
    table.increments();
    table.string('firstName').nullable();
    table.string('lastName').nullable();
    table.string('email').unique();
    table.string('password').nullable();
    table.enu('status',['deleted', 'active']).defaultTo('active');
    table.enu('online',['on', 'off']).defaultTo('off');
    table.datetime('online_date').nullable();
    table.string('country').nullable();
    table.string('city').nullable();
    table.datetime('birthDay').nullable();
    table.enu('role',['user','admin']).defaultTo('user');
    table.string('confirmCode').nullable();
    table.string('resetPasswordCode').nullable();
    table.string('profilePicURL').nullable().defaultTo('user.jpg');
    table.enu('confirmUser',['0','1']);
    table.string('socialId').nullable().unique();
    table.string('provider').nullable().unique();
    table.timestamps(true,true);
  })
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTable('users');
};
