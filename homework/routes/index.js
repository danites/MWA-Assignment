var express = require('express');
var router = express.Router();
var fs = require('fs');

/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('index', { title: 'Home' });
});

router.get('/newsletter', function (req, res, next) {
  res.render('newsletter', { title: 'newsletter', success: false, errors: {}, csrfToken: req.csrfToken() });
});

router.post('/newsletter', function (req, res, next) {
  req.assert('fname', 'Name is Required').notEmpty();
  req.assert('email', 'Email is Required').notEmpty();

  var errors = req.validationErrors();

  console.log(errors.length);

  if (errors)
    res.render('newsletter', { title: 'newsletter', errors: errors, success: false, csrfToken: req.csrfToken() });
  else {
    var body = 'Full Name: ' + req.body.fname + '   ' + 'Email: ' + req.body.email ;

    fs.exists('./data/subscribers.txt', (exists) => {
      if (exists) {
        fs.appendFile('./data/subscribers.txt', body, function (err, data) {
          if (err) throw err;
          console.log('Done!');
        });
      } else {
        fs.writeFile('./data/subscribers.txt', body, function (err, data) {
          if (err) throw err;
          console.log('Done!');
        });
      }

    });

    res.render('thankyou', { title: 'newsletter', errors: errors, success: true, csrfToken: req.csrfToken() });
  }

});

module.exports = router;