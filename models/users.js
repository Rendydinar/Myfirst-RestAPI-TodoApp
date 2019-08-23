const mongoose = require('mongoose');

const { Schema } = mongoose;

const UserSchema = new Schema({

    name: {
        type: String,
        require: true
    },
    
    email: {
        type: String,
        require: true
    },

    password: {
        type: String, 
        require: true
    },

    token: {
        type: String,
        require: true   
    },

    date: {
        type: Date,
        default: Date.now()
    }
    
});

const users = mongoose.model('UserSchema', UserSchema);
module.exports = users; 