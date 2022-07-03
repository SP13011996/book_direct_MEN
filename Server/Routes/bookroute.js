const express = require('express');
const router = express.Router();
const { Book, validateBook } = require('../Models/books')

//POST:CREATE A NEW BOOK
router.post('/', async (req, res) => {

    const error = await validateBook(req.body);

    if (error.message) res.status(400).send(error.message);


    book = new Book({
        name: req.body.bookname,
        author: {
            name: req.body.authorname,
            age: req.body.authorage
        },
        genre: req.body.genre,
        price: req.body.price

    });




    //console.log(book);
    book.save().then(book => {
        res.send(book)
    }).catch(error => {
        res.status(500).send("Book was not stored in db")
    })

});

//GET ALL BOOKS
router.get("/", (req, res) => {
    Book.find().
        then((books) => res.send(books)).
        catch(error => {
            res.status(500).send("Something went wrong")
        })
})

//GET BOOKS BY ID
router.get("/:bookId", async (req, res) => {
    const book = await Book.findById(req.params.bookId)
    if (!book)
        res.status(404).send("Book not found");
    res.send(book);
})

//UPDATE BOOK BASED ON ID
router.put("/:bookId", async (req, res) => {
    const updatedBook = await Book.findByIdAndUpdate(req.params.bookId, {
        name: req.body.bookname,
        author: {
            name: req.body.authorname,
            age: req.body.authorage,
        },
        genre: req.body.genre
    }, { new: true })

    if (!updatedBook) res.status(404).send("Books not found");
    res.send(updatedBook)


})

//DELETE BOOK ON ID
router.delete("/:bookId", async (req, res) => {
    const deleteBook = await Book.findByIdAndRemove(req.params.bookId)
    if (!deleteBook) res.status(404).send("Books not found");
    res.send(deleteBook)


})



module.exports = router;