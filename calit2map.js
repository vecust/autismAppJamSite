function escapeText(t){
	return document.createTextNode(t).textContent;
}

function myGoodLoadXML(data) {
	$("div.dataXML").html("<h1>Global EarthQuakes From the Last 7 Days</h1>");
	var newTable = "<table id=\"newTable\" border=\"2\"><tr><th>Magnitude, Location</th><th>Date</th><th>LAT</th><th>LONG</th></tr></table>";
	$("div.dataXML").append(newTable);
	$(data).find("item").each(function(){
		$("#newTable").append("<tr><td>" + escapeText($(this).find("title").text()) + "</td><td>" + escapeText($(this).find("pubDate").text()) + "</td><td>" + escapeText($(this).find("lat").text()) + "</td><td>" + escapeText($(this).find("long").text()) + "</td></tr>");
	});
}

function myGoodLoadXML2(data) {
        $("div.dataXML2").html("<h1>mttaborstudio's flickr photostream</h1>");
        var newTable = "<table id=\"newTable2\" border=\"2\"><tr><th>Title</th><th>Date</th><th>LAT</th><th>LONG</th></tr></table>";
        $("div.dataXML2").append(newTable);
        $(data).find("entry").each(function(){
                $("#newTable2").append("<tr><td>" + escapeText($(this).find("title").text()) + "</td><td>" + escapeText($(this).find("date_taken").text()) + "</td><td>" + escapeText($(this).find("lat").text()) + "</td><td>" + escapeText($(this).find("long").text()) + "</td></tr>");
        });
}

var myPoint = [];

function myGoodLoadXML3(data) {
        $("div.rockets").html("<h1>Houston Rockets Game Locations</h1>");
        var newTable = "<table id=\"newTable3\" style=\"width:800px\" border=\"2\"><tr><th>Address</th><th>Games</th><th>Location</th></tr></table>";
        $("div.rockets").append(newTable);
        $(data).find("item").each(function(){
		var title = escapeText($(this).find("title").text());
		var titleSplit = title.split(': ');
                var point = escapeText($(this).find("point").text());
                point.slice(0,-2);
                var pointSplit = point.split(',');
		myPoint.push(pointSplit[0]);
		myPoint.push(pointSplit[1]);
                $("#newTable3").append("<tr><td>" + titleSplit[1] + "</td><td>" + escapeText($(this).find("description").text()) + "</td><td><a href=\"#\" id=\"point\" onclick=\"clickCenterPoint("+pointSplit[0]+","+pointSplit[1]+");\"><span id=\"lat\">" + pointSplit[0] + ", </span><span id=\"lng\">" + pointSplit[1]  + "</span></a></td></tr>");

        //contentString = '<div><p>'+escapeText($(this).find("description").text())+'</p><p><a href=\"'+escapeText($(this).find("link").text())+'\">Go to mapchannels.com</a></p></div>';

        });
	
}
//var geoClick = document.getElementById('point');
//geoClick.onclick = clickCenterPoint;



function clickCenterPoint(lat,lng){
        //var preClickLat = escapeText($(this).find('#lat').text());
	//var clickLat = pointSplit[0];
	//var clickLat = preClickLat.slice(0,-2);
        console.log(lat);
        //var clickLng = escapeText($(this).find('#lng').text());
	//var clickLng = pointSplit[1];
        console.log(lng);
        var clickCenterPoint = new google.maps.LatLng(lat, lng);
        map.setCenter(clickCenterPoint);
}

/*
function myGoodLoadJSON(data) {
	$("div.dataJSON").html("<h1>Global EarthQuakes From the Last 7 Days</h1>");

	var newHTML= "<div style=\"margin-left:10px;padding:5px;border:solid 1px green\">";
	newHTML += escapeText(data.postal);
	newHTML += +"</div>";
	$("div.dataJSON").append(newHTML);

}

function myGoodLoadJSONP(data) {
	$("div.dataJSONP").html("<h1>AJAX JSONP call returned:</h1>");

	for(var i = 0; i< data.feed.entry.length; i++){
		var newHTML= "<div style=\"margin-left:10px;padding:5px;border:solid 1px blue\">";
		newHTML += escapeText(data.feed.entry[i].title.$t);
		newHTML += +"</div>";
		$("div.dataJSONP").append(newHTML);
	}

}
*/

function myBadLoadFunction(myXMLHttpRequest,myErrorMessage,myErrorThrown) {
   	alert('status: ' + myErrorMessage + '\n' + myXMLHttpRequest.responseText);
}
			
var map;
var centerPoint = new google.maps.LatLng(29.7507, -95.3621);
var gameLocations = [];

