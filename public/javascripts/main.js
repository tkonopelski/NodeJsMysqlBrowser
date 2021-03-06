jQuery(document).ready(function () {

    console.log('main 0');



    //loadDatabases();


    //console.log(NodeJsMySqlBrowser.getActiveTab());

}); // ready




/*

*/

const NodeJsMySqlBrowser2 = {
    getActiveTab: function () {
        console.log(`I am aaaaaaaaaaaaaa`);
    }
};











function generateHtmlTable(data) {


    let table = document.createElement("table");

    table.setAttribute('class', 'table');


    for (let element in data) {

        if (data[element] === undefined) {
            continue;
        }
        let row = table.insertRow();
        let cell = row.insertCell();
        let text = document.createTextNode(element);
        cell.appendChild(text);

        cell = row.insertCell();
        text = document.createTextNode(data[element]);
        cell.appendChild(text);

    }

    return table;
}


function loadDatabases() {

    $.ajax({
        type: 'GET',
        url: '/databases',
        //data: "q="+myform.serialize(),
        success: function(data){

            //console.log(data);

            let selectHtml = '<select id="navDatatablesSelect">';
            selectHtml += '<option></option>';

            for (let element in data) {
                selectHtml += '<option>'+ data[element].Database +'</option>';
            }
            selectHtml += '</<select>';

            jQuery('#navDatatablesDiv').html(selectHtml);


            $('#navDatatablesSelect').on('change', function() {
                console.log( this.value );

                Cookies.set('nmb_dbname', this.value, { expires: 100 });

                let params = {};
                params.tablename = this.value;
                nmbGetTablesList(params);

            });


        },
        error: function(xhr, type, exception) {
            // if ajax fails display error alert
            alert("ajax error response type "+type);
        }
    });




    let params = {};
    //params.tablename = 'userinput';
    params.tablename = 'muzea';
    params.limit = 665;
    //nmbGetTable(params);

    nmbGetTablesList(params);

}


/**
 * LIST
 *
 */
function nmbGetTablesList(params) {


    //console.log('nmbGetTablesList');
    console.log('%c nmbGetTablesList! ', 'background: #222; color: #cccccc');
    //let initParams = {}
    //initParams.tablename = params.tablename;
    //initParams.limit = 100;
    //console.log(initParams);

    $.ajax({
        type: 'GET',
        url: '/gettables',
        //data: "q="+myform.serialize(),
        //data: initParams,
        success: function(data){

            console.log(data);
            jQuery('#navTables').html('Loading...');

            let ulHtml = '<ul id="navDatatablesListUl" class="list-group">';

            let count = '';
            for (let element in data) {
                count = '<span class="badge badge-primary badge-pill">'+ data[element].TABLE_ROWS +'</span>';

                ulHtml += '<li class="list-group-item d-flex justify-content-between align-items-center" ' +
                    'data-tablename="'+ data[element].TABLE_NAME +'">'+ data[element].TABLE_NAME +' '+ count +'</li>';
            }
            ulHtml += '</<ul>';

            //console.log(ulHtml);

            //jQuery('#navDatatablesDiv').html(ulHtml);
            //jQuery('#nmbGetTablesList').html(ulHtml);
            jQuery('#navTables').html(ulHtml);


            $('#navDatatablesListUl li').on('click', function() {

                console.log('navDatatablesListUl CLICK' + jQuery(this).data('tablename') );

                let params = {};
                //params.tablename = 'userinput';
                params.tablename = jQuery(this).data('tablename');
                params.limit = 10;
                params.filterCols = {};

                console.log(params);
                //nmbGetTable(params);

                //nodeMySqlBrowser.getTable(params);
                nodeMySqlBrowser.getQueryTable(params);

            });


        },
        error: function(xhr, type, exception) {
            // if ajax fails display error alert
            alert("ajax error response type "+type);
        }
    });


}


/**
 * Query table
 *
 * @param params
 */
