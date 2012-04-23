var w = 1000;
var h = 490;
all_paths = d3.selectAll("path")[0];
color_array = ["#AAF5A8", "#4EA14C", "#7CCB7A", "#21771E", "#AAF5A8", "#4EA14C", "#7CCB7A", "#21771E", "#AAF5A8", "#4EA14C", "#7CCB7A", "#21771E", "#AAF5A8", "#4EA14C", "#7CCB7A", "#21771E", "#AAF5A8"];

$.ajaxSetup({
  timeout: '7000'
});

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

function fillColors() {
  d3.selectAll("path")[0].map( function(path, i) {
    path.style.fill = color_array[i];
  });
};


function highlightingAndLabels() {

  //Giving ids to paths for labels and changing path strokes according to clicked state and mouseover/mouseout.	

  d3.selectAll("path")[0].map( function(path, i) {
    path.id = i;
    path.clicked = false;
    path.style.stroke = "none";
    d3.select(path).classed("opaque", true);

  d3.select(path).on("mouseover", function() {
      if (path.clicked === false) {
        path.style.stroke = "rgb(8, 224, 159)";
        path.style.strokeWidth = "3px";
        d3.select(path).classed("opaque", false);
      }
  });

    d3.select(path).on("mouseout", function() {
      if (path.clicked === false) {
        path.style.stroke = "none";
        d3.select(path).classed("opaque", true);
      }
    });

    d3.select(path).on("click", function() {
      if (path.clicked === false) {

        $("#type-label").css('display', 'none');
        $("#type-definition").css('display', 'none');
        $("#type-label").css('padding', '0px');
        $("#type-definition").css('padding', '0px');

        d3.selectAll("path")[0].map( function(p, i) {
          p.clicked = false;
          p.style.stroke = "none";
          d3.select(path).classed("opaque", false);
        }); 
        path.clicked = true;
        path.style.stroke = "rgb(113, 224, 252)";
        path.style.strokeWidth = "3px";
        $("#type-label").text(labels_array[i]);

          for (var index = 0; index < definitions.length; index++)
            {
              if (definitions[index].label == labels_array[i]) {
                $("#type-definition").text(definitions[index].definition);
              }
            };

        $("#type-label").fadeIn("slow").animate({
            'padding-left': '10px'
            }, {duration: 'slow', queue: false}, function() {
            // Animation complete.
        });

        $("#type-definition").fadeIn("slow").animate({
            'padding-right': '10px'
            }, {duration: 'slow', queue: false}, function() {
            // Animation complete.
        });
      }
      else { 
        path.clicked = false;
        path.style.stroke = "rgb(8, 224, 159)";
        path.style.strokeWidth = "3px";
        d3.select(path).classed("opaque", true);
      }
    });
  });

  $("#type-label").fadeOut("slow");
  $("#type-label").text(labels_array[0]);
 

};


function getStreamGraph(x) {

  var n = x.length, // number of layers
      m = x[0].length; // number of samples per layer

  var mx = m - 1,
      my = d3.max(data0, function(d) {
        return d3.max(d, function(d) {
          return d.y0 + d.y;
        });
      });

  var area = d3.svg.area()
    .x(function(d) { return d.x * w / mx; })
    .y0(function(d) { return h - d.y0 * h / my; })
    .y1(function(d) { return h - (d.y + d.y0) * h / my; }); 

  var vis = d3.select("#chart-goes-here")
    .append("svg")
    .attr("width", w)
    .attr("height", h);
  vis.selectAll("path")
    .data(data0)
    .enter().append("path")
    .attr("d", area);

  highlightingAndLabels();
  fillColors()
  showChart();
  hideLoadingGif();
}

