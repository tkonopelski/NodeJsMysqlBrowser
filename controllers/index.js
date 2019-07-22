var sql = require('../models/db.js');

// https://devhints.io/pug

exports.index = function(req, res, next) {

    res.render('index', { title: 'Express !! aaa' });

}

exports.databases= function(req, res, next) {

    console.log('databases SSSSSSSSSSS');

    let json = "";

    let query = 'show databases';

    var results = sql.query(query,  function (err, sqlres) {

        if(err) {
            console.log("error: ", err);
            next(err);
        }
        else{
            //console.log(sqlres);
            json = JSON.stringify(sqlres);

            res.setHeader('Content-Type', 'application/json');
            res.end(json);
        }
    });


}




// GET TABLE
exports.gettable = function(req, res, next) {

    console.log('gettable');
    console.log(req.body);

    console.log(req.param('tablename'));

    if (!req.params.tableparams) {
        //req.params.tablename = 'userinput';
    }

    let dbTable = '';

    if (req.param('tablename')) {

        dbTable = req.param('tablename');
        dbLimit = (req.param('limit')) ? req.param('limit') : 10;
    } else {
        dbTable = 'userinput';
    }

    let json = "";

    let sqlQuery = "SELECT * FROM "+ dbTable +" ORDER BY id DESC LIMIT " + dbLimit;

    console.log(sqlQuery);

    sql.query(sqlQuery,  function (err, sqlres) {

        if(err) {
            console.log("error: ", err);
        }
        else{

            json = JSON.stringify(sqlres);
            res.setHeader('Content-Type', 'application/json');
            res.end(json);
        }
    });

}




// GET TABLES LIST
exports.gettables = function(req, res, next) {

    console.log('gettables');

    let dbname = '';
    let dbLimit = 2;

    dbLimit = (req.param('limit')) ? req.param('limit') : 100;


    let tablename = req.query.tablename;
    if (tablename && tablename.length>1) {
        console.log('gettables 222');
        tablename = req.param('tablename');
        dbLimit = (req.param('limit')) ? req.param('limit') : 10;
    } else {
        tablename = 'muzea';
        //tablename = 'skansen';
    }



    if (req.cookies['nmb_dbname']) {

        dbname = req.cookies['nmb_dbname'];
    } else {
        dbname = 'muzea';
    }

    console.log(req.cookies['nmb_dbname']);

    //nmb_dbname

    let json = "";

    let sqlQuery = 'SELECT * FROM information_schema.tables WHERE TABLE_SCHEMA="'+ dbname +'" LIMIT ' + dbLimit ;

    console.log(sqlQuery);

    sql.query(sqlQuery,  function (err, sqlres) {

        if(err) {
            console.log("error: ", err);
        }
        else{
            json = JSON.stringify(sqlres);
            res.setHeader('Content-Type', 'application/json');
            res.end(json);
        }
    });

}










