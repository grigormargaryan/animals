exports.up = function(knex, Promise) {
  return knex.schema.createTable('message', function (table) {
    table.increments();
    table.integer('user_id');
    table.integer('to_user_id');
    table.string('chat_rooms_name');
    table.text('message');
    table.foreign('user_id').references('users.id').onDelete('cascade') ;
    table.foreign('to_user_id').references('users.id').onDelete('cascade') ;
    table.foreign('chat_rooms_name').references('chat_rooms.name').onDelete('cascade') ;
    table.enu('read',['0', '1']).defaultTo('0');
    table.timestamps(true,true);
  })
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTable('message');
};
