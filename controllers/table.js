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

    console.log('list 1111');
    //console.log(req);
    console.log(req.params);
    console.log(req.params.limit);
    console.log(req.params.tablename);

    console.log(req.query.limit);
    console.log(req.query);


    if (!req.params.tablename) {

        req.params.tablename = 'userinput';
    }

    //sql.query('SELECT * FROM ? LIMIT 10');

    let json = "";
    let sqlQuery = "SELECT * FROM "+ req.params.tablename +" ORDER BY id DESC LIMIT 30";
    console.log(sqlQuery);


    sql.query(sqlQuery,  function (err, sqlres) {



        if(err) {
            console.log("error: ", err);
            result(err, null);
        }
        else{
            //console.log(sqlres);

            json = JSON.stringify(sqlres);
            //console.log(json);

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




// Query TABLE
exports.querytable = function(req, res, next) {

    console.log('querytable1111111');
    //console.log(req);
    console.log(req.params);
    console.log(req.query);
    console.log(req.query.limit);
    console.log(req.query.tablename);
    //console.log(req.params.tablename);


    let tablename = req.query.tablename;
    let limit = req.query.limit;
    let limitstart = req.query.limitstart;

    let sorting = req.query.sorting;
    let sortingColumn = req.query.sortingColumn;



    if (!tablename) {
        tablename = 'userinput';
    }

    if (!limitstart) {
        limitstart = 0;
    }



    //sql.query('SELECT * FROM ? LIMIT 10');


    let filterCols = req.query.filterCols;

    let whereQuery = ' WHERE 1=1 ';
    if (filterCols && filterCols.length>0) {

        console.log('filterCols', filterCols);
        console.log('filterCols', filterCols.length);

        for (const fi in filterCols) {
            whereQuery += ' AND ' + filterCols[fi].name + '='+sql.escape(filterCols[fi].value) + ' ';
        }

    }
    console.log(whereQuery);


    let orderQuery = '';
    if (sorting && sortingColumn) {

        let order = (sorting=='DESC') ? 'DESC' : 'ASC';
        let col = sortingColumn; // TODO: col check
        orderQuery = ' ORDER BY ' + col + ' ' + order;

    }


    let json = "";
    let sqlQuery = "SELECT SQL_CALC_FOUND_ROWS * FROM "+ tablename +" "+whereQuery+" " + orderQuery + " LIMIT "+ limitstart +", "+limit;
    console.log(sqlQuery);


    sql.query(sqlQuery,  function (err, sqlres) {

        if(err) {
            console.log("error: ", err);
            //result(err, null);
            //return false;
            //res.end('error ' + err.toString());
            next(err);
        }
        else{
            //console.log(sqlres);


            let jsonCount = 0;
            sql.query('SELECT FOUND_ROWS() as count',  function (err, sqlRowsRes) {


                //console.log(sqlRowsRes);
                jsonCount = JSON.stringify(sqlRowsRes);
                console.log(jsonCount);

                let count = JSON.parse(jsonCount)[0]['count'];
                //console.log(count);


                json = JSON.stringify(sqlres);
                let jsonRes = {};
                jsonRes.data = json;
                jsonRes.count = jsonCount; // ['FOUND_ROWS()']
                jsonRes.sql = sqlQuery;

                jsonRes = {};
                jsonRes.count = jsonCount[0]['count'];
                jsonRes.count = count;
                jsonRes.data = sqlres;
                jsonRes.sql = sqlQuery;

                //console.log(jsonRes);

                //jsonRes = JSON.parse(jsonRes);
                res.setHeader('Content-Type', 'application/json');
                res.end(JSON.stringify(jsonRes));
                //res.end(jsonRes);
                //res.json(jsonRes);
                //res.json(JSON.stringify(jsonRes));


            });
            //sql.end();
/*

            json = JSON.stringify(sqlres);
            let jsonRes = {};
            jsonRes.data = json;
            //jsonRes.count = jsonC;


            //console.log(json);

            //html
            //var html = tableify(sqlres);
            //console.log(html);



            //res.render('table', { title: 'table list', 'tableRes': json });
            res.setHeader('Content-Type', 'application/json');
            res.end(json);
            //res.json(json);
            //res.end(html);
*/

        }
    });




    // https://devhints.io/pug




    //res.render('table', { title: 'table list', 'tableRes': json });
}

