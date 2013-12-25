<?php
	$username="dzikus_powder";
	$password="powder";
	$database="dzikus_powder";
	mysql_connect(localhost,$username,$password);
	@mysql_select_db($database) or die( "Unable to select database");

	$query="INSERT INTO `dzikus_powder`.`conditions` (`mountains`, `date`, `conditions`, `user`, `comment`, `trail`, `snowDepth`, `snowType`, `avalancheRisk`) VALUES ('". $_GET['mountains'] . "', '" .$_GET['date'] . "', '" .$_GET['conditions'] . "', '" .$_GET['user'] . "', '" .$_GET['comment'] . "', '" .$_GET['trail']
   . "', '" .$_GET['snowDepth'] . "', '" .$_GET['snowType']. "', '" .$_GET['avalancheRisk']. "')";
	print $query;
	$result=mysql_query($query) or die(mysql_error());;
	
	mysql_close();
?>