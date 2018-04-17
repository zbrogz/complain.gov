
exports.up = function (knex, Promise) {
    return Promise.all([
        knex.schema.createTable('complaints', function (table) {
            table.string('id').primary();
            table.string('timestamp');
            table.text('text');
            table.integer('votes');
        }),
    ]);
};

exports.down = function (knex, Promise) {
    return Promise.all([
        knex.schema.dropTable('complaints'),
    ]);
};