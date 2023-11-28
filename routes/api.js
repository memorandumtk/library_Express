'use strict';

const controller = require('../controller/controllers');

module.exports = function (app) {

  app.route('/api/books')
    .get(function (req, res, next) {
      //response will be array of book objects
      //json res format: [{"_id": bookid, "title": book_title, "commentcount": num_of_comments },...]
      controller.bookGet(req, res, next);
    })

    .post(function (req, res, next) {
      //response will contain new book object including atleast _id and title
      controller.bookPost(req, res, next);
    })

    .delete(function (req, res, next) {
      //if successful response will be 'complete delete successful'
      controller.deleteAllBooks(req, res, next);
    });



  app.route('/api/books/:id')
    .get(function (req, res, next) {
      //json res format: {"_id": bookid, "title": book_title, "comments": [comment,comment,...]}
      controller.bookGetWithComment(req, res, next);
    })

    .post(function (req, res, next) {
      controller.commentToBook(req, res, next);
      //json res format same as .get
    })

    .delete(function (req, res, next) {
      let bookid = req.params.id;
      //if successful response will be 'delete successful'
      controller.deleteBook(req, res, next);
    });

  app.route('/api/delete')
    .delete(function (req, res, next) {
      controller.deleteDocuments(req, res, next);
    })
};
