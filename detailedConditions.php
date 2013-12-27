<?php
	$username="dzikus_powder";
	$password="powder";
	$database="dzikus_powder";
	mysql_connect(localhost,$username,$password);
	@mysql_select_db($database) or die( "Unable to select database");
	$query="SELECT * FROM conditions where date>" . $_GET['date'] . " and mountains='" . $_GET['mountains'] . "'";
	$result=mysql_query($query) or die(mysql_error());;
	print "{ \"response\":[";
	$firstRow = true;
	while($row = mysql_fetch_array($result)){
		if(!$firstRow){
			print ",";
		}
		print "{ \"mountains\":\"";
		print $row['mountains'];
		print "\",\"conditions\":\"";
		print $row['conditions'];
		print "\",\"user\":\"";
		print $row['user'];
		print "\",\"date\":\"";
		print $row['date'];
		print "\",\"comment\":\"";
		print $row['comment'];
		print "\"}";
		$firstRow=false;
	}
	print "]}";
	mysql_close();
?>