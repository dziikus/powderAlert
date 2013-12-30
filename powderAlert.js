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

function getMountains() {
	var resp = httpGet('https://www.googleapis.com/fusiontables/v1/query?sql=SELECT%20mountains%20FROM%201zdMS8pSrXcX7sw5QT4uzTSXo3fu7oP8II8n2QYw&key=AIzaSyAm9yWCV7JPCTHCJut8whOjARd7pwROFDQ');
	var json = JSON.parse(resp);
	return json.rows;
}



function getNoDataColor(){
   return '#DBDDE1';
}
function getColor(conditions) {
   //return 'green';
	conditions = Math.round( conditions );
//	if (conditions == 0)
//		return '#ffffff';
//	else
   if (conditions == 1)
		return '#B4B9E0';
	else if (conditions == 2)
		return '#8E95DF';
	else if (conditions == 3)
		return '#6771DF';
	else if (conditions == 4)
		return '#414DDE';
	else if (conditions == 5)
		return '#1B2ADE';
   return getNoDataColor();
}

function getConditions(mountains) {
	var d = new Date();
	d.setDate(d.getDate() - 7);
	var curr_date = d.getDate() - 7;
	var resp = httpGet('http://www.goryidoliny.hostings.pl/powder/detailedConditions.php?mountains=' + mountains);
	var json = JSON.parse(resp);
   
   var table = $('<table></table>').addClass('bordered');
	var head = $('<thead><tr><th>Date</th><th>Overall</th><th>Nick</th><th>Depth</th><th>Type</th><th>Trail</th><th>Aval</th><th>Description</th><tr></thead>');
	table.append(head);
   
	for ( var i = 0; i < json.response.length; i++) {
      var tr = $('<tr></tr>');
      tr.append($('<td></td>').append(document.createTextNode(json.response[i].date)));
      tr.append($('<td></td>').append(document.createTextNode(translateConditions(json.response[i].conditions))));
      tr.append($('<td></td>').append(document.createTextNode(json.response[i].user)));
		tr.append($('<td></td>').append(document.createTextNode(json.response[i].snowDepth)));
      tr.append($('<td></td>').append(document.createTextNode(json.response[i].snowType)));
		tr.append($('<td></td>').append(document.createTextNode(json.response[i].trail)));
      tr.append($('<td></td>').append(document.createTextNode(json.response[i].avalancheRisk)));
      tr.append($('<td></td>').append(document.createTextNode(json.response[i].comment)));
		table.append(tr);
	}
	return table;
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
   $('#snowtype').append($('<option/>').val(i).text("powder"));
   $('#snowtype').append($('<option/>').val(i).text("crud"));
   $('#snowtype').append($('<option/>').val(i).text("groomed"));
   $('#snowtype').append($('<option/>').val(i).text("ice"));
   $('#snowtype').append($('<option/>').val(i).text("artificial"));
   $('#snowtype').append($('<option/>').val(i).text("other"));
                  
                  
   $('#avalancheRisk').append($('<option/>').val(i).text("5 Extreme"));
   $('#avalancheRisk').append($('<option/>').val(i).text("4 High"));
   $('#avalancheRisk').append($('<option/>').val(i).text("3 Considerable"));
   $('#avalancheRisk').append($('<option/>').val(i).text("2 Moderate"));
   $('#avalancheRisk').append($('<option/>').val(i).text("1 Low"));
   $('#avalancheRisk').append($('<option/>').val(i).text("0 Not applicable"));
                  
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
                                                mountainsName: json.response[i].mountains
                                                });
      
      mountainRange.setMap(map);
      google.maps.event.addListener(mountainRange, 'click', function (event) {
                                       $('#visualization').empty();
                                       var leftPanel = $('#visualization').append(getConditions(this.mountainsName));
                                    });
   }
	createWarunLegend();
}

google.maps.event.addDomListener(window, 'load', initialize);