function getGameLocations(data) {
	var temp = [];
        $(data).find("item").each(function(){
                var title = escapeText($(this).find("title").text());
                var titleSplit = title.split(': ');
                temp.push(titleSplit[1]);
                var point = escapeText($(this).find("point").text());
		point.slice(0,-2);
		var pointSplit = point.split(',');
		temp.push(pointSplit[0]);
		temp.push(pointSplit[1]);
		var description = escapeText($(this).find("description").text());
		temp.push(description);
		var link = escapeText($(this).find("link").text());
		temp.push(link);
		gameLocations.push(temp);
		temp = [];
	});
	for(var i=0;i<gameLocations.length;i++){
		console.log(gameLocations[i]);
	}


}
function initializeMap(){
	var myOptions = {
		zoom: 8,
		center: centerPoint,
		mapTypeId: google.maps.MapTypeId.ROADMAP
	};
	map = new google.maps.Map($('#map_canvas').get(0), myOptions);
	setMarkers(map,gameLocations);
}

function setMarkers(map,locations) {
	//var latlng = new google.maps.LatLng(33.643298,-117.841983);

	var image = new google.maps.MarkerImage('images/icon.png',
		// This marker is 32 pixels wide by 32 pixels tall.
		new google.maps.Size(50, 50),
		// The origin for this image is 0,0.
		new google.maps.Point(0,0),
		// The anchor for this image is at 0,16.
		new google.maps.Point(30,45));

	// The shadow image is larger in the horizontal dimension
	// while the position and offset are the same as for the main image.
	var shadow = new google.maps.MarkerImage('images/shadow.png',
		new google.maps.Size(80, 50),
		new google.maps.Point(0,0),
		new google.maps.Point(30,45));

	var infowindow = null;
	var contentString = "";
	for(var i=0;i<locations.length;i++) {
	var gamePlace = locations[i];
	console.log(gamePlace[0]);
	console.log(gamePlace[1]);
	console.log(gamePlace[2]);
        console.log(gamePlace[3]);
        //contentString = '<div><p>'+gamePlace[3]+'</p><p><a href=\"'+gamePlace[4]+'\">Go to mapchannels.com</a></p></div>';
        infowindow = new google.maps.InfoWindow({
                content: ""
        });
	var gameLatLng = new google.maps.LatLng(gamePlace[1],gamePlace[2]);
	var marker = new google.maps.Marker({
		position: gameLatLng,
		map: map,
		shadow: shadow,
		icon: image,
		title: gamePlace[0]
	});
	
	google.maps.event.addListener(marker,'click',(function(marker,i){
		return function(){
		infowindow.setContent('<div><p>'+locations[i][3]+'</p><p><a href=\"'+locations[i][4]+'\">Go to mapchannels.com</a></p><iframe width=\"300\" height=\"169\" src=\"https://www.youtube.com/embed/Ttw6RBYGPOM\" frameborder=\"0\" allowfullscreen></iframe></div>');
		infowindow.open(map,marker);
		}
	})(marker,i));
	}		
}

function myReadyFunction(){
	$.ajax({
		url: "https://students.ics.uci.edu/~vcustodi/133/myProxy.php?http://earthquake.usgs.gov/eqcenter/catalogs/eqs7day-M5.xml",
		dataType: "xml",
		success: myGoodLoadXML,
		error: myBadLoadFunction
	});

	$.ajax({
                url: "https://students.ics.uci.edu/~vcustodi/133/myProxy.php?http://api.flickr.com/services/feeds/geo/?id=55859022@N06&lang=en-us",
                dataType: "xml",
                success: myGoodLoadXML2,
                error: myBadLoadFunction
        });

        $.ajax({
                url: "https://students.ics.uci.edu/~vcustodi/133/myProxy.php?http://events.mapchannels.com/entrss/438.rss",
                dataType: "xml",
                success: myGoodLoadXML3,
                error: myBadLoadFunction
        });

        $.ajax({
                url: "https://students.ics.uci.edu/~vcustodi/133/myProxy.php?http://events.mapchannels.com/entrss/438.rss",
                dataType: "xml",
                success: getGameLocations,
                error: myBadLoadFunction
        });


/*
	$.ajax({
		url: "https://students.ics.uci.edu/~vcustodi/133/myProxy.php?http://static.batchgeo.com/map/json/7b80089aed1792d280c61c0b0f952d56/1351101106",
		dataType: "json",
		success: myGoodLoadJSON,
		error: myBadLoadFunction
	});
	$("div.dataJSON").html("AJAX JSON call initiated:<br/>");

	$.ajax({
		url: "https://gdata.youtube.com/feeds/base/users/djp3/uploads?alt=json-in-script&amp;client=ytapi-youtube-profile",
		dataType: "jsonp",
		success: myGoodLoadJSONP,
		error: myBadLoadFunction
	});
	$("div.dataJSONP").html("AJAX JSONP call initiated:<br/>");
*/
}

$(document).ready(
	myReadyFunction

/*	
$('#point').click(function(){
        var clickLat = escapeText($(this).find('#lat').text());
        console.log(clickLat);
        var clickLng = escapeText($(this).find('#lng').text());
        console.log(clickLng);
        var clickCenterPoint = new google.maps.LatLng(clickLat, clickLng);
        map.setCenter(clickCenterPoint);
});
*/
);


