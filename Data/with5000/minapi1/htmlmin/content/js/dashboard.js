/*
   Licensed to the Apache Software Foundation (ASF) under one or more
   contributor license agreements.  See the NOTICE file distributed with
   this work for additional information regarding copyright ownership.
   The ASF licenses this file to You under the Apache License, Version 2.0
   (the "License"); you may not use this file except in compliance with
   the License.  You may obtain a copy of the License at

       http://www.apache.org/licenses/LICENSE-2.0

   Unless required by applicable law or agreed to in writing, software
   distributed under the License is distributed on an "AS IS" BASIS,
   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   See the License for the specific language governing permissions and
   limitations under the License.
*/
var showControllersOnly = false;
var seriesFilter = "";
var filtersOnlySampleSeries = true;

/*
 * Add header in statistics table to group metrics by category
 * format
 *
 */
function summaryTableHeader(header) {
    var newRow = header.insertRow(-1);
    newRow.className = "tablesorter-no-sort";
    var cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 1;
    cell.innerHTML = "Requests";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 3;
    cell.innerHTML = "Executions";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 7;
    cell.innerHTML = "Response Times (ms)";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 1;
    cell.innerHTML = "Throughput";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 2;
    cell.innerHTML = "Network (KB/sec)";
    newRow.appendChild(cell);
}

/*
 * Populates the table identified by id parameter with the specified data and
 * format
 *
 */
function createTable(table, info, formatter, defaultSorts, seriesIndex, headerCreator) {
    var tableRef = table[0];

    // Create header and populate it with data.titles array
    var header = tableRef.createTHead();

    // Call callback is available
    if(headerCreator) {
        headerCreator(header);
    }

    var newRow = header.insertRow(-1);
    for (var index = 0; index < info.titles.length; index++) {
        var cell = document.createElement('th');
        cell.innerHTML = info.titles[index];
        newRow.appendChild(cell);
    }

    var tBody;

    // Create overall body if defined
    if(info.overall){
        tBody = document.createElement('tbody');
        tBody.className = "tablesorter-no-sort";
        tableRef.appendChild(tBody);
        var newRow = tBody.insertRow(-1);
        var data = info.overall.data;
        for(var index=0;index < data.length; index++){
            var cell = newRow.insertCell(-1);
            cell.innerHTML = formatter ? formatter(index, data[index]): data[index];
        }
    }

    // Create regular body
    tBody = document.createElement('tbody');
    tableRef.appendChild(tBody);

    var regexp;
    if(seriesFilter) {
        regexp = new RegExp(seriesFilter, 'i');
    }
    // Populate body with data.items array
    for(var index=0; index < info.items.length; index++){
        var item = info.items[index];
        if((!regexp || filtersOnlySampleSeries && !info.supportsControllersDiscrimination || regexp.test(item.data[seriesIndex]))
                &&
                (!showControllersOnly || !info.supportsControllersDiscrimination || item.isController)){
            if(item.data.length > 0) {
                var newRow = tBody.insertRow(-1);
                for(var col=0; col < item.data.length; col++){
                    var cell = newRow.insertCell(-1);
                    cell.innerHTML = formatter ? formatter(col, item.data[col]) : item.data[col];
                }
            }
        }
    }

    // Add support of columns sort
    table.tablesorter({sortList : defaultSorts});
}

