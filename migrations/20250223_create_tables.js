// migrations/20250223_create_tables.js
exports.up = function(knex) {
    return knex.schema
        .createTable('servers', function(table) {
            table.increments('server_id').primary();
            table.string('server_name').notNullable();
            table.string('ip_address').notNullable();
            table.integer('port').notNullable();
            table.string('status').notNullable();
            table.text('description');
            table.timestamps(true, true);
        })
        .createTable('worlds', function(table) {
            table.increments('world_id').primary();
            table.integer('server_id').unsigned().notNullable()
                .references('server_id').inTable('servers')
                .onDelete('CASCADE');
            table.string('world_name').notNullable();
            table.string('seed');
            table.string('environment').notNullable();
            table.timestamps(true, true);
        })
        .createTable('players', function(table) {
            table.increments('player_id').primary();
            table.string('username').notNullable();
            table.string('uuid').notNullable().unique();
            table.timestamp('join_date').defaultTo(knex.fn.now());
            table.timestamp('last_seen').defaultTo(knex.fn.now());
            table.string('rank').defaultTo('player');
            table.string('status').defaultTo('active');
        })
        .createTable('player_sessions', function(table) {
            table.increments('session_id').primary();
            table.integer('player_id').unsigned().notNullable()
                .references('player_id').inTable('players')
                .onDelete('CASCADE');
            table.integer('server_id').unsigned().notNullable()
                .references('server_id').inTable('servers')
                .onDelete('CASCADE');
            table.timestamp('join_time').defaultTo(knex.fn.now());
            table.timestamp('leave_time');
            table.integer('duration');
            table.string('ip_address');
        })
        .createTable('permissions', function(table) {
            table.increments('permission_id').primary();
            table.string('permission_name').notNullable().unique();
            table.text('description');
        })
        .createTable('player_permissions', function(table) {
            table.increments('id').primary();
            table.integer('player_id').unsigned().notNullable()
                .references('player_id').inTable('players')
                .onDelete('CASCADE');
            table.integer('permission_id').unsigned().notNullable()
                .references('permission_id').inTable('permissions')
                .onDelete('CASCADE');
            table.integer('server_id').unsigned()
                .references('server_id').inTable('servers')
                .onDelete('CASCADE');
            table.integer('granted_by').unsigned();
            table.timestamp('granted_at').defaultTo(knex.fn.now());
        })
        .createTable('bans', function(table) {
            table.increments('ban_id').primary();
            table.integer('player_id').unsigned().notNullable()
                .references('player_id').inTable('players')
                .onDelete('CASCADE');
            table.integer('server_id').unsigned().notNullable()
                .references('server_id').inTable('servers')
                .onDelete('CASCADE');
            table.integer('banned_by').unsigned();
            table.text('reason');
            table.timestamp('ban_date').defaultTo(knex.fn.now());
            table.timestamp('unban_date');
            table.boolean('active').defaultTo(true);
        })
        .createTable('plugins', function(table) {
            table.increments('plugin_id').primary();
            table.integer('server_id').unsigned().notNullable()
                .references('server_id').inTable('servers')
                .onDelete('CASCADE');
            table.string('plugin_name').notNullable();
            table.string('version');
            table.text('description');
            table.timestamp('installed_date').defaultTo(knex.fn.now());
            table.string('status').defaultTo('active');
        })
        .createTable('logs', function(table) {
            table.increments('log_id').primary();
            table.integer('server_id').unsigned().notNullable()
                .references('server_id').inTable('servers')
                .onDelete('CASCADE');
            table.string('event_type').notNullable();
            table.text('event_description');
            table.timestamp('event_time').defaultTo(knex.fn.now());
            table.integer('player_id').unsigned()
                .references('player_id').inTable('players')
                .onDelete('SET NULL');
        })
        .createTable('server_settings', function(table) {
            table.increments('setting_id').primary();
            table.integer('server_id').unsigned().notNullable()
                .references('server_id').inTable('servers')
                .onDelete('CASCADE');
            table.string('setting_key').notNullable();
            table.text('setting_value');
            table.timestamp('updated_at').defaultTo(knex.fn.now());
        })
        .createTable('chat_logs', function(table) {
            table.increments('chat_id').primary();
            table.integer('server_id').unsigned().notNullable()
                .references('server_id').inTable('servers')
                .onDelete('CASCADE');
            table.integer('player_id').unsigned().notNullable()
                .references('player_id').inTable('players')
                .onDelete('CASCADE');
            table.text('message');
            table.timestamp('timestamp').defaultTo(knex.fn.now());
        })
        .createTable('economy_transactions', function(table) {
            table.increments('transaction_id').primary();
            table.integer('player_id').unsigned().notNullable()
                .references('player_id').inTable('players')
                .onDelete('CASCADE');
            table.integer('server_id').unsigned().notNullable()
                .references('server_id').inTable('servers')
                .onDelete('CASCADE');
            table.string('transaction_type').notNullable();
            table.decimal('amount', 10, 2).notNullable();
            table.timestamp('transaction_date').defaultTo(knex.fn.now());
            table.text('description');
        });
};

exports.down = function(knex) {
    return knex.schema
        .dropTableIfExists('economy_transactions')
        .dropTableIfExists('chat_logs')
        .dropTableIfExists('server_settings')
        .dropTableIfExists('logs')
        .dropTableIfExists('plugins')
        .dropTableIfExists('bans')
        .dropTableIfExists('player_permissions')
        .dropTableIfExists('permissions')
        .dropTableIfExists('player_sessions')
        .dropTableIfExists('players')
        .dropTableIfExists('worlds')
        .dropTableIfExists('servers');
};
