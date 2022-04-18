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

    var data = {"OkPercent": 71.07602118003025, "KoPercent": 28.923978819969744};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.3495272314674735, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [1.0, 500, 1500, "1000Users"], "isController": false}, {"data": [1.0, 500, 1500, "10000Users"], "isController": false}, {"data": [1.0, 500, 1500, "1000getEfCoreById"], "isController": false}, {"data": [1.0, 500, 1500, "10000getEfCoreById"], "isController": false}, {"data": [1.0, 500, 1500, "100Users"], "isController": false}, {"data": [0.995, 500, 1500, "100getEfCoreById"], "isController": false}, {"data": [0.04441, 500, 1500, "50000getEfCoreById"], "isController": false}, {"data": [0.01944, 500, 1500, "50000Users"], "isController": false}, {"data": [1.0, 500, 1500, "10000getEfCore"], "isController": false}, {"data": [1.0, 500, 1500, "1000getEfCore"], "isController": false}, {"data": [1.0, 500, 1500, "100getEfCore"], "isController": false}, {"data": [1.0, 500, 1500, "10000Plain"], "isController": false}, {"data": [1.0, 500, 1500, "1000Plain"], "isController": false}, {"data": [1.0, 500, 1500, "5000Users"], "isController": false}, {"data": [0.48974, 500, 1500, "50000Plain"], "isController": false}, {"data": [1.0, 500, 1500, "5000getEfCoreById"], "isController": false}, {"data": [1.0, 500, 1500, "100Plain"], "isController": false}, {"data": [1.0, 500, 1500, "5000Plain"], "isController": false}, {"data": [0.00672, 500, 1500, "50000getEfCore"], "isController": false}, {"data": [1.0, 500, 1500, "5000getEfCore"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 264400, 76475, 28.923978819969744, 8480.44691754935, 0, 123918, 1101.0, 2810.9000000000015, 3218.0, 4281.990000000002, 56.7428854100607, 2311.825613627011, 4.931841245534771], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["1000Users", 1000, 0, 0.0, 17.184999999999995, 11, 97, 16.0, 24.0, 27.0, 43.99000000000001, 16.663889351774703, 2047.4614907932012, 1.9527995334110981], "isController": false}, {"data": ["10000Users", 10000, 0, 0.0, 15.048600000000025, 9, 268, 13.0, 21.0, 27.0, 57.98999999999978, 166.62501041406315, 20472.90911647088, 19.526368407898026], "isController": false}, {"data": ["1000getEfCoreById", 1000, 0, 0.0, 15.462999999999985, 10, 82, 14.0, 21.0, 25.0, 39.0, 16.661668166216803, 4.848805774934187, 2.196606643007098], "isController": false}, {"data": ["10000getEfCoreById", 10000, 0, 0.0, 13.263200000000001, 8, 181, 12.0, 17.0, 21.0, 43.0, 166.63333999866694, 48.49290558554956, 21.968262597480503], "isController": false}, {"data": ["100Users", 100, 0, 0.0, 21.63999999999999, 13, 75, 19.0, 29.0, 42.799999999999955, 74.82999999999991, 1.6658337497917708, 204.67793447026486, 0.19521489255372312], "isController": false}, {"data": ["100getEfCoreById", 100, 0, 0.0, 24.909999999999993, 12, 557, 18.0, 26.80000000000001, 35.0, 551.9899999999975, 1.6679176048703195, 0.4544423942957218, 0.22803561004086398], "isController": false}, {"data": ["50000getEfCoreById", 50000, 30789, 61.578, 13324.84283999998, 0, 42219, 21044.0, 32620.0, 34112.0, 36259.0, 416.9098640873843, 758.8757015811307, 21.11815388403652], "isController": false}, {"data": ["50000Users", 50000, 17743, 35.486, 13319.478499999977, 33, 123918, 16110.5, 21049.0, 22555.850000000002, 30804.590000000066, 230.11676124465555, 18471.0638824624, 17.397366486255127], "isController": false}, {"data": ["10000getEfCore", 10000, 0, 0.0, 32.123899999999935, 17, 381, 28.0, 42.0, 53.0, 109.0, 166.58615002748672, 20026.778723616917, 20.172541604890966], "isController": false}, {"data": ["1000getEfCore", 1000, 0, 0.0, 25.59300000000002, 18, 171, 23.0, 34.0, 38.0, 58.99000000000001, 16.65639522294585, 2002.4110132085214, 2.016985359028599], "isController": false}, {"data": ["100getEfCore", 100, 0, 0.0, 30.500000000000004, 23, 87, 29.0, 35.0, 38.94999999999999, 86.67999999999984, 1.6658337497917708, 200.26445110777945, 0.20172205563884724], "isController": false}, {"data": ["10000Plain", 10000, 0, 0.0, 10.824400000000006, 7, 153, 9.0, 15.0, 19.0, 34.0, 166.63056337793478, 39.379488610801, 19.52701914585173], "isController": false}, {"data": ["1000Plain", 1000, 0, 0.0, 14.730000000000006, 9, 64, 14.0, 20.0, 22.0, 32.99000000000001, 16.665000166650003, 3.9384082425090825, 1.952929707029297], "isController": false}, {"data": ["5000Users", 5000, 0, 0.0, 14.910400000000019, 9, 123, 12.0, 21.0, 28.0, 51.98999999999978, 83.29723786359244, 10234.578687776962, 9.761395062139739], "isController": false}, {"data": ["50000Plain", 50000, 0, 0.0, 1225.4782999999923, 15, 11393, 1101.0, 2810.9000000000015, 3218.0, 4281.990000000002, 506.7550447464705, 119.76046955922446, 59.38535680622701], "isController": false}, {"data": ["5000getEfCoreById", 5000, 0, 0.0, 15.235400000000027, 9, 141, 12.0, 21.0, 28.0, 64.98999999999978, 83.28752519447637, 24.23797119917379, 10.980288966068661], "isController": false}, {"data": ["100Plain", 100, 0, 0.0, 16.460000000000004, 11, 38, 16.0, 21.0, 24.0, 37.929999999999964, 1.6658615002748671, 0.3936899248696463, 0.19521814456346098], "isController": false}, {"data": ["5000Plain", 5000, 0, 0.0, 10.209200000000013, 7, 91, 9.0, 13.0, 16.0, 24.98999999999978, 83.301401129567, 19.68646393882345, 9.761882944871132], "isController": false}, {"data": ["50000getEfCore", 50000, 27943, 55.886, 16951.856680000135, 57, 47745, 23028.5, 31836.9, 33258.0, 37988.95000000001, 341.6023884839003, 18677.383945659174, 20.237859878116268], "isController": false}, {"data": ["5000getEfCore", 5000, 0, 0.0, 30.13020000000003, 18, 454, 24.0, 38.0, 47.0, 154.9399999999987, 83.29723786359244, 10013.889814413753, 10.086774897544396], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: 10.10.1.62:8001 failed to respond", 2, 0.002615233736515201, 7.564296520423601E-4], "isController": false}, {"data": ["Non HTTP response code: java.net.SocketException/Non HTTP response message: Connection reset", 152, 0.19875776397515527, 0.057488653555219364], "isController": false}, {"data": ["Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to 10.10.1.62:8001 [/10.10.1.62] failed: Connection timed out: connect", 996, 1.30238640078457, 0.3767019667170953], "isController": false}, {"data": ["500/Internal Server Error", 2405, 3.144818568159529, 0.909606656580938], "isController": false}, {"data": ["Non HTTP response code: java.net.BindException/Non HTTP response message: Address already in use: connect", 4413, 5.770513239620791, 1.6690620272314676], "isController": false}, {"data": ["Non HTTP response code: org.apache.http.conn.ConnectTimeoutException/Non HTTP response message: Connect to 10.10.1.62:8001 [/10.10.1.62] failed: Read timed out", 193, 0.2523700555737169, 0.07299546142208775], "isController": false}, {"data": ["Non HTTP response code: java.net.SocketException/Non HTTP response message: Connection reset by peer: socket write error", 872, 1.1402419091206277, 0.329803328290469], "isController": false}, {"data": ["Non HTTP response code: javax.net.ssl.SSLHandshakeException/Non HTTP response message: Remote host terminated the handshake", 67442, 88.1882968290291, 25.507564296520425], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 264400, 76475, "Non HTTP response code: javax.net.ssl.SSLHandshakeException/Non HTTP response message: Remote host terminated the handshake", 67442, "Non HTTP response code: java.net.BindException/Non HTTP response message: Address already in use: connect", 4413, "500/Internal Server Error", 2405, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to 10.10.1.62:8001 [/10.10.1.62] failed: Connection timed out: connect", 996, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Connection reset by peer: socket write error", 872], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["50000getEfCoreById", 50000, 30789, "Non HTTP response code: javax.net.ssl.SSLHandshakeException/Non HTTP response message: Remote host terminated the handshake", 26376, "Non HTTP response code: java.net.BindException/Non HTTP response message: Address already in use: connect", 4413, null, null, null, null, null, null], "isController": false}, {"data": ["50000Users", 50000, 17743, "Non HTTP response code: javax.net.ssl.SSLHandshakeException/Non HTTP response message: Remote host terminated the handshake", 15563, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to 10.10.1.62:8001 [/10.10.1.62] failed: Connection timed out: connect", 996, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Connection reset by peer: socket write error", 872, "Non HTTP response code: org.apache.http.conn.ConnectTimeoutException/Non HTTP response message: Connect to 10.10.1.62:8001 [/10.10.1.62] failed: Read timed out", 158, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Connection reset", 152], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["50000getEfCore", 50000, 27943, "Non HTTP response code: javax.net.ssl.SSLHandshakeException/Non HTTP response message: Remote host terminated the handshake", 25503, "500/Internal Server Error", 2405, "Non HTTP response code: org.apache.http.conn.ConnectTimeoutException/Non HTTP response message: Connect to 10.10.1.62:8001 [/10.10.1.62] failed: Read timed out", 35, null, null, null, null], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
