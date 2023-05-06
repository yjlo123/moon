import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import https from 'https'
import fs from 'fs'

const app = express();
const PORT = 5000;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use('/', express.static(path.join(__dirname, 'docs')));

const options = {
    key: fs.readFileSync('./localcert/local.siwei.dev-key.pem'),
    cert: fs.readFileSync('./localcert/local.siwei.dev.pem'),
  };
https
    .createServer(options, app)
    .listen(5000, ()=>{
        console.log(`Server listening on port: ${PORT}`)
    })
