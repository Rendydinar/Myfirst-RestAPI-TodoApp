const express = require('express');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const db = require('./config/db');
const app = express();
const PORT = process.env.PORT || 8000;
const mongoose = require('mongoose');

app.use(bodyParser.urlencoded({extended: true}));
app.use(morgan('dev'));

// connect to database 
mongoose.connect(db.url, {useNewUrlParser: true}, (err, database) => {
    if(err) console.log(err);
    require('./app/routes')(app);
});

app.listen(PORT, () => {
    console.log(`server running on port ${PORT}`);
});



 