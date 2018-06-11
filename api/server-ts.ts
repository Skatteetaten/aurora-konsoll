import * as express from 'express';

const app = express();

app.get('/api/hello', (req, res) => res.send('hello'));

app.listen(Number(process.env.HTTP_PORT || 9090));
