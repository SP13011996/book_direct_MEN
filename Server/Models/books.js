const mongoose = require('mongoose')
const yup = require('yup')

//CREATE BOOK SCHEMA
const BookSchema = new mongoose.Schema(
    {
        name: { type: String, required: true, minlength: 3, maxlength: 50 },
        author: {
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
            },
        },
        genre: {
            type: String, required: true, minlength: 3, maxlength: 20
        }
    }


);

const validate = book => {
    const schema = yup.object().shape({
        bookname: yup.string().required().min(3).max(50),
        authorname: yup.string().required().min(3).max(40),
        authorage: yup.number().required().min(10, 'Age must be greater than 10').max(100),
        genre: yup.string().required().min(10).max(100)
    });

    return schema.validate(book).then(book => book).catch(error => { return { message: error.message } })
}


exports.Book = new mongoose.model('Book', BookSchema);
exports.validateBook = validate;
