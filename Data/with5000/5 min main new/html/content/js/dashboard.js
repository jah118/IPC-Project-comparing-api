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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.9999776453055141, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [1.0, 500, 1500, "1000Users"], "isController": false}, {"data": [1.0, 500, 1500, "10000Users"], "isController": false}, {"data": [1.0, 500, 1500, "1000getEfCoreById"], "isController": false}, {"data": [1.0, 500, 1500, "10000getEfCoreById"], "isController": false}, {"data": [1.0, 500, 1500, "100Users"], "isController": false}, {"data": [0.995, 500, 1500, "100getEfCoreById"], "isController": false}, {"data": [1.0, 500, 1500, "50000getEfCoreById"], "isController": false}, {"data": [1.0, 500, 1500, "50000Users"], "isController": false}, {"data": [1.0, 500, 1500, "10000getEfCore"], "isController": false}, {"data": [1.0, 500, 1500, "1000getEfCore"], "isController": false}, {"data": [1.0, 500, 1500, "100getEfCore"], "isController": false}, {"data": [1.0, 500, 1500, "10000Plain"], "isController": false}, {"data": [1.0, 500, 1500, "1000Plain"], "isController": false}, {"data": [1.0, 500, 1500, "5000Users"], "isController": false}, {"data": [1.0, 500, 1500, "50000Plain"], "isController": false}, {"data": [1.0, 500, 1500, "5000getEfCoreById"], "isController": false}, {"data": [1.0, 500, 1500, "100Plain"], "isController": false}, {"data": [1.0, 500, 1500, "5000Plain"], "isController": false}, {"data": [0.99989, 500, 1500, "50000getEfCore"], "isController": false}, {"data": [1.0, 500, 1500, "5000getEfCore"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 268400, 0, 0.0, 18.67991430700506, 7, 566, 9.0, 14.0, 18.0, 37.0, 29.789715023195246, 1841.6591773854332, 3.6271075578249556], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["1000Users", 5000, 0, 0.0, 16.435999999999964, 10, 176, 15.0, 22.0, 25.0, 34.0, 16.665000166650003, 2047.5979745775423, 1.9529297070292972], "isController": false}, {"data": ["10000Users", 10000, 0, 0.0, 14.796000000000015, 10, 154, 13.0, 21.0, 24.0, 34.0, 33.33311111259258, 4095.578164895567, 3.9062239585069434], "isController": false}, {"data": ["1000getEfCoreById", 1000, 0, 0.0, 16.860999999999976, 10, 73, 16.0, 21.0, 25.0, 37.0, 3.333188895147877, 0.9569897804428475, 0.4394340828564096], "isController": false}, {"data": ["10000getEfCoreById", 10000, 0, 0.0, 13.163900000000012, 9, 78, 12.0, 18.0, 21.0, 27.0, 33.33077797368868, 9.569578832289524, 4.394194361765598], "isController": false}, {"data": ["100Users", 100, 0, 0.0, 20.79999999999999, 13, 61, 19.5, 26.900000000000006, 28.0, 60.82999999999991, 0.33330222512565494, 40.952232479135276, 0.03905885450691268], "isController": false}, {"data": ["100getEfCoreById", 100, 0, 0.0, 22.719999999999988, 12, 522, 17.0, 22.0, 24.0, 517.0799999999974, 0.3333900096349713, 0.09571939729754057, 0.04395278447336047], "isController": false}, {"data": ["50000getEfCoreById", 50000, 0, 0.0, 13.197560000000035, 8, 321, 10.0, 16.0, 21.0, 45.0, 166.6550008166095, 47.848213125081244, 21.97111827172098], "isController": false}, {"data": ["50000Users", 50000, 0, 0.0, 16.128440000000275, 9, 291, 12.0, 21.0, 29.0, 69.0, 166.6550008166095, 20476.593982171245, 19.529882908196424], "isController": false}, {"data": ["10000getEfCore", 10000, 0, 0.0, 24.05830000000003, 18, 119, 23.0, 28.0, 31.0, 40.98999999999978, 33.33155565036532, 4006.524599938003, 4.036243067036424], "isController": false}, {"data": ["1000getEfCore", 1000, 0, 0.0, 29.946000000000023, 20, 94, 28.0, 36.0, 43.0, 62.97000000000003, 3.3330889068135003, 400.644447532181, 0.4036162348094473], "isController": false}, {"data": ["100getEfCore", 100, 0, 0.0, 31.32999999999999, 22, 125, 29.0, 34.0, 56.399999999999864, 124.48999999999974, 0.3332977815699659, 40.06310941416249, 0.040360278236988054], "isController": false}, {"data": ["10000Plain", 10000, 0, 0.0, 11.366099999999957, 8, 74, 10.0, 16.0, 19.0, 25.0, 33.333444444814816, 7.8776304254347504, 3.906263020876736], "isController": false}, {"data": ["1000Plain", 1000, 0, 0.0, 14.739999999999977, 8, 57, 14.0, 18.0, 22.0, 29.0, 3.3331222355917456, 0.7877105283332055, 0.3906002619834077], "isController": false}, {"data": ["5000Users", 5000, 0, 0.0, 16.100399999999954, 10, 141, 15.0, 22.0, 25.0, 32.0, 16.6660000266656, 2047.7208255419782, 1.953046878124875], "isController": false}, {"data": ["50000Plain", 50000, 0, 0.0, 10.858200000000068, 7, 236, 9.0, 14.0, 18.0, 37.0, 166.6561117795873, 39.38552641666028, 19.530013099170386], "isController": false}, {"data": ["5000getEfCoreById", 5000, 0, 0.0, 13.928000000000015, 9, 74, 13.0, 18.0, 21.0, 31.0, 16.666500001666652, 4.7851083989160115, 2.1972436525634746], "isController": false}, {"data": ["100Plain", 100, 0, 0.0, 15.71999999999999, 11, 50, 15.0, 18.0, 20.0, 49.73999999999987, 0.3333144455147542, 0.07877157794391651, 0.039060286583760255], "isController": false}, {"data": ["5000Plain", 5000, 0, 0.0, 13.414199999999994, 8, 62, 13.0, 18.0, 21.0, 28.0, 16.665944475739384, 3.938631409305597, 1.9530403682507094], "isController": false}, {"data": ["50000getEfCore", 50000, 0, 0.0, 37.56571999999998, 18, 566, 34.0, 60.0, 87.0, 159.0, 166.61779211431312, 20027.816580053182, 20.176373263842606], "isController": false}, {"data": ["5000getEfCore", 5000, 0, 0.0, 24.47060000000004, 18, 147, 22.0, 32.0, 35.0, 44.0, 16.665000166650003, 2003.1688237426258, 2.018027363930274], "isController": false}]}, function(index, item){
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
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 268400, 0, null, null, null, null, null, null, null, null, null, null], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
