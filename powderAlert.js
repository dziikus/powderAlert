var map;
function httpGet(theUrl) {
	var xmlHttp = null;
	xmlHttp = new XMLHttpRequest();
	xmlHttp.open("GET", theUrl, false);
	xmlHttp.send(null);
	return xmlHttp.responseText;
}

function translateConditions(conditions) {
	if (conditions == '0') {
		return 'impossible';
	} else if (conditions == '1') {
		return 'poor';
	} else if (conditions == '2') {
		return 'medium';
	} else if (conditions == '3') {
		return 'good';
	} else if (conditions == '4') {
		return 'very good';
	} else if (conditions == '5') {
		return 'POWDER ALERT';
	}
	return 'no data';
}

function translateAvalancheRisk(risk){
   if (risk == '1') {
		return '1 Low';
	} else if (risk == '2') {
		return '2 Moderate';
	} else if (risk == '3') {
		return '3 Considerable';
	} else if (risk == '4') {
		return '4 High';
	} else if (risk == '5') {
		return '5 Extreme';
	}
	return 'Not applicable';
}

function translateSnowType(type){
	if (type == '0') {
		return 'powder';
	} else if (type == '1') {
		return 'crud';
	} else if (type == '2') {
		return 'groomed';
	} else if (type == '3') {
		return 'ice';
	} else if (type == '4') {
		return 'artificial';
	} else if (type == '5') {
		return 'other';
	}
	return 'no data';
}

function getMountains() {
	var resp = httpGet('https://www.googleapis.com/fusiontables/v1/query?sql=SELECT%20mountains%20FROM%201zdMS8pSrXcX7sw5QT4uzTSXo3fu7oP8II8n2QYw&key=AIzaSyAm9yWCV7JPCTHCJut8whOjARd7pwROFDQ');
	var json = JSON.parse(resp);
	return json.rows;
}



function getNoDataColor(){
   return '#B1B1B4';
}
function getColor(conditions) {
   //return 'green';
	conditions = Math.round( conditions );
//	if (conditions == 0)
//		return '#ffffff';
//	else
   if (conditions == 1)
		return '#8D8DB6';
	else if (conditions == 2)
		return '#6A6AB6';
	else if (conditions == 3)
		return '#4746BA';
	else if (conditions == 4)
		return '#2423BC';
	else if (conditions == 5)
		return '#0100BF';
   return getNoDataColor();
}

function getConditions(mountains) {
	var d = new Date();
	d.setDate(d.getDate() - 7);
	var curr_date = d.getDate() - 7;
	var resp = httpGet('http://www.goryidoliny.hostings.pl/powder/detailedConditions.php?mountains=' + mountains);
	var json = JSON.parse(resp);
   
   var info = $('<div></div>');
   var infoTitle = $('<table></table>').addClass('bordered');
   infoTitle.append($('<thead><tr><th>Detailed reports for ' + mountains +'</th></tr></thead>'));
   info.append(infoTitle);
   var table = $('<table></table>').addClass('bordered');
	var head = $('<thead><tr><th>Date</th><th>Overall</th><th>Nick</th><th>Depth</th><th>Type</th><th>Trail</th><th>Aval</th><th>Description</th><tr></thead>');
	table.append(head);
   
	for ( var i = 0; i < json.response.length; i++) {
      var tr = $('<tr></tr>');
      tr.append($('<td></td>').append(document.createTextNode(json.response[i].date)));
      tr.append($('<td></td>').append(document.createTextNode(translateConditions(json.response[i].conditions))));
      tr.append($('<td></td>').append(document.createTextNode(json.response[i].user)));
		tr.append($('<td></td>').append(document.createTextNode(json.response[i].snowDepth)));
      tr.append($('<td></td>').append(document.createTextNode(translateSnowType(json.response[i].snowType))));
		tr.append($('<td></td>').append(document.createTextNode(json.response[i].trail)));
      tr.append($('<td></td>').append(document.createTextNode(translateAvalancheRisk(json.response[i].avalancheRisk))));
      tr.append($('<td></td>').append(document.createTextNode(json.response[i].comment)));
		table.append(tr);
                
	}
   info.append(table);
	return info;
}
function getAVGColorsMap() {
	var resp = httpGet('http://www.goryidoliny.hostings.pl/powder/getAVGconditions.php');
   var colors = [];
   var json = JSON.parse(resp);
	for ( var i = 0; i < json.response.length; i++) {
		var color = getColor(json.response[i].conditions);
		var mountains = json.response[i].mountains;
      colors[mountains]=color;
	}
   return colors;
}

function getAVGConditionsMap() {
	var resp = httpGet('http://www.goryidoliny.hostings.pl/powder/getAVGconditions.php');
   var colors = [];
   var json = JSON.parse(resp);
	for ( var i = 0; i < json.response.length; i++) {
		var color = json.response[i].conditions;
		var mountains = json.response[i].mountains;
      colors[mountains]=color;
	}
   return colors;
}

