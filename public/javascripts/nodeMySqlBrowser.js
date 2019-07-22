


/**
 * NodeMySqlBrowser
 *
 * @returns {NodeMySqlBrowser}
 * @constructor
 */
function NodeMySqlBrowser() {

    console.log('NodeMySqlBrowser');

    this.version = "1.2";
    this.isDebug = true;
    this.divTabHw = false;


    this.getInfo = function () {
        console.log('getInfo');
        return 'V:' + this.version + ' D:' + Number(this.isDebug);
    };

    this.init = function () {

        console.log('INIT 2');

        this.loadDatabases();
        this.tabsActions();

        // Reload
        $(this.getActiveTab() + ' .navigationTab .navigationTabReload').click(function(event) {
            event.preventDefault();

            console.log('navigationTabReload');
            //console.log(this);
            //console.log($(this));

          

            initParams = {};
            initParams.tablename = $(nodeMySqlBrowser.getActiveTab() + ' .swichTab .swichTabTableInfo').data('tablename');
            nodeMySqlBrowser.getQueryTable(initParams);
        });



        // Show/Hide search forms
        $(this.getActiveTab() + ' .mainTabFormShow').click(function(event) {
            event.preventDefault();
            let path = nodeMySqlBrowser.getActiveTab() + ' form.formTabForm .formColumns';
            $(path).toggleClass('d-none');
        });


    };


    /**
     * Return html table from json data
     *
     * @param jsonSourceData
     * @returns {string|*|jQuery}
     */
    this.getTableFromJson = function (jsonSourceData) {

        console.log(jsonSourceData);

        if (!jsonSourceData || jsonSourceData.length == 0) {
            console.log('getTableFromJson  NO DATA');
            return  '';
        }

        initParams = arguments[1] || {};

        let contentLimit = 50;
        let tbl = document.createElement('table');
        tbl.setAttribute('class', 'table thead-dark table-striped table-bordered table-hover table-sm queryTable');

        let rootTableObject = $(tbl).clone().empty().append('<thead><tr class="queryTableTrSort"></tr><tr class="queryTableTrName"></tr></thead>');
        let rootHeaderRowSort = rootTableObject.find('tr.queryTableTrSort');
        let rootHeaderRow = rootTableObject.find('tr.queryTableTrName');
        let tableHeaderKeyArray = [];
        let tableHeaderKeys = Object.keys(jsonSourceData[0]);


        if (tableHeaderKeys.length == 0) {
            console.log('getTableFromJson  NO DATA 2');
        }

        let sorting = '';
        let sortingColumn = '';

        if (initParams.sorting) {
            sorting = initParams.sorting;
            sortingColumn = initParams.sortingColumn;
        }

        for (let kc = 0; kc < tableHeaderKeys.length; kc++)
        {
            sortHtml = '';
            let orderArr = ['DESC', 'ACS'];
            let orderArrIcon = ['↧', '↥'];
            let activeClass  = '';

            for (const ckey in orderArr) {
                activeClass = '';
                if (orderArr[ckey] == sorting && sortingColumn == tableHeaderKeys[kc]) {
                    activeClass = ' queryTableSortUpDownActive '
                }
                sortHtml += '<span class="queryTableSortUpDown '+ activeClass +'" data-sorting="'+orderArr[ckey]+'" data-sorting-column="'+ tableHeaderKeys[kc]  +'">'+orderArrIcon[ckey]+'</span>';
            }

            $(rootHeaderRowSort).append('<th>'+ sortHtml +'</th>');
        }

        for (let kc = 0; kc < tableHeaderKeys.length; kc++)
        {
            tableHeaderKeyArray.push(tableHeaderKeys[kc]);
            $(rootHeaderRow).append('<th>'+tableHeaderKeys[kc]+'</th>');
        }
        rootTableObject.append("<tbody></tbody>");
        for (let jr = 0; jr < jsonSourceData.length; jr++)
        {
            let tableDataRow = $('<tr></tr>')
            for (let ki = 0; ki < tableHeaderKeyArray.length; ki++)  {

                let val = jsonSourceData[jr][tableHeaderKeyArray[ki]];
                if (val && val.length > contentLimit) {
                    tableDataRow.append('<td>'+ this.escapeHtml(val.substring(0, contentLimit) + '...') );
                } else {
                    if ($.isNumeric(val)) {
                        tableDataRow.append('<td class="tableColorNumeric">'+val);
                    } else {
                        tableDataRow.append('<td>'+ this.escapeHtml(val) + '</td>');
                    }
                }
            }
            rootTableObject.find("tbody").append(tableDataRow)
        }

        //console.log(tbl);

        return $(tbl).html(rootTableObject[0].innerHTML)

    };


    /**
     * Get Active Tab
     *
     * @returns {*|jQuery|boolean}
     */
    this.getActiveTab = function () {
        let active = jQuery('#nmbTabsUl li a.active');
        if (active && active.length > 0) {
            let href = jQuery(active).attr('href');
            return href;
        }
        return false;
    };


    /**
     * Escape 
     * 
     * @todo: move to server side
     */
    this.escapeHtml = function (text) {

        if (typeof text === 'string' || text instanceof String) {        

            let map = {
                '&': '&amp;',
                '<': '&lt;',
                '>': '&gt;',
                '"': '&quot;',
                "'": '&#039;'
            };
            return text.replace(/[&<>"']/g, function(m) { return map[m]; });
        } else {
            return '';
        }
    };


    /**
     * Get table
     *
     * @param params
     */
    this.getQueryTable = function (params) {

        //console.log('%c THIS.getQueryTable: ' + params.tablename, 'background: #222; color: #bada55', params);

        let divId = '#nmbGetTablesList';
        divId = this.getActiveTab();
        let divActiveid = divId;
        divId = divId + ' .tabulatorTab';

        let initParams = {}

        if (params.tablename && params.tablename.length>1) {
            initParams.tablename = params.tablename;
        } else {
            initParams.tablename = $(this.getActiveTab() + ' .swichTab .swichTabTableInfo').data('tablename');
        }

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

        if (params.sorting && params.sorting.length > 1) {
            initParams.sorting = params.sorting;
            initParams.sortingColumn = params.sortingColumn;
        }

        if (jQuery(divActiveid + ' .navigationTabLimit').val() > 0) {
            initParams.limit = jQuery(divActiveid + ' .navigationTabLimit').val();
        }


        if (params.filterCols) {
            initParams.filterCols = params.filterCols;
        } else {
            initParams.filterCols = this.getColumnsFilter();

        }

        console.log('%c' + params.tablename, 'background: #222; color: #bada55', params, initParams);

        initParams.limitpage = (params.limitpage && params.limitpage > 0) ? params.limitpage : 1;

        jQuery(divId).text('Loading...');

        let url = '/table/querytable';

        $.ajax({
            type: 'GET',
            url: url,
            data: initParams,
            success: function(data){

                console.log(data);

                if (data.length<1) {
                    console.log('ERROR: no data');
                }

                let tName = initParams.tablename;

                let cols = [];
                let index = 0;
                $.each(data.data[0], function(i, item) {
                    cols[index] = {title: i, field: i};
                    index++;
                });

                jQuery(divActiveid + ' .navigationTabLimit').val(initParams.limit);
                jQuery(divActiveid + ' .swichTab .swichTabTableInfo').html(initParams.tablename);

                jQuery(divActiveid + ' .swichTab .swichTabTableInfo').attr('data-sorting', initParams.sorting);
                jQuery(divActiveid + ' .swichTab .swichTabTableInfo').attr('data-tablename', initParams.tablename);
                jQuery(divActiveid + ' .swichTab .swichTabTableInfo').attr('data-sorting', initParams.sorting);
                jQuery(divActiveid + ' .swichTab .swichTabTableInfo').attr('data-sorting-column', initParams.sortingColumn);

                jQuery(divActiveid + ' .navigationTab').removeClass('d-none');


                /**
                 * Twbs Pagination
                 *
                 */
                if ( data.count/initParams.limit >= 1) {

                    $('#nmbTabContent '+divActiveid + ' .paginatorTab ul').twbsPagination('destroy');
                    let twbsPage = 2;

                    $('#nmbTabContent '+divActiveid + ' .paginatorTab ul').twbsPagination({
                        totalPages: data.count/initParams.limit+1,
                        //visiblePages: initParams.limit,
                        initiateStartPageClick: false,
                        //page: twbsPage,
                        startPage: initParams.limitpage,
                        //itemOnPage: 8, // TODO
                        onPageClick: function (event, page) {

                            event.preventDefault();
                            let params = {};
                            params.tablename = tName;
                            //params.limit = 10;
                            params.limit = jQuery(divActiveid + ' .navigationTabLimit').val();
                            params.limitstart = (page-1)*params.limit;
                            params.limitpage = page;
                            params.sorting = jQuery(divActiveid + ' .swichTab .swichTabTableInfo').attr('data-sorting');
                            params.sortingColumn = jQuery(divActiveid + ' .swichTab .swichTabTableInfo').attr('data-sorting-column');

                            nodeMySqlBrowser.getQueryTable(params); // GO!

                        }
                    });

                }


                let d = nodeMySqlBrowser.getTableFromJson(data.data, initParams);
                $(divId).html(d);

                if (this.isDebug) {
                    //$(divActiveid + ' .navigationTab .navigationTabJson').remove();
                    $(divActiveid + ' .navigationTab').append('<div class="navigationTabJson">' + JSON.stringify(initParams) + '</div>');
                }

                let formPrams = nodeMySqlBrowser.getQueryTableFilter(cols, initParams);

                let formColumns = nodeMySqlBrowser.getFormColumns(formPrams.fields_column, initParams);


                // SORTING
                $(divActiveid + ' .queryTableSortUpDown').click(function () {

                    initParams = {};
                    initParams.tablename = $(nodeMySqlBrowser.getActiveTab() + ' .swichTab .swichTabTableInfo').data('tablename');
                    initParams.sorting = $(this).data('sorting');
                    initParams.sortingColumn = $(this).data('sorting-column');
                    nodeMySqlBrowser.getQueryTable(initParams);

                });

            },
            error: function(xhr, type, exception) {
                // if ajax fails display error alert
                console.log("ERROR: ajax error response type "+type);
            }
        });
    }; // getQueryTable


    this.getQueryTableFilter = function (cols, data) {

        let formHtml = '';
        formHtml = '';

        let formPrams = {};
        formPrams.fields_column = {};

        for (const ckey in cols) {

            formPrams.fields_column[ckey]  = { field: cols[ckey].field};
        }
        //console.log(formPrams.fields_column);

        return formPrams;
    };


    this.getColumnsFilter = function () {

        let divActiveid = this.getActiveTab();

        let serialForm = jQuery(divActiveid+ ' form.formTabForm').serializeArray();

        //console.log(serialForm);

        let newData = {};
        for (const ckey in serialForm) {

            if (serialForm[ckey].value && serialForm[ckey].value.length > 0 && serialForm[ckey].name != 'criteria') {
                newData[ckey] = serialForm[ckey];
            }
        }

        console.log('%c getColumnsFilter: ' + newData, 'background: #eeeeee; color: #bada55', newData);


        return newData;

    };


    this.getFormColumns = function (columns, params) {

        let criteriaColumnOperators = $('#criteriaColumnOperators').html();

        let formHtml = '';
        formHtml += '';
        formHtml += '<div class="formColumns form-row align-items-center d-none">';
        for (const ckey in columns) {

            let val = '';
            for (const par in params.filterCols) {
                if (params.filterCols[par].name == columns[ckey].field) {
                    val = params.filterCols[par].value;
                }
            }

            formHtml += '<div class="col-auto">';
            formHtml += '<label class="" for="inlineFormInput">'+ columns[ckey].field +'</label>';
            formHtml +=  criteriaColumnOperators ;
            formHtml += '<input type="text" class="form-control form-control-sm mb-2" name="'+ columns[ckey].field +'" placeholder="'+columns[ckey].field+'" value="'+val+'"> '
            formHtml += '</div>';

        }

        formHtml += '</div>';

        $(this.getActiveTab() + ' .formTab .formColumns').remove();
        $(this.getActiveTab() + ' .formTab').append( formHtml );
        return formHtml;
    };


    this.loadDatabases = function () {


        console.log('load 11111');

        $.ajax({
            type: 'GET',
            url: '/databases',
            success: function(data){
    
                console.log(data);
    
                let selectHtml = '<select id="navDatatablesSelect" class="form-control">';
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
                    nodeMySqlBrowser.getTablesList(params);
                });
    
    
            },
            error: function(xhr, type, exception) {
                // if ajax fails display error alert
                alert("ajax error response type "+type);
            }
        });
    };



    /**
     * Old get tables
     * 
     */
    this.getTablesList = function (params) {

        console.log('nmbGetTablesList OOP');


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
                let size = '';
                let sizeMB, sizeKB = '';
                let label = '';
                for (let element in data) {
                    

                    // round(((data_length + index_length) / 1024 / 1024), 2) `Size in MB` 
                    size = (data[element].DATA_LENGTH + data[element].INDEX_LENGTH);
                    sizeMB = (size/1024)/1024;
                    sizeKB = (size/1024).toFixed(1);
                    sizeMB = sizeMB.toFixed(1);

                    console.log(sizeMB);
                    
                    count = '<span class="badge badge-primary badge-pill">'+ data[element].TABLE_ROWS + '/' + sizeMB  + 'MB</span>';


                    label = '<div class="navDatatablesListLabel">'+ data[element].TABLE_ROWS + '/' + sizeKB  + 'KB</div>';
                    count = label;

//                    ulHtml += '<li class="list-group-item d-flex justify-content-between align-items-center" ' +
  //                      'data-tablename="'+ data[element].TABLE_NAME +'">'+ data[element].TABLE_NAME +' '+ count + '</li>';



                    ulHtml += '<li class="list-group-item d-flex11 justify-content-between11 align-items-center11" ' +
                        'data-tablename="'+ data[element].TABLE_NAME +'">'+ data[element].TABLE_NAME +' '+ count + '</li>';




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

    };


    this.tabsActions = function () {


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


    };


    // private constructor
    let __construct = function(that) {
        that.init();

        console.log("Object Created.", that);

    }(this)

    return this;

}



