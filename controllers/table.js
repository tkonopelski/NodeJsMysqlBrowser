var sql = require('../models/db.js');
var sqlquery = require('../models/db.query');

var tableify = require('../libs/tableify')

// https://expressjs.com/en/starter/faq.html



// TABLES
exports.index = function(req, res, next) {

    console.log('tabbb');


    //var tables  = sqlquery.getTables()
    //console.log(tables);

    // SELECT * FROM information_schema.tables

    let json = "";
    //let query = 'SELECT * FROM information_schema.tables';
    //let query = 'SHOW TABLES';
    //let query = 'SELECT table_name AS `Table`, round(((data_length + index_length) / 1024 / 1024), 2) `Size in MB` FROM information_schema.TABLES WHERE table_schema = "muzea"';
    let query = 'SELECT * FROM information_schema.tables WHERE TABLE_SCHEMA="muzea"';

    var results = sql.query(query,  function (err, sqlres) {


        if(err) {
            console.log("error: ", err);
            //result(err, null);
        }
        else{
         //   console.log(res);
            //json = JSON.stringify(res);

            json = JSON.parse(JSON.stringify(sqlres));

            //console.log(json);

            //result(null, res.insertId);

            res.render('tables', { title: 'table', tableRes: res,  json: json, jsonTable: json });
        }
    });

   // json = JSON.parse(JSON.stringify(results));

   // console.log(json);
  //  console.log(results);

    newstuff = [{ "username" : "testuser2", "email" : "testuser2@testdomain.com" }, { "username" : "testuser3", "email" : "testuser3@testdomain.com" }]
    console.log(newstuff);


    // http://stayregular.net/blog/make-a-nodejs-api-with-mysql

   // res.render('tables', { title: 'table', tableRes: results,  newstuff: newstuff, json: json });
}

// ONE TABLE
exports.list = function(req, res, next) {

    console.log('list');
    //console.log(req);
    console.log(req.params);
    console.log(req.params.tablename);

    //sql.query('SELECT * FROM ? LIMIT 10');

    let json = "";

    sql.query("SELECT * FROM "+ req.params.tablename +" ORDER BY id DESC LIMIT 30",  function (err, sqlres) {



        if(err) {
            console.log("error: ", err);
            //result(err, null);
        }
        else{
            //console.log(sqlres);

            json = JSON.stringify(sqlres);
            console.log(json);


            //html
            //var html = tableify(sqlres);
            //console.log(html);



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

