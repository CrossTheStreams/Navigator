var area = d3.svg.area()
    .x(function(d) { return d.x * w / mx; })
    .y0(function(d) { return h - d.y0 * h / my; })
    .y1(function(d) { return h - (d.y + d.y0) * h / my; });

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
    data0 = d3.layout.stack().offset("wiggle")(x),
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
  d3.selectAll("path")
      .data(function() {
       var d = x; 
       return data0 = d;
      })
    .transition()
      .duration(2500)
      .attr("d", area);
    my = d3.max(data0, function(d) {
      return d3.max(d, function(d) {
        return d.y0 + d.y;
      });
    });
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
			  transition(x);	
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


/* Inspired by Lee Byron's test data generator. */
function stream_layers(n, m, o) {
  if (arguments.length < 3) o = 0;
	function bump(a) {
		var x = 1 / (.1 + Math.random()),
				y = 2 * Math.random() - .5,
				z = 10 / (.1 + Math.random());
		for (var i = 0; i < m; i++) {
			var w = (i / m - y) * z;
			a[i] += x * Math.exp(-w * w);
		}
	}

  return d3.range(n).map(function() {
      var a = [], i;
      for (i = 0; i < m; i++) a[i] = o + o * Math.random();
      for (i = 0; i < 5; i++) bump(a);
      return a.map(stream_index);
    });
}


/* Another layer generator using gamma distributions. */
function stream_waves(n, m) {
  return d3.range(n).map(function(i) {
    return d3.range(m).map(function(j) {
        var x = 20 * j / m - i / 3;
        return 2 * x * Math.exp(-.5 * x);
      }).map(stream_index);
    });
}

function stream_index(d, i) {
	
  return {x: i, y: Math.max(0, d)};
}