function createWarunLegend() {
	var legend = document.getElementById('warunLegend');
	for ( var i = 0; i < 6; ++i) {
		var color = document.createElement('div');
		color.style.width = "100px";
		color.style.height = "20px";
		color.style.background = getColor(i);
		color.style.color = 'white';
		color.innerHTML = translateConditions(i);
		legend.appendChild(color);
	}
   
}


//http://goryidoliny.hostings.pl/insertReport.php?mountains=tatry&user=dzikus&conditions=2&date=2013-09-12
$(function() {
  $("#datepicker").datepicker();
  });


$(document).ready(function() {
   var mountainList = getMountains();
   for(var i = 0; i < mountainList.length; ++i){
                  $('#mountains').append($('<option/>').val(mountainList[i]).text(mountainList[i]));
   }
   for(var i = 0; i <= 5; ++i){
                  $('#overall').append($('<option/>').val(i).text(translateConditions(i)));
   }
   for(var i = 0; i <= 6; ++i){
      $('#snowtype').append($('<option/>').val(i).text(translateSnowType(i)));
   }
   for(var i = 0; i <= 6; ++i){
      $('#avalancheRisk').append($('<option/>').val(i).text(translateAvalancheRisk(i)));
   }
                  
   $('#datepicker').datepicker('setDate', new Date());
                  var pickerOpts = {
                  dateFormat:"yy-mm-dd"
                  };
                  $("#datepicker").datepicker(pickerOpts);
   $('button').on('click', function() {
      $(function() {
        $("#dialog").dialog({
                            modal : true,
                            buttons : {
                            "Add" : function() {
                            var now = $.datepicker.formatDate('yy-mm-dd', $('#datepicker').datepicker("getDate"));
                            var insert = 'http://www.goryidoliny.hostings.pl/powder/insertReport.php?mountains='
                            + mountains.value
                            + '&user='
                            + user.value
                            + '&conditions='
                            + overall.value
                            + '&date='
                            + now
                            + '&comment='
                            + desc.value
                            + '&trail='
                            + trail.value
                            + '&snowDepth='
                            + snowdepth.value
                            + '&snowType='
                            + snowtype.value
                            + '&avalancheRisk='
                            + avalancheRisk.value;
                            $.ajax({ //my ajax request
                                   url: insert,
                                   type: "POST",
                                   cache: false,
                                   dataType: "json"
                                   });
                            $(this)
                            .dialog(
                                    "close");
                            },
                            Cancel : function() {
                            $(this).dialog("close");
                            }
                            }
                            });
        });
      });
   });

$(function() {
  $( document ).tooltip();
  });
function attachPolygonInfoWindow(polygon, html)
{
   infoWindow = new google.maps.InfoWindow({
                                                   content: html,
                                                   });
   google.maps.event.addListener(polygon, 'mouseover', function(e) {
                                 var latLng = e.latLng;
                                 this.setOptions({fillOpacity:1});
                                 infoWindow.setPosition(latLng);
                                 infoWindow.open(map, polygon);

                                 });
   google.maps.event.addListener(polygon, 'mouseout', function() {
                                 this.setOptions({fillOpacity:0.8});
                                 infoWindow.close();
                                 });
}

function initialize() {
	var mapOptions = {
		zoom : 9,
		center : new google.maps.LatLng(49.397, 20.644),
		mapTypeId : google.maps.MapTypeId.ROADMAP
	};
	map = new google.maps.Map(document.getElementById('map-canvas'), mapOptions);
   
   var colorsMap = getAVGColorsMap();
   var resp = httpGet('http://www.goryidoliny.hostings.pl/powder/getMountains.php');
   var json = JSON.parse(resp);
   
   var mountainRange;

   
   var map = new google.maps.Map(document.getElementById('map-canvas'), mapOptions);
   for ( var i = 0; i < json.response.length; i++) {
      var numbers = json.response[i].kml.split(/[\s,]+/);
      var triangleCoords = [];
      for(var j = 0; j+3 < numbers.length; j+=3){
         triangleCoords.push(new google.maps.LatLng(numbers[j+1], numbers[j]));
      }
      
      // Construct the polygon.
      var m = json.response[i].mountains;
      var color = colorsMap[m];
      if(color == null)
         color = getNoDataColor();
      mountainRange = new google.maps.Polygon({
                                                paths: triangleCoords,
                                                strokeColor: color,
                                                strokeOpacity: 0.8,
                                                strokeWeight: 0,
                                                fillColor: color,
                                                fillOpacity: 0.8,
                                                mountainsName: json.response[i].mountains,
                                                title: json.response[i].mountains
                                                });
      attachPolygonInfoWindow(mountainRange, '<strong>Info about this area</strong>');//json.response[i].mountains);
      
      mountainRange.setMap(map);
      google.maps.event.addListener(mountainRange, 'click', function (event) {
                                       $('#visualization').empty();
                                       var leftPanel = $('#visualization').append(getConditions(this.mountainsName));
                                    });
   }
	createWarunLegend();
}

google.maps.event.addDomListener(window, 'load', initialize);