exports.up = function(knex, Promise) {
  return knex.schema.createTable('chat_rooms', function (table) {
    table.increments();
    table.string('name').unique();
    table.string('user_1');
    table.string('user_2');
    table.enu('status',['deleted', 'active']).defaultTo('active');
    table.timestamps(true,true);
  })
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTable('chat_rooms');
};
