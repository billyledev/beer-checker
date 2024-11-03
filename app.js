const express = require('express');
const path = require('path');

const ratebeer = require('./ratebeer');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

app.post('/rateBeer', ratebeer);

app.listen(PORT, () => {
    console.log(`Server listening on ${PORT}...`);
});