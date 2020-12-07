<?php

$myconn = new mysqli("localhost","r4dhir","VoyFram5","r4dhir");

if ($myconn -> connect_error)
{
	echo "Connection Failed:" . $myconn->connect_error;
	exit();
}


$id = $_POST['id'];
$bought = $_POST['bought'];
$setCommand = "UPDATE Products SET Qty=Qty-". $bought . " WHERE id='" . $id . "'";
mysqli_query($myconn, $setCommand);

?>