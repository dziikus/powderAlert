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
		return 'bad';
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

function getColor(conditions) {
	conditions = Math.round( conditions );
	if (conditions == 0)
		return '#00D299';
	else if (conditions == 0)
		return '#00C7CE';
	else if (conditions == 1)
		return '#0087CA';
	else if (conditions == 2)
		return '#0049C6';
	else if (conditions == 3)
		return '#000DC2';
	else if (conditions == 4)
		return '#2B00BF';
	else if (conditions == 5)
		return '#D50600';
   return '#00D299';
}

function getConditions(mountains) {
	var d = new Date();
	d.setDate(d.getDate() - 7);
	var curr_date = d.getDate() - 7;
	var resp = httpGet('http://www.goryidoliny.hostings.pl/powder/detailedConditions.php?mountains=' + mountains);
   //	var resp = httpGet('https://www.googleapis.com/fusiontables/v1/query?sql=SELECT%20*%20FROM%201zn137hapjSbTyLLnB92wedOA8ehvookUF-dZlgE%20WHERE%20mountains=\''
   //			+ mountains
   //			+ '\'%20ORDER%20BY%20postDate%20DESC&key=AIzaSyAm9yWCV7JPCTHCJut8whOjARd7pwROFDQ');
	var json = JSON.parse(resp);
   
	var table = document.createElement('table');
	table.className = "bordered";
	var head = document.createElement('thead');
	var headTr = document.createElement('tr');
	var headTh = document.createElement('th');
	var text = document.createTextNode("Date");
	headTh.appendChild(text);
	headTr.appendChild(headTh);
   
	headTh = document.createElement('th');
	text = document.createTextNode("Overall");
	headTh.appendChild(text);
	headTr.appendChild(headTh);
   
	headTh = document.createElement('th');
	text = document.createTextNode("Nick");
	headTh.appendChild(text);
	headTr.appendChild(headTh);
	head.appendChild(headTr);
	table.appendChild(head);
   
	for ( var i = 0; i < json.response.length; i++) {
		var tr = document.createElement('tr');
      
		var td1 = document.createElement('td');
		var td2 = document.createElement('td');
		var td3 = document.createElement('td');
      
		var text1 = document.createTextNode(json.response[i].date);
		var text2 = document
      .createTextNode(translateConditions(json.response[i].conditions));
		var text3 = document.createTextNode(json.response[i].user);
      
		td1.appendChild(text1);
		td2.appendChild(text2);
		td3.appendChild(text3);
		tr.appendChild(td1);
		tr.appendChild(td2);
		tr.appendChild(td3);
      
		table.appendChild(tr);
	}
	return table;
}
function assignStyles(styles) {
	//var json = { "response":[{ "mountains":"gorce","conditions":"3.0000"},{ "mountains":"tatry","conditions":"5.0000"}]}
	var resp = httpGet('http://www.goryidoliny.hostings.pl/powder/getAVGconditions.php');
	//var json;
   
   // httpGet('https://www.googleapis.com/fusiontables/v1/query?sql=SELECT%20mountains,MAXIMUM(Warun)%20FROM%201zn137hapjSbTyLLnB92wedOA8ehvookUF-dZlgE%20GROUP%20BY%20mountains%20ORDER%20BY%20postDate%20DESC&key=AIzaSyAm9yWCV7JPCTHCJut8whOjARd7pwROFDQ');
	var json = JSON.parse(resp);
   
	for ( var i = 0; i < json.response.length; i++) {
		var color = getColor(json.response[i].conditions);
		var mountains = json.response[i].mountains;
		styles.push({ where : "mountains='" + mountains + "'", polygonOptions : { fillColor : color } } );
	}
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
   $('button').on('click', function() {
      $(function() {
        $("#dialog").dialog({
                            modal : true,
                            buttons : {
                            "Add" : function() {
                            var now = $.datepicker.formatDate('yy-mm-dd', new Date());
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

function initialize() {
	var mapOptions = {
		zoom : 9,
		center : new google.maps.LatLng(49.397, 20.644),
		mapTypeId : google.maps.MapTypeId.ROADMAP
	};
	map = new google.maps.Map(document.getElementById('map-canvas'), mapOptions);
   
	layer = new google.maps.FusionTablesLayer({
      query : {
      select : 'geometry',
      from : '1zdMS8pSrXcX7sw5QT4uzTSXo3fu7oP8II8n2QYw'
      }
      });
	var mapStyles = new Array();
	assignStyles(mapStyles);
	layer.set('styles', mapStyles);
   
	google.maps.event.addListener(layer, 'click', function(e) {
      var leftPanel = document.getElementById('visualization');
      while (leftPanel.childNodes.length >= 1) {
         leftPanel.removeChild(leftPanel.firstChild);
      }
      leftPanel.appendChild(getConditions(e.row['mountains'].value));
      // Change the content of the InfoWindow
      e.infoWindowHtml = e.row['mountains'].value;
      
   });
	createWarunLegend();
	layer.setMap(map);
}

google.maps.event.addDomListener(window, 'load', initialize);