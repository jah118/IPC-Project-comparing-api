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

    var data = {"OkPercent": 92.4357034795764, "KoPercent": 7.564296520423601};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.9241736006051438, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [1.0, 500, 1500, "1000Users"], "isController": false}, {"data": [1.0, 500, 1500, "10000Users"], "isController": false}, {"data": [1.0, 500, 1500, "1000getEfCoreById"], "isController": false}, {"data": [1.0, 500, 1500, "10000getEfCoreById"], "isController": false}, {"data": [1.0, 500, 1500, "100Users"], "isController": false}, {"data": [1.0, 500, 1500, "100getEfCoreById"], "isController": false}, {"data": [1.0, 500, 1500, "50000getEfCoreById"], "isController": false}, {"data": [0.99999, 500, 1500, "50000Users"], "isController": false}, {"data": [1.0, 500, 1500, "10000getEfCore"], "isController": false}, {"data": [1.0, 500, 1500, "1000getEfCore"], "isController": false}, {"data": [1.0, 500, 1500, "100getEfCore"], "isController": false}, {"data": [1.0, 500, 1500, "10000Plain"], "isController": false}, {"data": [1.0, 500, 1500, "1000Plain"], "isController": false}, {"data": [0.0, 500, 1500, "5000Users"], "isController": false}, {"data": [1.0, 500, 1500, "50000Plain"], "isController": false}, {"data": [0.0, 500, 1500, "5000getEfCoreById"], "isController": false}, {"data": [1.0, 500, 1500, "100Plain"], "isController": false}, {"data": [0.0, 500, 1500, "5000Plain"], "isController": false}, {"data": [0.99904, 500, 1500, "50000getEfCore"], "isController": false}, {"data": [0.0, 500, 1500, "5000getEfCore"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 264400, 20000, 7.564296520423601, 1615.4360741301257, 6, 21068, 8.0, 9.0, 9.0, 16.0, 32.72381312128368, 1847.4585072082427, 3.685117792422358], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["1000Users", 1000, 0, 0.0, 17.766000000000016, 12, 27, 18.0, 20.0, 21.0, 24.0, 3.3331444551475418, 409.53733975908034, 0.39060286583760256], "isController": false}, {"data": ["10000Users", 10000, 0, 0.0, 13.411700000000014, 10, 80, 13.0, 16.0, 21.0, 25.0, 33.33177785036698, 4095.414349413694, 3.9060677168398805], "isController": false}, {"data": ["1000getEfCoreById", 1000, 0, 0.0, 15.33, 11, 77, 16.0, 17.0, 18.0, 21.0, 3.3332444468147515, 0.9667710944374818, 0.4394414065624917], "isController": false}, {"data": ["10000getEfCoreById", 10000, 0, 0.0, 13.228600000000023, 10, 330, 13.0, 15.0, 17.0, 23.0, 33.33188895147877, 9.66754982284101, 4.394340828564096], "isController": false}, {"data": ["100Users", 100, 0, 0.0, 17.98999999999999, 13, 29, 18.0, 20.900000000000006, 22.94999999999999, 28.97999999999999, 0.333320000533312, 40.954416510839565, 0.0390609375624975], "isController": false}, {"data": ["100getEfCoreById", 100, 0, 0.0, 21.89, 13, 487, 17.0, 19.0, 21.0, 482.38999999999766, 0.3333744495154402, 0.09050595406766834, 0.04557853801968909], "isController": false}, {"data": ["50000getEfCoreById", 50000, 0, 0.0, 12.612819999999997, 8, 327, 11.0, 13.0, 14.0, 33.0, 166.65666726663068, 48.336943533388, 21.97133796972182], "isController": false}, {"data": ["50000Users", 50000, 0, 0.0, 13.527879999999978, 9, 524, 11.0, 14.0, 16.0, 57.0, 166.65333439991468, 20476.389232611393, 19.52968762499], "isController": false}, {"data": ["10000getEfCore", 10000, 0, 0.0, 24.754199999999987, 19, 104, 24.0, 28.0, 29.0, 32.0, 33.32911164585819, 3999.4933975029826, 4.035947113365641], "isController": false}, {"data": ["1000getEfCore", 1000, 0, 0.0, 28.109000000000005, 20, 82, 28.0, 31.0, 32.0, 35.99000000000001, 3.33310001633219, 399.9720019598628, 0.40361758010272614], "isController": false}, {"data": ["100getEfCore", 100, 0, 0.0, 28.670000000000005, 22, 166, 27.0, 30.0, 31.0, 164.67999999999932, 0.33330111422562486, 39.99613370707498, 0.04036068180075926], "isController": false}, {"data": ["10000Plain", 10000, 0, 0.0, 10.712999999999958, 8, 71, 10.0, 14.0, 18.0, 21.0, 33.333333333333336, 7.877604166666667, 3.90625], "isController": false}, {"data": ["1000Plain", 1000, 0, 0.0, 13.922999999999986, 10, 49, 14.0, 16.0, 16.0, 20.0, 3.33320000533312, 0.7877289075103663, 0.390609375624975], "isController": false}, {"data": ["5000Users", 5000, 5000, 100.0, 21047.71720000004, 21023, 21068, 21048.0, 21055.0, 21057.0, 21060.0, 15.573558589284769, 43.28354271982857, 0.0], "isController": false}, {"data": ["50000Plain", 50000, 0, 0.0, 8.754179999999955, 6, 408, 8.0, 9.0, 9.0, 16.0, 166.660000266656, 39.38644537551831, 19.53046878124875], "isController": false}, {"data": ["5000getEfCoreById", 5000, 5000, 100.0, 21047.940800000015, 21021, 21068, 21048.0, 21056.0, 21058.0, 21061.0, 15.573946656117913, 43.28462127276522, 0.0], "isController": false}, {"data": ["100Plain", 100, 0, 0.0, 13.81, 9, 20, 15.0, 16.900000000000006, 17.94999999999999, 20.0, 0.3333322222259259, 0.07877577908073641, 0.0390623697921007], "isController": false}, {"data": ["5000Plain", 5000, 5000, 100.0, 21047.6206, 21022, 21065, 21048.0, 21055.0, 21056.0, 21060.989999999998, 15.573704112080833, 43.283947170880914, 0.0], "isController": false}, {"data": ["50000getEfCore", 50000, 0, 0.0, 74.45300000000013, 19, 1082, 96.0, 179.0, 217.0, 335.0, 166.53732267938568, 19984.47872152628, 20.166628918206857], "isController": false}, {"data": ["5000getEfCore", 5000, 5000, 100.0, 21046.614399999922, 21023, 21063, 21047.0, 21053.0, 21055.0, 21057.0, 15.574286230462057, 43.285565050678734, 0.0], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to 10.10.1.62:5001 [/10.10.1.62] failed: Connection timed out: connect", 20000, 100.0, 7.564296520423601], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 264400, 20000, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to 10.10.1.62:5001 [/10.10.1.62] failed: Connection timed out: connect", 20000, null, null, null, null, null, null, null, null], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["5000Users", 5000, 5000, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to 10.10.1.62:5001 [/10.10.1.62] failed: Connection timed out: connect", 5000, null, null, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": ["5000getEfCoreById", 5000, 5000, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to 10.10.1.62:5001 [/10.10.1.62] failed: Connection timed out: connect", 5000, null, null, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": ["5000Plain", 5000, 5000, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to 10.10.1.62:5001 [/10.10.1.62] failed: Connection timed out: connect", 5000, null, null, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": ["5000getEfCore", 5000, 5000, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to 10.10.1.62:5001 [/10.10.1.62] failed: Connection timed out: connect", 5000, null, null, null, null, null, null, null, null], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
