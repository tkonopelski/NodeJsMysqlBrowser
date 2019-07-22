var sql = require('../models/db.js');
//var sqlquery = require('../models/db.query');
//var tableify = require('../libs/tableify')

// https://expressjs.com/en/starter/faq.html



exports.index = function(req, res, next) {

    res.end('');

}

// ONE TABLE
exports.list = function(req, res, next) {

    console.log('list...');

    if (!req.params.tablename) {

        req.params.tablename = 'userinput';
    }

    let json = "";
    let sqlQuery = "SELECT * FROM "+ req.params.tablename +" ORDER BY id DESC LIMIT 30";
    console.log(sqlQuery);


    sql.query(sqlQuery,  function (err, sqlres) {

        if (err) {
            console.log("error: ", err);

        }
        else {

            json = JSON.stringify(sqlres);
            res.setHeader('Content-Type', 'application/json');
            res.end(json);

        }
    });
}



// Query TABLE
exports.querytable = function(req, res, next) {

    console.log('querytable22...');
    console.log(req.query);
    //console.log(req.query.limit);
    //console.log(req.query.tablename);

    let dbname = req.cookies['nmb_dbname'];

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


    let filterCols = req.query.filterCols;

    let whereQuery = ' WHERE 1=1 ';
    if (filterCols && filterCols.length>0) {

        //console.log('filterCols', filterCols);
        //console.log('filterCols', filterCols.length);

        for (const fi in filterCols) {
            whereQuery += ' AND ' + filterCols[fi].name + '='+sql.escape(filterCols[fi].value) + ' ';
        }

    }
    //console.log(whereQuery);

    let orderQuery = '';
    if (sorting && sortingColumn) {

        let order = (sorting=='DESC') ? 'DESC' : 'ASC';
        let col = sortingColumn; // TODO: col check
        orderQuery = ' ORDER BY ' + col + ' ' + order;
    }

    let json = "";
    let sqlQuery = "SELECT SQL_CALC_FOUND_ROWS * FROM " +dbname+"."+ tablename +" "+whereQuery+" " + orderQuery + " LIMIT "+ limitstart +", "+limit;
    console.log(sqlQuery);


    sql.query(sqlQuery,  function (err, sqlres) {

        if(err) {
            console.log("error: ", err);
            next(err);
        }
        else{

            let jsonCount = 0;
            sql.query('SELECT FOUND_ROWS() as count',  function (err, sqlRowsRes) {

                jsonCount = JSON.stringify(sqlRowsRes);
                let count = JSON.parse(jsonCount)[0]['count'];
                //console.log(count);
                json = JSON.stringify(sqlres);
                let jsonRes = {};
                jsonRes.data = json;
                jsonRes.count = jsonCount;
                jsonRes.sql = sqlQuery;

                jsonRes = {};
                jsonRes.count = jsonCount[0]['count'];
                jsonRes.count = count;
                jsonRes.data = sqlres;
                jsonRes.sql = sqlQuery;

                res.setHeader('Content-Type', 'application/json');
                res.end(JSON.stringify(jsonRes));

            });

        }
    });
}

