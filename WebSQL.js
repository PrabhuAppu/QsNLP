var db = openDatabase('mydb', '1.0', 'Test DB', 2 * 1024 * 1024);
$.ajax({
    url: "data/Orders.csv",
    async: false,
    success: function (result) {
        OrdersData = d3.csvParse(result);
        console.log("Orders", OrdersData);
        var columns = "";
        OrdersData.columns.forEach(function (column) {
            columns += ", '" + column + "'";
        })
        var values = "";
        var query = "";

        db.transaction(function (tx) {

            tx.executeSql('DROP TABLE IF EXISTS ORDERS');
            tx.executeSql('CREATE TABLE ORDERS (unique_id unique' + columns + ')');
            OrdersData.forEach(function (row, id) {
                values = id
                OrdersData.columns.forEach(function (column, row_number) {
                    if (isNaN(row[column])) {
                        try {

                            row[column] = decodeURIComponent(row[column]);
                        } catch (error) {

                        }
                        row[column] = row[column].replaceAll("%20"," ")
                    }
                    values += ", '" + escape(row[column]) + "'";
                });

                // console.log(values)
                query = 'INSERT INTO ORDERS (unique_id ' + columns + ') VALUES (' + values + ')'
                tx.executeSql(query);
            })
        }, (e) => {
            console.error(e, query)
        });
    }
});


function runQuery(MetricInfo, result_number) {
    var QUERY = `SELECT
    ${MetricInfo.Column}
    ${MetricInfo.Column && MetricInfo.Aggregation ? "," : ""}
    ${MetricInfo.Aggregation}
    FROM ORDERS
    WHERE 1=1
     ${MetricInfo.Filter ? 'and ' + MetricInfo.Filter : ''}
     
    ${MetricInfo.Column && MetricInfo.Aggregation ? "GROUP BY " + MetricInfo.Column : ""}
    `;
    console.log('QUERY', QUERY)
    db.transaction(function (tx) {

        tx.executeSql(QUERY, [], function (tx, d) {
            console.log('query result', d)
            var dataSet = []
            var columns = [];
            Object.keys(d.rows[0]).forEach(function (col) {
                columns.push({ title: col })

            })
            // d.rows.forEach(function (row) {
            for (var i = 0; i <= d.rows.length - 1; i++) {
                var row = [];
                Object.keys(d.rows[i]).forEach(function (col) {
                    row.push(d.rows[i][col].toString()
                    .replaceAll("%20"," ")
                    .replaceAll("%23","")
                    )
                })
                dataSet.push(row)
            }
            console.log('dataSet', dataSet, columns)


            $("#results").append(`
            <div class="1lg:w-1/3 1sm:w-1/2 p-4 bg-gray-400 m-2">
                <div class="flex relative" >
                    <table class="display" id="example_${result_number}">...</table>
                </div>
            </div>
            `)

            $('#example_' + result_number).DataTable({
                data: dataSet,
                columns: columns
            });
        });
    }, (e) => {
        console.error(e, query)
    });
}
