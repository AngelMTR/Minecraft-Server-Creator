require('dotenv').config();
const express = require('express');
const app = express();
const port = 3000;

app.use(express.json());

app.use('/auth', require('./routes/auth.routes'));
app.use('/mc', require('./routes/mc.routes'));

app.listen(port, () => {
    console.log(`✅ API روی http://localhost:${port}`);
});
