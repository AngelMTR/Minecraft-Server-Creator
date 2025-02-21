exports.seed = async function (knex) {
    // ابتدا همه کاربران قبلی حذف شوند
    await knex('users').del();

    // اضافه کردن کاربران تستی
    await knex('users').insert([
        { username: 'testuser1', password: 'password123' },
        { username: 'testuser2', password: 'password456' }
    ]);
};
