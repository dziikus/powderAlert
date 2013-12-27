<?php
	$username="dzikus_powder";
	$password="powder";
	$database="dzikus_powder";
	mysql_connect(localhost,$username,$password);
	@mysql_select_db($database) or die( "Unable to select database");
   $date = date('Y/m/d', mktime(0, 0, 0, date('m'), date('d') - 5, date('Y')));
	$query="SELECT mountains, avg(conditions) cond FROM conditions where date>'" . $date . "' group by mountains";
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
