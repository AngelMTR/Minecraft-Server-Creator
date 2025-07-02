require('dotenv').config();
const express = require('express');
const app = express();
const cors = require('cors');
const port = 3000;

app.use(express.json());

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