function transition(x) {

  h = 490;
  mx = m - 1,
  my = d3.max(data1, function(d) {
    return d3.max(d, function(d) {
      return d.y0 + d.y;
      });
    });

  var area = d3.svg.area()
    .x(function(d) { return d.x * w / mx; })
    .y0(function(d) {
      if (my >= 6) 
      return h - d.y0 * h / my;
      else
      my = 5;
      h = 310;
      return h - d.y0 * h / my;  
    })
    .y1(function(d) { return h - (d.y + d.y0) * h / my; });

  d3.select("svg").selectAll("path")
    .data(x)
    .enter().insert("path")
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
   
  highlightingAndLabels();
  fillColors();
  hideLoadingGif();
  showChartTitle();

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




function hideChartTitle() {
$('#chart #chart-title').fadeOut("slow");
};

function hideLoadingGif() {
$('.side-things img').fadeOut("slow");
};

function hideReset() {
$('#reset-btn').fadeOut("slow");
};



function showChart() {
$('#chart').fadeIn("slow");
};

function showChartTitle() {
$('#chart #chart-title').fadeIn("slow");
};

function showLoadingGif() {
$('.side-things img').fadeIn("slow");
};

function showReset() {
$('#reset-btn').fadeIn("slow");
};

jQuery(document).ready(function($) {

  type_definitions = {"types" :[
    {"label": "Administrative Records – Financial", "definition": "Financial data of organizations and governments."}, 
    {"label": "Administrative Records – Operational", "definition": "Data concerning the operations of organizations and governments"}, 
    {"label": "Census", "definition": "The procedure of systematically acquiring and recording information about the members of a given population."}, 
    {"label": "Common Indicator", "definition": "Indicator data."}, 
    {"label": "Estimate", "definition": "Data that is abtracted in a manner from its original collection. Does not include microdata."}, 
    {"label": "Health Records", "definition": "Hospital data."}, 
    {"label": "Journal Article", "definition": "A work written for the purpose of propagating research."}, 
    {"label": "Multisource", "definition": "Data that is abstract or collected from multiple sources. Confusing? You bet! :D"}, 
    {"label": "Registry", "definition": "A systematic, centralized collection of data, often concerning a particular disease (e.g. cancer)."}, 
    {"label": "Report", "definition": "Reports that serve as datasets, as well as documentation."}, 
    {"label": "Research Archive", "definition": "An archive of data."}, 
    {"label": "Results Data", "definition": "Results from a study."}, 
    {"label": "Surveillance System", "definition": "Data available from an epidemiological surveillance system."},
    {"label": "Survey - Facility", "definition": "A survey that collects data from facility personnel."}, 
    {"label": "Survey - Household", "definition": "A survey that collects data from individuals or households"}, 
    {"label": "Tool", "definition": "Software that is of use for data analysis."}, 
    {"label": "Vital Registration", "definition": "Data concerning the vital events of a country's citizens and residents."}
    ]}; 

  definitions = type_definitions.types;
  alldatasetssurl = '/all_datasets_by_year/';
  all_datasets_array = {};
  labels_array = {};
  
  $.ajax({
    async: true,
    type: 'GET',
    url: alldatasetssurl,
    dataType: 'json',
    success: function(all_datasets_and_labels){
      all_datasets_array = all_datasets_and_labels["all_datasets"];
      labels_array = all_datasets_and_labels["all_labels"]
      x = streamGraphTheData(all_datasets_array);
      data0 = d3.layout.stack().offset("silhouette")(x);        
      getStreamGraph(x);
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

        $.ajax({
          async: true,
          type: 'GET',
          url: url,
          context: 'graphdata',
          dataType: 'json',
          success: function(datasets_and_labels){        
            datasets_array = datasets_and_labels["datasets"];
            labels_array = datasets_and_labels["labels"];
            x = streamGraphTheData(datasets_array);
	    n = datasets_array.length, // number of layers
            m = datasets_array[0].length, // number of samples per layer
            $("#chart-title h1").text(countrytitle); 
            data1 = d3.layout.stack().offset("silhouette")(x);
	    d3.selectAll("path").data(x).exit().remove();
	    transition(data1);
            showReset();
          },
          error: function (xhr, timeout, thrownError){
            console.log(thrownError);
	    hideLoadingGif();
            $("#chart-title h1").text("Timeout :(");
            showChart();
           }
        });

      }
    });
    return false;
  });

  $("#reset-button").submit(function() {

    hideChartTitle();
    x = streamGraphTheData(all_datasets_array);
    n = all_datasets_array.length, // number of layers
    m = all_datasets_array[0].length, // number of samples per layer
    $("#chart-title h1").text("All Datasets"); 
    data1 = d3.layout.stack().offset("silhouette")(x); 
    transition(x);
    hideReset();
    return false;

  });

});





