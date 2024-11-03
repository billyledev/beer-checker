import express from 'express';
import bodyParser from 'body-parser';
import path from 'path';
import { fileURLToPath } from 'url';

import ratebeer from './ratebeer.js';
import vision from "./vision.js";

const app = express();
const port = process.env.PORT || 3000;
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(bodyParser.json({limit: "50mb"}));
app.use(express.static(path.join(__dirname, 'public')));

app.post('/rateBeer', ratebeer);
app.post('/analyseImage', vision);

app.listen(port, () => {
    console.log(`Server listening on ${port}...`);
});