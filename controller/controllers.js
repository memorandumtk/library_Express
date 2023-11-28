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
    try {
        const target = await Book
            .findById(bookId)
            .exec();
        switch (target) {
            case null:
                throw new Error('could not find any book provided id');
            default:
                res.send(target)
                break;
        }
    } catch {
        res.send('no book exists')
    }
})

exports.commentToBook = asyncHandler(async (req, res, next) => {
    const bookId = req.params.id;
    const requestComment = req.body.comment;
    // First switch case to see if comment is existed in req.
    switch (requestComment) {
        case undefined:
            res.send('missing required field comment')
            break;
        default:
            try {
                const commentObj = new Comment({
                    comment: requestComment
                });
                await commentObj.save();
                let target = await Book
                    .findById(bookId)
                    .exec();
                target.comments.push(commentObj.comment);
                target.commentcount = target.comments.length;
                await target.save();
                res.send(target);
            } catch {
                res.send('no book exists');
            }
    }
})

exports.deleteBook = asyncHandler(async (req, res, next) => {
    const bookId = req.params.id;
    try {
        let target = await Book
            .deleteOne({ _id: bookId })
            .exec();
        if (target.deletedCount === 0) throw new Error('could not delete any book provided id');
        res.send('delete successful');
    } catch {
        res.send('no book exists');
    }
})

exports.deleteAllBooks = asyncHandler(async (req, res, next) => {
    let result = await Book.deleteMany({});
    switch (result.deletedCount) {
        case 0:
            console.log('no deleted documents')
            break;
        default:
            res.send('complete delete successful');
            break;
    }
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