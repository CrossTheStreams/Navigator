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
}


jQuery(document).ready(function($) {

countries = $.map(getCountriesAndNids(), function(val, index) {
     return val[0];
})

$('#countrybox').typeahead({
    source: countries,
    items: 5,
});

$("#countryform").submit(function() {
  $.map(getCountriesAndNids(), function(val, index) {
     if (val[0] == $("input:first").val()) {
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



//function getLabels() {
    //labelsurl = '/streamgraph/' + countrynid + '/labels/';
    //labels_array = {};
    //$.ajax({
        //async: true,
        //type: 'GET',
        //url: labelsurl,
        //context: 'labels',
        //dataType: 'json',
        //success: function(o){
            //labels_array = o;
         //},
         //error: function (xhr, ajaxOptions, thrownError){
             //console.log(thrownError);
         //}
    //});
//}




/* Inspired by Lee Byron's test data generator. */
function stream_layers(n, m, o) {
  if (arguments.length < 3) o = 0;
/*  function bump(a) {*/
    //var x = 1 / (.1 + Math.random()),
        //y = 2 * Math.random() - .5,
        //z = 10 / (.1 + Math.random());
    //for (var i = 0; i < m; i++) {
      //var w = (i / m - y) * z;
      //a[i] += x * Math.exp(-w * w);
    //}
  /*}*/

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


/* Close, but no cigar. Yet. */

/*$.map(data_array, function(arr, index) {*/
   //$.map(arr, function(stuff, year){
    //a = []; 
    //a[year] = {x : year, y : stuff};
  //});
  //return a;
/*});*/
