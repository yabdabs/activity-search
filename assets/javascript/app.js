	$(document).ready(function() {

	    //Declaring Variables
	    var city = "";
	    var state = "";
	    var zip = "";
	    var radius = "";
	    var date = "";
	    var convertedDate;
	    var bounds = new google.maps.LatLngBounds();
	    var latitude;
	    var longitude;

	    var currentDate = moment().format("YYYY-MM-DD");
	    currentDate += "..";
	    console.log(currentDate);

	    $("#submit").on("click", function(event) {
	        event.preventDefault();

	        //function to remove/reset markers so that the markers don't keep piling up
	        //on every search/submit. 
	        for (var i = 0; i < marker.length; i++) {
	            marker[i].setMap(null);
	        }

	        marker.length = 0;

	        city = $("#cityBox").val().trim();
	        console.log(city);
	        state = $("#stateBox").val().trim();
	        console.log("state " + state);
	        zip = $("#zipCodeBox").val().trim();
	        console.log("zip " + zip);

	        radius = $("#radiusBox").val().trim();
	        console.log("radius " + radius);
	        // date = $("#startDate").val().trim();

	        // console.log("date " + date);

	        activity = $("#activityBox").val();
	        console.log("activty " + activity);



	        var parameters = $.param({
	            api_key: "9jcmruut6uygxzfd399dh5bd",
	            query: activity,
	            category: "event",
	            state: abbrState(state),
	            radius: radius,
	            per_page: "12",
	            start_date: currentDate,
	            zip: zip,
	        });

	        abbrState();




	        $.ajax({
	            url: "https://active-access-app.herokuapp.com/v2/search?" + parameters,
	            type: 'GET',
	            dataType: 'json'
	        }).done(function(serverResponse) {
	            console.log(serverResponse);

	            if (serverResponse.total_results === 0) {
	                var none = $("<div>");
	                none.html("No Results Found");
	                $("#searchResults").append(none);
	            } else {

	                for (var i = 0; i < serverResponse.results.length; i++) {

	                    console.log(serverResponse.results[i].place.placeName);
	                    console.log(serverResponse.results[i].place.addressLine1Txt);
	                    console.log(serverResponse.results[i].place.cityName);
	                    console.log(serverResponse.results[i].assetName);
	                    console.log(serverResponse.results[i].activityStartDate);

	                    var date = serverResponse.results[i].activityStartDate;
	                    console.log(date);

	                    //convert start date from response into a better format( 12 hour clock)
	                    convertedDate = moment(date, "YYYY-MM-DDTHH:mm:ss").format("YYYY-MM-DD");
	                    console.log(convertedDate);


	                    $("#searchResults").addClass("animated fadeIn delay1s8ms");

	                    if (serverResponse.results[i].assetName.length > 1) {
	                        var assetName = $("<div class='bColor'>");
	                        assetName.html("<p>" + "<span class='activityInfo'>" + "Event Name:  " + "</span>" + serverResponse.results[i].assetName + "</p>");
	                        $("#searchResults").append(assetName);
	                    }
	                    if (serverResponse.results[i].place.placeName.length > 1) {
	                        var placeName = $("<div class='bColor'>");
	                        placeName.html("<p>" + "<span class='activityInfo'>" + "Place Name:  " + "</span>" + serverResponse.results[i].place.placeName + "</p>");
	                        $("#searchResults").append(placeName);
	                    }
	                    if (serverResponse.results[i].place.addressLine1Txt.length > 1) {
	                        var address = $("<div class='bColor'>");
	                        address.html("<p>" + "<span class='activityInfo'>" + "Address:  " + "</span>" + serverResponse.results[i].place.addressLine1Txt + "</p>");
	                        $("#searchResults").append(address);
	                    }
	                    if (serverResponse.results[i].place.cityName.length > 1) {
	                        var cityName = $("<div class='bColor'>");
	                        cityName.html("<p>" + "<span class='activityInfo'>" + "City:  " + "</span>" + serverResponse.results[i].place.cityName + "</p>");
	                        $("#searchResults").append(cityName);
	                    }
	                    if (serverResponse.results[i].activityStartDate.length > 1) {
	                        var startDate = $("<div class='bColor'>");
	                        startDate.html("<p>" + "<span class='activityInfo'>" + "Start Date:  " + "</span>" + convertedDate + "</p>");
	                        $("#searchResults").append(startDate);

	                    }
	                    if (serverResponse.results[i].homePageUrlAdr.length > 1) {
	                        var siteURL = $("<div class='bColor'>");
	                        var link = serverResponse.results[i].homePageUrlAdr;
	                        console.log(serverResponse.results[i].homePageUrlAdr)
	                        siteURL.html("<p>" + "<span class='activityInfo'>" + "Website:  " + "</span>" + "<a href=" + link + ">" + serverResponse.results[i].homePageUrlAdr + "</a>" + "</p>")

	                        $("#searchResults").append(siteURL);


	                    }
	                    if (serverResponse.results[i].registrationUrlAdr.length > 1) {
	                        var urlB = $("<div class='bColor'>");
	                        var link2 = serverResponse.results[i].registrationUrlAdr;
	                        urlB.html("<p>" + "<span class='activityInfo'>" + "Website:  " + "</span>" + "<a href=" + link2 + ">" + serverResponse.results[i].registrationUrlAdr + "</a>" + "</p>")
	                        $("#searchResults").append(urlB);

	                    }
	                    var divDivider = $("<div id='border'>");
	                    $("#searchResults").append(divDivider);
	                }





	                // console.log(response.results[1].place.placeName);

	                for (var i = 0; i < serverResponse.results.length; i++) {

	                    //convert lat lan string from server reponse to lat lng decimals
	                    //google maps lat lng object literal
	                    latitude = parseFloat(serverResponse.results[i].place.geoPoint.lat);
	                    longitude = parseFloat(serverResponse.results[i].place.geoPoint.lon);
	                    console.log(latitude)
	                    console.log(longitude)

	                    //locations object will have stored the lat and long value in decimals
	                    //so that we can use google maps to map it with a marker
	                    locationsObj["location" + i] = { lat: latitude, lng: longitude }

	                    //content is what will be displayed in the marker infoWindow
	                    //content is what will be displayed in the marker infoWindow
	                    var content = '';
	                    content += '<h3>' + serverResponse.results[i].assetName + "</h3>";
	                    content += '<h4>Home Page: ' + serverResponse.results[i].homePageUrlAdr + '</h4>';
	                    content += '<h4>Registration:<a href=' + serverResponse.results[i].registrationUrlAdr + '</a></h4>';
	                    content += '<h4>Contact Name: ' + serverResponse.results[i].contactName + '</h4>';
	                    content += '<h4> Contact Phone: ' + serverResponse.results[i].contactPhone + '</h4>';
	                    content += '<h4> Address: ' + serverResponse.results[i].place.addressLine1Txt + " " + serverResponse.results[i].place.addressLine2Txt + ", " + serverResponse.results[i].place.stateProvinceCode + '</h4>';

	                    //extends the bounds of the map with the coordinate
	                    bounds.extend(locationsObj["location" + i]);
	                    //positions the map so that it fits that bound/marker
	                    map.fitBounds(bounds);

	                    marker[i] = new google.maps.Marker({
	                        position: locationsObj["location" + i],
	                        map: map
	                    })

	                    infoWindow = new google.maps.InfoWindow({
	                        content: content,
	                        position: locationsObj["location" + i]
	                    })


	                    google.maps.event.addListener(marker[i], 'click', (function(marker, content, infoWindow) {
	                        return function() {
	                            infoWindow.close();
	                            infoWindow.setContent(content);
	                            infoWindow.open(map, marker);
	                        };
	                    })(marker[i], content, infoWindow));
	                }

	            }

	            console.log(locationsObj)
	        })

	    }); //ends submit function

	}); //ends document.ready





	function abbrState(input, to) {

	    var states = [
	        ['Arizona', 'AZ'],
	        ['Alabama', 'AL'],
	        ['Alaska', 'AK'],
	        ['Arizona', 'AZ'],
	        ['Arkansas', 'AR'],
	        ['California', 'CA'],
	        ['Colorado', 'CO'],
	        ['Connecticut', 'CT'],
	        ['Delaware', 'DE'],
	        ['Florida', 'FL'],
	        ['Georgia', 'GA'],
	        ['Hawaii', 'HI'],
	        ['Idaho', 'ID'],
	        ['Illinois', 'IL'],
	        ['Indiana', 'IN'],
	        ['Iowa', 'IA'],
	        ['Kansas', 'KS'],
	        ['Kentucky', 'KY'],
	        ['Kentucky', 'KY'],
	        ['Louisiana', 'LA'],
	        ['Maine', 'ME'],
	        ['Maryland', 'MD'],
	        ['Massachusetts', 'MA'],
	        ['Michigan', 'MI'],
	        ['Minnesota', 'MN'],
	        ['Mississippi', 'MS'],
	        ['Missouri', 'MO'],
	        ['Montana', 'MT'],
	        ['Nebraska', 'NE'],
	        ['Nevada', 'NV'],
	        ['New Hampshire', 'NH'],
	        ['New Jersey', 'NJ'],
	        ['New Mexico', 'NM'],
	        ['New York', 'NY'],
	        ['North Carolina', 'NC'],
	        ['North Dakota', 'ND'],
	        ['Ohio', 'OH'],
	        ['Oklahoma', 'OK'],
	        ['Oregon', 'OR'],
	        ['Pennsylvania', 'PA'],
	        ['Rhode Island', 'RI'],
	        ['South Carolina', 'SC'],
	        ['South Dakota', 'SD'],
	        ['Tennessee', 'TN'],
	        ['Texas', 'TX'],
	        ['Utah', 'UT'],
	        ['Vermont', 'VT'],
	        ['Virginia', 'VA'],
	        ['Washington', 'WA'],
	        ['West Virginia', 'WV'],
	        ['Wisconsin', 'WI'],
	        ['Wyoming', 'WY'],
	    ];

	    if (to == 'abbr') {
	        input = input.replace(/\w\S*/g, function(txt) { return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase(); });
	        for (i = 0; i < states.length; i++) {
	            if (states[i][0] == input) {
	                return (states[i][1]);
	            }
	        }
	    } else if (to == 'name') {
	        input = input.toUpperCase();
	        for (i = 0; i < states.length; i++) {
	            if (states[i][1] == input) {
	                return (states[i][0]);
	            }
	        }
	    }
	}



	$("#button").on("click", function() {
	    event.preventDefault();

	    var city = $("#cityBox").val().trim();
	    var state = $("#stateBox").val().trim();
	    var radius = $("#radiusBox").val().trim();
	    var activity = $("#activityBox").val().trim();
	    // console.log(city);






	});

	var parameters = $.param({
	    api_key: "9jcmruut6uygxzfd399dh5bd",
	    query: "running",
	    category: "event",
	    state: "CA",
	    radius: "50",
	    per_page: "1",
	    start_date: "2017-06-09.."
	})

	$.ajax({
	    url: "https://active-access-app.herokuapp.com/v2/search?" + parameters,
	    type: 'GET',

	    dataType: 'json'

	}).done(function(response) {
	    console.log(response);
	})

	function logIt(response) {
	    debugger;
	    console.log(response);
	}


	function reset() {

	    $("#cityBox").val("");

	    $("#stateBox").val("");

	    $("#zipCodeBox").val("");


	    $("#radiusBox").val("");

	    $("#startDate").val("");


	    $("#activityBox").val("");

	    $("#searchResults").html("")

	}
	reset();