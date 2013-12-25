<?php
	$username="dzikus_powder";
	$password="powder";
	$database="dzikus_powder";
	mysql_connect(localhost,$username,$password);
	@mysql_select_db($database) or die( "Unable to select database");
	$query="SELECT mountains, avg(conditions) cond FROM conditions where date>" . $_GET['date'] . " group by mountains";
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
		print $row['cond'];
		print "\"}";
		$firstRow=false;
	}
	print "]}";
	mysql_close();
?>
