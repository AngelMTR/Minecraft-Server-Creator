exports.up = function (knex) {
    return knex.schema.createTable('users', (table) => {
        table.increments('id').primary(); // کلید اصلی
        table.string('username').notNullable().unique(); // نام کاربری یکتا
        table.string('password').notNullable(); // رمز عبور
        table.timestamp('created_at').defaultTo(knex.fn.now()); // تاریخ ایجاد
        table.timestamp('updated_at').defaultTo(knex.fn.now()); // تاریخ آخرین بروزرسانی
    });
};

exports.down = function (knex) {
    return knex.schema.dropTable('users'); // حذف جدول در صورت بازگشت (rollback)
};
