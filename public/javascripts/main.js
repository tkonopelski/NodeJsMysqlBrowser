jQuery(document).ready(function () {

    console.log('main');
    //alert('tt');
    //table_process


    // table_list_result




    //http://tabulator.info/examples/4.2

    $(".table_process").on("click", function(e){
        //        $("#signup").fadeToggle(750, "linear");
        let tName = $(this).data('tablename');
        console.log(tName);

        let url = '/table/' + tName;

        $.ajax({
            type: 'GET',
            url: url,
            //data: "q="+myform.serialize(),
            success: function(data){

                //console.log( data );


                //jQuery('#table_list_result').html(data);

                var tableData = [
                    {id:1, name:"Billy Bob", age:"12", gender:"male", height:1, col:"red", dob:"", cheese:1},
                    {id:2, name:"Mary May", age:"1", gender:"female", height:2, col:"blue", dob:"14/05/1982", cheese:true},
                ]

/*

                var table = new Tabulator("#table_list_result", {
                //    index:"id", //set the index field to the "age" field.
                });
                table.setData(tableData);

*/


                if (data.length<1) {

                    console.log('No data N');
                    return false;

                }

                let table_list_info = jQuery('#table_list_info');
                table_list_info.html('Table: ' + tName);

                var cols = [];

                var index = 0;
                $.each(data[0], function(i, item) {

                    //console.log(i);
                    //console.log(item);

                    cols[index] = {title: i, field: i};
                    index++;
                    //cols[i] = i
                    //console.log(i);
                });

                console.log(cols);


                //var table = new Tabulator("#table_list_result", tableData);


                var table = new Tabulator("#table_list_result", {
                    height:"511px",
                    //'tooltips': true,
                    columns:[
                        {title:"Name", field:"name"},
                        {title:"Progress", field:"progress", align:"right", sorter:"number"},
                        {title:"Gender", field:"gender"},
                        {title:"Rating", field:"rating", align:"center"},
                        {title:"Favourite Color", field:"col"},
                        {title:"Date Of Birth", field:"dob", align:"center", sorter:"date"},
                        {title:"Driver", field:"car", align:"center"},
                    ],
                    columns: cols,
                    rowFormatter:function(row){
                        //console.log(row);
                        if(row.getData().col == "blue"){
                            row.getElement().style.backgroundColor = "#A6A6DF";
                        }
                            console.log(row);

                        if(row.getData().col == "age"){
                            console.log('aggggg');
                            //row.getElement().style.backgroundColor = "#A6A6DF";
                            //var btn = document.createElement('Button');
                            //btn.id = "Btn_Id";
                            //btn.value = 'aaa';
                            //row.getElement().append(btn);
                        }
                    },
                    //autoColumns: true,
                });
                //table.setData(tableData);

                //table.addColumn():

                var the_Function = function(cell, formatterParams, onRendered){ //plain text value

                    //var formA = '<form class="" action="/upload" method="post">'
                    //var inputFn = '<input type="file" id="imgupload" />' ;
                    //var uploadBtnn = '<button type="submit" id="OpenImgUpload">ID upload</button></form>'
//return uploadBtnn

                    console.log(cell);
                    console.log(cell.getRow().getData());




                    return "<i class='fa fa-print' >MODAL</i>";
                };

                table.addColumn({title:"#", field:"age", formatter:the_Function, cellClick:function(e, cell){

                       console.log(cell.getRow());
                       console.log(cell.getData());

                        let tableHtml = generateHtmlTable(cell.getRow().getData());
                        $('#modalRow .modal-body').html(tableHtml);
                        $('#modalRow').modal();

                       //console.log(jQuery(this));
                       //console.log(e);
                       // console.log(cell);

                        //button's function for example
                        var Btn = document.createElement('Button');
                        Btn.id = "Btn_Id";
                        Btn.val = "Btn_Id";
                        console.log(Btn);


                    }
                    }, true, "name");

                function customFilter(data, filterParams){
                    //data - the data for the row being filtered
                    //filterParams - params object passed to the filter
                    //console.log(data);

                    return data;

                    return data.substring(1, 4);

                }

                table.setFilter(customFilter, {height:3});

                table.setData(data);


            },
            error: function(xhr, type, exception) {
                // if ajax fails display error alert
                alert("ajax error response type "+type);
            }
        });

        return false;
    });

}); // ready


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