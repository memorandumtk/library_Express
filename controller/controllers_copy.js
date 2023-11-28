const asyncHandler = require("express-async-handler");
const Book = require('../models/book')
const Comment = require('../models/comment')

// Set up mongoose connection
const mongoose = require("mongoose");
const book = require("../models/book");
mongoose.set("strictQuery", true);
const mongoDB = process.env.MONGODB_URI;
main().catch((err) => console.log(err));
async function main() {
    mongoose.connect(mongoDB);
}


exports.bookGet = asyncHandler(async (req, res, next) => {
    const requestTitle = (req.body.title);
    const books = await Book
        .find({})
        .exec();
    res.send(books);
})

exports.bookPost = asyncHandler(async (req, res, next) => {
    const requestTitle = (req.body.title);
    if (!requestTitle) {
        res.send('missing required field title');
    } else {
        const bookObj = new Book({
            title: requestTitle
        })
        await bookObj.save();
        res.send({ title: bookObj.title, _id: bookObj._id })
    }
})

exports.bookGetWithComment = asyncHandler(async (req, res, next) => {
    const requestTitle = req.body.title;
    const bookId = req.params.id;
    const target = await Book
        .findById(bookId)
        .exec();
    console.log(target)
    if (comments === null) {
        res.send('no book exists')
    } else {
        res.send(target)
    }
})

exports.commentToBook = asyncHandler(async (req, res, next) => {
    const bookId = req.params.id;
    const requestComment = req.body.comment;
    if (requestComment === undefined) {
        res.send('missing required field comment')
    }
    console.log(bookId, requestComment)
    const commentObj = new Comment({
        comment: requestComment
    });
    await commentObj.save();
    console.log('this is comment ' + commentObj)
    let target = await Book
        .findById(bookId)
        .exec();
    console.log(target);
    if (target === null) {
        res.send('no book exists');
    }
    target.comments.push(commentObj.comment);
    target.commentcount = target.comments.length;
    await target.save();
    target = await Book
        .findById(bookId)
        .exec();
    console.log(target)
    res.send(target);
})


// Deleting all documents of collection
exports.deleteDocuments = asyncHandler(async (req, res, next) => {
    await Book.deleteMany({})
    await Comment.deleteMany({})
    console.log('Deleted successfully')
    res.status(200).send('Deleted successfully')
})



// const comments = await Comment
//     .find({ bood: bookId }, 'comment -_id')
// console.log(comments);
// const target = await Book
// .findOne({_id: bookId})
// .exec();
// console.log('this is target book ' + target)
// if(target === null){
//     res.send()
// } else {
//     for (let c of comments){
//         target.comments += c.comment;
//     }
//     console.log(target)
// }