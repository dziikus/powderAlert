<?php
	$username="dzikus_powder";
	$password="powder";
	$database="dzikus_powder";
	mysql_connect(localhost,$username,$password);
	@mysql_select_db($database) or die( "Unable to select database");
	$query="SELECT * FROM mountains";
	
	$result=mysql_query($query) or die(mysql_error());;
	
	print "{ \"response\":[";
	while($row = mysql_fetch_array($result)){
		print "{ \"mountains\":\"";
		print $row['mountains'];
		print "\",\"kml\":\"";
		print $row['kml'];
		print "\"}";
	}
	print "]}";
    mysql_close();
?>