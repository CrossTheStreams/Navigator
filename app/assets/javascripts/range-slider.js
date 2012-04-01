var date = new Date();
var currentyear = date.getFullYear();

$(function() {
		$( "#range-slider" ).slider({
			range: true,
			min: 1950,
			max: currentyear,
			values: [ 1950, currentyear ],
			slide: function( event, ui ) {
				$( "#years-selected" ).text( ui.values[ 0 ] + " - " + ui.values[ 1 ] );
			}
		});
		$( "#years-selected" ).text( $( "#range-slider" ).slider( "values", 0 ) +
			" - " + $( "#range-slider" ).slider( "values", 1 ) );
	});
