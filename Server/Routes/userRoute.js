const express = require('express');
const router = express.Router();
const User = require('../Models/user.model')

//UPDATE BOOK BASED ON ID
router.put("/:userEmail", async (req, res) => {
    //console.log("BOOKS BOUGHT", req.body.booksbought);
    const updatedBook = await User.updateOne({ email: req.params.userEmail }, {
        booksbought: req.body.booksbought,
    })

    if (!updatedBook) res.status(404).send("Books not found");
    res.send(updatedBook)


})

module.exports = router;