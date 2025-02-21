const fastify = require('fastify')({ logger: true });
const { Model } = require('objection');
const Knex = require('knex');
const knexConfig = require('../knexfile');

// راه‌اندازی Knex و اتصال آن به Objection.js
const knex = Knex(knexConfig.development);
Model.knex(knex);

// تست اتصال به دیتابیس
knex.raw('select 1+1 as result')
    .then(() => {
        console.log('Database connected successfully!');
    })
    .catch((err) => {
        console.error('Database connection failed:', err);
    });

// تعریف مدل User
class User extends Model {
    static get tableName() {
        return 'users';
    }
}

// تعریف روت /users برای دریافت لیست کاربران
fastify.get('/users', async (request, reply) => {
    try {
        const users = await User.query();
        return users;
    } catch (err) {
        console.error('Error fetching users:', err);
        return reply.status(500).send({ error: 'Failed to fetch users' });
    }
});

// راه‌اندازی سرور Fastify
const start = async () => {
    try {
        await fastify.listen({
            port: 3000,
            host: 'localhost',
        });
        fastify.log.info(`Server running on port 3000`);
    } catch (err) {
        fastify.log.error(err);
        process.exit(1);
    }
};

start().then(() => {});
