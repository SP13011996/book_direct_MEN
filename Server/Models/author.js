const mongoose = require('mongoose')
//AUTHOR SCEMA
const AuthorSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        minlength: 3,
        maxlength: 40
    },
    age: {
        type: Number,
        min: 10,
        max: 100
    }

});

module.export = new mongoose.model('Author', AuthorSchema)