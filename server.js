const express = require('express');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const db = require('./config/db');
const app = express();
const PORT = process.env.PORT || 8000;
const mongoose = require('mongoose');


// setup app
app.use(bodyParser.urlencoded({extended: true}));
app.use(morgan('dev'));
app.use((req, res, next) => {
	// set respon header
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type, Authorization');
    next();
});


// connect to database 
mongoose.connect(db.url, {useNewUrlParser: true}, (err, database) => {
    if(err) console.log(err);
    require('./app/routes')(app);
});

app.listen(PORT, () => {
    console.log(`server running on port ${PORT}`);
});



 