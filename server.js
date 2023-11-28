'use strict';

const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
require('dotenv').config();

const apiRoutes = require('./routes/api.js');
const fccTestingRoutes = require('./routes/fcctesting.js');
const runner = require('./test-runner');

const app = express();

app.use('/public', express.static(process.cwd() + '/public'));

app.use(cors({ origin: '*' })); //USED FOR FCC TESTING PURPOSES ONLY!

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));


const requestLogger = (request, response, next) => {
  console.log(`${request.method} url:: ${request.url}`);
  console.log('body::')
  console.log(request.body);
  next()
}
app.use(requestLogger)

//Index page (static HTML)
app.route('/')
  .get(function (req, res) {
    res.sendFile(process.cwd() + '/views/index.html');
  });

//For FCC testing purposes
fccTestingRoutes(app);

//Routing for API 
apiRoutes(app);


// Ref site: https://reflectoring.io/express-error-handling/
// Error handling Middleware functions
const errorLogger = (error, request, response, next) => {
  console.log(`error ${error.message}`)
  next(error) // calling next middleware
}

const errorResponder = (error, request, response, next) => {
  response.header("Content-Type", 'application/json')
  const status = error.status || 400
  response.status(status).send(error.message)
}
app.use(errorLogger)
app.use(errorResponder)
//404 Not Found Middleware
app.use(function (req, res, next) {
  res.status(404)
    .type('text')
    .send('Not Found');
});


//Start our server and tests!
const listener = app.listen(process.env.PORT || 3000, function () {
  console.log('Your app is listening on port ' + listener.address().port);
  if (process.env.NODE_ENV === 'test') {
    console.log('Running Tests...');
    setTimeout(function () {
      try {
        runner.run();
      } catch (e) {
        console.log('Tests are not valid:');
        console.error(e);
      }
    }, 1500);
  }
});

module.exports = app; //for unit/functional testing
