Ext.namespace('gxp.widgets.button');

/** api: constructor
 *  .. class:: NrlChart(config)
 *
 *    Base class to create chart
 
 *    ``createLayerRecord`` method.
 */   
gxp.widgets.button.NrlChartButton = Ext.extend(Ext.Button,{
   
    /** api: xtype = gxp_nrlchart */
    xtype: 'gxp_nrlChartButton',
    iconCls: "gxp-icon-nrl-chart",
    handler:function(){
        
        var delLastChar = function (str){
            len = str.length;
            str = str.substring(0,len-1);
            return str;
        };
        
        var tabPanel = Ext.getCmp('id_mapTab');
        
        var tabs = tabPanel.find('title', 'Crop Data');
        
        if(tabs && tabs.length > 0){
            tabPanel.setActiveTab(tabs[0]);
        }else{    

        tabPanel.add({
                title: 'Crop Data',
                resizeTabs: true,
                closable: true,
                html: "<div id='chartContainer' style='min-height: 305px; min-width: 584px'></div>"
            });
            
            Ext.getCmp('id_mapTab').doLayout();
            
            Ext.getCmp('id_mapTab').setActiveTab(1);
            
            var data = this.target.chartData;
            
            var year = [];
            var area = [];
            var prod = [];
            var yield = [];       
            
            //unique array
            function unique(arrayName){
                var newArray=new Array();
                label:for(var a=0; a<arrayName.length;a++ ){  
                    for(var j=0; j<newArray.length;j++ ){
                        if(newArray[j]==arrayName[a]) 
                        continue label;
                    }
                    newArray[newArray.length] = arrayName[a];
                }
                return newArray;
            };         
            
            for (var i = 0; i<data.length; i++){
                year.push(data[i].year.substring(0,data[i].year.lastIndexOf("-")));
            }
            
            var uniqueYear = new Array;
            uniqueYear = unique(year);

            for (var i = 0; i<uniqueYear.length; i++){
                var area_sum = 0;
                var prod_sum = 0;
                var yield_sum = 0;             
                for (var c = 0; c<data.length; c++){   
                    if (year[c] == uniqueYear[i]){
                        area_sum = area_sum + parseFloat(data[c].area_mHa);
                        prod_sum = prod_sum + parseFloat(data[c].prod_mTo);
                    }
                }
                area.push(parseFloat(area_sum.toFixed(2)));
                prod.push(parseFloat(prod_sum.toFixed(2)));
                yield.push(parseFloat((prod[i]/area[i]).toFixed(2)));             
            }        
                
            var chart;    
            Ext.onReady(function () {
                chart = new Highcharts.Chart({
                    chart: {
                        renderTo: 'chartContainer',
                        zoomType: 'xy'
                    },
                    title: {
                        text: 'PUNJAB'
                    },
                    subtitle: {
                        text: 'Province'
                    },
                    xAxis: [{
                        categories: uniqueYear
                    }],
                    yAxis: [{ // Primary yAxis
                        labels: {
                            formatter: function() {
                                return this.value +'mHa';
                            },
                            style: {
                                color: '#89A54E'
                            }
                        },
                        title: {
                            text: 'Area mHa',
                            style: {
                                color: '#89A54E'
                            }
                        }
            
                    }, { // Secondary yAxis
                        gridLineWidth: 0,
                        title: {
                            text: 'Production mTO',
                            style: {
                                color: '#4572A7'
                            }
                        },
                        labels: {
                            formatter: function() {
                                return this.value +' mTO';
                            },
                            style: {
                                color: '#4572A7'
                            }
                        },
                        opposite: true
            
                    }, { // Tertiary yAxis
                        gridLineWidth: 0,
                        title: {
                            text: 'Yield ToHa',
                            style: {
                                color: '#AA4643'
                            }
                        },
                        labels: {
                            formatter: function() {
                                return this.value +' Ha';
                            },
                            style: {
                                color: '#AA4643'
                            }
                        },
                        opposite: true
                    }],
                    tooltip: {
                        formatter: function() {
                            var unit = {
                                'Area mHa': 'ha',
                                'Production': 'q',
                                'Yield': 'q'
                            }[this.series.name];
            
                            return ''+
                                this.x +': '+ this.y +' '+ unit;
                        }
                    },
                    legend: {
                        layout: 'vertical',
                        align: 'left',
                        x: 120,
                        verticalAlign: 'top',
                        y: 80,
                        floating: true,
                        backgroundColor: '#FFFFFF'
                    },
                    series: [{
                        name: 'Production mTO',
                        color: '#4572A7',
                        type: 'spline',
                        yAxis: 1,
                        data: prod
            
                    }, {
                        name: 'Yield ToHa',
                        type: 'spline',
                        color: '#AA4643',
                        yAxis: 2,
                        data: yield,
                        marker: {
                            enabled: false
                        },
                        dashStyle: 'shortdot'
            
                    }, {
                        name: 'Area mHa',
                        color: '#89A54E',
                        type: 'spline',
                        data: area
                    }]
                });  
            });        
        }        
    }
});

Ext.reg(gxp.widgets.button.NrlChartButton.prototype.xtype,gxp.widgets.button.NrlChartButton);