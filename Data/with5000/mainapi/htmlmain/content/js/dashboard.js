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

    var data = {"OkPercent": 63.46142208774584, "KoPercent": 36.53857791225416};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.2697976550680787, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [1.0, 500, 1500, "1000Users"], "isController": false}, {"data": [1.0, 500, 1500, "10000Users"], "isController": false}, {"data": [1.0, 500, 1500, "1000getEfCoreById"], "isController": false}, {"data": [1.0, 500, 1500, "10000getEfCoreById"], "isController": false}, {"data": [1.0, 500, 1500, "100Users"], "isController": false}, {"data": [0.995, 500, 1500, "100getEfCoreById"], "isController": false}, {"data": [0.02356, 500, 1500, "50000getEfCoreById"], "isController": false}, {"data": [0.012, 500, 1500, "50000Users"], "isController": false}, {"data": [0.93695, 500, 1500, "10000getEfCore"], "isController": false}, {"data": [1.0, 500, 1500, "1000getEfCore"], "isController": false}, {"data": [1.0, 500, 1500, "100getEfCore"], "isController": false}, {"data": [1.0, 500, 1500, "10000Plain"], "isController": false}, {"data": [1.0, 500, 1500, "1000Plain"], "isController": false}, {"data": [0.0, 500, 1500, "5000Users"], "isController": false}, {"data": [0.51037, 500, 1500, "50000Plain"], "isController": false}, {"data": [0.0, 500, 1500, "5000getEfCoreById"], "isController": false}, {"data": [1.0, 500, 1500, "100Plain"], "isController": false}, {"data": [0.0, 500, 1500, "5000Plain"], "isController": false}, {"data": [0.00538, 500, 1500, "50000getEfCore"], "isController": false}, {"data": [0.0, 500, 1500, "5000getEfCore"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 264400, 96608, 36.53857791225416, 11031.900552193507, 0, 84522, 493.0, 992.0, 1197.0, 1684.0, 68.21680145763102, 2213.5892781906446, 5.3153863621352375], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["1000Users", 1000, 0, 0.0, 15.315000000000005, 10, 35, 14.0, 20.0, 23.0, 27.99000000000001, 16.65861500274867, 2046.8134412117474, 1.9521814456346098], "isController": false}, {"data": ["10000Users", 10000, 0, 0.0, 11.917400000000002, 8, 187, 11.0, 14.0, 16.0, 34.0, 166.602802259134, 20470.18044124752, 19.523765889742265], "isController": false}, {"data": ["1000getEfCoreById", 1000, 0, 0.0, 12.764, 10, 91, 12.0, 14.0, 16.0, 20.0, 16.662778684973503, 4.784039974006065, 2.1967530492884992], "isController": false}, {"data": ["10000getEfCoreById", 10000, 0, 0.0, 12.038099999999998, 8, 179, 11.0, 14.0, 15.0, 30.0, 166.6139055965611, 47.836414302137655, 21.965700444859127], "isController": false}, {"data": ["100Users", 100, 0, 0.0, 18.47, 13, 33, 19.0, 20.900000000000006, 21.94999999999999, 32.93999999999997, 1.665806000233213, 204.6745249329513, 0.19521164065232963], "isController": false}, {"data": ["100getEfCoreById", 100, 0, 0.0, 27.55, 12, 820, 17.0, 20.0, 22.899999999999977, 814.4899999999972, 1.6675838377774443, 0.4478374564343722, 0.22798997782113498], "isController": false}, {"data": ["50000getEfCoreById", 50000, 22308, 44.616, 10826.90486000006, 19, 33531, 11152.5, 20384.0, 22580.9, 26666.99, 450.3206282873406, 637.8504180523408, 32.88061803128828], "isController": false}, {"data": ["50000Users", 50000, 18959, 37.918, 15061.332680000032, 23, 59072, 15236.5, 21465.9, 22508.0, 30653.970000000005, 371.6670755004497, 28747.006838732264, 27.039650837365922], "isController": false}, {"data": ["10000getEfCore", 10000, 0, 0.0, 198.3295000000001, 17, 2882, 38.0, 463.0, 1150.8999999999978, 2112.959999999999, 162.60955818983038, 19581.430293347643, 19.691001187049775], "isController": false}, {"data": ["1000getEfCore", 1000, 0, 0.0, 23.251000000000012, 18, 342, 22.0, 28.0, 33.94999999999993, 37.99000000000001, 16.6602802259134, 2006.2296432200988, 2.0174558086067007], "isController": false}, {"data": ["100getEfCore", 100, 0, 0.0, 29.500000000000014, 22, 150, 28.0, 31.0, 32.0, 148.95999999999947, 1.6655008160954, 200.5594781569568, 0.20168173944905232], "isController": false}, {"data": ["10000Plain", 10000, 0, 0.0, 8.908399999999986, 7, 182, 8.0, 10.0, 12.0, 25.0, 166.63056337793478, 39.379488610801, 19.52701914585173], "isController": false}, {"data": ["1000Plain", 1000, 0, 0.0, 12.804999999999993, 9, 24, 13.0, 16.0, 18.0, 21.0, 16.661945782028425, 3.9376864055184364, 1.952571771331456], "isController": false}, {"data": ["5000Users", 5000, 5000, 100.0, 21049.504799999973, 21016, 21089, 21050.0, 21057.0, 21058.0, 21061.0, 61.697926949654494, 171.476855565153, 0.0], "isController": false}, {"data": ["50000Plain", 50000, 0, 0.0, 1147.0473599999932, 13, 6253, 493.0, 992.0, 1197.0, 1684.0, 526.4266161297115, 124.40941514002948, 61.69061907770057], "isController": false}, {"data": ["5000getEfCoreById", 5000, 5000, 100.0, 21048.75380000001, 21017, 21170, 21049.0, 21060.0, 21062.0, 21066.0, 61.67585636926569, 171.41551487004895, 0.0], "isController": false}, {"data": ["100Plain", 100, 0, 0.0, 14.44, 10, 24, 15.0, 16.0, 17.0, 23.949999999999974, 1.665889251682548, 0.3936964833077897, 0.19522139668154861], "isController": false}, {"data": ["5000Plain", 5000, 5000, 100.0, 21047.148599999993, 21023, 21128, 21047.0, 21055.0, 21059.0, 21064.0, 61.67889964843027, 171.42397304632087, 0.0], "isController": false}, {"data": ["50000getEfCore", 50000, 35341, 70.682, 22834.48599999982, 0, 84522, 27531.0, 44614.900000000016, 46585.850000000006, 53765.990000000005, 342.2805468274016, 12785.997270740489, 13.995343487085755], "isController": false}, {"data": ["5000getEfCore", 5000, 5000, 100.0, 21046.772000000015, 21023, 21084, 21047.0, 21054.0, 21057.0, 21063.0, 61.67357410696665, 171.4091717855733, 0.0], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: 10.10.1.62:8001 failed to respond", 1, 0.0010351109638953295, 3.7821482602118004E-4], "isController": false}, {"data": ["Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to 10.10.1.62:5001 [/10.10.1.62] failed: Connection timed out: connect", 20000, 20.702219277906593, 7.564296520423601], "isController": false}, {"data": ["Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to 10.10.1.62:8001 [/10.10.1.62] failed: Connection timed out: connect", 2441, 2.5267058628684995, 0.9232223903177005], "isController": false}, {"data": ["500/Internal Server Error", 2224, 2.302086783703213, 0.8411497730711044], "isController": false}, {"data": ["Non HTTP response code: java.net.BindException/Non HTTP response message: Address already in use: connect", 592, 0.6127856906260352, 0.22390317700453857], "isController": false}, {"data": ["Non HTTP response code: java.net.SocketException/Non HTTP response message: Connection reset by peer: socket write error", 314, 0.3250248426631335, 0.11875945537065052], "isController": false}, {"data": ["Non HTTP response code: javax.net.ssl.SSLHandshakeException/Non HTTP response message: Remote host terminated the handshake", 71036, 73.53014243126863, 26.866868381240543], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 264400, 96608, "Non HTTP response code: javax.net.ssl.SSLHandshakeException/Non HTTP response message: Remote host terminated the handshake", 71036, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to 10.10.1.62:5001 [/10.10.1.62] failed: Connection timed out: connect", 20000, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to 10.10.1.62:8001 [/10.10.1.62] failed: Connection timed out: connect", 2441, "500/Internal Server Error", 2224, "Non HTTP response code: java.net.BindException/Non HTTP response message: Address already in use: connect", 592], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["50000getEfCoreById", 50000, 22308, "Non HTTP response code: javax.net.ssl.SSLHandshakeException/Non HTTP response message: Remote host terminated the handshake", 22307, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: 10.10.1.62:8001 failed to respond", 1, null, null, null, null, null, null], "isController": false}, {"data": ["50000Users", 50000, 18959, "Non HTTP response code: javax.net.ssl.SSLHandshakeException/Non HTTP response message: Remote host terminated the handshake", 16204, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to 10.10.1.62:8001 [/10.10.1.62] failed: Connection timed out: connect", 2441, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Connection reset by peer: socket write error", 314, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["5000Users", 5000, 5000, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to 10.10.1.62:5001 [/10.10.1.62] failed: Connection timed out: connect", 5000, null, null, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": ["5000getEfCoreById", 5000, 5000, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to 10.10.1.62:5001 [/10.10.1.62] failed: Connection timed out: connect", 5000, null, null, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": ["5000Plain", 5000, 5000, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to 10.10.1.62:5001 [/10.10.1.62] failed: Connection timed out: connect", 5000, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["50000getEfCore", 50000, 35341, "Non HTTP response code: javax.net.ssl.SSLHandshakeException/Non HTTP response message: Remote host terminated the handshake", 32525, "500/Internal Server Error", 2224, "Non HTTP response code: java.net.BindException/Non HTTP response message: Address already in use: connect", 592, null, null, null, null], "isController": false}, {"data": ["5000getEfCore", 5000, 5000, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to 10.10.1.62:5001 [/10.10.1.62] failed: Connection timed out: connect", 5000, null, null, null, null, null, null, null, null], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
