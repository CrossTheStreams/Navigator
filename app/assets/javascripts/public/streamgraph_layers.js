function getCountriesAndNids() {
    url = '/terms_by_parent/';
    result = {};
    $.ajax({
        async: false,
        type: 'GET',
        url: url,
        dataType: 'json',
        success: function(o){
            result = o;
         },
         error: function (xhr, ajaxOptions, thrownError){
             console.log(thrownError);
         }
    });
    return result;
};



function getStreamGraph(x) {
var n = x.length, // number of layers
    m = x[0].length, // number of samples per layer
    color = d3.interpolateRgb("#C8F099", "#31A635");

var w = 1000,
    h = 500,
    mx = m - 1,
    my = d3.max(data0, function(d) {
      return d3.max(d, function(d) {
        return d.y0 + d.y;
      });
    });

var area = d3.svg.area()
    .x(function(d) { return d.x * w / mx; })
    .y0(function(d) { return h - d.y0 * h / my; })
    .y1(function(d) { return h - (d.y + d.y0) * h / my; });

var vis = d3.select("#chart")
  .append("svg")
    .attr("width", w)
    .attr("height", h);

vis.selectAll("path")
    .data(data0)
  .enter().append("path")
    .style("fill", function() { return color(Math.random()); })
    .attr("d", area);
  showChart();
}



function transition(x) {

color = d3.interpolateRgb("#C8F099", "#31A635");

var w = 1000,
    h = 500,
    mx = m - 1,
    my = d3.max(data1, function(d) {
      return d3.max(d, function(d) {
        return d.y0 + d.y;
      });
    });

var area = d3.svg.area()
    .x(function(d) { return d.x * w / mx; })
    .y0(function(d) { return h - d.y0 * h / my; })
    .y1(function(d) { return h - (d.y + d.y0) * h / my; });

var vis = d3.select("#chart")
  .append("svg")
    .attr("width", w)
    .attr("height", h);


d3.select("svg").selectAll("path")
    .data(x)
  .enter().insert("path")
    .style("fill", function() { return color(Math.random()); })
    .attr("d", area);

  d3.selectAll("path")
      .data(function() {
       var d = data1; 
       data1 = data0;
       return data0 = d;
      })
    .transition()
      .duration(2500)
      .attr("d", area);
};


function streamGraphTheData(data_array) {
var x = new Array(data_array.length);
for (var i = 0; i < data_array.length; i++) {
 x[i] = new Array(data_array[0].length);
for (var j = 0; j < data_array[0].length; j++) {
		x[i][j] = '';
	}
}

$.map(data_array, function(arr, index) {
	 $.map(arr, function(stuff, year){
		x[index][year] = {x : year, y : stuff};
	});
	return x;
});
return x;
}





function showChart() {
$('#chart').fadeIn("slow");
};

function hideChartTitle() {
$('#chart #chart-title').fadeOut("slow");
};

function showChartTitle() {
$('#chart #chart-title').fadeIn("slow");
};

function showLoadingGif() {
$('.side-things img').fadeIn("slow");
};

function hideLoadingGif() {
$('.side-things img').fadeOut("slow");
};





jQuery(document).ready(function($) {


    alldatasetssurl = '/all_datasets_by_year/';
    all_datasets_array = {};
    $.ajax({
        async: true,
        type: 'GET',
        url: alldatasetssurl,
        dataType: 'json',
        success: function(o){
            all_datasets_array = o;

        x = streamGraphTheData(all_datasets_array);
        data0 = d3.layout.stack().offset("wiggle")(x);        
        getStreamGraph(x);

         },
         error: function (xhr, ajaxOptions, thrownError){
             console.log(thrownError);
         }
    }); 


    alltypesurl = '/all_dataset_types/';
    all_types_array = {};
    $.ajax({
        async: true,
        type: 'GET',
        url: alltypesurl,
        dataType: 'json',
        success: function(o){
            all_types_array = o;
            hideLoadingGif();
         },
         error: function (xhr, ajaxOptions, thrownError){
             console.log(thrownError);
         }
    });	


    countries = $.map(getCountriesAndNids(), function(val, index) {
        return val[0];
    })

    $('#countrybox').typeahead({
        source: countries,
        items: 5,
    });





$("#countryform").submit(function() {
  showLoadingGif();
  hideChartTitle();
  $.map(getCountriesAndNids(), function(val, index) {

    if (val[0] == $("input:first").val()) {
   	countrytitle = val[0];
		countrynid = val[1];	

    url = '/streamgraph/' + countrynid + '/';
    data_array = {};
    $.ajax({
        async: true,
        type: 'GET',
        url: url,
        context: 'graphdata',
        dataType: 'json',
        success: function(o){

        data_array = o;
        x = streamGraphTheData(data_array);
				n = x.length, // number of layers
        m = x[0].length, // number of samples per layer 
        data1 = d3.layout.stack().offset("wiggle")(x);
		    d3.selectAll("path").data(x).exit().remove();
	      transition(data1);	
    },
         error: function (xhr, ajaxOptions, thrownError){
             console.log(thrownError);
         }
    });



    labelsurl = '/streamgraph/' + countrynid + '/labels/';
    labels_array = {};
    $.ajax({
        async: true,
        type: 'GET',
        url: labelsurl,
        context: 'labels',
        dataType: 'json',
        success: function(o){
            labels_array = o;
            showChartTitle();
						$("#chart-title h1").text(countrytitle);
         },
           complete: function(o){
           hideLoadingGif();
         },
         error: function (xhr, ajaxOptions, thrownError){
           console.log(thrownError);
         }
    });
	  }
});
  return false;
});

});

