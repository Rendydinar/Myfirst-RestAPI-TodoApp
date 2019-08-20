const mongoose = require('mongoose');

const { Schema } = mongoose;

const MyTodoSchema = new Schema({

    judul: {
        type: String,
        require: true
    }, 

    deskripsi: {
        type: String,
        require: true
    },

    target: {
        type: String,
    },

    date: {
        type: Date,
        default: Date.now()
    }
    
});

const mynotes = mongoose.model('MyTodo', MyTodoSchema);
module.exports = mynotes; 