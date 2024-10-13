const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const cors = require('cors');
const helmet = require('helmet');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(helmet());
app.use(bodyParser.json());

app.use(express.static(path.join(__dirname, '../clientside')));

// 引入并使用 api.js
const api = require('./api');
app.use('/api', api);

app.listen(port, () => {
  console.log(`The server is running on http://localhost:${port}`);
});

// Serve the AngularJS application
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../clientside/index.html'));
});
