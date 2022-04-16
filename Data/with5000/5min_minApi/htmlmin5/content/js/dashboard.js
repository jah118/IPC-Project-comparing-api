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

    var data = {"OkPercent": 100.0, "KoPercent": 0.0};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.9936838124054463, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [1.0, 500, 1500, "1000Users"], "isController": false}, {"data": [1.0, 500, 1500, "10000Users"], "isController": false}, {"data": [1.0, 500, 1500, "1000getEfCoreById"], "isController": false}, {"data": [1.0, 500, 1500, "10000getEfCoreById"], "isController": false}, {"data": [1.0, 500, 1500, "100Users"], "isController": false}, {"data": [0.995, 500, 1500, "100getEfCoreById"], "isController": false}, {"data": [1.0, 500, 1500, "50000getEfCoreById"], "isController": false}, {"data": [1.0, 500, 1500, "50000Users"], "isController": false}, {"data": [1.0, 500, 1500, "10000getEfCore"], "isController": false}, {"data": [1.0, 500, 1500, "1000getEfCore"], "isController": false}, {"data": [1.0, 500, 1500, "100getEfCore"], "isController": false}, {"data": [1.0, 500, 1500, "10000Plain"], "isController": false}, {"data": [1.0, 500, 1500, "1000Plain"], "isController": false}, {"data": [1.0, 500, 1500, "5000Users"], "isController": false}, {"data": [1.0, 500, 1500, "50000Plain"], "isController": false}, {"data": [1.0, 500, 1500, "5000getEfCoreById"], "isController": false}, {"data": [1.0, 500, 1500, "100Plain"], "isController": false}, {"data": [1.0, 500, 1500, "5000Plain"], "isController": false}, {"data": [0.96661, 500, 1500, "50000getEfCore"], "isController": false}, {"data": [1.0, 500, 1500, "5000getEfCore"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 264400, 0, 0.0, 40.53113842662627, 6, 2774, 8.0, 10.0, 12.0, 32.0, 31.923060112667635, 1943.183567164114, 3.8891231620394726], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["1000Users", 1000, 0, 0.0, 17.555999999999987, 11, 39, 18.0, 20.0, 21.0, 24.0, 3.3331222355917456, 409.5346096830534, 0.3906002619834077], "isController": false}, {"data": ["10000Users", 10000, 0, 0.0, 13.495299999999956, 10, 75, 13.0, 16.0, 21.0, 25.0, 33.331444551475414, 4095.373397590803, 3.9060286583760253], "isController": false}, {"data": ["1000getEfCoreById", 1000, 0, 0.0, 15.904999999999996, 11, 322, 16.0, 18.0, 18.0, 22.99000000000001, 3.333266667999973, 0.9732878259101485, 0.43944433611327777], "isController": false}, {"data": ["10000getEfCoreById", 10000, 0, 0.0, 13.611400000000005, 10, 86, 13.0, 16.0, 18.0, 23.0, 33.33311111259258, 9.733008029946467, 4.394501953320311], "isController": false}, {"data": ["100Users", 100, 0, 0.0, 20.120000000000005, 13, 104, 19.0, 23.900000000000006, 27.94999999999999, 103.30999999999965, 0.3333122235591746, 40.95346096830534, 0.03906002619834077], "isController": false}, {"data": ["100getEfCoreById", 100, 0, 0.0, 29.349999999999994, 13, 1077, 18.0, 23.900000000000006, 28.849999999999966, 1066.8399999999947, 0.3333844522826834, 0.09115981117104623, 0.04557990558552311], "isController": false}, {"data": ["50000getEfCoreById", 50000, 0, 0.0, 14.697299999999991, 8, 326, 13.0, 16.0, 18.0, 31.0, 166.660000266656, 48.66341804661147, 21.971777378904843], "isController": false}, {"data": ["50000Users", 50000, 0, 0.0, 15.231000000000007, 9, 392, 12.0, 16.0, 26.0, 70.0, 166.65722275737707, 20476.866987954018, 19.530143291880126], "isController": false}, {"data": ["10000getEfCore", 10000, 0, 0.0, 26.908700000000017, 19, 332, 26.0, 31.0, 33.0, 43.0, 33.32933381327574, 4004.890506889173, 4.035974016451359], "isController": false}, {"data": ["1000getEfCore", 1000, 0, 0.0, 27.792999999999967, 19, 92, 28.0, 31.0, 32.94999999999993, 35.0, 3.3330444694793115, 400.50239916707216, 0.4036108537260104], "isController": false}, {"data": ["100getEfCore", 100, 0, 0.0, 32.149999999999984, 24, 154, 30.0, 35.0, 41.94999999999999, 153.0399999999995, 0.33330222512565494, 40.0499729400256, 0.04036081632380978], "isController": false}, {"data": ["10000Plain", 10000, 0, 0.0, 11.381599999999999, 8, 82, 10.0, 15.899999999999636, 19.0, 23.0, 33.332222259258025, 5.403465717809406, 3.9061197960068], "isController": false}, {"data": ["1000Plain", 1000, 0, 0.0, 13.970999999999986, 9, 313, 14.0, 16.0, 16.0, 18.0, 3.33320000533312, 0.5403429696145488, 0.390609375624975], "isController": false}, {"data": ["5000Users", 5000, 0, 0.0, 14.769200000000009, 10, 68, 14.0, 18.0, 21.0, 26.0, 16.666611111296298, 2047.795908388639, 1.9531184896050349], "isController": false}, {"data": ["50000Plain", 50000, 0, 0.0, 9.576540000000065, 6, 320, 8.0, 10.0, 12.0, 32.0, 166.6550008166095, 27.016338023005055, 19.529882908196424], "isController": false}, {"data": ["5000getEfCoreById", 5000, 0, 0.0, 12.774599999999982, 10, 85, 12.0, 15.0, 16.0, 19.0, 16.666055577962144, 4.866358025205742, 2.197185061547743], "isController": false}, {"data": ["100Plain", 100, 0, 0.0, 14.010000000000002, 10, 21, 14.0, 16.0, 17.0, 20.989999999999995, 0.33331666749995836, 0.05403375664550106, 0.03906054697265137], "isController": false}, {"data": ["5000Plain", 5000, 0, 0.0, 12.37599999999999, 8, 83, 12.0, 15.0, 17.0, 21.0, 16.666500001666652, 2.7017958987076796, 1.9531054689453107], "isController": false}, {"data": ["50000getEfCore", 50000, 0, 0.0, 153.57073999999994, 18, 2774, 175.0, 569.0, 1102.9500000000007, 2056.0, 165.568944564206, 19894.951937405007, 20.04936438082182], "isController": false}, {"data": ["5000getEfCore", 5000, 0, 0.0, 24.85939999999995, 19, 88, 24.0, 29.0, 32.0, 36.0, 16.66522234739656, 2002.511995835361, 2.0180542686300518], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": []}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 264400, 0, null, null, null, null, null, null, null, null, null, null], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
