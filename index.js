const express = require('express');
const app = express();
const path = require('path');
const bodyParser = require('body-parser');
const sales = require('./routes/sales');
const port = 3000;

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'data')));

app.use('/sales',sales);
app.listen(port, () => console.log(`Example app listening on port ${port}!`))