function nmbGetTable(params) {



    console.log('%c nmbGetTable: ' + params.tablename, 'background: #222; color: #bada55');

    console.log(params);
    let initParams = {}
    initParams.tablename = params.tablename;

    if (params.limit && params.limit.length > 0) {
        initParams.limit = params.limit;
    } else {
        initParams.limit = 10;
    }

    if (params.limitstart && params.limitstart > 0) {
        initParams.limitstart = params.limitstart;
    } else {
        initParams.limitstart = 0;
    }

    console.log(initParams);

    let divId = '#nmbGetTablesList';
    divId = nmbTabsGetActiveDiv();
    let divActiveid = divId;
    divId = divId + ' .tabulatorTab';


    //$('#nmbTabContent '+divActiveid + ' .paginatorTab ul').empty();

    jQuery(divId).text('Loading...');

    //let url = 'gettables';
    //let url = '/table/' + params.tablename + '?' + Object.entries(initParams).map(e => e.join('=')).join('&');
    //let url = '/table/' + params.tablename;
    let url = '/table/querytable';

    $.ajax({
        type: 'GET',
        url: url,
        data: initParams,
        success: function(data){

            console.log(data);
            //jQuery('#nmbGetTablesList').text('Loading...');

            //let tName = $(this).data('tablename');

            let tName = initParams.tablename;

            //console.log(tName);
            //console.log(initParams);

            let table_list_info = jQuery('#table_list_info');
            table_list_info.html('Table tName:  ' + tName);

            var cols = [];
            var index = 0;
            $.each(data.data[0], function(i, item) {
                cols[index] = {title: i, field: i};
                index++;
            });

            console.log(cols);
            //console.log(divId);
            //jQuery('<ul id="pagination-demo" class="pagination-sm"></ul>').insertBefore(divId);
            //jQuery('<input type="number" id="params_limit">').insertBefore(divId);

            console.log('Pages: ' +  (data.count/initParams.limit) );
            if (initParams.limitstart > 0) {

                console.log('Pages 222 : ' +  ((data.count/initParams.limitstart)-1) );
            }

            if ( data.count/initParams.limit >= 1) {

                //return;

                $('#nmbTabContent '+divActiveid + ' .paginatorTab ul').twbsPagination('destroy');

                // Pagination
                $('#nmbTabContent '+divActiveid + ' .paginatorTab ul').twbsPagination({
                    totalPages: data.count/initParams.limit,
                    //visiblePages: initParams.limit,
                    initiateStartPageClick: false,
                    //startPage: 2,
                    //itemOnPage: 8,
                    onPageClick: function (event, page) {
                        $('#page-content').text('Page ' + page);
                        console.log('Page ' + page);

                        let params = {};
                        //params.tablename = 'userinput';
                        //params.tablename = jQuery(this).data('tablename');
                        params.tablename = tName;
                        params.limit = 10;
                        params.limitstart = (page-1)*params.limit;
                        nmbGetTable(params);

                    }
                });
            }



            var table = new Tabulator(divId, {
                height:"511px",
                columns: cols,
                rowFormatter:function(row){

                    //if(row.getData().col == "blue"){
                    //    row.getElement().style.backgroundColor = "#A6A6DF";
                    //}
                    //console.log(row);

                },
                //autoColumns: true,
            });


            var the_Function = function(cell, formatterParams, onRendered){

                //console.log(cell);
                //console.log(cell.getRow().getData());

                return "<div class='' >☰</div>";
            };

            table.addColumn({title:"#", field:"age", formatter:the_Function, cellClick:function(e, cell){

                    //console.log(cell.getRow());
                    //console.log(cell.getData());

                    let tableHtml = generateHtmlTable(cell.getRow().getData());
                    $('#modalRow .modal-body').html(tableHtml);
                    $('#modalRow').modal();

                }
            }, true, "name");

            function customFilter(data, filterParams){
                //data - the data for the row being filtered
                //filterParams - params object passed to the filter
                //console.log(data);
                //console.log(filterParams);
                //data.id = 'aa ' + data.id;
                //return data.substring(1, 4);
                return data;
            }

            table.setFilter(customFilter, {height:3});

            console.log(data.data);
            table.setData(data.data);


            },
            error: function(xhr, type, exception) {
                // if ajax fails display error alert
                console.log("ERROR: ajax error response type "+type);
            }
        });


}


/**
 * Get active tab
 *
 * @returns {*|jQuery|boolean}
 */
function nmbTabsGetActiveDiv() {

    let active = jQuery('#nmbTabsUl li a.active');
    //console.log(active);
    if (active && active.length > 0) {
        //console.log(jQuery(active).attr('id'));
        //console.log(href.substring(1));
        //return href.substring(1);
        let href = jQuery(active).attr('href');
        return href;
    }
    return false;

}

function nmbTabsActions() {

    //let tabNav = $('#nmbTabContent #home').get(0);
    //let tabNav = $('#nmbTabContent #home .mainTab');
    //let tabNav = $('#nmbTabContent #home .mainTab').clone();
    //var tabNav = $('#nmbTabMainParams .mainTab').clone(true);
    var tabNav = $('#nmbTabMainParams .mainTab').html();
    //console.log(tabNav);
    //tabNav = $(tabNav).clone();
    //console.log(tabNav);

    //jQuery('#nmbTabContent #home').append(tabNav);
    jQuery(tabNav).appendTo('#nmbTabContent #home');
    jQuery(tabNav).appendTo('#nmbTabContent #contact');

    $(".nav-tabs").on("click", "a", function (e) {
        e.preventDefault();
        if (!$(this).hasClass('add-contact')) {
            $(this).tab('show');
        }
    })
        .on("click", "span", function () {

            if (!confirm('Delete')) {
                return false;
            }

            var anchor = $(this).siblings('a');
            $(anchor.attr('href')).remove();
            $(this).parent().remove();
            $(".nav-tabs li").children('a').first().click();
        });

    $('.add-contact').click(function (e) {
        e.preventDefault();
        var id = $(".nav-tabs").children().length;
        var tabId = 'querytab_' + id;


        console.log(tabId);

        $(this).closest('li').before('<li><a class="nav-link" data-toggle="tab" role="tab" href="#' + tabId + '">Tab #'+ id +'</a> <span> x </span></li>');
        //$('.tab-content').append('<div class="tab-pane" id="' + tabId + '"><div class="tabulatorTab">Empty' + id + '</div></div>');
        //$('.tab-content').append('<div class="tab-pane" id="' + tabId + '">..............</div>');

        //$( '<div class="tab-pane" id="' + tabId + '">..............</div>').insertBefore( ".tab-content" );
        $('#nmbTabContent').append( '<div class="tab-pane" id="' + tabId + '">..............</div>');
        //$( '<div class="tab-pane" id="' + tabId + '">..............</div>').insertBefore( "#nmbTabContent" );

       //jQuery('#nmbTabContent #' +tabId).append(tabNav);
       jQuery('#nmbTabContent #' +tabId).html(tabNav);


        $('.nav-tabs li:nth-child(' + id + ') a').click();
    });
}


