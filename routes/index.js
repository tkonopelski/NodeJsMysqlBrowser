var express = require('express');
var router = express.Router();

//router.get('/', function(req, res, next) {
//  res.render('index', { title: 'Express' });
//});

let index = require('../controllers/index');

router.get('/', index.index);
router.get('/databases', index.databases);
router.get('/gettable', index.gettable);
router.get('/gettables', index.gettables);

module.exports = router;
