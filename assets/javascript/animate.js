// On document ready.. 
$(document).ready(function(){

	// .addClass to make full jumbotron fadeInDown
	$("#header").addClass("animated fadeInDown");

	// .addClass to make title fadeIn
	$("#titleAnimate").addClass("animated fadeIn delay0s8ms");

	// .addClass to make main container fadeIn
	$("#mainContainer").addClass("animated fadeIn delay1s5ms");

	// .addClass to make description and search boxes fadeIn
	$("#firstSection").addClass("animated fadeIn delay2s7ms");
	$("#secondSection").addClass("animated fadeIn delay2s7ms");

	// .addClass to make search results headers and results divs fadeIn
	$("#weatherHeader").addClass("animated fadeIn delay3s2ms");
	$("#activitiesHeader").addClass("animated fadeIn delay3s2ms");
	$("#mapsHeader").addClass("animated fadeIn delay3s2ms");
	$("#weatherResults").addClass("animated fadeIn delay3s2ms");
	$("#searchResults").addClass("animated fadeIn delay3s2ms");
	$("#googleMaps").addClass("animated fadeIn delay3s2ms");
});