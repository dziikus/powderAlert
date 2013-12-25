<?php
	header("Content-type: text/plain");
	header("Content-Disposition: attachment; filename=test.txt");
	$username="dzikus_powder";
	$password="powder";
	$database="dzikus_powder";
	mysql_connect(localhost,$username,$password);
	@mysql_select_db($database) or die( "Unable to select database");
	$query="SELECT * FROM mountains where mountains='". $_GET['mountains'] . "'";
	$result=mysql_query($query) or die(mysql_error());
	$row = mysql_fetch_array($result);
	echo $row['kml'];
	mysql_close();
?>