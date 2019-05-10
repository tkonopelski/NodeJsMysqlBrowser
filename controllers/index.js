var sql = require('../models/db.js');


exports.index = function(req, res, next) {

    res.render('index', { title: 'Express !! aaa' });

}

exports.databases= function(req, res, next) {

    console.log('databases');

    let json = "";

    let query = 'show databases';

    var results = sql.query(query,  function (err, sqlres) {

        if(err) {
            console.log("error: ", err);
            //result(err, null);
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
    //console.log(req.param);
    //console.log(req.params.tableparams);

    console.log(req.param('tablename'));

    if (!req.params.tableparams) {

        //res.end('{lllll}');
        //
        //req.params.tablename = 'userinput';
    }

    let dbTable = '';

    if (req.param('tablename')) {

        dbTable = req.param('tablename');
        dbLimit = (req.param('limit')) ? req.param('limit') : 10;

    } else {
        dbTable = 'userinput';
    }

    console.log(dbTable);

    //sql.query('SELECT * FROM ? LIMIT 10');
    //res.end('{}');
    //return;

    let json = "";

    let sqlQuery = "SELECT * FROM "+ dbTable +" ORDER BY id DESC LIMIT " + dbLimit;

    console.log(sqlQuery);

    //res.end('{lllll}');
    //return;


    sql.query(sqlQuery,  function (err, sqlres) {



        if(err) {
            console.log("error: ", err);
            //result(err, null);
        }
        else{
            //console.log(sqlres);

            json = JSON.stringify(sqlres);
            //console.log(json);

            //res.render('table', { title: 'table list', 'tableRes': json });
            res.setHeader('Content-Type', 'application/json');
            res.end(json);
            //res.json(json);
            //res.end(html);

        }
    });


    // https://devhints.io/pug




    //res.render('table', { title: 'table list', 'tableRes': json });
}







// GET TABLES LIST
exports.gettables = function(req, res, next) {

    console.log('gettables');

    let tablename = req.query.tablename;

    if (tablename && tablename.length>1) {

        tablename = req.param('tablename');
        dbLimit = (req.param('limit')) ? req.param('limit') : 10;

    } else {
        tablename = 'muzea';
    }

    console.log(tablename);


    let json = "";

    let sqlQuery = 'SELECT * FROM information_schema.tables WHERE TABLE_SCHEMA="'+ tablename +'"';


    console.log(sqlQuery);

    //res.end('{lllll}');
    //return;


    sql.query(sqlQuery,  function (err, sqlres) {



        if(err) {
            console.log("error: ", err);
            //result(err, null);
        }
        else{
            //console.log(sqlres);

            json = JSON.stringify(sqlres);
            //console.log(json);

            //res.render('table', { title: 'table list', 'tableRes': json });
            res.setHeader('Content-Type', 'application/json');
            res.end(json);
            //res.json(json);
            //res.end(html);

        }
    });


    // https://devhints.io/pug




    //res.render('table', { title: 'table list', 'tableRes': json });
}










