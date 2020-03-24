
exports.up = function(knex) {
    return knex.schema.createTable('users', tbl => {
        tbl.increments();
        tbl.string('username', 24).notNullable();
        tbl.string('password').notNullable();
        tbl.string('department', 128).notNullable();
    });    
};

exports.down = function(knex) {
    return knex.schema.dropTableIfExists('users');
};