$(document).ready(function() {

    // Customize table sorter default options
    $.extend( $.tablesorter.defaults, {
        theme: 'blue',
        cssInfoBlock: "tablesorter-no-sort",
        widthFixed: true,
        widgets: ['zebra']
    });

    var data = {"OkPercent": 82.69137670196672, "KoPercent": 17.308623298033282};
    var dataset = [
        {
            "label" : "FAIL",
            "data" : data.KoPercent,
            "color" : "#FF6347"
        },
        {
            "label" : "PASS",
            "data" : data.OkPercent,
            "color" : "#9ACD32"
        }];
    $.plot($("#flot-requests-summary"), dataset, {
        series : {
            pie : {
                show : true,
                radius : 1,
                label : {
                    show : true,
                    radius : 3 / 4,
                    formatter : function(label, series) {
                        return '<div style="font-size:8pt;text-align:center;padding:2px;color:white;">'
                            + label
                            + '<br/>'
                            + Math.round10(series.percent, -2)
                            + '%</div>';
                    },
                    background : {
                        opacity : 0.5,
                        color : '#000'
                    }
                }
            }
        },
        legend : {
            show : true
        }
    });

    // Creates APDEX table
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.3722806354009077, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [1.0, 500, 1500, "1000Users"], "isController": false}, {"data": [1.0, 500, 1500, "10000Users"], "isController": false}, {"data": [1.0, 500, 1500, "1000getEfCoreById"], "isController": false}, {"data": [1.0, 500, 1500, "10000getEfCoreById"], "isController": false}, {"data": [1.0, 500, 1500, "100Users"], "isController": false}, {"data": [0.995, 500, 1500, "100getEfCoreById"], "isController": false}, {"data": [0.02148, 500, 1500, "50000getEfCoreById"], "isController": false}, {"data": [0.02241, 500, 1500, "50000Users"], "isController": false}, {"data": [1.0, 500, 1500, "10000getEfCore"], "isController": false}, {"data": [1.0, 500, 1500, "1000getEfCore"], "isController": false}, {"data": [1.0, 500, 1500, "100getEfCore"], "isController": false}, {"data": [1.0, 500, 1500, "10000Plain"], "isController": false}, {"data": [1.0, 500, 1500, "1000Plain"], "isController": false}, {"data": [1.0, 500, 1500, "5000Users"], "isController": false}, {"data": [0.63354, 500, 1500, "50000Plain"], "isController": false}, {"data": [1.0, 500, 1500, "5000getEfCoreById"], "isController": false}, {"data": [1.0, 500, 1500, "100Plain"], "isController": false}, {"data": [1.0, 500, 1500, "5000Plain"], "isController": false}, {"data": [0.0032, 500, 1500, "50000getEfCore"], "isController": false}, {"data": [1.0, 500, 1500, "5000getEfCore"], "isController": false}]}, function(index, item){
        switch(index){
            case 0:
                item = item.toFixed(3);
                break;
            case 1:
            case 2:
                item = formatDuration(item);
                break;
        }
        return item;
    }, [[0, 0]], 3);

    // Create statistics table
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 264400, 45764, 17.308623298033282, 5701.648997730667, 0, 47275, 338.0, 1208.0, 1523.0, 2444.9900000000016, 71.66123425363632, 3028.7416567022365, 7.541208258821731], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["1000Users", 1000, 0, 0.0, 15.332000000000019, 10, 40, 14.0, 20.0, 23.0, 26.0, 16.660835374285668, 2047.086254186035, 1.9524416454241016], "isController": false}, {"data": ["10000Users", 10000, 0, 0.0, 11.563900000000007, 8, 205, 10.0, 14.0, 16.0, 36.0, 166.59447572718489, 20469.157375553925, 19.522790124279478], "isController": false}, {"data": ["1000getEfCoreById", 1000, 0, 0.0, 12.916000000000002, 10, 39, 13.0, 15.0, 16.0, 20.0, 16.660002665600427, 4.832051554378249, 2.196387070171931], "isController": false}, {"data": ["10000getEfCoreById", 10000, 0, 0.0, 10.895100000000031, 7, 206, 10.0, 12.0, 13.0, 26.0, 166.59447572718489, 48.318905557591705, 21.963138889814413], "isController": false}, {"data": ["100Users", 100, 0, 0.0, 17.310000000000006, 12, 33, 17.5, 20.0, 21.0, 32.889999999999944, 1.6659170040148599, 204.68816376380627, 0.1952246489079914], "isController": false}, {"data": ["100getEfCoreById", 100, 0, 0.0, 22.78, 13, 548, 17.0, 20.900000000000006, 24.899999999999977, 542.8999999999974, 1.66761164659974, 0.45273050561985123, 0.22799377980855817], "isController": false}, {"data": ["50000getEfCoreById", 50000, 3948, 7.896, 7131.259879999987, 11, 23486, 11177.0, 13884.900000000001, 15032.0, 16449.0, 472.2951655866851, 231.27124590283944, 57.34899395226041], "isController": false}, {"data": ["50000Users", 50000, 9815, 19.63, 7007.097220000063, 2, 22388, 11001.0, 16455.0, 17251.0, 21783.0, 431.01590448687557, 42793.32395088035, 40.59462684798069], "isController": false}, {"data": ["10000getEfCore", 10000, 0, 0.0, 36.38909999999998, 15, 427, 27.0, 69.0, 90.0, 142.0, 166.55008160954, 20052.694884414243, 20.16817394490523], "isController": false}, {"data": ["1000getEfCore", 1000, 0, 0.0, 24.041000000000015, 18, 96, 23.0, 29.0, 33.0, 36.99000000000001, 16.657505038895277, 2005.5701135208967, 2.0171197508037246], "isController": false}, {"data": ["100getEfCore", 100, 0, 0.0, 29.230000000000004, 20, 143, 28.0, 33.0, 35.0, 141.94999999999948, 1.6658615002748671, 200.57037536024254, 0.20172541604890967], "isController": false}, {"data": ["10000Plain", 10000, 0, 0.0, 7.807300000000013, 6, 159, 8.0, 8.0, 9.0, 13.0, 166.62778684973506, 27.011926383843768, 19.526693771453328], "isController": false}, {"data": ["1000Plain", 1000, 0, 0.0, 12.760999999999997, 9, 58, 13.0, 16.0, 18.0, 21.0, 16.661945782028425, 2.701057617008514, 1.952571771331456], "isController": false}, {"data": ["5000Users", 5000, 0, 0.0, 11.272600000000025, 9, 81, 11.0, 12.0, 14.0, 18.98999999999978, 83.301401129567, 10235.09022062376, 9.761882944871132], "isController": false}, {"data": ["50000Plain", 50000, 0, 0.0, 833.0117200000018, 8, 4823, 338.0, 1208.0, 1523.0, 2444.9900000000016, 535.4522965548999, 86.80183713682948, 62.74831600252733], "isController": false}, {"data": ["5000getEfCoreById", 5000, 0, 0.0, 10.785599999999988, 9, 99, 10.0, 12.0, 12.0, 16.0, 83.30556481172943, 24.16186791902699, 10.982667235921358], "isController": false}, {"data": ["100Plain", 100, 0, 0.0, 14.159999999999998, 10, 22, 14.0, 16.0, 18.94999999999999, 21.989999999999995, 1.6660557795474993, 0.2700832611375829, 0.19524091166572258], "isController": false}, {"data": ["5000Plain", 5000, 0, 0.0, 8.684799999999967, 7, 90, 9.0, 9.0, 10.0, 12.0, 83.30417687142834, 13.504388047516702, 9.762208227120508], "isController": false}, {"data": ["50000getEfCore", 50000, 32001, 64.002, 15158.672480000054, 0, 47275, 26339.0, 35437.9, 37090.95, 43344.990000000005, 373.28475654368174, 16828.12819333444, 24.920111229525332], "isController": false}, {"data": ["5000getEfCore", 5000, 0, 0.0, 24.052600000000062, 17, 157, 23.0, 29.0, 31.0, 39.0, 83.29307501374336, 10028.518768012127, 10.086270802445483], "isController": false}]}, function(index, item){
        switch(index){
            // Errors pct
            case 3:
                item = item.toFixed(2) + '%';
                break;
            // Mean
            case 4:
            // Mean
            case 7:
            // Median
            case 8:
            // Percentile 1
            case 9:
            // Percentile 2
            case 10:
            // Percentile 3
            case 11:
            // Throughput
            case 12:
            // Kbytes/s
            case 13:
            // Sent Kbytes/s
                item = item.toFixed(2);
                break;
        }
        return item;
    }, [[0, 0]], 0, summaryTableHeader);

    // Create error table
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["Non HTTP response code: java.net.SocketException/Non HTTP response message: Connection reset", 4, 0.0087404947120007, 0.0015128593040847202], "isController": false}, {"data": ["500/Internal Server Error", 9566, 20.902893103749673, 3.618003025718608], "isController": false}, {"data": ["Non HTTP response code: java.net.BindException/Non HTTP response message: Address already in use: connect", 9932, 21.702648369897737, 3.75642965204236], "isController": false}, {"data": ["Non HTTP response code: java.net.SocketException/Non HTTP response message: Connection reset by peer: socket write error", 2945, 6.435189231710515, 1.1138426626323752], "isController": false}, {"data": ["Non HTTP response code: javax.net.ssl.SSLHandshakeException/Non HTTP response message: Remote host terminated the handshake", 23317, 50.950528799930076, 8.818835098335855], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 264400, 45764, "Non HTTP response code: javax.net.ssl.SSLHandshakeException/Non HTTP response message: Remote host terminated the handshake", 23317, "Non HTTP response code: java.net.BindException/Non HTTP response message: Address already in use: connect", 9932, "500/Internal Server Error", 9566, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Connection reset by peer: socket write error", 2945, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Connection reset", 4], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["50000getEfCoreById", 50000, 3948, "Non HTTP response code: javax.net.ssl.SSLHandshakeException/Non HTTP response message: Remote host terminated the handshake", 3948, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["50000Users", 50000, 9815, "Non HTTP response code: javax.net.ssl.SSLHandshakeException/Non HTTP response message: Remote host terminated the handshake", 3463, "Non HTTP response code: java.net.BindException/Non HTTP response message: Address already in use: connect", 3403, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Connection reset by peer: socket write error", 2945, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Connection reset", 4, null, null], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["50000getEfCore", 50000, 32001, "Non HTTP response code: javax.net.ssl.SSLHandshakeException/Non HTTP response message: Remote host terminated the handshake", 15906, "500/Internal Server Error", 9566, "Non HTTP response code: java.net.BindException/Non HTTP response message: Address already in use: connect", 6529, null, null, null, null], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
