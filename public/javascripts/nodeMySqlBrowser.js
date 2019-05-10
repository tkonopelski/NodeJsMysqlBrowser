


/**
 * NodeMySqlBrowser
 *
 * @returns {NodeMySqlBrowser}
 * @constructor
 */
function NodeMySqlBrowser() {

    console.log('NodeMySqlBrowser');

    this.type = "macintosh";
    this.version = "1.1";
    this.isDebug = true;

    this.divTabHw = false;
    //this.elementTabsul

    this.getInfo = function () {
        console.log('getInfo');
        return this.version + '  0.1b';
    };

    this.init = function () {
        console.log('INIT');


        // Reload
        $(this.getActiveTab() + ' .navigationTab .navigationTabReload').click(function(event) {
            event.preventDefault();
            //event.stopPropagation();
            //$("#box").show();

            console.log('navigationTabReload');
            //console.log(this);
            //console.log($(this));

            initParams = {};
            initParams.tablename = $(nodeMySqlBrowser.getActiveTab() + ' .swichTab .swichTabTableInfo').data('tablename');
            nodeMySqlBrowser.getQueryTable(initParams);
        });



        // Show search forms
        $(this.getActiveTab() + ' .mainTabFormShow').click(function(event) {
            event.preventDefault();
            let path = nodeMySqlBrowser.getActiveTab() + ' form.formTabForm .formColumns';
            $(path).toggleClass('d-none');
        });


    };



    this.getTableFromJson = function (jsonSourceData) {

        initParams = arguments[1] || {};

        console.log('TTT initParams', initParams);

        let contentLimit = 50;

        let tbl = document.createElement('table');
        tbl.setAttribute('class', 'table thead-dark table-striped table-bordered table-hover table-sm queryTable');

        let rootTableObject = $(tbl).clone().empty().append('<thead><tr class="queryTableTrSort"></tr><tr class="queryTableTrName"></tr></thead>');
        let rootHeaderRowSort = rootTableObject.find('tr.queryTableTrSort');
        let rootHeaderRow = rootTableObject.find('tr.queryTableTrName');
        let tableHeaderKeyArray = [];
        let tableHeaderKeys = Object.keys(jsonSourceData[0]);


        if (tableHeaderKeys.length == 0) {
            return '';
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
                    tableDataRow.append('<td>'+val.substring(0, contentLimit) + '...');
                } else {
                    if ($.isNumeric(val)) {
                        tableDataRow.append('<td class="tableColorNumeric">'+val);
                    } else {
                        tableDataRow.append('<td>'+val);
                    }
                }
            }
            rootTableObject.find("tbody").append(tableDataRow)
        }

        //console.log(tbl);

        return $(tbl).html(rootTableObject[0].innerHTML)

    };

    this.getActiveTab = function () {
        let active = jQuery('#nmbTabsUl li a.active');
        if (active && active.length > 0) {
            let href = jQuery(active).attr('href');
            return href;
        }
        return false;
    };

    // Get table
    this.getQueryTable = function (params) {

        //console.log('%c THIS.getQueryTable: ' + params.tablename, 'background: #222; color: #bada55', params);

        let divId = '#nmbGetTablesList';
        //divId = nmbTabsGetActiveDiv();
        divId = this.getActiveTab();


        let divActiveid = divId;
        divId = divId + ' .tabulatorTab';

        //console.log(params);
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

        //navigationTabLimit
        if (jQuery(divActiveid + ' .navigationTabLimit').val() > 0) {

            //console.log('FFF LIM', jQuery(divActiveid + ' .navigationTabLimit').val());
            initParams.limit = jQuery(divActiveid + ' .navigationTabLimit').val();

        }

        //let  serialForm = jQuery(divActiveid+ ' form.formTabForm').serializeArray();
        //console.log( serialForm );
        //initParams.filterCols = serialForm;

        if (params.filterCols) {
            initParams.filterCols = params.filterCols;
        } else {
            initParams.filterCols = this.getColumnsFilter();

        }

        console.log('%c' + params.tablename, 'background: #222; color: #bada55', params, initParams);
        //console.log(initParams);

        //let limitPage = (params.limitpage) ? params.limitpage : 1;

        initParams.limitpage = (params.limitpage && params.limitpage > 0) ? params.limitpage : 1;

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

                //jQuery(divActiveid + ' .swichTab .swichTabTableInfo').data('tablename', initParams.tablename);
                //jQuery(divActiveid + ' .swichTab .swichTabTableInfo').data('sortingColumn', initParams.sortingColumn);
                //jQuery(divActiveid + ' .swichTab .swichTabTableInfo').data('sorting', initParams.sorting);

                jQuery(divActiveid + ' .swichTab .swichTabTableInfo').attr('data-sorting', initParams.sorting);
                jQuery(divActiveid + ' .swichTab .swichTabTableInfo').attr('data-tablename', initParams.tablename);
                jQuery(divActiveid + ' .swichTab .swichTabTableInfo').attr('data-sorting', initParams.sorting);
                jQuery(divActiveid + ' .swichTab .swichTabTableInfo').attr('data-sorting-column', initParams.sortingColumn);

                //console.log(divActiveid + ' .swichTab .swichTabTableInfo');
                //console.log(initParams.sorting);
                //console.log(initParams);

                jQuery(divActiveid + ' .navigationTab').removeClass('d-none');

                if ( data.count/initParams.limit >= 1) {

                    $('#nmbTabContent '+divActiveid + ' .paginatorTab ul').twbsPagination('destroy');

                    let twbsPage = 2;

                    // Pagination
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

                            nodeMySqlBrowser.getQueryTable(params);

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

                    // not here
                    //$(divActiveid + ' .queryTableSortUpDown').removeClass('queryTableSortUpDownActive');
                    //$(this).addClass('queryTableSortUpDownActive');


                });

            },
            error: function(xhr, type, exception) {
                // if ajax fails display error alert
                console.log("ERROR: ajax error response type "+type);
            }
        });




        /*
        params = {};
        params.tablename='userinput';
        nodeMySqlBrowser.getTable(params);


        */





    }; // getQueryTable


    this.getQueryTableFilter = function (cols, data) {

        let formHtml = '';

        formHtml = '';

        //console.log(cols);

        let formPrams = {};
        formPrams.fields_column = {};

        for (const ckey in cols) {

            //console.log(cols[ckey]);
            //formPrams.fields_column.push(cols[ckey]);
            //formPrams.fields_column[ckey]  = cols[ckey];

            formPrams.fields_column[ckey]  = { field: cols[ckey].field};

        }
        //console.log(formPrams.fields_column);

        return formPrams;
    };


    this.getColumnsFilter = function () {

        let divActiveid = this.getActiveTab();

        let serialForm = jQuery(divActiveid+ ' form.formTabForm').serializeArray();

        console.log(serialForm);

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

        //console.log('filterCols', params.filterCols);
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
            //console.log(val);

            formHtml += '<div class="col-auto">';
            formHtml += '<label class="" for="inlineFormInput">'+ columns[ckey].field +'</label>';
            formHtml +=  criteriaColumnOperators ;
            //formHtml += '<input type="text" class="form-control form-control-sm mb-2" name="[columns]['+ckey+']['+columns[ckey].field+']" placeholder="'+columns[ckey].field+'"> '
            formHtml += '<input type="text" class="form-control form-control-sm mb-2" name="'+ columns[ckey].field +'" placeholder="'+columns[ckey].field+'" value="'+val+'"> '
            formHtml += '</div>';

        }

        formHtml += '</div>';

        $(this.getActiveTab() + ' .formTab .formColumns').remove();
        $(this.getActiveTab() + ' .formTab').append( formHtml );
        return formHtml;
    };




    // private constructor
    let __construct = function(that) {
        that.init();
        that.version = '2.2';
        console.log("Object Created.", that);

        //that.divTabHw = $(that.getActiveTab());

    }(this)

    return this;

}



