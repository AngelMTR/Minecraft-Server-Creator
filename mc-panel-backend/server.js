import express from 'express';
import bodyParser from 'body-parser';
import { Pool } from 'pg';
import fetch from 'node-fetch';
import amqplib from 'amqplib';

const app = express();
app.use(bodyParser.json());

const db = new Pool({
    user: 'postgres',
    host: 'localhost',
    password: '2001',
    database: 'angelmc',
    port: '5432'
})

app.use(cors({
    origin: 'http://localhost:3001', // آدرس منبع مجاز
    methods: ['GET', 'POST'], // متدهای مجاز
    allowedHeaders: ['Content-Type', 'Authorization'], // هدرهای مجاز
}));

app.use('/auth', require('./routes/auth.routes'));
app.use('/mc', require('./routes/mc.routes'));

app.listen(port, () => {
    console.log(`✅ API روی http://localhost:${port}`);
});
