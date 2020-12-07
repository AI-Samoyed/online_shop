<?php

        $servername = "localhost";
        $username = "r4dhir";
        $password = "VoyFram5";
        $dbname = "r4dhir";

        //Establish connection with database
        $conn = new mysqli($servername, $username, $password, $dbname);

        //Check the connection
        if ($conn->connect_error) {
            die("Connection failed: " . $conn->connect_error);
        }

        $id = $_POST['id'];
        $bought = $_POST['bought'];
        $setCommand = "UPDATE Products SET Qty=Qty-". $bought . " WHERE id='" . $id . "'";
        mysqli_query($myconn, $setCommand);

?>