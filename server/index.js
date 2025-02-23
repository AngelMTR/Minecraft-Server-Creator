// server.js
const fastify = require('fastify')({ logger: true });
const Knex = require('knex');
const { Model } = require('objection');
const knexConfig = require('../knexfile');

// راه‌اندازی knex با تنظیمات دیتابیس
const knex = Knex(knexConfig.development);

// اتصال تمام مدل‌های Objection به knex
Model.knex(knex);

// ثبت یک روت ساده
fastify.get('/', async (request, reply) => {
    return { hello: 'world' };
});

// راه‌اندازی سرور
const start = async () => {
    try {
        await fastify.listen({ port: 3000 });
        fastify.log.info(`Server listening on ${fastify.server.address().port}`);
    } catch (err) {
        fastify.log.error(err);
        process.exit(1);
    }
};

start();
