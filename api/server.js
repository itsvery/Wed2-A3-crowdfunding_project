const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const cors = require('cors');
const helmet = require('helmet');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3000;


// app.use((req, res, next) => {
//     res.setHeadeer("Access-Control-Allow-Origin", "https://24274834.it.scu.edu.au/");
//     res.setHeadeer("Access-Control-Allow-Methods", "POST, GET, PUT, DELETE");
//     res.setHeadeer("Access-Control-Allow-Header", "Content-type");
//     next();
// })
app.use(cors());
app.use(helmet());
app.use(bodyParser.json());

app.use(express.static(path.join(__dirname, '../clientside')));

// 引入并使用 api.js
const api = require('./api');
app.use('/DataServ', api);

app.listen(port, () => {
  console.log(`The server is running on ${port}`);
});

// Serve the AngularJS application
app.get('*', (req, res) => {
//   res.sendFile(path.join(__dirname, '../clientside/index.html'));
});
