/*
*
*
*       FILL IN EACH FUNCTIONAL TEST BELOW COMPLETELY
*       -----[Keep the tests in the same order!]-----
*       
*/

const chaiHttp = require('chai-http');
const chai = require('chai');
const assert = chai.assert;
const server = require('../server');

chai.use(chaiHttp);

suite('Functional Tests', function () {

  /*
  * ----[EXAMPLE TEST]----
  * Each test should completely test the response of the API end-point including response status code!
  */
  // test('#example Test GET /api/books', function (done) {
  //   chai.request(server)
  //     .get('/api/books')
  //     .end(function (err, res) {
  //       assert.equal(res.status, 200);
  //       assert.isArray(res.body, 'response should be an array');
  //       assert.property(res.body[0], 'commentcount', 'Books in array should contain commentcount');
  //       assert.property(res.body[0], 'title', 'Books in array should contain title');
  //       assert.property(res.body[0], '_id', 'Books in array should contain _id');
  //       done();
  //     });
  // });
  /*
  * ----[END of EXAMPLE TEST]----
  */

  suite('Routing tests', function () {

    let postBook;
    const invalidId = 12345;

    suite('POST /api/books with title => create book object/expect book object', function () {

      test('Test POST /api/books with title', function (done) {
        chai.request(server)
          .post('/api/books')
          .send({ title: 'Book of test' })
          .end(function (err, res) {
            postBook = res.body;
            console.log('this is postbook')
            console.log(postBook);
            assert.equal(res.status, 200);
            assert.property(res.body, 'title', 'The result of POST a book should contain title');
            assert.property(res.body, '_id', 'The result of POST a book should contain _id');
            done();
          });
      });

      test('Test POST /api/books with no title given', function (done) {
        chai.request(server)
          .post('/api/books')
          .end(function (err, res) {
            assert.equal(res.status, 200);
            assert.deepEqual(res.text, 'missing required field title')
            done();
          });
      });

    });


    suite('GET /api/books => array of books', function () {

      test('Test GET /api/books', function (done) {
        chai.request(server)
          .get('/api/books')
          .end(function (err, res) {
            assert.equal(res.status, 200);
            assert.isArray(res.body, 'response should be an array');
            assert.property(res.body[0], 'commentcount', 'Books in array should contain commentcount');
            assert.property(res.body[0], 'title', 'Books in array should contain title');
            assert.property(res.body[0], '_id', 'Books in array should contain _id');
            done();
          });
      });
    });


    suite('GET /api/books/[id] => book object with [id]', function () {

      test('Test GET /api/books/[id] with id not in db', function (done) {
        chai.request(server)
          .get('/api/books/' + invalidId)
          .end(function (err, res) {
            assert.equal(res.status, 200);
            assert.deepEqual(res.text, 'no book exists')
            done();
          });
      });

      test('Test GET /api/books/[id] with valid id in db', function (done) {
        chai.request(server)
          .get('/api/books/' + postBook._id)
          .end(function (err, res) {
            assert.equal(res.status, 200);
            assert.property(res.body, 'title', 'The result of GET the specific book should contain title');
            assert.property(res.body, '_id', 'The result of GET the specific book should contain _id');
            assert.property(res.body, 'comments', 'The result of GET the specific book should contain comments');
            done();
          });
      });

    });


    suite('POST /api/books/[id] => add comment/expect book object with id', function () {

      test('Test POST /api/books/[id] with comment', function (done) {
        chai.request(server)
          .post('/api/books/' + postBook._id)
          .send({ comment: 'Comment to the book of test' })
          .end(function (err, res) {
            assert.equal(res.status, 200);
            assert.property(res.body, 'title', 'The result of GET the specific book should contain title');
            assert.property(res.body, '_id', 'The result of GET the specific book should contain _id');
            assert.property(res.body, 'comments', 'The result of GET the specific book should contain comments');
            done();
          });
      });

      test('Test POST /api/books/[id] without comment field', function (done) {
        chai.request(server)
          .post('/api/books/' + postBook._id)
          .end(function (err, res) {
            assert.equal(res.status, 200);
            assert.deepEqual(res.text, 'missing required field comment')
            done();
          });
      });

      test('Test POST /api/books/[id] with comment, id not in db', function (done) {
        chai.request(server)
          .post('/api/books/noexistbookid')
          .send({ comment: 'Dummy comment' })
          .end(function (err, res) {
            assert.equal(res.status, 200);
            assert.deepEqual(res.text, 'no book exists')
            done();
          });
      });

    });

    suite('DELETE /api/books/[id] => delete book object id', function () {

      test('Test DELETE /api/books/[id] with valid id in db', function (done) {
        chai.request(server)
          .delete('/api/books/' + postBook._id)
          .end(function (err, res) {
            assert.equal(res.status, 200);
            assert.deepEqual(res.text, 'delete successful')
            done();
          });
      });

      test('Test DELETE /api/books/[id] with  id not in db', function (done) {
        chai.request(server)
          .delete('/api/books/noexistbookid')
          .end(function (err, res) {
            assert.equal(res.status, 200);
            assert.deepEqual(res.text, 'no book exists')
            done();
          });
      });

    });

  });

});
