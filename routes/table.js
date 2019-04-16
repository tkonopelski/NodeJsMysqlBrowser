var express = require('express');
var router = express.Router();

//router.get('/', function(req, res, next) {
//    res.send('tableeee');
//});

let table = require('../controllers/table');

router.get('/', table.index);

router.get('/:tablename', table.list);

module.exports = router;